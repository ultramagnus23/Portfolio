"use client";

import { useState, Suspense, lazy } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Loader from "@/components/Loader";
import NowBar from "@/components/NowBar";
import ScrambleText from "@/components/ScrambleText";
import Magnetic from "@/components/Magnetic";
import ProjectCard from "@/components/ProjectCard";
import ResearchSection from "@/components/ResearchSection";
import Timeline from "@/components/Timeline";
import SkillCloud from "@/components/SkillCloud";
import ExperienceAccordion from "@/components/ExperienceAccordion";
import LeadershipGrid from "@/components/LeadershipGrid";
import ContactSection from "@/components/ContactSection";
import { currentProjects, earlierProjects } from "@/data/projects";
import { now, nowLastUpdated } from "@/data/now";
import { education } from "@/data/education";
import { awards } from "@/data/awards";

const HeroCanvas = lazy(() => import("@/components/HeroCanvas"));

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

export default function Home() {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      <AnimatePresence>{!loaded && <Loader onComplete={() => setLoaded(true)} />}</AnimatePresence>

      <AnimatePresence>
        {loaded && (
          <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            {/* ───────── HERO ───────── */}
            <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
              <Suspense fallback={null}>
                <HeroCanvas />
              </Suspense>

              <div className="relative z-10 px-6 md:px-16 pt-24">
                <motion.p
                  className="text-signal text-xs tracking-[0.3em] uppercase font-mono mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  Builder · Researcher · Ashoka University
                </motion.p>

                <ScrambleText
                  as="h1"
                  trigger="mount"
                  speed={36}
                  text="Chaitanya Tripathi."
                  className="font-display font-bold text-[clamp(44px,8vw,96px)] text-white leading-[0.95] mb-6 block max-w-4xl"
                />

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
                      className="inline-block border border-signal text-signal px-6 py-2.5 font-body text-sm hover:bg-signal hover:text-black transition-colors"
                    >
                      View work ↓
                    </a>
                  </Magnetic>
                  <Magnetic>
                    <a
                      href="#research"
                      className="inline-block border border-white/20 text-white px-6 py-2.5 font-body text-sm hover:border-white transition-colors"
                    >
                      Read the research →
                    </a>
                  </Magnetic>
                </motion.div>
              </div>

              <motion.div
                className="absolute bottom-8 left-6 md:left-16"
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <div className="w-px h-12 bg-signal/50" />
              </motion.div>
            </section>

            <NowBar />

            {/* ───────── NOW ───────── */}
            <section id="now" className="py-24 px-6 md:px-16 border-t border-white/10">
              <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
                <SectionHeading eyebrow="Now">What I&apos;m on this month</SectionHeading>
                <span className="font-mono text-xs text-[#555] mb-12">Updated {nowLastUpdated}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
                {now.map((item) => (
                  <motion.div
                    key={item.heading}
                    className="border-l-2 border-signal/30 pl-6"
                    initial={{ opacity: 0, x: -15 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.4 }}
                  >
                    <h3 className="font-display font-bold text-lg text-signal mb-2">{item.heading}</h3>
                    <p className="text-[#999] font-body leading-relaxed">{item.content}</p>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* ───────── SELECTED WORK ───────── */}
            <section id="work" className="py-24 px-6 md:px-16 border-t border-white/10">
              <SectionHeading eyebrow="Selected work">Things I&apos;ve built</SectionHeading>
              <p className="text-[#888] font-body -mt-6 mb-12">
                Currently shipping. Click any card to open the technical breakdown.
              </p>

              <div className="grid grid-cols-1 gap-5">
                {currentProjects.map((project, i) => (
                  <ProjectCard key={project.id} project={project} index={i} />
                ))}
              </div>

              {/* Earlier work — condensed */}
              <div className="mt-20">
                <p className="font-mono text-[11px] uppercase tracking-wider text-[#666] mb-6">
                  Earlier — the track record
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {earlierProjects.map((p, i) => (
                    <motion.div
                      key={p.id}
                      className="border border-white/10 p-6 hover:bg-white/[0.02] transition-colors group"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{ delay: i * 0.08, duration: 0.4 }}
                    >
                      <div className="flex items-baseline justify-between mb-3">
                        <h4 className="font-display font-bold text-xl text-white group-hover:text-signal transition-colors">
                          {p.title}
                        </h4>
                        <span className="font-mono text-xs text-[#555]">{p.year}</span>
                      </div>
                      <p className="text-[#888] font-body text-sm leading-relaxed mb-4">{p.tagline}</p>
                      <div className="flex flex-wrap gap-x-4 gap-y-1">
                        {p.metrics.slice(0, 2).map((m) => (
                          <span key={m.label} className="font-mono text-[11px] text-[#777]">
                            <span style={{ color: p.accent }}>{m.value}</span> · {m.label}
                          </span>
                        ))}
                      </div>
                      {p.hasCaseStudy && (
                        <Link
                          href={`/projects/${p.slug}`}
                          className="inline-block mt-4 font-mono text-xs text-signal hover:text-white transition-colors"
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

            {/* ───────── RESEARCH ───────── */}
            <ResearchSection />

            {/* ───────── ABOUT ───────── */}
            <section id="about" className="py-28 px-6 md:px-16 border-t border-white/10">
              <SectionHeading eyebrow="Who I am">The signal</SectionHeading>
              <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-16">
                <div className="space-y-6 max-w-2xl">
                  <p className="text-white/85 font-body text-lg leading-relaxed">
                    Here&apos;s the throughline, if you want one: I keep building systems that make
                    something messy legible. CollegeApp started it — I was sixteen, six thousand people
                    showed up, and I learned a problem is only real if strangers care. CollegeOS is the
                    serious version. Meza does it for restaurants; FoodSafe does it for the food itself,
                    pulling toxins out of government PDFs nobody reads.
                  </p>
                  <p className="text-white/85 font-body text-lg leading-relaxed">
                    But I don&apos;t think of myself as only a builder. I&apos;ve spent time recording
                    the soundscape around Jama Masjid — the azaan, the pigeons, a thousand overlapping
                    conversations — trying to compose <em>with</em> a place instead of about it. I design
                    murder-mystery games for my friends, which is really just systems design with
                    suspects. And lately I&apos;m obsessed with holographic displays — not as a product,
                    just because the question of when a fake image starts fooling a real eye is genuinely
                    beautiful to me.
                  </p>
                  <p className="text-white/85 font-body text-lg leading-relaxed">
                    I&apos;m nineteen. The actual skill is finding signal in noise — whether the noise is
                    admissions data, a POS export, or a 532-nanometre wavefront. If you&apos;re building
                    something that needs that, let&apos;s talk.
                  </p>
                </div>
                <Timeline />
              </div>
            </section>

            {/* ───────── EDUCATION ───────── */}
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
                      <span
                        key={c}
                        className="font-mono text-[11px] px-2 py-1 border border-white/10 text-[#888]"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* ───────── STACK ───────── */}
            <section className="py-24 px-6 md:px-16 border-t border-white/10">
              <SectionHeading eyebrow="Stack">What I build with</SectionHeading>
              <SkillCloud />
            </section>

            {/* ───────── EXPERIENCE ───────── */}
            <section className="py-24 px-6 md:px-16 border-t border-white/10">
              <SectionHeading eyebrow="Experience">Where I&apos;ve been</SectionHeading>
              <ExperienceAccordion />
            </section>

            {/* ───────── LEADERSHIP ───────── */}
            <section className="py-24 px-6 md:px-16 border-t border-white/10">
              <SectionHeading eyebrow="Beyond the screen">What else I run</SectionHeading>
              <LeadershipGrid />
            </section>

            {/* ───────── RECOGNITION ───────── */}
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

            {/* ───────── CONTACT ───────── */}
            <div id="contact">
              <ContactSection />
            </div>
          </motion.main>
        )}
      </AnimatePresence>
    </>
  );
}
