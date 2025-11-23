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
  { source: "WIRED", category: "CULTURE", text: "Why 'Prompt Engineering' is dead and 'Context Architecture' is the new skill." },
  { source: "REDDIT", category: "WEBGL", text: "r/threejs: 'Showcase: Fluid simulation running at 120fps on mobile.'" },
  { source: "FT", category: "GEO", text: "Data Sovereignty: Brazil mandates local storage for AI training data." },
  { source: "GITHUB", category: "CODE", text: "Trending: 'Auto-GPT-Pro' repo hits 50k stars." },
  { source: "SUBSTACK", category: "DESIGN", text: "The end of Flat Design? Why 2025 is the year of Spatial UI." },
  { source: "LINKEDIN", category: "CAREER", text: "Job Market: 'Chief AI Officer' roles up 300% YoY." },
];

export default function LiveNewsFeed() {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    // Infinite Vertical Scroll Animation
    // We duplicate the content to make it seamless
    const totalHeight = el.scrollHeight / 2;
    
    gsap.to(el, {
      y: -totalHeight,
      duration: 40, // Speed (seconds)
      ease: "none",
      repeat: -1,
    });
  }, []);

  return (
    <div className="fixed top-0 right-0 h-full w-80 bg-black/80 backdrop-blur-md border-l border-white/10 z-40 hidden md:flex flex-col">
      
      {/* HEADER */}
      <div className="p-4 border-b border-white/10 bg-black/90 z-10">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-mono text-gray-500 tracking-widest uppercase">Global Intelligence</span>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[9px] font-mono text-green-500">ONLINE</span>
          </div>
        </div>
        <h3 className="text-xs font-mono text-white font-bold">LIVE DATA STREAM</h3>
      </div>

      {/* SCROLL AREA */}
      <div className="flex-1 overflow-hidden relative mask-gradient-y">
        <div ref={scrollRef} className="absolute top-0 left-0 w-full">
          {/* Render List Twice for Seamless Loop */}
          {[...NEWS_ITEMS, ...NEWS_ITEMS, ...NEWS_ITEMS].map((item, i) => (
            <div key={i} className="p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-default group">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[9px] font-mono text-[#0070F3] group-hover:text-[#00FF94] transition-colors">
                  [{item.source}]
                </span>
                <span className="text-[9px] font-mono text-gray-600 uppercase">
                  {item.category}
                </span>
              </div>
              <p className="text-xs font-sans text-gray-300 leading-relaxed group-hover:text-white transition-colors">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <div className="p-3 border-t border-white/10 bg-black/90 z-10">
        <div className="flex justify-between text-[9px] font-mono text-gray-600">
          <span>LATENCY: 14ms</span>
          <span>ENCRYPTION: AES-256</span>
        </div>
      </div>
    </div>
  );
}