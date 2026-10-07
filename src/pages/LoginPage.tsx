import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AuthVisualSidePanel } from '../components/auth/AuthVisualSidePanel';
import { STORE_ASSETS } from '../assets/images';
import {
  Phone,
  Lock,
  User,
  Eye,
  EyeOff,
  AlertCircle,
  UserPlus,
  ArrowRight,
  Clock,
  KeyRound,
  CheckCircle2,
  Sparkles,
  MessageSquare,
  Globe,
  Truck,
  Factory,
  ShieldCheck,
} from 'lucide-react';
import { toPersianDigits } from '../utils/formatters';
import { normalizeIranianMobile } from '../utils/usernameGenerator';
import { UserRole } from '../types';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { loginWithPassword, loginWithOtp, loginAs, currentUser } = useAuth();

  const [loginMode, setLoginMode] = useState<'password' | 'otp'>('password');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // OTP state
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

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showDemoList, setShowDemoList] = useState(false);

  useEffect(() => {
    const mobileParam = searchParams.get('mobile');
    if (mobileParam) {
      setIdentifier(mobileParam);
    }
  }, [searchParams]);

  useEffect(() => {
    if (currentUser?.onboardingCompleted) {
      navigate('/account');
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    let interval: any;
    if (loginMode === 'otp' && otpStep === 'code' && timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [loginMode, otpStep, timer]);

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

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!identifier.trim()) {
      setErrorMessage('لطفاً شماره موبایل یا نام کاربری خود را وارد فرمایید.');
      return;
    }
    if (!password.trim()) {
      setErrorMessage('لطفاً رمز عبور خود را وارد فرمایید.');
      return;
    }

    setLoading(true);
    try {
      const res = await loginWithPassword(identifier.trim(), password.trim());
      if (res.success && res.user) {
        if (!res.user.onboardingCompleted) {
          navigate('/onboarding');
        } else {
          navigate('/account');
        }
      } else {
        setErrorMessage(res.message || 'نام کاربری یا رمز عبور اشتباه است.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'خطا در ارتباط با سرور.');
    } finally {
      setLoading(false);
    }
  };

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

  const handleOtpCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const combinedCode = otpCode.join('');
    if (combinedCode.length < 4) {
      setErrorMessage('کد ۴ رقمی را به‌طور کامل وارد فرمایید.');
      return;
    }
    const check = normalizeIranianMobile(otpPhone);
    loginWithOtp(check.isValid ? check.normalized : otpPhone);
    navigate('/account');
  };

  const handleQuickDemoLogin = (role: UserRole) => {
    loginAs(role);
    if (role === 'dealer') navigate('/dealer');
    else if (role === 'admin') navigate('/admin');
    else navigate('/account');
  };

  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;

  return (
    <div className="min-h-[85vh] py-4 sm:py-12 px-2 sm:px-6 lg:px-8 bg-gradient-to-b from-[#F4F4F5] via-[#DEE2E5]/30 to-[#F4F4F5] flex items-center justify-center text-right">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col md:grid md:grid-cols-12 relative">
        {/* Mobile Top Hero Header */}
        <div className="md:hidden relative w-full h-48 bg-[#12161f] text-white overflow-hidden shrink-0 select-none">
          <img
            src={STORE_ASSETS.bannerAuthLogin || STORE_ASSETS.authIndustrialHero}
            alt="صنعت‌پیش"
            className="absolute inset-0 w-full h-full object-cover object-center opacity-45 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#12161f] via-[#12161f]/60 to-[#12161f]/80" />

          {/* Top Bar Header (Logo, Language) */}
          <div className="relative z-10 p-4 pt-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#E06518] to-[#C95210] flex items-center justify-center font-black text-sm text-white shadow-md shadow-orange-950/40">
                ص
              </div>
              <div className="flex items-center gap-1 font-black text-base tracking-tight text-white">
                <span className="text-[#E06518]">صنعت‌</span>
                <span className="text-slate-100 font-bold">پیش</span>
              </div>
            </div>

            <div className="flex items-center gap-1 text-[11px] font-mono text-slate-300 bg-white/10 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
              <Globe className="w-3 h-3 text-[#E06518]" />
              <span>FA</span>
            </div>
          </div>

          {/* Centered Hero Text */}
          <div className="relative z-10 px-4 pt-1 pb-4 text-center">
            <h2 className="text-xl font-black text-white tracking-tight mb-1 text-shadow-sm">
              خوش آمدید، به صنعت‌پیش
            </h2>
            <p className="text-[11px] text-slate-200 leading-relaxed max-w-xs mx-auto">
              وارد حساب کاربری خود شوید و به سفارش‌ها، استعلام‌ها، پیشنهادهای اختصاصی و خدمات هوشمند صنعتی خود دسترسی پیدا کنید.
            </p>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="col-span-1 md:col-span-7 p-5 sm:p-8 lg:p-10 flex flex-col justify-between relative bg-white order-1 -mt-6 md:mt-0 rounded-t-[32px] md:rounded-t-none z-10 shadow-2xl md:shadow-none">
          <div className="space-y-4">
            {/* Desktop Header Titles */}
            <div className="hidden md:block">
              <span className="text-xs font-bold text-[#777A7D] block mb-1">
                خوش برگشتی!
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-[#55565A] tracking-tight">
                <span className="text-[#E06518]">ورود</span> به حساب کاربری
              </h1>
              <p className="text-xs sm:text-sm text-[#777A7D] mt-1 leading-relaxed">
                وارد حساب کاربری خود شوید و به سفارش‌ها، استعلام‌ها و پیشنهادهای اختصاصی دسترسی پیدا کنید.
              </p>
            </div>

            {/* Segmented Switcher Tab */}
            <div className="flex items-center p-1.5 bg-slate-100/90 rounded-2xl border border-[#CBD2D8] text-xs font-bold gap-1 mb-2">
              <button
                type="button"
                onClick={() => {
                  setLoginMode('password');
                  setErrorMessage('');
                }}
                className={`flex-1 py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  loginMode === 'password'
                    ? 'btn-atlas-primary shadow-sm font-bold'
                    : 'btn-atlas-secondary border-none'
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>ورود</span>
              </button>

              <Link
                to="/register"
                className="btn-atlas-secondary border-none flex-1 py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>ثبت نام</span>
              </Link>
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700 flex items-start gap-2 animate-shake">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {loginMode === 'password' ? (
              <form onSubmit={handlePasswordSubmit} className="space-y-4 pt-1">
                <div>
                  <label className="block text-xs font-bold text-[#55565A] mb-1.5">
                    شماره موبایل یا نام کاربری <span className="text-[#E06518]">*</span>
                  </label>
                  <div className="flex items-center justify-between bg-slate-50/90 hover:bg-slate-50 focus-within:bg-white border border-[#CBD2D8] focus-within:border-[#E06518] focus-within:ring-4 focus-within:ring-[#E06518]/15 rounded-2xl px-3.5 py-3 transition-all">
                    <input
                      type="text"
                      dir="ltr"
                      required
                      placeholder="0912 345 6789  یا  atlas_sanat"
                      value={identifier}
                      onChange={e => setIdentifier(e.target.value)}
                      className="w-full bg-transparent text-xs sm:text-sm font-mono text-left text-slate-800 focus:outline-none placeholder:text-slate-400"
                    />
                    <Phone className="w-4 h-4 text-slate-400 shrink-0 mr-2" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#55565A] mb-1.5">
                    رمز عبور <span className="text-[#E06518]">*</span>
                  </label>
                  <div className="flex items-center justify-between bg-slate-50/90 hover:bg-slate-50 focus-within:bg-white border border-[#CBD2D8] focus-within:border-[#E06518] focus-within:ring-4 focus-within:ring-[#E06518]/15 rounded-2xl px-3.5 py-3 transition-all">
                    <button
                      type="button"
                      onClick={() => setShowPassword(p => !p)}
                      className="text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer p-0.5 ml-2"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      dir="ltr"
                      required
                      placeholder="رمز عبور خود را وارد کنید"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full bg-transparent text-xs sm:text-sm font-mono text-left text-slate-800 focus:outline-none placeholder:text-slate-400"
                    />
                    <Lock className="w-4 h-4 text-slate-400 shrink-0 mr-2" />
                  </div>
                </div>

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
                    onClick={() => setLoginMode('otp')}
                    className="text-[#E06518] hover:underline font-bold text-xs"
                  >
                    ورود با پیامک (OTP)
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-atlas-primary w-full h-12 rounded-2xl font-bold text-sm shadow-md shadow-[#E06518]/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] disabled:opacity-60"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>ورود</span>
                      <ArrowRight className="w-4 h-4 rotate-180" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="space-y-4 pt-1">
                {otpStep === 'phone' ? (
                  <form onSubmit={handleOtpPhoneSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-[#55565A] mb-1.5">
                        شماره موبایل همراه <span className="text-[#E06518]">*</span>
                      </label>
                      <div className="flex items-center justify-between bg-slate-50/90 hover:bg-slate-50 focus-within:bg-white border border-[#CBD2D8] focus-within:border-[#E06518] rounded-2xl px-3.5 py-3 transition-all">
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
                  <form onSubmit={handleOtpCodeSubmit} className="space-y-4">
                    <div className="p-3 bg-orange-50/80 border border-orange-200/70 rounded-2xl text-xs text-orange-950 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-[#E06518]" />
                        <span className="font-mono font-bold" dir="ltr">{otpPhone}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setOtpStep('phone')}
                        className="text-[#E06518] font-bold hover:underline text-[11px]"
                      >
                        ویرایش شماره
                      </button>
                    </div>

                    <div>
                      <label className="block text-center text-xs font-bold text-[#55565A] mb-2">
                        کد ۴ رقمی پیامک‌شده:
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
                            className={`w-12 h-14 text-center text-2xl font-mono font-bold rounded-2xl border transition-all focus:outline-none ${
                              otpCode[i]
                                ? 'border-[#E06518] bg-orange-50/50 text-[#E06518]'
                                : 'border-[#CBD2D8] bg-slate-50 text-slate-700 focus:border-[#E06518] focus:bg-white'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn-atlas-primary w-full h-12 rounded-2xl font-bold text-sm shadow-md shadow-[#E06518]/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>تأیید و ورود به پنل</span>
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* Bottom Register Prompt */}
            <div className="pt-3 border-t border-slate-100 text-center text-xs text-slate-500">
              <span>حساب کاربری ندارید؟ </span>
              <Link
                to="/register"
                className="font-black text-[#E06518] hover:underline"
              >
                ثبت نام کنید
              </Link>
            </div>
          </div>
        </div>

        {/* Left Side Visual Panel */}
        <div className="hidden md:block md:col-span-5 relative order-2">
          <AuthVisualSidePanel
            bgImage={STORE_ASSETS.bannerAuthLogin}
            badgeText="خوش آمدید، به صنعت‌پیش"
            customTitle="خوش آمدید، به صنعت‌پیش"
            customDescription="وارد حساب کاربری خود شوید و به سفارش‌ها، استعلام‌ها، پیشنهادهای اختصاصی و خدمات هوشمند صنعتی خود دسترسی پیدا کنید."
            highlights={[
              'دسترسی سریع به کلیه سفارشات و استعلام‌های فعال',
              'مشاهده کاتالوگ و پیشنهادهای اختصاصی صنعت‌پیش',
              'صدور فوری پیش‌فاکتور رسمی و خدمات هوشمند',
            ]}
          />
        </div>

        {/* Mobile Bottom Trust Strip */}
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
            <span>تضمین کیفیت</span>
          </div>
        </div>
      </div>
    </div>
  );
};
