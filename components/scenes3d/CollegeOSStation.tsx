"use client";

import dynamic from "next/dynamic";
import PinnedStation from "./PinnedStation";

const CollegeOSCanvas = dynamic(() => import("./CollegeOSCanvas"), { ssr: false });

export default function CollegeOSStation({ accent }: { accent: string }) {
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
