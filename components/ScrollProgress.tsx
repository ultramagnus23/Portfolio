"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/** Thin signal-green progress bar pinned to the top of the viewport. */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] bg-signal origin-left z-[9997]"
      style={{ scaleX }}
      aria-hidden="true"
    />
  );
}
