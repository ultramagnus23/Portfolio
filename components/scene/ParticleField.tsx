"use client";

import { useMemo, useRef, type RefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useSceneStore } from "@/lib/scrollStore";
import { AudioController } from "@/lib/audio";
import type { PointerState } from "@/hooks/useNormalizedPointer";
import { VERTEX, FRAGMENT } from "./shaders";
import { BANDS, smoothstep, lerp, bandIndex } from "./bands";
import {
  genNoise,
  genOrb,
  genWavefront,
  genLattice,
  genInterference,
  genSingularity,
} from "./targets";

const SIGNAL = new THREE.Color("#00FF94");
const PHASE = new THREE.Color("#5E8CDB");

// A visible presence in every chapter, without competing with the text
// sitting on top of it. Brightest at the hero and the transmission collapse,
// a moderate sustained wash everywhere else — not a faint background hum,
// not a distracting foreground either.
function fieldOpacity(p: number): number {
  const heroToMid = lerp(0.7, 0.32, smoothstep(0.14, 0.26, p)); // bright hero → clear mid
  const systemsBump = lerp(0, 0.08, smoothstep(0.38, 0.48, p)) * (1 - smoothstep(0.6, 0.65, p));
  const researchBump = lerp(0, 0.15, smoothstep(0.63, 0.72, p)) * (1 - smoothstep(0.82, 0.9, p));
  const collapse = smoothstep(0.9, 0.95, p) * lerp(1, 0, smoothstep(0.95, 1, p)); // brief flare, then out
  const outro = 1 - smoothstep(0.9, 1, p);
  const base = Math.max(heroToMid, 0.28) + systemsBump + researchBump;
  return base * outro + collapse * 0.65;
}

interface ParticleFieldProps {
  count: number;
  pointer: RefObject<PointerState>;
}

export default function ParticleField({ count, pointer }: ParticleFieldProps) {
  const { viewport } = useThree();
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const lastChapter = useRef(-1);
  const entranceStart = useRef<number | null>(null);
  const workColor = useRef(new THREE.Color());
  const accentColor = useRef(new THREE.Color());

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const randoms = new Float32Array(count);
    for (let i = 0; i < count; i++) randoms[i] = Math.random();

    // Scroll arc rests on a coherent formation at every chapter boundary:
    // orb (arrival) → wavefront (reconstruction) → lattice (systems) →
    // interference (research) → singularity (transmission) → dispersed away.
    // Noise is NOT in the scroll arc — it's the one-time entrance seed the
    // field reconstructs from as the loader lifts (uEntrance in the shader).
    geo.setAttribute("aNoise", new THREE.BufferAttribute(genNoise(count), 3));
    geo.setAttribute("aP0", new THREE.BufferAttribute(genOrb(count), 3));
    geo.setAttribute("aP1", new THREE.BufferAttribute(genWavefront(count), 3));
    geo.setAttribute("aP2", new THREE.BufferAttribute(genLattice(count), 3));
    geo.setAttribute("aP3", new THREE.BufferAttribute(genInterference(count), 3));
    geo.setAttribute("aP4", new THREE.BufferAttribute(genSingularity(count), 3));
    geo.setAttribute("aP5", new THREE.BufferAttribute(genNoise(count), 3));
    geo.setAttribute("aRandom", new THREE.BufferAttribute(randoms, 1));
    // "position" is required by Three for bounds/culling; the vertex shader
    // ignores it and computes gl_Position from the aP* buffers instead.
    geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(count * 3), 3));
    return geo;
  }, [count]);

  // Built once and mutated in the frame loop — a stable object identity keeps
  // R3F from reconciling (and dropping keys from) the uniforms each render.
  const uniforms = useMemo(
    () => ({
      uStage: { value: 0 },
      uLocalT: { value: 0 },
      uTime: { value: 0 },
      uPulse: { value: 0 },
      uEntrance: { value: 0 },
      uMouse: { value: new THREE.Vector3(9999, 9999, 0) },
      uMouseActive: { value: 0 },
      uPixelRatio: {
        value: typeof window !== "undefined" ? Math.min(window.devicePixelRatio, 2) : 1,
      },
      uColor: { value: new THREE.Color("#00FF94") },
      uOpacity: { value: 0 },
    }),
    []
  );

  useFrame((state) => {
    const mat = materialRef.current;
    if (!mat) return;

    const { progress, activeAccent } = useSceneStore.getState();
    const p = Math.min(1, Math.max(0, progress));
    const stage = bandIndex(p);
    const localT = smoothstep(BANDS[stage], BANDS[stage + 1], p);

    if (stage !== lastChapter.current) {
      lastChapter.current = stage;
      AudioController.instance.setChapter(stage + 1);
    }

    const colorT = smoothstep(0.67, 0.8, p);
    workColor.current.copy(SIGNAL).lerp(PHASE, colorT);
    if (activeAccent && p > BANDS[2] && p < BANDS[3]) {
      accentColor.current.set(activeAccent);
      workColor.current.lerp(accentColor.current, 0.55);
    }

    // One-time entrance: reconstruct from the noise seed into the orb over
    // ~2.6s as the loader lifts. Runs on wall-clock from first frame so it's
    // independent of scroll.
    if (entranceStart.current === null) entranceStart.current = state.clock.elapsedTime;
    const entrance = Math.min(1, (state.clock.elapsedTime - entranceStart.current) / 2.6);

    // Pulse peaks in the middle of each band's morph, so transitions arrive as
    // a swell of light + scatter rather than a smooth slide between formations.
    const pulse = Math.sin(localT * Math.PI);

    const mx = pointer.current.active ? (pointer.current.x * viewport.width) / 2 : 9999;
    const my = pointer.current.active ? (pointer.current.y * viewport.height) / 2 : 9999;

    mat.uniforms.uStage.value = stage;
    mat.uniforms.uLocalT.value = localT;
    mat.uniforms.uTime.value = state.clock.elapsedTime;
    mat.uniforms.uPulse.value = pulse;
    mat.uniforms.uEntrance.value = entrance;
    mat.uniforms.uMouse.value.set(mx, my, 0);
    mat.uniforms.uMouseActive.value = pointer.current.active ? 1 : 0;
    mat.uniforms.uColor.value.copy(workColor.current);
    mat.uniforms.uOpacity.value = fieldOpacity(p);

    // Slow autonomous spin + scroll-linked yaw gives the cloud a sense of
    // physical mass instead of a flat sprite sheet.
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.04 + p * Math.PI * 0.6;
      pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.06;
    }
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={VERTEX}
        fragmentShader={FRAGMENT}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={uniforms}
      />
    </points>
  );
}
