"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/** Types a line of text out character by character once scrolled into view. */
export default function TypeLine({
  text,
  className = "",
  speed = 28,
  startDelay = 0,
  onDone,
}: {
  text: string;
  className?: string;
  speed?: number;
  startDelay?: number;
  onDone?: () => void;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduced = usePrefersReducedMotion();
  const [chars, setChars] = useState(reduced ? text.length : 0);
  const done = useRef(false);

  useEffect(() => {
    if (reduced) {
      if (!done.current) {
        done.current = true;
        onDone?.();
      }
      return;
    }
    if (!inView) return;

    let i = 0;
    const startTimeout = setTimeout(() => {
      const id = setInterval(() => {
        i++;
        setChars(i);
        if (i >= text.length) {
          clearInterval(id);
          if (!done.current) {
            done.current = true;
            onDone?.();
          }
        }
      }, speed);
    }, startDelay);
    return () => clearTimeout(startTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduced]);

  return (
    <span ref={ref} className={className}>
      {text.slice(0, chars)}
      {!reduced && chars < text.length && inView && <span className="animate-pulse">▌</span>}
    </span>
  );
}
