"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { AudioController } from "@/lib/audio";

interface WavefrontCanvasProps {
  /** Mutable ref written by GSAP ScrollTrigger, read each rAF frame. 0.0–1.0. */
  progressRef: React.MutableRefObject<number>;
  className?: string;
}

// smoothstep: 0 when x<=edge0, 1 when x>=edge1
function ss(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

// signal green → phase blue
const SIGNAL: [number, number, number] = [0, 255, 148];
const PHASE:  [number, number, number] = [94, 140, 219];

export default function WavefrontCanvas({ progressRef, className = "" }: WavefrontCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isMobile = window.innerWidth < 768;
    const spacing = isMobile ? 32 : 24;
    let raf = 0;
    let width = 0, height = 0, cols = 0, rows = 0;
    let visible = true;
    const mouse = { x: -9999, y: -9999 };
    // Click ripples — expanding wavefront pulses radiating from the pointer
    const ripples: { x: number; y: number; t0: number }[] = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(width / spacing) + 1;
      rows = Math.ceil(height / spacing) + 1;
    };

    const render = (t: number) => {
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "source-over";
      const time = reduced ? 0 : t * 0.001;
      const p = progressRef.current;

      // Cull expired ripples (2.4s life)
      for (let i = ripples.length - 1; i >= 0; i--) {
        if (time - ripples[i].t0 > 2.4) ripples.splice(i, 1);
      }

      // ── Chapter state parameters ─────────────────────────────────────────

      // Wave source weights (0 → on → off smoothly)
      const w0 = ss(0.03, 0.12, p);                                      // Ch 1: main source
      const w1 = ss(0.18, 0.27, p) * (1 - ss(0.9, 1.0, p));             // Ch 2: joins, stays
      const w2 = ss(0.42, 0.52, p) * (1 - ss(0.68, 0.76, p));           // Ch 3 only

      // Pre-signal noise amplitude (fades out as wavefront resolves)
      const noiseAmp = (1 - ss(0, 0.18, p)) * 1.6;

      // Canvas opacity — bright Ch1/2, dim Ch3 (cards), bright+blue Ch4, fade Ch5
      let opacity = ss(0, 0.07, p);
      if (p > 0.38 && p < 0.65) opacity *= lerp(1, 0.28, ss(0.38, 0.52, p));
      if (p > 0.65 && p < 0.85) opacity *= lerp(0.28, 0.9, ss(0.65, 0.76, p));
      if (p > 0.92)              opacity *= lerp(0.9, 0.06, ss(0.92, 1.0, p));

      // Color: signal green → phase blue as Research chapter enters (Ch4: 0.65–0.85)
      const colorT = ss(0.67, 0.80, p);
      const cr = Math.round(lerp(SIGNAL[0], PHASE[0], colorT));
      const cg = Math.round(lerp(SIGNAL[1], PHASE[1], colorT));
      const cb = Math.round(lerp(SIGNAL[2], PHASE[2], colorT));

      // Wave source positions (slow autonomous drift)
      const s0x = width  * (0.50 + 0.07 * Math.sin(time * 0.25) - p * 0.12);
      const s0y = height * (0.45 + 0.07 * Math.cos(time * 0.20));
      const s1x = width  * (0.28 + 0.09 * Math.cos(time * 0.22) + p * 0.08);
      const s1y = height * (0.55 + 0.09 * Math.sin(time * 0.28));
      const s2x = width  * (0.72 + 0.09 * Math.sin(time * 0.18));
      const s2y = height * (0.38 + 0.09 * Math.cos(time * 0.24));

      // Wave number — Research chapter tightens to a single radial wavefront
      const k = lerp(0.042, 0.068, ss(0.78, 0.91, p));

      // Cursor interaction strength — strongest in Ch 2, quieter in Ch 4
      const cursorStr = lerp(2.4, 0.6, ss(0.78, 0.91, p));

      for (let cx = 0; cx < cols; cx++) {
        for (let cy = 0; cy < rows; cy++) {
          const px = cx * spacing;
          const py = cy * spacing;

          let sum = 0;

          // Pre-signal static noise (stable per cell, animated)
          if (noiseAmp > 0.02) {
            const h = (((cx * 2654435761) ^ (cy * 2246822519)) >>> 0) & 0xffff;
            const cellNoise = h / 0xffff * 2 - 1;
            sum += cellNoise * noiseAmp * Math.sin(time * 3.7 + h * 0.001);
          }

          // Wave sources
          if (w0 > 0.01) sum += w0 * Math.cos(Math.hypot(px - s0x, py - s0y) * k - time * 2.2);
          if (w1 > 0.01) sum += w1 * Math.cos(Math.hypot(px - s1x, py - s1y) * k - time * 2.2);
          if (w2 > 0.01) sum += w2 * Math.cos(Math.hypot(px - s2x, py - s2y) * 0.038 - time * 2.2);

          // Cursor distortion
          const dm = Math.hypot(px - mouse.x, py - mouse.y);
          if (dm < 260) sum += Math.cos(dm * 0.06 - time * 3) * (1 - dm / 260) * cursorStr;

          // Click ripples — subtle expanding ring with quick decay
          for (let ri = 0; ri < ripples.length; ri++) {
            const age = time - ripples[ri].t0;
            const rd = Math.hypot(px - ripples[ri].x, py - ripples[ri].y);
            const front = age * 340;
            const band = Math.abs(rd - front);
            if (band < 130) {
              sum +=
                Math.cos(band * 0.055) *
                Math.exp(-band * 0.016) *
                Math.exp(-age * 1.8) *
                1.2;
            }
          }

          // Normalize → dot brightness
          const totalW = w0 + w1 + w2 + 1;
          const v = Math.max(0, Math.min(1, (sum / totalW + 0.6) / 1.2));
          if (v < 0.1) continue;

          const alpha = v * v * 0.72 * opacity;
          if (alpha < 0.008) continue;

          ctx.beginPath();
          ctx.fillStyle = `rgba(${cr},${cg},${cb},${alpha})`;
          ctx.arc(px, py, 0.45 + v * 1.4, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      if (!reduced && visible) raf = requestAnimationFrame(render);
    };

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      AudioController.instance.touch();
    };

    const onPointerDown = (e: PointerEvent) => {
      if (ripples.length >= 5) ripples.shift();
      ripples.push({ x: e.clientX, y: e.clientY, t0: performance.now() * 0.001 });
    };

    resize();
    window.addEventListener("resize", resize);
    if (!reduced) {
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("pointerdown", onPointerDown);
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible && !reduced) {
          cancelAnimationFrame(raf);
          raf = requestAnimationFrame(render);
        } else {
          cancelAnimationFrame(raf);
        }
      },
      { threshold: 0.01 }
    );
    io.observe(canvas);

    if (reduced) render(0); // one static frame

    const onVisibility = () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else if (visible && !reduced) raf = requestAnimationFrame(render);
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("visibilitychange", onVisibility);
      io.disconnect();
    };
  }, [progressRef, reduced]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 w-screen h-screen pointer-events-none ${className}`}
      style={{ zIndex: 1 }}
      aria-hidden="true"
    />
  );
}
