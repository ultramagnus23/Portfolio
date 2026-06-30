"use client";

import { useAudio } from "@/hooks/useAudio";

export default function AudioToggle() {
  const { muted, toggle } = useAudio();

  return (
    <button
      onClick={toggle}
      aria-label={muted ? "Unmute ambient audio" : "Mute ambient audio"}
      title={muted ? "Unmute [M]" : "Mute [M]"}
      className="flex items-center gap-1.5 group"
    >
      {/* Sine-wave icon */}
      <svg
        width="20"
        height="12"
        viewBox="0 0 20 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`transition-colors duration-200 ${
          muted ? "text-[#333]" : "text-signal"
        } group-hover:text-signal`}
        aria-hidden="true"
      >
        <path
          d="M1 6 C3 6, 3 1, 5 1 C7 1, 7 11, 9 11 C11 11, 11 1, 13 1 C15 1, 15 11, 17 11 C19 11, 19 6, 19 6"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
        {muted && (
          <line
            x1="2"
            y1="2"
            x2="18"
            y2="10"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        )}
      </svg>
      <span
        className={`font-mono text-[10px] tracking-[0.15em] transition-colors duration-200 ${
          muted ? "text-[#333]" : "text-signal"
        } group-hover:text-signal`}
      >
        {muted ? "muted" : "on"}
      </span>
    </button>
  );
}
