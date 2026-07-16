"use client";

import { Suspense, useMemo, useRef, type RefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import { smoothstep, lerp } from "@/components/scene/bands";

// Mirrors DISTRICTS/riskColor in components/scenes/FoodSafeScene.tsx —
// deterministic pseudo-random risk scores feeding a district grid.
function hash(i: number) {
  return ((i * 9301 + 49297) % 233280) / 233280;
}
const DISTRICTS = Array.from({ length: 24 }, (_, i) => hash(i * 7 + 3));
const GRID_COLS = 6;
const CELL = 0.32;

function riskColor(r: number, accent: string): THREE.Color {
  if (r < 0.4) return new THREE.Color("#00FF94");
  if (r < 0.7) return new THREE.Color(accent);
  return new THREE.Color("#FF4D4D");
}

function Pipeline({ progress, accent }: { progress: RefObject<number>; accent: string }) {
  const camera = useRef<THREE.PerspectiveCamera>(null);
  const groupRef = useRef<THREE.Group>(null);
  const cellsRef = useRef<THREE.InstancedMesh>(null);
  const docsRef = useRef<THREE.Group>(null);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const colors = useMemo(() => DISTRICTS.map((r) => riskColor(r, accent)), [accent]);

  useFrame((state) => {
    const p = Math.min(1, Math.max(0, progress.current));
    const assembly = smoothstep(0, 0.15, p);
    const outro = 1 - smoothstep(0.85, 1, p);
    const pushT = smoothstep(0.1, 0.85, p);
    const revealT = smoothstep(0.3, 0.7, p);

    if (groupRef.current) {
      groupRef.current.scale.setScalar(THREE.MathUtils.clamp(assembly * outro, 0.0001, 1));
    }

    if (camera.current) {
      // Push through the pipeline: documents (z≈2) → grid (z≈-1.5).
      camera.current.position.z = lerp(4.2, -0.6, pushT);
      camera.current.position.y = lerp(0.6, 0.9, pushT);
      camera.current.lookAt(0, 0, lerp(1, -1.5, pushT));
    }

    if (docsRef.current) {
      docsRef.current.children.forEach((doc, i) => {
        const t = state.clock.elapsedTime * 0.4 + i;
        doc.position.y = 0.9 + Math.sin(t) * 0.03;
      });
    }

    if (cellsRef.current) {
      DISTRICTS.forEach((risk, i) => {
        const col = i % GRID_COLS;
        const row = Math.floor(i / GRID_COLS);
        const x = (col - (GRID_COLS - 1) / 2) * CELL;
        const y = (row - 1.5) * CELL;
        const on = revealT * DISTRICTS.length > i;
        dummy.position.set(x, y, -2.2);
        dummy.scale.setScalar(on ? 1 : 0.001);
        dummy.updateMatrix();
        cellsRef.current!.setMatrixAt(i, dummy.matrix);
        cellsRef.current!.setColorAt(i, colors[i]);
      });
      cellsRef.current.instanceMatrix.needsUpdate = true;
      if (cellsRef.current.instanceColor) cellsRef.current.instanceColor.needsUpdate = true;
    }
  });

  return (
    <>
      <PerspectiveCamera ref={camera} makeDefault position={[0, 0.6, 4.2]} fov={44} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 4, 3]} intensity={1} color={accent} />

      <group ref={groupRef}>
        {/* Source documents */}
        <group ref={docsRef}>
          {["FSSAI", "USFDA", "AGMARK"].map((label, i) => (
            <mesh key={label} position={[(i - 1) * 0.7, 0.9, 1.6]}>
              <planeGeometry args={[0.5, 0.7]} />
              <meshStandardMaterial color="#141715" side={THREE.DoubleSide} />
            </mesh>
          ))}
        </group>

        {/* Feed line */}
        <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.01, 0.01, 3.6, 6]} />
          <meshBasicMaterial color={accent} transparent opacity={0.4} />
        </mesh>

        {/* Risk-district grid */}
        <instancedMesh ref={cellsRef} args={[undefined, undefined, DISTRICTS.length]}>
          <boxGeometry args={[CELL * 0.86, CELL * 0.86, 0.05]} />
          <meshStandardMaterial roughness={0.5} />
        </instancedMesh>
      </group>
    </>
  );
}

export default function FoodSafeCanvas({
  progressRef,
  accent,
}: {
  progressRef: RefObject<number>;
  accent: string;
}) {
  return (
    <Canvas
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ position: "absolute", inset: 0 }}
    >
      <Suspense fallback={null}>
        <Pipeline progress={progressRef} accent={accent} />
      </Suspense>
    </Canvas>
  );
}
