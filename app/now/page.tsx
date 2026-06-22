import { now, nowLastUpdated } from "@/data/now";

export const metadata = {
  title: "Now — Chaitanya Tripathi",
  description: "What Chaitanya Tripathi is actively working on right now.",
};

export default function NowPage() {
  return (
    <main className="pt-32 pb-24 px-6 md:px-16 max-w-2xl">
      <h1 className="font-display font-bold text-6xl text-white mb-4">Now.</h1>
      <p className="text-[#555] font-mono text-sm mb-16">
        A snapshot of current focus. Last update: {nowLastUpdated}.
      </p>

      {now.map((item) => (
        <div key={item.heading} className="mb-12 border-l-2 border-signal/30 pl-6">
          <h2 className="font-display font-bold text-xl text-signal mb-3">{item.heading}</h2>
          <p className="text-[#888] font-body leading-relaxed">{item.content}</p>
        </div>
      ))}

      <p className="text-[#444] font-mono text-xs mt-16">
        Inspired by <span className="text-[#666]">nownownow.com</span> — a page about what I&apos;m
        focused on now, not a résumé.
      </p>
    </main>
  );
}
