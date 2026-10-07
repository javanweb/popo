import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Modal } from '../ui/Modal';
import { AuthVisualSidePanel } from './AuthVisualSidePanel';
import { STORE_ASSETS } from '../../assets/images';
import {
  Phone,
  Lock,
  User,
  Eye,
  EyeOff,
  Building2,
  AlertCircle,
  UserPlus,
  ShieldCheck,
  Sparkles,
  Mail,
  MapPin,
  Briefcase,
  Search,
  Copy,
  Check,
  ChevronLeft,
  ArrowRight,
  Clock,
  KeyRound,
  CheckCircle2,
  X,
  MessageSquare,
  Globe,
  Truck,
  Factory,
  ChevronDown,
  Gift,
  Zap,
} from 'lucide-react';
import { toPersianDigits } from '../../utils/formatters';
import { normalizeIranianMobile, generateBaseUsername } from '../../utils/usernameGenerator';
import { IRAN_PROVINCES, ACTIVITY_FIELDS, BUSINESS_TYPES } from '../../data/iranLocations';
import { BRANDS } from '../../data/brands';
import { UserRole } from '../../types';

type AuthViewMode =
  | 'login_password'
  | 'login_otp'
  | 'register'
  | 'credentials'
  | 'onboarding_brands'
  | 'onboarding_business';

