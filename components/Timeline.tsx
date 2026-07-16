"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { gsap, ScrollTrigger, ensureScrollTrigger } from "@/lib/gsap";

const timelineItems = [
  {
    year: "2022",
    event: "First freelance client. First real money from code. Built for e-commerce, corporates, nonprofits.",
  },
  {
    year: "2022",
    event: "Klein B. Studied eutrophication. Proposed a water flea and a fern as a lake-cleansing system. It worked on paper.",
  },
  {
    year: "2022",
    event: "CollegeApp. Built for seniors. 6,000 users showed up without being invited.",
  },
  {
    year: "2023",
    event: "Orenth. Pitched to TiE Global. Top 25 worldwide. Stood at India Mobile Congress next to Airtel and Jio. One of 5 schools in the country to be there.",
  },
  {
    year: "2023",
    event: "MUN Head. JPGSMUN 1.0 and 1.1. 200+ participants. Deputy Head Boy. 500+ student council.",
  },
  {
    year: "2024",
    event: "Obbserv. Built and launched a Gen Z brand from scratch. Market research, identity, influencer strategy, launch campaign.",
  },
  {
    year: "2025",
    event: "Ashoka University. CS. Year one. CollegeOS. Meza. Building in public.",
  },
];

/** Accessible fallback: the original vertical fade list. Additive, not a
 *  replacement — only rendered under prefers-reduced-motion. */
function VerticalTimeline() {
  return (
    <div className="space-y-0">
      {timelineItems.map((item, i) => (
        <motion.div
          key={i}
          className="flex gap-8 relative"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ delay: i * 0.08, duration: 0.4 }}
        >
          <div className="flex flex-col items-center shrink-0 w-12">
            <span className="text-signal text-xs font-mono font-bold">{item.year}</span>
            <div className="w-px flex-1 bg-white/10 mt-2 min-h-[40px]" />
          </div>
          <div className="pb-8 pt-0.5">
            <p className="text-[#888] font-body text-sm leading-relaxed">{item.event}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/** Horizontal scroll-jacked sequence: vertical scroll input drives horizontal
 *  motion through the track, GSAP-pinned for the section's scroll range. The
 *  centered milestone reads as "opening a memory" — scaled up, in full focus
 *  — while neighbors recede via blur/scale/opacity. DOM order (and therefore
 *  tab order) is untouched: this only ever transforms visual position. */
function HorizontalTimeline() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const barRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const [pinned, setPinned] = useState(false);

  useLayoutEffect(() => {
    ensureScrollTrigger();
    const wrapper = wrapperRef.current;
    const track = trackRef.current;
    if (!wrapper || !track) return;

    const ctx = gsap.context(() => {
      const distance = () => track.scrollWidth - window.innerWidth;

      const st = ScrollTrigger.create({
        trigger: wrapper,
        start: "top top",
        end: () => "+=" + Math.max(distance(), 1),
        pin: true,
        scrub: 0.8,
        onToggle: (self) => setPinned(self.isActive),
        onUpdate: (self) => {
          const x = -distance() * self.progress;
          gsap.set(track, { x });
          if (barRef.current) gsap.set(barRef.current, { scaleX: self.progress });
          if (counterRef.current) {
            const idx = Math.min(
              timelineItems.length - 1,
              Math.round(self.progress * (timelineItems.length - 1))
            );
            counterRef.current.textContent = `${idx + 1} / ${timelineItems.length}`;
          }

          const viewportCenter = window.innerWidth / 2;
          cardRefs.current.forEach((card) => {
            if (!card) return;
            const rect = card.getBoundingClientRect();
            const cardCenter = rect.left + rect.width / 2;
            const dist = Math.abs(cardCenter - viewportCenter);
            const t = Math.min(1, dist / (window.innerWidth * 0.55));
            const scale = gsap.utils.interpolate(1, 0.82, t);
            const opacity = gsap.utils.interpolate(1, 0.35, t);
            const blur = gsap.utils.interpolate(0, 6, t);
            card.style.transform = `scale(${scale})`;
            card.style.opacity = String(opacity);
            card.style.filter = `blur(${blur}px)`;
          });
        },
      });

      return () => st.kill();
    }, wrapper);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={wrapperRef} style={{ position: "relative" }}>
      <div style={{ height: "100vh", overflow: "hidden" }} className="flex items-center">
        <div ref={trackRef} className="flex gap-16 md:gap-24 px-[10vw] will-change-transform">
          {timelineItems.map((item, i) => (
            <div
              key={i}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              tabIndex={0}
              className="shrink-0 w-[80vw] md:w-[420px] transition-none outline-none focus-visible:ring-1 focus-visible:ring-signal/70 rounded-sm"
              style={{ transformOrigin: "center center" }}
            >
              <span className="text-signal text-sm font-mono font-bold block mb-4">{item.year}</span>
              <div className="w-10 h-px bg-signal/40 mb-4" />
              <p className="text-white/85 font-body text-lg leading-relaxed">{item.event}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Progress indicator — visible only while the section is pinned */}
      <div
        className="fixed bottom-8 left-6 right-6 md:left-16 md:right-16 z-30 pointer-events-none transition-opacity duration-300"
        style={{ opacity: pinned ? 1 : 0 }}
        aria-hidden="true"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-signal/60">
            The track
          </span>
          <span ref={counterRef} className="font-mono text-[10px] text-white/50">
            1 / {timelineItems.length}
          </span>
        </div>
        <div className="h-px bg-white/10 overflow-hidden">
          <div ref={barRef} className="h-full bg-signal origin-left" style={{ transform: "scaleX(0)" }} />
        </div>
      </div>
    </div>
  );
}

export default function Timeline() {
  const reduced = usePrefersReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // SSR / first paint always matches the accessible vertical list; the
  // scroll-jacked version only takes over once mounted and motion is allowed,
  // avoiding a hydration mismatch on the pin math.
  if (!mounted || reduced) return <VerticalTimeline />;
  return <HorizontalTimeline />;
}
