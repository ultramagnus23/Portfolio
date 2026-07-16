"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useNormalizedPointer } from "@/hooks/useNormalizedPointer";
import ParticleField from "./ParticleField";
import CameraRig from "./CameraRig";

// Kept deliberately restrained — a dense cloud reads as noise, not signal.
// Fewer, better-composed points let the formations (orb, wavefront, lattice,
// interference, singularity) actually read as shapes instead of static.
const DESKTOP_COUNT = 7000;
const MOBILE_COUNT = 2800;

/**
 * The persistent backdrop for the whole scroll arc: one GPGPU-style point
 * cloud that reconstructs from noise into a different formation per
 * chapter (see components/scene/targets.ts). Mounted once at the page
 * root — chapters drive it purely through the zustand scene store, no
 * prop drilling required.
 */
export default function SceneCanvas() {
  const reduced = usePrefersReducedMotion();
  const isMobile = useIsMobile();
  const pointer = useNormalizedPointer();

  if (reduced) {
    return (
      <div className="fixed inset-0" style={{ zIndex: 1, background: "#090b0a" }} aria-hidden="true" />
    );
  }

  return (
    <div className="fixed inset-0" style={{ zIndex: 1, pointerEvents: "none" }} aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <ParticleField count={isMobile ? MOBILE_COUNT : DESKTOP_COUNT} pointer={pointer} />
          <CameraRig pointer={pointer} />
        </Suspense>
      </Canvas>
    </div>
  );
}
