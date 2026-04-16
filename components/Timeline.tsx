"use client";

import { motion } from "framer-motion";

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
    event: "CollegeApp. Built for seniors. 6,500 users showed up without being invited.",
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

export default function Timeline() {
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
          {/* Year + line */}
          <div className="flex flex-col items-center shrink-0 w-12">
            <span className="text-signal text-xs font-mono font-bold">{item.year}</span>
            <div className="w-px flex-1 bg-white/10 mt-2 min-h-[40px]" />
          </div>

          {/* Event */}
          <div className="pb-8 pt-0.5">
            <p className="text-[#888] font-body text-sm leading-relaxed">{item.event}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
