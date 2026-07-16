"use client";

import { Suspense, useMemo, useRef, type RefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { smoothstep, lerp } from "@/components/scene/bands";

// Mirrors the TABLES shape in components/scenes/MezaScene.tsx — a restaurant
// floor of tables with varying seat counts and occupancy, laid out in a grid.
const TABLES = [
  { seats: 4, occ: 4 },
  { seats: 2, occ: 2 },
  { seats: 6, occ: 3 },
  { seats: 4, occ: 0 },
  { seats: 2, occ: 2 },
  { seats: 4, occ: 4 },
  { seats: 6, occ: 5 },
  { seats: 2, occ: 0 },
  { seats: 4, occ: 3 },
  { seats: 2, occ: 2 },
];
const COLS = 5;
const SPACING = 1.1;

function Floor({ progress, accent }: { progress: RefObject<number>; accent: string }) {
  const camera = useRef<THREE.PerspectiveCamera>(null);
  const seatsRef = useRef<THREE.InstancedMesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  const seatSlots = useMemo(() => {
    const slots: { x: number; z: number; lit: boolean }[] = [];
    TABLES.forEach((t, i) => {
      const col = i % COLS;
      const row = Math.floor(i / COLS);
      const cx = (col - (COLS - 1) / 2) * SPACING;
      const cz = row * SPACING - SPACING / 2;
      for (let s = 0; s < t.seats; s++) {
        const angle = (s / t.seats) * Math.PI * 2;
        slots.push({
          x: cx + Math.cos(angle) * 0.28,
          z: cz + Math.sin(angle) * 0.28,
          lit: s < t.occ,
        });
      }
    });
    return slots;
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const litColor = useMemo(() => new THREE.Color(accent), [accent]);
  const dimColor = useMemo(() => new THREE.Color("#333").multiplyScalar(0.4), []);

  useFrame(() => {
    const p = Math.min(1, Math.max(0, progress.current));
    const assembly = smoothstep(0, 0.15, p);
    const outro = 1 - smoothstep(0.85, 1, p);
    const litT = smoothstep(0.2, 0.55, p);
    const craneT = smoothstep(0.15, 0.75, p);

    if (groupRef.current) {
      groupRef.current.scale.setScalar(THREE.MathUtils.clamp(assembly * outro, 0.0001, 1));
    }

    if (camera.current) {
      // Crane down from a high oblique angle to a lower, closer survey shot.
      camera.current.position.y = lerp(4.4, 1.8, craneT);
      camera.current.position.z = lerp(4.6, 3.0, craneT);
      camera.current.position.x = Math.sin(craneT * Math.PI * 0.4) * 0.8;
      camera.current.lookAt(0, 0, 0);
    }

    if (seatsRef.current) {
      seatSlots.forEach((seat, i) => {
        dummy.position.set(seat.x, 0.05, seat.z);
        const lightUp = seat.lit && litT > i / seatSlots.length;
        dummy.scale.setScalar(lightUp ? 1 : 0.6);
        dummy.updateMatrix();
        seatsRef.current!.setMatrixAt(i, dummy.matrix);
        seatsRef.current!.setColorAt(i, lightUp ? litColor : dimColor);
      });
      seatsRef.current.instanceMatrix.needsUpdate = true;
      if (seatsRef.current.instanceColor) seatsRef.current.instanceColor.needsUpdate = true;
    }
  });

  return (
    <>
      <PerspectiveCamera ref={camera} makeDefault position={[0, 4.4, 4.6]} fov={42} />
      <ambientLight intensity={0.55} />
      <directionalLight position={[2, 5, 3]} intensity={1} color={accent} />

      <group ref={groupRef}>
        {/* Floor plane */}
        <RoundedBox args={[6, 0.06, 4.4]} radius={0.03} smoothness={2} position={[0, -0.1, 0]}>
          <meshStandardMaterial color="#0d0f0e" roughness={0.9} />
        </RoundedBox>

        {/* Tables */}
        {TABLES.map((t, i) => {
          const col = i % COLS;
          const row = Math.floor(i / COLS);
          const cx = (col - (COLS - 1) / 2) * SPACING;
          const cz = row * SPACING - SPACING / 2;
          return (
            <mesh key={i} position={[cx, 0, cz]}>
              <cylinderGeometry args={[0.16, 0.16, 0.06, 16]} />
              <meshStandardMaterial color="#1c1f1d" roughness={0.6} />
            </mesh>
          );
        })}

        {/* Seats — instanced, colored by occupancy */}
        <instancedMesh ref={seatsRef} args={[undefined, undefined, seatSlots.length]}>
          <sphereGeometry args={[0.045, 8, 8]} />
          <meshStandardMaterial roughness={0.4} />
        </instancedMesh>
      </group>
    </>
  );
}

export default function MezaCanvas({ progressRef, accent }: { progressRef: RefObject<number>; accent: string }) {
  return (
    <Canvas
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ position: "absolute", inset: 0 }}
    >
      <Suspense fallback={null}>
        <Floor progress={progressRef} accent={accent} />
      </Suspense>
    </Canvas>
  );
}
