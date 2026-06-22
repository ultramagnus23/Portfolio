"use client";

import { useRef, ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

interface MagneticProps {
  children: ReactNode;
  className?: string;
  /** how strongly the element follows the cursor (0–1) */
  strength?: number;
}

/**
 * Wraps an element so it gently leans toward the cursor while hovered, then
 * springs back. Disabled entirely under prefers-reduced-motion.
 */
export default function Magnetic({ children, className = "", strength = 0.4 }: MagneticProps) {
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 300, damping: 20, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 300, damping: 20, mass: 0.4 });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    x.set(relX * strength);
    y.set(relY * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ x: sx, y: sy, display: "inline-block" }}
    >
      {children}
    </motion.div>
  );
}
