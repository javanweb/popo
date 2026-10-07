import React from 'react';
import { Camera, ArrowLeft } from 'lucide-react';
import { STORE_ASSETS } from '../../assets/images';

interface AiFeatureDualBannerProps {
  onOpenVisualSearch: () => void;
  onOpenConsult: () => void;
}

export const AiFeatureDualBanner: React.FC<AiFeatureDualBannerProps> = ({
  onOpenVisualSearch,
  onOpenConsult,
}) => {
  return (
    <section
      className="relative overflow-hidden rounded-[28px] sm:rounded-[36px] bg-[#222731] text-white border border-slate-700/60 shadow-[0_12px_45px_rgba(0,0,0,0.4),0_0_30px_rgba(224,101,24,0.12)] p-4 sm:p-6 lg:py-7 lg:px-8 select-none"
      dir="rtl"
    >
      {/* Background Dot-Matrix Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff10_1.2px,transparent_1.2px)] [background-size:20px_20px] pointer-events-none opacity-90" />

      {/* Ambient Lighting / Glows */}
      <div className="absolute -left-10 -bottom-10 w-80 h-80 bg-[#E06518]/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -right-10 -top-10 w-80 h-80 bg-[#E06518]/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 inset-x-12 h-[2px] bg-gradient-to-r from-transparent via-[#E06518]/60 to-transparent shadow-[0_0_15px_#E06518] pointer-events-none" />

      {/* ========================================================================= */}
      {/* HIGH-TECH CIRCUIT SVG OVERLAY (Connecting left and right with neon orange) */}
      {/* ========================================================================= */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-0 hidden md:block"
        viewBox="0 0 1200 240"
        preserveAspectRatio="none"
        fill="none"
      >
        <defs>
          <linearGradient id="neonOrangeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#E06518" stopOpacity="0.7" />
            <stop offset="25%" stopColor="#FF9E2C" stopOpacity="1" />
            <stop offset="50%" stopColor="#FFC876" stopOpacity="1" />
            <stop offset="75%" stopColor="#FF9E2C" stopOpacity="1" />
            <stop offset="100%" stopColor="#E06518" stopOpacity="0.7" />
          </linearGradient>

          <filter id="neonGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Diagonal Circuit Traces from Left Image Box */}
        <path
          d="M 180 120 L 270 120 L 330 65 L 480 65"
          stroke="#E06518"
          strokeWidth="1.8"
          strokeOpacity="0.7"
          filter="url(#neonGlow)"
          fill="none"
        />
        <path
          d="M 190 145 L 260 145 L 310 195 L 460 195"
          stroke="#E06518"
          strokeWidth="1.8"
          strokeDasharray="5 5"
          strokeOpacity="0.65"
          fill="none"
        />

        {/* Main Center Highway Lines */}
        <path
          d="M 330 145 L 530 145 L 570 145 L 630 145 L 670 145 L 870 145"
          stroke="url(#neonOrangeGrad)"
          strokeWidth="2.8"
          filter="url(#neonGlow)"
          fill="none"
        />
        {/* Upper Stepped Center Circuit */}
        <path
          d="M 440 145 L 500 95 L 700 95 L 760 145"
          stroke="#FFA14A"
          strokeWidth="1.8"
          strokeOpacity="0.8"
          filter="url(#neonGlow)"
          fill="none"
        />
        {/* Center Dashed Horizontal Track */}
        <path
          d="M 380 160 L 520 160 L 550 185 L 650 185 L 680 160 L 820 160"
          stroke="#E06518"
          strokeWidth="1.8"
          strokeDasharray="6 6"
          strokeOpacity="0.85"
          fill="none"
        />

        {/* Diagonal Circuit Traces to Right Image Box */}
        <path
          d="M 720 65 L 870 65 L 930 120 L 1020 120"
          stroke="#E06518"
          strokeWidth="1.8"
          strokeOpacity="0.7"
          filter="url(#neonGlow)"
          fill="none"
        />
        <path
          d="M 740 195 L 890 195 L 940 145 L 1010 145"
          stroke="#E06518"
          strokeWidth="1.8"
          strokeDasharray="5 5"
          strokeOpacity="0.65"
          fill="none"
        />

        {/* Intersecting Glowing Circuit Nodes */}
        <circle cx="270" cy="120" r="4" fill="#FFA14A" filter="url(#neonGlow)" />
        <circle cx="330" cy="65" r="3.5" fill="#FFC876" filter="url(#neonGlow)" />
        <circle cx="500" cy="95" r="3.5" fill="#FFC876" filter="url(#neonGlow)" />
        <circle cx="700" cy="95" r="3.5" fill="#FFC876" filter="url(#neonGlow)" />
        <circle cx="870" cy="65" r="3.5" fill="#FFC876" filter="url(#neonGlow)" />
        <circle cx="930" cy="120" r="4" fill="#FFA14A" filter="url(#neonGlow)" />

        {/* Center Illuminated Diamond Node */}
        <g transform="translate(600, 145)">
          <circle cx="0" cy="0" r="15" fill="#222731" stroke="#E06518" strokeWidth="2" />
          <polygon
            points="0,-7 7,0 0,7 -7,0"
            fill="#FFC876"
            filter="url(#neonGlow)"
          />
        </g>
      </svg>

      {/* Main Content Grid: Card A (Right in RTL) & Card B (Left in RTL) */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        
        {/* ===================================================================== */}
        {/* RIGHT CARD (مشاوره هوشمند قطعات تولید)                                  */}
        {/* ===================================================================== */}
        <div className="flex flex-col-reverse sm:flex-row items-center gap-5 sm:gap-6 justify-between lg:justify-end text-right">
          {/* Details */}
          <div className="space-y-2.5 flex-1 max-w-md text-right">
            <h3 className="text-lg sm:text-xl lg:text-[22px] font-black text-white leading-snug drop-shadow-sm">
              مشاوره هوشمند قطعات تولید
            </h3>
            <p className="text-xs sm:text-[13px] text-slate-300 leading-relaxed font-normal">
              مشخصات یا ایراد خط تولید کارخانه خود را اعلام کنید تا سامانه هوشمند هایپر صنعت بهترین قطعات جایگزین را به شما پیشنهاد دهد.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={onOpenConsult}
                className="h-11 px-7 rounded-full bg-[#1A222E] hover:bg-[#242E3E] text-white border border-slate-600 hover:border-[#E06518] text-xs sm:text-sm font-bold transition-all duration-300 shadow-md flex items-center justify-center gap-3 cursor-pointer group active:scale-95"
              >
                <span>شروع مشاوره آنلاین قطعه</span>
                <ArrowLeft className="w-4 h-4 text-slate-300 group-hover:text-white group-hover:-translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Visual AI Avatar Box (Far Right) */}
          <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-2xl overflow-hidden shrink-0 border-2 border-orange-500/50 shadow-[0_0_25px_rgba(224,101,24,0.3)] bg-[#0C121D] p-1 group">
            <div className="w-full h-full rounded-xl overflow-hidden relative">
              <img
                src={STORE_ASSETS.aiConsultRobot}
                alt="مشاوره هوشمند قطعات خط تولید"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent pointer-events-none" />
              {/* Bottom Badge Tag */}
              <div className="absolute bottom-1.5 inset-x-1.5 bg-[#121A2A]/90 backdrop-blur-md text-[10px] text-center font-bold text-orange-400 py-1 rounded-lg border border-orange-500/40 shadow-sm">
                هوشمند خط تولید
              </div>
            </div>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* LEFT CARD (شناسایی تصویری قطعه با هوش مصنوعی)                           */}
        {/* ===================================================================== */}
        <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-6 justify-between lg:justify-start text-right pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-700/60">
          {/* Visual Scanner Box (Far Left) */}
          <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-2xl overflow-hidden shrink-0 border-2 border-orange-500/50 shadow-[0_0_25px_rgba(224,101,24,0.3)] bg-[#0C121D] p-1 group">
            <div className="w-full h-full rounded-xl overflow-hidden relative">
              <img
                src={STORE_ASSETS.aiSearchMobile}
                alt="شناسایی تصویری قطعه با هوش مصنوعی"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              {/* Top Left Target Ring Indicator */}
              <div className="absolute top-2 left-2 w-5 h-5 rounded-full bg-[#12203C]/90 backdrop-blur-md flex items-center justify-center border border-white/20">
                <span className="w-2 h-2 rounded-full bg-[#E06518] animate-ping" />
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-2.5 flex-1 max-w-md text-right">
            <h3 className="text-lg sm:text-xl lg:text-[22px] font-black text-white leading-snug drop-shadow-sm">
              شناسایی تصویری قطعه با هوش مصنوعی
            </h3>
            <p className="text-xs sm:text-[13px] text-slate-300 leading-relaxed font-normal">
              از قطعه مستهلک، تسمه، پلاک ماشین‌آلات خط تولید عکس بگیرید تا قطعه فابریک استاندارد در انبار هایپر صنعت فوراً شناسایی شود.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={onOpenVisualSearch}
                className="h-11 px-7 rounded-full bg-gradient-to-r from-[#D85A0E] via-[#E06518] to-[#EA580C] hover:from-[#B43D05] hover:to-[#C95210] text-white text-xs sm:text-sm font-bold transition-all duration-300 shadow-[0_4px_20px_rgba(224,101,24,0.45)] hover:shadow-[0_6px_25px_rgba(224,101,24,0.65)] hover:scale-[1.02] flex items-center justify-center gap-2.5 cursor-pointer active:scale-95"
              >
                <Camera className="w-4 h-4 text-white shrink-0" />
                <span>ارسال تصویر قطعه خط تولید</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
