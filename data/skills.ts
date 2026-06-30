export interface Skill {
  name: string;
  level: "strong" | "learning" | "medium" | "done";
  /** Slugs of case-study projects that use this skill */
  usedInSlugs: string[];
  /** What this skill does in the actual work — shown on expand */
  what: string;
}

export const skills: Record<string, Skill[]> = {
  languages: [
    {
      name: "Python",
      level: "strong",
      usedInSlugs: ["foodsafe-india", "holoforge"],
      what: "Data pipelines (FoodSafe), wave-optics simulation (HoloForge), ML model training.",
    },
    {
      name: "TypeScript",
      level: "strong",
      usedInSlugs: ["collegeos", "meza"],
      what: "Primary language across all current product work — CollegeOS and Meza front-end and API.",
    },
    {
      name: "JavaScript",
      level: "strong",
      usedInSlugs: [],
      what: "Earlier projects and glue code. TypeScript is the default now.",
    },
    {
      name: "Java",
      level: "learning",
      usedInSlugs: [],
      what: "Learning through coursework. Not yet used in shipped projects.",
    },
    {
      name: "HTML",
      level: "strong",
      usedInSlugs: [],
      what: "Semantic markup, accessibility, structure. Strong baseline.",
    },
    {
      name: "CSS",
      level: "strong",
      usedInSlugs: [],
      what: "Layout, animation, responsive design. Comfortable with the full cascade.",
    },
  ],
  frameworks: [
    {
      name: "React",
      level: "strong",
      usedInSlugs: ["collegeos", "foodsafe-india"],
      what: "Component model for CollegeOS and FoodSafe India's exploration SPA.",
    },
    {
      name: "Next.js",
      level: "learning",
      usedInSlugs: [],
      what: "App Router, Server Components, static generation — this portfolio is the primary exercise.",
    },
    {
      name: "Node.js",
      level: "strong",
      usedInSlugs: ["collegeos", "meza"],
      what: "API server for CollegeOS (chancing service, recommendation engine) and Meza.",
    },
    {
      name: "Express",
      level: "strong",
      usedInSlugs: ["collegeos"],
      what: "REST API layer for CollegeOS. Routing, middleware, auth.",
    },
    {
      name: "FastAPI",
      level: "learning",
      usedInSlugs: ["foodsafe-india", "meza"],
      what: "8 API routers in FoodSafe India; ML service layer in Meza.",
    },
    {
      name: "Framer Motion",
      level: "learning",
      usedInSlugs: [],
      what: "Scroll-driven animation for this portfolio's 5-chapter arc.",
    },
  ],
  databases: [
    {
      name: "PostgreSQL",
      level: "strong",
      usedInSlugs: ["collegeos", "meza", "foodsafe-india"],
      what: "Primary database across all current projects. Complex schemas, joins, window functions.",
    },
    {
      name: "Supabase",
      level: "learning",
      usedInSlugs: ["collegeos"],
      what: "Managed Postgres + auth for CollegeOS. Row-level security, real-time subscriptions.",
    },
    {
      name: "Prisma",
      level: "learning",
      usedInSlugs: ["meza"],
      what: "ORM for Meza's local dev workflow. Schema-first with SQLite, designed to migrate to Postgres.",
    },
    {
      name: "SQLite",
      level: "done",
      usedInSlugs: [],
      what: "Early prototyping. Replaced by Postgres in production schemas.",
    },
  ],
  mlAndData: [
    {
      name: "scikit-learn",
      level: "learning",
      usedInSlugs: ["foodsafe-india", "holoforge"],
      what: "Random Forest district-risk model (FoodSafe), metrics pipeline (HoloForge).",
    },
    {
      name: "Apache Airflow",
      level: "learning",
      usedInSlugs: ["foodsafe-india"],
      what: "DAG orchestration for FoodSafe's three source ingestion cadences (daily + weekly).",
    },
    {
      name: "spaCy",
      level: "learning",
      usedInSlugs: ["foodsafe-india"],
      what: "NER extraction of contaminant names, quantities, and districts from FSSAI PDFs.",
    },
    {
      name: "Tesseract OCR",
      level: "learning",
      usedInSlugs: ["foodsafe-india"],
      what: "PDF → text extraction for scanned government enforcement records.",
    },
    {
      name: "NumPy / SciPy",
      level: "learning",
      usedInSlugs: ["holoforge"],
      what: "Angular-Spectrum wave propagation and Gerchberg-Saxton phase retrieval — HoloForge core.",
    },
    {
      name: "ML pipelines",
      level: "learning",
      usedInSlugs: ["foodsafe-india"],
      what: "End-to-end pipelines: ingest → clean → score → serve.",
    },
    {
      name: "Probability calibration",
      level: "learning",
      usedInSlugs: ["collegeos"],
      what: "Chancing model in CollegeOS — maps score distributions to admit-probability buckets.",
    },
    {
      name: "Web scraping",
      level: "strong",
      usedInSlugs: ["collegeos"],
      what: "CollegeOS scraper framework: retries, batching, schema validation, Playwright-backed where JS is required.",
    },
    {
      name: "Computer vision",
      level: "learning",
      usedInSlugs: [],
      what: "Facial recognition for Orenth's checkpoint layer. Ongoing interest.",
    },
  ],
  concepts: [
    {
      name: "REST APIs",
      level: "strong",
      usedInSlugs: ["collegeos", "meza", "foodsafe-india"],
      what: "Designed and shipped APIs for all three current projects.",
    },
    {
      name: "OAuth",
      level: "strong",
      usedInSlugs: ["collegeos"],
      what: "Auth layer for CollegeOS — Google SSO, JWT session management.",
    },
    {
      name: "System design",
      level: "learning",
      usedInSlugs: ["collegeos", "meza"],
      what: "Canonical schema design, service decomposition, multi-source deduplication.",
    },
  ],
  creative: [
    {
      name: "Figma",
      level: "strong",
      usedInSlugs: [],
      what: "Interface design, prototyping, and component libraries.",
    },
    {
      name: "Adobe Premiere Pro",
      level: "strong",
      usedInSlugs: [],
      what: "Video editing, colour grading, export workflows.",
    },
    {
      name: "DaVinci Resolve",
      level: "strong",
      usedInSlugs: [],
      what: "Colour-first editing workflow for higher-quality grading.",
    },
    {
      name: "FL Studio",
      level: "medium",
      usedInSlugs: [],
      what: "Music production. The waveform in this portfolio is loosely inspired by it.",
    },
    {
      name: "Blender",
      level: "medium",
      usedInSlugs: [],
      what: "3D modelling and rendering. Working through harder topology.",
    },
    {
      name: "Git",
      level: "strong",
      usedInSlugs: [],
      what: "Daily driver. Branch strategy, conflict resolution, large diffs.",
    },
  ],
};

/** Flat list of all skills */
export const allSkills: Skill[] = Object.values(skills).flat();
