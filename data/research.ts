// The Research section is its own thing — not buried under Projects.
// Update `part2` as that work progresses. Be honest about its stage.
// Part 1 is genuinely published — link it directly, don't hedge.

export const research = {
  title: "Perception-Driven Computational Holography",
  repo: "https://github.com/ultramagnus23/HoloForge",
  // Plain-language framing of the actual research question.
  question:
    "When you degrade a hologram (fewer pixels, coarser phase, a narrower viewing angle), does it actually look worse to a person, or does it just measure worse on the usual physics metrics?",
  premise:
    "Holographic-display research tends to optimise for physical fidelity (PSNR, SSIM). But a viewer doesn't see a number, they see an image. HoloForge simulates a phase-only holographic display end to end, then degrades it one axis at a time to find where physical and perceptual quality stop agreeing. Those divergence points are where real display-engineering budget should go.",
  part1: {
    title: "Systematic Degradation Analysis in Phase-Only Computational Holography",
    paperUrl:
      "https://preprints.opticaopen.org/articles/preprint/Systematic_Degradation_Analysis_in_Phase-Only_Computational_Holography_A_Simulation_Framework/32874356?file=66233162",
    finding:
      "Physical and perceptual quality diverge hardest at 1-bit phase quantization, a true cliff naive PSNR doesn't warn you about.",
  },
  part2: {
    title: "Media-in-the-loop holography",
    note: "A differentiable photopolymer recording step folded into the CGH optimisation loop, benchmarked against a gradient-descent phase-retrieval baseline.",
    stageLabel: "At submission · sole author",
  },
  validationNote:
    "Every finding here is cross-checked against an oracle baseline before it's trusted, which is how a seed-reuse bug producing byte-identical PSNR across seeds got caught instead of shipped.",
  methods: [
    {
      name: "Angular-Spectrum propagation",
      detail: "Exact scalar diffraction. How the field actually travels from the SLM plane to the eye.",
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
    { axis: "Phase quantization", setting: "1-bit", ssim: 0.003, note: "A true cliff. The system collapses" },
    { axis: "Viewing angle", setting: "25% bandwidth", ssim: 0.97, note: "Near-lossless down to a quarter aperture" },
    { axis: "Speckle noise", setting: "σ = 0.2", ssim: 0.998, note: "Perceptually negligible" },
    { axis: "Depth planes", setting: "1 plane", ssim: 0.009, note: "True multi-plane depth matters most" },
  ],
  params: { wavelength: "532 nm", pixelPitch: "8 µm", distance: "15 cm" },
};
