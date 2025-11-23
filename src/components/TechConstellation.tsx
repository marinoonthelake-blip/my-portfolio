"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import ForceGraph2D, { ForceGraphMethods } from "react-force-graph-2d";

// --- 1. THE LIVE INTELLIGENCE DATA ---
// This simulates the "AI" pulling current trends to contextualize your skills.
const LIVE_TRENDS = {
  "Strategy": [
    "SIGNAL DETECTED: EU AI Act enforcement phase beginning.",
    "MARKET SHIFT: Enterprise risk moving from 'Cloud Security' to 'Model Governance'.",
    "ANALYSIS: Geopolitical data sovereignty fragmentation in APAC regions."
  ],
  "Engineering": [
    "TRENDING: DeepSeek-V3 disrupting open-source inference costs.",
    "STACK UPDATE: Next.js 15 PPR moving to stable production readiness.",
    "OBSERVATION: Shift from RAG pipelines to Agentic Workflows in Enterprise."
  ],
  "Creative": [
    "SIGNAL: WebGPU adoption rising in e-commerce for 3D product config.",
    "DESIGN SHIFT: 'Bento Grids' and 'Glassmorphism' dominating SaaS UI.",
    "METRIC: Interactive storytelling reducing bounce rates by 40% vs static landing pages."
  ],
  "Global Ops": [
    "LIVE: Vendor consolidation trends in EMEA markets.",
    "OPS: AI-driven SOP generation replacing manual documentation."
  ],
  "Gemini API": [
    "UPDATE: Gemini 1.5 Pro context window expansion enabling full-codebase analysis.",
    "USE CASE: Multimodal reasoning for accessibility (See: Stevie Project)."
  ]
};

