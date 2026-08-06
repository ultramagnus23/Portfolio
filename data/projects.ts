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
      "Global college-discovery and application-intelligence platform. A hybrid recommendation pipeline (pgvector similarity + lexical ranking) narrows ~8,200 institutions to high-fit candidates, keyword + trigram search resolves names and majors, a logistic-regression chancing service estimates admit probability, and a Python + Node scraper framework keeps data current.",
    longDescription:
      "CollegeOS turns the chaos of international applications into a single, legible system. A canonical PostgreSQL/Supabase schema unifies institutions, programs, admissions, financials, outcomes and rankings. On top of it sits a multi-stage recommendation pipeline — pgvector cosine similarity over 768-dim embeddings plus lexical retrieval, multi-factor ranking, Reach/Target/Safety/Wildcard diversification, and explainable score breakdowns. The vectoriser today is a deterministic hashed bag-of-words model, not a trained semantic one — honest about the difference. It's the second swing at a problem my first product, CollegeApp, proved was real.",
    problem:
      "Students applying internationally have no reliable signal about fit or chances. Counsellors give vague guidance, lists are generic, and outcomes feel random.",
    approach:
      "Build a canonical data layer first, then layer intelligence on top: pgvector + lexical retrieval for recommendations, keyword + trigram search for exact lookups, a transparent logistic-regression chancing model, and a scraper framework that keeps data fresh from primary sources.",
    built: [
      "Canonical PostgreSQL + Supabase schema (pg_trgm, unaccent, pgvector) — institutions, ~44k programs, admissions, financials, outcomes, rankings",
      "Recommendation pipeline: pgvector similarity (768-dim hashed embeddings) + lexical retrieval → multi-factor ranking → Reach/Target/Safety/Wildcard diversification with explainability",
      "Keyword + trigram + acronym search (Supabase RPC) with typo tolerance and quality-aware ranking",
      "Logistic-regression chancing (SAT vs college median, GPA, selectivity) trained on simulated cohorts; auto-switches to real labels after 200 recorded outcomes",
      "Idempotent scraper framework (College Scorecard, official deadline pages) — a run only succeeds if it adds new rows, never fabricates",
    ],
    metrics: [
      { label: "Predecessor reach", value: "6,000+ users (CollegeApp)" },
      { label: "Institutions", value: "~8,200 across 8+ countries" },
      { label: "Status", value: "Active development" },
    ],
    technicalDecisions: [
      "Canonical schema over fragmented joins — kill duplicate institution representations before they multiply",
      "pgvector for recommendations, keyword + trigram for search — vector similarity where it sharpens ranking, lexical where users type exact names",
      "Hashed bag-of-words vectoriser, not a trained embedding model — keeps recommendations deterministic and dependency-light until a trained model earns its place",
      "Logistic regression on simulated cohorts now, real labels later — a transparent model that auto-retrains once 200 real outcomes accumulate",
    ],
    whatDidntWork:
      "The first stack fragmented fast — duplicate institution rows and separate Flask/FastAPI chancing services that drifted out of sync. Collapsing everything into a canonical schema with one chancing service was the unlock. The chancing model is also still trained on synthetic cohorts — it recovers stats-grounded relationships, not validated accuracy against real admits.",
    outcome:
      "Architecture in active development: canonical schema, hybrid recommendations, chancing and idempotent scrapers all wired and running. Open gaps before full v1: populating sparse deadlines/requirements from primary sources, and accumulating 200 real admission outcomes so the chancing model can train on real labels.",
    whatIdDoDifferently:
      "Design the canonical schema on day one. The migration away from fragmented joins cost real time.",
    stack: ["React", "TypeScript", "Node.js", "Express", "PostgreSQL", "Supabase", "Python", "GitHub Actions"],
    github: "https://github.com/ultramagnus23/CollegeOS",
    liveUrl: "https://college-os.vercel.app/",
    featured: true,
    hasCaseStudy: true,
  },
  {
    id: "02",
    slug: "meza",
    title: "Meza",
    tagline: "The room is telling you something. Meza reads it.",
    status: "in-progress",
    category: "current",
    year: 2026,
    accent: "#7F77DD",
    description:
      "Restaurant experience intelligence. Meza correlates how occupancy, environment (temperature, music, lighting, weather) and operational conditions move customer behaviour and revenue — turning anonymous CCTV people-counts and POS history into A/B-testable decisions about the physical experience.",
    longDescription:
      "Meza treats the dining room itself as a signal. It reads anonymous occupancy from a restaurant's existing CCTV (an optional edge-CV pipeline on a Raspberry Pi or Jetson Nano), layers in environmental conditions and revenue, and lets an owner run and track A/B experiments on the experience — does warmer lighting or slower music actually lift spend? It's privacy-first by construction: no names, no phone numbers, no facial recognition, no images stored — only anonymous counts and conditions. Ships with a fully seeded 60-day demo restaurant (read-only via Postgres row-level security); a real deployment starts from a CSV of POS data, with live cameras as an optional add-on.",
    problem:
      "Restaurants optimise the menu and the marketing, but the room itself — how full it is, how it feels, what the weather is doing — stays invisible. Owners have no way to tell which environmental levers actually change behaviour.",
    approach:
      "Instrument the room, not the customer. Pull anonymous occupancy from existing CCTV, add environmental and revenue signals, then give owners a lightweight experimentation layer so they can A/B-test changes to the experience and measure the revenue effect.",
    built: [
      "Occupancy analytics — real-time table and people counting from existing CCTV (no faces, no images stored)",
      "Environmental tracking — temperature, music, lighting and weather correlated against behaviour",
      "Revenue analytics — daily revenue trends and order analysis",
      "Experimentation module — design and track A/B tests on the physical experience, with data-driven recommendations",
      "CSV POS import + a fully seeded 60-day demo dataset, read-only via Supabase row-level security",
    ],
    metrics: [
      { label: "Demo dataset", value: "60-day seeded restaurant" },
      { label: "Privacy", value: "Zero PII — counts only" },
      { label: "Status", value: "In active development" },
    ],
    technicalDecisions: [
      "Next.js 14 App Router + Supabase Postgres with row-level security — one stack, auth and data together",
      "Anonymous occupancy over facial recognition — privacy-first by design; no names, faces or images stored",
      "Optional edge-CV pipeline (Raspberry Pi / Jetson Nano) so it runs on a restaurant's existing cameras",
      "CSV POS import before live integrations — value on day one without an integration project",
    ],
    whatDidntWork:
      "Working from anonymous counts alone is a real constraint — you can measure that behaviour changed without ever knowing who changed it, which is exactly why the experimentation layer exists: you A/B the environment instead of profiling the customer.",
    outcome:
      "Dashboard, occupancy, environment tracking, experiments and recommendations all built and running against the seeded 60-day demo. Deploys on free-tier Vercel/Render + Supabase; real cameras are a 2–4 week add-on. Next: a public demo link and screenshots in the repo.",
    whatIdDoDifferently:
      "Design the experiment-tracking schema first — occupancy and environment tables were straightforward, but making experiments cleanly comparable after the fact was the harder retrofit.",
    stack: ["Next.js", "TypeScript", "React", "Supabase", "PostgreSQL", "Python", "Recharts"],
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
      "A 4-stage data pipeline turning FSSAI, openFDA, AGMARKNET and FoSCoS enforcement data into a structured PostgreSQL warehouse. FastAPI layer with 12+ routers. Layered analytics — Random Forest district-risk, Bayesian supply-chain propagation, Benford's-Law fraud detection, plus dietary-exposure and contamination-trend models.",
    longDescription:
      "India's food-safety data is public but unusable: thousands of enforcement PDFs, no structure, no search. FoodSafe runs a four-stage pipeline — OCR + NER to extract records, canonicalisation (contaminant names, values to PPB, districts to Census-2021, dates to ISO), cross-source deduplication, and a confidence score that gates what reaches downstream models. A FastAPI layer with 12+ routers exposes the warehouse; a stack of analytical models — from district-risk scoring to Codex-benchmark comparison and Mann-Kendall trend detection — sits on top.",
    problem:
      "Consumers and researchers can't see what's actually in regional food supply. The enforcement data is buried in scanned government PDFs.",
    approach:
      "Treat it as a data-engineering problem. Extract from PDFs, standardise relentlessly, deduplicate across sources, attach a confidence score, and layer ML on top for risk, propagation, and fraud signals.",
    built: [
      "Stage 1 — PDF OCR + NER extraction (Tesseract + spaCy)",
      "Stage 2 — canonicalisation: contaminant aliases, values → PPB, districts → Census 2021, dates → ISO 8601",
      "Stage 3/4 — hash-based dedup across sources + confidence scoring (base 0.70 with lab/verification/range adjustments; ≥ 0.75 trust gate)",
      "Daily automated ingest (GitHub Actions) across openFDA, AGMARKNET and FoSCoS; Apache Airflow DAGs optional for the full pipeline",
      "FastAPI layer: 12+ routers (auth, risk, search, user, disputes, disease, trends, compare, admin, api-keys, subscriptions)",
      "Random Forest district-risk model — ranks districts by contamination likelihood",
      "Bayesian supply-chain propagation graph — traces how a contaminant moves through the supply network",
      "Benford's-Law fraud detection, Wilson-interval aggregation, dietary-exposure (EFSA), Codex-benchmark and Mann-Kendall trend models",
      "Next.js 14 frontend (plus a legacy React SPA) for exploration",
    ],
    metrics: [
      { label: "Pipeline stages", value: "4 (extract → score)" },
      { label: "Trust gate", value: "≥ 0.75 confidence" },
      { label: "Sources", value: "FSSAI · openFDA · AGMARKNET · FoSCoS" },
      { label: "API routers", value: "12+" },
      { label: "Analytical models", value: "8+ (risk · propagation · fraud · exposure · trend)" },
    ],
    technicalDecisions: [
      "Confidence scoring over hard filtering — keep low-trust records, flag them, never silently drop",
      "Canonicalise to Census-2021 districts so contaminant data joins cleanly to geography",
      "Flag cross-source duplicates instead of deleting — provenance matters for a safety dataset",
      "GitHub Actions for the daily ingest, Airflow reserved for the heavier full pipeline — each source stays independent and observable",
      "Separate model types — district risk (Random Forest), supply propagation (Bayesian), fraud (Benford's), exposure (EFSA) and trend (Mann-Kendall) — because they answer fundamentally different questions",
    ],
    whatDidntWork:
      "OCR confidence on scanned FSSAI PDFs is the bottleneck — it's why every record carries a confidence score rather than a false promise of certainty. The Random Forest also underfits on the demo dataset; it needs more real records to be meaningful.",
    outcome:
      "Pipeline, API and analytical models built and running against a ~1,900-record demo seed. Production hardening remaining: the API doesn't yet set the app.user_id RLS context, the supply-chain graph awaits seed nodes, and it needs a production PostgreSQL host. Frontend explorer is functional.",
    whatIdDoDifferently: "Annotate a fine-tuning set for the NER model earlier — generic models miss Indian lab and contaminant naming.",
    stack: ["Python", "FastAPI", "PostgreSQL", "Next.js", "Tesseract OCR", "spaCy", "scikit-learn", "Airflow"],
    github: "https://github.com/ultramagnus23/FoodSafe",
    liveUrl: "https://foodsafev2.vercel.app/",
    featured: true,
    hasCaseStudy: true,
  },
  {
    id: "04",
    slug: "holoforge",
    title: "HoloForge",
    tagline: "When you degrade a hologram, does it actually look worse — or just measure worse?",
    status: "done",
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
      "Simulation framework and degradation results complete; Part 1 is out as a preprint (arXiv / Optica Open). Part 2 is in progress — a media-in-the-loop model with a differentiable photopolymer recording step. Next experiment: gradient-descent phase retrieval (PyTorch autograd) benchmarked against Gerchberg-Saxton.",
    whatIdDoDifferently: "Build the gradient-descent solver alongside GS from the start, so every sweep compares both retrieval methods.",
    stack: ["Python", "NumPy", "SciPy", "scikit-image", "Matplotlib", "OpenCV", "Jupyter"],
    github: "https://github.com/ultramagnus23/HoloForge",
    liveUrl: "",
    featured: true,
    hasCaseStudy: true,
  },
  {
    id: "08",
    slug: "music-morph",
    title: "Music Morph",
    tagline: "Control the mix with your hands, not a mouse.",
    status: "in-progress",
    category: "current",
    year: 2026,
    accent: "#FF4FA3",
    description:
      "A gesture-controlled live music mangler: webcam hand-tracking drives a real-time Web Audio effect chain — pinch for a filter cutoff, other gestures for beat-repeat, reverse, crossfade — instead of a mouse or a MIDI controller.",
    longDescription:
      "Music Morph (working name inside the repo: Handshake) reads a webcam feed through MediaPipe, smooths it with a One-Euro filter, and classifies hand posture into a small gesture vocabulary that drives a two-deck Web Audio effect chain in an Electron app. A Python sidecar (Essentia + pyloudnorm) handles offline track analysis for the next-track selector and playlist import. It's an in-progress scaffold, not a finished product — the repo is explicit about what's stubbed vs. built.",
    problem:
      "Every live-mixing interface is a mouse, a fader, or a MIDI grid — all of them add a translation step between the gesture you actually want to make and the sound changing.",
    approach:
      "Build the gesture-to-ear latency loop first — one gesture (pinch), one effect (filter cutoff), on one file — before building out the rest of the effect chain, library, or UI.",
    built: [
      "Webcam → MediaPipe → One-Euro filter → posture classifier → per-hand control-bus pipeline",
      "Two-deck Web Audio engine (crossfader, master bus) with a fixed per-deck effect chain",
      "Python offline analyzer sidecar (Essentia + pyloudnorm) spawned per-track from the Electron main process",
      "SQLite-backed library with a history-aware next-track selector and Spotify ISRC/fuzzy-match playlist import",
    ],
    metrics: [
      { label: "Stage", value: "Scaffold, Phase 1 in progress" },
      { label: "Architecture", value: "Electron + Web Audio + MediaPipe" },
    ],
    technicalDecisions: [
      "Prove gesture-to-ear latency with one gesture and one effect before building anything else — the spec calls this out explicitly as the build order",
      "Renderer never touches Node directly — all system access goes through Electron IPC handlers",
    ],
    whatDidntWork: "",
    outcome:
      "Core vision → gesture → audio pipeline is wired; time-stretch, beat-repeat/reverse buffers, Spotify OAuth's redirect handling, and onboarding UI are still open, tracked as TODOs in the repo.",
    whatIdDoDifferently: "",
    stack: ["Electron", "TypeScript", "Web Audio API", "MediaPipe", "Python", "Essentia", "SQLite"],
    github: "https://github.com/ultramagnus23/Music-Morph",
    liveUrl: "",
    featured: false,
    hasCaseStudy: false,
  },
  {
    id: "09",
    slug: "drill",
    title: "Drill",
    tagline: "One topic a day. Explain it back, out loud.",
    status: "in-progress",
    category: "current",
    year: 2026,
    accent: "#3BDBD1",
    description:
      "A daily recall-practice tool: it draws one topic, gives a timed research window, then a timed spoken-recall window (recorded), and scores fluency, depth and coverage — a personal spaced-repetition drill instead of passive note-taking.",
    longDescription:
      "Drill picks a topic for the day — new or a scheduled revisit — locks in a research window, then switches to a recall phase where you explain the topic out loud against the clock. Sessions, streaks and per-topic history are stored client-side (IndexedDB), and a selection algorithm decides what resurfaces and when based on past coverage and fluency scores.",
    problem: "Reading about something and being able to explain it from memory are different skills, and most study tools only exercise the first one.",
    approach:
      "Force the retrieval step: timebox research, then timebox spoken recall with no notes, and score the result instead of just marking a topic 'reviewed'.",
    built: [
      "Daily topic draw with reroll, backed by a history-aware spaced-revisit selector",
      "Timed research → timed spoken-recall flow with audio recording",
      "Fluency / depth / coverage scoring per session, streak tracking, and a session archive",
      "IndexedDB-backed local storage — topics, sessions and exports all run client-side",
    ],
    metrics: [
      { label: "Flow", value: "Draw → research → recall → score" },
      { label: "Storage", value: "Local-first (IndexedDB)" },
    ],
    technicalDecisions: [
      "Client-side storage over a backend — a daily personal habit tool doesn't need a server, and it works offline",
      "Score the recall (fluency/depth/coverage), not just log completion — the point is measuring retrieval quality, not streak-gaming",
    ],
    whatDidntWork: "",
    outcome: "Core draw/research/recall/score loop, topic archive, and map view are built and running.",
    whatIdDoDifferently: "",
    stack: ["Next.js", "TypeScript", "IndexedDB", "Vitest"],
    github: "https://github.com/ultramagnus23/Drill",
    liveUrl: "",
    featured: false,
    hasCaseStudy: false,
  },
  {
    id: "10",
    slug: "the-global",
    title: "The Global",
    tagline: "A distributor's storefront, built for whoever updates it next.",
    status: "live",
    category: "current",
    year: 2026,
    accent: "#7A93A6",
    description:
      "Client site for The Global — Global Sales (an Astral distributor) and Global Marketing (exclusive Somany distributor for Rajasthan). Product catalogue, an enquiry form with email delivery, and every business fact (phone numbers, GSTIN, addresses) centralised in one file so non-developers can maintain it.",
    longDescription:
      "Built as a freelance/client project: a two-brand distributor site on Next.js 16 with a product catalogue and an enquiry pipeline (Resend-backed email, with a console-log fallback so a bad API key never breaks the form for a visitor). The README is written for the client's day-to-day maintainer, not just developers — every phone number, GSTIN and address lives in a single content file so one edit updates the whole site.",
    problem: "A distributor needs a real catalogue and enquiry funnel online, maintained by someone who isn't a developer.",
    approach:
      "Centralise every business fact in one content file, make the enquiry form fail safe (never silently drop a lead), and write the README for the maintainer, not the next engineer.",
    built: [
      "Product catalogue across CPVC pipes and other product categories",
      "Enquiry form with Resend email delivery and a console-log fallback on failure",
      "Single source-of-truth content file for every phone number, GSTIN and address across both brands",
    ],
    metrics: [
      { label: "Status", value: "Live" },
      { label: "Brands", value: "2 (Global Sales · Global Marketing)" },
    ],
    technicalDecisions: [
      "One content file for every business fact — every page that shows a phone number updates from a single edit",
      "Enquiry delivery degrades to a server log instead of failing silently — a bad API key never loses a lead",
    ],
    whatDidntWork: "",
    outcome: "Live and deployed.",
    whatIdDoDifferently: "",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Resend"],
    github: "https://github.com/ultramagnus23/TheGlobal",
    liveUrl: "https://the-global-zeta.vercel.app",
    featured: false,
    hasCaseStudy: false,
  },
  {
    id: "11",
    slug: "dash",
    title: "Dash",
    tagline: "One person, one login, everything in one place.",
    status: "in-progress",
    category: "current",
    year: 2026,
    accent: "#C9A227",
    description:
      "A private, single-user personal operating-system dashboard — a dark mission-control shell over checklists, KPIs, finance, and a document vault, with a single hardcoded login rather than a multi-tenant auth system.",
    longDescription:
      "Dash (internally 'Chaitanya Live') is a personal-use dashboard: single-user Auth.js credentials gate, Neon Postgres, Vercel Blob for vault storage. It's deliberately not a SaaS — one user, defined by environment variables, not a database of accounts. Repo is private since the vault is meant to hold sensitive documents.",
    problem: "Scattered checklists, KPIs and documents across a dozen tools, with no single, secured personal home base.",
    approach: "One dashboard, one hardcoded user, phased rollout — skeleton and auth first, real data and integrations after.",
    built: [
      "Single-user Auth.js credentials login gating a dark mission-control shell",
      "12 module routes stubbed or reading from seed data",
    ],
    metrics: [
      { label: "Status", value: "Phase 0 complete (skeleton + auth)" },
      { label: "Access", value: "Single-user, private repo" },
    ],
    technicalDecisions: [
      "One hardcoded user via env vars instead of a real accounts table — this is intentionally not multi-tenant",
      "Vercel Blob for the document vault, kept behind the same auth gate as everything else",
    ],
    whatDidntWork: "",
    outcome:
      "Login wall and shell are live; real data tables, Notion sync, AI feed/insight generation and vault uploads are the next phases.",
    whatIdDoDifferently: "",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Neon Postgres", "Auth.js", "Vercel Blob"],
    github: "https://github.com/ultramagnus23/Dash",
    liveUrl: "https://dash-eta-six.vercel.app",
    featured: false,
    hasCaseStudy: false,
  },
  {
    id: "12",
    slug: "airthra",
    title: "Airthra Research",
    tagline: "Mining the sky, fueling the earth.",
    status: "live",
    category: "current",
    year: 2026,
    accent: "#38BDF8",
    description:
      "Site built for Airthra Research, whose Neelkanth unit captures SO₂ emissions from industrial boilers and converts them into potassium thiosulfate fertiliser — deployed as a managed service with no upfront capex for the client.",
    longDescription:
      "Built for and owned by Airthra Research (repo isn't mine — this was a build-for-hire). Airthra's pitch: instead of a client buying a limestone scrubber that just creates waste, Airthra deploys its Neelkanth unit at zero upfront cost, runs it, and monetises the recovered sulfur compound as fertiliser — turning an emissions cost centre into a revenue line.",
    problem: "An industrial emissions-tech company needed a site that explains a genuinely technical, non-obvious business model clearly.",
    approach: "Lead with the mechanism (SO₂ → fertiliser) and the economics (zero capex, managed service) before anything else.",
    built: ["Marketing site explaining the Neelkanth technology and managed-service business model"],
    metrics: [{ label: "Status", value: "Live" }],
    technicalDecisions: [],
    whatDidntWork: "",
    outcome: "Live at airthra.com.",
    whatIdDoDifferently: "",
    stack: ["Next.js", "TypeScript", "Tailwind CSS"],
    github: "",
    liveUrl: "https://airthra.com/",
    featured: false,
    hasCaseStudy: false,
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
