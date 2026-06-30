"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ContactSection() {
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText("chaitanyat213@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-32 px-6 md:px-16 border-t border-white/10">
      <div className="max-w-4xl">
        <motion.h2
          className="font-display font-bold text-5xl md:text-7xl text-white mb-8"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Let&apos;s talk.
        </motion.h2>

        <motion.p
          className="text-[#888] font-body text-lg leading-relaxed max-w-xl mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          I&apos;m open to internships (June–August 2026), freelance projects, and
          conversations with people building interesting things.
        </motion.p>

        <motion.div
          className="flex flex-wrap items-center gap-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <button
            onClick={copyEmail}
            className="font-mono text-signal hover:text-white transition-colors relative group flex items-center gap-2"
          >
            chaitanyat213@gmail.com
            <span className="text-[#555] text-xs group-hover:text-signal transition-colors">
              [copy]
            </span>
            <AnimatePresence>
              {copied && (
                <motion.span
                  className="absolute -top-8 left-0 text-xs bg-signal text-black px-2 py-1 font-mono"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                >
                  copied.
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          <a
            href="https://github.com/ultramagnus23"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[#888] hover:text-white transition-colors"
          >
            GitHub ↗
          </a>

          <a
            href="https://www.linkedin.com/in/chaitanya-tripathi-cs/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[#888] hover:text-white transition-colors"
          >
            LinkedIn ↗
          </a>
        </motion.div>
      </div>
    </section>
  );
}
