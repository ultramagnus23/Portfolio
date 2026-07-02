"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { AudioController } from "@/lib/audio";

interface InterferenceFieldProps {
  progressRef: React.MutableRefObject<number>;
  className?: string;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function ss(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

export default function InterferenceField({ progressRef, className = "" }: InterferenceFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0, height = 0;
    let visible = true;
    const mouse = { x: -9999, y: -9999 };
    let raf = 0;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const noise = (x: number, y: number, t: number): number => {
      const n1 = Math.sin(x * 0.005 + t * 0.3) * Math.cos(y * 0.008);
      const n2 = Math.sin((x + y) * 0.003 + t * 0.2) * Math.cos(x * 0.007 - y * 0.005);
      const n3 = Math.sin(x * 0.002 - y * 0.004 + t * 0.25);
      return (n1 + n2 + n3) / 3;
    };

    const render = (t: number) => {
      ctx.fillStyle = "#090b0a";
      ctx.fillRect(0, 0, width, height);

      const time = reduced ? 0 : t * 0.0005;
      const p = progressRef.current;

      const SIGNAL: [number, number, number] = [0, 255, 148];
      const PHASE: [number, number, number] = [94, 140, 219];
      const colorT = ss(0.67, 0.80, p);
      const cr = Math.round(lerp(SIGNAL[0], PHASE[0], colorT));
      const cg = Math.round(lerp(SIGNAL[1], PHASE[1], colorT));
      const cb = Math.round(lerp(SIGNAL[2], PHASE[2], colorT));

      let opacity = ss(0, 0.07, p);
      if (p > 0.38 && p < 0.65) opacity *= lerp(1, 0.12, ss(0.38, 0.52, p));
      if (p > 0.65 && p < 0.85) opacity *= lerp(0.12, 0.65, ss(0.65, 0.76, p));
      if (p > 0.92) opacity *= lerp(0.65, 0.02, ss(0.92, 1.0, p));

      const step = 30;
      const rows = Math.ceil(height / step) + 1;
      const cols = Math.ceil(width / step) + 1;

      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      ctx.strokeStyle = `rgba(${cr},${cg},${cb},${0.2 * opacity})`;
      ctx.lineWidth = 0.5;

      for (let row = 0; row < rows; row++) {
        const y = row * step;
        ctx.beginPath();
        for (let col = 0; col < cols; col++) {
          const x = col * step;
          const n = noise(x, y, time);
          const offset = n * 12;
          const yOffset = y + offset;
          if (col === 0) ctx.moveTo(x, yOffset);
          else ctx.lineTo(x, yOffset);
        }
        ctx.stroke();
      }

      ctx.strokeStyle = `rgba(${cr},${cg},${cb},${0.15 * opacity})`;
      ctx.lineWidth = 0.4;

      for (let col = 0; col < cols; col++) {
        const x = col * step;
        ctx.beginPath();
        for (let row = 0; row < rows; row++) {
          const y = row * step;
          const n = noise(x, y, time);
          const offset = n * 12;
          const yOffset = y + offset;
          if (row === 0) ctx.moveTo(x, yOffset);
          else ctx.lineTo(x, yOffset);
        }
        ctx.stroke();
      }

      const dm = Math.hypot(width / 2 - mouse.x, height / 2 - mouse.y);
      if (dm < 300) {
        const influence = (1 - dm / 300) * 0.3;
        ctx.strokeStyle = `rgba(${cr},${cg},${cb},${influence * opacity * 0.2})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 50 + Math.sin(time * 2) * 15, 0, Math.PI * 2);
        ctx.stroke();
      }

      if (!reduced && visible) raf = requestAnimationFrame(render);
    };

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      AudioController.instance.touch();
    };

    resize();
    window.addEventListener("resize", resize);
    if (!reduced) window.addEventListener("mousemove", onMouseMove);

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

    if (reduced) render(0);

    const onVisibility = () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else if (visible && !reduced) raf = requestAnimationFrame(render);
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
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
