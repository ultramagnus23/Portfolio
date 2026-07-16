"use client";

import { useFrame, useThree } from "@react-three/fiber";
import type { RefObject } from "react";
import type * as THREE from "three";
import { useSceneStore } from "@/lib/scrollStore";
import type { PointerState } from "@/hooks/useNormalizedPointer";
import { BANDS, smoothstep, lerp, bandIndex } from "./bands";

interface CameraRigProps {
  pointer: RefObject<PointerState>;
}

interface CamState {
  x: number;
  y: number;
  z: number;
  fov: number;
}

// One keyframe per chapter boundary (6 keyframes bracket the 5 chapters).
// Ch1 Arrival: dolly straight in.
// Ch2 Reconstruction: arcs sideways, camera orbits around the wavefront.
// Ch3 Systems: pulls up and wide — the field reads as a set of nodes to survey.
// Ch4 Research: pulls back and narrows focus onto the interference rings.
// Ch5 Transmission: pushes hard into the singularity collapse.
const KEYFRAMES: CamState[] = [
  { x: 0, y: 0, z: 8, fov: 45 }, // start of Ch1
  { x: 0, y: 0.15, z: 6, fov: 42 }, // end of Ch1 / start of Ch2
  { x: 1.4, y: -0.3, z: 6.4, fov: 44 }, // end of Ch2 / start of Ch3
  { x: -1.6, y: 0.9, z: 7.6, fov: 52 }, // end of Ch3 / start of Ch4
  { x: 0.6, y: 0.2, z: 9.5, fov: 38 }, // end of Ch4 / start of Ch5
  { x: 0, y: 0, z: 1.8, fov: 34 }, // end of Ch5 — inside the singularity
];

/** Real per-chapter camera choreography driven by scroll progress, with a
 *  pointer-parallax offset layered on top so mouse movement adds depth
 *  without fighting the scroll-driven dolly. */
export default function CameraRig({ pointer }: CameraRigProps) {
  const { camera } = useThree();
  const target = { x: 0, y: 0, z: 8, fov: 45 };

  useFrame(() => {
    const { progress } = useSceneStore.getState();
    const p = Math.min(1, Math.max(0, progress));
    const stage = bandIndex(p);
    const localT = smoothstep(BANDS[stage], BANDS[stage + 1], p);

    const a = KEYFRAMES[stage];
    const b = KEYFRAMES[stage + 1];

    target.x = lerp(a.x, b.x, localT);
    target.y = lerp(a.y, b.y, localT);
    target.z = lerp(a.z, b.z, localT);
    target.fov = lerp(a.fov, b.fov, localT);

    // Pointer parallax: a small independent offset so the camera keeps
    // reading as a physical object in the scene, layered additively on the
    // scroll-driven position rather than replacing it.
    const parallaxX = pointer.current.active ? pointer.current.x * 0.35 : 0;
    const parallaxY = pointer.current.active ? pointer.current.y * 0.2 : 0;

    camera.position.x += (target.x + parallaxX - camera.position.x) * 0.05;
    camera.position.y += (target.y + parallaxY - camera.position.y) * 0.05;
    camera.position.z += (target.z - camera.position.z) * 0.05;
    camera.lookAt(0, 0, 0);

    if ("fov" in camera) {
      const perspCam = camera as THREE.PerspectiveCamera;
      perspCam.fov += (target.fov - perspCam.fov) * 0.05;
      perspCam.updateProjectionMatrix();
    }
  });

  return null;
}
