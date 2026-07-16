"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import PinnedStation from "./PinnedStation";

const MezaCanvas = dynamic(() => import("./MezaCanvas"), { ssr: false });

export default function MezaStation({ accent }: { accent: string }) {
  // Warm the chunk on mount — see CollegeOSStation for why.
  useEffect(() => {
    import("./MezaCanvas");
  }, []);

  return (
    <PinnedStation
      domId="meza-station"
      caption={
        <div className="flex items-end justify-between">
          <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/30">
            Anonymous occupancy, seat by seat
          </p>
          <p className="font-mono text-[10px] tracking-[0.3em] uppercase" style={{ color: accent }}>
            Meza
          </p>
        </div>
      }
    >
      {(progress) => <MezaCanvas progressRef={progress} accent={accent} />}
    </PinnedStation>
  );
}
