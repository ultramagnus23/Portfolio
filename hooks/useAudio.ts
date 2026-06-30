"use client";

import { useState, useCallback, useEffect } from "react";
import { AudioController } from "@/lib/audio";

export function useAudio() {
  const [muted, setMuted] = useState(true);

  const toggle = useCallback(() => {
    const newMuted = AudioController.instance.toggle();
    setMuted(newMuted);
  }, []);

  // M key toggles audio globally
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "m" || e.key === "M") {
        if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
        toggle();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggle]);

  return { muted, toggle };
}
