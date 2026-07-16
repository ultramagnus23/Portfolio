"use client";

import type { ReactNode } from "react";

/**
 * Shared "device window" chrome for per-project scenes — a title bar with
 * status dots and a mono label, framing whatever's actually happening
 * inside as a screen being looked at, not a content card.
 */
export default function SceneFrame({
  title,
  accent,
  children,
}: {
  title: string;
  accent: string;
  children: ReactNode;
}) {
  return (
    <div className="border border-white/10 bg-white/[0.015] overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/10">
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: `${accent}88` }} />
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: `${accent}44` }} />
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: `${accent}22` }} />
        <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#666] ml-2">
          {title}
        </span>
      </div>
      <div className="p-6 md:p-8">{children}</div>
    </div>
  );
}
