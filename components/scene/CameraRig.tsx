"use client";

import { useFrame, useThree } from "@react-three/fiber";
import type { RefObject } from "react";
import { useSceneStore } from "@/lib/scrollStore";
import type { PointerState } from "@/hooks/useNormalizedPointer";

interface CameraRigProps {
  pointer: RefObject<PointerState>;
}

/** Gentle scroll-driven dolly + mouse parallax — the "camera movement" the
 *  brief asks for, without the complexity of literal per-chapter framing. */
export default function CameraRig({ pointer }: CameraRigProps) {
  const { camera } = useThree();

  useFrame(() => {
    const { progress } = useSceneStore.getState();
    const targetZ = 8 - progress * 0.8;
    const targetX = pointer.current.active ? pointer.current.x * 0.4 : 0;
    const targetY = pointer.current.active ? pointer.current.y * 0.25 : 0;

    camera.position.z += (targetZ - camera.position.z) * 0.04;
    camera.position.x += (targetX - camera.position.x) * 0.04;
    camera.position.y += (targetY - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);
  });

  return null;
}
