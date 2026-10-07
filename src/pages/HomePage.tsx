import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Camera,
  Sparkles,
  Headphones,
  Shield,
  ShieldCheck,
  Building,
  Truck,
  Award,
  Share2,
  FileText,
  Calculator,
  Flame,
  Phone,
  CheckCircle2,
  Factory,
  Zap,
  Cpu,
  Gem,
  Wheat,
  Play,
  Mouse,
  Settings,
  Clock,
} from 'lucide-react';
import { STORE_ASSETS } from '../assets/images';
import { AiVisualPartSearchModal } from '../components/search/AiVisualPartSearchModal';
import { AiConsultModal } from '../components/search/AiConsultModal';
import { OurClientsSection } from '../components/home/OurClientsSection';
import { PopularProductsSection } from '../components/home/PopularProductsSection';
import { MainBrandsBanner } from '../components/home/MainBrandsBanner';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  // Modals state
  const [isVisualSearchOpen, setIsVisualSearchOpen] = useState(false);
  const [isConsultOpen, setIsConsultOpen] = useState(false);

  // Active Why SanatPish interactive card
  const [activeWhyIndex, setActiveWhyIndex] = useState(0);

  // Hero Slider
  const [activeSlide, setActiveSlide] = useState(1);
  const totalSlides = 3;

  // Window scroll tracking for Parallax, Headline fade/shift, Sticky Advantages bar, and Scroll Indicator line
  const [scrollY, setScrollY] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleWindowScroll = () => {
      const currentScroll = window.scrollY;
      setScrollY(currentScroll);

      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress(Math.min(1, Math.max(0, currentScroll / totalHeight)));
      }
    };

    window.addEventListener('scroll', handleWindowScroll, { passive: true });
    handleWindowScroll();

    return () => window.removeEventListener('scroll', handleWindowScroll);
  }, []);

  // ---------------------------------------------------------------------------
  // Hero Carousel Data & Automatic 5s Slide Switching
  // ---------------------------------------------------------------------------
  const [heroSlideIndex, setHeroSlideIndex] = useState(0);

  interface HeroSlideItem {
    id: number;
    image: string;
    tag: string;
    eyebrow: string;
    titlePart1: string;
    titlePart2: string;
    description: string;
    statsBadge: {
      value: string;
      label: string;
    };
    primaryBtn: {
      text: string;
      link?: string;
      action?: 'visualSearch' | 'consult';
    };
    secondaryBtn: {
      text: string;
      link?: string;
      action?: 'visualSearch' | 'consult';
    };
    badge: {
      title: string;
      subtitle: string;
    };
  }

  const heroSlides: HeroSlideItem[] = [
    {
      id: 1,
      image: STORE_ASSETS.heroSteelCoils || STORE_ASSETS.heroPulley,
      tag: 'تأمین پایدار خطوط تولید',
      eyebrow: 'تأمین قطعات صنعتی با کیفیت، قیمت رقابتی، برای آینده‌ای مطمئن',
      titlePart1: 'همراه صنعتگران',
      titlePart2: 'در مسیر رشد و پیشرفت',
      description:
        'ارائه‌دهنده قطعات و تجهیزات صنعتی با کیفیت از معتبرترین برندهای جهانی با تأمین مطمئن، قیمت رقابتی و پشتیبانی تخصصی خطوط تولید کارخانجات.',
      statsBadge: {
        value: '+۱۸,۰۰۰',
        label: 'پارت‌نامبر موجود در انبار',
      },
      primaryBtn: {
        text: 'مشاهده محصولات و کاتالوگ',
        link: '/products',
      },
      secondaryBtn: {
        text: 'درخواست مشاوره فنی',
        action: 'consult',
      },
      badge: {
        title: 'تجربه‌ی موفق همکاری با صنایع پیشرو',
        subtitle: 'کیفیت، سرعت، اعتماد',
      },
    },
    {
      id: 2,
      image: STORE_ASSETS.forzaSwrDualBanner || STORE_ASSETS.heroPulley,
      tag: 'نمایندگی رسمی و انحصاری',
      eyebrow: 'نمایندگی انحصاری برترین برندهای صنعتی اروپا و آسیا',
      titlePart1: 'سیستم‌های انتقال قدرت',
      titlePart2: 'با استاندارد FORZA و SWR',
      description:
        'تأمین مستقیم انواع پولی‌های صنعتی، فلکه چدنی، تسمه‌های دنده‌ای و شیاردار با بالاترین بازدهی گشتاور، برگه آنالیز متریال و طول عمر مکانیکی تضمین‌شده.',
      statsBadge: {
        value: 'DIN / ISO',
        label: 'استاندارد بین‌المللی متالوژی',
      },
      primaryBtn: {
        text: 'مشاهده قطعات FORZA و SWR',
        link: '/category/swr-forza-exclusive',
      },
      secondaryBtn: {
        text: 'استعلام فوری قیمت و موجودی',
        action: 'consult',
      },
      badge: {
        title: 'تضمین اصالت قطعات و گارانتی تعویض',
        subtitle: 'استاندارد DIN آلمان و اروپا',
      },
    },
    {
      id: 3,
      image: STORE_ASSETS.partsWarehouseVault || STORE_ASSETS.heroBanner,
      tag: 'انبار مرکزی و دپوی استراتژیک',
      eyebrow: 'شبکه توزیع و لجستیک اکسپرس در سراسر کشور',
      titlePart1: 'توقف خط تولید، هرگز!',
      titlePart2: 'ارسال فوری در کمتر از ۲۴ ساعت',
      description:
        'دپوی مستمر بیش از ۱۸,۰۰۰ قلم قطعات پرمصرف کارخانجات و ارسال سریع با ناوگان اختصاصی و باربری‌های فوری به تمامی شهرک‌های صنعتی ایران.',
      statsBadge: {
        value: '< ۲۴h',
        label: 'تحویل در محل کارخانه',
      },
      primaryBtn: {
        text: 'ارسال تصویر قطعه با هوش مصنوعی',
        action: 'visualSearch',
      },
      secondaryBtn: {
        text: 'تماس با واحد فروش فوری',
        action: 'consult',
      },
      badge: {
        title: 'ارسال فوری و اکسپرس به سراسر کشور',
        subtitle: 'پشتیبانی ۲۴ ساعته خطوط تولید',
      },
    },
    {
      id: 4,
      image: STORE_ASSETS.reverseEngineeringLab || STORE_ASSETS.whySanatCadEngineering,
      tag: 'مهندسی معکوس و کنترل کیفیت',
      eyebrow: 'سامانه مکانیزه شناسایی هوشمند و ساخت قطعات سفارشی',
      titlePart1: 'تطبیق مهندسی مکانیک',
      titlePart2: 'و ساخت قطعات خطوط تولید',
      description:
        'اسکن سه‌بعدی اپتیکال، آنالیز متالوژی آلیاژها و ساخت دقیق قطعات تحریمی یا نایاب خطوط با بالاترین دقت میکرومتری و گارانتی کتبی تعویض.',
      statsBadge: {
        value: '۱۰۰٪',
        label: 'تطبیق با نقشه فابریک',
      },
      primaryBtn: {
        text: 'ارسال نقشه و استعلام ساخت',
        action: 'consult',
      },
      secondaryBtn: {
        text: 'مشاهده دسته‌بندی قطعات',
        link: '/categories',
      },
      badge: {
        title: 'آزمایشگاه کنترل کیفیت و متالوژی',
        subtitle: 'تست‌های NDT و سختی‌سنجی',
      },
    },
  ];

  // 5-second automatic slide interval
  useEffect(() => {
    const timer = setInterval(() => {
      setHeroSlideIndex((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const handleNextSlide = () => {
    setHeroSlideIndex((prev) => (prev + 1) % heroSlides.length);
  };

  const handlePrevSlide = () => {
    setHeroSlideIndex((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  // Mobile Touch Gestures for Hero Carousel
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const diff = touchStartX.current - touchEndX.current;
    // In RTL, swipe left (diff > 40) moves forward to next slide
    if (diff > 40) {
      handleNextSlide();
    } else if (diff < -40) {
      handlePrevSlide();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Industries carousel scroll tracking
  const industriesScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkIndustriesScroll = () => {
    const el = industriesScrollRef.current;
    if (!el) return;
    // In RTL, scrollLeft can be 0 at initial state or negative/positive depending on browser implementation
    // When user scrolls to left (forward in carousel), scroll offset changes from initial 0
    const scrolled = Math.abs(el.scrollLeft) > 10;
    setCanScrollRight(scrolled);
  };

  const handleScrollLeft = () => {
    const el = industriesScrollRef.current;
    if (el) {
      // In RTL, scrolling "left" (forward) is done with negative or positive depending on layout
      el.scrollBy({ left: -320, behavior: 'smooth' });
      // Immediately reveal right button
      setCanScrollRight(true);
    }
  };

  const handleScrollRight = () => {
    const el = industriesScrollRef.current;
    if (el) {
      el.scrollBy({ left: 320, behavior: 'smooth' });
      setTimeout(checkIndustriesScroll, 350);
    }
  };

  // 8 Categories matching production line catalog
  const categories = [
    {
      id: 1,
      title: 'قطعات و سیستم‌های انتقال قدرت',
      image: STORE_ASSETS.categories.transmission,
      link: '/category/power-transmission',
    },
    {
      id: 2,
      title: 'تسمه‌های خط تولید و کانوایر',
      image: STORE_ASSETS.categories.belts,
      link: '/category/industrial-belts',
    },
    {
      id: 3,
      title: 'کاشی، سرامیک و رولرهای کوره',
      image: STORE_ASSETS.products.ceramicParts,
      link: '/category/ceramic-tiles',
    },
    {
      id: 4,
      title: 'پولی، فلکه و بوش قفل‌کننده',
      image: STORE_ASSETS.categories.pulleys,
      link: '/category/pulleys-idlers',
    },
    {
      id: 5,
      title: 'بلبرینگ، رولبرینگ و یاتاقان',
      image: STORE_ASSETS.categories.bearings,
      link: '/category/bearings-bushings',
    },
    {
      id: 6,
      title: 'زنجیر و چرخ زنجیر خطوط انتقال',
      image: STORE_ASSETS.categories.chains,
      link: '/category/chains-sprockets',
    },
    {
      id: 7,
      title: 'تجهیزات و تسمه‌های نساجی',
      image: STORE_ASSETS.categories.conveyor,
      link: '/category/textile-machinery',
    },
    {
      id: 8,
      title: 'محصولات انحصاری SWR و FORZA',
      image: STORE_ASSETS.heroPulley,
      link: '/category/swr-forza-exclusive',
    },
  ];

  // 7 Covered Industries matching reference screenshot exactly
  const coveredIndustries = [
    {
      id: 1,
      title: 'سیمان و فولاد',
      image: STORE_ASSETS.industries.cement,
      icon: Factory,
      link: '/category/cement-industry',
    },
    {
      id: 2,
      title: 'صنایع غذایی',
      image: STORE_ASSETS.industries.foodBottles,
      icon: Wheat,
      link: '/category/food-industry',
    },
    {
      id: 3,
      title: 'معادن',
      image: STORE_ASSETS.industries.miningTruck,
      icon: Gem,
      link: '/category/mining-steel',
    },
    {
      id: 4,
      title: 'نساجی',
      image: STORE_ASSETS.industries.textile,
      icon: Cpu,
      link: '/category/textile-machinery',
    },
    {
      id: 5,
      title: 'کاشی و سرامیک',
      image: STORE_ASSETS.industries.ceramic,
      icon: Flame,
      link: '/category/ceramic-tiles',
    },
    {
      id: 6,
      title: 'نیرو و انرژی',
      image: STORE_ASSETS.industries.powerCooling,
      icon: Zap,
      link: '/category/power-energy',
    },
    {
      id: 7,
      title: 'تولیدی و ساخت',
      image: STORE_ASSETS.industries.robotArm,
      icon: Factory,
      link: '/category/manufacturing',
    },
  ];

  // 4 Minimal & Visual Core Pillars for Why SanatPish (چرا صنعت‌پیش؟ - مینیمال، بصری و مدرن)
  const whySanatPishItems = [
    {
      id: 0,
      title: 'تضمین ۱۰۰٪ اصالت و شناسنامه فنی کالا',
      desc: 'ارائه برگه آنالیز متریال، سرتیفیکیت معتبر و گارانتی کتبی تعویض بی‌قید و شرط.',
      metric: '۱۰۰٪',
      metricLabel: 'ضمانت اصالت و سلامت قطعه',
      image: STORE_ASSETS.engineerWhyAtlas,
      icon: ShieldCheck,
    },
    {
      id: 1,
      title: 'تأمین مستقیم و قیمت کارخانه',
      desc: 'واردات و پخش مستقیم از خطوط تولید جهانی با صدور فاکتور رسمی و بدون واسطه.',
      metric: '۲۵٪-',
      metricLabel: 'صرفه‌جویی در هزینه‌های تدارکات',
      image: STORE_ASSETS.heroPulley,
      icon: Shield,
    },
    {
      id: 2,
      title: 'مشاوره فنی و تطبیق مهندسی',
      desc: 'بررسی نقشه‌ها و شرایط خط تولید توسط مهندسین مکانیک پیش از ثبت سفارش.',
      metric: 'رایگان',
      metricLabel: 'پشتیبانی فنی مهندسین مقیم',
      image: STORE_ASSETS.ctaConsultBanner,
      icon: Headphones,
    },
    {
      id: 3,
      title: 'موجودی پایدار و ارسال ۲۴ ساعته',
      desc: 'دپوی مستمر در انبار مرکزی و ارسال اکسپرس به تمامی شهرک‌های صنعتی سراسر کشور.',
      metric: '< ۲۴h',
      metricLabel: 'ارسال سفارشات اورژانسی',
      image: STORE_ASSETS.heroBanner,
      icon: Truck,
    },
  ];

  return (
    <div className="w-full text-right font-sans pb-12 overflow-x-hidden relative">
      {/* ========================================================================= */}
      {/* 0. VERTICAL ORANGE SCROLL INDICATOR LINE (میزان اسکرول صفحه)              */}
      {/* ========================================================================= */}
      <div 
        className="fixed top-0 right-0 z-50 w-1 h-full pointer-events-none bg-[#12203C]/15"
        title="شاخص پیمایش صفحه"
      >
        {/* Glowing Orange Fill Line */}
        <div
          className="w-full bg-gradient-to-b from-[#C95210] via-[#E06518] to-[#FF8C00] shadow-[0_0_8px_#E06518] transition-all duration-75"
          style={{ height: `${Math.round(scrollProgress * 100)}%` }}
        />
      </div>

      {/* ========================================================================= */}
      {/* 1. HERO SECTION - RESPONSIVE CINEMATIC DESKTOP & DEDICATED MOBILE BANNER   */}
      {/* ========================================================================= */}
      <section
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="relative w-full overflow-hidden bg-white lg:bg-[#12203C] text-[#37383b] lg:text-white border-b border-slate-200 lg:border-slate-800/80 min-h-[520px] sm:min-h-[580px] lg:min-h-[820px] xl:min-h-[860px] flex flex-col justify-between select-none"
      >
        {/* DESKTOP BACKGROUND: Factory Images with Smooth Cross-Fade & Parallax */}
        {heroSlides.map((slide, idx) => {
          const isActive = idx === heroSlideIndex;
          return (
            <div
              key={`desktop-bg-${slide.id}`}
              className={`hidden lg:block absolute -top-10 -bottom-10 inset-x-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out will-change-transform ${
                isActive ? 'opacity-100 z-0' : 'opacity-0 -z-10'
              }`}
              style={{
                backgroundImage: `url(${slide.image})`,
                transform: `translateY(${Math.min(120, scrollY * 0.26)}px) scale(1.04)`,
              }}
            />
          );
        })}

        {/* DESKTOP OVERLAYS: Cinematic gradients allowing vibrant image clarity with crisp text readability */}
        <div className="hidden lg:block absolute inset-0 bg-gradient-to-l from-black/85 via-black/45 to-transparent pointer-events-none" />
        <div className="hidden lg:block absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
        <div className="hidden lg:block absolute bottom-0 left-1/4 w-[500px] h-[180px] bg-gradient-to-t from-orange-600/20 via-amber-500/10 to-transparent blur-3xl pointer-events-none" />

        {/* Top & Middle Content Container */}
        <div className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 lg:pt-20 pb-6 sm:pb-10 lg:pb-12 flex-1 flex flex-col justify-center">
          
          {/* ================================================================= */}
          {/* DESKTOP VIEW (lg+): ORIGINAL FULL-BLEED CINEMATIC HERO LAYOUT     */}
          {/* ================================================================= */}
          <div className="hidden lg:block">
            <div
              key={`desktop-hero-${heroSlideIndex}`}
              className="max-w-xl lg:max-w-2xl space-y-4 sm:space-y-6 transition-all duration-500 ease-out animate-in fade-in slide-in-from-right-3"
            >
              {/* Top Eyebrow Tag */}
              <div className="flex items-center gap-2 justify-start">
                <span className="w-6 sm:w-8 h-[2px] bg-[#E06518]" />
                <span className="text-[11px] sm:text-[13px] font-bold text-orange-400/90 tracking-wide line-clamp-1">
                  {heroSlides[heroSlideIndex].eyebrow}
                </span>
              </div>

              {/* Main Headline (With Fade & Shift to Right on Scroll) */}
              <div
                className="transition-all duration-100 ease-out will-change-transform"
                style={{
                  opacity: Math.max(0, 1 - scrollY / 320),
                  transform: `translateX(${Math.min(70, scrollY * 0.2)}px)`,
                }}
              >
                <h1 className="text-3xl sm:text-5xl lg:text-[56px] font-black leading-[1.25] sm:leading-[1.18] tracking-tight text-white drop-shadow-md">
                  <span>{heroSlides[heroSlideIndex].titlePart1}</span>
                  <span className="block text-[#E06518] pt-1.5">{heroSlides[heroSlideIndex].titlePart2}</span>
                </h1>
              </div>

              {/* Action Buttons & Subtitle */}
              <div className="pt-2 sm:pt-4 space-y-3.5 sm:space-y-5">
                {/* Subtitle Description */}
                <p className="text-xs sm:text-[15px] text-slate-200/95 leading-relaxed max-w-xl font-normal min-h-[38px] sm:min-h-[48px]">
                  {heroSlides[heroSlideIndex].description}
                </p>

                {/* Action Buttons Row */}
                <div className="pt-1 flex items-center gap-3.5">
                  {/* Primary Button */}
                  {heroSlides[heroSlideIndex].primaryBtn.link ? (
                    <Link
                      to={heroSlides[heroSlideIndex].primaryBtn.link!}
                      className="h-12 sm:h-13 px-6 sm:px-8 bg-gradient-to-r from-[#C95210] to-[#E06518] hover:from-[#C2410C] hover:to-[#C95210] text-white font-black text-xs sm:text-sm rounded-xl shadow-[0_6px_18px_rgba(249,115,22,0.35)] hover:shadow-[0_8px_22px_rgba(249,115,22,0.5)] hover:scale-[1.02] transition-all flex items-center justify-center gap-2 cursor-pointer group active:scale-95"
                    >
                      <span>{heroSlides[heroSlideIndex].primaryBtn.text}</span>
                      <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-white" />
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        if (heroSlides[heroSlideIndex].primaryBtn.action === 'visualSearch') {
                          setIsVisualSearchOpen(true);
                        } else if (heroSlides[heroSlideIndex].primaryBtn.action === 'consult') {
                          setIsConsultOpen(true);
                        }
                      }}
                      className="h-12 sm:h-13 px-6 sm:px-8 bg-gradient-to-r from-[#C95210] to-[#E06518] hover:from-[#C2410C] hover:to-[#C95210] text-white font-black text-xs sm:text-sm rounded-xl shadow-[0_6px_18px_rgba(249,115,22,0.35)] hover:shadow-[0_8px_22px_rgba(249,115,22,0.5)] hover:scale-[1.02] transition-all flex items-center justify-center gap-2 cursor-pointer group active:scale-95"
                    >
                      <Camera className="w-4 h-4 text-white" />
                      <span>{heroSlides[heroSlideIndex].primaryBtn.text}</span>
                    </button>
                  )}

                  {/* Secondary Button */}
                  {heroSlides[heroSlideIndex].secondaryBtn.action === 'consult' ? (
                    <button
                      type="button"
                      onClick={() => setIsConsultOpen(true)}
                      className="h-12 sm:h-13 px-5 sm:px-7 bg-[#12203C]/70 hover:bg-[#12203C]/85 text-white font-bold text-xs sm:text-sm rounded-xl border border-white/20 hover:border-orange-500/70 backdrop-blur-md transition-all flex items-center justify-center gap-2.5 cursor-pointer group shadow-md active:scale-95"
                    >
                      <span className="w-6 h-6 rounded-full bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-[#E06518] group-hover:scale-110 transition-transform">
                        <Play className="w-3 h-3 fill-[#E06518] text-[#E06518] ml-0.5" />
                      </span>
                      <span>{heroSlides[heroSlideIndex].secondaryBtn.text}</span>
                      <ArrowLeft className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsVisualSearchOpen(true)}
                      className="h-12 sm:h-13 px-5 sm:px-7 bg-[#12203C]/70 hover:bg-[#12203C]/85 text-white font-bold text-xs sm:text-sm rounded-xl border border-white/20 hover:border-orange-500/70 backdrop-blur-md transition-all flex items-center justify-center gap-2.5 cursor-pointer group shadow-md active:scale-95"
                    >
                      <span>{heroSlides[heroSlideIndex].secondaryBtn.text}</span>
                      <ArrowLeft className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors" />
                    </button>
                  )}
                </div>
              </div>

              {/* Slide Navigation Dots with 5-Second Timer Progress Bar & Controls */}
              <div className="pt-3 sm:pt-4 flex items-center justify-start gap-3">
                <div className="flex items-center gap-2 bg-[#12203C]/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                  {heroSlides.map((slide, idx) => {
                    const isActive = idx === heroSlideIndex;
                    return (
                      <button
                        key={slide.id}
                        type="button"
                        onClick={() => setHeroSlideIndex(idx)}
                        className={`relative h-2 rounded-full transition-all duration-300 overflow-hidden cursor-pointer ${
                          isActive ? 'w-8 bg-orange-500/30' : 'w-2 bg-white/30 hover:bg-white/50'
                        }`}
                        aria-label={`اسلاید ${idx + 1}`}
                      >
                        {isActive && (
                          <div
                            key={`progress-desktop-${idx}-${heroSlideIndex}`}
                            className="absolute inset-0 bg-[#E06518] rounded-full"
                            style={{
                              animation: 'heroProgress 5s linear forwards',
                            }}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Slide Counter (01 / 04) */}
                <span className="text-[11px] font-mono font-bold text-slate-300">
                  0{heroSlideIndex + 1} / 0{heroSlides.length}
                </span>

                {/* Prev / Next Arrows */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handlePrevSlide}
                    className="w-7 h-7 rounded-full bg-[#12203C]/70 hover:bg-[#E06518] border border-white/15 hover:border-[#E06518] text-white flex items-center justify-center transition-all cursor-pointer active:scale-90"
                    aria-label="اسلاید قبلی"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextSlide}
                    className="w-7 h-7 rounded-full bg-[#12203C]/70 hover:bg-[#E06518] border border-white/15 hover:border-[#E06518] text-white flex items-center justify-center transition-all cursor-pointer active:scale-90"
                    aria-label="اسلاید بعدی"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* ================================================================= */}
          {/* MOBILE VIEW (< lg): HIGH-CLARITY DEDICATED BANNER CARD & STACK    */}
          {/* ================================================================= */}
          <div className="lg:hidden space-y-4">
            
            {/* 1. Dedicated High-Resolution Banner Container (100% VISIBLE & CLEAR) */}
            <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-slate-900">
              {heroSlides.map((slide, idx) => {
                const isActive = idx === heroSlideIndex;
                return (
                  <img
                    key={slide.id}
                    src={slide.image}
                    alt={slide.titlePart1}
                    referrerPolicy="no-referrer"
                    className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-500 ${
                      isActive ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-95 z-0 pointer-events-none'
                    }`}
                  />
                );
              })}

              {/* Natural subtle gradient so HUD elements pop cleanly */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none z-20" />

              {/* Floating Top Category Pill */}
              <div className="absolute top-3 right-3 z-30">
                <span className="px-3 py-1 rounded-full bg-[#E06518] text-white text-[11px] font-bold shadow-md">
                  {heroSlides[heroSlideIndex].tag}
                </span>
              </div>

              {/* Floating Slide Counter Pill */}
              <div className="absolute top-3 left-3 z-30">
                <span className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-white font-mono text-[10px] font-bold border border-white/15">
                  0{heroSlideIndex + 1} / 0{heroSlides.length}
                </span>
              </div>

              {/* Bottom Glass Overlay on Mobile Banner */}
              <div className="absolute bottom-2.5 right-3 left-3 z-30 flex items-center justify-between bg-[#12203C]/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/15">
                <span className="text-[11px] font-bold text-white truncate">
                  {heroSlides[heroSlideIndex].badge.title}
                </span>
                <span className="text-[10px] font-mono text-orange-400 font-bold shrink-0">
                  {heroSlides[heroSlideIndex].statsBadge.value}
                </span>
              </div>
            </div>

            {/* 2. Mobile Text & Information Block (Clean Light UI for Mobile) */}
            <div
              key={`mobile-content-${heroSlideIndex}`}
              className="space-y-2.5 text-right pt-1 animate-in fade-in duration-300"
            >
              {/* Eyebrow */}
              <div className="flex items-center gap-1.5 justify-start text-[11px] font-bold text-[#E06518]">
                <span className="w-2 h-2 rounded-full bg-[#E06518] animate-pulse" />
                <span className="line-clamp-1">{heroSlides[heroSlideIndex].eyebrow}</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-xl sm:text-2xl font-black text-[#12203C] leading-snug">
                <span>{heroSlides[heroSlideIndex].titlePart1} </span>
                <span className="text-[#E06518]">{heroSlides[heroSlideIndex].titlePart2}</span>
              </h1>

              {/* Description */}
              <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                {heroSlides[heroSlideIndex].description}
              </p>

              {/* Action Buttons Full Width on Mobile */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch gap-2">
                {/* Primary Button */}
                {heroSlides[heroSlideIndex].primaryBtn.link ? (
                  <Link
                    to={heroSlides[heroSlideIndex].primaryBtn.link!}
                    className="h-11 px-6 bg-gradient-to-r from-[#C95210] to-[#E06518] hover:from-[#C2410C] hover:to-[#C95210] text-white font-black text-xs rounded-xl shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all"
                  >
                    <span>{heroSlides[heroSlideIndex].primaryBtn.text}</span>
                    <ArrowLeft className="w-4 h-4" />
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      if (heroSlides[heroSlideIndex].primaryBtn.action === 'visualSearch') {
                        setIsVisualSearchOpen(true);
                      } else if (heroSlides[heroSlideIndex].primaryBtn.action === 'consult') {
                        setIsConsultOpen(true);
                      }
                    }}
                    className="h-11 px-6 bg-gradient-to-r from-[#C95210] to-[#E06518] hover:from-[#C2410C] hover:to-[#C95210] text-white font-black text-xs rounded-xl shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all"
                  >
                    <Camera className="w-4 h-4" />
                    <span>{heroSlides[heroSlideIndex].primaryBtn.text}</span>
                  </button>
                )}

                {/* Secondary Button */}
                {heroSlides[heroSlideIndex].secondaryBtn.link ? (
                  <Link
                    to={heroSlides[heroSlideIndex].secondaryBtn.link!}
                    className="h-11 px-5 bg-white border border-slate-200 text-[#12203C] hover:bg-slate-50 font-bold text-xs rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all shadow-2xs"
                  >
                    <span>{heroSlides[heroSlideIndex].secondaryBtn.text}</span>
                    <ArrowLeft className="w-3.5 h-3.5 text-slate-500" />
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      if (heroSlides[heroSlideIndex].secondaryBtn.action === 'consult') {
                        setIsConsultOpen(true);
                      } else if (heroSlides[heroSlideIndex].secondaryBtn.action === 'visualSearch') {
                        setIsVisualSearchOpen(true);
                      }
                    }}
                    className="h-11 px-5 bg-white border border-slate-200 text-[#12203C] hover:bg-slate-50 font-bold text-xs rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all shadow-2xs"
                  >
                    <span>{heroSlides[heroSlideIndex].secondaryBtn.text}</span>
                    <ArrowLeft className="w-3.5 h-3.5 text-slate-500" />
                  </button>
                )}
              </div>

              {/* Slide Progress Dots on Mobile */}
              <div className="pt-2 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  {heroSlides.map((slide, idx) => {
                    const isActive = idx === heroSlideIndex;
                    return (
                      <button
                        key={slide.id}
                        type="button"
                        onClick={() => setHeroSlideIndex(idx)}
                        className={`relative h-1.5 rounded-full transition-all overflow-hidden ${
                          isActive ? 'w-6 bg-orange-500/30' : 'w-2 bg-slate-300'
                        }`}
                        aria-label={`اسلاید ${idx + 1}`}
                      >
                        {isActive && (
                          <div
                            key={`progress-mobile-${idx}-${heroSlideIndex}`}
                            className="absolute inset-0 bg-[#E06518] rounded-full"
                            style={{ animation: 'heroProgress 5s linear forwards' }}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handlePrevSlide}
                    className="w-7 h-7 rounded-full bg-slate-100 hover:bg-[#E06518] hover:text-white border border-slate-200 text-slate-700 flex items-center justify-center transition-colors active:scale-90 cursor-pointer"
                    aria-label="اسلاید قبلی"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextSlide}
                    className="w-7 h-7 rounded-full bg-slate-100 hover:bg-[#E06518] hover:text-white border border-slate-200 text-slate-700 flex items-center justify-center transition-colors active:scale-90 cursor-pointer"
                    aria-label="اسلاید بعدی"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Far Left Vertical Scroll Visual Indicator (آیکون ماوس اسکرول + نشانگر برای دسکتاپ) */}
        <div className="absolute left-6 lg:left-8 top-1/2 -translate-y-1/2 z-20 hidden lg:flex flex-col items-center gap-2.5 text-slate-400">
          <div className="flex flex-col items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
            <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
            <span className="w-1.5 h-4 rounded-full bg-[#E06518] shadow-[0_0_6px_#E06518]" />
            <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
            <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
          </div>

          <div className="w-5 h-8 rounded-full border-2 border-white/35 flex items-start justify-center pt-1">
            <span className="w-1 h-1.5 rounded-full bg-white/80 animate-bounce" />
          </div>
          <span className="text-[8px] font-mono font-bold tracking-[0.2em] text-slate-400 uppercase rotate-180 [writing-mode:vertical-lr]">
            SCROLL
          </span>
        </div>

        {/* Bottom Left Badge on Desktop */}
        <div
          key={`badge-${heroSlideIndex}`}
          className="absolute left-4 sm:left-8 bottom-28 z-20 hidden lg:flex items-center gap-2 bg-[#12203C]/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/15 shadow-md transition-all duration-500 animate-in fade-in"
        >
          <div className="w-1.5 h-5 bg-[#E06518] rounded-full" />
          <div className="text-right">
            <div className="text-[11px] font-bold text-white">{heroSlides[heroSlideIndex].badge.title}</div>
            <div className="text-[9px] text-slate-400 font-medium">{heroSlides[heroSlideIndex].badge.subtitle}</div>
          </div>
          <ArrowLeft className="w-3 h-3 text-orange-400 mr-1" />
        </div>

        {/* ========================================================================= */}
        {/* CLIENTS LOGO TICKER BAR AT BOTTOM OF HERO                                 */}
        {/* ========================================================================= */}
        <div className="relative z-20 w-full bg-white border-t border-slate-100">
          <OurClientsSection />
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2 & 3 CONTAINER - INSIDE MAX-W-7XL                                */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 my-8 sm:my-10">
        {/* ========================================================================= */}
        {/* 2. DUAL AI FEATURE BANNER (مشاوره هوشمند قطعات & پیدا کردن قطعه با AI)       */}
        {/* ========================================================================= */}
        <section className="relative overflow-hidden rounded-3xl bg-[#39404A] text-white border border-[#4e5765] shadow-2xl p-6 sm:p-8 lg:p-10 select-none">
          {/* 1. Subtle Dot Grid Matrix Blueprint Pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:22px_22px] pointer-events-none z-0" />

          {/* 2. Central Ambient Glowing Amber / Orange Lighting & Grayish-White Soft Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[180px] bg-[#E06518]/20 blur-3xl rounded-full pointer-events-none z-0" />
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-[#E06518]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-slate-100/20 rounded-full blur-3xl pointer-events-none" />

          {/* 3. Glowing Horizontal Circuit / PCB Trace Lines & Nodes across Center (Image 1 Style) */}
          <div className="absolute inset-0 pointer-events-none z-1 overflow-hidden opacity-95">
            <svg
              className="w-full h-full"
              viewBox="0 0 1200 240"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
            >
              {/* Main Glowing Circuit Highway */}
              <path
                d="M 50 150 L 260 150 L 330 110 L 520 110 L 560 145 L 640 145 L 680 110 L 870 110 L 940 150 L 1150 150"
                stroke="#E06518"
                strokeWidth="2"
                strokeOpacity="0.85"
                filter="drop-shadow(0 0 8px #E06518)"
              />
              {/* Parallel Upper Dashed Trace */}
              <path
                d="M 80 90 L 280 90 L 340 125 L 500 125 L 550 90 L 650 90 L 700 125 L 860 125 L 920 90 L 1120 90"
                stroke="#E06518"
                strokeWidth="1.5"
                strokeOpacity="0.5"
                strokeDasharray="6 6"
              />
              {/* Parallel Lower Dashed Trace */}
              <path
                d="M 120 180 L 380 180 L 440 155 L 760 155 L 820 180 L 1080 180"
                stroke="#E06518"
                strokeWidth="1.5"
                strokeOpacity="0.4"
                strokeDasharray="8 6"
              />

              {/* Glowing Circuit Node Dots */}
              <circle cx="260" cy="150" r="3.5" fill="#FFA347" filter="drop-shadow(0 0 5px #FFA347)" />
              <circle cx="330" cy="110" r="3.5" fill="#FFA347" filter="drop-shadow(0 0 5px #FFA347)" />
              <circle cx="560" cy="145" r="3.5" fill="#FFA347" filter="drop-shadow(0 0 5px #FFA347)" />
              <circle cx="640" cy="145" r="3.5" fill="#FFA347" filter="drop-shadow(0 0 5px #FFA347)" />
              <circle cx="680" cy="110" r="3.5" fill="#FFA347" filter="drop-shadow(0 0 5px #FFA347)" />
              <circle cx="870" cy="110" r="3.5" fill="#FFA347" filter="drop-shadow(0 0 5px #FFA347)" />
              <circle cx="940" cy="150" r="3.5" fill="#FFA347" filter="drop-shadow(0 0 5px #FFA347)" />

              {/* Center Diamond / Chip Hub */}
              <g transform="translate(600, 145)">
                <rect
                  x="-8"
                  y="-8"
                  width="16"
                  height="16"
                  transform="rotate(45)"
                  fill="#252b33"
                  stroke="#E06518"
                  strokeWidth="2"
                  filter="drop-shadow(0 0 8px #E06518)"
                />
                <circle cx="0" cy="0" r="3" fill="#FFA347" />
              </g>
            </svg>
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 divide-y lg:divide-y-0 lg:divide-x lg:divide-x-reverse divide-[#4e5765] items-center">
            {/* Card A (Right in RTL): مشاوره هوشمند قطعات تولید */}
            <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 lg:pb-0 lg:pl-6 text-right">
              {/* Visual: Glowing AI Cybernetic Face */}
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden shrink-0 border border-[#4e5765] shadow-xl bg-[#242932] group">
                <img
                  src={STORE_ASSETS.aiConsultRobot}
                  alt="مشاوره هوشمند قطعات خط تولید"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-1.5 inset-x-1.5 bg-[#242932]/90 backdrop-blur-xs text-[10px] text-center font-bold text-orange-400 py-0.5 rounded border border-orange-500/30">
                  هوشمند خط تولید
                </div>
              </div>

              {/* Details */}
              <div className="flex-1 space-y-2.5 text-right">
                <h3 className="text-lg sm:text-xl font-black text-white drop-shadow-sm">
                  مشاوره هوشمند قطعات تولید
                </h3>
                <p className="text-xs text-slate-200 leading-relaxed font-normal">
                  مشخصات یا ایراد خط تولید کارخانه خود را اعلام کنید تا سامانه هوشمند هایپر صنعت بهترین قطعات جایگزین را به شما پیشنهاد دهد.
                </p>
                <div className="pt-1.5">
                  <button
                    type="button"
                    onClick={() => setIsConsultOpen(true)}
                    className="h-11 px-6 bg-[#272d36] hover:bg-[#313844] text-white hover:text-orange-300 border border-[#E06518]/70 hover:border-[#E06518] text-xs sm:text-sm font-bold rounded-full transition-all flex items-center gap-2.5 cursor-pointer shadow-[0_0_15px_rgba(224,101,24,0.15)] hover:shadow-[0_0_20px_rgba(224,101,24,0.35)] group active:scale-95"
                  >
                    <span>شروع مشاوره آنلاین قطعه</span>
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-white group-hover:text-orange-300" />
                  </button>
                </div>
              </div>
            </div>

            {/* Card B (Left in RTL): شناسایی تصویری قطعه با هوش مصنوعی */}
            <div className="flex flex-col sm:flex-row items-center gap-6 pt-6 lg:pt-0 lg:pr-6 text-right">
              {/* Details */}
              <div className="flex-1 space-y-2.5 text-right order-2 sm:order-1">
                <h3 className="text-lg sm:text-xl font-black text-white drop-shadow-sm">
                  شناسایی تصویری قطعه با هوش مصنوعی
                </h3>
                <p className="text-xs text-slate-200 leading-relaxed font-normal">
                  از قطعه مستهلک، تسمه، پلاک ماشین‌آلات خط تولید عکس بگیرید تا قطعه فابریک استاندارد در انبار هایپر صنعت فوراً شناسایی شود.
                </p>
                <div className="pt-1.5">
                  <button
                    type="button"
                    onClick={() => setIsVisualSearchOpen(true)}
                    className="h-11 px-6 sm:px-7 bg-gradient-to-r from-[#C95210] to-[#E06518] hover:from-[#C2410C] hover:to-[#C95210] text-white text-xs sm:text-sm font-black rounded-full transition-all flex items-center gap-2.5 cursor-pointer shadow-[0_6px_20px_rgba(224,101,24,0.4)] hover:shadow-[0_8px_25px_rgba(224,101,24,0.6)] group active:scale-95"
                  >
                    <Camera className="w-4 h-4 text-white" />
                    <span>ارسال تصویر قطعه خط تولید</span>
                  </button>
                </div>
              </div>

              {/* Visual: Smartphone HUD Part Scanner */}
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden shrink-0 border border-[#4e5765] shadow-xl bg-[#242932] order-1 sm:order-2 group">
                <img
                  src={STORE_ASSETS.aiSearchMobile}
                  alt="شناسایی هوشمند قطعه"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2 left-2 w-5 h-5 rounded-full bg-[#242932]/90 backdrop-blur-xs flex items-center justify-center border border-white/20">
                  <span className="w-2 h-2 rounded-full bg-[#E06518] animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. PRODUCT CATEGORIES (7 items matching screenshot)                       */}
        {/* ========================================================================= */}
        <section className="space-y-6">
          {/* Section Header */}
          <div className="flex items-end justify-between border-b border-slate-200/80 pb-4">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-black text-[#55565A]">دسته‌بندی قطعات خطوط تولید</h2>
              <p className="text-xs sm:text-sm text-slate-500">تأمین کلیه قطعات مصرفی و یدکی انواع خطوط تولید و کارخانجات</p>
            </div>

            <Link
              to="/products"
              className="text-xs sm:text-sm font-bold text-[#E06518] hover:text-[#C95210] flex items-center gap-1.5 transition-colors"
            >
              <span>مشاهده همه ۸۶۴ قطعه</span>
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>

          {/* 8 Clean Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {categories.map(cat => (
              <Link
                key={cat.id}
                to={cat.link}
                className="group bg-white rounded-2xl border border-slate-200/80 p-3 flex flex-col justify-between hover:border-[#E06518] hover:shadow-[0_8px_25px_rgba(249,115,22,0.2)] hover:ring-2 hover:ring-orange-500/20 hover:-translate-y-1 transition-all duration-300 text-right"
              >
                {/* Product Image Box */}
                <div className="w-full aspect-square rounded-xl overflow-hidden bg-slate-50 border border-slate-100 flex items-center justify-center mb-3 group-hover:bg-orange-50/40 group-hover:border-orange-200/60 transition-colors">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Title & Orange Arrow Circle Button */}
                <div className="flex items-center justify-between gap-1.5 pt-1">
                  <div className="w-7 h-7 rounded-full bg-[#E06518] group-hover:bg-[#C95210] text-white flex items-center justify-center shrink-0 shadow-xs group-hover:shadow-[0_0_8px_#E06518] transition-all">
                    <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                  </div>
                  <h3 className="font-bold text-xs text-[#55565A] group-hover:text-[#E06518] transition-colors line-clamp-1">
                    {cat.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* ========================================================================= */}
      {/* 4. COVERED INDUSTRIES - 100% FULL WIDTH MATCHING REFERENCE UI/UX           */}
      {/* ========================================================================= */}
      <section
        className="relative w-full overflow-hidden bg-[#39404A] text-white py-14 sm:py-20 my-8 sm:my-12 shadow-2xl border-y border-[#4e5765]"
        dir="rtl"
      >
        {/* Background Plant Backdrop with natural transparent gradient overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={STORE_ASSETS.industries.bgPlant}
            alt="Industrial Plant Refinery"
            className="w-full h-full object-cover object-center opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-[#39404A]/95 via-[#39404A]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#39404A] via-transparent to-[#39404A]/85" />
        </div>

        {/* Diagonal Glowing Laser Light Rays at bottom right (just like in screenshot) */}
        <div className="absolute bottom-0 right-0 w-[55%] h-32 pointer-events-none z-1 overflow-hidden opacity-80">
          <div className="absolute -bottom-10 right-10 w-[650px] h-[3px] bg-gradient-to-r from-transparent via-[#E06518] to-transparent rotate-[-18deg] shadow-[0_0_15px_#E06518]" />
          <div className="absolute -bottom-16 right-32 w-[550px] h-[2px] bg-gradient-to-r from-transparent via-[#C95210] to-transparent rotate-[-18deg] shadow-[0_0_10px_#C95210]" />
          <div className="absolute -bottom-24 right-56 w-[450px] h-[2px] bg-gradient-to-r from-transparent via-orange-400 to-transparent rotate-[-18deg]" />
        </div>

        {/* Subtle Industrial Background Dot Pattern */}
        <div className="absolute inset-0 z-1 bg-[radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        {/* Carousel Navigation Chevron Arrows (Left & Right) */}
        {/* Right Arrow: only shown when user has scrolled towards the left / can scroll back right */}
        <button
          type="button"
          onClick={handleScrollRight}
          className={`absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-[#272d36]/85 hover:bg-[#E06518] border border-white/20 hover:border-[#E06518] text-white flex items-center justify-center backdrop-blur-md shadow-2xl transition-all duration-300 cursor-pointer group ${
            canScrollRight ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-75 pointer-events-none'
          }`}
          aria-label="صنایع قبلی"
        >
          <ChevronRight className="w-5 h-5 group-hover:scale-110 transition-transform" />
        </button>

        {/* Left Arrow: always visible to scroll left (forward in RTL) */}
        <button
          type="button"
          onClick={handleScrollLeft}
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-[#272d36]/85 hover:bg-[#E06518] border border-white/20 hover:border-[#E06518] text-white flex items-center justify-center backdrop-blur-md shadow-2xl transition-all duration-300 cursor-pointer group"
          aria-label="صنایع بعدی"
        >
          <ChevronLeft className="w-5 h-5 group-hover:scale-110 transition-transform" />
        </button>

        {/* Main Content Layout: In RTL, flex-col lg:flex-row puts first child (Text Header) on the RIGHT, and second child (Cards) on the LEFT */}
        <div className="relative z-10 max-w-[1520px] mx-auto px-4 sm:px-8 lg:px-12 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
          {/* Right Header Text Column (در دسکتاپ دقیقاً در سمت راست قرار می‌گیرد) */}
          <div className="w-full lg:w-[420px] xl:w-[460px] space-y-4 text-right shrink-0">
            {/* Top English Brand Label: ATLAS TRADING ——— */}
            <div className="flex items-center gap-2 justify-start">
              <span className="text-xs sm:text-sm font-black tracking-[0.25em] text-[#E06518] uppercase font-mono">
                ATLAS TRADING
              </span>
              <span className="w-12 h-[2px] bg-[#E06518]" />
            </div>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm font-bold text-slate-200 tracking-wide">
              تأمین‌کننده قطعات و تجهیزات صنعتی
            </p>

            {/* Main Headline (تأمین قطعات خطوط صنایع مختلف) */}
            <h2 className="text-3xl sm:text-4xl lg:text-[44px] xl:text-[46px] font-black text-white leading-[1.2] tracking-tight">
              تأمین قطعات خطوط
              <span className="block text-[#E06518] pt-1">صنایع مختلف</span>
            </h2>

            {/* Description Paragraph */}
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-light">
              از خطوط کاشی و سرامیک، نساجی و فولاد تا صنایع غذایی، فولاد، پتروشیمی و نیروگاهی؛ با بهترین برندها و کیفیت تضمین‌شده، همراه شما در تأمین قطعات صنعتی هستیم.
            </p>

            {/* CTA Button: مشاهده قطعات خطوط (Large Orange Glowing Button) */}
            <div className="pt-3">
              <Link
                to="/products"
                className="inline-flex items-center justify-center gap-2.5 h-12 sm:h-13 px-8 bg-gradient-to-r from-[#C95210] to-[#E06518] hover:from-[#C2410C] hover:to-[#C95210] text-white text-sm sm:text-base font-black rounded-2xl shadow-[0_10px_25px_rgba(249,115,22,0.4)] hover:shadow-[0_12px_30px_rgba(249,115,22,0.6)] hover:scale-[1.02] transition-all cursor-pointer group"
              >
                <span>مشاهده قطعات خطوط</span>
                <ArrowLeft className="w-5 h-5 text-white group-hover:-translate-x-1.5 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Scrollable Cards Row (در دسکتاپ در سمت چپ قرار می‌گیرد) */}
          <div
            id="industries-scroll-container"
            ref={industriesScrollRef}
            onScroll={checkIndustriesScroll}
            className="flex-1 w-full min-w-0 flex items-stretch gap-3.5 sm:gap-4 overflow-x-auto pb-4 pt-2 px-1 scrollbar-none snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {coveredIndustries.map((ind) => {
              const IconComp = ind.icon;

              return (
                <Link
                  key={ind.id}
                  to={ind.link}
                  className="group relative w-[170px] sm:w-[195px] shrink-0 aspect-[1/1.7] rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-end p-2.5 sm:p-3 transition-all duration-300 snap-start cursor-pointer border-2 border-white/15 hover:border-[#E06518] hover:shadow-[0_0_25px_rgba(249,115,22,0.45)] hover:ring-2 hover:ring-orange-500/30 hover:scale-[1.03] hover:z-10"
                >
                  {/* Card Industrial Machinery Photo */}
                  <img
                    src={ind.image}
                    alt={ind.title}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />

                  {/* Clean Natural Contrast gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#20252d]/85 via-[#20252d]/30 to-transparent" />

                  {/* Top Subtle Amber Highlight glow on hover */}
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[#E06518] to-transparent transition-opacity duration-300 opacity-0 group-hover:opacity-100" />

                  {/* Bottom Glass Card Pill with Icon + Title + Orange Arrow */}
                  <div className="relative z-10 flex items-center justify-between gap-1.5 bg-[#252b33]/85 backdrop-blur-md px-2.5 py-2 rounded-xl border border-white/15 shadow-lg group-hover:border-orange-500/60 group-hover:shadow-[0_0_12px_rgba(249,115,22,0.25)] transition-all duration-300">
                    {/* Left Icon (Orange Arrow Circle Button) */}
                    <div className="w-6 h-6 rounded-full bg-[#E06518] text-white flex items-center justify-center shrink-0 shadow-sm group-hover:bg-[#C95210] group-hover:shadow-[0_0_8px_#E06518] transition-all">
                      <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                    </div>

                    {/* Middle Title */}
                    <span className="text-xs sm:text-[13px] font-bold text-white group-hover:text-orange-200 transition-colors line-clamp-1">
                      {ind.title}
                    </span>

                    {/* Right Mini Industry Category Icon */}
                    {IconComp && (
                      <div className="w-5 h-5 flex items-center justify-center shrink-0 text-orange-400/80 group-hover:text-[#E06518] transition-colors">
                        <IconComp className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Bottom Carousel / Slider Indicator Dots */}
        <div className="flex items-center justify-center gap-2 pt-8 sm:pt-12 relative z-10">
          <span className="w-9 h-2.5 rounded-full bg-[#E06518] shadow-[0_0_10px_#E06518]" />
          <span className="w-7 h-2 rounded-full bg-white/25" />
          <span className="w-7 h-2 rounded-full bg-white/25" />
          <span className="w-7 h-2 rounded-full bg-white/25" />
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 5, 6, 7 CONTAINER                                                 */}
      {/* ========================================================================= */}
      <div className="w-full space-y-12 my-8 sm:my-10">
        {/* ========================================================================= */}
        {/* POPULAR PRODUCTS - استعلام قیمت آنلاین قطعات پربازدید                       */}
        {/* ========================================================================= */}
        <PopularProductsSection />

        {/* ========================================================================= */}
        {/* 5. MAIN TRUSTED BRANDS (FORZA & SWR CINEMATIC DUAL BANNER)                */}
        {/* ========================================================================= */}
        <MainBrandsBanner />
      </div>

      {/* ========================================================================= */}
      {/* 6. WHY SANATPISH SECTION (چرا صنعت‌پیش؟ - تمام‌صفحه، لبه‌به‌لبه و فوق‌العاده مدرن) */}
      {/* ========================================================================= */}
      <section className="relative w-full py-12 sm:py-20 bg-white text-slate-900 border-y border-slate-200/80 overflow-hidden" dir="rtl">
        {/* Subtle Engineered Background Technical Grid & Ambient Lighting */}
        <div className="absolute inset-0 bg-[radial-gradient(#12203c0a_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-orange-500/10 via-amber-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-blue-600/8 via-cyan-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* Edge-to-Edge Container without excessive empty side margins */}
        <div className="w-full px-3 sm:px-6 lg:px-8 xl:px-10 space-y-8 sm:space-y-12 relative z-10">
          
          {/* 1. EDITORIAL ASYMMETRIC HEADER */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-slate-200">
            <div className="space-y-2.5 text-right max-w-4xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200/80 text-xs font-black text-[#E06518]">
                <span className="w-2 h-2 rounded-full bg-[#E06518] animate-pulse" />
                <span>استاندارد مرجع تأمین و لجستیک قطعات خطوط تولید صنعتی</span>
              </div>
              <h2 className="text-2xl sm:text-4xl lg:text-[42px] font-black leading-[1.25] tracking-tight text-[#12203C]">
                چرا خطوط تولید پیشرو،{' '}
                <span className="text-[#E06518] relative inline-block">
                  صنعت‌پیش
                  <span className="absolute -bottom-1 inset-x-0 h-1 bg-[#E06518]/20 rounded-full" />
                </span>{' '}
                را انتخاب می‌کنند؟
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed max-w-3xl">
                تأمین بدون‌واسطه قطعات اورجینال اروپایی و آسیایی، بازرسی آزمایشگاهی و کنترل کیفیت (QC) پیش از ارسال، به همراه همراهی شبانه‌روزی مهندسین مکانیک جهت به صفر رساندن توقف خطوط کارخانجات.
              </p>
            </div>

            {/* Header Right Key Action: دکمه بیشتر بدانید */}
            <div className="flex items-center gap-3 shrink-0">
              <Link
                to="/about"
                className="h-12 px-7 bg-gradient-to-r from-[#C95210] to-[#E06518] hover:from-[#C2410C] hover:to-[#C95210] text-white font-bold text-xs sm:text-sm rounded-xl shadow-[0_6px_20px_rgba(224,101,24,0.35)] hover:scale-[1.02] hover:shadow-[0_8px_25px_rgba(224,101,24,0.45)] transition-all flex items-center gap-2.5 cursor-pointer active:scale-95 group"
              >
                <span>بیشتر بدانید</span>
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* 2. HIGH-IMPACT BENTO GRID: 4 MONOLITHIC VISUAL SHOWCASES (EDGE-TO-EDGE) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-stretch">
            
            {/* CARD 1 (7 COLS): QC & Laboratory Material Inspection */}
            <div className="lg:col-span-7 relative min-h-[380px] sm:min-h-[440px] rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200 hover:border-[#E06518] group shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col justify-end p-5 sm:p-8 lg:p-10">
              <img
                src={STORE_ASSETS.whySanatQc}
                alt="واحد کنترل کیفیت QC و بازرسی متالوژی صنعت‌پیش"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

              {/* Floating Top Tag */}
              <div className="absolute top-4 sm:top-6 right-4 sm:right-6 left-4 sm:left-6 flex items-center justify-between text-[11px] font-bold">
                <span className="px-3.5 py-1.5 rounded-full bg-[#12203C]/90 backdrop-blur-md border border-white/20 text-orange-400 shadow-md flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-ping" />
                  واحد کنترل کیفیت (QC) و آزمایشگاه متالوژی
                </span>
                <span className="text-white font-mono px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md tabular-nums border border-white/10">
                  DIN / ISO 9001
                </span>
              </div>

              {/* Content Body */}
              <div className="relative z-10 space-y-2.5 text-right text-white">
                <div className="flex items-center gap-2 text-orange-400 text-xs font-bold">
                  <ShieldCheck className="w-4 h-4 text-orange-400" />
                  <span>تضمین ۱۰۰٪ اصالت فیزیکی و آزمون میکرومتری</span>
                </div>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-white drop-shadow-sm">
                  برگه آنالیز متریال و شناسنامه فنی استاندارد
                </h3>
                <p className="text-xs sm:text-sm text-slate-200 max-w-2xl leading-relaxed font-normal">
                  کلیه قطعات پیش از بارگیری به سمت کارخانجات، توسط ابزار دقیق از نظر تلرانس میکرونی، سختی آلیاژ و فشار دینامیکی بازرسی و همراه با گارانتی کتبی تعویض تحویل می‌شوند.
                </p>
              </div>
            </div>

            {/* CARD 2 (5 COLS): Direct Factory Supply & Cost Optimization */}
            <div className="lg:col-span-5 relative min-h-[380px] sm:min-h-[440px] rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200 hover:border-[#E06518] group shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col justify-between p-5 sm:p-8 lg:p-10">
              <img
                src={STORE_ASSETS.whySanatDirectFactory}
                alt="تأمین مستقیم و بدون واسطه از تولیدکنندگان جهانی"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent" />

              {/* Top Metric Badge */}
              <div className="relative z-10 flex items-center justify-between">
                <span className="px-3.5 py-1.5 rounded-full bg-[#12203C]/90 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold shadow-md">
                  تأمین مستقیم و بدون واسطه
                </span>
                <div className="text-right bg-[#12203C]/90 px-3.5 py-1.5 rounded-xl border border-white/20 backdrop-blur-md">
                  <span className="text-2xl sm:text-3xl font-black text-[#E06518] font-mono tabular-nums">۲۵٪-</span>
                  <span className="block text-[10px] text-slate-300">کاهش هزینه‌های خرید</span>
                </div>
              </div>

              {/* Content Body */}
              <div className="relative z-10 space-y-2.5 text-right text-white">
                <div className="flex items-center gap-2 text-orange-400 text-xs font-bold">
                  <Shield className="w-4 h-4 text-orange-400" />
                  <span>حذف واسطه‌ها و صدور فاکتور رسمی</span>
                </div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-black text-white drop-shadow-sm">
                  واردات و توزیع مستقیم با فاکتور رسمی
                </h3>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
                  ارتباط مستقیم با خطوط تولید برندهای معتبر بین‌المللی (FORZA و SWR) و تأمین انبوه با رقابتی‌ترین قیمت تمام‌شده در بازار صنعتی کشور.
                </p>
              </div>
            </div>

            {/* CARD 3 (5 COLS): Technical Blueprint CAD Consultation */}
            <div className="lg:col-span-5 relative min-h-[380px] sm:min-h-[440px] rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200 hover:border-[#E06518] group shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col justify-between p-5 sm:p-8 lg:p-10">
              <img
                src={STORE_ASSETS.whySanatCadEngineering}
                alt="مشاوره فنی و تطبیق نقشه‌های ساخت مهندسی"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent" />

              {/* Top Tag */}
              <div className="relative z-10 flex items-center justify-between">
                <span className="px-3.5 py-1.5 rounded-full bg-[#12203C]/90 backdrop-blur-md border border-white/20 text-cyan-300 text-[11px] font-bold shadow-md">
                  تطبیق مهندسی مکانیک
                </span>
                <span className="text-xs font-mono text-white font-bold bg-black/60 px-3.5 py-1.5 rounded-full backdrop-blur-md border border-white/10">
                  CAD / 3D Modeling
                </span>
              </div>

              {/* Content Body */}
              <div className="relative z-10 space-y-2.5 text-right text-white">
                <div className="flex items-center gap-2 text-cyan-300 text-xs font-bold">
                  <Headphones className="w-4 h-4 text-cyan-300" />
                  <span>مشاوره تخصصی مهندسین مقیم</span>
                </div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-black text-white drop-shadow-sm">
                  تطبیق نقشه‌های ساخت و مشخصات قطعه
                </h3>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
                  بررسی دقیق نقشه ساخت، فشار کاری و ابعاد قطعات سفارشی با شرایط واقعی خطوط تولید قبل از ثبت سفارش نهایی جهت پیشگیری از اشتباه در خرید.
                </p>
              </div>
            </div>

            {/* CARD 4 (7 COLS): Express Logistics & 24h Delivery Guarantee */}
            <div className="lg:col-span-7 relative min-h-[380px] sm:min-h-[440px] rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200 hover:border-[#E06518] group shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col justify-end p-5 sm:p-8 lg:p-10">
              <img
                src={STORE_ASSETS.whySanatExpressDelivery}
                alt="ارسال فوری و لجستیک اکسپرس قطعات صنعتی به سراسر کشور"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

              {/* Floating Top Tag */}
              <div className="absolute top-4 sm:top-6 right-4 sm:right-6 left-4 sm:left-6 flex items-center justify-between text-[11px] font-bold">
                <span className="px-3.5 py-1.5 rounded-full bg-[#12203C]/90 backdrop-blur-md border border-white/20 text-amber-300 shadow-md">
                  شبکه توزیع و لجستیک اورژانسی
                </span>
                <span className="text-orange-400 font-mono font-black px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md tabular-nums border border-white/10">
                  &lt; ۲۴ ساعت تحویل کارخانه
                </span>
              </div>

              {/* Content Body */}
              <div className="relative z-10 space-y-2.5 text-right text-white">
                <div className="flex items-center gap-2 text-amber-300 text-xs font-bold">
                  <Truck className="w-4 h-4 text-amber-300" />
                  <span>دپوی استراتژیک در انبار مرکزی</span>
                </div>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-white drop-shadow-sm">
                  ارسال روزانه و اکسپرس به تمامی شهرک‌های صنعتی
                </h3>
                <p className="text-xs sm:text-sm text-slate-200 max-w-2xl leading-relaxed font-normal">
                  موجودی آماده تحویل بیش از ۱۸,۰۰۰ پارت‌نامبر قطعات پرمصرف کارخانجات و ارسال سریع با ناوگان اختصاصی، تیپاکس و باربری‌های فوری به سراسر کشور.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. CTA CONSULTATION & INQUIRY BANNER (مشاوره تخصصی و استعلام قیمت)        */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 my-8 sm:my-10">
        <section
          className="relative overflow-hidden rounded-3xl bg-gradient-to-l from-[#C2410C] via-[#7C2D12] to-[#12203C] text-white shadow-xl border border-orange-900/30"
          dir="rtl"
        >
          {/* Subtle Ambient Industrial Waves / Geometric Glow */}
          <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay">
            <svg className="w-full h-full" viewBox="0 0 1200 240" preserveAspectRatio="none" fill="none">
              <path d="M0,80 C300,10 600,160 900,70 C1050,30 1150,110 1200,80 L1200,240 L0,240 Z" fill="white" opacity="0.2" />
              <path d="M0,120 C250,50 500,190 800,110 C1000,60 1100,170 1200,130 L1200,240 L0,240 Z" fill="white" opacity="0.1" />
            </svg>
          </div>
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 items-center">
            
            {/* RIGHT in desktop, BOTTOM in mobile: Text and Action Buttons */}
            <div className="order-2 lg:order-1 lg:col-span-7 xl:col-span-7 p-6 sm:p-8 lg:p-10 space-y-4 text-right">
              <div className="space-y-2">
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
                  مشاوره تخصصی و استعلام قیمت
                </h3>
                <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed max-w-xl">
                  تیم کارشناسان ما، آماده پاسخگویی به سوالات شما و ارائه بهترین راهکارهاست
                </p>
              </div>

              {/* Action Buttons Row */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                {/* Dark Navy Button: درخواست مشاوره */}
                <button
                  type="button"
                  onClick={() => setIsConsultOpen(true)}
                  className="h-11 px-6 bg-[#E06518] hover:bg-[#C95210] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md hover:shadow-orange-500/30 transition-all flex items-center gap-2 cursor-pointer group shrink-0"
                >
                  <ChevronLeft className="w-4 h-4 text-white group-hover:-translate-x-0.5 transition-transform" />
                  <span>درخواست مشاوره</span>
                </button>

                {/* Orange Phone Call Button */}
                <a
                  href="tel:02142772340"
                  className="h-11 px-5 bg-[#12203C]/70 hover:bg-[#12203C]/80 border border-white/20 hover:border-white/40 text-white font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center gap-2.5 backdrop-blur-xs cursor-pointer shrink-0"
                  dir="ltr"
                >
                  <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-white shrink-0">
                    <Phone className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-mono tracking-wider font-extrabold text-white text-sm sm:text-base">
                    ۰۲۱-۴۲۷۷۲۳۴۰
                  </span>
                </a>
              </div>
            </div>

            {/* LEFT in desktop, TOP in mobile: Industrial Photo */}
            <div className="order-1 lg:order-2 lg:col-span-5 xl:col-span-5 relative h-52 sm:h-60 lg:h-64 overflow-hidden">
              <img
                src={STORE_ASSETS.ctaConsultBanner}
                alt="مشاوره تخصصی و استعلام قیمت قطعات خط تولید"
                className="w-full h-full object-cover object-center"
              />
              {/* Gradient masks blending smoothly from image to banner bg */}
              <div className="absolute inset-0 bg-gradient-to-l from-[#12203C]/90 via-transparent to-transparent hidden lg:block pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent lg:hidden pointer-events-none" />
            </div>

          </div>
        </section>
      </div>

      {/* Global Modals for interactive AI features */}
      <AiVisualPartSearchModal
        isOpen={isVisualSearchOpen}
        onClose={() => setIsVisualSearchOpen(false)}
      />

      <AiConsultModal isOpen={isConsultOpen} onClose={() => setIsConsultOpen(false)} />
    </div>
  );
};
