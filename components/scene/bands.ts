// Shared chapter progress boundaries. Mirrors the 5 sticky DOM chapters in
// app/page.tsx exactly — Arrival / Reconstruction / Systems / Research /
// Transmission — so the particle field, the camera rig, and the scroll-pinned
// copy all agree on where each chapter starts and ends.
export const BANDS = [0, 0.2, 0.4, 0.65, 0.85, 1.0];

export function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function bandIndex(p: number): number {
  for (let i = 0; i < BANDS.length - 2; i++) {
    if (p < BANDS[i + 1]) return i;
  }
  return BANDS.length - 2;
}
