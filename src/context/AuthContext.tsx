import React, { createContext, useContext, useState, useEffect } from 'react';
import { Customer, UserRole, PriceTiers, Address, RegisterPayload, AuthResponse, AuthCredentials } from '../types';
import { MOCK_CUSTOMERS } from '../data/mockData';
import { AuthService } from '../services/authService';

interface AuthContextType {
  currentUser: Customer | null;
  activeRole: UserRole;
  priceLayer: keyof PriceTiers;
  roleTitle: string;
  isDealer?: boolean;
  isAuthModalOpen: boolean;
  authModalInitialView: 'login' | 'register';
  welcomeMessage: string | null;
  latestCredentials: AuthCredentials | null;
  openAuthModal: (redirectPath?: string, initialView?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  clearWelcomeMessage: () => void;
  setLatestCredentials: (creds: AuthCredentials | null) => void;
  registerUser: (payload: RegisterPayload) => Promise<AuthResponse>;
  loginWithPassword: (identifier: string, password: string) => Promise<AuthResponse>;
  loginWithOtp: (phone: string, fullName?: string, companyName?: string) => { isNewUser: boolean };
  saveOnboardingStep1: (brands: string[]) => Promise<boolean>;
  saveOnboardingStep2: (businessType: string) => Promise<boolean>;
  loginAs: (role: UserRole) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  addClubPoints: (pts: number) => void;
  updateProfile: (data: Partial<Customer>) => void;
  activateDealerRole: () => void;
  // Address CRUD
  addAddress: (address: Omit<Address, 'id'>) => Address;
  updateAddress: (id: string, address: Partial<Address>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  getUserAddresses: () => Address[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'hyper_sanat_auth_state_v2';
const USERS_STORAGE_KEY = 'hyper_sanat_registered_users_v2';
const CREDS_STORAGE_KEY = 'hyper_sanat_latest_credentials_v2';

const INITIAL_DEFAULT_ADDRESSES: Address[] = [
  {
    id: 'addr-1',
    title: 'انبار مرکزی کارخانه کاشی ستاره میبد',
    recipientName: 'مهندس محمدرضا زارع',
    recipientPhone: '09131512345',
    province: 'یزد',
    city: 'میبد',
    fullAddress: 'شهرک صنعتی جهان‌آباد، بلوار تلاش، روبروی نیروگاه، درب شماره ۳ خط تولید کوره',
    postalCode: '8961123456',
    isDefault: true,
  },
  {
    id: 'addr-2',
    title: 'دفتر مرکزی بازرگانی یزد',
    recipientName: 'محمدرضا زارع',
    recipientPhone: '09131512345',
    province: 'یزد',
    city: 'یزد',
    fullAddress: 'بلوار جمهوری اسلامی، بعد از بیمارستان افشار، جنب بانک سپه',
    postalCode: '8917987654',
    isDefault: false,
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<Customer | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return null;
  });

  const [activeRole, setActiveRole] = useState<UserRole>(() => {
    return currentUser ? currentUser.role : 'guest';
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalInitialView, setAuthModalInitialView] = useState<'login' | 'register'>('login');
  const [redirectOnLogin, setRedirectOnLogin] = useState<string | null>(null);
  const [welcomeMessage, setWelcomeMessage] = useState<string | null>(null);
  const [latestCredentials, setLatestCredentialsState] = useState<AuthCredentials | null>(() => {
    try {
      const saved = sessionStorage.getItem(CREDS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const setLatestCredentials = (creds: AuthCredentials | null) => {
    setLatestCredentialsState(creds);
    try {
      if (creds) {
        sessionStorage.setItem(CREDS_STORAGE_KEY, JSON.stringify(creds));
      } else {
        sessionStorage.removeItem(CREDS_STORAGE_KEY);
      }
    } catch {}
  };

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(currentUser));
        setActiveRole(currentUser.role);
      } else {
        localStorage.removeItem(STORAGE_KEY);
        setActiveRole('guest');
      }
    } catch {
      // ignore
    }
  }, [currentUser]);

  const openAuthModal = (redirectPath?: string, initialView?: 'login' | 'register') => {
    if (redirectPath) setRedirectOnLogin(redirectPath);
    if (initialView) setAuthModalInitialView(initialView);
    else setAuthModalInitialView('login');
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setRedirectOnLogin(null);
  };

  const clearWelcomeMessage = () => {
    setWelcomeMessage(null);
  };

  /**
   * Register User with Full Flow
   */
  const registerUser = async (payload: RegisterPayload): Promise<AuthResponse> => {
    const result = await AuthService.register(payload);
    if (result.success && result.user) {
      const userWithAddr: Customer = {
        ...result.user,
        addresses: result.user.addresses && result.user.addresses.length > 0 ? result.user.addresses : INITIAL_DEFAULT_ADDRESSES,
      };
      setCurrentUser(userWithAddr);
      setActiveRole(userWithAddr.role);
      if (result.credentials) {
        setLatestCredentials(result.credentials);
      }
      setWelcomeMessage(`خوش آمدید، ${userWithAddr.fullName}! حساب کاربری شما با موفقیت ایجاد گردید.`);
    }
    return result;
  };

  /**
   * Login with Identifier & Password
   */
  const loginWithPassword = async (identifier: string, password: string): Promise<AuthResponse> => {
    const result = await AuthService.login(identifier, password);
    if (result.success && result.user) {
      const userWithAddr: Customer = {
        ...result.user,
        addresses: result.user.addresses && result.user.addresses.length > 0 ? result.user.addresses : INITIAL_DEFAULT_ADDRESSES,
      };
      setCurrentUser(userWithAddr);
      setActiveRole(userWithAddr.role);
      setWelcomeMessage(`خوش آمدید، ${userWithAddr.fullName}`);
    }
    return result;
  };

  /**
   * Save Onboarding Step 1 (Favorite Brands)
   */
  const saveOnboardingStep1 = async (brands: string[]): Promise<boolean> => {
    if (!currentUser) return false;
    const res = await AuthService.saveOnboardingStep1(currentUser.id, brands);
    if (res.success && res.user) {
      setCurrentUser(prev => prev ? { ...prev, ...res.user, favoriteBrands: brands } : null);
      return true;
    }
    return false;
  };

  /**
   * Save Onboarding Step 2 (Business Type & Complete)
   */
  const saveOnboardingStep2 = async (businessType: string): Promise<boolean> => {
    if (!currentUser) return false;
    const res = await AuthService.saveOnboardingStep2(currentUser.id, businessType);
    if (res.success && res.user) {
      setCurrentUser(prev => prev ? { ...prev, ...res.user, businessType, onboardingCompleted: true } : null);
      setLatestCredentials(null);
      return true;
    }
    return false;
  };

  const loginWithOtp = (phone: string, fullName?: string, companyName?: string): { isNewUser: boolean } => {
    const normalizedPhone = phone.trim();
    let existingUser = MOCK_CUSTOMERS.find(c => c.phone === normalizedPhone);

    let isNew = false;

    if (!existingUser) {
      try {
        const storedUsersStr = localStorage.getItem(USERS_STORAGE_KEY);
        const storedUsers: Customer[] = storedUsersStr ? JSON.parse(storedUsersStr) : [];
        existingUser = storedUsers.find(u => u.phone === normalizedPhone || u.mobile === normalizedPhone);
      } catch {
        // ignore
      }
    }

    if (existingUser) {
      // Existing user login
      const loggedUser = {
        ...existingUser,
        addresses: existingUser.addresses && existingUser.addresses.length > 0 ? existingUser.addresses : INITIAL_DEFAULT_ADDRESSES,
      };
      setCurrentUser(loggedUser);
      setActiveRole(loggedUser.role);
      setWelcomeMessage(`خوش آمدید، ${loggedUser.fullName || 'همکار گرامی'}`);
    } else {
      // New user auto registration
      isNew = true;
      const newUser: Customer = {
        id: 'cust-' + Date.now().toString().slice(-6),
        firstName: fullName ? fullName.split(' ')[0] : 'مشتری',
        lastName: fullName ? fullName.split(' ').slice(1).join(' ') : normalizedPhone.slice(-4),
        fullName: fullName || `مشتری ${normalizedPhone.slice(-4)}`,
        companyName: companyName || '',
        phone: normalizedPhone,
        mobile: normalizedPhone,
        role: 'retail',
        clubTier: 'bronze',
        clubPoints: 50, // ۵۰ امتیاز خوش‌آمدگویی
        approvedB2B: false,
        city: 'یزد',
        province: 'یزد',
        addresses: INITIAL_DEFAULT_ADDRESSES,
        onboardingCompleted: true,
        createdAt: new Date().toLocaleDateString('fa-IR'),
      };

      try {
        const storedUsersStr = localStorage.getItem(USERS_STORAGE_KEY);
        const storedUsers: Customer[] = storedUsersStr ? JSON.parse(storedUsersStr) : [];
        storedUsers.push(newUser);
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(storedUsers));
      } catch {
        // ignore
      }

      setCurrentUser(newUser);
      setActiveRole('retail');
      setWelcomeMessage('خوش آمدید! ۵۰ امتیاز هدیه خوش‌آمدگویی به حساب شما افزوده شد.');
    }

    setIsAuthModalOpen(false);

    if (redirectOnLogin) {
      window.location.hash = '';
    }

    return { isNewUser: isNew };
  };

  const loginAs = (role: UserRole) => {
    if (role === 'guest') {
      setCurrentUser(null);
      setActiveRole('guest');
      return;
    }

    if (role === 'admin') {
      const adminUser: Customer = {
        id: 'admin-1',
        fullName: 'مدیریت بازرگانی تسمه اطلس',
        companyName: 'دفتر مرکزی یزد',
        phone: '035-37254000',
        mobile: '09131512345',
        email: 'admin@atlassanat.ir',
        role: 'admin',
        clubTier: 'gold',
        clubPoints: 5000,
        approvedB2B: true,
        city: 'یزد',
        province: 'یزد',
        addresses: INITIAL_DEFAULT_ADDRESSES,
        onboardingCompleted: true,
        createdAt: '1366/01/01',
      };
      setCurrentUser(adminUser);
      setActiveRole('admin');
      return;
    }

    const mock = MOCK_CUSTOMERS.find(c => c.role === role) || MOCK_CUSTOMERS[0];
    const userWithAddresses: Customer = {
      ...mock,
      addresses: mock.addresses && mock.addresses.length > 0 ? mock.addresses : INITIAL_DEFAULT_ADDRESSES,
      onboardingCompleted: true,
    };
    setCurrentUser(userWithAddresses);
    setActiveRole(role);
  };

  const logout = () => {
    setCurrentUser(null);
    setActiveRole('guest');
    setLatestCredentials(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const switchRole = (role: UserRole) => {
    loginAs(role);
  };

  const addClubPoints = (pts: number) => {
    if (!currentUser) return;
    setCurrentUser(prev => prev ? { ...prev, clubPoints: Math.max(0, prev.clubPoints + pts) } : null);
  };

  const updateProfile = (data: Partial<Customer>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...data };
    setCurrentUser(updated);
  };

  const activateDealerRole = () => {
    if (currentUser) {
      const updatedUser: Customer = {
        ...currentUser,
        role: 'dealer',
        approvedB2B: true,
        companyName: currentUser.companyName || 'فروشگاه و نمایندگی پخش قطعات صنعتی',
      };
      setCurrentUser(updatedUser);
      setActiveRole('dealer');
      setWelcomeMessage('پنل نمایندگی و پخش هایپر صنعت اطلس برای شما با موفقیت فعال شد.');
    } else {
      loginAs('dealer');
      setWelcomeMessage('پنل نمایندگی و پخش هایپر صنعت اطلس فعال شد.');
    }
  };

  const getUserAddresses = (): Address[] => {
    if (currentUser?.addresses && currentUser.addresses.length > 0) {
      return currentUser.addresses;
    }
    return INITIAL_DEFAULT_ADDRESSES;
  };

  const addAddress = (addressData: Omit<Address, 'id'>): Address => {
    const newAddr: Address = {
      ...addressData,
      id: 'addr-' + Date.now(),
      isDefault: addressData.isDefault ?? false,
    };

    if (currentUser) {
      const currentList = getUserAddresses();
      const updatedList: Address[] = newAddr.isDefault
        ? [...currentList.map(a => ({ ...a, isDefault: false })), newAddr]
        : [...currentList, newAddr];
      updateProfile({ addresses: updatedList });
    }
    return newAddr;
  };

  const updateAddress = (id: string, addressData: Partial<Address>) => {
    if (!currentUser) return;
    const currentList = getUserAddresses();
    let updatedList = currentList.map(a => (a.id === id ? { ...a, ...addressData } : a));
    if (addressData.isDefault) {
      updatedList = updatedList.map(a => ({ ...a, isDefault: a.id === id }));
    }
    updateProfile({ addresses: updatedList });
  };

  const deleteAddress = (id: string) => {
    if (!currentUser) return;
    const currentList = getUserAddresses();
    const updatedList = currentList.filter(a => a.id !== id);
    if (updatedList.length > 0 && !updatedList.some(a => a.isDefault)) {
      updatedList[0].isDefault = true;
    }
    updateProfile({ addresses: updatedList });
  };

  const setDefaultAddress = (id: string) => {
    if (!currentUser) return;
    const currentList = getUserAddresses();
    const updatedList = currentList.map(a => ({ ...a, isDefault: a.id === id }));
    updateProfile({ addresses: updatedList });
  };

  let priceLayer: keyof PriceTiers = 'retail';
  if (activeRole === 'wholesale') priceLayer = 'wholesale';
  else if (activeRole === 'dealer') priceLayer = 'dealer';
  else if (activeRole === 'admin') priceLayer = 'dealer';
  else priceLayer = 'retail';

  const roleTitles: Record<UserRole, string> = {
    guest: 'مشتری عزیز (استعلام قیمت)',
    retail: 'مشتری گرامی بازرگانی اطلس',
    wholesale: 'مشتری صنعتی و همکار معتبر',
    dealer: 'نمایندگی رسمی و شبکه پخش اطلس',
    admin: 'مدیر ارشد سامانه بازرگانی اطلس',
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        activeRole,
        priceLayer,
        roleTitle: roleTitles[activeRole],
        isDealer: activeRole === 'dealer',
        isAuthModalOpen,
        authModalInitialView,
        welcomeMessage,
        latestCredentials,
        openAuthModal,
        closeAuthModal,
        clearWelcomeMessage,
        setLatestCredentials,
        registerUser,
        loginWithPassword,
        loginWithOtp,
        saveOnboardingStep1,
        saveOnboardingStep2,
        loginAs,
        logout,
        switchRole,
        addClubPoints,
        updateProfile,
        activateDealerRole,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
        getUserAddresses,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
