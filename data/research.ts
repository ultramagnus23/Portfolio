// The Research section is its own thing — not buried under Projects.
// Update `status` as the paper progresses. Be honest: it's a preprint in
// progress, not published. Don't imply otherwise.

export const research = {
  title: "Perception-Driven Computational Holography",
  repo: "https://github.com/ultramagnus23/HoloForge",
  // Plain-language framing of the actual research question.
  question:
    "When you degrade a hologram — fewer pixels, coarser phase, a narrower viewing angle — does it actually look worse to a person, or does it just measure worse on the usual physics metrics?",
  premise:
    "Holographic-display research tends to optimise for physical fidelity (PSNR, SSIM). But a viewer doesn't see a number — they see an image. HoloForge simulates a phase-only holographic display end to end, then degrades it one axis at a time to find where physical and perceptual quality stop agreeing. Those divergence points are where real display-engineering budget should go.",
  // status line — edit as the work progresses
  statusLabel: "Part 1 preprint out · Part 2 in progress",
  status:
    "Simulation framework and degradation sweeps complete, with Part 1 released as a preprint (arXiv / Optica Open). Part 2 is in progress — a media-in-the-loop model with a differentiable photopolymer recording step, plus a gradient-descent phase-retrieval baseline.",
  methods: [
    {
      name: "Angular-Spectrum propagation",
      detail: "Exact scalar diffraction — how the field actually travels from the SLM plane to the eye.",
      state: "built" as const,
    },
    {
      name: "Gerchberg-Saxton phase retrieval",
      detail: "Iterative alternation between SLM and image planes to design the phase pattern.",
      state: "built" as const,
    },
    {
      name: "Gradient-descent retrieval (PyTorch autograd)",
      detail: "Differentiable optimisation of the phase, to benchmark against Gerchberg-Saxton.",
      state: "planned" as const,
    },
  ],
  // Real results pulled from the experiment runner's metrics_summary.csv.
  findings: [
    { axis: "Phase quantization", setting: "2-bit", ssim: 0.93, note: "Holds up far better than naive PSNR suggests" },
    { axis: "Phase quantization", setting: "1-bit", ssim: 0.003, note: "A true cliff — the system collapses" },
    { axis: "Viewing angle", setting: "25% bandwidth", ssim: 0.97, note: "Near-lossless down to a quarter aperture" },
    { axis: "Speckle noise", setting: "σ = 0.2", ssim: 0.998, note: "Perceptually negligible" },
    { axis: "Depth planes", setting: "1 plane", ssim: 0.009, note: "True multi-plane depth matters most" },
  ],
  params: { wavelength: "532 nm", pixelPitch: "8 µm", distance: "15 cm" },
};
