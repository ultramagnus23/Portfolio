"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Two-layer cursor: an instant core dot plus a lagging reticle ring.
 * Over interactive elements the ring morphs from a circle into a
 * viewfinder (corner brackets) — optionally with a label from
 * `data-cursor-text`. Fine pointers only; touch devices never mount it.
 */
export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(window.matchMedia("(pointer: fine)").matches);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ring || !label) return;

    const pos = { x: -100, y: -100 };
    const ringPos = { x: -100, y: -100 };
    let ringScale = 1;
    let targetRingScale = 1;
    let dotScale = 1;
    let targetDotScale = 1;
    let opacity = 0;
    let targetOpacity = 0;
    let pressed = false;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      targetOpacity = 1;
    };

    const onOver = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest?.(
        "a, button, [data-cursor]"
      ) as HTMLElement | null;
      if (el) {
        targetRingScale = 1.75;
        targetDotScale = 0.45;
        ring.classList.add("is-hover");
        label.textContent = el.getAttribute("data-cursor-text") ?? "";
      } else {
        targetRingScale = 1;
        targetDotScale = 1;
        ring.classList.remove("is-hover");
        label.textContent = "";
      }
    };

    const onDown = () => {
      pressed = true;
    };
    const onUp = () => {
      pressed = false;
    };
    const onLeave = () => {
      targetOpacity = 0;
    };
    const onEnter = () => {
      targetOpacity = 1;
    };

    const loop = () => {
      ringPos.x += (pos.x - ringPos.x) * 0.16;
      ringPos.y += (pos.y - ringPos.y) * 0.16;

      const rs = pressed ? targetRingScale * 0.82 : targetRingScale;
      const ds = pressed ? targetDotScale * 1.6 : targetDotScale;
      ringScale += (rs - ringScale) * 0.18;
      dotScale += (ds - dotScale) * 0.22;
      opacity += (targetOpacity - opacity) * 0.2;

      dot.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) scale(${dotScale})`;
      ring.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0) scale(${ringScale})`;
      dot.style.opacity = String(opacity);
      ring.style.opacity = String(opacity);

      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div ref={ringRef} className="cursor-ring" aria-hidden="true">
        <span className="cursor-tick cursor-tick--tl" />
        <span className="cursor-tick cursor-tick--tr" />
        <span className="cursor-tick cursor-tick--bl" />
        <span className="cursor-tick cursor-tick--br" />
        <span ref={labelRef} className="cursor-label" />
      </div>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
    </>
  );
}
