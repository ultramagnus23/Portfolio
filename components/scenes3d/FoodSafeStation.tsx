"use client";

import dynamic from "next/dynamic";
import PinnedStation from "./PinnedStation";

const FoodSafeCanvas = dynamic(() => import("./FoodSafeCanvas"), { ssr: false });

export default function FoodSafeStation({ accent }: { accent: string }) {
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
