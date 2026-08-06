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

/** A coherent glowing orb — the signal, found. Kept as a fallback shape for
 *  environments without canvas text rasterisation (SSR / test contexts). */
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
 * The particle field's brand mark — "CT." rasterised to an offscreen canvas
 * and sampled into a point cloud, so the arrival formation reads as the
 * signature, not a generic shape. Deliberately not crisp: curl-noise
 * displacement in the vertex shader (and a coarse sample step here) keep it
 * soft enough to be a background presence rather than literal text — you
 * can tell it's CT without it competing with the copy on top of it.
 * Chapter 1: Arrival.
 */
export function genCT(count: number): Float32Array {
  const out = new Float32Array(count * 3);
  if (typeof document === "undefined") return genOrb(count);

  const W = 960;
  const H = 440;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return genOrb(count);

  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "700 300px Arial, sans-serif";
  ctx.fillText("CT", W / 2 - 30, H / 2);
  // The trailing dot from the "ct." wordmark in the site header.
  ctx.beginPath();
  ctx.arc(W / 2 + 268, H / 2 + 118, 20, 0, Math.PI * 2);
  ctx.fill();

  const { data } = ctx.getImageData(0, 0, W, H);
  const points: number[] = []; // flat [x0,y0,x1,y1,...] pixel coords
  const step = 3;
  for (let y = 0; y < H; y += step) {
    for (let x = 0; x < W; x += step) {
      if (data[(y * W + x) * 4 + 3] > 128) {
        points.push(x, y);
      }
    }
  }
  const samples = points.length / 2;
  if (samples === 0) return genOrb(count);

  for (let i = 0; i < count; i++) {
    const s = Math.floor(Math.random() * samples) * 2;
    const px = points[s];
    const py = points[s + 1];
    // Pixel space -> world space, centered, canvas-y (down) flipped to world-y (up).
    out[i * 3] = (px / W - 0.5) * 9 + rand(-0.04, 0.04);
    out[i * 3 + 1] = -(py / H - 0.5) * 4.1 + rand(-0.04, 0.04);
    out[i * 3 + 2] = rand(-0.35, 0.35);
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
