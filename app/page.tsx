"use client";

import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import Link from "next/link";
import Loader from "@/components/Loader";
import NowBar from "@/components/NowBar";
import ScrambleText from "@/components/ScrambleText";
import Magnetic from "@/components/Magnetic";
import ProjectStation from "@/components/ProjectStation";
import ResearchSection from "@/components/ResearchSection";
import Timeline from "@/components/Timeline";
import SkillCloud from "@/components/SkillCloud";
import ExperienceAccordion from "@/components/ExperienceAccordion";
import LeadershipGrid from "@/components/LeadershipGrid";
import ContactSection from "@/components/ContactSection";
import SmoothScroll from "@/components/SmoothScroll";
import { currentProjects, earlierProjects } from "@/data/projects";
import { now, nowLastUpdated } from "@/data/now";
import { education } from "@/data/education";
import { awards } from "@/data/awards";
import { useSceneStore } from "@/lib/scrollStore";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { gsap, ScrollTrigger, ensureScrollTrigger } from "@/lib/gsap";

// WebGL only exists on the client, and the bundle is large enough to be
// worth deferring off the critical path entirely.
const SceneCanvas = dynamic(() => import("@/components/scene/SceneCanvas"), { ssr: false });

function SectionHeading({ children, eyebrow }: { children: string; eyebrow?: string }) {
  return (
    <div className="mb-12">
      {eyebrow && (
        <p className="font-mono text-xs tracking-[0.3em] uppercase text-signal mb-4">{eyebrow}</p>
      )}
      <ScrambleText
        as="h2"
        text={children}
        className="font-display font-bold text-5xl md:text-6xl text-white block"
      />
    </div>
  );
}

function HeroTelemetry() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const tick = () =>
      setTime(
        new Date().toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZone: "Asia/Kolkata",
        })
      );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="hidden md:flex items-center gap-6 font-mono text-[10px] tracking-[0.2em] uppercase text-white/30">
      <span>28.9931° N · 77.0151° E</span>
      <span className="text-signal/50">IST {time}</span>
      <span>λ 532 nm</span>
    </div>
  );
}

