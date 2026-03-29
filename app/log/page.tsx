export default function LogPage() {
  const entries = [
    {
      date: "2026-03",
      topic: "Master Theorem",
      tags: ["algorithms", "discrete-maths", "cs"],
      content: [
        "Spent three days confused about why T(n) = aT(n/b) + f(n) felt completely opaque. The textbook formula made sense algebraically but I couldn't see what it was actually saying.",
        "Drew the recursion tree. Suddenly obvious. Each level does f(n/b^i) work, there are log_b(n) levels, and the leaves do a^(log_b n) = n^(log_b a) work each. The theorem is just asking: which dominates?",
        "Lesson: draw before you read the formula. The visual made the algebra obvious in 20 minutes what three days of formula-staring didn't."
      ]
    },
    {
      date: "2026-02",
      topic: "Brier Score vs Accuracy",
      tags: ["ml", "calibration", "collegeos"],
      content: [
        "A model that always predicts 'rejected' for a top-10 US university application is 85% accurate. It is completely useless. This is the accuracy problem.",
        "Brier Score measures the mean squared error of probabilistic predictions. A model saying 70% for a given outcome should be correct 70% of the time — across all instances where it said 70%. That's calibration. Accuracy doesn't care.",
        "CollegeOS uses Brier Score for exactly this reason. If we say 'you have a 62% chance at this school' we need to be right 62% of the time across all students we said that about. Anything else is noise dressed up as signal."
      ]
    }
  ];

  return (
    <main className="pt-32 pb-24 px-6 md:px-16 max-w-3xl">
      <h1 className="font-display font-bold text-6xl text-white mb-4">Log.</h1>
      <p className="text-[#888] font-body mb-16">What clicked and why.</p>

      <div className="space-y-16">
        {entries.map((entry) => (
          <article key={entry.topic} className="border-t border-white/10 pt-12">
            <div className="flex items-center gap-4 mb-6">
              <span className="font-mono text-xs text-[#555]">{entry.date}</span>
              <div className="flex gap-2">
                {entry.tags.map((tag) => (
                  <span key={tag} className="text-xs font-mono text-signal border border-signal/20 px-2 py-0.5">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <h2 className="font-display font-bold text-3xl text-white mb-8">{entry.topic}</h2>
            <div className="space-y-4">
              {entry.content.map((para, i) => (
                <p key={i} className="text-[#888] font-body leading-relaxed">{para}</p>
              ))}
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
