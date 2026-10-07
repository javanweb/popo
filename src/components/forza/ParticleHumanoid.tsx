import React, { useEffect, useRef } from "react";
import { createScene, paintScene, createBackdrop, W, H, LOGO_BOX, LOGO_COLOR, BRAND, LogoMask } from "./particleEngine";
import logoUrl from "../../assets/forza-logo.png";

/**
 * Canvas 2D particle humanoid with the FORZA logo assembled in the chest.
 * paused: boolean; speed: positive multiplier; restartKey: change to replay.
 *
 * Perf: focused live region, cached sprites and static geometry, pixel-budgeted
 * DPR, adaptive quality, 30/60 FPS targets, and no RAF loop while paused/hidden.
 * Quality is an aid, not a frame-rate guarantee on every device.
 */
let logoPromise: Promise<{ tint: HTMLCanvasElement; mask: LogoMask } | null> | null = null;

function loadLogo(): Promise<{ tint: HTMLCanvasElement; mask: LogoMask } | null> {
  if (logoPromise) return logoPromise;
  logoPromise = new Promise(resolve => {
    const img = new Image();
    img.onload = () => {
      // Recolour the white logo to the brand primary so it's clearly visible.
      const tint = document.createElement("canvas");
      tint.width = img.naturalWidth || 640;
      tint.height = img.naturalHeight || 424;
      const t = tint.getContext("2d");
      if (t) {
        t.drawImage(img, 0, 0);
        t.globalCompositeOperation = "source-in";
        t.fillStyle = LOGO_COLOR;
        t.fillRect(0, 0, tint.width, tint.height);
      }
      // Small alpha mask for particle sampling.
      const mw = 320, mh = Math.round((mw * (img.naturalHeight || 424)) / (img.naturalWidth || 640));
      const m = document.createElement("canvas");
      m.width = mw;
      m.height = mh;
      const mc = m.getContext("2d", { willReadFrequently: true });
      if (mc) {
        mc.drawImage(img, 0, 0, mw, mh);
        resolve({ tint, mask: { data: mc.getImageData(0, 0, mw, mh).data, w: mw, h: mh } });
      } else {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = logoUrl;
  });
  return logoPromise;
}

export interface ParticleHumanoidProps {
  paused?: boolean;
  speed?: number;
  energy?: number;
  audioInput?: React.MutableRefObject<{ analyser: AnalyserNode; bins: Uint8Array } | null>;
  restartKey?: number;
  quality?: string;
  onStats?: (stats: { fps: number | null; tier: string; renderMs: number }) => void;
  className?: string;
}

export const ParticleHumanoid: React.FC<ParticleHumanoidProps> = ({
  paused = false,
  speed = 1,
  energy = 72,
  audioInput,
  restartKey = 0,
  quality = "auto",
  onStats,
}) => {
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const wake = useRef<(() => void) | null>(null);
  const settings = useRef({ paused, speed, energy, audioInput, quality, onStats });
  settings.current = { paused, speed, energy, audioInput, quality, onStats };

  useEffect(() => {
    wake.current?.();
  }, [paused, speed, energy, quality]);

  useEffect(() => {
    let cancelled = false;
    let frame = 0;
    let observer: ResizeObserver | undefined;
    let teardown: (() => void) | undefined;
    const target = canvas.current;
    if (!target) return;
    const context = target.getContext("2d", { alpha: false });
    if (!context) {
      target.dataset.error = "Canvas 2D unavailable";
      return;
    }

    loadLogo().then(logo => {
      if (cancelled || !context) return;
      const scene = createScene(logo?.mask);
      const backdrop = createBackdrop();
      const layer = document.createElement("canvas");
      layer.width = W;
      layer.height = H;
      const ink = layer.getContext("2d");
      if (!ink) return;

      // Two-step downscale = soft bloom for almost free.
      const glowA = document.createElement("canvas");
      glowA.width = W / 4;
      glowA.height = H / 4;
      const glowB = document.createElement("canvas");
      glowB.width = W / 8;
      glowB.height = H / 8;
      const a = glowA.getContext("2d");
      const b = glowB.getContext("2d");

      const lowDevice = (navigator.hardwareConcurrency || 4) <= 4 || ((navigator as any).deviceMemory || 8) <= 4;
      let autoTier = lowDevice ? 1 : 2;
      let tier = 2;
      let mode = "";
      let width = 1, height = 1, dpr = 1, previous = 0, lastDraw = 0, time = 0;
      let dirty = true, averageCost = 0, samples = 0, statsStart = 0, statFrames = 0, lastAdapt = 0;
      let soundLevel = 0;
      const aim = { x: 0, y: 0 }, camera = { x: 0, y: 0 };
      const motion = matchMedia("(prefers-reduced-motion: reduce)");
      if (motion.matches) time = 7;

      function chooseTier() {
        return settings.current.quality === "auto"
          ? autoTier
          : settings.current.quality === "low"
          ? 0
          : settings.current.quality === "balanced"
          ? 1
          : 2;
      }

      function resize() {
        if (!target) return;
        const rect = target.getBoundingClientRect();
        width = Math.max(1, rect.width);
        height = Math.max(1, rect.height);
        const budget = tier === 0 ? 900000 : tier === 1 ? 1600000 : 2600000;
        dpr = Math.min(
          window.devicePixelRatio || 1,
          tier === 2 ? 1.65 : 1.2,
          Math.sqrt(budget / (width * height))
        );
        target.width = Math.max(1, Math.round(width * dpr));
        target.height = Math.max(1, Math.round(height * dpr));
        dirty = true;
      }

      function schedule() {
        if (!cancelled && !document.hidden && !frame) frame = requestAnimationFrame(draw);
      }

      function invalidate() {
        dirty = true;
        previous = 0;
        schedule();
      }

      function pointer(event: PointerEvent) {
        if (motion.matches || settings.current.paused || event.pointerType === "touch" || !target) return;
        const rect = target.getBoundingClientRect();
        aim.x = ((event.clientX - rect.left) / rect.width - 0.5) * 10;
        aim.y = ((event.clientY - rect.top) / rect.height - 0.5) * 6;
      }

      function leave() {
        aim.x = 0;
        aim.y = 0;
      }

      function visibility() {
        previous = 0;
        lastDraw = 0;
        statsStart = 0;
        statFrames = 0;
        if (document.hidden) {
          cancelAnimationFrame(frame);
          frame = 0;
        } else {
          invalidate();
        }
      }

      function reducedMotion() {
        if (motion.matches) {
          time = Math.max(time, 7);
          camera.x = camera.y = aim.x = aim.y = 0;
        }
        invalidate();
      }

      function draw(now: number) {
        frame = 0;
        if (cancelled || document.hidden || !context || !ink) return;
        const nextTier = chooseTier();
        if (tier !== nextTier || mode !== settings.current.quality) {
          tier = nextTier;
          mode = settings.current.quality;
          resize();
          averageCost = 0;
          samples = 0;
          statsStart = now;
          statFrames = 0;
        }
        const running = !settings.current.paused && !motion.matches;
        const interval = tier === 0 ? 1000 / 30 : 1000 / 60;
        if (!dirty && running && now - lastDraw < interval - 0.8) {
          schedule();
          return;
        }
        if (!dirty && !running) return;
        const started = performance.now();
        const delta = previous ? Math.min((now - previous) / 1000, 0.075) : 0;
        previous = now;
        lastDraw = now;
        dirty = false;
        if (running) {
          time += delta * Math.max(0.1, settings.current.speed);
          const ease = 1 - Math.exp(-delta * 5);
          camera.x += (aim.x - camera.x) * ease;
          camera.y += (aim.y - camera.y) * ease;
        }
        const audio = settings.current.audioInput?.current;
        if (audio?.analyser && running) {
          audio.analyser.getByteFrequencyData(audio.bins as any);
          let total = 0;
          for (let i = 1; i < Math.min(audio.bins.length, 48); i++) total += audio.bins[i];
          const level = Math.max(0, Math.min(1, (total / 47 - 7) / 78));
          const response = level > soundLevel ? 0.28 : 0.085;
          soundLevel += (level - soundLevel) * response;
        } else {
          soundLevel += (0 - soundLevel) * 0.16;
        }

        const { breathY, logoAlpha } = paintScene(
          ink,
          scene,
          time,
          tier,
          settings.current.energy / 72,
          soundLevel
        );

        context.setTransform(dpr, 0, 0, dpr, 0, 0);
        context.globalAlpha = 1;
        context.globalCompositeOperation = "source-over";
        context.fillStyle = BRAND.background;
        context.fillRect(0, 0, width, height);

        const usableHeight = Math.max(180, height - (height > 420 ? 136 : 80));
        const scale = Math.min((width - 24) / 700, usableHeight / 635);
        const x = (width - W * scale) / 2 + camera.x;
        const y = (height - H * scale) / 2 - 10 + camera.y;
        const dw = W * scale;
        const dh = H * scale;

        context.drawImage(backdrop, x, y, dw, dh);
        if (tier > 0 && a) {
          a.clearRect(0, 0, glowA.width, glowA.height);
          a.drawImage(layer, 0, 0, glowA.width, glowA.height);
          context.globalCompositeOperation = "screen";
          if (tier === 2 && b) {
            b.clearRect(0, 0, glowB.width, glowB.height);
            b.drawImage(glowA, 0, 0, glowB.width, glowB.height);
            context.globalAlpha = 0.63;
            context.drawImage(glowB, x, y, dw, dh);
          }
          context.globalAlpha = 0.65;
          context.drawImage(glowA, x, y, dw, dh);
        }
        context.globalCompositeOperation = "screen";
        context.globalAlpha = 1;
        context.drawImage(layer, x, y, dw, dh);
        context.globalCompositeOperation = "source-over";

        // Crisp logo on top, at screen resolution, breathing with the body.
        if (logo && logoAlpha > 0) {
          context.globalAlpha = logoAlpha;
          context.drawImage(
            logo.tint,
            x + LOGO_BOX.x * scale,
            y + (LOGO_BOX.y + breathY) * scale,
            LOGO_BOX.w * scale,
            LOGO_BOX.h * scale
          );
          context.globalAlpha = 1;
        }

        const cost = performance.now() - started;
        averageCost = samples ? averageCost * 0.94 + cost * 0.06 : cost;
        samples++;
        statFrames++;
        if (!statsStart) statsStart = now;
        if (!running || now - statsStart >= 1000) {
          settings.current.onStats?.({
            fps: running ? Math.round((statFrames * 1000) / Math.max(1, now - statsStart)) : 0,
            tier: ["ECO", "BALANCED", "ULTRA"][tier],
            renderMs: Math.round(averageCost * 10) / 10,
          });
          statsStart = now;
          statFrames = 0;
        }
        if (mode === "auto" && time > 5 && samples > 90 && now - lastAdapt > 4500) {
          if (averageCost > (tier === 2 ? 12 : 20) && autoTier > 0) {
            autoTier--;
            lastAdapt = now;
          } else if (averageCost < 6 && autoTier < 2 && !lowDevice && now - lastAdapt > 12000) {
            autoTier++;
            lastAdapt = now;
          }
        }
        if (running) schedule();
      }

      observer = new ResizeObserver(() => {
        resize();
        invalidate();
      });
      observer.observe(target);
      document.addEventListener("visibilitychange", visibility);
      motion.addEventListener("change", reducedMotion);
      target.addEventListener("pointermove", pointer, { passive: true });
      target.addEventListener("pointerleave", leave);
      wake.current = invalidate;
      teardown = () => {
        document.removeEventListener("visibilitychange", visibility);
        motion.removeEventListener("change", reducedMotion);
        target.removeEventListener("pointermove", pointer);
        target.removeEventListener("pointerleave", leave);
      };
      resize();
      schedule();
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      observer?.disconnect();
      teardown?.();
      wake.current = null;
    };
  }, [restartKey]);

  return (
    <canvas
      ref={canvas}
      className="particle-canvas"
      role="img"
      aria-label="FORZA particle humanoid with dimensional mesh, amber facial waves, illuminated shoulders and a glowing chest emblem."
    />
  );
};

export default ParticleHumanoid;