function ChapterLabel({ n, label }: { n: string; label: string }) {
  return (
    <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-signal/40 mb-6">
      {n} — {label}
    </p>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HomeContent — mounts only after Loader completes so all refs are hydrated
// when useScroll reads them.
// ─────────────────────────────────────────────────────────────────────────────
function HomeContent() {
  const ch1Ref = useRef<HTMLDivElement>(null);
  const ch2Ref = useRef<HTMLDivElement>(null);
  const ch2SectionRef = useRef<HTMLElement>(null);
  const ch2ContentRef = useRef<HTMLDivElement>(null);
  const ch3Ref = useRef<HTMLDivElement>(null); // Systems — projects
  const ch4Ref = useRef<HTMLDivElement>(null); // Research
  const ch5Ref = useRef<HTMLDivElement>(null); // Transmission — rest + contact
  const wipeRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  const { scrollYProgress: ch1Progress } = useScroll({ target: ch1Ref, offset: ["start start", "end end"] });
  const { scrollYProgress: ch2Progress } = useScroll({ target: ch2Ref, offset: ["start start", "end end"] });
  const { scrollYProgress: ch3Progress } = useScroll({ target: ch3Ref, offset: ["start end", "end end"] });
  const { scrollYProgress: ch4Progress } = useScroll({ target: ch4Ref, offset: ["start end", "end end"] });
  const { scrollYProgress: ch5Progress } = useScroll({ target: ch5Ref, offset: ["start end", "end end"] });

  // Drive the SceneCanvas particle engine across all five chapters:
  // Ch1: 0.0–0.2  Ch2: 0.2–0.4  Ch3: 0.4–0.65  Ch4: 0.65–0.85  Ch5: 0.85–1.0
  // (chapter/audio derivation lives in ParticleField, which reads this
  // progress value imperatively — see components/scene/ParticleField.tsx)
  const setProgress = useSceneStore((s) => s.setProgress);
  useMotionValueEvent(ch1Progress, "change", (v) => setProgress(v * 0.2));
  useMotionValueEvent(ch2Progress, "change", (v) => setProgress(0.2 + v * 0.2));
  useMotionValueEvent(ch3Progress, "change", (v) => setProgress(0.4 + v * 0.25));
  useMotionValueEvent(ch4Progress, "change", (v) => setProgress(0.65 + v * 0.2));
  useMotionValueEvent(ch5Progress, "change", (v) => setProgress(0.85 + v * 0.15));

  // Three distinct GSAP ScrollTrigger chapter transitions — each a different
  // mechanism, not a repeat of the fade+y pattern used on leaf content:
  //   Ch1→Ch2: clip-path reveal uncovers the next chapter.
  //   Ch2→Ch3: a pinned recede — Ch2 scales/pulls back in 3D space, handing
  //            off to Ch3 like a camera pushing through the scene.
  //   Ch4→Ch5: a phase-blue → signal-green color wipe synced to the same
  //            scroll range that drives the particle field's color lerp.
  useEffect(() => {
    if (reduced) return; // accessible fallback: skip the scroll-jacked treatments entirely
    ensureScrollTrigger();

    const ctx = gsap.context(() => {
      // Ch1 → Ch2: clip-path reveal
      if (ch2ContentRef.current && ch2Ref.current) {
        gsap.fromTo(
          ch2ContentRef.current,
          { clipPath: "inset(0 0 100% 0)" },
          {
            clipPath: "inset(0 0 0% 0)",
            ease: "none",
            scrollTrigger: {
              trigger: ch2Ref.current,
              start: "top bottom",
              end: "top 15%",
              scrub: 0.6,
            },
          }
        );
      }

      // Ch2 → Ch3: pinned recede — the whole chapter-2 section shrinks and
      // pulls back in perspective space as it hands off to Systems.
      if (ch2SectionRef.current && ch2Ref.current) {
        gsap.set(ch2SectionRef.current, { transformOrigin: "50% 50%", willChange: "transform" });
        gsap.fromTo(
          ch2SectionRef.current,
          { scale: 1, z: 0, opacity: 1 },
          {
            scale: 0.82,
            z: -260,
            opacity: 0.35,
            ease: "none",
            scrollTrigger: {
              trigger: ch2Ref.current,
              start: "bottom 90%",
              end: "bottom 10%",
              scrub: 0.6,
            },
          }
        );
      }

      // Ch4 → Ch5: color-field wipe, synced to the same ch5Ref boundary that
      // drives useSceneStore's progress (0.85) and the particle field's
      // SIGNAL→PHASE color lerp.
      if (wipeRef.current && ch5Ref.current) {
        const wipeTl = gsap.timeline({
          scrollTrigger: {
            trigger: ch5Ref.current,
            start: "top bottom",
            end: "top 45%",
            scrub: 0.6,
          },
        });
        wipeTl
          .fromTo(
            wipeRef.current,
            { opacity: 0, clipPath: "inset(0 100% 0 0)" },
            { opacity: 0.5, clipPath: "inset(0 0% 0 0)", ease: "none", duration: 0.5 }
          )
          .to(wipeRef.current, { opacity: 0, clipPath: "inset(0 0 0 100%)", ease: "none", duration: 0.5 });
      }
    });

    return () => ctx.revert();
  }, [reduced]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      {!reduced && (
        <div
          ref={wipeRef}
          aria-hidden="true"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 15,
            pointerEvents: "none",
            opacity: 0,
            background: "linear-gradient(120deg, #5E8CDB 0%, #00FF94 100%)",
            mixBlendMode: "screen",
          }}
        />
      )}
      <main style={{ position: "relative", zIndex: 2 }}>

        {/* ───────────────────────────────────────────────────────────────────
            CHAPTER 1 — SIGNAL
            300vh wrapper; section is sticky so it holds while you scroll through
            ─────────────────────────────────────────────────────────────────── */}
        <div ref={ch1Ref} style={{ height: "300vh", position: "relative" }}>
          <section
            id="chapter-1"
            className="relative flex flex-col justify-center overflow-hidden"
            style={{ position: "sticky", top: 0, height: "100vh" }}
          >
            <div className="relative z-10 px-6 md:px-16 pt-24">
              <div className="text-scrim" aria-hidden="true" />
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <ChapterLabel n="01" label="Signal" />
                <p className="text-signal text-xs tracking-[0.3em] uppercase font-mono mb-6">
                  Builder · Researcher · Ashoka University
                </p>
              </motion.div>

              <h1 className="font-display font-bold text-[clamp(52px,10vw,132px)] leading-[0.92] tracking-[-0.02em] mb-6 max-w-5xl">
                <ScrambleText
                  as="span"
                  trigger="mount"
                  speed={36}
                  text="Chaitanya"
                  className="text-white block"
                />
                <ScrambleText
                  as="span"
                  trigger="mount"
                  speed={30}
                  text="Tripathi."
                  className="text-outline block"
                />
              </h1>

              <motion.p
                className="text-[#999] font-body text-lg md:text-xl max-w-xl mb-10 leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.6 }}
              >
                I build production-scale systems — college-admissions intelligence, food-safety
                pipelines, restaurant analytics — and study the physics underneath them, like where
                a hologram stops looking real.
              </motion.p>

              <motion.div
                className="flex flex-wrap items-center gap-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.85, duration: 0.5 }}
              >
                <Magnetic>
                  <a
                    href="#work"
                    data-cursor-text="go"
                    className="inline-block border border-signal text-signal px-6 py-2.5 font-body text-sm hover:bg-signal hover:text-black transition-colors"
                  >
                    View work ↓
                  </a>
                </Magnetic>
                <Magnetic>
                  <a
                    href="#research"
                    data-cursor-text="read"
                    className="inline-block border border-white/20 text-white px-6 py-2.5 font-body text-sm hover:border-white transition-colors"
                  >
                    Read the research →
                  </a>
                </Magnetic>
              </motion.div>
            </div>

            <div className="absolute bottom-8 left-6 right-6 md:left-16 md:right-16 flex items-end justify-between">
              <motion.div
                className="flex flex-col items-center gap-2"
                animate={{ y: [0, 6, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-signal/40">
                  scroll
                </span>
                <div className="w-px h-10 bg-gradient-to-b from-signal/60 to-transparent" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.8 }}
              >
                <HeroTelemetry />
              </motion.div>
            </div>
          </section>
        </div>

        {/* ───────────────────────────────────────────────────────────────────
            CHAPTER 2 — RECONSTRUCTION
            300vh wrapper; sticky section with scroll-driven text reveal
            ─────────────────────────────────────────────────────────────────── */}
        <div ref={ch2Ref} style={{ height: "300vh", position: "relative", perspective: "1000px" }}>
          <section
            ref={ch2SectionRef}
            id="chapter-2"
            className="relative flex flex-col justify-center"
            style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}
          >
            <div
              ref={ch2ContentRef}
              className="relative z-10 px-6 md:px-16 pt-20 space-y-6 max-w-2xl"
              style={reduced ? undefined : { clipPath: "inset(0 0 100% 0)" }}
            >
              <div className="text-scrim" aria-hidden="true" />
              <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-signal/40">
                02 — Reconstruction
              </p>

              <p className="text-white/80 font-body leading-[1.8] text-base md:text-lg">
                Here&apos;s the throughline, if you want one: I keep building systems that make
                something messy legible. CollegeApp started it — I was sixteen, six thousand people
                showed up, and I learned a problem is only real if strangers care. CollegeOS is the
                serious version. Meza does it for restaurants; FoodSafe does it for the food itself,
                pulling toxins out of government PDFs nobody reads.
              </p>

              <p className="text-white/80 font-body leading-[1.8] text-base md:text-lg">
                But I don&apos;t think of myself as only a builder. I&apos;ve spent time recording
                the soundscape around Jama Masjid — the azaan, the pigeons, a thousand overlapping
                conversations — trying to compose <em>with</em> a place instead of about it. I design
                murder-mystery games for my friends, which is really just systems design with
                suspects. And lately I&apos;m obsessed with holographic displays — not as a product,
                just because the question of when a fake image starts fooling a real eye is genuinely
                beautiful to me.
              </p>

              <p className="text-white/80 font-body leading-[1.8] text-base md:text-lg">
                I&apos;m nineteen. The actual skill is finding signal in noise — whether the noise
                is admissions data, a POS export, or a 532-nanometre wavefront. If you&apos;re
                building something that needs that, let&apos;s talk.
              </p>

              <div className="flex gap-6 pt-2">
                <a href="#work" className="font-mono text-sm text-signal hover:text-white transition-colors">
                  See the work ↓
                </a>
                <a href="#contact" className="font-mono text-sm text-[#555] hover:text-white transition-colors">
                  Get in touch →
                </a>
              </div>
            </div>
          </section>
        </div>

        {/* ───────────────────────────────────────────────────────────────────
            CHAPTER 3 — SYSTEMS  (canvas dims so cards are readable)
            ─────────────────────────────────────────────────────────────────── */}
        <div ref={ch3Ref} id="content-after-chapters" style={{ position: "relative" }}>
          <NowBar />

          {/* Sticky chapter label — rides the top edge of ch3 while you scroll */}
          <div
            className="sticky top-0 z-20 flex items-center gap-4 px-6 md:px-16 py-2 border-b border-white/5"
            style={{ background: "rgba(10,10,10,0.85)", backdropFilter: "blur(8px)" }}
          >
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-signal/40 pointer-events-none">
              03 — Systems
            </span>
            <div className="flex-1 h-px bg-signal/10" />
          </div>

          {/* NOW */}
          <section id="now" className="py-24 px-6 md:px-16 border-t border-white/10">
            <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
              <SectionHeading eyebrow="Now">What I&apos;m on this month</SectionHeading>
              <span className="font-mono text-xs text-[#555] mb-12">Updated {nowLastUpdated}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
              {now.map((item, i) => (
                <motion.div
                  key={item.heading}
                  className="flex gap-5"
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.4 }}
                >
                  <span className="font-mono text-[11px] text-signal/60 pt-1.5 shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-display font-bold text-lg text-signal mb-2">{item.heading}</h3>
                    <p className="text-[#999] font-body leading-relaxed">{item.content}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* SELECTED WORK — no cards; each project is a scene */}
          <section id="work" className="py-24 px-6 md:px-16 border-t border-white/10">
            <SectionHeading eyebrow="Selected work">Things I&apos;ve built</SectionHeading>
            <p className="text-[#888] font-body -mt-6 mb-4">Currently shipping.</p>
            <div>
              {currentProjects.map((project, i) => (
                <ProjectStation key={project.id} project={project} index={i} />
              ))}
            </div>

            <div className="mt-4">
              <p className="font-mono text-[11px] uppercase tracking-wider text-[#666] mb-2 pt-8">
                Earlier — the track record
              </p>
              <div>
                {earlierProjects.map((p, i) => (
                  <motion.div
                    key={p.id}
                    className="flex flex-col md:flex-row md:items-baseline gap-x-6 gap-y-1 py-5 border-b border-white/5 last:border-b-0 group"
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ delay: i * 0.05, duration: 0.4 }}
                  >
                    <h4 className="font-display font-bold text-lg text-white group-hover:text-signal transition-colors shrink-0">
                      {p.title}
                    </h4>
                    <span className="font-mono text-xs text-[#555] shrink-0">{p.year}</span>
                    <p className="text-[#888] font-body text-sm flex-1">{p.tagline}</p>
                    {p.metrics[0] && (
                      <span className="font-mono text-[11px] text-[#777] shrink-0">
                        <span style={{ color: p.accent }}>{p.metrics[0].value}</span> · {p.metrics[0].label}
                      </span>
                    )}
                    {p.hasCaseStudy && (
                      <Link
                        href={`/projects/${p.slug}`}
                        className="font-mono text-xs text-signal hover:text-white transition-colors shrink-0"
                      >
                        case study →
                      </Link>
                    )}
                  </motion.div>
                ))}
              </div>
              <Link
                href="/projects"
                className="inline-block mt-8 font-body text-sm text-[#888] hover:text-signal transition-colors"
              >
                All projects, full record →
              </Link>
            </div>
          </section>
        </div>

        {/* ───────────────────────────────────────────────────────────────────
            CHAPTER 4 — RESEARCH  (canvas re-brightens + shifts signal→phase blue)
            ─────────────────────────────────────────────────────────────────── */}
        <div ref={ch4Ref} id="research" style={{ position: "relative" }}>
          <div
            className="sticky top-0 z-20 flex items-center gap-4 px-6 md:px-16 py-2 border-b border-white/5"
            style={{ background: "rgba(10,10,10,0.85)", backdropFilter: "blur(8px)" }}
          >
            <span
              className="font-mono text-[10px] tracking-[0.3em] uppercase pointer-events-none"
              style={{ color: "rgba(94,140,219,0.5)" }}
            >
              04 — Research
            </span>
            <div className="flex-1 h-px" style={{ background: "rgba(94,140,219,0.12)" }} />
          </div>
          <ResearchSection />
        </div>

        {/* ───────────────────────────────────────────────────────────────────
            CHAPTER 5 — TRANSMISSION  (canvas fades toward black at the close)
            ─────────────────────────────────────────────────────────────────── */}
        <div ref={ch5Ref} style={{ position: "relative" }}>
          <div
            className="sticky top-0 z-20 flex items-center gap-4 px-6 md:px-16 py-2 border-b border-white/5"
            style={{ background: "rgba(10,10,10,0.85)", backdropFilter: "blur(8px)" }}
          >
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/20 pointer-events-none">
              05 — Transmission
            </span>
            <div className="flex-1 h-px bg-white/5" />
          </div>

          {/* TIMELINE */}
          <section id="about" className="py-28 px-6 md:px-16 border-t border-white/10">
            <SectionHeading eyebrow="Timeline">The track</SectionHeading>
            <Timeline />
          </section>

          {/* EDUCATION */}
          <section className="py-24 px-6 md:px-16 border-t border-white/10">
            <SectionHeading eyebrow="Education">Where I study</SectionHeading>
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 max-w-4xl">
              <div>
                <h3 className="font-display font-bold text-2xl text-white">{education.school}</h3>
                <p className="text-[#888] font-body mt-1">{education.degree}</p>
                <p className="text-[#555] font-mono text-sm mt-2">
                  {education.location} · {education.start}–{education.expected} (expected)
                </p>
                <p className="text-[#777] font-body text-sm mt-4 max-w-md">{education.note}</p>
              </div>
              <div className="md:text-right">
                <p className="font-mono text-[11px] uppercase tracking-wider text-[#666] mb-3">
                  Relevant coursework
                </p>
                <div className="flex flex-wrap md:justify-end gap-2 max-w-sm">
                  {education.coursework.map((c) => (
                    <span key={c} className="font-mono text-[11px] px-2 py-1 border border-white/10 text-[#888]">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* STACK */}
          <section className="py-24 px-6 md:px-16 border-t border-white/10">
            <SectionHeading eyebrow="Stack">What I build with</SectionHeading>
            <SkillCloud />
          </section>

          {/* EXPERIENCE */}
          <section className="py-24 px-6 md:px-16 border-t border-white/10">
            <SectionHeading eyebrow="Experience">Where I&apos;ve been</SectionHeading>
            <ExperienceAccordion />
          </section>

          {/* LEADERSHIP */}
          <section className="py-24 px-6 md:px-16 border-t border-white/10">
            <SectionHeading eyebrow="Beyond the screen">What else I run</SectionHeading>
            <LeadershipGrid />
          </section>

          {/* RECOGNITION */}
          <section className="py-24 px-6 md:px-16 border-t border-white/10">
            <SectionHeading eyebrow="Recognition">On the record</SectionHeading>
            <div className="border-t border-white/10">
              {awards.map((award, i) => (
                <motion.div
                  key={i}
                  className="border-b border-white/10 py-5 flex items-baseline justify-between gap-8"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                >
                  <span className="font-body text-white">{award.title}</span>
                  <span className="text-[#555] font-mono text-sm shrink-0 text-right">{award.detail}</span>
                </motion.div>
              ))}
            </div>
          </section>

          {/* CONTACT */}
          <div id="contact">
            <ContactSection />
          </div>
        </div>
      </main>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Page shell — manages loader gate; HomeContent only mounts after loader done
// ─────────────────────────────────────────────────────────────────────────────
export default function Home() {
  const [loaded, setLoaded] = useState(false);

  return (
    <SmoothScroll>
      <SceneCanvas />
      <AnimatePresence>{!loaded && <Loader onComplete={() => setLoaded(true)} />}</AnimatePresence>
      {loaded && <HomeContent />}
    </SmoothScroll>
  );
}
