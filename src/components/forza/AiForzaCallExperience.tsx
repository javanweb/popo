import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Maximize,
  EyeOff,
  Eye,
  SlidersHorizontal,
  PhoneOff,
  Volume2,
} from 'lucide-react';
import { ParticleAvatar, ParticleAvatarRef } from './ParticleAvatar';
import './style.css';

interface AiForzaCallExperienceProps {
  onClose?: () => void;
}

type ForzaStatus = 'idle' | 'listening' | 'thinking' | 'speaking';

const GREETING_TEXT = 'من هوش مصنوعی فورزا، مشاور فنی هایپر صنعت هستم. بفرمایید، در خدمت شما هستم.';

interface Turn {
  role: 'user' | 'model';
  text: string;
}

export const AiForzaCallExperience: React.FC<AiForzaCallExperienceProps> = ({ onClose }) => {
  // Visual scene & particle states
  const avatarRef = useRef<ParticleAvatarRef | null>(null);
  const shell = useRef<HTMLDivElement | null>(null);

  const [paused, setPaused] = useState(false);
  const [revision, setRevision] = useState(0);
  const [speed, setSpeed] = useState<number>(2);
  const [clean, setClean] = useState(false);
  const [quality, setQuality] = useState('high');
  const [stats, setStats] = useState<{ fps: number | null; tier: string; renderMs: number; particles?: number }>({
    fps: null,
    tier: 'ULTRA',
    renderMs: 0,
    particles: 0,
  });
  const [errorNotice, setErrorNotice] = useState<string | null>(null);
  const [fullscreenError, setFullscreenError] = useState('');
  const [reducedMotion, setReducedMotion] = useState(false);

  // Conversational AI state
  const [isCallActive, setIsCallActive] = useState(true);
  const [status, setStatusState] = useState<ForzaStatus>('idle');
  const [turn, setTurn] = useState<'user' | 'ai' | 'idle'>('ai');
  const [aiText, setAiText] = useState(GREETING_TEXT);
  const [displayedAi, setDisplayedAi] = useState('');
  const [userText, setUserText] = useState('');
  const [seconds, setSeconds] = useState(0);

  const statusRef = useRef<ForzaStatus>('idle');
  const historyRef = useRef<Turn[]>([]);
  const isAiSpeakingRef = useRef<boolean>(false);
  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<number | null>(null);
  const activeTranscriptRef = useRef<string>('');

  const audioElRef = useRef<HTMLAudioElement | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const setStatus = useCallback((s: ForzaStatus) => {
    statusRef.current = s;
    setStatusState(s);
  }, []);

  // Compute reactive mode for Three.js ParticleAvatar
  const avatarMode = status === 'speaking' ? 'speak' : status === 'listening' ? 'listen' : 'auto';
  const avatarIntensity = status === 'speaking' ? 1.45 : status === 'thinking' ? 0.6 : 1.0;

  // Reduced motion preference
  useEffect(() => {
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(motion.matches);
    update();
    motion.addEventListener('change', update);
    return () => motion.removeEventListener('change', update);
  }, []);

  // Keyboard shortcuts matching provided template
  useEffect(() => {
    function keyboard(e: KeyboardEvent) {
      if (/INPUT|SELECT|TEXTAREA|BUTTON/.test((e.target as HTMLElement).tagName)) return;
      if (e.code === 'Space') {
        e.preventDefault();
        setPaused(p => !p);
      }
      if (e.key.toLowerCase() === 'h') setClean(c => !c);
      if (e.key.toLowerCase() === 'r') {
        setRevision(r => r + 1);
        avatarRef.current?.replay();
        setPaused(false);
      }
      if (e.key.toLowerCase() === 's') {
        setSpeed(s => (s === 1 ? 2 : s === 2 ? 3.5 : 1));
      }
    }
    document.addEventListener('keydown', keyboard);
    return () => document.removeEventListener('keydown', keyboard);
  }, []);

  // Fullscreen toggle
  async function fullscreen() {
    try {
      setFullscreenError('');
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else if (shell.current?.requestFullscreen) {
        await shell.current.requestFullscreen();
      } else {
        setFullscreenError('حالت تمام‌صفحه در این مرورگر پشتیبانی نمی‌شود.');
      }
    } catch {
      setFullscreenError('امکان ورود به حالت تمام‌صفحه وجود ندارد.');
    }
  }

  // Typewriter effect for AI subtitle
  useEffect(() => {
    if (!aiText) {
      setDisplayedAi('');
      return;
    }
    let i = 0;
    setDisplayedAi('');
    const id = window.setInterval(() => {
      i += 3;
      setDisplayedAi(aiText.slice(0, i));
      if (i >= aiText.length) window.clearInterval(id);
    }, 18);
    return () => window.clearInterval(id);
  }, [aiText]);

  // Call duration timer
  useEffect(() => {
    if (!isCallActive) return;
    const id = window.setInterval(() => setSeconds(s => s + 1), 1000);
    return () => window.clearInterval(id);
  }, [isCallActive]);

  const ensureCtx = useCallback(() => {
    if (!ctxRef.current) {
      const AC = window.AudioContext || (window as any).webkitAudioContext;
      ctxRef.current = new AC();
    }
    if (ctxRef.current.state === 'suspended') void ctxRef.current.resume();
    return ctxRef.current;
  }, []);

  const stopAudio = useCallback(() => {
    isAiSpeakingRef.current = false;
    try {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    } catch {
      /* noop */
    }
    const a = audioElRef.current;
    if (a) {
      a.pause();
      a.removeAttribute('src');
      a.load();
    }
  }, []);

  const playDataUrl = useCallback(
    (url: string) =>
      new Promise<void>((resolve, reject) => {
        const a = audioElRef.current;
        if (!a) {
          reject(new Error('no-audio'));
          return;
        }
        ensureCtx();
        const onEnded = () => {
          a.removeEventListener('ended', onEnded);
          a.removeEventListener('error', onError);
          resolve();
        };
        const onError = () => {
          a.removeEventListener('ended', onEnded);
          a.removeEventListener('error', onError);
          reject(new Error('play-error'));
        };
        a.addEventListener('ended', onEnded);
        a.addEventListener('error', onError);
        a.src = url;
        void a.play().catch(reject);
      }),
    [ensureCtx]
  );

  const speakBrowserFallback = useCallback(
    (text: string) =>
      new Promise<void>(resolve => {
        try {
          if (!('speechSynthesis' in window)) return resolve();
          const u = new SpeechSynthesisUtterance(text);
          u.lang = 'fa-IR';
          u.rate = 0.95;
          isAiSpeakingRef.current = true;
          u.onend = () => {
            isAiSpeakingRef.current = false;
            resolve();
          };
          u.onerror = () => {
            isAiSpeakingRef.current = false;
            resolve();
          };
          window.speechSynthesis.cancel();
          window.speechSynthesis.speak(u);
        } catch {
          isAiSpeakingRef.current = false;
          resolve();
        }
      }),
    []
  );

  const speakText = useCallback(
    async (text: string) => {
      isAiSpeakingRef.current = true;
      setStatus('speaking');
      setTurn('ai');
      try {
        const res = await fetch('/api/ai/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text }),
        });
        const data = await res.json().catch(() => null);
        if (data?.audioBase64) {
          await playDataUrl(data.audioBase64);
          return;
        }
        throw new Error('no-audio');
      } catch {
        await speakBrowserFallback(text);
      } finally {
        isAiSpeakingRef.current = false;
      }
    },
    [playDataUrl, setStatus, speakBrowserFallback]
  );

  // Turn management: send query to AI
  const handleUserFinishedSpeaking = useCallback(
    async (textToSend: string) => {
      const q = textToSend.trim();
      if (!q || isAiSpeakingRef.current || statusRef.current === 'thinking') return;

      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          /* noop */
        }
      }

      setStatus('thinking');
      setTurn('ai');
      activeTranscriptRef.current = '';

      try {
        const res = await fetch('/api/ai/forza-live', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: q,
            history: historyRef.current.slice(-8),
          }),
        });
        const data = await res.json().catch(() => null);
        if (!res.ok || !data?.success) throw new Error(data?.error || 'server-error');

        const reply = data.text || '';
        if (reply) {
          historyRef.current.push({ role: 'user', text: q });
          historyRef.current.push({ role: 'model', text: reply });
          setAiText(reply);

          if (data.audioBase64) {
            setStatus('speaking');
            setTurn('ai');
            try {
              await playDataUrl(data.audioBase64);
            } catch {
              await speakText(reply);
            }
          } else {
            await speakText(reply);
          }
        }
      } catch {
        setErrorNotice('خطا در پاسخ هوش مصنوعی فورزا؛ لطفاً مجدداً بفرمایید.');
      } finally {
        setStatus('listening');
        setTurn('user');
        if (recognitionRef.current) {
          try {
            recognitionRef.current.start();
          } catch {
            /* already listening */
          }
        }
      }
    },
    [playDataUrl, setStatus, speakText]
  );

  const initSpeechRecognition = useCallback(() => {
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) return null;

    try {
      const rec = new SpeechRec();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'fa-IR';

      rec.onresult = (event: any) => {
        if (isAiSpeakingRef.current || statusRef.current === 'thinking') return;

        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const trans = event.results[i][0]?.transcript || '';
          if (event.results[i].isFinal) {
            final += trans;
          } else {
            interim += trans;
          }
        }

        const currentSpeech = (final || interim || '').trim();
        if (currentSpeech) {
          activeTranscriptRef.current = currentSpeech;
          setUserText(currentSpeech);
          setStatus('listening');
          setTurn('user');

          if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
          silenceTimerRef.current = window.setTimeout(() => {
            if (activeTranscriptRef.current && !isAiSpeakingRef.current) {
              const textToSend = activeTranscriptRef.current;
              activeTranscriptRef.current = '';
              void handleUserFinishedSpeaking(textToSend);
            }
          }, 1250);
        }
      };

      rec.onerror = () => {};
      rec.onend = () => {
        if (statusRef.current !== 'thinking' && !isAiSpeakingRef.current && isCallActive) {
          try {
            rec.start();
          } catch {
            /* already running */
          }
        }
      };

      return rec;
    } catch {
      return null;
    }
  }, [handleUserFinishedSpeaking, isCallActive, setStatus]);

  // Initial startup: greeting & mic setup (non-blocking for instant 0ms entry)
  useEffect(() => {
    let mounted = true;

    // Immediately set greeting and status
    setStatus('speaking');
    setTurn('ai');
    historyRef.current.push({ role: 'model', text: GREETING_TEXT });

    // Non-blocking greeting speech & mic init
    const timer = setTimeout(() => {
      if (!mounted) return;
      void speakText(GREETING_TEXT).then(() => {
        if (!mounted) return;
        setStatus('listening');
        setTurn('user');
        if (recognitionRef.current) {
          try {
            recognitionRef.current.start();
          } catch {
            /* noop */
          }
        }
      });

      try {
        if (navigator?.mediaDevices?.getUserMedia) {
          navigator.mediaDevices
            .getUserMedia({ audio: true })
            .then(stream => {
              if (mounted) {
                streamRef.current = stream;
                recognitionRef.current = initSpeechRecognition();
              }
            })
            .catch(() => {
              if (mounted) {
                recognitionRef.current = initSpeechRecognition();
              }
            });
        } else {
          recognitionRef.current = initSpeechRecognition();
        }
      } catch {
        recognitionRef.current = initSpeechRecognition();
      }
    }, 40);

    return () => {
      mounted = false;
      clearTimeout(timer);
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          /* noop */
        }
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
      stopAudio();
    };
  }, [ensureCtx, initSpeechRecognition, setStatus, speakText, stopAudio]);

  const endCall = useCallback(() => {
    stopAudio();
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        /* noop */
      }
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
    }
    setIsCallActive(false);
    if (onClose) onClose();
  }, [onClose, stopAudio]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
      .toString()
      .padStart(2, '0');
    const r = (s % 60).toString().padStart(2, '0');
    return `${m}:${r}`;
  };

  return (
    <main
      ref={shell}
      className="forza-stage"
      dir="ltr"
      onDoubleClick={e => {
        if ((e.target as HTMLElement).tagName === 'CANVAS') setClean(c => !c);
      }}
    >
      {/* 1. Procedural 3D WebGL Particle Avatar (Three.js GPU particles) */}
      <ParticleAvatar
        ref={avatarRef}
        paused={paused}
        mode={avatarMode}
        intensity={avatarIntensity}
        quality={quality}
        backgroundSpeed={speed}
        restartKey={revision}
        onStats={setStats}
        onError={err => setErrorNotice(err)}
      />

      {/* Hidden audio element for TTS streaming */}
      <audio ref={audioElRef} className="hidden" playsInline />

      {/* 2. HUD Cybernetic Overlay (toggleable with H or signal button) */}
      {!clean && (
        <div className="forza-hud" aria-hidden="true">
          <i className="hud-corner tl" />
          <i className="hud-corner tr" />
          <i className="hud-corner bl" />
          <i className="hud-corner br" />

          {/* Top-Right FORZA Lockup & Audio Spectrum */}
          <div className="hud-block hud-top-right">
            <div className="flex items-center gap-3 justify-end">
              <div>
                <div className="hud-title text-white tracking-widest text-lg font-black">FORZA</div>
                <div className="hud-dim text-[10px] tracking-wider text-[#dee2e5]/80">HUMAN SYSTEMS / 001</div>
              </div>
              <div className="bars text-[#e06518] h-4">
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>
            </div>
          </div>

          {/* Top-Left Telemetry Status */}
          <div className="hud-block hud-top-left">
            <div className="flex items-center gap-2">
              <span className={`hud-dot ${status === 'speaking' ? 'amber' : ''}`} />
              <b className="text-white text-xs">
                {paused || reducedMotion
                  ? 'PAUSED'
                  : status === 'speaking'
                  ? 'SPEAKING'
                  : status === 'thinking'
                  ? 'THINKING'
                  : 'LIVE'}
              </b>
            </div>
            <div className="hud-dim text-[10px] tabular-nums text-[#dee2e5]/70">
              {stats.tier} · {stats.fps ? `${stats.fps} FPS` : '60 FPS'} · {formatTime(seconds)}
            </div>
          </div>

          {/* Bottom-Left Metric: Sync % & Realtime particles */}
          <div className="hud-block hud-bottom-left hidden sm:grid">
            <div className="text-[11px] text-[#dee2e5]">
              SYNC <b className="text-white">99.4%</b>
            </div>
            <div className="meter">
              <span />
            </div>
            <div className="hud-dim text-[10px] text-[#dee2e5]/60">PARTICLE MESH · REALTIME GPU</div>
          </div>

          {/* Bottom-Right Coordinates / Frequency Bars */}
          <div className="hud-block hud-bottom-right hidden sm:grid">
            <div className="hud-dim text-[10px] text-[#dee2e5]/70">LAT 31.8974 · LON 54.3569</div>
            <div className="bars">
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>

          {/* Subtle light scan line */}
          <div className="scan" />
        </div>
      )}

      {/* Top Header Exit Call Button */}
      <button
        type="button"
        onClick={endCall}
        className="absolute top-4 left-4 z-40 flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-red-950/80 hover:bg-red-900 border border-red-500/50 hover:border-red-400 text-red-100 hover:text-white shadow-xl shadow-black/60 backdrop-blur-md transition-all active:scale-95 group cursor-pointer"
        aria-label="پایان مکالمه و خروج"
        title="پایان مکالمه هوشمند FORZA"
        dir="rtl"
      >
        <div className="w-5 h-5 rounded-lg bg-red-600/50 border border-red-400/50 flex items-center justify-center text-white group-hover:bg-red-600 transition-colors">
          <PhoneOff size={12} className="text-white" />
        </div>
        <span className="font-bold text-xs">خروج</span>
      </button>

      {/* Top Center Signal / HUD Toggle */}
      <button
        className="signal-toggle"
        onClick={() => setClean(c => !c)}
        aria-label={clean ? 'نمایش HUD' : 'مخفی‌سازی HUD'}
        title="تغییر نمایش HUD و جزئیات (کلید H)"
      >
        <span />
        <span />
        <span />
        <span />
      </button>

      {/* Left Procedural Identity Typography */}
      {!clean && (
        <div className="procedural-label" aria-hidden="true">
          <span className="text-[#dee2e5]/80">PROCEDURAL IDENTITY</span>
          <strong className="text-white">Built from .light</strong>
        </div>
      )}

      {/* 3. Persian Voice Subtitles & Interaction Pill - Positioned cleanly below AI avatar */}
      <div
        dir="rtl"
        className="absolute bottom-10 sm:bottom-14 inset-x-3.5 sm:inset-x-auto sm:right-10 sm:left-auto sm:max-w-lg z-20 flex flex-col gap-2 pointer-events-none"
      >
        {/* Turn Status Pill */}
        <div className="self-start inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0a0d14]/90 border border-[#dee2e5]/30 backdrop-blur-md shadow-lg text-xs pointer-events-auto transition-all">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              turn === 'user'
                ? 'bg-[#dee2e5] shadow-[0_0_10px_#dee2e5] animate-pulse'
                : status === 'thinking'
                ? 'bg-[#e06518] shadow-[0_0_10px_#e06518] animate-pulse'
                : 'bg-[#e06518] shadow-[0_0_10px_#e06518]'
            }`}
          />
          <span className="font-semibold text-white text-[11px] sm:text-[12px]">
            {turn === 'user'
              ? 'نوبت شماست (مستقیم صحبت کنید)'
              : status === 'thinking'
              ? 'AI FORZA در حال پردازش...'
              : 'AI FORZA در حال صحبت...'}
          </span>
        </div>

        {/* User live speech transcript */}
        {userText && (
          <div className="text-xs sm:text-sm bg-black/85 border border-[#dee2e5]/40 text-[#dee2e5] px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl backdrop-blur-md shadow-md animate-fadeInCard pointer-events-auto leading-relaxed">
            <span className="text-white font-bold ml-2">شما:</span>
            <span>{userText}</span>
          </div>
        )}

        {/* AI voice response subtitle box */}
        {displayedAi && (
          <div className="text-xs sm:text-sm bg-[#0a0d14]/95 border border-[#e06518]/50 text-white px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-xl backdrop-blur-md shadow-2xl max-h-36 sm:max-h-48 overflow-y-auto pointer-events-auto leading-relaxed border-r-4 border-r-[#e06518] animate-fadeInCard">
            <div className="text-[10px] sm:text-[11px] font-bold text-[#e06518] mb-0.5 tracking-wider flex items-center gap-1.5">
              <Volume2 size={13} className="text-[#e06518]" />
              <span>: AI FORZA</span>
            </div>
            <p className="text-[12px] sm:text-[13px] text-[#dee2e5] leading-relaxed font-normal">{displayedAi}</p>
          </div>
        )}
      </div>

      {/* Restore button when HUD hidden */}
      {clean && (
        <button
          className="absolute bottom-5 right-5 z-40 p-2.5 rounded-xl bg-[#0a0d14]/80 border border-[#dee2e5]/30 text-[#dee2e5] hover:text-white hover:bg-white/10 transition-all shadow-xl"
          onClick={() => setClean(false)}
          aria-label="نمایش کنترل‌ها"
          title="نمایش مجدد کنترل‌ها"
        >
          <Eye size={18} />
        </button>
      )}

      {/* Error or Fullscreen Notification Toast */}
      {(errorNotice || fullscreenError) && (
        <div
          dir="rtl"
          className="absolute top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-lg bg-red-950/90 border border-red-500/50 text-red-200 text-xs flex items-center gap-3 backdrop-blur-md shadow-2xl animate-fadeInCard"
          role="status"
        >
          <span>{errorNotice || fullscreenError}</span>
          <button
            onClick={() => {
              setErrorNotice(null);
              setFullscreenError('');
            }}
            className="text-red-300 hover:text-white text-base font-bold px-1"
            aria-label="بستن پیام"
          >
            ✕
          </button>
        </div>
      )}
    </main>
  );
};

export default AiForzaCallExperience;
