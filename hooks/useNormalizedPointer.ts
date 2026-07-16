"use client";

import { useEffect, useRef } from "react";
import { AudioController } from "@/lib/audio";

export interface PointerState {
  x: number;
  y: number;
  active: boolean;
}

/**
 * Tracks pointer position normalized to [-1, 1] via a single shared
 * listener, for consumption inside R3F's render loop (read the ref
 * imperatively — never as reactive state, to keep this at 60fps for free).
 * Also chirps the ambient audio layer on movement, matching the old
 * InterferenceField's cursor-touch behavior.
 */
export function useNormalizedPointer() {
  const pointer = useRef<PointerState>({ x: 0, y: 0, active: false });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
      pointer.current.active = true;
      AudioController.instance.touch();
    };
    const onLeave = () => {
      pointer.current.active = false;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return pointer;
}
