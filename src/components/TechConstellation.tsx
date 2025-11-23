"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import ForceGraph2D, { ForceGraphMethods } from "react-force-graph-2d";

// --- 1. LIVE INTELLIGENCE DATA ---
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
    "METRIC: Interactive storytelling reduces bounce rates by 40% vs static landing pages."
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
    { id: "Strategy", group: 2, val: 30, color: "#0070F3", title: "STRATEGIC RISK", role: "Geopolitical & Technical", desc: "Mitigating enterprise risk by bridging the gap between policy mandates and code enforcement." },
    { id: "Engineering", group: 2, val: 30, color: "#00FF94", title: "ENGINEERING VELOCITY", role: "Full-Stack & GenAI", desc: "Deploying AI agents (SlideSense) to automate workflows and reclaim $300k+ in executive hours." },
    { id: "Creative", group: 2, val: 30, color: "#FF0055", title: "CREATIVE INTELLIGENCE", role: "High-Fidelity Motion", desc: "Translating abstract strategy into visceral 3D narratives that win stakeholder buy-in." },
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

const TOUR_STEPS = ["JONATHAN", "Strategy", "Engineering", "Creative", "Gemini API"];

export default function TechConstellation() {
  const fgRef = useRef<ForceGraphMethods | undefined>(undefined);
  const [dimensions, setDimensions] = useState({ w: 1000, h: 800 });
  const [activeNode, setActiveNode] = useState<any>(initialData.nodes[0]); 
  const [tourIndex, setTourIndex] = useState(0);
  const [isAutoPilot, setIsAutoPilot] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [currentTrend, setCurrentTrend] = useState("");
  
  // Refs for logic
  const indexRef = useRef(0);
  const autoPilotRef = useRef(true);

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
        graph.d3Force('charge')?.strength(-400); 
        // Push physics center to the RIGHT (+300px)
        graph.d3Force('center')?.x(300); 
    }
  }, [isClient]);

  // TYPING EFFECT
  useEffect(() => {
    if (activeNode) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const trends = LIVE_TRENDS[activeNode.id as keyof typeof LIVE_TRENDS] || ["ANALYZING LIVE FEED...", "CONNECTING..."];
      const randomTrend = trends[Math.floor(Math.random() * trends.length)];
      
      let i = 0;
      setCurrentTrend("");
      const typeInterval = setInterval(() => {
        setCurrentTrend(randomTrend.substring(0, i + 1));
        i++;
        if (i > randomTrend.length) clearInterval(typeInterval);
      }, 20);
      return () => clearInterval(typeInterval);
    }
  }, [activeNode]);

  // --- THE GAME LOOP (Fixed) ---
  useEffect(() => {
    const interval = setInterval(() => {
      // 1. Check if we should act
      if (!autoPilotRef.current || !fgRef.current) {
        return; // Skip tick
      }

      // 2. Calculate Target
      const nextIndex = (indexRef.current + 1) % TOUR_STEPS.length;
      const targetId = TOUR_STEPS[nextIndex];
      
      // FIX: Read from initialData directly. The library mutates this object by reference.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const node = initialData.nodes.find(n => n.id === targetId) as any;

      // 3. Execute Move
      if (node && Number.isFinite(node.x)) {
        console.log(`Moving to: ${targetId}`);
        
        // Move camera to LEFT of node (x - 300) to keep node on RIGHT
        fgRef.current?.centerAt(node.x - 300, node.y, 2500); 
        fgRef.current?.zoom(2.8, 2500);
        
        setActiveNode(node);
        indexRef.current = nextIndex; // Update ref
        setTourIndex(nextIndex);      // Update state
      }

    }, 5000); // Tick every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const handleInteraction = useCallback((node: any) => {
    setIsAutoPilot(false);
    autoPilotRef.current = false; 
    
    setActiveNode(node);
    fgRef.current?.centerAt(node.x - 300, node.y, 1000);
    fgRef.current?.zoom(3, 1000);
  }, []);

  if (!isClient) return null;

  return (
    <div className="fixed inset-0 bg-[#050505] overflow-hidden">
      
      {/* --- LEFT CARD (EXPANSIVE) --- */}
      <div className="absolute left-0 top-0 h-full w-full md:w-[800px] flex items-center p-8 md:p-16 z-20 pointer-events-none">
        <div className={`pointer-events-auto w-full transition-all duration-1000 transform ${activeNode ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
           <div className="bg-black/80 backdrop-blur-2xl border border-white/10 p-12 shadow-[0_0_100px_rgba(0,0,0,0.9)] relative overflow-hidden rounded-2xl">
              <div className="absolute top-0 left-0 w-2 h-full transition-colors duration-500" style={{ backgroundColor: activeNode?.color || '#fff' }} />
              
              <div className="flex items-center justify-between mb-8">
                <div className="flex flex-col">
                  <span className="font-mono text-xs tracking-[0.3em] uppercase text-gray-500 mb-1">System Node</span>
                  <span className="font-mono text-white text-lg">{activeNode?.group === 1 ? 'KERNEL' : 'MODULE'}</span>
                </div>
                <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_red]" />
                  <span className="text-[10px] font-mono text-white uppercase tracking-wider">Live Feed</span>
                </div>
              </div>

              <h3 className="font-mono text-[#0070F3] text-sm mb-3 uppercase tracking-widest" style={{ color: activeNode?.color }}>{activeNode?.role}</h3>
              <h1 className="text-6xl font-sans font-bold text-white mb-10 leading-[0.9] tracking-tight">{activeNode?.title || activeNode?.id}</h1>

              <div className="mb-10 border-y border-gray-800 py-8 bg-black/40 -mx-12 px-12">
                <p className="text-[10px] font-mono text-gray-500 mb-3 uppercase flex justify-between">
                  <span>// INCOMING SIGNAL</span>
                  <span>{new Date().toLocaleTimeString()}</span>
                </p>
                <p className="text-md font-mono text-[#00FF94] h-12 leading-relaxed">{currentTrend}<span className="animate-pulse text-white">_</span></p>
              </div>

              <p className="text-xl text-gray-300 font-sans leading-relaxed mb-10 max-w-2xl">{activeNode?.desc}</p>

              {activeNode?.id === "JONATHAN" && (
                 <button 
                   onClick={() => document.getElementById('content-start')?.scrollIntoView({behavior:'smooth'})}
                   className="w-full border border-white/20 bg-white/5 px-8 py-5 text-sm font-mono text-white hover:bg-white hover:text-black transition-all"
                 >
                   INITIATE SEQUENCE &darr;
                 </button>
              )}
           </div>
        </div>
      </div>

      {/* --- RIGHT BRAIN --- */}
      <ForceGraph2D
        ref={fgRef}
        width={dimensions.w}
        height={dimensions.h}
        graphData={initialData}
        backgroundColor="#050505"
        onNodeClick={handleInteraction}
        onNodeDrag={() => { setIsAutoPilot(false); autoPilotRef.current = false; }}
        onBackgroundClick={() => { setIsAutoPilot(false); autoPilotRef.current = false; }}
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