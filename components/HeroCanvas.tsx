"use client";

import { useEffect, useRef } from "react";

export default function HeroCanvas() {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    let renderer: import("three").WebGLRenderer | null = null;
    let animFrameId: number;

    const PARTICLE_COUNT = typeof window !== "undefined" && window.innerWidth < 768 ? 800 : 3000;
    const SIGNAL_NODES: [number, number, number][] = [
      [0, 0, 0],
      [3, 2, -2],
      [-3, -1, -3],
      [2, -3, -1],
      [-2, 3, -4],
    ];

    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const velocities = new Float32Array(PARTICLE_COUNT * 3);
    const mouse = { x: 0, y: 0 };
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

    const init = async () => {
      const THREE = await import("three");

      // Check WebGL availability
      try {
        const testCanvas = document.createElement("canvas");
        const gl = testCanvas.getContext("webgl") || testCanvas.getContext("experimental-webgl");
        if (!gl) return;
      } catch {
        return;
      }

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
      camera.position.z = 5;

      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);

      if (canvasRef.current) {
        canvasRef.current.appendChild(renderer.domElement);
      }

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const nodeIdx = Math.floor(Math.random() * SIGNAL_NODES.length);
        const node = SIGNAL_NODES[nodeIdx];
        positions[i * 3] = node[0] + (Math.random() - 0.5) * 4;
        positions[i * 3 + 1] = node[1] + (Math.random() - 0.5) * 4;
        positions[i * 3 + 2] = node[2] + (Math.random() - 0.5) * 4;
        velocities[i * 3] = (Math.random() - 0.5) * 0.002;
        velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.002;
        velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.002;
      }

      const geo = new THREE.SphereGeometry(0.015, 4, 4);
      const mat = new THREE.MeshBasicMaterial({ color: 0x00ff94, transparent: true, opacity: 0.4 });
      const instancedMesh = new THREE.InstancedMesh(geo, mat, PARTICLE_COUNT);
      instancedMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      scene.add(instancedMesh);

      const dummy = new THREE.Object3D();

      if (!isMobile) {
        const handleMouseMove = (e: MouseEvent) => {
          mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
          mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        };
        window.addEventListener("mousemove", handleMouseMove);
      }

      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer?.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener("resize", handleResize);

      const animate = () => {
        animFrameId = requestAnimationFrame(animate);

        camera.position.z -= 0.0005;
        if (camera.position.z < 2) camera.position.z = 5;

        for (let i = 0; i < PARTICLE_COUNT; i++) {
          const ix = i * 3;

          if (!isMobile) {
            const px = positions[ix];
            const py = positions[ix + 1];
            const mx = mouse.x * 5;
            const my = mouse.y * 3;
            const dx = px - mx;
            const dy = py - my;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 2 && dist > 0) {
              const force = ((2 - dist) / 2) * 0.003;
              velocities[ix] += (dx / dist) * force;
              velocities[ix + 1] += (dy / dist) * force;
            }
          }

          let minDist = Infinity;
          let nearestNode = SIGNAL_NODES[0];
          for (const node of SIGNAL_NODES) {
            const dx = positions[ix] - node[0];
            const dy = positions[ix + 1] - node[1];
            const dz = positions[ix + 2] - node[2];
            const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
            if (d < minDist) {
              minDist = d;
              nearestNode = node;
            }
          }

          const attractStrength = 0.0001;
          velocities[ix] += (nearestNode[0] - positions[ix]) * attractStrength;
          velocities[ix + 1] += (nearestNode[1] - positions[ix + 1]) * attractStrength;
          velocities[ix + 2] += (nearestNode[2] - positions[ix + 2]) * attractStrength;

          velocities[ix] *= 0.99;
          velocities[ix + 1] *= 0.99;
          velocities[ix + 2] *= 0.99;

          positions[ix] += velocities[ix];
          positions[ix + 1] += velocities[ix + 1];
          positions[ix + 2] += velocities[ix + 2];

          dummy.position.set(positions[ix], positions[ix + 1], positions[ix + 2]);
          dummy.updateMatrix();
          instancedMesh.setMatrixAt(i, dummy.matrix);
        }

        instancedMesh.instanceMatrix.needsUpdate = true;
        renderer?.render(scene, camera);
      };

      animate();
    };

    init();

    return () => {
      cancelAnimationFrame(animFrameId);
      if (renderer) {
        renderer.dispose();
        if (canvasRef.current && renderer.domElement.parentNode === canvasRef.current) {
          canvasRef.current.removeChild(renderer.domElement);
        }
      }
    };
  }, []);

  return (
    <div
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      aria-hidden="true"
    />
  );
}
