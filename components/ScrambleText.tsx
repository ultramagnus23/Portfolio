"use client";

import { createElement, useEffect, useRef, useState, useCallback } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ01<>/\\=+*#%";

interface ScrambleTextProps {
  text: string;
  className?: string;
  /** ms per reveal step */
  speed?: number;
  /** start on mount, or wait until scrolled into view */
  trigger?: "mount" | "view";
  /** re-scramble on hover */
  hover?: boolean;
  as?: "span" | "h1" | "h2" | "h3" | "p";
}

/**
 * Decodes text from noise into signal — the site's core metaphor, made literal.
 * Respects prefers-reduced-motion by rendering the final text immediately.
 */
export default function ScrambleText({
  text,
  className = "",
  speed = 28,
  trigger = "view",
  hover = false,
  as = "span",
}: ScrambleTextProps) {
  const reduced = usePrefersReducedMotion();
  const [display, setDisplay] = useState(reduced ? text : "");
  const ref = useRef<HTMLElement>(null);
  const frame = useRef<number>(0);
  const started = useRef(false);

  const run = useCallback(() => {
    if (reduced) {
      setDisplay(text);
      return;
    }
    let iteration = 0;
    cancelAnimationFrame(frame.current);
    const tick = () => {
      const revealed = Math.floor(iteration);
      setDisplay(
        text
          .split("")
          .map((ch, i) => {
            if (ch === " ") return " ";
            if (i < revealed) return text[i];
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join("")
      );
      iteration += speed / 60;
      if (revealed < text.length) {
        frame.current = requestAnimationFrame(tick);
      } else {
        setDisplay(text);
      }
    };
    frame.current = requestAnimationFrame(tick);
  }, [text, speed, reduced]);

  useEffect(() => {
    if (reduced) {
      setDisplay(text);
      return;
    }
    if (trigger === "mount") {
      run();
      return () => cancelAnimationFrame(frame.current);
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started.current) {
          started.current = true;
          run();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame.current);
    };
  }, [run, trigger, reduced, text]);

  const Tag = as;
  return createElement(
    Tag,
    {
      ref,
      className,
      onMouseEnter: hover ? run : undefined,
      "aria-label": text,
    },
    <span aria-hidden="true" key="display">{display || " "}</span>
  );
}
