"use client";

import { useEffect, useState } from "react";

/**
 * SSR-safe mobile-viewport check. Defaults to `false` so the first client
 * render matches the server render (no `window` there), then corrects
 * itself post-mount — avoids hydration mismatches on narrow viewports.
 */
export function useIsMobile(breakpoint = 768): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [breakpoint]);

  return isMobile;
}
