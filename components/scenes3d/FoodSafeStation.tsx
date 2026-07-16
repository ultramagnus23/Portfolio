"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import PinnedStation from "./PinnedStation";

const FoodSafeCanvas = dynamic(() => import("./FoodSafeCanvas"), { ssr: false });

export default function FoodSafeStation({ accent }: { accent: string }) {
  // Warm the chunk on mount — see CollegeOSStation for why.
  useEffect(() => {
    import("./FoodSafeCanvas");
  }, []);

  return (
    <PinnedStation
      domId="foodsafe-station"
      caption={
        <div className="flex items-end justify-between">
          <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/30">
            Documents in, district risk out
          </p>
          <p className="font-mono text-[10px] tracking-[0.3em] uppercase" style={{ color: accent }}>
            FoodSafe
          </p>
        </div>
      }
    >
      {(progress) => <FoodSafeCanvas progressRef={progress} accent={accent} />}
    </PinnedStation>
  );
}
