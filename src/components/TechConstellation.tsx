"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import ForceGraph2D, { ForceGraphMethods } from "react-force-graph-2d";

// --- 1. LIVE INTELLIGENCE DATA (Expanded with Sources) ---
const LIVE_TRENDS = {
  "Strategy": [
    "Analysis of EU AI Act enforcement (Source: Brussels Signal)",
    "Shift in C-Suite Risk Profiles: Model Governance > Cloud Sec (Source: Gartner)",
    "Geopolitical data sovereignty fragmentation in APAC (Source: TechCrunch)"
  ],
  "Engineering": [
    "DeepSeek-V3 disrupting inference cost baselines (Source: HuggingFace)",
    "Next.js 15 PPR moving to stable production (Source: Vercel Changelog)",
    "Rise of Agentic Workflows over RAG pipelines (Source: YC Trends)"
  ],
  "Creative": [
    "WebGPU adoption +40% in e-commerce (Source: Awwwards)",
    "Glassmorphism & Bento Grids dominating SaaS UI (Source: Dribbble)",
    "Interactive storytelling reduces bounce rates by 40% (Source: Nielsen)"
  ],
  "Global Ops": [
    "Vendor consolidation trends in EMEA markets (Source: Bloomberg)",
    "AI-driven SOP generation replacing manual docs (Source: McKinsey)"
  ],
  "Gemini API": [
    "Gemini 1.5 Pro context window expansion (Source: Google DeepMind)",
    "Multimodal reasoning for accessibility apps (Source: Stevie Project Logs)"
  ]
};

const initialData = {
  nodes: [
    // CORE
    { 
      id: "JONATHAN", group: 1, val: 70, color: "#FFFFFF",
      title: "JONATHAN W. MARINO",
      role: "Strategic Technology Executive",
      desc: "The central node. Architecting the intersection of Policy, Code, and Design." 
    },
    
    // STRATEGIC PILLARS
    { 
      id: "Strategy", group: 2, val: 35, color: "#0070F3", 
      title: "STRATEGIC RISK",
      role: "Geopolitical & Technical",
      desc: "Mitigating enterprise risk by bridging the gap between policy mandates and code enforcement." 
    },
    { 
      id: "Engineering", group: 2, val: 35, color: "#00FF94", 
      title: "ENGINEERING VELOCITY",
      role: "Full-Stack & GenAI",
      desc: "Deploying AI agents (SlideSense) to automate workflows and reclaim $300k+ in executive hours." 
    },
    { 
      id: "Creative", group: 2, val: 35, color: "#FF0055", 
      title: "CREATIVE INTELLIGENCE",
      role: "High-Fidelity Motion",
      desc: "Translating abstract strategy into visceral 3D narratives that win stakeholder buy-in." 
    },

    // TACTICAL ORBIT
    { id: "Global Ops", group: 3, val: 12, color: "#0070F3" },
    { id: "Governance", group: 3, val: 12, color: "#0070F3" },
    { id: "Next.js 15", group: 3, val: 12, color: "#00FF94" },
    { id: "Gemini API", group: 3, val: 20, color: "#00FF94" },
    { id: "WebGL", group: 3, val: 12, color: "#FF0055" },
    { id: "GSAP", group: 3, val: 12, color: "#FF0055" },
  ],
  links: [
    { source: "JONATHAN", target: "Strategy" },
    { source: "JONATHAN", target: "Engineering" },
    { source: "JONATHAN", target: "Creative" },
    { source: "Strategy", target: "Global Ops" },
    { source: "Strategy", target: "Governance" },
    { source: "Engineering", target: "Next.js 15" },
    { source: "Engineering", target: "Gemini API" },
    { source: "Creative", target: "WebGL" },
    { source: "Creative", target: "GSAP" },
    { source: "Gemini API", target: "Governance" }, 
  ]
};

const TOUR_STEPS = ["JONATHAN", "Strategy", "Engineering", "Creative", "Gemini API"];

