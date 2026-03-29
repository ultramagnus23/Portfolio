export default function NowPage() {
  return (
    <main className="pt-32 pb-24 px-6 md:px-16 max-w-2xl">
      <h1 className="font-display font-bold text-6xl text-white mb-4">Now.</h1>
      <p className="text-[#555] font-mono text-sm mb-16">Updated manually. Last update: March 2026.</p>

      {[
        {
          heading: "Building",
          content: "CollegeOS launch prep (Postgres migration done, scraper running). Meza schema design — trying to represent every signal type from day one."
        },
        {
          heading: "Studying",
          content: "Discrete Maths (Master Theorem, recurrences). Kleppmann DDIA — currently on replication and consistency."
        },
        {
          heading: "Learning",
          content: "Fast.ai alongside Brier Score calibration work. The two are more related than they seem."
        },
        {
          heading: "Thinking about",
          content: "Whether three shipped projects beats one internship. Genuinely uncertain."
        },
        {
          heading: "Not doing",
          content: "LeetCode. Sitting still. Sleeping enough."
        },
      ].map((item) => (
        <div key={item.heading} className="mb-12 border-l-2 border-signal/30 pl-6">
          <h2 className="font-display font-bold text-xl text-signal mb-3">{item.heading}</h2>
          <p className="text-[#888] font-body leading-relaxed">{item.content}</p>
        </div>
      ))}
    </main>
  );
}
