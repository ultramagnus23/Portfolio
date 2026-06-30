export type ProjectStatus = "live" | "in-progress" | "done" | "planned";
export type ProjectCategory = "current" | "research" | "earlier";

export interface Project {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  status: ProjectStatus;
  category: ProjectCategory;
  year: number;
  accent: string;
  description: string;
  longDescription: string;
  problem: string;
  approach: string;
  /** What is actually built and working today — honest, present-tense. */
  built: string[];
  /** Real, verifiable numbers only. Anything uncertain is omitted, not invented. */
  metrics: { label: string; value: string }[];
  technicalDecisions: string[];
  whatDidntWork: string;
  outcome: string;
  whatIdDoDifferently: string;
  stack: string[];
  github: string;
  liveUrl: string;
  featured: boolean;
  hasCaseStudy: boolean;
}

export const projects: Project[] = [
  {
    id: "01",
    slug: "collegeos",
    title: "CollegeOS",
    tagline: "Admissions is a black box. We're opening it.",
    status: "in-progress",
    category: "current",
    year: 2026,
    accent: "#00FF94",
    description:
      "Global college-discovery and application-intelligence platform. A keyword + trigram recommendation pipeline narrows 8,200+ institutions to high-fit candidates, a Node.js chancing service estimates admit probability, and a Python scraper framework keeps deadlines and requirements current.",
    longDescription:
      "CollegeOS turns the chaos of international applications into a single, legible system. A canonical PostgreSQL/Supabase schema unifies institutions, admissions, financials, outcomes, rankings and deadlines. On top of it sits a multi-stage recommendation pipeline — keyword + trigram retrieval, multi-factor ranking, Reach/Target/Safety/Wildcard diversification, and explainable score breakdowns. pgvector semantic retrieval is on the roadmap once embedding infrastructure is in place. It's the second swing at a problem my first product, CollegeApp, proved was real.",
    problem:
      "Students applying internationally have no reliable signal about fit or chances. Counsellors give vague guidance, lists are generic, and outcomes feel random.",
    approach:
      "Build a canonical data layer first, then layer intelligence on top: keyword + trigram retrieval for fit today (pgvector on the roadmap), a transparent chancing service calibrated on stats-derived simulation, and a scraper framework that keeps data fresh.",
    built: [
      "Canonical PostgreSQL + Supabase schema (11 normalised tables: institutions, admissions, financials, outcomes, rankings, deadlines)",
      "Keyword + trigram retrieval → multi-factor ranking → Reach/Target/Safety/Wildcard diversification with explainability",
      "Node.js chancing service — admit probability calibrated on stats-derived simulation; switches to real labels after 200 real outcomes",
      "Python scraper framework with retries, batching, schema validation (GitHub Actions refresh is gated at org level — scrapers exist, not yet auto-running)",
    ],
    metrics: [
      { label: "Predecessor reach", value: "6,000+ users (CollegeApp)" },
      { label: "Institutions", value: "8,200+ across 8+ countries" },
      { label: "Status", value: "Pre-launch" },
    ],
    technicalDecisions: [
      "Canonical schema over fragmented joins — kill duplicate institution representations before they multiply",
      "Keyword + trigram retrieval now, pgvector planned — ship intelligence that works today, not blocked on embedding infrastructure",
      "Node chancing service over standalone Python — one runtime, simpler deploys at student scale",
      "GitHub Actions for scraping — free, observable, and resumable on partial failure (gated at org level; next step is unblocking the Actions runner)",
    ],
    whatDidntWork:
      "The first stack fragmented fast — duplicate institution rows and separate Flask/FastAPI chancing services that drifted out of sync. Collapsing everything into a canonical schema with one chancing service was the unlock.",
    outcome:
      "Architecture stable pre-launch: canonical schema, recommendation, chancing, and scraper infrastructure all wired. Two open gaps before full v1: unblocking GitHub Actions auto-refresh and replacing keyword retrieval with pgvector once embeddings are in place.",
    whatIdDoDifferently:
      "Design the canonical schema on day one. The migration away from fragmented joins cost real time.",
    stack: ["React", "TypeScript", "Node.js", "Express", "PostgreSQL", "Supabase", "Python", "GitHub Actions"],
    github: "https://github.com/ultramagnus23/CollegeOS",
    liveUrl: "",
    featured: true,
    hasCaseStudy: true,
  },
  {
    id: "02",
    slug: "meza",
    title: "Meza",
    tagline: "Your restaurant has been telling you what to do. You just couldn't hear it.",
    status: "in-progress",
    category: "current",
    year: 2026,
    accent: "#7F77DD",
    description:
      "Restaurant intelligence platform. Raw POS transaction data in, profit-ranked operational decisions out — menu engineering, capacity, channel profitability, price elasticity, server performance, and theft detection, all surfaced as plain-English calls.",
    longDescription:
      "Every transaction is a signal: not just what sold, but when, in what weather, paired with what, after what price change. Meza turns a restaurant's own POS history into a ranked queue of decisions — which dishes are Stars vs Dogs, where the capacity bottleneck is, which delivery channel actually makes money after fees. Currently running against uploaded CSV demo data; in active talks with first pilot restaurant for live POS integration.",
    problem:
      "Small restaurant owners in India have no accessible analytics. Existing tools show what happened; nobody tells them what to do next.",
    approach:
      "A decision engine that scores every dish and channel across multiple signal dimensions, then surfaces prioritised, plain-language recommendations — starting from a simple CSV upload, scaling to live POS integration.",
    built: [
      "Decision engine with impact-ranked, plain-language recommendations across 10+ analytics modules",
      "Menu engineering (Stars/Plowhorses/Puzzles/Dogs) with margin analysis and substitution scoring",
      "RevPASH capacity analysis, channel LTV:CAC, server-effectiveness scoring",
      "Scenario simulator, demand-elasticity model, theft/void detection (Benford's Law), Swiggy/Zomato settlement reconciliation",
      "ARIMA supply-demand forecasting, INR base + 7 currency conversions",
    ],
    metrics: [
      { label: "Analytics modules", value: "10+" },
      { label: "Currencies", value: "INR base + 7 conversions" },
      { label: "Status", value: "In active development — pilot in talks" },
    ],
    technicalDecisions: [
      "Next.js + Express + Python ML service — UI, API and modelling cleanly separated",
      "Prisma + SQLite for fast local iteration; schema designed to migrate to PostgreSQL for production",
      "Base currency INR with real-time conversion — built for the Indian market first",
      "CSV upload before POS APIs — get value to owners without an integration project",
    ],
    whatDidntWork:
      "Schema design is the hard part — every signal you want to capture has to be representable from day one, or you're re-modelling later.",
    outcome:
      "Core analytics engines built and running against uploaded CSV demo data. In active talks with first pilot restaurant; no live POS integration yet — the case study is honest about this. Next: live integration once pilot restaurant is confirmed.",
    whatIdDoDifferently: "Nothing yet — it's early enough to keep designing forward.",
    stack: ["Next.js", "TypeScript", "Express", "Prisma", "Python", "FastAPI", "Recharts"],
    github: "https://github.com/ultramagnus23/Meza",
    liveUrl: "",
    featured: true,
    hasCaseStudy: true,
  },
  {
    id: "03",
    slug: "foodsafe-india",
    title: "FoodSafe India",
    tagline: "The data exists. It's just buried in PDFs.",
    status: "in-progress",
    category: "current",
    year: 2026,
    accent: "#BA7517",
    description:
      "A 4-stage data pipeline turning FSSAI, USFDA, and AGMARKNET enforcement PDFs into a structured PostgreSQL warehouse. FastAPI layer with 8 routers. Three ML models: Random Forest district-risk scoring, Bayesian supply-chain propagation, and Benford's Law fraud detection.",
    longDescription:
      "India's food-safety data is public but unusable: thousands of enforcement PDFs, no structure, no search. FoodSafe runs a four-stage pipeline — OCR + NER to extract records, canonicalisation (contaminant names, values to PPB, districts to Census-2021, dates to ISO), cross-source deduplication, and a confidence score that gates what reaches downstream models. A FastAPI layer with 8 routers exposes the warehouse; three ML models provide analytical layers on top.",
    problem:
      "Consumers and researchers can't see what's actually in regional food supply. The enforcement data is buried in scanned government PDFs.",
    approach:
      "Treat it as a data-engineering problem. Extract from PDFs, standardise relentlessly, deduplicate across sources, attach a confidence score, and layer ML on top for risk, propagation, and fraud signals.",
    built: [
      "Stage 1 — PDF OCR + NER extraction (Tesseract + spaCy)",
      "Stage 2 — canonicalisation: contaminant aliases, values → PPB, districts → Census 2021, dates → ISO 8601",
      "Stage 3/4 — hash-based dedup across sources + confidence scoring (base 0.70 with lab/verification/range adjustments; ≥ 0.75 trust gate)",
      "Airflow DAGs orchestrating 3 source cadences (FSSAI weekly, USFDA daily, AGMARKNET daily)",
      "FastAPI layer: 8 routers (auth, risk, user, search, fmcg, insurance, disputes, admin)",
      "Random Forest district-risk model — ranks districts by contamination likelihood",
      "Bayesian supply-chain propagation graph — traces how a contaminant moves through the supply network",
      "Benford's Law fraud-detection layer — flags statistical anomalies in reported values",
      "React SPA (CDN, no build step) for exploration",
    ],
    metrics: [
      { label: "Pipeline stages", value: "4 (extract → score)" },
      { label: "Trust gate", value: "≥ 0.75 confidence" },
      { label: "Sources", value: "FSSAI · USFDA · AGMARKNET" },
      { label: "API routers", value: "8" },
      { label: "ML models", value: "3 (Risk · Propagation · Fraud)" },
    ],
    technicalDecisions: [
      "Confidence scoring over hard filtering — keep low-trust records, flag them, never silently drop",
      "Canonicalise to Census-2021 districts so contaminant data joins cleanly to geography",
      "Flag cross-source duplicates instead of deleting — provenance matters for a safety dataset",
      "Airflow DAGs per source so each ingest cadence is independent and observable",
      "Three separate ML model types — district risk (Random Forest), supply propagation (Bayesian), fraud (Benford's) — because they answer fundamentally different questions",
    ],
    whatDidntWork:
      "OCR confidence on scanned FSSAI PDFs is the bottleneck — it's why every record carries a confidence score rather than a false promise of certainty.",
    outcome:
      "Pipeline, API, and all three ML models built. Production hardening items remaining: RLS context not yet set for app.user_id in the API, needs a PostgreSQL production host. React SPA explorer is functional.",
    whatIdDoDifferently: "Annotate a fine-tuning set for the NER model earlier — generic models miss Indian lab and contaminant naming.",
    stack: ["Python", "PostgreSQL", "Airflow", "Tesseract OCR", "spaCy", "FastAPI", "scikit-learn", "React"],
    github: "https://github.com/ultramagnus23/FoodSafe",
    liveUrl: "",
    featured: true,
    hasCaseStudy: true,
  },
  {
    id: "04",
    slug: "holoforge",
    title: "HoloForge",
    tagline: "When you degrade a hologram, does it actually look worse — or just measure worse?",
    status: "in-progress",
    category: "research",
    year: 2026,
    accent: "#5BC8FF",
    description:
      "A computational-holography simulation framework that models a phase-only holographic display and systematically degrades it — resolution, phase-quantisation bits, viewing angle, speckle, depth planes — scoring each reconstruction with both physical (PSNR/SSIM) and perceptual metrics.",
    longDescription:
      "HoloForge is the engine behind a research question: where does optical fidelity diverge from visual experience? It propagates light with the Angular-Spectrum Method, retrieves phase with Gerchberg-Saxton, then sweeps the constraints a real SLM display lives under and measures where quality actually breaks. The recurring finding: physical and perceptual quality diverge, and that gap is where display-engineering budget should be spent. Working paper in progress, targeting arXiv cs.GR / eess.IV.",
    problem:
      "Holographic-display research optimises for physical fidelity metrics that don't always track what a viewer perceives. Where's the real perceptual cliff for each degradation?",
    approach:
      "Build a controllable simulator, sweep one degradation axis at a time, and compare physical (PSNR, SSIM) against a perceptual proxy to find the divergence points.",
    built: [
      "Wave-optics core — Angular-Spectrum propagation + Gerchberg-Saxton phase retrieval (NumPy/SciPy)",
      "Degradation suite — resolution (64×64 → 512×512), phase-bits (8→1), colour channels, viewing-angle bandwidth, depth planes (1→5), speckle (σ 0–0.3)",
      "Metrics pipeline — PSNR, SSIM, LPIPS-style perceptual proxy, exported to consolidated CSV for analysis",
      "Experiment runner + interactive notebook generating side-by-side comparison figures",
    ],
    metrics: [
      { label: "2-bit phase", value: "SSIM 0.93 — holds up" },
      { label: "1-bit phase", value: "SSIM 0.003 — cliff" },
      { label: "25% viewing angle", value: "SSIM 0.97 — near-lossless" },
      { label: "Degradation axes", value: "6 swept" },
    ],
    technicalDecisions: [
      "Angular-Spectrum Method — exact diffraction propagation, valid when pixel pitch ~ wavelength",
      "Gerchberg-Saxton for phase retrieval — the standard SLM hologram-design algorithm",
      "Both physical and perceptual metrics — the whole point is finding where they disagree",
      "Pure NumPy/SciPy core — reproducible and dependency-light for the preprint",
    ],
    whatDidntWork:
      "1-bit phase quantisation is a true cliff (SSIM collapses to ~0.003) while 2-bit survives — the kind of non-obvious threshold the framework exists to surface.",
    outcome:
      "Simulation framework and degradation results complete. Working paper in progress — targeting arXiv (cs.GR / eess.IV), not yet submitted. Next experiment: gradient-descent phase retrieval with PyTorch autograd, benchmarked against Gerchberg-Saxton.",
    whatIdDoDifferently: "Build the gradient-descent solver alongside GS from the start, so every sweep compares both retrieval methods.",
    stack: ["Python", "NumPy", "SciPy", "scikit-image", "Matplotlib", "OpenCV", "Jupyter"],
    github: "https://github.com/ultramagnus23/HoloForge",
    liveUrl: "",
    featured: true,
    hasCaseStudy: true,
  },
  {
    id: "05",
    slug: "orenth",
    title: "Orenth",
    tagline: "We built a GPS for people, not places.",
    status: "done",
    category: "earlier",
    year: 2023,
    accent: "#185FA5",
    description:
      "Real-time intra-campus navigation. Search for a person — a teacher, a friend — and the app guides you to them like a landmark. WiFi triangulation and carrier geolocation, corrected by facial-recognition checkpoints. Pitched at TiE Global and India Mobile Congress 2023.",
    longDescription:
      "Google Maps stops at the building entrance. Orenth navigates inside — WiFi triangulation and carrier geolocation as a base layer, AI facial recognition at camera checkpoints to correct drift from 8m to usable corridor precision. The UX metaphor: navigate to 'Rahul', not 'Room 3B'.",
    problem: "Intra-building navigation doesn't exist. You know someone's in the building. You still can't find them.",
    approach: "WiFi + carrier geolocation as the base layer; facial recognition at checkpoints as the accuracy-correction layer.",
    built: [
      "WiFi signal-strength mapping + carrier geolocation positioning",
      "Facial-recognition checkpoint layer for drift correction",
      "'Navigate to a person' landmark-metaphor UX",
    ],
    metrics: [
      { label: "TiE Global", value: "Top 25 worldwide" },
      { label: "IMC 2023", value: "1 of 5 schools nationally" },
      { label: "Wharton TYE", value: "15% ROI challenge" },
    ],
    technicalDecisions: [
      "WiFi signal mapping over BLE — more infrastructure-agnostic",
      "Facial recognition as correction, not primary tracking — privacy/accuracy balance",
      "Landmark metaphor in the UX — people, not room numbers",
    ],
    whatDidntWork: "Pure WiFi triangulation gave 8m accuracy — unusable in corridors. The camera-checkpoint layer was the fix.",
    outcome:
      "TiE Global Semi-Finals (Top 25 worldwide, Best Business Model). India Mobile Congress 2023 — one of 5 schools nationally, pitched alongside Airtel and Jio.",
    whatIdDoDifferently: "Scope the pilot to a single campus type first. Building for corporate and educational at once was too broad for a two-person team.",
    stack: ["Python", "JavaScript", "Computer Vision", "WiFi Signal Processing", "Carrier Geolocation API"],
    github: "",
    liveUrl: "",
    featured: false,
    hasCaseStudy: true,
  },
  {
    id: "06",
    slug: "collegapp",
    title: "CollegeApp",
    tagline: "6,000 users didn't ask for it — they just showed up.",
    status: "done",
    category: "earlier",
    year: 2022,
    accent: "#D85A30",
    description:
      "An AI chatbot that helped students research and apply to colleges, built in Grade 11. Reached 6,000+ users organically with zero marketing. The proof-of-problem that led directly to CollegeOS.",
    longDescription:
      "Built to solve a timing problem — college research without a timeline is a labyrinth. The hard part wasn't the code; it was realising information overload was the real enemy. I rebuilt the notification system until it delivered the right information at the right moment. 6,000+ users arrived with zero marketing. CollegeOS is the second, more serious swing.",
    problem: "College research is a labyrinth — too much information, no structure, wrong timing.",
    approach: "An AI chatbot with smart notification timing — the right information at the right moment in the application cycle.",
    built: ["Conversational college-research assistant", "Timeline-aware notification system"],
    metrics: [
      { label: "Users", value: "6,000+" },
      { label: "Marketing spend", value: "₹0" },
      { label: "Built in", value: "Grade 11" },
    ],
    technicalDecisions: [],
    whatDidntWork: "",
    outcome: "6,000+ users, zero marketing — proof the problem space was real. Led directly to CollegeOS.",
    whatIdDoDifferently: "",
    stack: ["JavaScript", "NLP", "API Integration"],
    github: "",
    liveUrl: "",
    featured: false,
    hasCaseStudy: false,
  },
  {
    id: "07",
    slug: "klein-b",
    title: "Klein B",
    tagline: "A water flea and a fern walked into a lake.",
    status: "done",
    category: "earlier",
    year: 2022,
    accent: "#1D9E75",
    description:
      "Independent research on using Azolla ferns and Daphnia water fleas to address lake eutrophication — a 60-day, chemical-free biological protocol, with a carbon-neutral deployment boat and a full financial model.",
    longDescription:
      "Azolla ferns absorb excess nitrogen and phosphorus at the surface; Daphnia consume algae at the base. Together they attack eutrophication from both ends of the water column — no chemicals, no machinery, 60 days. I built the protocol, modelled the finances, and designed a carbon-neutral deployment boat.",
    problem: "Lake eutrophication is widespread; remediation is expensive and chemical-heavy. Rural communities have no access.",
    approach: "A two-organism biological protocol attacking nutrients and algae simultaneously from opposite ends of the water column.",
    built: ["60-day two-organism remediation protocol", "Carbon-neutral deployment-boat design", "Full financial model"],
    metrics: [
      { label: "Timeline", value: "60 days" },
      { label: "Chemicals used", value: "Zero" },
    ],
    technicalDecisions: [
      "Biological over chemical — lower cost, no secondary pollution, self-regulating",
      "60-day timeline tied to organism reproduction and nutrient-absorption cycles",
    ],
    whatDidntWork: "Concentration ratios are delicate — too many Daphnia and they consume each other before the algae. Calibration took extensive literature review.",
    outcome: "Full protocol documented, financial model completed, deployment vessel designed. Formed Klein B as the research entity.",
    whatIdDoDifferently: "Partner with a university biology lab earlier — peer review would have accelerated the calibration.",
    stack: ["Research", "Biotechnology", "Environmental Science", "Financial Modelling"],
    github: "",
    liveUrl: "",
    featured: false,
    hasCaseStudy: true,
  },
];

export const currentProjects = projects.filter((p) => p.category === "current");
export const researchProjects = projects.filter((p) => p.category === "research");
export const earlierProjects = projects.filter((p) => p.category === "earlier");
