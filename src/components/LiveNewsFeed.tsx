"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const NEWS_ITEMS = [
  { source: "ARXIV", category: "AI", text: "DeepSeek-V3 paper reveals 40% efficiency gain in MoE architectures." },
  { source: "REDDIT", category: "ENG", text: "r/LocalLLaMA: 'Anyone else running 70B models on Mac Studio M4?'" },
  { source: "BLUESKY", category: "POLICY", text: "@eu_commission: Final vote on AI Act Article 45 passes. Compliance deadline set for Q3." },
  { source: "TECHCRUNCH", category: "STARTUP", text: "Agentic Workflow startups see 200% funding spike in Q1." },
  { source: "GARTNER", category: "STRATEGY", text: "Enterprise spend shifting from 'Cloud Migration' to 'Sovereign AI Clouds'." },
  { source: "VERCEL", category: "DEV", text: "Next.js 15.2 release notes: Partial Prerendering now stable." },
  { source: "HUGGINGFACE", category: "OPEN SOURCE", text: "New multimodal embeddings model tops leaderboard." },
  { source: "BLOOMBERG", category: "OPS", text: "Global supply chain consolidation trends in EMEA region accelerating." },
];

export default function LiveNewsFeed() {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    // Infinite Vertical Scroll
    const totalHeight = el.scrollHeight / 2;
    
    gsap.to(el, {
      y: -totalHeight,
      duration: 30, // Slower scroll for readability
      ease: "none",
      repeat: -1,
    });
  }, []);

  // CHANGED: Fixed to Bottom-Right, Small dimensions (w-80 h-64), Rounded corners
  return (
    <div className="fixed bottom-8 right-8 w-80 h-64 bg-black/80 backdrop-blur-md border border-white/10 z-50 hidden md:flex flex-col rounded-xl shadow-2xl overflow-hidden">
      
      {/* HEADER */}
      <div className="p-3 border-b border-white/10 bg-black/90 z-10 flex justify-between items-center">
        <h3 className="text-[10px] font-mono text-white font-bold tracking-widest">GLOBAL INTELLIGENCE</h3>
        <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[9px] font-mono text-green-500">LIVE</span>
        </div>
      </div>

      {/* SCROLL AREA */}
      <div className="flex-1 overflow-hidden relative mask-gradient-y">
        <div ref={scrollRef} className="absolute top-0 left-0 w-full">
          {[...NEWS_ITEMS, ...NEWS_ITEMS].map((item, i) => (
            <div key={i} className="p-3 border-b border-white/5 hover:bg-white/5 transition-colors cursor-default group">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[9px] font-mono text-[#0070F3]">[{item.source}]</span>
              </div>
              <p className="text-[10px] font-sans text-gray-300 leading-relaxed">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}