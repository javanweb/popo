import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BRANDS } from '../data/brands';
import { BUSINESS_TYPES } from '../data/iranLocations';
import {
  Check,
  CheckCircle2,
  Copy,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Building2,
  Store,
  Factory,
  Wrench,
  Layers,
  Search,
  CheckCheck,
  ExternalLink,
} from 'lucide-react';

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    currentUser,
    latestCredentials,
    saveOnboardingStep1,
    saveOnboardingStep2,
    setLatestCredentials,
  } = useAuth();

  // If user has credentials in memory, start at screen 0 ('credentials').
  // Otherwise, determine step from currentUser status.
  const [step, setStep] = useState<'credentials' | 'brands' | 'businessType'>(() => {
    if (latestCredentials) {
      return 'credentials';
    }
    if (currentUser?.favoriteBrands && currentUser.favoriteBrands.length > 0) {
      return 'businessType';
    }
    return 'brands';
  });

  // Step 1: Brands state
  const [selectedBrands, setSelectedBrands] = useState<string[]>(() => {
    return currentUser?.favoriteBrands || ['swr', 'forza'];
  });
  const [brandSearch, setBrandSearch] = useState('');

  // Step 2: Business Type state
  const [selectedBusinessType, setSelectedBusinessType] = useState<string>(() => {
    return currentUser?.businessType || 'store';
  });

  // Credentials visibility & copied state
  const [showPassword, setShowPassword] = useState(false);
  const [copiedField, setCopiedField] = useState<'username' | 'password' | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already fully onboarded and no pending credentials, send to dashboard
  useEffect(() => {
    if (currentUser?.onboardingCompleted && !latestCredentials) {
      navigate('/account');
    }
  }, [currentUser, latestCredentials, navigate]);

  // Filtered Brands
  const filteredBrands = useMemo(() => {
    if (!brandSearch.trim()) return BRANDS;
    const q = brandSearch.toLowerCase().trim();
    return BRANDS.filter(
      b => b.name.toLowerCase().includes(q) ||
           b.nameEn.toLowerCase().includes(q) ||
           b.description.toLowerCase().includes(q)
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

  const handleStep1Submit = async () => {
    setIsSubmitting(true);
    try {
      await saveOnboardingStep1(selectedBrands);
      setStep('businessType');
    } catch {
      setStep('businessType');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStep2Submit = async () => {
    setIsSubmitting(true);
    try {
      await saveOnboardingStep2(selectedBusinessType);
      navigate('/account');
    } catch {
      navigate('/account');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#F4F4F5] via-[#DEE2E5]/30 to-[#F4F4F5] flex items-center justify-center">
      <div className="w-full max-w-3xl">
        {/* Progress Stepper Bar (for brands and businessType) */}
        {step !== 'credentials' && (
          <div className="mb-6 bg-white p-4 rounded-2xl border border-[#CBD2D8] shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-xl font-bold flex items-center justify-center text-xs transition-colors ${
                  step === 'brands' || selectedBrands.length > 0
                    ? 'bg-[#E06518] text-white shadow-md shadow-[#E06518]/25'
                    : 'bg-slate-100 text-[#777A7D]'
                }`}
              >
                ۱
              </div>
              <div>
                <p className="text-xs font-bold text-[#55565A]">مرحله اول</p>
                <p className="text-[11px] text-[#777A7D]">انتخاب برندهای تخصصی</p>
              </div>
            </div>

            <div className="flex-1 mx-4 h-1 bg-slate-200 rounded-full overflow-hidden">
              <div
                className={`h-full bg-[#E06518] transition-all duration-500 ${
                  step === 'businessType' ? 'w-full' : 'w-1/2'
                }`}
              />
            </div>

            <div className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-xl font-bold flex items-center justify-center text-xs transition-colors ${
                  step === 'businessType'
                    ? 'bg-[#E06518] text-white shadow-md shadow-[#E06518]/25'
                    : 'bg-slate-100 text-[#777A7D]'
                }`}
              >
                ۲
              </div>
              <div>
                <p className="text-xs font-bold text-[#55565A]">مرحله دوم</p>
                <p className="text-[11px] text-[#777A7D]">نوع کسب‌وکار</p>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STAGE 0: CREDENTIALS READY SCREEN («حساب کاربری شما آماده است»)           */}
        {/* ========================================================================= */}
        {step === 'credentials' && (
          <div className="bg-white rounded-3xl shadow-xl border border-[#CBD2D8] overflow-hidden animate-fadeIn">
            <div className="h-2 bg-gradient-to-r from-emerald-500 via-[#E06518] to-emerald-500" />
            <div className="p-6 sm:p-10 text-center">
              <div className="w-16 h-16 bg-emerald-100 border-2 border-emerald-300 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-md">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-[#55565A] mb-2">
                حساب کاربری شما آماده است
              </h2>
              <p className="text-xs sm:text-sm text-[#777A7D] max-w-md mx-auto leading-relaxed mb-8">
                حساب کاربری شما با موفقیت ایجاد شد. اطلاعات ورود شما:
              </p>

              {/* Credentials Box */}
              <div className="max-w-md mx-auto bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6 text-right space-y-4 shadow-inner mb-6">
                {/* Username */}
                <div>
                  <label className="block text-xs font-bold text-[#777A7D] mb-1">
                    نام کاربری اختصاصی:
                  </label>
                  <div className="flex items-center justify-between bg-white border border-[#CBD2D8] rounded-xl px-4 py-2.5">
                    <span className="font-mono font-black text-base text-[#55565A]" dir="ltr">
                      {latestCredentials?.username || currentUser?.username || 'atlas_client'}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(latestCredentials?.username || currentUser?.username || '', 'username')}
                      className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-[#E06518] transition-colors cursor-pointer flex items-center gap-1 text-xs"
                    >
                      {copiedField === 'username' ? (
                        <span className="text-emerald-600 flex items-center gap-1 font-bold">
                          <Check className="w-4 h-4" /> کپی شد
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <Copy className="w-4 h-4" /> کپی
                        </span>
                      )}
                    </button>
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-bold text-[#777A7D] mb-1">
                    رمز عبور اولیه:
                  </label>
                  <div className="flex items-center justify-between bg-white border border-[#CBD2D8] rounded-xl px-4 py-2.5">
                    <span className="font-mono font-black text-base text-[#E06518]" dir="ltr">
                      {showPassword
                        ? latestCredentials?.initialPassword || currentUser?.mobile || '09121234567'
                        : '•••••••••••'}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setShowPassword(p => !p)}
                        className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                        title={showPassword ? 'مخفی کردن' : 'نمایش رمز'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCopy(latestCredentials?.initialPassword || currentUser?.mobile || '', 'password')}
                        className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-[#E06518] transition-colors cursor-pointer flex items-center gap-1 text-xs"
                      >
                        {copiedField === 'password' ? (
                          <span className="text-emerald-600 flex items-center gap-1 font-bold">
                            <Check className="w-4 h-4" /> کپی شد
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <Copy className="w-4 h-4" /> کپی
                          </span>
                        )}
                      </button>
                    </div>
                  </div>
                  <p className="text-[10px] text-[#777A7D] mt-1">
                    * رمز عبور اولیه برابر با شماره موبایل شما تنظیم شده و در پنل کاربری قابل تغییر است.
                  </p>
                </div>
              </div>

              {/* SMS Dispatch Notice */}
              <div className="max-w-md mx-auto p-3.5 bg-emerald-50/80 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center gap-2.5 mb-8 text-right">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>
                  اطلاعات ورود شما به شماره همراه <strong>{currentUser?.phone || currentUser?.mobile}</strong> پیامک شد.
                </span>
              </div>

              {/* Continue to Onboarding Button */}
              <button
                type="button"
                onClick={() => setStep('brands')}
                className="w-full max-w-md h-12 bg-[#E06518] hover:bg-[#C95210] active:scale-[0.99] text-white font-black text-sm rounded-xl transition-all shadow-md shadow-[#E06518]/25 flex items-center justify-center gap-2 mx-auto cursor-pointer"
              >
                <span>ادامه و شخصی‌سازی حساب کاربری</span>
                <ArrowRight className="w-4 h-4 rotate-180" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STAGE 1: FAVORITE BRANDS SELECTION («به چه برندهایی علاقه دارید؟»)       */}
        {/* ========================================================================= */}
        {step === 'brands' && (
          <div className="bg-white rounded-3xl shadow-xl border border-[#CBD2D8] overflow-hidden animate-fadeIn">
            <div className="h-1.5 bg-[#E06518]" />
            <div className="p-6 sm:p-8">
              <div className="text-right mb-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-orange-50 border border-orange-200 text-[#E06518] text-xs font-bold mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>مرحله ۱ از ۲</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-[#55565A]">
                  به چه برندهایی علاقه دارید؟
                </h2>
                <p className="text-xs sm:text-sm text-[#777A7D] mt-1 leading-relaxed">
                  برندهای موردعلاقه خود را انتخاب کنید تا محصولات و پیشنهادهای مرتبط‌تری به شما نمایش دهیم.
                </p>
              </div>

              {/* Search input for brands */}
              <div className="relative mb-5">
                <input
                  type="text"
                  placeholder="جستجو در بین برندهای کاتالوگ صنعتی..."
                  value={brandSearch}
                  onChange={e => setBrandSearch(e.target.value)}
                  className="w-full h-11 px-3.5 pr-10 rounded-xl border border-[#CBD2D8] text-xs sm:text-sm text-[#55565A] bg-slate-50 focus:bg-white focus:outline-none focus:border-[#E06518]"
                />
                <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              </div>

              {/* Brands Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
                {filteredBrands.map(brand => {
                  const isSelected = selectedBrands.includes(brand.id);
                  return (
                    <div
                      key={brand.id}
                      onClick={() => toggleBrand(brand.id)}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer text-right relative select-none ${
                        isSelected
                          ? 'border-[#E06518] bg-orange-50/60 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span
                          className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs transition-colors ${
                            isSelected
                              ? 'bg-[#E06518] text-white'
                              : 'border border-slate-300 text-transparent'
                          }`}
                        >
                          <Check className="w-4 h-4" />
                        </span>
                        <div className="font-mono font-black text-sm text-[#55565A] bg-white px-2 py-0.5 rounded border border-slate-200" dir="ltr">
                          {brand.logo}
                        </div>
                      </div>

                      <h3 className="font-black text-sm text-[#55565A] mb-1">
                        {brand.name}
                      </h3>
                      <p className="text-[11px] text-[#777A7D] line-clamp-2 leading-relaxed">
                        {brand.description}
                      </p>

                      {brand.isExclusive && (
                        <div className="mt-2 text-[10px] font-bold text-[#E06518] flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#E06518]" />
                          <span>نماینده انحصاری بازرگانی اطلس</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Action Bar */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <span className="text-xs text-[#777A7D]">
                  {selectedBrands.length} برند انتخاب شده است
                </span>

                <button
                  type="button"
                  onClick={handleStep1Submit}
                  disabled={isSubmitting || selectedBrands.length === 0}
                  className="h-11 px-6 bg-[#E06518] hover:bg-[#C95210] active:scale-[0.99] text-white font-black text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-[#E06518]/25 flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>بعدی</span>
                  <ArrowRight className="w-4 h-4 rotate-180" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STAGE 2: BUSINESS TYPE («نوع کسب‌وکار شما کدام است؟»)                     */}
        {/* ========================================================================= */}
        {step === 'businessType' && (
          <div className="bg-white rounded-3xl shadow-xl border border-[#CBD2D8] overflow-hidden animate-fadeIn">
            <div className="h-1.5 bg-[#E06518]" />
            <div className="p-6 sm:p-8">
              <div className="text-right mb-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-orange-50 border border-orange-200 text-[#E06518] text-xs font-bold mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>مرحله ۲ از ۲</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-[#55565A]">
                  نوع کسب‌وکار شما کدام است؟
                </h2>
                <p className="text-xs sm:text-sm text-[#777A7D] mt-1 leading-relaxed">
                  با انتخاب نوع فعالیت، ضرایب تخفیف، دسته‌بندی قطعات و خدمات ویژه برای شما تنظیم خواهد شد.
                </p>
              </div>

              {/* Options (Single choice) */}
              <div className="space-y-3 mb-8">
                {BUSINESS_TYPES.map((bt, index) => {
                  const isSelected = selectedBusinessType === bt.id;
                  return (
                    <div
                      key={bt.id}
                      onClick={() => setSelectedBusinessType(bt.id)}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer text-right flex items-center justify-between select-none ${
                        isSelected
                          ? 'border-[#E06518] bg-orange-50/60 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 ${
                            isSelected
                              ? 'bg-[#E06518] text-white'
                              : 'bg-slate-100 text-[#777A7D]'
                          }`}
                        >
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="font-bold text-sm text-[#55565A] mb-0.5">
                            {bt.title}
                          </h3>
                          <p className="text-[11px] text-[#777A7D]">
                            {bt.description}
                          </p>
                        </div>
                      </div>

                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors shrink-0 ${
                          isSelected
                            ? 'border-[#E06518] bg-[#E06518] text-white'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Navigation Bar */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setStep('brands')}
                  className="h-11 px-4 text-xs font-bold text-[#777A7D] hover:text-[#55565A] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowRight className="w-4 h-4" />
                  <span>مرحله قبل</span>
                </button>

                <button
                  type="button"
                  onClick={handleStep2Submit}
                  disabled={isSubmitting}
                  className="h-11 px-6 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-black text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-emerald-600/25 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <span>ورود به اطلس</span>
                  <ArrowRight className="w-4 h-4 rotate-180" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
