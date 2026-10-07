import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AuthVisualSidePanel } from '../components/auth/AuthVisualSidePanel';
import { STORE_ASSETS } from '../assets/images';
import { IRAN_PROVINCES, ACTIVITY_FIELDS } from '../data/iranLocations';
import { normalizeIranianMobile, generateBaseUsername } from '../utils/usernameGenerator';
import {
  User,
  Building2,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Search,
  Check,
  CheckCircle2,
  Lock,
  ChevronDown,
  Globe,
  Truck,
  Factory,
  UserPlus,
} from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { registerUser } = useAuth();

  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [provinceId, setProvinceId] = useState('yazd');
  const [cityId, setCityId] = useState('yazd-yazd');
  const [activityField, setActivityField] = useState<string>('صنایع کاشی، سرامیک و لعاب');
  const [activitySearch, setActivitySearch] = useState('');
  const [isActivityOpen, setIsActivityOpen] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(true);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const TOP_INDUSTRIES = [
    'صنایع کاشی، سرامیک و لعاب',
    'فولاد، ریخته‌گری و متالورژی',
    'نساجی، بافندگی و ریسندگی',
    'صنایع غذایی و بسته‌بندی',
    'نفت، گاز و پتروشیمی',
    'سیمان، بتن و معدن',
  ];

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

  const mobileValidation = useMemo(() => {
    if (!mobile.trim()) return null;
    return normalizeIranianMobile(mobile.trim());
  }, [mobile]);

  const filteredActivities = useMemo(() => {
    if (!activitySearch.trim()) return ACTIVITY_FIELDS;
    return ACTIVITY_FIELDS.filter(a =>
      a.toLowerCase().includes(activitySearch.toLowerCase().trim())
    );
  }, [activitySearch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim() || !companyName.trim()) {
      setErrorMessage('لطفاً نام و نام خانوادگی و نام شرکت یا فروشگاه خود را وارد فرمایید.');
      return;
    }

    const check = normalizeIranianMobile(mobile);
    if (!check.isValid) {
      setErrorMessage(check.error || 'شماره موبایل وارد شده معتبر نمی‌باشد.');
      return;
    }

    if (email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
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
        email: email.trim() || undefined,
        companyName: companyName.trim(),
        provinceId,
        cityId,
        province: selectedProvince.name,
        city: selectedCity?.name || selectedProvince.name,
        activityField,
      });

      if (res.success && res.user) {
        navigate('/onboarding');
      } else {
        setErrorMessage(res.message || 'خطا در ثبت نام.');
        if (res.message?.includes('قبلاً ثبت شده')) {
          setTimeout(() => {
            navigate(`/login?mobile=${encodeURIComponent(check.normalized)}`);
          }, 2000);
        }
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'خطا در برقراری ارتباط با سرور.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] py-4 sm:py-12 px-2 sm:px-6 lg:px-8 bg-gradient-to-b from-[#F4F4F5] via-[#DEE2E5]/30 to-[#F4F4F5] flex items-center justify-center text-right">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col md:grid md:grid-cols-12 relative">
        {/* Mobile Top Hero Header */}
        <div className="md:hidden relative w-full h-48 bg-[#12161f] text-white overflow-hidden shrink-0 select-none">
          <img
            src={STORE_ASSETS.bannerAuthRegister || STORE_ASSETS.authIndustrialHero}
            alt="صنعت‌پیش"
            className="absolute inset-0 w-full h-full object-cover object-center opacity-45 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#12161f] via-[#12161f]/60 to-[#12161f]/80" />

          {/* Top Bar Header */}
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
              به خانواده صنعت‌پیش بپیوندید
            </h2>
            <p className="text-[11px] text-slate-200 leading-relaxed max-w-xs mx-auto">
              با ثبت‌نام در سامانه صنعت‌پیش، به قیمت‌های ویژه، مشاوره تخصصی و پیشنهادهای متناسب با نیاز صنعتی خود دسترسی پیدا کنید.
            </p>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="col-span-1 md:col-span-7 p-5 sm:p-8 lg:p-10 flex flex-col justify-between relative bg-white order-1 -mt-6 md:mt-0 rounded-t-[32px] md:rounded-t-none z-10 shadow-2xl md:shadow-none">
          <div className="space-y-4">
            {/* Desktop Header Titles */}
            <div className="hidden md:block">
              <span className="text-xs font-bold text-[#777A7D] block mb-1">
                عضویت سریع و هوشمند
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-[#55565A] tracking-tight">
                <span className="text-[#E06518]">ایجاد</span> حساب کاربری
              </h1>
              <p className="text-xs sm:text-sm text-[#777A7D] mt-1 leading-relaxed">
                با ثبت‌نام در سامانه صنعت‌پیش، به قیمت‌های ویژه و مشاوره تخصصی دسترسی پیدا کنید.
              </p>
            </div>

            {/* Segmented Switcher Tab */}
            <div className="flex items-center p-1.5 bg-slate-100/90 rounded-2xl border border-[#CBD2D8] text-xs font-bold gap-1 mb-2">
              <Link
                to="/login"
                className="btn-atlas-secondary border-none flex-1 py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>ورود</span>
              </Link>

              <button
                type="button"
                className="btn-atlas-primary flex-1 py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all font-bold text-xs shadow-sm cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>ثبت نام</span>
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700 flex items-start gap-2 animate-shake">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3 pt-0.5">
              {/* Full Name Input */}
              <div>
                <label className="block text-xs font-bold text-[#55565A] mb-1">
                  نام و نام خانوادگی <span className="text-[#E06518]">*</span>
                </label>
                <div className="flex items-center justify-between bg-slate-50/90 hover:bg-slate-50 focus-within:bg-white border border-[#CBD2D8] focus-within:border-[#E06518] focus-within:ring-4 focus-within:ring-[#E06518]/15 rounded-2xl px-3.5 py-2.5 transition-all">
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
                  {mobileValidation?.isValid && (
                    <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
                      <Check className="w-3 h-3" /> معتبر
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between bg-slate-50/90 hover:bg-slate-50 focus-within:bg-white border border-[#CBD2D8] focus-within:border-[#E06518] focus-within:ring-4 focus-within:ring-[#E06518]/15 rounded-2xl px-3.5 py-2.5 transition-all">
                  <input
                    type="tel"
                    inputMode="numeric"
                    dir="ltr"
                    required
                    placeholder="0912 345 6789"
                    value={mobile}
                    onChange={e => setMobile(e.target.value)}
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
                <div className="flex items-center justify-between bg-slate-50/90 hover:bg-slate-50 focus-within:bg-white border border-[#CBD2D8] focus-within:border-[#E06518] focus-within:ring-4 focus-within:ring-[#E06518]/15 rounded-2xl px-3.5 py-2.5 transition-all">
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
                  <div className="flex items-center justify-between text-[11px] px-3 py-1.5 mt-1.5 rounded-xl bg-orange-50 text-orange-900 border border-orange-200/80 animate-fadeIn">
                    <span className="text-slate-600">نام کاربری اختصاصی:</span>
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
                    onClick={() => setIsActivityOpen(prev => !prev)}
                    className="border border-[#CBD2D8] bg-slate-50 hover:bg-white rounded-2xl px-3.5 py-2.5 cursor-pointer flex items-center justify-between hover:border-[#E06518] transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-slate-400" />
                      <span className="text-xs text-slate-800 font-bold">{activityField}</span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </div>

                  {isActivityOpen && (
                    <div className="absolute top-full right-0 left-0 mt-1 bg-white border border-[#CBD2D8] rounded-2xl shadow-xl z-50 p-2 max-h-56 overflow-y-auto">
                      <div className="flex items-center gap-2 p-2 border-b border-slate-100 mb-1">
                        <Search className="w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          placeholder="جستجو در زمینه فعالیت..."
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
                          {activityField === act && <Check className="w-4 h-4 text-[#E06518]" />}
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
                <div className="flex items-center justify-between bg-slate-50/90 hover:bg-slate-50 focus-within:bg-white border border-[#CBD2D8] focus-within:border-[#E06518] rounded-2xl px-3.5 py-2 transition-all">
                  <input
                    type="email"
                    dir="ltr"
                    placeholder="info@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
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
                  با ثبت‌نام، موافقت خود را با <strong className="text-[#E06518] font-bold">قوانین و مقررات</strong> اعلام می‌کنم.
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
                    <span>ثبت نام</span>
                  </>
                )}
              </button>
            </form>

            {/* Footer Link */}
            <div className="pt-3 border-t border-slate-100 text-center text-xs text-slate-500">
              <span>قبلاً ثبت‌نام کرده‌اید؟ </span>
              <Link
                to="/login"
                className="font-black text-[#E06518] hover:underline"
              >
                ورود به حساب کاربری
              </Link>
            </div>
          </div>
        </div>

        {/* Left Side Visual Panel */}
        <div className="hidden md:block md:col-span-5 relative order-2">
          <AuthVisualSidePanel
            bgImage={STORE_ASSETS.bannerAuthRegister}
            badgeText="به خانواده صنعت‌پیش بپیوندید"
            customTitle="به خانواده صنعت‌پیش بپیوندید"
            customDescription="با ثبت‌نام در سامانه صنعت‌پیش، به قیمت‌های ویژه، مشاوره تخصصی و پیشنهادهای متناسب با نیاز صنعتی خود دسترسی پیدا کنید."
            highlights={[
              'قیمت‌های ویژه و تعرفه اختصاصی همکاران',
              'مشاوره رایگان مهندسین و کارشناسان ارشد صنعت‌پیش',
              'پیشنهادها و تخفیف‌های متناسب با نیاز صنعتی شما',
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
