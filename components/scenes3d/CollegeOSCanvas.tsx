"use client";

import { Suspense, useRef, useState, type RefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera, RoundedBox, Html } from "@react-three/drei";
import * as THREE from "three";
import CollegeOSScene from "@/components/scenes/CollegeOSScene";
import { smoothstep, lerp } from "@/components/scene/bands";

function Laptop({ progress, accent }: { progress: RefObject<number>; accent: string }) {
  const group = useRef<THREE.Group>(null);
  const lid = useRef<THREE.Group>(null);
  const camera = useRef<THREE.PerspectiveCamera>(null);
  const [screenOn, setScreenOn] = useState(false);

  useFrame(() => {
    const p = Math.min(1, Math.max(0, progress.current));

    // Assembly: scales in from 0 as the section is scrolled into view.
    const assembly = smoothstep(0, 0.12, p);
    // Hinge: lid opens from closed (0 rad) to ~100° between 0.1 and 0.4.
    const hingeT = smoothstep(0.1, 0.4, p);
    const hingeAngle = lerp(-Math.PI / 2, -0.08, hingeT); // closed flat against base → open
    // Camera orbit once the lid is open, 0.4 → 0.8.
    const orbitT = smoothstep(0.4, 0.8, p);
    // Outro: whole scene scales/fades out as the station's scroll range ends.
    const outro = 1 - smoothstep(0.85, 1, p);

    if (group.current) {
      const s = assembly * outro;
      group.current.scale.setScalar(THREE.MathUtils.clamp(s, 0.0001, 1));
      group.current.rotation.y = lerp(-0.4, 0, assembly) + orbitT * 0.02;
    }
    if (lid.current) {
      lid.current.rotation.x = hingeAngle;
    }
    if (camera.current) {
      const angle = lerp(0.55, -0.55, orbitT);
      const radius = lerp(4.6, 3.6, orbitT);
      camera.current.position.x = Math.sin(angle) * radius;
      camera.current.position.z = Math.cos(angle) * radius;
      camera.current.position.y = lerp(1.4, 0.9, orbitT);
      camera.current.lookAt(0, 0.15, 0);
    }

    const shouldShowScreen = hingeT > 0.7;
    if (shouldShowScreen !== screenOn) setScreenOn(shouldShowScreen);
  });

  return (
    <>
      <PerspectiveCamera ref={camera} makeDefault position={[0, 1.4, 4.6]} fov={40} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 5, 4]} intensity={1.1} color={accent} />
      <directionalLight position={[-3, 2, -2]} intensity={0.4} color="#5E8CDB" />

      <group ref={group}>
        {/* Base */}
        <RoundedBox args={[2.6, 0.14, 1.7]} radius={0.06} smoothness={4} position={[0, -0.07, 0]}>
          <meshStandardMaterial color="#111412" metalness={0.6} roughness={0.35} />
        </RoundedBox>

        {/* Lid, hinged at the back edge (z = -0.85) */}
        <group position={[0, 0, -0.83]}>
          <group ref={lid} position={[0, 0, 0]}>
            <RoundedBox args={[2.6, 1.7, 0.08]} radius={0.06} smoothness={4} position={[0, 0.85, 0.02]}>
              <meshStandardMaterial color="#111412" metalness={0.6} roughness={0.35} />
            </RoundedBox>
            {/* Screen face */}
            <mesh position={[0, 0.85, 0.065]}>
              <planeGeometry args={[2.34, 1.5]} />
              <meshBasicMaterial color={screenOn ? "#05100a" : "#020302"} />
            </mesh>
            {screenOn && (
              <Html
                transform
                position={[0, 0.85, 0.07]}
                distanceFactor={1.75}
                style={{ width: "560px", pointerEvents: "none" }}
                occlude={false}
              >
                <div style={{ transform: "scale(0.62)", transformOrigin: "top left", width: "900px" }}>
                  <CollegeOSScene accent={accent} />
                </div>
              </Html>
            )}
          </group>
        </group>
      </group>
    </>
  );
}

export default function CollegeOSCanvas({
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
        <Laptop progress={progressRef} accent={accent} />
      </Suspense>
    </Canvas>
  );
}
