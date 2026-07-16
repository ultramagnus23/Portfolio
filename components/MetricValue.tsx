"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useMotionValue } from "framer-motion";

/**
 * Extracts a leading integer from a metric string ("8,200+" → 8200,
 * "10+" → 10) and counts up to it once scrolled into view. Strings with
 * no leading number ("Pre-launch") render as-is, unanimated.
 */
export default function MetricValue({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const match = value.match(/^([\d,]+)(.*)$/);
  const target = match ? parseInt(match[1].replace(/,/g, ""), 10) : null;
  const suffix = match ? match[2] : "";
  const count = useMotionValue(0);
  const [display, setDisplay] = useState(target === null ? value : "0");

  useEffect(() => {
    if (target === null || !inView) return;
    const controls = animate(count, target, {
      duration: 1.1,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v).toLocaleString()),
    });
    return () => controls.stop();
  }, [inView, target, count]);

  if (target === null) return <span ref={ref}>{value}</span>;
  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}
