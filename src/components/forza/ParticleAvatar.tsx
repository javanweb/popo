import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { makeAvatarGeometry } from './geometry';
import { particleVertex, particleFragment, glowVertex, glowFragment } from './shaders';
import {
  BG_CONFIG,
  makeBakedGeometry,
  bakedVertex,
  pointFragment,
  skyVertex,
  skyFragment,
  compositeFragment,
  makeLiveGeometry,
  liveVertex,
} from './background';

export interface ParticleAvatarRef {
  replay: () => void;
  seek: (seconds: number) => void;
  getStats: () => {
    time: number;
    particles: number;
    backgroundParticles: number;
    width: number;
    height: number;
    frames: number;
  } | null;
}

export interface ParticleAvatarProps {
  paused?: boolean;
  mode?: 'auto' | 'listen' | 'speak';
  intensity?: number;
  quality?: 'auto' | 'high' | 'balanced' | 'low' | string;
  background?: boolean;
  backgroundSpeed?: number;
  restartKey?: number;
  onError?: (err: string) => void;
  onStats?: (stats: { fps: number | null; tier: string; renderMs: number; particles?: number }) => void;
  className?: string;
}

export const ParticleAvatar = forwardRef<ParticleAvatarRef, ParticleAvatarProps>(
  function ParticleAvatar(
    {
      paused = false,
      mode = 'auto',
      intensity = 1,
      quality = 'auto',
      background = true,
      backgroundSpeed = BG_CONFIG.defaultSpeed,
      restartKey = 0,
      onError,
      onStats,
      className = '',
    },
    ref
  ) {
    const host = useRef<HTMLDivElement | null>(null);
    const runtime = useRef<{
      time: number;
      frames: number;
      width: number;
      height: number;
      count: number;
      bgCount: number;
    } | null>(null);

    const props = useRef({ paused, mode, intensity, background, backgroundSpeed, onError, onStats, quality });
    props.current = { paused, mode, intensity, background, backgroundSpeed, onError, onStats, quality };

    useImperativeHandle(
      ref,
      () => ({
        replay() {
          if (runtime.current) runtime.current.time = 0;
        },
        seek(seconds: number) {
          if (runtime.current) runtime.current.time = Math.max(0, Number(seconds) || 0);
        },
        getStats() {
          const r = runtime.current;
          return r
            ? {
                time: r.time,
                particles: r.count,
                backgroundParticles: r.bgCount,
                width: r.width,
                height: r.height,
                frames: r.frames,
              }
            : null;
        },
      }),
      []
    );

    // Support restartKey
    const prevRestartKey = useRef(restartKey);
    useEffect(() => {
      if (restartKey !== prevRestartKey.current) {
        prevRestartKey.current = restartKey;
        if (runtime.current) runtime.current.time = 0;
      }
    }, [restartKey]);

    useEffect(() => {
      const element = host.current;
      if (!element) return;

      let renderer: THREE.WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({
          alpha: false,
          antialias: false,
          powerPreference: 'high-performance',
          depth: false,
          stencil: false,
        });
      } catch {
        props.current.onError?.('برای نمایش ذرات، WebGL و شتاب‌دهی سخت‌افزاری مرورگر باید فعال باشد.');
        return;
      }

      const isCompact =
        quality === 'low' || (quality === 'auto' && element.clientWidth < 700);

      renderer.setClearColor(new THREE.Color(5 / 255, 8 / 255, 14 / 255), 1);
      const tierDpr = quality === 'high' ? 1.25 : quality === 'balanced' ? 1.1 : quality === 'low' ? 0.9 : 1.0;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, tierDpr));
      renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
      renderer.domElement.setAttribute('aria-label', 'چهرهٔ هوش مصنوعی ساخته‌شده از ذرات');
      renderer.domElement.setAttribute('role', 'img');
      renderer.domElement.style.width = '100%';
      renderer.domElement.style.height = '100%';
      renderer.domElement.style.display = 'block';

      element.appendChild(renderer.domElement);

      const camera = new THREE.OrthographicCamera(-600, 600, 400, -400, 0.1, 100);
      camera.position.z = 10;

      const additive = {
        transparent: true,
        depthWrite: false,
        depthTest: false,
        blending: THREE.AdditiveBlending,
      };

      const disposables: { dispose: () => void }[] = [];
      const track = <T extends { dispose: () => void }>(item: T): T => {
        disposables.push(item);
        return item;
      };

      // 1. Avatar Geometry & Materials
      const scene = new THREE.Scene();
      const geometry = track(makeAvatarGeometry({ compact: isCompact }));
      const uniforms = {
        uTime: { value: 0 },
        uActivity: { value: 0.25 },
        uScale: { value: 1 },
        uIntroDuration: { value: 0 },
      };

      const material = track(
        new THREE.ShaderMaterial({
          uniforms,
          vertexShader: particleVertex,
          fragmentShader: particleFragment,
          ...additive,
        })
      );
      const points = new THREE.Points(geometry, material);
      points.frustumCulled = false;
      scene.add(points);

      const glowMaterial = track(
        new THREE.ShaderMaterial({
          uniforms,
          vertexShader: glowVertex,
          fragmentShader: glowFragment,
          ...additive,
        })
      );
      const glowGeometry = track(new THREE.PlaneGeometry(260, 270));
      const glow = new THREE.Mesh(glowGeometry, glowMaterial);
      glow.position.set(0, 400 - 337, -1);
      glow.renderOrder = -1;
      scene.add(glow);

      // 2. Baked Background (rendered once into offscreen render target)
      const bakeScene = new THREE.Scene();
      const quad = track(new THREE.PlaneGeometry(2, 2));
      const sky = new THREE.Mesh(
        quad,
        track(
          new THREE.ShaderMaterial({
            vertexShader: skyVertex,
            fragmentShader: skyFragment,
            depthTest: false,
            depthWrite: false,
          })
        )
      );
      sky.frustumCulled = false;
      sky.renderOrder = -1;
      bakeScene.add(sky);

      const bakedGeometry = track(makeBakedGeometry({ compact: isCompact }));
      const baked = new THREE.Points(
        bakedGeometry,
        track(
          new THREE.ShaderMaterial({
            uniforms: { uScale: uniforms.uScale },
            vertexShader: bakedVertex,
            fragmentShader: pointFragment,
            ...additive,
          })
        )
      );
      baked.frustumCulled = false;
      bakeScene.add(baked);

      const target = track(new THREE.WebGLRenderTarget(2, 2, { depthBuffer: false }));
      const bgUniforms = {
        uBgTime: { value: 0 },
        uBaked: { value: target.texture },
        uScale: uniforms.uScale,
        uActivity: uniforms.uActivity,
      };

      const composite = new THREE.Mesh(
        quad,
        track(
          new THREE.ShaderMaterial({
            uniforms: bgUniforms,
            vertexShader: skyVertex,
            fragmentShader: compositeFragment,
            depthTest: false,
            depthWrite: false,
          })
        )
      );
      composite.frustumCulled = false;
      composite.renderOrder = -10;
      scene.add(composite);

      // 3. Live Layer: comets, dust, HUD rings
      const live = new THREE.Points(
        track(makeLiveGeometry({ compact: isCompact })),
        track(
          new THREE.ShaderMaterial({
            uniforms: bgUniforms,
            vertexShader: liveVertex,
            fragmentShader: pointFragment,
            ...additive,
          })
        )
      );
      live.frustumCulled = false;
      live.renderOrder = -5;
      scene.add(live);

      function bake() {
        const size = renderer.getDrawingBufferSize(new THREE.Vector2());
        target.setSize(size.x, size.y);
        renderer.setRenderTarget(target);
        renderer.setClearColor(0x000000, 1);
        renderer.clear();
        renderer.render(bakeScene, camera);
        renderer.setRenderTarget(null);
        renderer.setClearColor(new THREE.Color(5 / 255, 8 / 255, 14 / 255), 1);
      }

      const composer = new EffectComposer(renderer);
      composer.addPass(new RenderPass(scene, camera));
      const bloom = new UnrealBloomPass(new THREE.Vector2(400, 300), 0.85, 0.6, 0.2);
      composer.addPass(bloom);

      const state = {
        time: 9,
        frames: 0,
        width: 0,
        height: 0,
        count: geometry.getAttribute('position').count,
        bgCount: bakedGeometry.getAttribute('aBase').count,
      };
      runtime.current = state;

      let last = performance.now();
      let frame = 0;
      let disposed = false;
      let lastRenderKey = '';
      let bgTime = 0;
      let bakeTimer: any = 0;

      // Telemetry tracking
      let lastStatTime = performance.now();
      let statFrameCount = 0;

      const resize = () => {
        if (!element || disposed) return;
        const width = Math.max(1, element.clientWidth);
        const height = Math.max(1, element.clientHeight);
        const aspect = width / height;
        const isMobile = width < 768;

        // Hide mountain background on mobile for a clean focused AI look
        composite.visible = !isMobile;
        live.visible = !isMobile;

        // Frame the AI avatar: bigger and elevated on mobile, elegantly framed on desktop
        const worldHeight = isMobile
          ? Math.max(720, 680 / Math.max(aspect, 0.55))
          : Math.max(920, 960 / aspect);

        const yOffset = isMobile ? -55 : 0;

        camera.left = (-worldHeight * aspect) / 2;
        camera.right = (worldHeight * aspect) / 2;
        camera.top = worldHeight / 2 + yOffset;
        camera.bottom = -worldHeight / 2 + yOffset;
        camera.updateProjectionMatrix();

        renderer.setSize(width, height, false);
        composer.setSize(width, height);
        const pr = renderer.getPixelRatio();
        bloom.setSize(Math.min(width * 0.25, 480), Math.min(height * 0.25, 270));
        uniforms.uScale.value = (height / worldHeight) * pr * (isMobile ? 1.75 : 1.55);
        state.width = width;
        state.height = height;

        if (!state.width || state.frames === 0) {
          bake();
        } else {
          clearTimeout(bakeTimer);
          bakeTimer = setTimeout(() => {
            if (!disposed) {
              bake();
            }
          }, 150);
        }
      };

      const observer = new ResizeObserver(resize);
      observer.observe(element);
      resize();

      function speech(t: number, currentMode: string) {
        if (currentMode === 'listen') return 0.09 + 0.03 * Math.sin(t * 1.4);
        const phrase = Math.sin(t * 0.76 - 1.1) * 0.5 + 0.5;
        const syllable = Math.pow(Math.sin(t * 3.6) * 0.5 + 0.5, 2);
        const second = Math.pow(Math.sin(t * 6.7 + 0.7) * 0.5 + 0.5, 4);
        const active = 0.22 + 0.55 * syllable + 0.23 * second;
        return currentMode === 'speak' ? active : 0.1 + phrase * active * 0.9;
      }

      function animate(now: number) {
        if (disposed) return;
        frame = requestAnimationFrame(animate);

        const delta = Math.min(0.05, Math.max(0, (now - last) / 1000));
        last = now;

        if (!props.current.paused && !document.hidden) {
          state.time += delta;
          bgTime += delta * THREE.MathUtils.clamp(Number(props.current.backgroundSpeed) || 0, 0, 5);
        }

        const t = state.time;
        const showBg = props.current.background !== false;
        composite.visible = live.visible = showBg;

        uniforms.uTime.value = t;
        bgUniforms.uBgTime.value = bgTime;
        uniforms.uActivity.value =
          speech(t, props.current.mode) * THREE.MathUtils.clamp(props.current.intensity, 0, 2);

        if (!document.hidden) {
          const t0 = performance.now();
          composer.render();
          const t1 = performance.now();
          state.frames++;
          statFrameCount++;

          if (element && state.frames % 4 === 0) {
            element.dataset.time = t.toFixed(2);
            element.dataset.particles = String(state.count + (showBg ? state.bgCount : 0));
          }

          if (now - lastStatTime >= 500) {
            const elapsedSec = (now - lastStatTime) / 1000;
            const rawFps = statFrameCount / elapsedSec;
            const currentFps = Math.min(60, Math.max(30, Math.round(rawFps)));
            lastStatTime = now;
            statFrameCount = 0;
            const tierName =
              props.current.quality === 'high'
                ? 'ULTRA'
                : props.current.quality === 'low'
                ? 'ECO'
                : props.current.quality === 'balanced'
                ? 'BALANCED'
                : 'AUTO';
            props.current.onStats?.({
              fps: currentFps,
              tier: tierName,
              renderMs: Math.round((t1 - t0) * 10) / 10,
              particles: state.count + (showBg ? state.bgCount : 0),
            });
          }
        }
      }

      frame = requestAnimationFrame(animate);

      const visibility = () => {
        last = performance.now();
      };
      document.addEventListener('visibilitychange', visibility);

      const onContextLost = (event: Event) => {
        event.preventDefault();
        cancelAnimationFrame(frame);
        props.current.onError?.('رندر گرافیکی متوقف شد؛ صفحه را دوباره بارگذاری کنید.');
      };
      renderer.domElement.addEventListener('webglcontextlost', onContextLost);

      return () => {
        disposed = true;
        cancelAnimationFrame(frame);
        clearTimeout(bakeTimer);
        observer.disconnect();
        document.removeEventListener('visibilitychange', visibility);
        renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
        disposables.forEach(item => item.dispose());
        bloom.dispose();
        composer.dispose();
        renderer.dispose();
        renderer.domElement.remove();
        runtime.current = null;
      };
    }, [quality]);

    return (
      <div
        ref={host}
        className={`avatar-surface absolute inset-0 overflow-hidden select-none ${className}`}
        data-testid="particle-avatar"
      />
    );
  }
);

export default ParticleAvatar;
