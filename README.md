# SIGNAL — Chaitanya Tripathi's Portfolio

A kinetic, dark-first portfolio built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS v4**, **Framer Motion**, and **Three.js**.

---

## Prerequisites

| Tool | Minimum version |
|------|----------------|
| [Node.js](https://nodejs.org/) | **18.17** or later (LTS recommended) |
| npm | comes with Node — no separate install needed |

Check you have a recent enough version:

```bash
node -v   # should print v18.x or higher
npm -v
```

---

## Running locally (dev server)

```bash
# 1. Clone the repo (skip if you already have it)
git clone https://github.com/ultramagnus23/Portfolio.git
cd Portfolio

# 2. Install dependencies (~30 seconds)
npm install

# 3. Start the development server
npm run dev
```

Then open **http://localhost:3000** in your browser.

The dev server supports hot-reload — any file you save is reflected instantly.

---

## Building for production

```bash
npm run build   # compiles & optimises everything (~30-60 seconds)
npm start       # serves the production build on http://localhost:3000
```

---

## Project structure (quick map)

```
app/                   # Next.js App Router pages
  page.tsx             # Home — hero, projects, about, skills, contact
  projects/[slug]/     # Individual case-study pages
  now/  writing/  log/ # Secondary pages
components/            # All React components
  Loader.tsx           # 4-phase animated loader (C · T)
  HeroCanvas.tsx       # Three.js 3 000-particle WebGL field
  CustomCursor.tsx     # Green circle cursor with spring lerp
  Nav.tsx              # Fixed nav, transparent → dark on scroll
  ProjectRow.tsx       # Full-width project block
  NowBar.tsx           # Scrolling marquee of current activities
  SkillCloud.tsx       # Tag cloud with proficiency sizing
  ExperienceAccordion.tsx
  LeadershipGrid.tsx
  ContactSection.tsx
data/                  # Static TypeScript content files (no CMS)
  projects.ts  skills.ts  experience.ts  leadership.ts  awards.ts
```

---

## Pages

| URL | What you'll see |
|-----|----------------|
| `/` | Full homepage — loader → hero WebGL → all sections |
| `/projects` | All 7 projects listed |
| `/projects/collegeos` | CollegeOS case study |
| `/projects/orenth` | Orenth case study |
| `/projects/klein-b` | Klein B case study |
| `/now` | What I'm working on right now |
| `/writing` | Writing stubs (in progress) |
| `/log` | Learning log entries |

---

## Tech stack

- **Next.js 16 / React 19** — App Router, SSG
- **TypeScript** — strict mode
- **Tailwind CSS v4** — CSS-based configuration
- **Framer Motion** — page transitions, scroll animations, cursor spring
- **Three.js** — hero particle field (`InstancedMesh`, mouse repulsion)
- **GSAP** — available for timeline animations
- **Fontshare CDN** — Clash Display (headings) + Instrument Sans (body)

---

## Deploying to Vercel (one click)

The easiest way to share it publicly:

1. Push the repo to GitHub (already done).
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → import this repo.
3. Vercel auto-detects Next.js — click **Deploy**. Done.

Or via the CLI:

```bash
npm i -g vercel
vercel
```
