"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const copyEmail = () => {
    navigator.clipboard.writeText("chaitanyat213@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between transition-all duration-300 ${
        scrolled ? "bg-[#0a0a0a]/95 backdrop-blur-sm border-b border-white/5" : "bg-transparent"
      }`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 2.2, duration: 0.5 }}
    >
      <Link
        href="/"
        className="font-display font-bold text-white text-lg tracking-tight hover:text-signal transition-colors"
      >
        ct.
      </Link>

      <div className="hidden md:flex items-center gap-8 text-sm font-body text-[#888]">
        {[
          { label: "work", href: "/projects" },
          { label: "now", href: "/now" }
        ].map(({ label, href }) => (
          <Link
            key={label}
            href={href}
            className="hover:text-white transition-colors relative group"
          >
            {label}
            <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-signal group-hover:w-full transition-all duration-200" />
          </Link>
        ))}

        <button
          onClick={copyEmail}
          className="flex items-center gap-2 text-signal hover:text-white transition-colors"
        >
          <span className="w-2 h-2 rounded-full bg-signal animate-pulse" />
          {copied ? "copied." : "available"}
        </button>
      </div>
    </motion.nav>
  );
}
