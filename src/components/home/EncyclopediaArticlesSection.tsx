import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  BookOpen,
  Clock,
  User,
  Search,
  Sparkles,
  Download,
  Share2,
  FileText,
  Calculator,
  CheckCircle2,
  Layers,
  Wrench,
  ShieldCheck,
  ChevronLeft,
  X,
  ExternalLink,
  Cpu,
  Flame,
  Zap,
} from 'lucide-react';
import { STORE_ASSETS } from '../../assets/images';

export interface ArticleItem {
  id: string;
  title: string;
  category: string;
  categorySlug: string;
  standardCode: string;
  excerpt: string;
  author: string;
  authorRole: string;
  readTime: string;
  date: string;
  image: string;
  featured?: boolean;
  downloadsCount: number;
  content: {
    introduction: string;
    sections: {
      heading: string;
      body: string;
      highlights?: string[];
      formula?: string;
    }[];
    conclusion: string;
  };
}

export const EncyclopediaArticlesSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedArticle, setSelectedArticle] = useState<ArticleItem | null>(null);

  const categories = [
    { id: 'all', label: 'همه موضوعات' },
    { id: 'transmission', label: 'انتقال قدرت و تسمه‌ها', icon: Layers },
    { id: 'quality', label: 'متالوژی و تست NDT', icon: ShieldCheck },
    { id: 'maintenance', label: 'پایش وضعیت و هوش مصنوعی', icon: Cpu },
    { id: 'engineering', label: 'پایپینگ و مهندسی معکوس', icon: Wrench },
  ];

  const articles: ArticleItem[] = [
    {
      id: 'art-1',
      title: 'راهنمای جامع محاسبه گشتاور و انتخاب تسمه‌های تایمینگ در خطوط پیوسته',
      category: 'انتقال قدرت و تسمه‌ها',
      categorySlug: 'transmission',
      standardCode: 'DIN 7721 / ISO 5296',
      excerpt:
        'فرمول‌های محاسبه ضریب اطمینان (Service Factor)، تحلیل خستگی کششی نخ‌های فایبرگلاس و کولار در محیط‌های حرارتی بالای ۸۰ درجه سانتی‌گراد.',
      author: 'مهندس علیرضا کیانی',
      authorRole: 'سرپرست واحد فنی مهندسی هایپر صنعت',
      readTime: '۷ دقیقه مطالعه',
      date: '۱۵ شهریور ۱۴۰۳',
      image: STORE_ASSETS.whySanatCadEngineering,
      featured: true,
      downloadsCount: 1420,
      content: {
        introduction:
          'در خطوط تولید صنعتی پیوسته نظیر کاشی و سرامیک، بسته‌بندی، نساجی و صنایع غذایی، انتخاب ناصحیح تسمه تایمینگ و عدم انطباق گشتاور نامی منجر به لغزش دندانه (Tooth Jumping) و توقفات پرهزینه خط می‌شود.',
        sections: [
          {
            heading: '۱. محاسبه توان تصحیح‌شده و گشتاور نامی',
            body: 'برای محاسبه دقیق، توان نامی موتور باید در ضریب کاربری (Service Factor - Ks) ضرب شود. این ضریب بسته به شوک‌های ضربه‌ای و ساعات کارکرد روزانه بین ۱.۲ تا ۲.۰ متغیر است.',
            formula: 'P_corrected = P_motor × Ks | T = (9550 × P_corrected) / n',
            highlights: [
              'برای شیفت کاری ۲۴ ساعته: Ks = ۱.۷۵ لحاظ گردد.',
              'در شرایط راه‌اندازی زیر بار سنگین، ضریب ضربه ۱.۵ اعمال شود.',
            ],
          },
          {
            heading: '۲. مقایسه متریال تسمه در دماهای کاری بالا',
            body: 'تسمه‌های پلی‌یورتان (PU) با کورد استیل برای محیط‌های روغنی و دقت موقعیت‌یابی ایده‌آل هستند، در حالی که تسمه‌های لاستیکی نئوپرن با کورد فایبرگلاس در دماهای منفی ۳۰ تا مثبت ۱۰۰ درجه سانتی‌گراد انعطاف‌پذیری فوق‌العاده‌ای دارند.',
            highlights: [
              'پوشش پارچه‌ای پلی‌آمید (NFT/NFB) برای کاهش اصطکاک و سایش دندانه‌ها ضروری است.',
              'رواداری کشش تسمه باید طبق دستورالعمل شرکت سازنده پایش شود.',
            ],
          },
        ],
        conclusion:
          'با تطبیق ابعاد گام (Pitch) و پروفیل دندانه (HTD، STD، T یا AT) با پولی متناظر، عمر مفید سیستم انتقال قدرت تا ۳۰۰٪ افزایش می‌یابد.',
      },
    },
    {
      id: 'art-2',
      title: 'استانداردهای متالوژی و عیب‌یابی ارتعاشی (FFT) در بیرینگ‌های صنعتی سنگین',
      category: 'متالوژی و تست NDT',
      categorySlug: 'quality',
      standardCode: 'ISO 10816 / DIN 620',
      excerpt:
        'تکنیک‌های پایش عیوب اولیه بلبرینگ‌ها با روش آنالیز فرکانس ارتعاشات FFT و تصویربرداری ترموگرافی در صنایع فولاد و سیمان.',
      author: 'دکتر سهراب دهقان',
      authorRole: 'متخصص متالوژی و بازرسی فنی',
      readTime: '۵ دقیقه مطالعه',
      date: '۰۸ شهریور ۱۴۰۳',
      image: STORE_ASSETS.whySanatQc,
      downloadsCount: 980,
      content: {
        introduction:
          'بیش از ۴۳٪ از خرابی‌های ناگهانی الکتروموتورها و گیربکس‌های صنعتی به علت خرابی بیرینگ ناشی از روانکاری نامناسب، لقی غیراستاندارد و خستگی متالوژیکی رخ می‌دهد.',
        sections: [
          {
            heading: '۱. فرکانس‌های عیب ویژه در طیف FFT',
            body: 'با پایش فرکانس‌های BPFO (خرابی رینگ خارجی)، BPFI (خرابی رینگ داخلی) و BSF (خرابی المان غلتان)، می‌توان عیب را قبل از وقوع خرابی فاجعه‌بار شناسایی کرد.',
            formula: 'BPFO = (n/2) × (RPM/60) × [1 - (d/D) × cos(θ)]',
            highlights: [
              'ثبت ارتعاشات در سه راستای شعاعی عمودی، شعاعی افقی و محوری ضروری است.',
              'دمای پوسته بیرینگ نباید از ۸۵ درجه سانتی‌گراد فراتر رود.',
            ],
          },
        ],
        conclusion:
          'استفاده از بیرینگ‌های اورجینال با استاندارد تلرانس P6 یا P5 و گریدهای لقی شعاعی C3 در ماشین‌آلات دور بالا ضامن کارکرد بی‌وقفه است.',
      },
    },
    {
      id: 'art-3',
      title: 'استقرار سامانه‌های پایش وضعیت هوشمند (PdM) و اینترنت اشیاء در خطوط تولید',
      category: 'پایش وضعیت و هوش مصنوعی',
      categorySlug: 'maintenance',
      standardCode: 'Industry 4.0 / PdM',
      excerpt:
        'نصب سنسورهای وایرلس پایش دما، ارتعاش و جریان مصرفی ماشین‌آلات و پیش‌بینی هوشمند زمان تعویض قطعات مستهلک قبل از توقف خط.',
      author: 'مهندس نیما شمس',
      authorRole: 'مدیر مهندسی سیستم‌های هوشمند',
      readTime: '۶ دقیقه مطالعه',
      date: '۲۸ مرداد ۱۴۰۳',
      image: STORE_ASSETS.predictiveMaintenanceSensor,
      downloadsCount: 1150,
      content: {
        introduction:
          'رویکرد نگهداری و تعمیرات پیشبینانه (Predictive Maintenance) با تحلیل داده‌های سنسورهای هوشمند زمان دقیق سرویس و تعویض قطعه را تعیین کرده و شاخص MTBF را تا ۴۵٪ بهبود می‌بخشد.',
        sections: [
          {
            heading: '۱. معماری سنسورهای پایش بلادرنگ',
            body: 'سنسورهای ارتعاش‌سنج سه‌محوره پیزوالکتریک متصل به پردازنده‌های Edge، داده‌های شتاب، سرعت و دیسپلیسمنت را مستقیماً تحلیل و در صورت تجاوز از حد مجاز آلارم صادر می‌کنند.',
            highlights: [
              'کاهش هزینه‌های دپوی قطعات مازاد با پیش‌بینی دقیق زمان مصرف.',
              'ارتباط مستقیم با انبار هایپر صنعت جهت ارسال خودکار قطعه یدکی.',
            ],
          },
        ],
        conclusion:
          'ترکیب پایش هوشمند ارتعاشات با لجستیک اکسپرس هایپر صنعت، شاخص زمان توقف ناخواسته کارخانه را به صفر نزدیک می‌کند.',
      },
    },
    {
      id: 'art-4',
      title: 'مهندسی معکوس و تحلیل تنش قطعات پایپینگ و شیرآلات تحت فشار بالا',
      category: 'پایپینگ و مهندسی معکوس',
      categorySlug: 'engineering',
      standardCode: 'ASME B16.34 / API 6D',
      excerpt:
        'مراحل اسکن سه‌بعدی اپتیکال، آنالیز متریال با کوانتومتری و شبیه‌سازی عددی تنش در فیتینگ‌ها و ولوهای کارخانجات پتروشیمی.',
      author: 'مهندس پریسا رستمی',
      authorRole: 'طراح ارشد مکانیک و قطعات صنعتی',
      readTime: '۴ دقیقه مطالعه',
      date: '۱۴ مرداد ۱۴۰۳',
      image: STORE_ASSETS.reverseEngineeringLab,
      downloadsCount: 820,
      content: {
        introduction:
          'هنگامی که قطعات فابریک خطوط خارجی به علت تحریم یا توقف تولید سازنده در دسترس نیستند، فرایند استاندارد مهندسی معکوس با تطبیق دقیق گرید آلیاژی و تلرانس‌های ساخت، راه‌حل نهایی است.',
        sections: [
          {
            heading: '۱. مراحل استاندارد مهندسی معکوس در آزمایشگاه هایپر صنعت',
            body: 'ابتدا قطعه با اسکنر اپتیکال سه‌بعدی با دقت میکرونی ابر نقاط تولید می‌شود. سپس با تست متالوژی کوانتومتری گرید آلیاژی (نظیر استیل ۳۱۶L، مونل یا اینکونل) شناسایی شده و در محیط CAD مدل‌سازی می‌شود.',
            highlights: [
              'شبیه‌سازی تنش المان محدود (FEA) تحت فشارهای هیدرواستاتیک بالا.',
              'تطبیق استانداردهای نشیمنگاه (Seat) و آب‌بندی در برابر سیالات خورنده.',
            ],
          },
        ],
        conclusion:
          'ارائه نقشه ساخت، گزارش آزمون غیرمخرب (NDT) و صدور تاییدیه متالوژی، خیال مدیران فنی کارخانجات را از کارکرد ایمن قطعه راحت می‌کند.',
      },
    },
  ];

  const filteredArticles = articles.filter((article) => {
    const matchesCat = activeCategory === 'all' || article.categorySlug === activeCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.standardCode.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <section className="relative w-full py-12 sm:py-16 bg-white text-slate-900 border-b border-slate-200/80 overflow-hidden" dir="rtl">
      {/* Background Subtle Ambient Highlights */}
      <div className="absolute inset-0 bg-[radial-gradient(#12203c08_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-orange-500/5 via-amber-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-blue-600/5 via-cyan-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10 relative z-10">
        
        {/* ===================================================================== */}
        {/* 1. TOP EDITORIAL HEADER & ACTION BAR                                  */}
        {/* ===================================================================== */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-slate-200">
          <div className="space-y-2.5 text-right max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200/80 text-xs font-black text-[#E06518]">
              <span className="w-2 h-2 rounded-full bg-[#E06518] animate-pulse" />
              <span>دانشنامه مهندسی و مرجع فنی خطوط تولید کارخانجات</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-[36px] font-black leading-[1.25] tracking-tight text-[#12203C]">
              دانشنامه و مقالات تخصصی{' '}
              <span className="text-[#E06518] relative inline-block">
                صنعت‌پیش
                <span className="absolute -bottom-1 inset-x-0 h-1 bg-[#E06518]/20 rounded-full" />
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              مرجع کاربردی محاسبات مهندسی، انتخاب و تطبیق استاندارد قطعات صنعتی، راهنمای پایش وضعیت ماشین‌آلات و دستورالعمل‌های نگهداری و تعمیرات پیشگیرانه (PM).
            </p>
          </div>

          {/* Quick Search & Filter Input */}
          <div className="w-full lg:w-80 relative shrink-0">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجو بر اساس استاندارد، فرمول یا موضوع..."
              className="w-full h-11 pr-10 pl-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#E06518] focus:ring-2 focus:ring-orange-500/20 transition-all shadow-2xs"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute left-3 top-3 text-slate-400 hover:text-slate-600 text-xs"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* ===================================================================== */}
        {/* 2. CATEGORY PILL TABS                                                 */}
        {/* ===================================================================== */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            const IconComp = cat.icon;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 flex items-center gap-2 ${
                  isActive
                    ? 'bg-[#12203C] text-white shadow-md ring-2 ring-orange-500/30'
                    : 'bg-slate-50 border border-slate-200 text-slate-600 hover:text-[#12203C] hover:bg-white hover:border-slate-300'
                }`}
              >
                {IconComp && <IconComp className={`w-3.5 h-3.5 ${isActive ? 'text-[#E06518]' : 'text-slate-400'}`} />}
                <span>{cat.label}</span>
                {cat.id === 'all' && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-black ${isActive ? 'bg-orange-500 text-white' : 'bg-slate-200 text-slate-600'}`}>
                    {articles.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ===================================================================== */}
        {/* 3. RESPONSIVE INDUSTRIAL ARTICLE CARDS GRID                           */}
        {/* ===================================================================== */}
        {filteredArticles.length === 0 ? (
          <div className="py-16 text-center bg-slate-50 rounded-2xl border border-slate-200/90 space-y-3">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
            <div className="text-sm font-bold text-slate-700">مقاله‌ای با این عبارت یافت نشد.</div>
            <button
              type="button"
              onClick={() => {
                setActiveCategory('all');
                setSearchQuery('');
              }}
              className="text-xs font-bold text-[#E06518] hover:underline cursor-pointer"
            >
              مشاهده تمام مقالات دانشنامه
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 items-stretch">
            {filteredArticles.map((art) => (
              <div
                key={art.id}
                onClick={() => setSelectedArticle(art)}
                className="group bg-white rounded-2xl border border-slate-200/90 hover:border-[#E06518] hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer relative"
              >
                {/* Visual Header Image with Standard Pill */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-900 shrink-0">
                  <img
                    src={art.image}
                    alt={art.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                  {/* Standard DIN / ISO Code Badge */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    <span className="px-2.5 py-1 rounded-lg bg-[#12203C]/90 backdrop-blur-md border border-white/20 text-orange-400 font-mono text-[10px] font-bold shadow-sm">
                      {art.standardCode}
                    </span>
                  </div>

                  {/* Category Pill on top left */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-[10px] font-bold border border-white/10">
                      {art.category}
                    </span>
                  </div>

                  {/* Read Time & Author on Bottom of Thumbnail */}
                  <div className="absolute bottom-2.5 right-3 left-3 flex items-center justify-between text-[11px] text-slate-200">
                    <div className="flex items-center gap-1.5 line-clamp-1">
                      <User className="w-3 h-3 text-orange-400 shrink-0" />
                      <span className="truncate">{art.author}</span>
                    </div>
                    <div className="flex items-center gap-1 font-mono text-[10px] text-slate-300 shrink-0">
                      <Clock className="w-3 h-3 text-orange-400" />
                      <span>{art.readTime}</span>
                    </div>
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3.5 text-right">
                  <div className="space-y-2">
                    <h3 className="text-sm sm:text-[15px] font-black text-[#12203C] leading-snug group-hover:text-[#E06518] transition-colors line-clamp-2">
                      {art.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-normal line-clamp-3">
                      {art.excerpt}
                    </p>
                  </div>

                  {/* Footer Action Card */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-mono">{art.date}</span>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E06518] group-hover:translate-x-[-3px] transition-transform cursor-pointer"
                    >
                      <span>مطالعه مقاله</span>
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ===================================================================== */}
        {/* 4. QUICK ENGINEERING BLUEPRINTS & HANDBOOKS TOOLBAR                  */}
        {/* ===================================================================== */}
        <div className="pt-4 border-t border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Quick Card 1: جدول گام تسمه‌های صنعتی */}
            <div className="bg-slate-50 hover:bg-orange-50/50 border border-slate-200 hover:border-orange-300 rounded-xl p-4 flex items-center gap-3.5 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#E06518] flex items-center justify-center shrink-0 group-hover:bg-[#E06518] group-hover:text-white transition-colors">
                <Calculator className="w-5 h-5" />
              </div>
              <div className="flex-1 text-right min-w-0">
                <div className="text-xs font-bold text-[#12203C] group-hover:text-[#E06518] transition-colors truncate">
                  جدول گام و طول استاندارد تسمه‌ها
                </div>
                <div className="text-[11px] text-slate-500">فرمول محاسبه توان و فاصله محوری پولی‌ها</div>
              </div>
              <ChevronLeft className="w-4 h-4 text-slate-400 group-hover:text-[#E06518] group-hover:-translate-x-1 transition-all shrink-0" />
            </div>

            {/* Quick Card 2: جدول لقی بلبرینگ‌ها */}
            <div className="bg-slate-50 hover:bg-orange-50/50 border border-slate-200 hover:border-orange-300 rounded-xl p-4 flex items-center gap-3.5 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#E06518] flex items-center justify-center shrink-0 group-hover:bg-[#E06518] group-hover:text-white transition-colors">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="flex-1 text-right min-w-0">
                <div className="text-xs font-bold text-[#12203C] group-hover:text-[#E06518] transition-colors truncate">
                  جدول لقی شعاعی بلبرینگ‌های C3 و C4
                </div>
                <div className="text-[11px] text-slate-500">راهنمای انتخاب گریدهای لقی در دورهای بالا</div>
              </div>
              <ChevronLeft className="w-4 h-4 text-slate-400 group-hover:text-[#E06518] group-hover:-translate-x-1 transition-all shrink-0" />
            </div>

            {/* Quick Card 3: راهنمای عیب‌یابی PM */}
            <div className="bg-slate-50 hover:bg-orange-50/50 border border-slate-200 hover:border-orange-300 rounded-xl p-4 flex items-center gap-3.5 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#E06518] flex items-center justify-center shrink-0 group-hover:bg-[#E06518] group-hover:text-white transition-colors">
                <FileText className="w-5 h-5" />
              </div>
              <div className="flex-1 text-right min-w-0">
                <div className="text-xs font-bold text-[#12203C] group-hover:text-[#E06518] transition-colors truncate">
                  چک‌لیست نگهداری و تعمیرات پیشگیرانه
                </div>
                <div className="text-[11px] text-slate-500">دستورالعمل روانکاری و بازرسی روزانه خطوط</div>
              </div>
              <ChevronLeft className="w-4 h-4 text-slate-400 group-hover:text-[#E06518] group-hover:-translate-x-1 transition-all shrink-0" />
            </div>

          </div>
        </div>

      </div>

      {/* ===================================================================== */}
      {/* 5. FULL TECHNICAL ARTICLE READING MODAL                                */}
      {/* ===================================================================== */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="bg-white w-full max-w-3xl max-h-[90vh] rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden text-right"
            dir="rtl"
          >
            {/* Modal Header */}
            <div className="relative h-48 sm:h-60 w-full overflow-hidden bg-slate-900 shrink-0">
              <img
                src={selectedArticle.image}
                alt={selectedArticle.title}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedArticle(null)}
                className="absolute top-4 left-4 w-9 h-9 rounded-full bg-black/60 hover:bg-[#E06518] text-white flex items-center justify-center backdrop-blur-md transition-colors cursor-pointer border border-white/20"
                aria-label="بستن"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Badges on modal image */}
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-[#E06518] text-white text-xs font-bold">
                  {selectedArticle.category}
                </span>
                <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white font-mono text-xs font-bold border border-white/20">
                  {selectedArticle.standardCode}
                </span>
              </div>

              {/* Title & Author on Modal Header */}
              <div className="absolute bottom-4 right-4 left-4 space-y-1.5 text-white">
                <h3 className="text-base sm:text-xl font-black leading-snug">
                  {selectedArticle.title}
                </h3>
                <div className="flex items-center gap-4 text-xs text-slate-200">
                  <span className="font-bold text-orange-400">{selectedArticle.author} ({selectedArticle.authorRole})</span>
                  <span className="text-slate-400 font-mono">{selectedArticle.date}</span>
                </div>
              </div>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-800 text-xs sm:text-sm leading-relaxed">
              
              {/* Introduction Box */}
              <div className="p-4 rounded-2xl bg-orange-50/80 border border-orange-200/80 text-slate-800 space-y-1.5">
                <div className="font-bold text-[#E06518] text-xs flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>چکیده فنی و ضرورت بررسی</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-normal">
                  {selectedArticle.content.introduction}
                </p>
              </div>

              {/* Dynamic Content Sections */}
              {selectedArticle.content.sections.map((sec, idx) => (
                <div key={idx} className="space-y-3">
                  <h4 className="text-sm sm:text-base font-black text-[#12203C]">
                    {sec.heading}
                  </h4>
                  <p className="text-slate-600 font-normal leading-relaxed">
                    {sec.body}
                  </p>

                  {/* Formula Display Box */}
                  {sec.formula && (
                    <div className="p-3.5 rounded-xl bg-slate-900 text-orange-400 font-mono text-xs sm:text-sm text-center border border-slate-800 shadow-inner">
                      {sec.formula}
                    </div>
                  )}

                  {/* Bullet Highlights */}
                  {sec.highlights && (
                    <ul className="space-y-1.5 pr-2">
                      {sec.highlights.map((h, hIdx) => (
                        <li key={hIdx} className="flex items-start gap-2 text-xs text-slate-700">
                          <CheckCircle2 className="w-4 h-4 text-[#E06518] shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}

              {/* Conclusion Box */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-700 space-y-1">
                <div className="font-bold text-[#12203C] text-xs">نتیجه‌گیری مهندسی:</div>
                <p className="text-xs text-slate-600 font-normal leading-relaxed">
                  {selectedArticle.content.conclusion}
                </p>
              </div>

            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-slate-500 flex items-center gap-1.5">
                <Download className="w-4 h-4 text-[#E06518]" />
                <span>تعداد دانلود برگه فنی: <strong className="text-slate-800 font-mono">{selectedArticle.downloadsCount} بار</strong></span>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedArticle(null)}
                  className="h-10 px-5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  بستن پنجره
                </button>
                <Link
                  to="/products"
                  className="h-10 px-6 bg-[#E06518] hover:bg-[#C95210] text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2 shadow-md cursor-pointer"
                >
                  <span>مشاهده قطعات مرتبط در فروشگاه</span>
                  <ArrowLeft className="w-4 h-4" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      )}
    </section>
  );
};
