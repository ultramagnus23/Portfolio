"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { gsap, ScrollTrigger, ensureScrollTrigger } from "@/lib/gsap";

/**
 * Wires up Lenis smooth scrolling as a side effect only — renders no DOM
 * of its own, so it can't interfere with the sticky-positioned chapter
 * sections. Skipped entirely under prefers-reduced-motion.
 *
 * Driven off gsap's ticker (rather than a bare rAF loop) and synced to
 * ScrollTrigger.update — the standard Lenis+GSAP integration — so every
 * ScrollTrigger-scrubbed transition elsewhere in the app stays in lockstep
 * with Lenis's smoothed scroll position instead of reading stale values.
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    ensureScrollTrigger();

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
    });

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, [reduced]);

  return <>{children}</>;
}
