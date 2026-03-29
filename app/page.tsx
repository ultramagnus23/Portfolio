"use client";

import { useState, Suspense, lazy } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "@/components/Loader";
import NowBar from "@/components/NowBar";
import ProjectRow from "@/components/ProjectRow";
import Timeline from "@/components/Timeline";
import SkillCloud from "@/components/SkillCloud";
import ExperienceAccordion from "@/components/ExperienceAccordion";
import LeadershipGrid from "@/components/LeadershipGrid";
import ContactSection from "@/components/ContactSection";
import { projects } from "@/data/projects";
import { awards } from "@/data/awards";

const HeroCanvas = lazy(() => import("@/components/HeroCanvas"));

export default function Home() {
  const [loaded, setLoaded] = useState(false);

  const writingStubs = [
    {
      title: "Brier Score as a product metric: why prediction honesty matters",
      category: "Technical",
    },
    {
      title: "On haunting: what Wuthering Heights gets right about grief",
      category: "Essay",
    },
    {
      title: "The Yamuna as an instrument: notes on sound and place",
      category: "Personal",
    },
  ];

  return (
    <>
      <AnimatePresence>
        {!loaded && <Loader onComplete={() => setLoaded(true)} />}
      </AnimatePresence>

      <AnimatePresence>
        {loaded && (
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* HERO */}
            <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
              <Suspense fallback={null}>
                <HeroCanvas />
              </Suspense>

              <div className="relative z-10 px-6 md:px-16 pt-24">
                <motion.p
                  className="text-signal text-xs tracking-[0.3em] uppercase font-body mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  CS Undergrad · Ashoka University · Builder
                </motion.p>

                <motion.h1
                  className="font-display font-bold text-[clamp(48px,8vw,96px)] text-white leading-none mb-6"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35, duration: 0.6 }}
                >
                  Chaitanya<br />Tripathi.
                </motion.h1>

                <motion.p
                  className="text-[#888] font-body text-lg max-w-md mb-10 leading-relaxed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.55, duration: 0.5 }}
                >
                  I find signal in noise.
                  <br />
                  Products, data, whatever problem I&apos;m obsessed with this month.
                </motion.p>

                <motion.div
                  className="flex items-center gap-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                >
                  <a
                    href="#work"
                    className="border border-signal text-signal px-6 py-2.5 font-body text-sm hover:bg-signal hover:text-black transition-colors"
                  >
                    View work ↓
                  </a>
                  <a
                    href="#contact"
                    className="border border-white/20 text-white px-6 py-2.5 font-body text-sm hover:border-white transition-colors"
                  >
                    Get in touch →
                  </a>
                </motion.div>

                {/* Scroll indicator */}
                <motion.div
                  className="absolute bottom-8 left-6 md:left-16 flex flex-col items-center gap-2"
                  animate={{ y: [0, 8, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <div className="w-px h-12 bg-signal/50" />
                </motion.div>
              </div>
            </section>

            {/* NOW BAR */}
            <NowBar />

            {/* PROJECTS */}
            <section id="work" className="py-24 px-6 md:px-16">
              <motion.div
                className="mb-16"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="font-display font-bold text-5xl md:text-6xl text-white mb-3">
                  Work.
                </h2>
                <p className="text-[#888] font-body">
                  Things I&apos;ve built, shipped, and obsessed over.
                </p>
              </motion.div>

              <div>
                {projects.map((project, i) => (
                  <ProjectRow key={project.id} project={project} index={i} />
                ))}
              </div>
            </section>

            {/* ABOUT */}
            <section className="py-24 px-6 md:px-16 border-t border-white/10">
              <motion.h2
                className="font-display font-bold text-5xl md:text-6xl text-white mb-16"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                The signal.
              </motion.h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                {/* Timeline */}
                <Timeline />

                {/* Text */}
                <motion.div
                  className="space-y-6"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <p className="text-white/80 font-body text-lg leading-relaxed">
                    I&apos;m 19 and I&apos;ve been building things since I was 15. Not for CVs — for the
                    feeling when something you made works for someone who needed it.
                  </p>
                  <p className="text-white/80 font-body text-lg leading-relaxed">
                    I find pattern where there&apos;s noise. That&apos;s the thread connecting a
                    lake-cleansing protocol to a restaurant analytics engine to a college
                    admissions predictor. The same problem: how do you make something
                    complicated legible?
                  </p>
                  <p className="text-white/80 font-body text-lg leading-relaxed">
                    I&apos;m a first year CS student at Ashoka, a freelancer, and a
                    founder-in-progress. If you&apos;re building something interesting, let&apos;s talk.
                  </p>
                </motion.div>
              </div>
            </section>

            {/* SKILLS */}
            <section className="py-24 px-6 md:px-16 border-t border-white/10">
              <motion.h2
                className="font-display font-bold text-5xl md:text-6xl text-white mb-12"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                The stack.
              </motion.h2>
              <SkillCloud />
            </section>

            {/* EXPERIENCE */}
            <section className="py-24 px-6 md:px-16 border-t border-white/10">
              <motion.h2
                className="font-display font-bold text-5xl md:text-6xl text-white mb-12"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                Where I&apos;ve been.
              </motion.h2>
              <ExperienceAccordion />
            </section>

            {/* LEADERSHIP */}
            <section className="py-24 px-6 md:px-16 border-t border-white/10">
              <motion.h2
                className="font-display font-bold text-5xl md:text-6xl text-white mb-12"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                Beyond the screen.
              </motion.h2>
              <LeadershipGrid />
            </section>

            {/* AWARDS */}
            <section className="py-24 px-6 md:px-16 border-t border-white/10">
              <motion.h2
                className="font-display font-bold text-5xl md:text-6xl text-white mb-12"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                Recognition.
              </motion.h2>
              <div className="space-y-0 border-t border-white/10">
                {awards.map((award, i) => (
                  <motion.div
                    key={i}
                    className="border-b border-white/10 py-5 flex items-baseline justify-between gap-8"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06, duration: 0.3 }}
                  >
                    <span className="font-body text-white">{award.title}</span>
                    <span className="text-[#555] font-mono text-sm shrink-0">{award.detail}</span>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* WRITING STUBS */}
            <section className="py-24 px-6 md:px-16 border-t border-white/10">
              <motion.div
                className="mb-12"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="font-display font-bold text-5xl md:text-6xl text-white mb-3">
                  Thinking out loud.
                </h2>
              </motion.div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-t border-l border-white/10">
                {writingStubs.map((stub, i) => (
                  <motion.div
                    key={i}
                    className="border-b border-r border-white/10 p-8 hover:opacity-70 transition-opacity"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 0.5 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.4 }}
                  >
                    <span className="text-xs font-mono text-signal border border-signal/30 px-2 py-0.5 mb-4 inline-block">
                      {stub.category}
                    </span>
                    <h3 className="font-body text-white text-base leading-snug mb-4">
                      {stub.title}
                    </h3>
                    <p className="text-[#555] font-mono text-xs">being written →</p>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* CONTACT */}
            <div id="contact">
              <ContactSection />
            </div>
          </motion.main>
        )}
      </AnimatePresence>
    </>
  );
}
