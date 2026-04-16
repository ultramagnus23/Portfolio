export default function WritingPage() {
  const stubs = [
    {
      slug: "brier-score",
      title: "Brier Score as a product metric: why prediction honesty matters",
      category: "Technical",
      status: "being written"
    },
    {
      slug: "on-haunting",
      title: "On haunting: what Wuthering Heights gets right about grief",
      category: "Essay",
      status: "being written"
    },
    {
      slug: "yamuna",
      title: "The Yamuna as an instrument: notes on sound and place",
      category: "Personal",
      status: "being written"
    },
  ];

  return (
    <main className="pt-32 pb-24 px-6 md:px-16">
      <h1 className="font-display font-bold text-6xl text-white mb-4">Writing.</h1>
      <p className="text-[#888] font-body mb-16">Thinking out loud.</p>

      <div className="space-y-0 border-t border-white/10">
        {stubs.map((stub) => (
          <div
            key={stub.slug}
            className="border-b border-white/10 py-8 flex items-start justify-between gap-8 opacity-60"
          >
            <div className="space-y-2">
              <span className="text-xs font-mono text-signal border border-signal/30 px-2 py-0.5 inline-block">
                {stub.category}
              </span>
              <h2 className="font-body text-white text-xl">{stub.title}</h2>
            </div>
            <span className="text-[#555] font-mono text-sm shrink-0 mt-2">{stub.status} →</span>
          </div>
        ))}
      </div>
    </main>
  );
}
