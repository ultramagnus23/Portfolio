// Procedural point-cloud target generators for the reconstruction engine.
// Each chapter of the scroll arc morphs the particle field between two of
// these formations. All generators return a flat Float32Array of x,y,z
// triples, count*3 long.

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

/** Diffuse scatter shell — the "noise" the signal has to emerge from. */
export function genNoise(count: number): Float32Array {
  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = rand(5, 9);
    const theta = rand(0, Math.PI * 2);
    const phi = Math.acos(rand(-1, 1));
    out[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    out[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    out[i * 3 + 2] = r * Math.cos(phi) * 0.6 - 2;
  }
  return out;
}

/** A coherent glowing orb — the signal, found. Chapter 1: Arrival. */
export function genOrb(count: number): Float32Array {
  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = rand(1.5, 2.1);
    const theta = rand(0, Math.PI * 2);
    const phi = Math.acos(rand(-1, 1));
    out[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    out[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.85;
    out[i * 3 + 2] = r * Math.cos(phi);
  }
  return out;
}

/**
 * An undulating wavefront sheet — a grid of points warped by two crossing
 * sine waves into a rippling surface tilted toward the camera. On-theme for
 * "reconstruction" (a signal wavefront resolving) and far more alive than a
 * DNA helix. Chapter 2: Reconstruction.
 */
export function genWavefront(count: number): Float32Array {
  const out = new Float32Array(count * 3);
  const side = Math.floor(Math.sqrt(count));
  const extent = 8;
  for (let i = 0; i < count; i++) {
    const gx = i % side;
    const gy = Math.floor(i / side);
    const u = gx / (side - 1) - 0.5;
    const v = gy / (side - 1) - 0.5;
    const x = u * extent;
    const z = v * extent;
    const wave =
      Math.sin(x * 0.9 + z * 0.4) * 0.7 +
      Math.cos(z * 1.1 - x * 0.3) * 0.5 +
      rand(-0.05, 0.05);
    // tilt the sheet so the ripple reads in 3/4 view rather than edge-on
    out[i * 3] = x;
    out[i * 3 + 1] = wave + z * 0.35;
    out[i * 3 + 2] = z * 0.6;
  }
  return out;
}

/** A field of loose node clusters — the systems being built. Chapter 3. */
export function genLattice(count: number): Float32Array {
  const out = new Float32Array(count * 3);
  const nodes = 6;
  const spread = 9;
  for (let i = 0; i < count; i++) {
    const node = i % nodes;
    const cx = (node / (nodes - 1) - 0.5) * spread;
    out[i * 3] = cx + rand(-0.9, 0.9);
    out[i * 3 + 1] = rand(-1.6, 1.6);
    out[i * 3 + 2] = rand(-1.2, 1.2);
  }
  return out;
}

/** Concentric interference rings — the research question, made visible. Chapter 4. */
export function genInterference(count: number): Float32Array {
  const out = new Float32Array(count * 3);
  const rings = 7;
  for (let i = 0; i < count; i++) {
    const ring = i % rings;
    const r = 0.6 + ring * 0.55 + rand(-0.08, 0.08);
    const theta = rand(0, Math.PI * 2);
    out[i * 3] = Math.cos(theta) * r;
    out[i * 3 + 1] = Math.sin(theta) * r * 0.9;
    out[i * 3 + 2] = rand(-0.3, 0.3);
  }
  return out;
}

/** A single transmitted point — the signal, sent. Chapter 5: Transmission. */
export function genSingularity(count: number): Float32Array {
  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = rand(0, 0.12);
    const theta = rand(0, Math.PI * 2);
    const phi = Math.acos(rand(-1, 1));
    out[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    out[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    out[i * 3 + 2] = r * Math.cos(phi);
  }
  return out;
}
