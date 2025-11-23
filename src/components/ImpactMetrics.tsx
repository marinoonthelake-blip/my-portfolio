"use client";

const metrics = [
  {
    value: "1.4M",
    label: "Citizens Mapped",
    desc: "Digital enfranchisement for Rio's favelas (Beyond the Map).",
    color: "text-[#0070F3]"
  },
  {
    value: "$300k+",
    label: "Annual Efficiency",
    desc: "Reclaimed management hours via AI Automation (SlideSense).",
    color: "text-[#00FF94]"
  },
  {
    value: "50M+",
    label: "User Engagement",
    desc: "Viral interaction scale for early web campaigns (Monk-e-Mail).",
    color: "text-[#FF0055]"
  }
];

export default function ImpactMetrics() {
  return (
    <section className="w-full max-w-7xl mx-auto px-6 py-24 border-b border-gray-800">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {metrics.map((m) => (
          <div key={m.label} className="flex flex-col items-start">
            <h3 className={`text-6xl md:text-8xl font-bold font-sans mb-4 ${m.color}`}>
              {m.value}
            </h3>
            <h4 className="text-xl text-white font-bold uppercase tracking-wider mb-2">
              {m.label}
            </h4>
            <p className="text-gray-400 font-mono text-sm max-w-xs">
              {m.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}