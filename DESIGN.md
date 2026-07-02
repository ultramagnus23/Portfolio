# DESIGN.md — SIGNAL v2

## Color
- `--color-base`: near-black tinted toward the signal hue (never pure #000).
- `--color-signal`: #00FF94 (signal green) — primary identity color.
- Phase blue #5E8CDB — Research chapter only (canvas + chapter labels).
- Neutrals: white at controlled alphas (white/85 body, #999/#888 secondary,
  #555 tertiary mono). Borders white/10, hover white/[0.02] fills.
- Strategy: Committed — signal green carries identity on a drenched dark field.

## Typography
- Display: Clash Display 500/600/700 (Fontshare). Headings, project titles.
- Body: Instrument Sans 400/500. leading-relaxed to leading-[1.8].
- Mono: system mono for telemetry: eyebrows, metrics, labels.
  Pattern: `font-mono text-[10px] tracking-[0.3em] uppercase`.
- Hero: clamp-based display sizes; chapter headings text-5xl/6xl.

## Motion
- Framer Motion for entrances (fade + small y, 0.3–0.6s, ease-out).
- Scroll: CSS sticky pinning + useScroll progress driving a fixed canvas.
- ScrambleText: decode-from-noise reveal on mount/in-view.
- Respect prefers-reduced-motion everywhere (usePrefersReducedMotion hook).

## Signature elements
- WavefrontCanvas: fixed dot-matrix interference field, 5-chapter state machine
  driven by progressRef (0–1), green→blue shift at research chapter.
- Custom cursor (fine pointers only).
- Grain overlay at 3.5% opacity.
- Chapter labels: `NN — Name` mono eyebrows; sticky chapter bars on ch3–5.

## Layout
- Full-bleed sections, px-6 md:px-16 gutters, py-24 rhythm with border-t
  white/10 separators. No cards where a list works; nested cards banned.