const initialData = {
  nodes: [
    // CORE
    { 
      id: "JONATHAN", group: 1, val: 60, color: "#FFFFFF",
      title: "JONATHAN W. MARINO",
      role: "Strategic Technology Executive",
      desc: "The central node. Architecting the intersection of Policy, Code, and Design." 
    },
    
    // STRATEGIC PILLARS
    { 
      id: "Strategy", group: 2, val: 30, color: "#0070F3", 
      title: "STRATEGIC RISK",
      role: "Geopolitical & Technical",
      desc: "Mitigating enterprise risk by bridging the gap between policy mandates and code enforcement." 
    },
    { 
      id: "Engineering", group: 2, val: 30, color: "#00FF94", 
      title: "ENGINEERING VELOCITY",
      role: "Full-Stack & GenAI",
      desc: "Deploying AI agents (SlideSense) to automate workflows and reclaim $300k+ in executive hours." 
    },
    { 
      id: "Creative", group: 2, val: 30, color: "#FF0055", 
      title: "CREATIVE INTELLIGENCE",
      role: "High-Fidelity Motion",
      desc: "Translating abstract strategy into visceral 3D narratives that win stakeholder buy-in." 
    },

    // TACTICAL ORBIT
    { id: "Global Ops", group: 3, val: 10, color: "#0070F3" },
    { id: "Governance", group: 3, val: 10, color: "#0070F3" },
    { id: "Next.js 15", group: 3, val: 10, color: "#00FF94" },
    { id: "Gemini API", group: 3, val: 15, color: "#00FF94" },
    { id: "WebGL", group: 3, val: 10, color: "#FF0055" },
    { id: "GSAP", group: 3, val: 10, color: "#FF0055" },
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

// The Tour Route
const TOUR_STEPS = ["JONATHAN", "Strategy", "Engineering", "Creative", "Gemini API"];

export default function TechConstellation() {
  const fgRef = useRef<ForceGraphMethods | undefined>(undefined);
  const [dimensions, setDimensions] = useState({ w: 1000, h: 800 });
  const [activeNode, setActiveNode] = useState<any>(initialData.nodes[0]); 
  const [tourIndex, setTourIndex] = useState(0);
  const [isAutoPilot, setIsAutoPilot] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [currentTrend, setCurrentTrend] = useState("");

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
        graph.d3Force('charge')?.strength(-200);
        // Shift physics center to the right so the graph floats on the right side
        graph.d3Force('center')?.x(dimensions.w * 0.2); 
    }
  }, [isClient, dimensions]);

  // --- INTELLIGENCE ENGINE (Trend Simulation) ---
  useEffect(() => {
    if (activeNode) {
      // 1. Pick a random trend for this node (or generic if none)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const trends = LIVE_TRENDS[activeNode.id as keyof typeof LIVE_TRENDS] || ["ANALYZING LIVE DATA STREAM...", "CONNECTING TO INDUSTRY FEED..."];
      const randomTrend = trends[Math.floor(Math.random() * trends.length)];
      
      // 2. Typewriter effect
      let i = 0;
      setCurrentTrend("");
      const typeInterval = setInterval(() => {
        setCurrentTrend(randomTrend.substring(0, i + 1));
        i++;
        if (i > randomTrend.length) clearInterval(typeInterval);
      }, 30); // Typing speed

      return () => clearInterval(typeInterval);
    }
  }, [activeNode]);

  // --- AUTO-PILOT (Fixed) ---
  useEffect(() => {
    if (!isAutoPilot || !fgRef.current) return;

    const timer = setTimeout(() => {
      // 1. Advance Index
      const nextIndex = (tourIndex + 1) % TOUR_STEPS.length;
      setTourIndex(nextIndex);
      
      // 2. Find Node Data
      const targetId = TOUR_STEPS[nextIndex];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const graphNodes = (fgRef.current as any).graphData().nodes;
      const node = graphNodes.find((n: any) => n.id === targetId);

      if (node) {
        // 3. Move Camera (Offset to keep node on the Right, text on the Left)
        // centerAt(x, y, duration) -> We shift X negative to push the view right
        fgRef.current.centerAt(node.x - 200, node.y, 2000); 
        fgRef.current.zoom(2.8, 2000);
        setActiveNode(node);
      }
    }, 8000); // Stay for 8 seconds (Time to read the expanded card)

    return () => clearTimeout(timer);
  }, [tourIndex, isAutoPilot]);

  const handleInteraction = useCallback((node: any) => {
    setIsAutoPilot(false);
    setActiveNode(node);
    fgRef.current?.centerAt(node.x - 200, node.y, 1000);
    fgRef.current?.zoom(3, 1000);
  }, []);

  if (!isClient) return null;

  return (
    <div className="fixed inset-0 bg-[#050505] overflow-hidden">
      
      {/* --- LEFT COLUMN: EXPANDED INTELLIGENCE CARD --- */}
      <div className="absolute left-0 top-0 h-full w-full md:w-[600px] flex items-center p-8 z-20 pointer-events-none">
        
        <div className={`pointer-events-auto w-full transition-all duration-700 transform ${activeNode ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
           
           {/* Card Container */}
           <div className="bg-black/60 backdrop-blur-2xl border border-white/10 p-12 shadow-[0_0_50px_rgba(0,0,0,0.8)] relative overflow-hidden">
              
              {/* Active Border Line */}
              <div className="absolute top-0 left-0 w-2 h-full transition-colors duration-500" 
                   style={{ backgroundColor: activeNode?.color || '#fff' }} />
              
              {/* 1. HEADER */}
              <div className="flex items-center justify-between mb-6">
                <span className="font-mono text-xs tracking-[0.2em] uppercase text-gray-400">
                  System Node: {activeNode?.group === 1 ? 'CORE' : 'MODULE'}
                </span>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-[10px] font-mono text-red-500 uppercase">Live Feed</span>
                </div>
              </div>

              {/* 2. TITLE & ROLE */}
              <h3 className="font-mono text-[#0070F3] text-sm mb-2 uppercase tracking-widest">
                {activeNode?.role}
              </h3>
              <h1 className="text-5xl font-sans font-bold text-white mb-8 leading-[0.9]">
                {activeNode?.title || activeNode?.id}
              </h1>

              {/* 3. LIVE AI INSIGHT (The "Typing" Section) */}
              <div className="mb-8 border-t border-b border-gray-800 py-6 bg-white/5 -mx-12 px-12">
                <p className="text-xs font-mono text-gray-500 mb-2 uppercase">
                  // Current Market Relevance
                </p>
                <p className="text-sm font-mono text-[#00FF94] h-12">
                  {currentTrend}<span className="animate-pulse">_</span>
                </p>
              </div>

              {/* 4. DESCRIPTION */}
              <p className="text-lg text-gray-300 font-sans leading-relaxed mb-8">
                {activeNode?.desc || "Operational competency node detected."}
              </p>

              {/* 5. ACTION */}
              {activeNode?.id === "JONATHAN" && (
                 <button 
                   onClick={() => document.getElementById('content-start')?.scrollIntoView({behavior:'smooth'})}
                   className="rounded-none border border-white/20 bg-white/10 px-8 py-4 text-xs font-mono text-white hover:bg-white hover:text-black transition-all w-full"
                 >
                   INITIATE FULL SEQUENCE &darr;
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
        onBackgroundClick={() => setIsAutoPilot(false)}

        cooldownTicks={100}
        d3AlphaDecay={0.01} // Keep it floating
        d3VelocityDecay={0.4}

        nodeRelSize={8}
        linkColor={() => "#ffffff15"}
        linkWidth={1.5}
        linkDirectionalParticles={2}
        linkDirectionalParticleSpeed={0.005}
        
        nodeCanvasObject={(node, ctx, globalScale) => {
          // Safety check
          if (!Number.isFinite(node.x) || !Number.isFinite(node.y)) return;

          const isTarget = node.id === activeNode?.id;
          const isCore = node.group === 1;
          const color = (node.color as string) || "#fff";
          
          const pulse = Math.sin(Date.now() / 800) * 3; 
          const baseRadius = isCore ? 15 : 6;
          const radius = isTarget ? (baseRadius * 1.5) + pulse : baseRadius;

          // Gradient Glow
          const gradient = ctx.createRadialGradient(node.x!, node.y!, 0, node.x!, node.y!, radius * 3);
          gradient.addColorStop(0, color);
          gradient.addColorStop(0.4, color + '44');
          gradient.addColorStop(1, 'transparent');

          ctx.beginPath();
          ctx.arc(node.x!, node.y!, radius * 3, 0, 2 * Math.PI, false);
          ctx.fillStyle = gradient;
          ctx.fill();

          // Core
          ctx.beginPath();
          ctx.arc(node.x!, node.y!, radius * 0.6, 0, 2 * Math.PI, false);
          ctx.fillStyle = "#000";
          ctx.fill();
          ctx.strokeStyle = color;
          ctx.lineWidth = 2;
          ctx.stroke();

          // Label (If not active)
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