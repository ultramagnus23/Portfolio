"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

interface InterferenceFieldProps {
  className?: string;
  /** dot colour as [r,g,b] */
  color?: [number, number, number];
  /** lattice spacing in px (larger = sparser = cheaper) */
  spacing?: number;
  /** follow the cursor as an extra wave source */
  interactive?: boolean;
  opacity?: number;
}

/**
 * A lattice of dots whose brightness follows the superposition of a few moving
 * wave sources — a literal interference pattern, the physics behind HoloForge.
 * Cheap (coarse lattice, viewport + visibility gated) and reduced-motion safe.
 */
export default function InterferenceField({
  className = "",
  color = [0, 255, 148],
  spacing = 26,
  interactive = true,
  opacity = 1,
}: InterferenceFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const [r, g, b] = color;
    let raf = 0;
    let width = 0;
    let height = 0;
    let cols = 0;
    let rows = 0;
    let visible = true;
    const mouse = { x: -9999, y: -9999, active: false };
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const gap = isMobile ? spacing * 1.4 : spacing;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(width / gap) + 1;
      rows = Math.ceil(height / gap) + 1;
    };

    // Slow-drifting wave sources (in px space)
    const sources = [
      { x: width * 0.25, y: height * 0.35, k: 0.045, sx: 0.18, sy: 0.12 },
      { x: width * 0.7, y: height * 0.6, k: 0.038, sx: -0.13, sy: 0.16 },
    ];

    const render = (t: number) => {
      ctx.clearRect(0, 0, width, height);
      const time = reduced ? 0 : t * 0.001;

      const s0x = width * (0.25 + 0.12 * Math.sin(time * 0.3));
      const s0y = height * (0.4 + 0.12 * Math.cos(time * 0.23));
      const s1x = width * (0.72 + 0.12 * Math.cos(time * 0.27));
      const s1y = height * (0.55 + 0.12 * Math.sin(time * 0.31));
      sources[0].x = s0x;
      sources[0].y = s0y;
      sources[1].x = s1x;
      sources[1].y = s1y;

      for (let cx = 0; cx < cols; cx++) {
        for (let cy = 0; cy < rows; cy++) {
          const px = cx * gap;
          const py = cy * gap;
          let sum = 0;
          for (const s of sources) {
            const d = Math.hypot(px - s.x, py - s.y);
            sum += Math.cos(d * s.k - time * 2.2);
          }
          if (interactive && mouse.active) {
            const dm = Math.hypot(px - mouse.x, py - mouse.y);
            if (dm < 260) sum += Math.cos(dm * 0.06 - time * 3) * (1 - dm / 260) * 2.4;
          }
          // normalise sum (~ -2..2 + mouse) to 0..1
          const v = Math.max(0, Math.min(1, (sum + 2) / 4));
          if (v < 0.12) continue;
          const a = v * v * 0.9 * opacity;
          const radius = 0.5 + v * 1.6;
          ctx.beginPath();
          ctx.fillStyle = `rgba(${r},${g},${b},${a})`;
          ctx.arc(px, py, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      if (!reduced && visible) raf = requestAnimationFrame(render);
    };

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = mouse.x >= 0 && mouse.y >= 0 && mouse.x <= width && mouse.y <= height;
    };

    resize();
    window.addEventListener("resize", resize);
    if (interactive && !reduced) window.addEventListener("mousemove", onMove);

    // Gate the animation to viewport visibility for performance.
    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[0].isIntersecting;
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

    if (reduced) {
      // one static frame
      render(0);
    }

    const onVisibility = () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else if (visible && !reduced) raf = requestAnimationFrame(render);
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("visibilitychange", onVisibility);
      io.disconnect();
    };
  }, [color, spacing, interactive, opacity, reduced]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
