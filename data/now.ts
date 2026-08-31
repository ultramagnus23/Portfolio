// Edit this file to update the "Now" section. It drives both the homepage
// strip and the /now page. Change `lastUpdated` whenever you touch it.

export const nowLastUpdated = "August 2026";

export interface NowItem {
  heading: string;
  content: string;
}

export const now: NowItem[] = [
  {
    heading: "Working",
    content:
      "Product Strategy Manager at Techmin, Ashoka. Shaping product strategy and roadmap decisions for Techmin.",
  },
  {
    heading: "Building",
    content:
      "CollegeOS live, chancing service and recommendation pipeline wired against real applicant data. Meza's data-quality engines validated on a sample slice, not yet on real restaurant data.",
  },
  {
    heading: "Researching",
    content:
      "Part 1 of the HoloForge degradation study is out as an Optica Open preprint. Part 2, a differentiable photopolymer twin in the CGH loop, is at submission. Next experiment: gradient-descent phase retrieval (PyTorch autograd) vs Gerchberg-Saxton.",
  },
  {
    heading: "Studying",
    content:
      "Year 2 CS + Entrepreneurship at Ashoka. Discrete maths, recurrences, and Kleppmann's DDIA on replication and consistency.",
  },
  {
    heading: "Thinking about",
    content:
      "Where physical metrics stop predicting what people actually perceive, in holograms, and in products.",
  },
  {
    heading: "Not doing",
    content: "LeetCode grind. Sitting still. Shipping things I can't explain.",
  },
];

// Short phrases for the scrolling "Currently" marquee.
export const nowMarquee: string[] = [
  "CollegeOS live",
  "Meza sample-validated",
  "HoloForge preprint out",
  "Y2 CS @ Ashoka",
  "Reading: Kleppmann DDIA",
  "Phase retrieval: GS vs gradient descent",
];
