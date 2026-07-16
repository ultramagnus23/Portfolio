"use client";

import { useRef, type ReactNode, type RefObject } from "react";
import { useScroll, useMotionValueEvent, useInView } from "framer-motion";

/**
 * Shared scaffolding for a flagship project's pinned cinematic sequence: a
 * 300vh scroll wrapper around a sticky 100vh section, tracking local scroll
 * progress (0–1) imperatively into a plain ref so the R3F render loop inside
 * `children` can read it every frame without triggering React re-renders —
 * same pattern as useSceneStore's imperative getState() reads in
 * ParticleField/CameraRig.
 */
export default function PinnedStation({
  domId,
  children,
  caption,
}: {
  domId: string;
  children: (progress: RefObject<number>) => ReactNode;
  caption?: ReactNode;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const progress = useRef(0);

  // Mount the (heavy, WebGL-backed) Canvas only while the station is near
  // the viewport, and unmount it once scrolled well past — three flagship
  // scenes plus the persistent background field all running concurrently
  // would blow the frame budget (and, in constrained environments, hang the
  // renderer outright). Not `once: true`: this intentionally tears down the
  // Canvas/GL context when it's no longer relevant.
  //
  // Margin is a full viewport-height on each side (not the tight ~30% used
  // originally) — the actual mount still has to pay for the dynamic import's
  // chunk fetch + WebGL context creation, and a narrow margin meant that
  // cost was paid mid-scroll, so the laptop/floor visibly popped in late.
  // The chunk itself is also prefetched independently (see each Station's
  // useEffect) so by the time this margin is crossed, only the (fast) Canvas
  // mount is left to do.
  const inView = useInView(wrapperRef, { margin: "100% 0px 100% 0px" });

  const { scrollYProgress } = useScroll({ target: wrapperRef, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    progress.current = v;
  });

  return (
    <div id={domId} ref={wrapperRef} style={{ height: "300vh", position: "relative" }}>
      <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}>
        {inView && children(progress)}
        {caption && (
          <div className="absolute bottom-10 left-6 right-6 md:left-16 md:right-16 z-10 pointer-events-none">
            {caption}
          </div>
        )}
      </div>
    </div>
  );
}