export const AuthModal: React.FC = () => {
  const navigate = useNavigate();
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalInitialView,
    loginWithPassword,
    loginWithOtp,
    loginAs,
    registerUser,
    saveOnboardingStep1,
    saveOnboardingStep2,
    currentUser,
    latestCredentials,
  } = useAuth();

  // Active View
  const [view, setView] = useState<AuthViewMode>('login_password');

  // Login form state
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // OTP login state
  const [otpStep, setOtpStep] = useState<'phone' | 'code'>('phone');
  const [otpPhone, setOtpPhone] = useState('09131512345');
  const [otpCode, setOtpCode] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(120);
  const otpInputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  // Registration form state
  const [fullName, setFullName] = useState('');
  const [regMobile, setRegMobile] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [provinceId, setProvinceId] = useState('yazd');
  const [cityId, setCityId] = useState('yazd-yazd');
  const [activityField, setActivityField] = useState<string>('صنایع کاشی، سرامیک و لعاب');
  const [activitySearch, setActivitySearch] = useState('');
  const [isActivityOpen, setIsActivityOpen] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(true);

  // Onboarding state
  const [selectedBrands, setSelectedBrands] = useState<string[]>(['swr', 'forza']);
  const [brandSearch, setBrandSearch] = useState('');
  const [selectedBusinessType, setSelectedBusinessType] = useState<string>('store');

  // Credentials copy state
  const [copiedField, setCopiedField] = useState<'username' | 'password' | null>(null);
  const [showCredPassword, setShowCredPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showDemoList, setShowDemoList] = useState(false);

  // Quick industry suggestion chips
  const TOP_INDUSTRIES = [
    'صنایع کاشی، سرامیک و لعاب',
    'فولاد، ریخته‌گری و متالورژی',
    'نساجی، بافندگی و ریسندگی',
    'صنایع غذایی و بسته‌بندی',
    'نفت، گاز و پتروشیمی',
    'سیمان، بتن و معدن',
  ];

  // Sync initial view when modal opens
  useEffect(() => {
    if (isAuthModalOpen) {
      if (authModalInitialView === 'register') {
        setView('register');
      } else {
        setView('login_password');
      }
      setErrorMessage('');
    }
  }, [isAuthModalOpen, authModalInitialView]);

  // Timer countdown for OTP
  useEffect(() => {
    let interval: any;
    if (view === 'login_otp' && otpStep === 'code' && timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [view, otpStep, timer]);

  // Location helpers
  const selectedProvince = useMemo(() => {
    return IRAN_PROVINCES.find(p => p.id === provinceId) || IRAN_PROVINCES[0];
  }, [provinceId]);

  const availableCities = selectedProvince ? selectedProvince.cities : [];
  const selectedCity = useMemo(() => {
    return availableCities.find(c => c.id === cityId) || availableCities[0];
  }, [availableCities, cityId]);

  const handleProvinceChange = (newProvId: string) => {
    setProvinceId(newProvId);
    const prov = IRAN_PROVINCES.find(p => p.id === newProvId);
    if (prov && prov.cities.length > 0) {
      setCityId(prov.cities[0].id);
    }
  };

  const usernamePreview = useMemo(() => {
    if (!companyName.trim()) return '';
    return generateBaseUsername(companyName);
  }, [companyName]);

  const regMobileCheck = useMemo(() => {
    if (!regMobile.trim()) return null;
    return normalizeIranianMobile(regMobile.trim());
  }, [regMobile]);

  const filteredActivities = useMemo(() => {
    if (!activitySearch.trim()) return ACTIVITY_FIELDS;
    return ACTIVITY_FIELDS.filter(a =>
      a.toLowerCase().includes(activitySearch.toLowerCase().trim())
    );
  }, [activitySearch]);

  const filteredBrands = useMemo(() => {
    if (!brandSearch.trim()) return BRANDS;
    const q = brandSearch.toLowerCase().trim();
    return BRANDS.filter(
      b => b.name.toLowerCase().includes(q) || b.nameEn.toLowerCase().includes(q)
    );
  }, [brandSearch]);

  const handleCopy = (text: string, field: 'username' | 'password') => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const toggleBrand = (brandId: string) => {
    setSelectedBrands(prev =>
      prev.includes(brandId) ? prev.filter(id => id !== brandId) : [...prev, brandId]
    );
  };

  // OTP box input handling
  const handleOtpBoxChange = (index: number, val: string) => {
    const cleanVal = val.replace(/\D/g, '').slice(-1);
    const newOtp = [...otpCode];
    newOtp[index] = cleanVal;
    setOtpCode(newOtp);

    if (cleanVal && index < 3) {
      otpInputRefs[index + 1].current?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      otpInputRefs[index - 1].current?.focus();
    }
  };

  // 1. Password Login
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!identifier.trim()) {
      setErrorMessage('لطفاً شماره موبایل یا نام کاربری را وارد کنید.');
      return;
    }
    if (!password.trim()) {
      setErrorMessage('لطفاً رمز عبور را وارد کنید.');
      return;
    }

    setLoading(true);
    try {
      const res = await loginWithPassword(identifier.trim(), password.trim());
      if (res.success && res.user) {
        if (!res.user.onboardingCompleted) {
          setView('onboarding_brands');
        } else {
          closeAuthModal();
          navigate('/account');
        }
      } else {
        setErrorMessage(res.message || 'نام کاربری یا رمز عبور واردشده نادرست است.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'خطا در برقراری ارتباط با سرور.');
    } finally {
      setLoading(false);
    }
  };

  // 2. OTP Phone Submit
  const handleOtpPhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const check = normalizeIranianMobile(otpPhone.trim());
    if (!check.isValid) {
      setErrorMessage(check.error || 'شماره موبایل معتبر وارد فرمایید.');
      return;
    }
    setErrorMessage('');
    setOtpStep('code');
    setTimer(120);
    setOtpCode(['', '', '', '']);
    setTimeout(() => {
      otpInputRefs[0].current?.focus();
    }, 150);
  };

  // 3. OTP Code Verify
  const handleOtpCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const combinedCode = otpCode.join('');
    if (combinedCode.length < 4) {
      setErrorMessage('کد تأیید ۴ رقمی را به‌طور کامل وارد کنید.');
      return;
    }
    const check = normalizeIranianMobile(otpPhone);
    loginWithOtp(check.isValid ? check.normalized : otpPhone);
    closeAuthModal();
    navigate('/account');
  };

  // 4. Register Submit
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim() || !companyName.trim()) {
      setErrorMessage('لطفاً نام و نام خانوادگی و نام شرکت/فروشگاه را وارد فرمایید.');
      return;
    }

    const check = normalizeIranianMobile(regMobile);
    if (!check.isValid) {
      setErrorMessage(check.error || 'شماره موبایل وارد شده معتبر نمی‌باشد.');
      return;
    }

    if (regEmail.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(regEmail.trim())) {
        setErrorMessage('فرمت ایمیل وارد شده صحیح نمی‌باشد.');
        return;
      }
    }

    const nameParts = fullName.trim().split(' ');
    const fName = nameParts[0] || fullName.trim();
    const lName = nameParts.slice(1).join(' ') || 'کاربر';

    setLoading(true);
    try {
      const res = await registerUser({
        firstName: fName,
        lastName: lName,
        mobile: check.normalized,
        email: regEmail.trim() || undefined,
        companyName: companyName.trim(),
        provinceId,
        cityId,
        province: selectedProvince.name,
        city: selectedCity?.name || selectedProvince.name,
        activityField,
      });

      if (res.success && res.user) {
        setView('credentials');
      } else {
        setErrorMessage(res.message || 'خطا در ثبت نام.');
        if (res.message?.includes('قبلاً ثبت شده')) {
          setTimeout(() => {
            setIdentifier(check.normalized);
            setView('login_password');
          }, 1800);
        }
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'خطای سرور.');
    } finally {
      setLoading(false);
    }
  };

  // 5. Onboarding Step 1
  const handleStep1Submit = async () => {
    setLoading(true);
    try {
      await saveOnboardingStep1(selectedBrands);
      setView('onboarding_business');
    } catch {
      setView('onboarding_business');
    } finally {
      setLoading(false);
    }
  };

  // 6. Onboarding Step 2
  const handleStep2Submit = async () => {
    setLoading(true);
    try {
      await saveOnboardingStep2(selectedBusinessType);
      closeAuthModal();
      navigate('/account');
    } catch {
      closeAuthModal();
      navigate('/account');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (role: UserRole) => {
    loginAs(role);
    closeAuthModal();
    if (role === 'dealer') navigate('/dealer');
    else if (role === 'admin') navigate('/admin');
    else navigate('/account');
  };

  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;

  return (
    <Modal
      isOpen={isAuthModalOpen}
      onClose={() => {
        closeAuthModal();
        setErrorMessage('');
      }}
      maxWidth="2xl"
      noPadding
      mobileBottomSheet
    >
      <div className="relative flex flex-col md:grid md:grid-cols-12 bg-white min-h-[580px] overflow-hidden text-right">
        {/* ========================================================================= */}
        {/* 📱 ANDROID / MOBILE TOP HERO BANNER (< md viewports)                       */}
        {/* ========================================================================= */}
        <div className="md:hidden relative w-full h-48 bg-[#12161f] text-white overflow-hidden shrink-0 select-none">
          {/* Custom Banner Image based on Active View */}
          <img
            src={
              view === 'register'
                ? STORE_ASSETS.bannerAuthRegister || STORE_ASSETS.authIndustrialHero
                : STORE_ASSETS.bannerAuthLogin || STORE_ASSETS.authIndustrialHero
            }
            alt="صنعت‌پیش"
            className="absolute inset-0 w-full h-full object-cover object-center opacity-50 scale-105 transition-all duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#12161f] via-[#12161f]/60 to-[#12161f]/80" />

          {/* Top Bar Header (Logo, Language, Close) */}
          <div className="relative z-10 p-4 pt-3 flex items-center justify-between">
            {/* Brand Logo & Name */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#E06518] to-[#C95210] flex items-center justify-center font-black text-sm text-white shadow-md shadow-orange-950/40">
                ص
              </div>
              <div className="flex items-center gap-1 font-black text-base tracking-tight text-white">
                <span className="text-[#E06518]">صنعت‌</span>
                <span className="text-slate-100 font-bold">پیش</span>
              </div>
            </div>

            {/* Language Switcher & Close */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-[11px] font-mono text-slate-300 bg-white/10 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                <Globe className="w-3 h-3 text-[#E06518]" />
                <span>FA</span>
              </div>
              <button
                onClick={closeAuthModal}
                className="w-7 h-7 rounded-full bg-black/40 backdrop-blur-md text-white/80 hover:text-white flex items-center justify-center border border-white/10 cursor-pointer"
                aria-label="بستن"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Centered Hero Text & Custom Marketing Copy Requested by User */}
          <div className="relative z-10 px-4 pt-1 pb-4 text-center">
            {/* Promotional Badge */}
            <div
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] text-white font-bold mb-1.5 shadow-2xs"
            >
              {view === 'register' ? (
                <>
                  <Gift className="w-3 h-3 text-[#E06518]" />
                  <span>عضویت در خانواده صنعت‌پیش</span>
                </>
              ) : (
                <>
                  <Zap className="w-3 h-3 text-[#E06518]" />
                  <span>خدمات و استعلام هوشمند صنعت‌پیش</span>
                </>
              )}
            </div>

            <h2 className="text-xl font-black text-white tracking-tight mb-1 text-shadow-sm">
              {view === 'register'
                ? 'به خانواده صنعت‌پیش بپیوندید'
                : view === 'login_otp'
                ? 'ورود با شماره همراه'
                : 'خوش آمدید، به صنعت‌پیش'}
            </h2>
            <p className="text-[11px] text-slate-200 leading-relaxed max-w-xs mx-auto">
              {view === 'register'
                ? 'با ثبت‌نام در سامانه صنعت‌پیش، به قیمت‌های ویژه، مشاوره تخصصی و پیشنهادهای متناسب با نیاز صنعتی خود دسترسی پیدا کنید.'
                : 'وارد حساب کاربری خود شوید و به سفارش‌ها، استعلام‌ها، پیشنهادهای اختصاصی و خدمات هوشمند صنعتی خود دسترسی پیدا کنید.'}
            </p>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: PURE CLEAN WHITE FORM PANEL                                 */}
        {/* ========================================================================= */}
        <div className="col-span-1 md:col-span-7 p-5 sm:p-8 lg:p-10 flex flex-col justify-between relative bg-white order-1 -mt-6 md:mt-0 rounded-t-[32px] md:rounded-t-none z-10 shadow-2xl md:shadow-none">
          {/* Desktop Close button at top-left */}
          <button
            onClick={closeAuthModal}
            className="hidden md:flex absolute top-4 left-4 z-30 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 items-center justify-center transition-colors cursor-pointer"
            aria-label="بستن"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="space-y-4">
            {/* Top Segmented Switcher Tab */}
            {(view === 'login_password' || view === 'login_otp' || view === 'register') && (
              <div className="flex items-center p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200 text-xs font-bold gap-1 mb-2">
                <button
                  type="button"
                  onClick={() => {
                    setView('login_password');
                    setErrorMessage('');
                  }}
                  className={`flex-1 py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    view === 'login_password' || view === 'login_otp'
                      ? 'bg-[#E06518] text-white shadow-sm font-black'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>ورود</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setView('register');
                    setErrorMessage('');
                  }}
                  className={`flex-1 py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    view === 'register'
                      ? 'bg-[#E06518] text-white shadow-sm font-black'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>ثبت نام</span>
                </button>
              </div>
            )}

            {/* Error Message Toast */}
            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700 flex items-start gap-2 animate-shake">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{errorMessage}</span>
              </div>
            )}

            {/* ───────────────────────────────────────────────────────────────────── */}
            {/* 1. LOGIN WITH PASSWORD VIEW                                           */}
            {/* ───────────────────────────────────────────────────────────────────── */}
            {view === 'login_password' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="hidden md:block">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] text-[#E06518] font-bold mb-1.5 bg-orange-50 border border-orange-200/70">
                    <Zap className="w-3.5 h-3.5 text-[#E06518]" />
                    <span>خدمات و استعلام هوشمند صنعت‌پیش</span>
                  </div>
                  <h2 className="text-2xl font-black text-[#55565A] tracking-tight">
                    خوش آمدید، به <span className="text-[#E06518]">صنعت‌پیش</span>
                  </h2>
                  <p className="text-xs text-[#777A7D] mt-1 leading-relaxed">
                    وارد حساب کاربری خود شوید و به سفارش‌ها، استعلام‌ها، پیشنهادهای اختصاصی و خدمات هوشمند صنعتی خود دسترسی پیدا کنید.
                  </p>
                </div>

                <form onSubmit={handlePasswordSubmit} className="space-y-3.5 pt-1">
                  {/* Phone / Username Input */}
                  <div>
                    <label className="block text-xs font-bold text-[#55565A] mb-1.5">
                      شماره موبایل یا نام کاربری <span className="text-[#E06518]">*</span>
                    </label>
                    <div className="flex items-center justify-between bg-slate-50/90 hover:bg-slate-50 focus-within:bg-white border border-[#CBD2D8] rounded-2xl px-3.5 py-3 transition-all focus-within:border-[#E06518] focus-within:ring-4 focus-within:ring-[#E06518]/15">
                      <input
                        type="text"
                        dir="ltr"
                        required
                        placeholder="0912 345 6789  یا  sanatpish_user"
                        value={identifier}
                        onChange={e => {
                          setIdentifier(e.target.value);
                          setErrorMessage('');
                        }}
                        className="w-full bg-transparent text-xs sm:text-sm font-mono text-left text-slate-800 focus:outline-none placeholder:text-slate-400"
                      />
                      <Phone className="w-4 h-4 text-slate-400 shrink-0 mr-2" />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div>
                    <label className="block text-xs font-bold text-[#55565A] mb-1.5">
                      رمز عبور <span className="text-[#E06518]">*</span>
                    </label>
                    <div className="flex items-center justify-between bg-slate-50/90 hover:bg-slate-50 focus-within:bg-white border border-[#CBD2D8] rounded-2xl px-3.5 py-3 transition-all focus-within:border-[#E06518] focus-within:ring-4 focus-within:ring-[#E06518]/15">
                      <button
                        type="button"
                        onClick={() => setShowPassword(p => !p)}
                        className="text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer p-0.5 ml-2"
                        aria-label="تغییر نمایش رمز"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        dir="ltr"
                        required
                        placeholder="رمز عبور خود را وارد کنید"
                        value={password}
                        onChange={e => {
                          setPassword(e.target.value);
                          setErrorMessage('');
                        }}
                        className="w-full bg-transparent text-xs sm:text-sm font-mono text-left text-slate-800 focus:outline-none placeholder:text-slate-400"
                      />
                      <Lock className="w-4 h-4 text-slate-400 shrink-0 mr-2" />
                    </div>
                  </div>

                  {/* Remember Me & Forgot Password Links */}
                  <div className="flex items-center justify-between text-xs text-slate-600 pt-0.5">
                    <label className="flex items-center gap-2 cursor-pointer hover:text-slate-900">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={e => setRememberMe(e.target.checked)}
                        className="rounded-md border-slate-300 text-[#E06518] focus:ring-[#E06518] cursor-pointer"
                      />
                      <span>مرا به خاطر بسپار</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => {
                        setView('login_otp');
                        setErrorMessage('');
                      }}
                      className="hover:underline font-bold text-xs cursor-pointer text-[#E06518]"
                    >
                      ورود بدون رمز (پیامک OTP)
                    </button>
                  </div>

                  {/* Primary Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-atlas-primary w-full h-12 rounded-2xl font-bold text-sm shadow-md shadow-[#E06518]/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] disabled:opacity-60"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>ورود به صنعت‌پیش</span>
                        <ArrowRight className="w-4 h-4 rotate-180" />
                      </>
                    )}
                  </button>
                </form>

                {/* Divider */}
                <div className="relative my-3">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-white px-3 text-slate-400 font-medium">یا</span>
                  </div>
                </div>

                {/* Switch to OTP Login Option */}
                <button
                  type="button"
                  onClick={() => {
                    setView('login_otp');
                    setErrorMessage('');
                  }}
                  className="btn-atlas-secondary w-full h-11 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                >
                  <MessageSquare className="w-4 h-4 text-[#E06518]" />
                  <span>ورود سریع با کد تأیید پیامکی</span>
                </button>

                {/* Bottom Register Prompt */}
                <div className="pt-2 text-center text-xs text-slate-500">
                  <span>هنوز ثبت‌نام نکرده‌اید؟ </span>
                  <button
                    type="button"
                    onClick={() => {
                      setView('register');
                      setErrorMessage('');
                    }}
                    className="font-black hover:underline cursor-pointer text-[#E06518]"
                  >
                    به خانواده صنعت‌پیش بپیوندید
                  </button>
                </div>
              </div>
            )}

            {/* ───────────────────────────────────────────────────────────────────── */}
            {/* 2. LOGIN WITH OTP (SMS) VIEW                                          */}
            {/* ───────────────────────────────────────────────────────────────────── */}
            {view === 'login_otp' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="hidden md:block">
                  <span className="text-xs font-bold text-[#777A7D] block mb-0.5">
                    ورود سریع در ۱۰ ثانیه
                  </span>
                  <h2 className="text-2xl font-black text-[#55565A] tracking-tight">
                    ورود به <span className="text-[#E06518]">صنعت‌پیش</span> با شماره همراه
                  </h2>
                </div>

                {otpStep === 'phone' ? (
                  <form onSubmit={handleOtpPhoneSubmit} className="space-y-4 pt-1">
                    <div>
                      <label className="block text-xs font-bold text-[#55565A] mb-1.5">
                        شماره موبایل همراه <span className="text-[#E06518]">*</span>
                      </label>
                      <div className="flex items-center justify-between bg-slate-50/90 hover:bg-slate-50 focus-within:bg-white border border-[#CBD2D8] rounded-2xl px-3.5 py-3 transition-all focus-within:border-[#E06518] focus-within:ring-4 focus-within:ring-[#E06518]/15">
                        <input
                          type="tel"
                          inputMode="numeric"
                          dir="ltr"
                          required
                          placeholder="0912 345 6789"
                          value={otpPhone}
                          onChange={e => setOtpPhone(e.target.value)}
                          className="w-full bg-transparent text-sm text-slate-800 font-mono text-left focus:outline-none placeholder:text-slate-400"
                        />
                        <Phone className="w-4 h-4 text-slate-400 shrink-0 mr-2" />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn-atlas-primary w-full h-12 rounded-2xl font-bold text-sm shadow-md shadow-[#E06518]/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                    >
                      <span>دریافت کد تأیید پیامکی</span>
                      <MessageSquare className="w-4 h-4" />
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleOtpCodeSubmit} className="space-y-4 pt-1">
                    <div className="p-3 bg-orange-50/80 border border-orange-200/70 rounded-2xl text-xs text-orange-950 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-[#E06518]" />
                        <span className="font-mono font-bold" dir="ltr">{otpPhone}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setOtpStep('phone')}
                        className="text-[#E06518] font-bold hover:underline text-[11px] cursor-pointer"
                      >
                        ویرایش شماره
                      </button>
                    </div>

                    {/* 4 Distinct OTP Input Boxes */}
                    <div>
                      <label className="block text-center text-xs font-bold text-[#55565A] mb-2">
                        کد ۴ رقمی پیامک‌شده را وارد کنید:
                      </label>
                      <div className="flex items-center justify-center gap-3" dir="ltr">
                        {[0, 1, 2, 3].map(i => (
                          <input
                            key={i}
                            ref={otpInputRefs[i]}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={otpCode[i]}
                            onChange={e => handleOtpBoxChange(i, e.target.value)}
                            onKeyDown={e => handleOtpKeyDown(i, e)}
                            className={`w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-mono font-bold rounded-2xl border transition-all focus:outline-none ${
                              otpCode[i]
                                ? 'border-[#E06518] bg-orange-50/50 text-[#E06518] shadow-xs'
                                : 'border-[#CBD2D8] bg-slate-50 text-slate-700 focus:border-[#E06518] focus:bg-white focus:ring-4 focus:ring-[#E06518]/15'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Timer / Resend */}
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      {timer > 0 ? (
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#E06518]" />
                          <span>
                            ارسال مجدد تا {toPersianDigits(minutes.toString().padStart(2, '0'))}:
                            {toPersianDigits(seconds.toString().padStart(2, '0'))}
                          </span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setTimer(120);
                            setOtpCode(['', '', '', '']);
                          }}
                          className="text-[#E06518] font-bold hover:underline cursor-pointer"
                        >
                          ارسال مجدد کد پیامکی
                        </button>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="btn-atlas-primary w-full h-12 rounded-2xl font-bold text-sm shadow-md shadow-[#E06518]/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>تأیید و ورود به صنعت‌پیش</span>
                    </button>
                  </form>
                )}

                <div className="pt-2 text-center text-xs text-slate-500">
                  <button
                    type="button"
                    onClick={() => {
                      setView('login_password');
                      setErrorMessage('');
                    }}
                    className="font-bold text-slate-700 hover:text-[#E06518]"
                  >
                    ورود با نام کاربری و رمز عبور
                  </button>
                </div>
              </div>
            )}

            {/* ───────────────────────────────────────────────────────────────────── */}
            {/* 3. REGISTER VIEW (With User's Requested Exact Titles & Copy)           */}
            {/* ───────────────────────────────────────────────────────────────────── */}
            {view === 'register' && (
              <div className="space-y-3 animate-fadeIn">
                <div className="hidden md:block">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] text-[#E06518] font-bold mb-1.5 bg-orange-50 border border-orange-200/70">
                    <Gift className="w-3.5 h-3.5 text-[#E06518]" />
                    <span>عضویت ویژه در صنعت‌پیش</span>
                  </div>
                  <h2 className="text-2xl font-black text-[#55565A] tracking-tight">
                    به خانواده <span className="text-[#E06518]">صنعت‌پیش</span> بپیوندید
                  </h2>
                  <p className="text-xs text-[#777A7D] mt-0.5 leading-relaxed">
                    با ثبت‌نام در سامانه صنعت‌پیش، به قیمت‌های ویژه، مشاوره تخصصی و پیشنهادهای متناسب با نیاز صنعتی خود دسترسی پیدا کنید.
                  </p>
                </div>

                <form onSubmit={handleRegisterSubmit} className="space-y-3 pt-0.5">
                  {/* Full Name Input */}
                  <div>
                    <label className="block text-xs font-bold text-[#55565A] mb-1">
                      نام و نام خانوادگی <span className="text-[#E06518]">*</span>
                    </label>
                    <div className="flex items-center justify-between bg-slate-50/90 hover:bg-slate-50 focus-within:bg-white border border-[#CBD2D8] rounded-2xl px-3.5 py-2.5 transition-all focus-within:border-[#E06518] focus-within:ring-4 focus-within:ring-[#E06518]/15">
                      <input
                        type="text"
                        required
                        placeholder="نام و نام خانوادگی خود را وارد کنید"
                        value={fullName}
                        onChange={e => setFullName(e.target.value)}
                        className="w-full bg-transparent text-xs sm:text-sm text-slate-800 font-bold focus:outline-none placeholder:text-slate-400"
                      />
                      <User className="w-4 h-4 text-slate-400 shrink-0 mr-2" />
                    </div>
                  </div>

                  {/* Mobile Input */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-[#55565A]">
                        شماره موبایل <span className="text-[#E06518]">*</span>
                      </label>
                      {regMobileCheck?.isValid && (
                        <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
                          <Check className="w-3 h-3" /> معتبر
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between bg-slate-50/90 hover:bg-slate-50 focus-within:bg-white border border-[#CBD2D8] rounded-2xl px-3.5 py-2.5 transition-all focus-within:border-[#E06518] focus-within:ring-4 focus-within:ring-[#E06518]/15">
                      <input
                        type="tel"
                        inputMode="numeric"
                        dir="ltr"
                        required
                        placeholder="0912 345 6789"
                        value={regMobile}
                        onChange={e => setRegMobile(e.target.value)}
                        className="w-full bg-transparent text-xs sm:text-sm font-mono font-bold text-left text-slate-800 focus:outline-none placeholder:text-slate-400"
                      />
                      <Phone className="w-4 h-4 text-slate-400 shrink-0 mr-2" />
                    </div>
                  </div>

                  {/* Company Name Input & Live Auto Username */}
                  <div>
                    <label className="block text-xs font-bold text-[#55565A] mb-1">
                      نام شرکت / فروشگاه <span className="text-[#E06518]">*</span>
                    </label>
                    <div className="flex items-center justify-between bg-slate-50/90 hover:bg-slate-50 focus-within:bg-white border border-[#CBD2D8] rounded-2xl px-3.5 py-2.5 transition-all focus-within:border-[#E06518] focus-within:ring-4 focus-within:ring-[#E06518]/15">
                      <input
                        type="text"
                        required
                        placeholder="نام شرکت یا فروشگاه خود را وارد کنید"
                        value={companyName}
                        onChange={e => setCompanyName(e.target.value)}
                        className="w-full bg-transparent text-xs sm:text-sm text-slate-800 font-bold focus:outline-none placeholder:text-slate-400"
                      />
                      <Building2 className="w-4 h-4 text-slate-400 shrink-0 mr-2" />
                    </div>

                    {usernamePreview && (
                      <div className="flex items-center justify-between text-[11px] px-3 py-1.5 mt-1.5 rounded-xl bg-orange-50 text-orange-950 border border-orange-200/80 animate-fadeIn">
                        <span className="text-slate-600">نام کاربری اختصاصی مجموعه:</span>
                        <span className="font-mono font-bold text-[#E06518]" dir="ltr">@{usernamePreview}</span>
                      </div>
                    )}
                  </div>

                  {/* Province & City Selection */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-[#55565A] mb-1">
                        استان <span className="text-[#E06518]">*</span>
                      </label>
                      <select
                        value={provinceId}
                        onChange={e => handleProvinceChange(e.target.value)}
                        className="w-full bg-slate-50 border border-[#CBD2D8] rounded-2xl px-3 py-2.5 text-xs text-slate-800 font-bold focus:outline-none focus:border-[#E06518] cursor-pointer"
                      >
                        {IRAN_PROVINCES.map(p => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#55565A] mb-1">
                        شهر <span className="text-[#E06518]">*</span>
                      </label>
                      <select
                        value={cityId}
                        onChange={e => setCityId(e.target.value)}
                        className="w-full bg-slate-50 border border-[#CBD2D8] rounded-2xl px-3 py-2.5 text-xs text-slate-800 font-bold focus:outline-none focus:border-[#E06518] cursor-pointer"
                      >
                        {availableCities.map(c => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Activity Field Selection */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#55565A]">
                      زمینه فعالیت صنعتی <span className="text-[#E06518]">*</span>
                    </label>
                    <div className="relative">
                      <div
                        onClick={() => setIsActivityOpen(o => !o)}
                        className="border border-[#CBD2D8] bg-slate-50 hover:bg-white rounded-2xl px-3.5 py-2.5 cursor-pointer flex items-center justify-between hover:border-[#E06518] transition-all"
                      >
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-slate-400" />
                          <span className="text-xs text-slate-800 font-bold">{activityField}</span>
                        </div>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                      </div>

                      {isActivityOpen && (
                        <div className="absolute top-full right-0 left-0 mt-1 bg-white border border-[#CBD2D8] rounded-2xl shadow-xl z-50 p-2 max-h-48 overflow-y-auto">
                          <div className="flex items-center gap-1.5 p-1.5 border-b border-slate-100 mb-1">
                            <Search className="w-3.5 h-3.5 text-slate-400" />
                            <input
                              type="text"
                              placeholder="جستجو در زمینه‌های فعالیت..."
                              value={activitySearch}
                              onChange={e => setActivitySearch(e.target.value)}
                              className="w-full text-xs text-slate-700 focus:outline-none"
                              autoFocus
                            />
                          </div>
                          {filteredActivities.map(act => (
                            <div
                              key={act}
                              onClick={() => {
                                setActivityField(act);
                                setIsActivityOpen(false);
                              }}
                              className={`p-2 rounded-xl text-xs cursor-pointer flex items-center justify-between ${
                                activityField === act
                                  ? 'bg-orange-50 text-[#E06518] font-bold'
                                  : 'hover:bg-slate-50 text-slate-700'
                              }`}
                            >
                              <span>{act}</span>
                              {activityField === act && <Check className="w-3.5 h-3.5 text-[#E06518]" />}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Quick 1-Tap Chips */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none text-[10px]">
                      {TOP_INDUSTRIES.slice(0, 4).map(ind => (
                        <button
                          key={ind}
                          type="button"
                          onClick={() => setActivityField(ind)}
                          className={`px-2 py-1 rounded-lg shrink-0 transition-colors cursor-pointer ${
                            activityField === ind
                              ? 'btn-atlas-primary font-bold'
                              : 'btn-atlas-secondary'
                          }`}
                        >
                          {ind.replace('صنایع ', '')}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Email Optional */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">
                      ایمیل <span className="text-slate-400 font-normal">(اختیاری)</span>
                    </label>
                    <div className="flex items-center justify-between bg-slate-50/90 hover:bg-slate-50 focus-within:bg-white border border-[#CBD2D8] rounded-2xl px-3.5 py-2 transition-all focus-within:border-[#E06518]">
                      <input
                        type="email"
                        dir="ltr"
                        placeholder="info@example.com"
                        value={regEmail}
                        onChange={e => setRegEmail(e.target.value)}
                        className="w-full bg-transparent text-xs font-mono text-left text-slate-800 focus:outline-none placeholder:text-slate-400"
                      />
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0 mr-2" />
                    </div>
                  </div>

                  {/* Terms Checkbox */}
                  <label className="flex items-center gap-2 text-[11px] text-slate-600 cursor-pointer pt-0.5">
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={e => setTermsAccepted(e.target.checked)}
                      className="rounded-md border-slate-300 text-[#E06518] focus:ring-[#E06518]"
                    />
                    <span>
                      با ثبت‌نام، موافقت خود را با <strong className="font-bold text-[#E06518]">قوانین و مقررات صنعت‌پیش</strong> اعلام می‌کنم.
                    </span>
                  </label>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading || !termsAccepted}
                    className="btn-atlas-primary w-full h-12 rounded-2xl font-bold text-sm shadow-md shadow-[#E06518]/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] disabled:opacity-60 mt-2"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        <span>ثبت‌نام در صنعت‌پیش</span>
                      </>
                    )}
                  </button>
                </form>

                {/* Footer Link */}
                <div className="pt-2 text-center text-xs text-slate-500">
                  <span>قبلاً ثبت‌نام کرده‌اید؟ </span>
                  <button
                    type="button"
                    onClick={() => {
                      setView('login_password');
                      setErrorMessage('');
                    }}
                    className="font-black hover:underline cursor-pointer text-[#E06518]"
                  >
                    ورود به حساب کاربری
                  </button>
                </div>
              </div>
            )}

            {/* ───────────────────────────────────────────────────────────────────── */}
            {/* 4. POST-REGISTRATION CREDENTIALS DISPLAY                              */}
            {/* ───────────────────────────────────────────────────────────────────── */}
            {view === 'credentials' && latestCredentials && (
              <div className="space-y-4 animate-fadeIn">
                <div className="text-center">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2 shadow-inner">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h2 className="text-lg font-black text-[#55565A]">حساب کاربری صنعت‌پیش ایجاد شد!</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    مشخصات ورود به شماره <strong className="text-slate-700 font-mono" dir="ltr">{latestCredentials.mobile}</strong> پیامک گردید.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
                  {/* Username Card */}
                  <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                    <div>
                      <span className="block text-[10px] text-slate-400 font-bold">نام کاربری اختصاصی صنعت‌پیش:</span>
                      <span className="font-mono font-bold text-slate-800 text-sm" dir="ltr">
                        {latestCredentials.username}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(latestCredentials.username, 'username')}
                      className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors cursor-pointer"
                      title="کپی نام کاربری"
                    >
                      {copiedField === 'username' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Password Card */}
                  <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                    <div>
                      <span className="block text-[10px] text-slate-400 font-bold">رمز عبور اولیه:</span>
                      <span className="font-mono font-bold text-sm text-[#E06518]" dir="ltr">
                        {showCredPassword ? latestCredentials.initialPassword : '••••••••'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setShowCredPassword(s => !s)}
                        className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors cursor-pointer"
                        title="نمایش رمز"
                      >
                        {showCredPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCopy(latestCredentials.initialPassword || '', 'password')}
                        className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors cursor-pointer"
                        title="کپی رمز عبور"
                      >
                        {copiedField === 'password' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setView('onboarding_brands')}
                  className="btn-atlas-primary w-full h-12 rounded-2xl font-bold text-xs shadow-md shadow-[#E06518]/25 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                >
                  <span>ادامه و شخصی‌سازی علایق (مرحله بعد)</span>
                  <ArrowRight className="w-4 h-4 rotate-180" />
                </button>
              </div>
            )}

            {/* ───────────────────────────────────────────────────────────────────── */}
            {/* 5. ONBOARDING STEP 1 & 2                                              */}
            {/* ───────────────────────────────────────────────────────────────────── */}
            {view === 'onboarding_brands' && (
              <div className="space-y-3 animate-fadeIn">
                <div>
                  <div className="flex items-center justify-between text-[11px] font-bold mb-1 text-[#E06518]">
                    <span>مرحله ۱ از ۲: برندهای تجاری مورد علاقه</span>
                    <span>۵۰٪</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="w-1/2 h-full rounded-full bg-[#E06518]" />
                  </div>
                  <h3 className="text-base font-black text-[#55565A] mt-2">کدام برندها را بیشتر نیاز دارید؟</h3>
                </div>

                {/* Brands Grid */}
                <div className="grid grid-cols-3 gap-2 max-h-44 overflow-y-auto p-1">
                  {filteredBrands.map(b => {
                    const isSelected = selectedBrands.includes(b.id);
                    return (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => toggleBrand(b.id)}
                        className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-orange-50 border-[#E06518] text-[#E06518] font-bold shadow-2xs'
                            : 'border-slate-200 text-slate-700 bg-white hover:border-[#E06518]/50'
                        }`}
                      >
                        <span className="block text-xs font-mono font-bold uppercase">{b.nameEn}</span>
                        <span className="block text-[10px] text-slate-400 mt-0.5">{b.name}</span>
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={handleStep1Submit}
                  disabled={loading}
                  className="btn-atlas-primary w-full h-12 rounded-2xl font-bold text-xs shadow-md shadow-[#E06518]/25 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                >
                  <span>تأیید و مرحله بعد</span>
                  <ArrowRight className="w-4 h-4 rotate-180" />
                </button>
              </div>
            )}

            {view === 'onboarding_business' && (
              <div className="space-y-3 animate-fadeIn">
                <div>
                  <div className="flex items-center justify-between text-[11px] font-bold mb-1 text-[#E06518]">
                    <span>مرحله ۲ از ۲: نوع کسب‌وکار</span>
                    <span>۱۰۰٪</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="w-full h-full bg-emerald-500 rounded-full" />
                  </div>
                  <h3 className="text-base font-black text-[#55565A] mt-2">نوع فعالیت مجموعه شما چیست؟</h3>
                </div>

                <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto p-1">
                  {BUSINESS_TYPES.map(bt => {
                    const isSelected = selectedBusinessType === bt.id;
                    return (
                      <div
                        key={bt.id}
                        onClick={() => setSelectedBusinessType(bt.id)}
                        className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-orange-50/70 border-[#E06518] shadow-2xs'
                            : 'border-slate-200 bg-white hover:border-[#E06518]/50'
                        }`}
                      >
                        <div>
                          <span
                            className={`block text-xs font-bold ${
                              isSelected ? 'text-[#E06518]' : 'text-slate-800'
                            }`}
                          >
                            {bt.title}
                          </span>
                          <span className="block text-[10px] text-slate-500 mt-0.5">{bt.description}</span>
                        </div>
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected
                              ? 'border-[#E06518] bg-[#E06518] text-white'
                              : 'border-[#CBD2D8]'
                          }`}
                        >
                          {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={handleStep2Submit}
                  disabled={loading}
                  className="w-full h-12 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>تکمیل و ورود به داشبورد صنعت‌پیش</span>
                </button>
              </div>
            )}
          </div>

          {/* Quick Demo Accounts Helper */}
          {(view === 'login_password' || view === 'login_otp') && (
            <div className="mt-3 pt-2.5 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowDemoList(s => !s)}
                className="text-[11px] text-slate-400 hover:text-slate-600 flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-[#E06518]" />
                <span>ورود سریع با اکانت‌های دمو صنعت‌پیش</span>
              </button>

              {showDemoList && (
                <div className="grid grid-cols-3 gap-1.5 mt-1.5 animate-fadeIn">
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('retail')}
                    className="p-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-orange-50 hover:text-[#E06518] text-[10px] text-slate-700 font-bold cursor-pointer text-center transition-colors"
                  >
                    مشتری عادی
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('wholesale')}
                    className="p-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-orange-50 hover:text-[#E06518] text-[10px] text-slate-700 font-bold cursor-pointer text-center transition-colors"
                  >
                    همکار صنعتی
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('dealer')}
                    className="p-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-orange-50 hover:text-[#E06518] text-[10px] text-slate-700 font-bold cursor-pointer text-center transition-colors"
                  >
                    نمایندگی رسمی
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* LEFT COLUMN: DARK INDUSTRIAL VISUAL PANEL (Desktop Side Panel)            */}
        {/* ========================================================================= */}
        <div className="hidden md:block md:col-span-5 relative order-2">
          <AuthVisualSidePanel
            bgImage={
              view === 'register'
                ? STORE_ASSETS.bannerAuthRegister
                : STORE_ASSETS.bannerAuthLogin
            }
            badgeText={
              view === 'register'
                ? 'به خانواده صنعت‌پیش بپیوندید'
                : 'خوش آمدید، به صنعت‌پیش'
            }
            customTitle={
              view === 'register'
                ? 'به خانواده صنعت‌پیش بپیوندید'
                : view === 'credentials'
                ? 'مشخصات ورود به صنعت‌پیش آماده است'
                : 'خوش آمدید، به صنعت‌پیش'
            }
            customDescription={
              view === 'register'
                ? 'با ثبت‌نام در سامانه صنعت‌پیش، به قیمت‌های ویژه، مشاوره تخصصی و پیشنهادهای متناسب با نیاز صنعتی خود دسترسی پیدا کنید.'
                : 'وارد حساب کاربری خود شوید و به سفارش‌ها، استعلام‌ها، پیشنهادهای اختصاصی و خدمات هوشمند صنعتی خود دسترسی پیدا کنید.'
            }
            highlights={
              view === 'register'
                ? [
                    'قیمت‌های ویژه و تعرفه اختصاصی همکاران',
                    'مشاوره رایگان مهندسین و کارشناسان ارشد صنعت‌پیش',
                    'پیشنهادها و تخفیف‌های متناسب با نیاز صنعتی شما',
                  ]
                : [
                    'دسترسی سریع به کلیه سفارشات و استعلام‌های فعال',
                    'مشاهده کاتالوگ و پیشنهادهای اختصاصی صنعت‌پیش',
                    'صدور فوری پیش‌فاکتور رسمی و خدمات هوشمند',
                  ]
            }
          />
        </div>

        {/* ========================================================================= */}
        {/* 📱 MOBILE BOTTOM TRUST STRIP                                              */}
        {/* ========================================================================= */}
        <div className="md:hidden relative z-20 w-full bg-[#12161f] border-t border-slate-800/80 py-3 px-4 flex items-center justify-around text-slate-300 text-[11px] font-medium select-none">
          <div className="flex flex-col items-center gap-1">
            <Truck className="w-4 h-4 text-[#E06518]" />
            <span>ارسال سریع</span>
          </div>
          <div className="w-px h-6 bg-slate-800" />
          <div className="flex flex-col items-center gap-1">
            <Factory className="w-4 h-4 text-[#E06518]" />
            <span>قیمت کارخانه</span>
          </div>
          <div className="w-px h-6 bg-slate-800" />
          <div className="flex flex-col items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-[#E06518]" />
            <span>تضمین اصالت</span>
          </div>
        </div>
      </div>
    </Modal>
  );
};
