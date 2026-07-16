"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import PinnedStation from "./PinnedStation";

const CollegeOSCanvas = dynamic(() => import("./CollegeOSCanvas"), { ssr: false });

export default function CollegeOSStation({ accent }: { accent: string }) {
  // Warm the chunk as soon as this station mounts (it's always in the DOM,
  // just off-screen) so the dynamic import has already resolved by the time
  // PinnedStation's viewport margin flips it into view — otherwise the fetch
  // only starts mid-scroll and the laptop pops in late.
  useEffect(() => {
    import("./CollegeOSCanvas");
  }, []);

  return (
    <PinnedStation
      domId="collegeos-station"
      caption={
        <div className="flex items-end justify-between">
          <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/30">
            Scroll to open the console
          </p>
          <p className="font-mono text-[10px] tracking-[0.3em] uppercase" style={{ color: accent }}>
            CollegeOS
          </p>
        </div>
      }
    >
      {(progress) => <CollegeOSCanvas progressRef={progress} accent={accent} />}
    </PinnedStation>
  );
}
