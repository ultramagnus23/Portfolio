import { create } from "zustand";

interface SceneState {
  /**
   * Master scroll progress across the cinematic arc, 0–1. Written by the
   * chapter-scoped Framer scroll handlers in app/page.tsx and read
   * imperatively (via getState()) inside the R3F render loop — never
   * subscribed to through the hook, so 60fps writes never trigger a
   * React re-render.
   */
  progress: number;
  /**
   * Project accent color (hex) tinting the particle field while a project
   * station is scrolled into view. Null outside the Systems chapter.
   */
  activeAccent: string | null;
  setProgress: (p: number) => void;
  setActiveAccent: (c: string | null) => void;
}

export const useSceneStore = create<SceneState>((set) => ({
  progress: 0,
  activeAccent: null,
  setProgress: (p) => set({ progress: p }),
  setActiveAccent: (c) => set({ activeAccent: c }),
}));
