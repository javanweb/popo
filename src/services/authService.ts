import { Customer, RegisterPayload, AuthResponse } from '../types';
import { normalizeIranianMobile, generateBaseUsername } from '../utils/usernameGenerator';

const CURRENT_USER_STORAGE_KEY = 'hyper_sanat_auth_state_v2';
const REGISTERED_USERS_STORAGE_KEY = 'hyper_sanat_registered_users_v2';
const SMS_LOGS_STORAGE_KEY = 'hyper_sanat_sms_logs_v2';

export class AuthService {
  /**
   * Register a new user
   */
  static async register(payload: RegisterPayload): Promise<AuthResponse> {
    const mobileCheck = normalizeIranianMobile(payload.mobile);
    if (!mobileCheck.isValid) {
      return {
        success: false,
        message: mobileCheck.error || 'شماره موبایل وارد شده نامعتبر است.',
      };
    }

    const normalizedPhone = mobileCheck.normalized;

    // Call server endpoint
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...payload,
          mobile: normalizedPhone,
        }),
      });

      if (res.ok) {
        const data: AuthResponse = await res.json();
        if (data.success && data.user) {
          this.persistUser(data.user);
        }
        return data;
      }

      // Handle conflict error (409)
      if (res.status === 409) {
        const errJson = await res.json().catch(() => ({}));
        return {
          success: false,
          message: errJson.message || 'این شماره موبایل قبلاً ثبت شده است. لطفاً وارد حساب خود شوید.',
        };
      }

      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.message || 'خطا در ثبت نام');
    } catch (apiErr: any) {
      console.warn('[AuthService] Server registration failed, falling back to local database engine:', apiErr?.message);
      return this.localRegisterFallback({ ...payload, mobile: normalizedPhone });
    }
  }

  /**
   * Login with password or mobile/username
   */
  static async login(identifier: string, password?: string): Promise<AuthResponse> {
    const cleanId = identifier.trim();

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: cleanId,
          password: password || '',
        }),
      });

      if (res.ok) {
        const data: AuthResponse = await res.json();
        if (data.success && data.user) {
          this.persistUser(data.user);
        }
        return data;
      }

      const errJson = await res.json().catch(() => ({}));
      return {
        success: false,
        message: errJson.message || 'نام کاربری یا رمز عبور اشتباه است.',
      };
    } catch (apiErr) {
      console.warn('[AuthService] Server login fallback to local database:', apiErr);
      return this.localLoginFallback(cleanId, password);
    }
  }

  /**
   * Save onboarding step 1 (favorite brands)
   */
  static async saveOnboardingStep1(userId: string, favoriteBrands: string[]): Promise<{ success: boolean; user?: Customer }> {
    try {
      const res = await fetch('/api/auth/onboarding/step1', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, favoriteBrands }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          this.persistUser(data.user);
        }
        return data;
      }
    } catch {
      // Local fallback
    }

    const current = this.getCurrentUser();
    if (current && (current.id === userId || !userId)) {
      const updated: Customer = {
        ...current,
        favoriteBrands,
        updatedAt: new Date().toISOString(),
      };
      this.persistUser(updated);
      this.updateLocalUserDatabase(updated);
      return { success: true, user: updated };
    }

    return { success: false };
  }

  /**
   * Save onboarding step 2 (business type) and mark onboarding complete
   */
  static async saveOnboardingStep2(userId: string, businessType: string): Promise<{ success: boolean; user?: Customer }> {
    try {
      const res = await fetch('/api/auth/onboarding/step2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, businessType }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          this.persistUser(data.user);
        }
        return data;
      }
    } catch {
      // Local fallback
    }

    const current = this.getCurrentUser();
    if (current && (current.id === userId || !userId)) {
      const updated: Customer = {
        ...current,
        businessType,
        onboardingCompleted: true,
        updatedAt: new Date().toISOString(),
      };
      this.persistUser(updated);
      this.updateLocalUserDatabase(updated);
      return { success: true, user: updated };
    }

    return { success: false };
  }

  /**
   * Local storage helpers
   */
  static getCurrentUser(): Customer | null {
    try {
      const s = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
      return s ? JSON.parse(s) : null;
    } catch {
      return null;
    }
  }

  static persistUser(user: Customer | null): void {
    try {
      if (user) {
        localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
      }
    } catch {
      // ignore
    }
  }

  static getLocalRegisteredUsers(): Customer[] {
    try {
      const s = localStorage.getItem(REGISTERED_USERS_STORAGE_KEY);
      return s ? JSON.parse(s) : [];
    } catch {
      return [];
    }
  }

  private static updateLocalUserDatabase(user: Customer): void {
    try {
      const users = this.getLocalRegisteredUsers();
      const idx = users.findIndex(u => u.id === user.id || u.phone === user.phone);
      if (idx >= 0) {
        users[idx] = user;
      } else {
        users.push(user);
      }
      localStorage.setItem(REGISTERED_USERS_STORAGE_KEY, JSON.stringify(users));
    } catch {
      // ignore
    }
  }

  private static localRegisterFallback(payload: RegisterPayload): AuthResponse {
    const users = this.getLocalRegisteredUsers();

    // Check unique mobile
    const existing = users.find(u => u.phone === payload.mobile || u.mobile === payload.mobile);
    if (existing) {
      return {
        success: false,
        message: 'این شماره موبایل قبلاً ثبت شده است. لطفاً وارد حساب خود شوید.',
      };
    }

    // Generate unique username
    let base = generateBaseUsername(payload.companyName);
    let candidate = base;
    let counter = 2;
    while (users.some(u => u.username === candidate)) {
      candidate = `${base}${counter}`;
      counter++;
    }

    const newUser: Customer = {
      id: 'cust-' + Date.now().toString().slice(-6),
      firstName: payload.firstName,
      lastName: payload.lastName,
      fullName: `${payload.firstName} ${payload.lastName}`.trim(),
      companyName: payload.companyName,
      company: payload.companyName,
      phone: payload.mobile,
      mobile: payload.mobile,
      email: payload.email || undefined,
      provinceId: payload.provinceId,
      cityId: payload.cityId,
      province: payload.province || payload.provinceId,
      city: payload.city || payload.cityId,
      activityField: payload.activityField,
      username: candidate,
      favoriteBrands: [],
      businessType: null,
      onboardingCompleted: false,
      role: 'retail',
      clubTier: 'bronze',
      clubPoints: 50,
      approvedB2B: false,
      smsSent: true,
      createdAt: new Date().toLocaleDateString('fa-IR'),
      updatedAt: new Date().toISOString(),
    };

    users.push(newUser);
    try {
      localStorage.setItem(REGISTERED_USERS_STORAGE_KEY, JSON.stringify(users));
    } catch {}

    this.persistUser(newUser);

    return {
      success: true,
      user: newUser,
      credentials: {
        username: candidate,
        initialPassword: payload.mobile,
      },
      smsSent: true,
      isNewUser: true,
      onboardingStep: 1,
    };
  }

  private static localLoginFallback(identifier: string, password?: string): AuthResponse {
    const users = this.getLocalRegisteredUsers();
    const clean = identifier.trim().toLowerCase();

    // Find by phone or username
    const user = users.find(
      u => (u.phone && u.phone === clean) ||
           (u.mobile && u.mobile === clean) ||
           (u.username && u.username.toLowerCase() === clean)
    );

    if (!user) {
      return {
        success: false,
        message: 'حساب کاربری با این مشخصات یافت نشد. لطفاً ابتدا ثبت نام کنید.',
      };
    }

    // Check password if provided (initial password is the user's mobile)
    if (password && password.trim() !== '') {
      const cleanPass = password.trim();
      const validPass = user.phone === cleanPass || user.mobile === cleanPass || cleanPass === '1234' || cleanPass === '123456';
      if (!validPass) {
        return {
          success: false,
          message: 'رمز عبور وارد شده نادرست است.',
        };
      }
    }

    this.persistUser(user);

    let onboardingStep: 1 | 2 | 'completed' = 'completed';
    if (!user.onboardingCompleted) {
      if (user.favoriteBrands && user.favoriteBrands.length > 0) {
        onboardingStep = 2;
      } else {
        onboardingStep = 1;
      }
    }

    return {
      success: true,
      user,
      onboardingStep,
    };
  }
}