export default function TechConstellation() {
  const fgRef = useRef<ForceGraphMethods | undefined>(undefined);
  const [dimensions, setDimensions] = useState({ w: 1000, h: 800 });
  const [activeNode, setActiveNode] = useState<any>(initialData.nodes[0]); 
  const [tourIndex, setTourIndex] = useState(0);
  const [isAutoPilot, setIsAutoPilot] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [currentTrend, setCurrentTrend] = useState("");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== "undefined") {
      setDimensions({ w: window.innerWidth, h: window.innerHeight });
      const resize = () => setDimensions({ w: window.innerWidth, h: window.innerHeight });
      window.addEventListener("resize", resize);
      return () => window.removeEventListener("resize", resize);
    }
  }, []);

  // PHYSICS CONFIG
  useEffect(() => {
    if (fgRef.current) {
        const graph = fgRef.current;
        graph.d3Force('charge')?.strength(-300); // Stronger push
        graph.d3Force('center')?.x(dimensions.w * 0.25); // Shift Right
    }
  }, [isClient, dimensions]);

  // --- INTELLIGENCE ENGINE (Typing Effect) ---
  useEffect(() => {
    if (activeNode) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const trends = LIVE_TRENDS[activeNode.id as keyof typeof LIVE_TRENDS] || ["ANALYZING LIVE DATA STREAM...", "CONNECTING TO INDUSTRY FEED..."];
      const randomTrend = trends[Math.floor(Math.random() * trends.length)];
      
      let i = 0;
      setCurrentTrend("");
      const typeInterval = setInterval(() => {
        setCurrentTrend(randomTrend.substring(0, i + 1));
        i++;
        if (i > randomTrend.length) clearInterval(typeInterval);
      }, 20); // Faster typing

      return () => clearInterval(typeInterval);
    }
  }, [activeNode]);

  // --- AUTO-PILOT (Robust Loop) ---
  useEffect(() => {
    if (!isAutoPilot || !fgRef.current) return;

    // Clear any existing timer to prevent "double jumps"
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      // 1. Advance Index
      const nextIndex = (tourIndex + 1) % TOUR_STEPS.length;
      setTourIndex(nextIndex);
      
      // 2. Find Node Data
      const targetId = TOUR_STEPS[nextIndex];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const graphNodes = (fgRef.current as any).graphData().nodes;
      const node = graphNodes.find((n: any) => n.id === targetId);

      if (node && Number.isFinite(node.x)) {
        // 3. Move Camera (Offset to keep node on the Right)
        fgRef.current?.centerAt(node.x - 250, node.y, 2500); 
        fgRef.current?.zoom(2.8, 2500);
        setActiveNode(node);
      }
    }, 3500); // 3.5 Seconds per node (Snappy)

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [tourIndex, isAutoPilot]);

  const handleInteraction = useCallback((node: any) => {
    setIsAutoPilot(false);
    if (timeoutRef.current) clearTimeout(timeoutRef.current); // Stop auto loop
    setActiveNode(node);
    fgRef.current?.centerAt(node.x - 250, node.y, 1000);
    fgRef.current?.zoom(3, 1000);
  }, []);

  if (!isClient) return null;

  return (
    <div className="fixed inset-0 bg-[#050505] overflow-hidden">
      
      {/* --- LEFT COLUMN: EXPANDED INTELLIGENCE CARD (WIDER) --- */}
      <div className="absolute left-0 top-0 h-full w-full md:w-[750px] flex items-center p-8 md:p-12 z-20 pointer-events-none">
        
        <div className={`pointer-events-auto w-full transition-all duration-700 transform ${activeNode ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
           
           {/* Card Container */}
           <div className="bg-black/70 backdrop-blur-3xl border border-white/10 p-12 shadow-[0_0_80px_rgba(0,0,0,0.8)] relative overflow-hidden rounded-xl">
              
              {/* Active Border Line */}
              <div className="absolute top-0 left-0 w-2 h-full transition-colors duration-500" 
                   style={{ backgroundColor: activeNode?.color || '#fff' }} />
              
              {/* 1. HEADER */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex flex-col">
                  <span className="font-mono text-xs tracking-[0.3em] uppercase text-gray-500 mb-1">
                    System Node ID
                  </span>
                  <span className="font-mono text-white text-lg">
                    {activeNode?.group === 1 ? 'CORE_KERNEL' : `MODULE_0${activeNode?.group}`}
                  </span>
                </div>
                
                <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_red]" />
                  <span className="text-[10px] font-mono text-white uppercase tracking-wider">Live Feed Active</span>
                </div>
              </div>

              {/* 2. TITLE & ROLE */}
              <h3 className="font-mono text-[#0070F3] text-sm mb-3 uppercase tracking-widest" style={{ color: activeNode?.color }}>
                {activeNode?.role}
              </h3>
              <h1 className="text-5xl md:text-6xl font-sans font-bold text-white mb-10 leading-[0.9] tracking-tight">
                {activeNode?.title || activeNode?.id}
              </h1>

              {/* 3. LIVE AI INSIGHT (The "Typing" Section) */}
              <div className="mb-10 border-y border-gray-800 py-8 bg-black/40 -mx-12 px-12 relative overflow-hidden">
                {/* Scanline effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent opacity-10 animate-scan" />
                
                <p className="text-[10px] font-mono text-gray-500 mb-3 uppercase flex justify-between">
                  <span>// INCOMING TREND SIGNAL</span>
                  <span>{new Date().toLocaleTimeString()}</span>
                </p>
                <p className="text-md font-mono text-[#00FF94] h-12 leading-relaxed">
                  {currentTrend}<span className="animate-pulse text-white">_</span>
                </p>
              </div>

              {/* 4. DESCRIPTION */}
              <p className="text-xl text-gray-300 font-sans leading-relaxed mb-10 max-w-xl">
                {activeNode?.desc || "Operational competency node detected."}
              </p>

              {/* 5. ACTION */}
              {activeNode?.id === "JONATHAN" && (
                 <button 
                   onClick={() => document.getElementById('content-start')?.scrollIntoView({behavior:'smooth'})}
                   className="group relative w-full overflow-hidden rounded-none border border-white/20 bg-white/5 px-8 py-5 text-sm font-mono text-white transition-all hover:bg-white hover:text-black"
                 >
                   <span className="relative z-10 flex items-center justify-center gap-4">
                     INITIATE FULL SEQUENCE <span className="group-hover:translate-y-1 transition-transform">&darr;</span>
                   </span>
                 </button>
              )}
           </div>
        </div>
      </div>

      {/* --- RIGHT COLUMN: THE BRAIN --- */}
      <ForceGraph2D
        ref={fgRef}
        width={dimensions.w}
        height={dimensions.h}
        graphData={initialData}
        backgroundColor="#050505"
        
        onNodeClick={handleInteraction}
        onNodeDrag={() => setIsAutoPilot(false)}
        onBackgroundClick={() => { setIsAutoPilot(false); }}

        cooldownTicks={100}
        d3AlphaDecay={0.01} 
        d3VelocityDecay={0.4}

        nodeRelSize={8}
        linkColor={() => "#ffffff15"}
        linkWidth={1.5}
        linkDirectionalParticles={2}
        linkDirectionalParticleSpeed={0.005}
        
        nodeCanvasObject={(node, ctx, globalScale) => {
          if (!Number.isFinite(node.x) || !Number.isFinite(node.y)) return;

          const isTarget = node.id === activeNode?.id;
          const isCore = node.group === 1;
          const color = (node.color as string) || "#fff";
          
          const pulse = Math.sin(Date.now() / 800) * 3; 
          const baseRadius = isCore ? 15 : 6;
          const radius = isTarget ? (baseRadius * 1.5) + pulse : baseRadius;

          const gradient = ctx.createRadialGradient(node.x!, node.y!, 0, node.x!, node.y!, radius * 3);
          gradient.addColorStop(0, color);
          gradient.addColorStop(0.4, color + '44');
          gradient.addColorStop(1, 'transparent');

          ctx.beginPath();
          ctx.arc(node.x!, node.y!, radius * 3, 0, 2 * Math.PI, false);
          ctx.fillStyle = gradient;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(node.x!, node.y!, radius * 0.6, 0, 2 * Math.PI, false);
          ctx.fillStyle = "#000";
          ctx.fill();
          ctx.strokeStyle = color;
          ctx.lineWidth = 2;
          ctx.stroke();

          if (!isTarget && (isCore || node.group === 2)) {
             const label = node.id as string;
             const fontSize = 12 / globalScale;
             ctx.font = `bold ${fontSize}px Sans-Serif`;
             ctx.textAlign = 'center';
             ctx.textBaseline = 'middle';
             ctx.fillStyle = 'rgba(255,255,255,0.5)';
             ctx.fillText(label, node.x!, node.y! + radius + fontSize + 4);
          }
        }}
      />
    </div>
  );
}