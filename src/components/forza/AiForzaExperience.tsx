import React from 'react';
import { ChevronDown, X } from 'lucide-react';
import { STORE_ASSETS } from '../../assets/images';

interface AiForzaExperienceProps {
  onClose?: () => void;
  showCloseButton?: boolean;
}

export const AiForzaExperience: React.FC<AiForzaExperienceProps> = ({
  onClose,
  showCloseButton = true,
}) => {
  return (
    <div
      className="relative w-full h-full min-h-[100dvh] max-h-[100dvh] overflow-hidden bg-[#0A0D12] select-none text-white font-sans"
      style={{
        width: '100vw',
        height: '100dvh',
      }}
      dir="ltr"
    >
      {/* =================================================================== */}
      {/* 1. ATMOSPHERIC INDUSTRIAL REFINERY BACKGROUND LAYER                 */}
      {/* Edge-to-edge full viewport coverage with cinematic depth           */}
      {/* =================================================================== */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Desktop Wide Backdrop (>= 768px) */}
        <div className="hidden md:block absolute inset-0 w-full h-full">
          <img
            src={STORE_ASSETS.refineryDuskWide || STORE_ASSETS.industries.bgPlant}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover object-center filter brightness-[0.88] contrast-[1.12]"
          />
          {/* Ambient Refinery Light Flare & Slow Warm Twilight Shimmer */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0D12] via-transparent to-[#0A0D12]/70" />
          <div className="absolute inset-0 bg-radial from-transparent via-[#0A0D12]/40 to-[#0A0D12]/90" />
          <div className="absolute inset-0 animate-ai-atmosphere bg-radial from-[#E06518]/10 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Mobile Portrait Dedicated Backdrop (< 768px) */}
        <div className="block md:hidden absolute inset-0 w-full h-full">
          <img
            src={STORE_ASSETS.aiForzaCyborg}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover object-center filter blur-md scale-105 brightness-[0.45] contrast-[1.2]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A0D12]/80 via-transparent to-[#0A0D12]/90" />
          <div className="absolute inset-0 bg-radial from-transparent via-[#0A0D12]/50 to-[#0A0D12]" />
        </div>

        {/* Soft Industrial Steam & Light Flicker */}
        <div className="absolute inset-0 animate-ai-refinery-lights pointer-events-none opacity-40 mix-blend-screen bg-gradient-to-r from-transparent via-[#E06518]/15 to-transparent" />
      </div>

      {/* =================================================================== */}
      {/* 2. MAIN HERO AI FORZA CHARACTER - DESKTOP & MOBILE ART DIRECTION   */}
      {/* Centered, edge-to-edge presence, 0% cursor reaction, autonomous    */}
      {/* =================================================================== */}
      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none overflow-hidden">
        {/* ----------------------------------------------------------------- */}
        {/* DESKTOP ART DIRECTION (>= 768px): 75–85% viewport height, wide    */}
        {/* ----------------------------------------------------------------- */}
        <div className="hidden md:flex relative h-full w-full items-end justify-center pb-0">
          <div className="relative h-[82vh] lg:h-[86vh] max-h-[1100px] aspect-[942/1670] flex items-center justify-center">
            {/* The Authentic AI FORZA Character Reference */}
            <img
              src={STORE_ASSETS.aiForzaCyborg}
              alt="AI FORZA Industrial Intelligence"
              className="w-full h-full object-contain object-bottom drop-shadow-[0_20px_60px_rgba(0,0,0,0.9)] select-none"
            />

            {/* Seamless Soft Feathering to melt naturally into the wide refinery */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                maskImage:
                  'radial-gradient(ellipse 90% 92% at 50% 50%, black 72%, transparent 100%)',
                WebkitMaskImage:
                  'radial-gradient(ellipse 90% 92% at 50% 50%, black 72%, transparent 100%)',
              }}
            />

            {/* --- SYNCHRONIZED ANIMATION LAYER 1: ENERGY FLOW (NEURAL PATHWAYS) --- */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 942 1670"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <filter id="orangeEnergyGlowDesktop" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="5" result="blur1" />
                  <feGaussianBlur stdDeviation="14" result="blur2" />
                  <feMerge>
                    <feMergeNode in="blur2" />
                    <feMergeNode in="blur1" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Vertical Facial Seam Energy Conduit */}
              <path
                d="M471 200 L471 470"
                stroke="#FFFFFF"
                strokeWidth="2.5"
                strokeLinecap="round"
                filter="url(#orangeEnergyGlowDesktop)"
                strokeDasharray="40 180"
                className="animate-ai-conduit-slow opacity-80"
              />

              {/* Cervical & Neck Energy Flow Lines */}
              <path
                d="M471 460 Q450 510 420 575"
                stroke="#E06518"
                strokeWidth="3.5"
                strokeLinecap="round"
                filter="url(#orangeEnergyGlowDesktop)"
                strokeDasharray="60 140"
                className="animate-ai-conduit-slow"
              />
              <path
                d="M471 460 Q492 510 522 575"
                stroke="#E06518"
                strokeWidth="3.5"
                strokeLinecap="round"
                filter="url(#orangeEnergyGlowDesktop)"
                strokeDasharray="60 140"
                className="animate-ai-conduit-slow"
              />

              {/* Clavicular Shoulders Arches (Left & Right) */}
              <path
                d="M471 580 Q340 600 230 700 Q150 780 100 890"
                stroke="#E06518"
                strokeWidth="4"
                strokeLinecap="round"
                filter="url(#orangeEnergyGlowDesktop)"
                strokeDasharray="90 200"
                className="animate-ai-conduit-slow opacity-90"
              />
              <path
                d="M471 580 Q602 600 712 700 Q792 780 842 890"
                stroke="#E06518"
                strokeWidth="4"
                strokeLinecap="round"
                filter="url(#orangeEnergyGlowDesktop)"
                strokeDasharray="90 200"
                className="animate-ai-conduit-slow opacity-90"
              />

              {/* Pectoral Pathways Leading Into the Chest Core */}
              <path
                d="M260 720 Q360 760 410 840"
                stroke="#E06518"
                strokeWidth="3"
                strokeLinecap="round"
                filter="url(#orangeEnergyGlowDesktop)"
                strokeDasharray="50 150"
                className="animate-ai-conduit-reverse opacity-75"
              />
              <path
                d="M682 720 Q582 760 532 840"
                stroke="#E06518"
                strokeWidth="3"
                strokeLinecap="round"
                filter="url(#orangeEnergyGlowDesktop)"
                strokeDasharray="50 150"
                className="animate-ai-conduit-reverse opacity-75"
              />

              {/* Central Spinal & Torso Vertical Energy Conduit */}
              <path
                d="M471 960 L471 1480"
                stroke="#E06518"
                strokeWidth="4"
                strokeLinecap="round"
                filter="url(#orangeEnergyGlowDesktop)"
                strokeDasharray="80 220"
                className="animate-ai-conduit-slow"
              />

              {/* Intercostal & Abdominal Radiating Veins */}
              <path
                d="M471 1060 Q380 1110 320 1200"
                stroke="#E06518"
                strokeWidth="3"
                strokeLinecap="round"
                filter="url(#orangeEnergyGlowDesktop)"
                strokeDasharray="60 180"
                className="animate-ai-conduit-slow opacity-75"
              />
              <path
                d="M471 1060 Q562 1110 622 1200"
                stroke="#E06518"
                strokeWidth="3"
                strokeLinecap="round"
                filter="url(#orangeEnergyGlowDesktop)"
                strokeDasharray="60 180"
                className="animate-ai-conduit-slow opacity-75"
              />
              <path
                d="M471 1200 Q390 1250 350 1340"
                stroke="#E06518"
                strokeWidth="2.5"
                strokeLinecap="round"
                filter="url(#orangeEnergyGlowDesktop)"
                strokeDasharray="50 150"
                className="animate-ai-conduit-reverse opacity-70"
              />
              <path
                d="M471 1200 Q552 1250 592 1340"
                stroke="#E06518"
                strokeWidth="2.5"
                strokeLinecap="round"
                filter="url(#orangeEnergyGlowDesktop)"
                strokeDasharray="50 150"
                className="animate-ai-conduit-reverse opacity-70"
              />
            </svg>

            {/* --- SYNCHRONIZED ANIMATION LAYER 4: HEAD INTERNAL ORANGE GLOW --- */}
            <div
              className="absolute pointer-events-none rounded-full animate-ai-head-glow"
              style={{
                top: '19%',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '18%',
                height: '18%',
                background:
                  'radial-gradient(circle, rgba(224, 101, 24, 0.7) 0%, rgba(224, 101, 24, 0.25) 45%, transparent 75%)',
                filter: 'blur(16px)',
              }}
            />

            {/* --- SYNCHRONIZED ANIMATION LAYER 5: WIREFRAME SHIMMER OVERLAY --- */}
            <div
              className="absolute inset-0 pointer-events-none overflow-hidden animate-ai-shimmer"
              style={{
                background:
                  'linear-gradient(180deg, transparent 0%, rgba(255, 255, 255, 0.08) 50%, transparent 100%)',
                mixBlendMode: 'screen',
              }}
            />

            {/* --- SYNCHRONIZED ANIMATION LAYER 2 & 3: CHEST CORE & OUTWARD PULSES --- */}
            {/* Concentric expanding outward energy pulses */}
            <div
              className="absolute pointer-events-none rounded-full border border-[#E06518]/60 animate-ai-pulse-ring-1"
              style={{
                top: '52.4%',
                left: '50%',
                width: '160px',
                height: '160px',
              }}
            />
            <div
              className="absolute pointer-events-none rounded-full border border-[#E06518]/40 animate-ai-pulse-ring-2"
              style={{
                top: '52.4%',
                left: '50%',
                width: '160px',
                height: '160px',
              }}
            />

            {/* Circular Embedded Chest Core Anchor */}
            <div
              className="absolute pointer-events-none flex items-center justify-center animate-ai-core-breathe"
              style={{
                top: '52.4%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '24%',
                aspectRatio: '1/1',
              }}
            >
              {/* Metallic Outer Ring (#55565A + Bevel + Subtle Glow) */}
              <div
                className="relative w-full h-full rounded-full p-[3px] shadow-[0_0_35px_rgba(224,101,24,0.65)]"
                style={{
                  background:
                    'linear-gradient(145deg, #7A7C80 0%, #353638 45%, #55565A 100%)',
                }}
              >
                {/* Thin Glowing Orange Inner Rim */}
                <div className="w-full h-full rounded-full p-[2px] bg-gradient-to-tr from-[#E06518] via-[#FF8833] to-[#E06518]">
                  {/* Dark Graphite Center Disc (#15171A) */}
                  <div className="w-full h-full rounded-full bg-[#15171A] flex flex-col items-center justify-center relative overflow-hidden shadow-inner">
                    {/* Radial Internal Core Glow */}
                    <div className="absolute inset-0 bg-radial from-[#E06518]/45 via-[#E06518]/15 to-transparent" />

                    {/* Fine Concentric HUD Depth Lines */}
                    <div className="absolute inset-2 rounded-full border border-white/10" />
                    <div className="absolute inset-4 rounded-full border border-[#E06518]/25" />

                    {/* Subtle Curved Glass Glare */}
                    <div
                      className="absolute top-0 inset-x-0 h-1/2 rounded-t-full opacity-20 pointer-events-none"
                      style={{
                        background:
                          'linear-gradient(to bottom, rgba(255,255,255,0.7) 0%, transparent 100%)',
                      }}
                    />

                    {/* AI Logo Mark */}
                    <div className="relative z-10 flex items-center justify-center font-black tracking-tighter">
                      <span className="text-[#E06518] text-xl lg:text-2xl drop-shadow-[0_0_10px_rgba(224,101,24,0.8)] font-sans">
                        A
                      </span>
                      <span className="text-white text-xl lg:text-2xl drop-shadow-[0_0_8px_rgba(255,255,255,0.6)] font-sans">
                        I
                      </span>
                    </div>

                    {/* FORZA Secondary Typography */}
                    <div className="relative z-10 text-[9px] lg:text-[10px] tracking-[0.25em] text-white/95 font-bold uppercase mt-0.5">
                      FORZA
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* MOBILE ART DIRECTION (< 768px): Dedicated Portrait Fullscreen    */}
        {/* ----------------------------------------------------------------- */}
        <div className="flex md:hidden relative w-full h-full min-h-[100dvh] items-center justify-center overflow-hidden">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* The Full Portrait AI FORZA Reference Image */}
            <img
              src={STORE_ASSETS.aiForzaCyborg}
              alt="AI FORZA Industrial Intelligence"
              className="w-full h-full object-cover object-center select-none"
            />

            {/* Seamless Vignette at Edges */}
            <div className="absolute inset-0 bg-radial from-transparent via-[#0A0D12]/20 to-[#0A0D12]/60 pointer-events-none" />

            {/* --- MOBILE SYNCHRONIZED ENERGY FLOW (NEURAL PATHWAYS) --- */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 942 1670"
              preserveAspectRatio="xMidYMid slice"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <filter id="orangeEnergyGlowMobile" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="6" result="blur1" />
                  <feGaussianBlur stdDeviation="16" result="blur2" />
                  <feMerge>
                    <feMergeNode in="blur2" />
                    <feMergeNode in="blur1" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Vertical Facial Seam */}
              <path
                d="M471 200 L471 470"
                stroke="#FFFFFF"
                strokeWidth="3"
                strokeLinecap="round"
                filter="url(#orangeEnergyGlowMobile)"
                strokeDasharray="40 180"
                className="animate-ai-conduit-slow opacity-90"
              />

              {/* Neck & Clavicle Conduits */}
              <path
                d="M471 460 Q450 510 420 575"
                stroke="#E06518"
                strokeWidth="4"
                strokeLinecap="round"
                filter="url(#orangeEnergyGlowMobile)"
                strokeDasharray="60 140"
                className="animate-ai-conduit-slow"
              />
              <path
                d="M471 460 Q492 510 522 575"
                stroke="#E06518"
                strokeWidth="4"
                strokeLinecap="round"
                filter="url(#orangeEnergyGlowMobile)"
                strokeDasharray="60 140"
                className="animate-ai-conduit-slow"
              />

              {/* Shoulders Pathways */}
              <path
                d="M471 580 Q340 600 230 700 Q150 780 100 890"
                stroke="#E06518"
                strokeWidth="4.5"
                strokeLinecap="round"
                filter="url(#orangeEnergyGlowMobile)"
                strokeDasharray="90 200"
                className="animate-ai-conduit-slow opacity-90"
              />
              <path
                d="M471 580 Q602 600 712 700 Q792 780 842 890"
                stroke="#E06518"
                strokeWidth="4.5"
                strokeLinecap="round"
                filter="url(#orangeEnergyGlowMobile)"
                strokeDasharray="90 200"
                className="animate-ai-conduit-slow opacity-90"
              />

              {/* Torso & Abdomen Vertical Conduit */}
              <path
                d="M471 960 L471 1480"
                stroke="#E06518"
                strokeWidth="4.5"
                strokeLinecap="round"
                filter="url(#orangeEnergyGlowMobile)"
                strokeDasharray="80 220"
                className="animate-ai-conduit-slow"
              />
            </svg>

            {/* --- MOBILE HEAD INTERNAL GLOW --- */}
            <div
              className="absolute pointer-events-none rounded-full animate-ai-head-glow"
              style={{
                top: '18%',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '28%',
                height: '16%',
                background:
                  'radial-gradient(circle, rgba(224, 101, 24, 0.75) 0%, rgba(224, 101, 24, 0.25) 45%, transparent 75%)',
                filter: 'blur(16px)',
              }}
            />

            {/* --- MOBILE WIREFRAME SHIMMER --- */}
            <div
              className="absolute inset-0 pointer-events-none overflow-hidden animate-ai-shimmer"
              style={{
                background:
                  'linear-gradient(180deg, transparent 0%, rgba(255, 255, 255, 0.09) 50%, transparent 100%)',
                mixBlendMode: 'screen',
              }}
            />

            {/* --- MOBILE CHEST CORE & PULSES --- */}
            <div
              className="absolute pointer-events-none rounded-full border border-[#E06518]/50 animate-ai-pulse-ring-1"
              style={{
                top: '52.4%',
                left: '50%',
                width: '150px',
                height: '150px',
              }}
            />

            <div
              className="absolute pointer-events-none flex items-center justify-center animate-ai-core-breathe"
              style={{
                top: '52.4%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '32%',
                maxWidth: '150px',
                aspectRatio: '1/1',
              }}
            >
              <div
                className="relative w-full h-full rounded-full p-[3px] shadow-[0_0_35px_rgba(224,101,24,0.7)]"
                style={{
                  background:
                    'linear-gradient(145deg, #7A7C80 0%, #353638 45%, #55565A 100%)',
                }}
              >
                <div className="w-full h-full rounded-full p-[2px] bg-gradient-to-tr from-[#E06518] via-[#FF8833] to-[#E06518]">
                  <div className="w-full h-full rounded-full bg-[#15171A] flex flex-col items-center justify-center relative overflow-hidden shadow-inner">
                    <div className="absolute inset-0 bg-radial from-[#E06518]/50 via-[#E06518]/15 to-transparent" />
                    <div className="absolute inset-1.5 rounded-full border border-white/10" />
                    <div className="absolute inset-3 rounded-full border border-[#E06518]/25" />

                    <div className="relative z-10 flex items-center justify-center font-black tracking-tighter">
                      <span className="text-[#E06518] text-xl drop-shadow-[0_0_10px_rgba(224,101,24,0.8)] font-sans">
                        A
                      </span>
                      <span className="text-white text-xl drop-shadow-[0_0_8px_rgba(255,255,255,0.6)] font-sans">
                        I
                      </span>
                    </div>

                    <div className="relative z-10 text-[9px] tracking-[0.25em] text-white/95 font-bold uppercase mt-0.5">
                      FORZA
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 3. MINIMAL FUTURISTIC HUD OVERLAY (EXTREMELY SUBTLE)                */}
      {/* Visual hierarchy: Character > Energy > Chest > Refinery > HUD       */}
      {/* =================================================================== */}

      {/* Top Left: Authentic Telemetry Gauge Bar with 4 indicator dots */}
      <div className="absolute top-6 left-6 md:top-8 md:left-8 z-30 pointer-events-none flex items-start gap-3">
        <div className="flex flex-col items-center">
          {/* Vertical orange line */}
          <div className="w-[2px] h-12 md:h-16 bg-gradient-to-b from-[#E06518] via-[#E06518]/70 to-transparent" />
          {/* Glowing telemetry bead */}
          <div className="w-1.5 h-3 rounded-full bg-[#E06518] shadow-[0_0_8px_#E06518] -mt-1" />
        </div>
        {/* Subtle Indicator Dots */}
        <div className="flex flex-col gap-1.5 pt-1 opacity-75">
          <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_4px_white]" />
          <span className="w-1.5 h-1.5 rounded-full bg-white/70" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#E06518] shadow-[0_0_4px_#E06518]" />
          <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
        </div>
      </div>

      {/* Top Center: Tiny Floating AI FORZA Identity */}
      <div className="absolute top-6 md:top-8 inset-x-0 z-30 flex justify-center pointer-events-none">
        <div className="flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[11px] md:text-xs tracking-[0.2em] font-medium text-white/80">
          <span className="w-1.5 h-1.5 rounded-full bg-[#E06518] animate-pulse shadow-[0_0_8px_#E06518]" />
          <span className="font-semibold text-white">AI FORZA</span>
          <span className="text-white/30">|</span>
          <span className="text-white/60 tracking-widest text-[9px] md:text-[10px]">AUTONOMOUS SYSTEM</span>
        </div>
      </div>

      {/* Top Right: Unobtrusive Exit Affordance (when applicable) */}
      {showCloseButton && onClose && (
        <div className="absolute top-6 right-6 md:top-8 md:right-8 z-40">
          <button
            type="button"
            onClick={onClose}
            aria-label="خروج و بازگشت به فروشگاه"
            title="خروج"
            className="w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/15 hover:border-[#E06518]/60 text-white/75 hover:text-white flex items-center justify-center transition-all duration-200 cursor-pointer shadow-lg active:scale-95"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Bottom Corner Subtle Chamfered Industrial Framing Lines */}
      {/* Bottom Left Chamfer */}
      <div className="absolute bottom-0 left-0 w-24 md:w-36 h-24 md:h-36 pointer-events-none z-20">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full opacity-60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 70 L30 100 H0 Z"
            fill="#E06518"
            className="opacity-75"
          />
          <path
            d="M0 50 L50 100 H75 L0 25 Z"
            fill="#55565A"
            className="opacity-50"
          />
          <path
            d="M0 20 L80 100"
            stroke="#E06518"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Bottom Right Chamfer */}
      <div className="absolute bottom-0 right-0 w-24 md:w-36 h-24 md:h-36 pointer-events-none z-20">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full opacity-60 scale-x-[-1]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 70 L30 100 H0 Z"
            fill="#E06518"
            className="opacity-75"
          />
          <path
            d="M0 50 L50 100 H75 L0 25 Z"
            fill="#55565A"
            className="opacity-50"
          />
          <path
            d="M0 20 L80 100"
            stroke="#E06518"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Bottom Center: Minimal Futuristic Scroll / Presence Capsule */}
      <div className="absolute bottom-6 md:bottom-8 inset-x-0 z-30 flex flex-col items-center justify-center pointer-events-none">
        <div className="animate-ai-scroll-float flex flex-col items-center gap-1">
          {/* Thin Futuristic Capsule with Glowing Orange Detail */}
          <div className="w-5 h-8 md:w-6 md:h-9 rounded-full border border-white/25 bg-black/30 backdrop-blur-sm flex items-start justify-center pt-1.5 shadow-[0_0_12px_rgba(0,0,0,0.5)]">
            <span className="w-1.5 h-2 rounded-full bg-gradient-to-b from-white to-[#E06518] shadow-[0_0_6px_#E06518]" />
          </div>
          {/* Small Downward Indicator Chevron */}
          <ChevronDown className="w-3.5 h-3.5 text-white/50 -mt-0.5" />
        </div>
      </div>
    </div>
  );
};
