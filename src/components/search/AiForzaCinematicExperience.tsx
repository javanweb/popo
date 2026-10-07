import React from 'react';
import { ChevronDown, X } from 'lucide-react';
import { STORE_ASSETS } from '../../assets/images';

interface AiForzaCinematicExperienceProps {
  onClose?: () => void;
  isStandalonePage?: boolean;
}

export const AiForzaCinematicExperience: React.FC<AiForzaCinematicExperienceProps> = ({
  onClose,
  isStandalonePage = false,
}) => {
  return (
    <div
      className="relative w-screen h-screen min-h-[100svh] max-h-[100dvh] bg-[#0A0D12] text-white overflow-hidden select-none"
      dir="ltr"
    >
      {/* ===================================================================== */}
      {/* 1. LAYER: INDUSTRIAL REFINERY ATMOSPHERE (DESKTOP & MOBILE DEPTH)     */}
      {/* ===================================================================== */}
      {/* Ambient gradient base - dark blue twilight to deep carbon */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#080d16] via-[#090e18] to-[#040609] pointer-events-none" />

      {/* Atmospheric Haze & Sunset Glow */}
      <div
        className="absolute inset-0 pointer-events-none animate-ai-atmosphere"
        style={{
          background:
            'radial-gradient(ellipse 90% 60% at 50% 30%, rgba(224, 101, 24, 0.16) 0%, rgba(13, 22, 38, 0.45) 55%, transparent 100%)',
        }}
      />

      {/* Industrial Refinery Background Lighting Flicker */}
      <div
        className="absolute inset-0 pointer-events-none animate-ai-refinery-lights"
        style={{
          background:
            'radial-gradient(circle at 82% 38%, rgba(255, 140, 0, 0.12) 0%, transparent 45%), radial-gradient(circle at 18% 42%, rgba(255, 120, 0, 0.1) 0%, transparent 40%)',
        }}
      />

      {/* Distant refinery beacon lights (industrial safety strobes) */}
      <div className="absolute top-[28%] right-[14%] w-1.5 h-1.5 rounded-full bg-[#E06518] shadow-[0_0_8px_#E06518] animate-ai-beacon pointer-events-none hidden md:block" />
      <div className="absolute top-[22%] right-[19%] w-1.5 h-1.5 rounded-full bg-[#FFA500] shadow-[0_0_10px_#FFA500] animate-ai-beacon pointer-events-none hidden md:block [animation-delay:1.8s]" />
      <div className="absolute top-[32%] left-[16%] w-1 h-1 rounded-full bg-[#E06518] shadow-[0_0_6px_#E06518] animate-ai-beacon pointer-events-none hidden md:block [animation-delay:2.5s]" />

      {/* ===================================================================== */}
      {/* 2. DESKTOP ART DIRECTION (>= 768px)                                   */}
      {/* Wide cinematic 16:9 composition, AI occupies 70-85% viewport height    */}
      {/* ===================================================================== */}
      <div className="hidden md:flex absolute inset-0 items-center justify-center pointer-events-none overflow-hidden">
        {/* Wide Refinery Horizon & Floor Depth */}
        <div className="absolute inset-0 z-0">
          <img
            src={STORE_ASSETS.aiForzaDesktopCinematic}
            alt="AI FORZA Industrial Cinematic Environment"
            className="w-full h-full object-cover object-center filter brightness-[0.98] contrast-[1.04]"
          />
          {/* Subtle cinematic vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#040609] via-transparent to-[#050810]/70" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#040609]/80 via-transparent to-[#040609]/80" />
        </div>

        {/* Desktop Synchronized Overlay Animation Engine */}
        <div className="relative z-10 w-full h-full max-w-[1440px] flex items-center justify-center">
          {/* Head Internal Breathing Radiance */}
          <div
            className="absolute top-[18%] left-[50%] -translate-x-1/2 w-48 h-56 rounded-full pointer-events-none animate-ai-head-glow"
            style={{
              background:
                'radial-gradient(ellipse at 50% 45%, rgba(224, 101, 24, 0.42) 0%, rgba(255, 130, 0, 0.15) 50%, transparent 80%)',
              filter: 'blur(16px)',
            }}
          />

          {/* Vertical Face Seam Light conduit */}
          <div
            className="absolute top-[21%] left-[50%] -translate-x-1/2 w-[2px] h-20 pointer-events-none animate-ai-face-seam"
            style={{
              background:
                'linear-gradient(to bottom, transparent, #FFFFFF 20%, #FFA500 50%, #E06518 80%, transparent)',
            }}
          />

          {/* Autonomous Energy Conduits (SVG Layer - Neck, Clavicles, Shoulders, Chest) */}
          <svg
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-full pointer-events-none z-10"
            viewBox="0 0 900 1000"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="energyGradDesktop" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
                <stop offset="40%" stopColor="#FFA500" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#E06518" stopOpacity="0.1" />
              </linearGradient>
              <filter id="glowFilterDesktop" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Sternum / Spine Core Conduit */}
            <path
              d="M450 320 L450 480 M450 560 L450 820"
              stroke="url(#energyGradDesktop)"
              strokeWidth="2.5"
              strokeDasharray="16 8"
              className="animate-ai-conduit-slow"
              filter="url(#glowFilterDesktop)"
              opacity="0.85"
            />

            {/* Left & Right Clavicle to Shoulders */}
            <path
              d="M450 380 Q390 410 320 440 T220 540"
              stroke="#FFA500"
              strokeWidth="2"
              strokeDasharray="20 12"
              className="animate-ai-conduit-slow"
              filter="url(#glowFilterDesktop)"
              opacity="0.75"
            />
            <path
              d="M450 380 Q510 410 580 440 T680 540"
              stroke="#FFA500"
              strokeWidth="2"
              strokeDasharray="20 12"
              className="animate-ai-conduit-slow"
              filter="url(#glowFilterDesktop)"
              opacity="0.75"
            />

            {/* Pectoral Radiating Paths */}
            <path
              d="M450 510 Q370 510 310 570 T240 680"
              stroke="#E06518"
              strokeWidth="1.75"
              strokeDasharray="18 10"
              className="animate-ai-conduit-reverse"
              filter="url(#glowFilterDesktop)"
              opacity="0.65"
            />
            <path
              d="M450 510 Q530 510 590 570 T660 680"
              stroke="#E06518"
              strokeWidth="1.75"
              strokeDasharray="18 10"
              className="animate-ai-conduit-reverse"
              filter="url(#glowFilterDesktop)"
              opacity="0.65"
            />

            {/* Torso Abdominal Rib Pathways */}
            <path
              d="M450 620 Q390 640 340 700 M450 670 Q395 690 350 750"
              stroke="#E06518"
              strokeWidth="1.5"
              strokeDasharray="12 8"
              className="animate-ai-conduit-slow"
              opacity="0.55"
            />
            <path
              d="M450 620 Q510 640 560 700 M450 670 Q505 690 550 750"
              stroke="#E06518"
              strokeWidth="1.5"
              strokeDasharray="12 8"
              className="animate-ai-conduit-slow"
              opacity="0.55"
            />
          </svg>

          {/* Body Energy Pulses from Center Core */}
          <div
            className="absolute top-[52%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[520px] h-[340px] pointer-events-none animate-ai-organic-pulse"
            style={{
              background:
                'radial-gradient(ellipse at 50% 50%, rgba(224, 101, 24, 0.22) 0%, rgba(224, 101, 24, 0.08) 45%, transparent 75%)',
              filter: 'blur(24px)',
            }}
          />

          {/* Central AI FORZA Embedded Chest Reactor */}
          <div className="absolute top-[51.8%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-44 h-44 pointer-events-none z-20 flex items-center justify-center">
            {/* Concentric Breathing Pulse Rings */}
            <div className="absolute w-full h-full rounded-full border border-[#E06518]/60 animate-ai-pulse-ring-1" />
            <div className="absolute w-full h-full rounded-full border border-[#FFA500]/40 animate-ai-pulse-ring-2" />

            {/* Reactor Outer Glow Aura */}
            <div
              className="absolute inset-[-14px] rounded-full animate-ai-core-breathe pointer-events-none"
              style={{
                background:
                  'radial-gradient(circle, rgba(224, 101, 24, 0.55) 0%, rgba(224, 101, 24, 0.18) 50%, transparent 75%)',
                filter: 'blur(10px)',
              }}
            />

            {/* Embedded Metallic Interface Housing (#55565A + Gunmetal Glass) */}
            <div
              className="relative w-36 h-36 rounded-full p-[3px] shadow-[0_12px_36px_rgba(0,0,0,0.9),inset_0_2px_4px_rgba(255,255,255,0.25)] animate-ai-core-breathe"
              style={{
                background:
                  'linear-gradient(145deg, #777A7D 0%, #55565A 45%, #2B313A 100%)',
              }}
            >
              {/* Inner Chamfer Bevel Ring */}
              <div className="w-full h-full rounded-full p-[2px] bg-gradient-to-tr from-[#1E232B] via-[#0D1117] to-[#2B313A] flex items-center justify-center overflow-hidden relative shadow-inner">
                {/* Micro Wireframe Shimmer Texture */}
                <div
                  className="absolute inset-0 opacity-15 pointer-events-none"
                  style={{
                    backgroundImage:
                      'radial-gradient(#E06518 1px, transparent 1px), radial-gradient(#55565A 1px, transparent 1px)',
                    backgroundSize: '8px 8px',
                    backgroundPosition: '0 0, 4px 4px',
                  }}
                />

                {/* Glass Specular Reflection Arc */}
                <div
                  className="absolute -top-6 -left-6 w-32 h-20 rounded-full opacity-20 pointer-events-none"
                  style={{
                    background:
                      'linear-gradient(180deg, rgba(255,255,255,0.7) 0%, transparent 100%)',
                    transform: 'rotate(-25deg)',
                  }}
                />

                {/* Core Inner Disc with Glowing AI FORZA Emblem */}
                <div className="relative z-10 flex flex-col items-center justify-center text-center">
                  <div className="flex items-center justify-center font-black tracking-tighter">
                    <span
                      className="text-2xl font-black tracking-normal text-[#E06518] drop-shadow-[0_0_12px_rgba(224,101,24,0.95)]"
                      style={{ fontFamily: 'system-ui, sans-serif' }}
                    >
                      AI
                    </span>
                  </div>
                  <span
                    className="text-[11px] font-bold tracking-[0.24em] text-white/95 mt-0.5 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]"
                    style={{ fontFamily: 'system-ui, sans-serif' }}
                  >
                    FORZA
                  </span>
                  <div className="w-8 h-[1.5px] bg-gradient-to-r from-transparent via-[#E06518] to-transparent mt-1 opacity-80" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 3. MOBILE ART DIRECTION (< 768px)                                     */}
      {/* Dedicated vertical portrait composition, fills entire screen (100dvh) */}
      {/* ===================================================================== */}
      <div className="md:hidden absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        {/* Full-bleed portrait image filling 100vw and 100dvh without borders */}
        <div className="relative w-full h-full flex items-center justify-center">
          <img
            src={STORE_ASSETS.aiForzaCyborg}
            alt="AI FORZA Industrial AI Face-to-Face"
            className="w-full h-full object-cover object-center filter brightness-[0.98] contrast-[1.05]"
          />

          {/* Subtle Mobile Atmosphere & Depth Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#040609] via-transparent to-[#050810]/60 pointer-events-none" />

          {/* Mobile Head Glow */}
          <div
            className="absolute top-[23%] left-[50%] -translate-x-1/2 w-32 h-40 rounded-full pointer-events-none animate-ai-head-glow"
            style={{
              background:
                'radial-gradient(circle, rgba(224, 101, 24, 0.45) 0%, rgba(255, 120, 0, 0.15) 50%, transparent 80%)',
              filter: 'blur(12px)',
            }}
          />

          {/* Mobile Face Seam */}
          <div
            className="absolute top-[24.5%] left-[50%] -translate-x-1/2 w-[2px] h-16 pointer-events-none animate-ai-face-seam"
            style={{
              background:
                'linear-gradient(to bottom, transparent, #FFFFFF 20%, #FFA500 50%, #E06518 80%, transparent)',
            }}
          />

          {/* Mobile SVG Energy Pathways (Shoulders & Torso) */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-10"
            viewBox="0 0 400 800"
            fill="none"
            preserveAspectRatio="xMidYMid slice"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="energyGradMobile" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
                <stop offset="45%" stopColor="#FFA500" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#E06518" stopOpacity="0.1" />
              </linearGradient>
            </defs>

            {/* Central Vertical Spine */}
            <path
              d="M200 290 L200 420 M200 470 L200 680"
              stroke="url(#energyGradMobile)"
              strokeWidth="2"
              strokeDasharray="14 8"
              className="animate-ai-conduit-slow"
              opacity="0.85"
            />

            {/* Shoulders Left & Right */}
            <path
              d="M200 340 Q150 360 90 400 T20 480"
              stroke="#FFA500"
              strokeWidth="1.8"
              strokeDasharray="16 10"
              className="animate-ai-conduit-slow"
              opacity="0.75"
            />
            <path
              d="M200 340 Q250 360 310 400 T380 480"
              stroke="#FFA500"
              strokeWidth="1.8"
              strokeDasharray="16 10"
              className="animate-ai-conduit-slow"
              opacity="0.75"
            />

            {/* Pectorals */}
            <path
              d="M200 440 Q140 440 90 500"
              stroke="#E06518"
              strokeWidth="1.5"
              strokeDasharray="12 8"
              className="animate-ai-conduit-reverse"
              opacity="0.65"
            />
            <path
              d="M200 440 Q260 440 310 500"
              stroke="#E06518"
              strokeWidth="1.5"
              strokeDasharray="12 8"
              className="animate-ai-conduit-reverse"
              opacity="0.65"
            />
          </svg>

          {/* Mobile Chest Core Concentric Rings & Glow */}
          <div className="absolute top-[44.5%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-28 h-28 pointer-events-none z-20 flex items-center justify-center">
            {/* Breathing Ring */}
            <div className="absolute w-full h-full rounded-full border border-[#E06518]/60 animate-ai-pulse-ring-1" />
            <div className="absolute w-full h-full rounded-full border border-[#FFA500]/40 animate-ai-pulse-ring-2" />

            {/* Reactor Bloom */}
            <div
              className="absolute inset-[-8px] rounded-full animate-ai-core-breathe pointer-events-none"
              style={{
                background:
                  'radial-gradient(circle, rgba(224, 101, 24, 0.55) 0%, rgba(224, 101, 24, 0.15) 55%, transparent 75%)',
                filter: 'blur(8px)',
              }}
            />

            {/* Core Badge Housing */}
            <div
              className="relative w-24 h-24 rounded-full p-[2.5px] shadow-[0_8px_24px_rgba(0,0,0,0.9),inset_0_2px_4px_rgba(255,255,255,0.25)] animate-ai-core-breathe"
              style={{
                background:
                  'linear-gradient(145deg, #777A7D 0%, #55565A 45%, #2B313A 100%)',
              }}
            >
              <div className="w-full h-full rounded-full p-[1.5px] bg-gradient-to-tr from-[#1E232B] via-[#0D1117] to-[#2B313A] flex items-center justify-center overflow-hidden relative">
                {/* Specular glare */}
                <div
                  className="absolute -top-4 -left-4 w-20 h-12 rounded-full opacity-20 pointer-events-none"
                  style={{
                    background:
                      'linear-gradient(180deg, rgba(255,255,255,0.7) 0%, transparent 100%)',
                    transform: 'rotate(-25deg)',
                  }}
                />
                <div className="relative z-10 flex flex-col items-center justify-center text-center">
                  <span
                    className="text-lg font-black tracking-normal text-[#E06518] drop-shadow-[0_0_10px_rgba(224,101,24,0.95)]"
                    style={{ fontFamily: 'system-ui, sans-serif' }}
                  >
                    AI
                  </span>
                  <span
                    className="text-[9px] font-bold tracking-[0.2em] text-white/95 mt-0.5"
                    style={{ fontFamily: 'system-ui, sans-serif' }}
                  >
                    FORZA
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 4. SUBTLE FUTURISTIC AMBIENT HUD & IDENTITY (NON-INTRUSIVE)          */}
      {/* Visual hierarchy: AI is Hero; HUD is quiet, high-tech, and refined  */}
      {/* ===================================================================== */}

      {/* Top Left: Minimal Floating AI FORZA Identity */}
      <div className="absolute top-5 sm:top-7 left-5 sm:left-8 z-30 flex items-center gap-3 pointer-events-none">
        {/* Subtle orange accent telemetry bar */}
        <div className="w-[3px] h-7 bg-gradient-to-b from-[#E06518] to-transparent rounded-full shadow-[0_0_8px_#E06518]" />
        <div>
          <div className="flex items-center gap-2">
            <span
              className="text-sm sm:text-base font-extrabold tracking-wider text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
              style={{ fontFamily: 'system-ui, sans-serif' }}
            >
              AI FORZA
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#E06518] animate-ping" />
          </div>
          <p
            className="text-[10px] font-medium tracking-[0.22em] text-[#777A7D] uppercase drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]"
            style={{ fontFamily: 'system-ui, sans-serif' }}
          >
            Industrial Neural Core
          </p>
        </div>
      </div>

      {/* Top Left Vertical Telemetry Rail (Directly matching the Reference Image) */}
      <div className="absolute top-20 sm:top-24 left-5 sm:left-8 z-20 flex flex-col items-center gap-2 pointer-events-none opacity-80">
        <div className="w-[2px] h-12 bg-gradient-to-b from-[#E06518] to-transparent rounded-full" />
        <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_4px_#FFF]" />
        <span className="w-1.5 h-1.5 rounded-full bg-white/70" />
        <span className="w-1.5 h-1.5 rounded-full bg-[#E06518] shadow-[0_0_6px_#E06518]" />
        <span className="w-1.5 h-1.5 rounded-full bg-white/50" />
        <div className="w-[2px] h-8 bg-gradient-to-b from-white/30 to-transparent rounded-full" />
      </div>

      {/* Top Right: Discreet, Quiet Exit / Back affordance */}
      {onClose && (
        <div className="absolute top-5 sm:top-7 right-5 sm:right-8 z-40">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close cinematic experience"
            title="بازگشت"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-black/40 hover:bg-[#55565A]/40 border border-[#55565A]/40 hover:border-[#E06518]/60 text-white/70 hover:text-white flex items-center justify-center backdrop-blur-md transition-all cursor-pointer shadow-lg active:scale-95"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Standalone navigation link to Store if on full page */}
      {isStandalonePage && (
        <div className="absolute top-5 sm:top-7 right-5 sm:right-8 z-40">
          <a
            href="/"
            aria-label="Return to Store"
            title="بازگشت به فروشگاه"
            className="px-3.5 py-1.5 rounded-xl bg-black/40 hover:bg-[#55565A]/40 border border-[#55565A]/40 hover:border-[#E06518]/60 text-white/80 hover:text-white text-xs font-medium flex items-center gap-1.5 backdrop-blur-md transition-all shadow-lg"
          >
            <span className="text-[11px]">فروشگاه</span>
            <X className="w-3.5 h-3.5" />
          </a>
        </div>
      )}

      {/* Bottom Corner Chamfers (Directly matching reference image geometry) */}
      {/* Bottom Left Chamfer Accent */}
      <div className="absolute bottom-0 left-0 w-32 sm:w-48 h-32 sm:h-48 pointer-events-none z-20">
        <svg
          viewBox="0 0 160 160"
          className="w-full h-full filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer Orange Accent Line */}
          <path
            d="M0 80 L80 160"
            stroke="#E06518"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {/* Inner Graphite Chamfer Plate */}
          <path
            d="M0 110 L110 160 L0 160 Z"
            fill="#1E232B"
            fillOpacity="0.85"
            stroke="#55565A"
            strokeWidth="1.5"
          />
          <path
            d="M10 125 L125 160"
            stroke="#55565A"
            strokeWidth="1"
            opacity="0.6"
          />
        </svg>
      </div>

      {/* Bottom Right Chamfer Accent */}
      <div className="absolute bottom-0 right-0 w-32 sm:w-48 h-32 sm:h-48 pointer-events-none z-20">
        <svg
          viewBox="0 0 160 160"
          className="w-full h-full filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer Orange Accent Line */}
          <path
            d="M160 80 L80 160"
            stroke="#E06518"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {/* Inner Graphite Chamfer Plate */}
          <path
            d="M160 110 L50 160 L160 160 Z"
            fill="#1E232B"
            fillOpacity="0.85"
            stroke="#55565A"
            strokeWidth="1.5"
          />
          <path
            d="M150 125 L35 160"
            stroke="#55565A"
            strokeWidth="1"
            opacity="0.6"
          />
        </svg>
      </div>

      {/* ===================================================================== */}
      {/* 5. BOTTOM AREA: MINIMAL FUTURISTIC SCROLL INDICATOR                    */}
      {/* Thin capsule, tiny glowing orange/white detail, small downward chevron*/}
      {/* Absolutely NO large buttons, NO text instructions, NO chatbot clutter */}
      {/* ===================================================================== */}
      <div className="absolute bottom-5 sm:bottom-7 inset-x-0 z-30 flex flex-col items-center justify-center pointer-events-none">
        <div className="flex flex-col items-center gap-1.5 animate-ai-scroll-float">
          {/* Thin Capsule with tiny glowing detail */}
          <div className="w-5 h-9 rounded-full border border-[#55565A]/80 bg-black/40 backdrop-blur-sm flex items-start justify-center p-1 shadow-[0_0_12px_rgba(0,0,0,0.8)]">
            <span className="w-1.5 h-2.5 rounded-full bg-gradient-to-b from-white to-[#E06518] shadow-[0_0_6px_#E06518]" />
          </div>
          {/* Subtle downward indicator chevron */}
          <ChevronDown className="w-4 h-4 text-[#E06518]/80 drop-shadow-[0_0_4px_#E06518]" />
        </div>
      </div>
    </div>
  );
};
