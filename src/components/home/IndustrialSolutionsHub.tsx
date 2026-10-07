import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Cpu, Scan, Activity, Sparkles, Camera } from 'lucide-react';
import { STORE_ASSETS } from '../../assets/images';

interface IndustrialSolutionsHubProps {
  onOpenVisualSearch: () => void;
  onOpenConsult: () => void;
}

export const IndustrialSolutionsHub: React.FC<IndustrialSolutionsHubProps> = ({
  onOpenVisualSearch,
  onOpenConsult,
}) => {
  const solutions = [
    {
      id: 1,
      index: '۰۱',
      tag: 'انبارش استراتژیک و دپوی مکانیزه',
      title: 'ذخیره اضطراری قطعات بحرانی خطوط تولید',
      desc: 'نگهداری و دپوی اختصاصی قطعات استراتژیک کارخانجات طرف قرارداد در انبار مرکزی صنعت‌پیش جهت ارسال اورژانسی زیر ۱۲ ساعت.',
      image: STORE_ASSETS.partsWarehouseVault,
      badge: 'تحویل فوری < ۱۲h',
      icon: Cpu,
      iconColor: 'text-[#E06518]',
      ctaText: 'استعلام قطعات استراتژیک',
      action: onOpenConsult,
    },
    {
      id: 2,
      index: '۰۲',
      tag: 'اسکن نوری سه‌بعدی و متالوژی',
      title: 'مهندسی معکوس و ساخت قطعات تحریمی و کمیاب',
      desc: 'اندازه‌برداری میکرومتری و اسکن اپتیکال قطعات مستهلک و تولید مجدد بر اساس استانداردهای دقیق آلیاژ و تلرانس DIN آلمان.',
      image: STORE_ASSETS.reverseEngineeringLab,
      badge: 'دقت ±۰.۰۱ میلیمتر',
      icon: Scan,
      iconColor: 'text-[#0284C7]',
      ctaText: 'ارسال تصویر یا نمونه قطعه',
      action: onOpenVisualSearch,
    },
    {
      id: 3,
      index: '۰۳',
      tag: 'پایش پارامترهای کارکرد و ارتعاش',
      title: 'ارزیابی لرزش، سایش و افزایش طول عمر قطعه',
      desc: 'بررسی علل استهلاک زودهنگام تسمه‌ها، بیرینگ‌ها و شیرآلات تحت فشار در خطوط سیمان، فولاد و کاشی توسط مهندسین ارشد.',
      image: STORE_ASSETS.predictiveMaintenanceSensor,
      badge: 'پشتیبانی فنی مقیم',
      icon: Activity,
      iconColor: 'text-[#E06518]',
      ctaText: 'درخواست کارشناسی فنی',
      action: onOpenConsult,
    },
  ];

  return (
    <section className="relative w-full py-20 sm:py-28 bg-white text-slate-900 border-b border-slate-200/80 overflow-hidden" dir="rtl">
      {/* Subtle Engineered Background Technical Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#12203c08_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16 relative z-10">
        
        {/* 1. TOP EDITORIAL HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-slate-200">
          <div className="space-y-3 text-right max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-bold text-[#E06518]">
              <span className="w-8 h-0.5 bg-[#E06518] rounded-full" />
              <span>زیرساخت هوشمند و خدمات مهندسی ارزش‌افزوده</span>
            </div>
            <h2 className="text-2xl sm:text-4xl lg:text-[42px] font-black leading-[1.25] tracking-tight text-[#12203C]">
              فراتر از تأمین قطعه؛{' '}
              <span className="text-[#E06518]">
                راهکارهای جامع مهندسی صنایع
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
              صنعت‌پیش با ادغام مهندسی معکوس، دپوی مکانیزه قطعات کمیاب و پشتیبانی فنی ۲۴ ساعته، خطوط تولید بزرگ کشور را در برابر هرگونه ریسک توقف ناگهانی ایمن می‌سازد.
            </p>
          </div>

          {/* Direct Link to Capabilities */}
          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/about"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#12203C] hover:text-[#E06518] transition-colors group"
            >
              <span>مشاهده استانداردهای فنی و گواهی‌ها</span>
              <ArrowLeft className="w-4 h-4 text-[#E06518] group-hover:-translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* 2. 3 HIGH-IMPACT GRAPHICAL MASTER CARDS ON WHITE BACKGROUND */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {solutions.map((item) => {
            const IconComp = item.icon;
            return (
              <div
                key={item.id}
                className="relative rounded-3xl overflow-hidden bg-white border border-slate-200/90 hover:border-[#E06518] group shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col justify-between"
              >
                {/* Image Showcase Container */}
                <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-[#0A101D]">
                  <img
                    src={item.image}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent" />

                  {/* Top Floating Badge */}
                  <div className="absolute top-4 right-4 left-4 flex items-center justify-between">
                    <span className="px-3.5 py-1.5 rounded-full bg-[#12203C]/90 backdrop-blur-md border border-white/20 text-[11px] font-bold text-white shadow-md">
                      {item.tag}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-[#E06518] text-white text-[10px] font-mono font-black backdrop-blur-md shadow-sm">
                      {item.badge}
                    </span>
                  </div>

                  {/* Corner Visual Icon */}
                  <div className="absolute bottom-4 right-5 w-12 h-12 rounded-2xl bg-[#12203C]/95 backdrop-blur-md border border-white/25 flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform">
                    <IconComp className={`w-6 h-6 ${item.iconColor}`} />
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="p-6 sm:p-7 space-y-4 flex-1 flex flex-col justify-between text-right">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-400">
                      <span>بخش مهندسی {item.index}</span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-black text-[#12203C] leading-snug group-hover:text-[#E06518] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-normal">
                      {item.desc}
                    </p>
                  </div>

                  {/* Card Action Trigger Button */}
                  <div className="pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={item.action}
                      className="w-full py-3 px-4 rounded-xl bg-slate-50 hover:bg-[#E06518] text-[#12203C] hover:text-white border border-slate-200 hover:border-[#E06518] text-xs font-bold transition-all duration-300 flex items-center justify-between cursor-pointer group/btn shadow-2xs"
                    >
                      <span>{item.ctaText}</span>
                      <ArrowLeft className="w-4 h-4 group-hover/btn:-translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 3. INTEGRATED FAST-TRACK DIAGNOSTIC GATEWAY ON DEEP NAVY CANVAS */}
        <div className="relative rounded-3xl overflow-hidden bg-[#12203C] text-white border border-slate-800 p-6 sm:p-8 lg:p-10 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-6">
            {/* Right: Explanatory & Value Headline */}
            <div className="lg:col-span-7 space-y-2 text-right">
              <div className="flex items-center gap-2 text-xs font-bold text-orange-400">
                <Sparkles className="w-4 h-4" />
                <span>سامانه شناسایی هوشمند و صدور پیش‌فاکتور آنی</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white leading-snug">
                نیاز به شناسایی سریع پارت‌نامبر یا تطبیق ابعادی قطعه دارید؟
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                تنها با ارسال تصویر قطعه مستهلک یا نقشه فنی، مشخصات قطعه استاندارد فابریک را از مهندسین صنعت‌پیش دریافت کنید.
              </p>
            </div>

            {/* Left: 2 Fast Action Buttons */}
            <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col xl:flex-row items-stretch gap-3">
              <button
                type="button"
                onClick={onOpenVisualSearch}
                className="h-12 px-6 bg-gradient-to-r from-[#C95210] to-[#E06518] hover:from-[#C2410C] hover:to-[#C95210] text-white font-bold text-xs sm:text-sm rounded-xl shadow-[0_4px_16px_rgba(224,101,24,0.3)] hover:scale-[1.02] transition-all flex items-center justify-center gap-2.5 cursor-pointer active:scale-95 shrink-0"
              >
                <Camera className="w-4 h-4" />
                <span>ارسال تصویر با هوش مصنوعی</span>
              </button>

              <button
                type="button"
                onClick={onOpenConsult}
                className="h-12 px-5 bg-white/10 hover:bg-white/15 text-white font-bold text-xs sm:text-sm rounded-xl border border-white/20 hover:border-white/40 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 shrink-0"
              >
                <span>مشاوره مستقیم مهندسی</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
