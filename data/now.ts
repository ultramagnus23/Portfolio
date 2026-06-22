// Edit this file to update the "Now" section. It drives both the homepage
// strip and the /now page. Change `lastUpdated` whenever you touch it.

export const nowLastUpdated = "June 2026";

export interface NowItem {
  heading: string;
  content: string;
}

export const now: NowItem[] = [
  {
    heading: "Building",
    content:
      "CollegeOS toward launch — canonical schema stable, pgvector recommendations and the chancing service wired up. Meza's analytics engines running against real POS data.",
  },
  {
    heading: "Researching",
    content:
      "Writing up the HoloForge degradation study toward an arXiv preprint. Next experiment: gradient-descent phase retrieval (PyTorch autograd) vs Gerchberg-Saxton.",
  },
  {
    heading: "Studying",
    content:
      "Year 1 CS + Entrepreneurship at Ashoka. Discrete maths, recurrences, and Kleppmann's DDIA on replication and consistency.",
  },
  {
    heading: "Thinking about",
    content:
      "Where physical metrics stop predicting what people actually perceive — in holograms, and in products.",
  },
  {
    heading: "Not doing",
    content: "LeetCode grind. Sitting still. Shipping things I can't explain.",
  },
];

// Short phrases for the scrolling "Currently" marquee.
export const nowMarquee: string[] = [
  "CollegeOS → launch prep",
  "Meza analytics build",
  "HoloForge preprint in progress",
  "Y1 CS @ Ashoka",
  "Reading: Kleppmann DDIA",
  "Phase retrieval: GS vs gradient descent",
];
