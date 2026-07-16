// Vertex shader morphs between two of the six precomputed target buffers
// (aP0..aP5) based on a uniform stage index + local blend factor, with a
// per-particle random stagger so the reconstruction settles organically
// rather than snapping. A uPulse uniform swells point size + brightness in
// the middle of each morph so chapter transitions read as a burst of light,
// not a smooth slide. Fragment shader is a soft additive dot.

export const VERTEX = /* glsl */ `
  uniform int uStage;
  uniform float uLocalT;
  uniform float uTime;
  uniform float uPulse;
  uniform float uEntrance;
  uniform vec3 uMouse;
  uniform float uMouseActive;
  uniform float uPixelRatio;

  attribute vec3 aNoise;
  attribute vec3 aP0;
  attribute vec3 aP1;
  attribute vec3 aP2;
  attribute vec3 aP3;
  attribute vec3 aP4;
  attribute vec3 aP5;
  attribute float aRandom;

  varying float vAlpha;
  varying float vSettle;
  varying float vGlow;

  vec3 curl(vec3 p, float t) {
    float x = sin(p.y * 1.4 + t) * cos(p.z * 1.1 - t * 0.7);
    float y = sin(p.z * 1.3 - t * 0.9) * cos(p.x * 1.2 + t * 0.5);
    float z = sin(p.x * 1.5 + t * 0.6) * cos(p.y * 1.4 - t);
    return vec3(x, y, z);
  }

  void main() {
    vec3 posA;
    vec3 posB;
    if (uStage == 0) { posA = aP0; posB = aP1; }
    else if (uStage == 1) { posA = aP1; posB = aP2; }
    else if (uStage == 2) { posA = aP2; posB = aP3; }
    else if (uStage == 3) { posA = aP3; posB = aP4; }
    else { posA = aP4; posB = aP5; }

    float local = clamp((uLocalT - aRandom * 0.5) / (1.0 - aRandom * 0.5), 0.0, 1.0);
    float eased = local * local * (3.0 - 2.0 * local);

    vec3 pos = mix(posA, posB, eased);

    // Mid-flight particles bow outward along their arc, so a morph looks like
    // an exploding-and-reforming burst rather than points sliding on rails.
    float flight = sin(eased * 3.14159);
    pos += curl(posA * 0.4 + posB * 0.2, uTime * 0.2 + aRandom * 10.0) * flight * (0.55 + uPulse * 1.5);

    // gentle idle breathing once settled
    pos.z += (1.0 - flight) * sin(uTime * 0.6 + aRandom * 20.0) * 0.03;

    // One-time entrance: reconstruct from the noise seed into the scroll
    // formation, per-particle staggered so it resolves like a signal locking in.
    float entLocal = clamp((uEntrance - aRandom * 0.4) / (1.0 - aRandom * 0.4), 0.0, 1.0);
    float entE = entLocal * entLocal * (3.0 - 2.0 * entLocal);
    pos = mix(aNoise, pos, entE);
    float entranceGlow = (1.0 - entE);

    if (uMouseActive > 0.5) {
      vec2 d = pos.xy - uMouse.xy;
      float dist = length(d);
      float radius = 2.0;
      if (dist < radius) {
        float force = (1.0 - dist / radius);
        force = force * force * 1.1;
        pos.xy += normalize(d + 0.0001) * force;
      }
    }

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // glow = how "in transit" this particle is (morph pulse + entrance flare)
    vGlow = flight * uPulse + entranceGlow * 0.7;

    float sizeBase = mix(1.1, 1.7, eased) + vGlow * 0.8;
    // Hard cap keeps a transition burst from spawning huge sprites that peg
    // fill rate (and stall software-WebGL fallbacks) during the flare.
    gl_PointSize = min(sizeBase * uPixelRatio * (9.0 / -mvPosition.z), 5.0);

    vAlpha = mix(0.22, 0.6, eased) + vGlow * 0.3;
    vSettle = eased;
  }
`;

export const FRAGMENT = /* glsl */ `
  precision mediump float;
  uniform vec3 uColor;
  uniform float uOpacity;
  varying float vAlpha;
  varying float vSettle;
  varying float vGlow;

  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if (d > 0.5) discard;
    float glow = smoothstep(0.5, 0.15, d);
    float core = smoothstep(0.12, 0.0, d) * vSettle;
    // in-transit particles flare toward white so a morph reads as a spark burst
    vec3 col = mix(uColor, vec3(1.0), vGlow * 0.6) + core * 0.2;
    gl_FragColor = vec4(col, glow * vAlpha * uOpacity * 0.5);
  }
`;
