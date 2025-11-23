"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import ForceGraph2D, { ForceGraphMethods } from "react-force-graph-2d";
import gsap from "gsap";

// --- 1. CONFIGURATION ---
// Pull the stage back to 250 so it's visible on standard screens
const STAGE_X = 250; 
const STAGE_Y = 0;

const LIVE_TRENDS = {
  "Strategy": ["SIGNAL: EU AI Act enforcement.", "RISK: Model Governance > Cloud Sec.", "ANALYSIS: Data sovereignty fragmentation."],
  "Engineering": ["TRENDING: DeepSeek-V3 inference.", "STACK: Next.js 15 PPR production.", "SHIFT: Agentic Workflows."],
  "Creative": ["SIGNAL: WebGPU adoption +40%.", "DESIGN: Glassmorphism & Bento Grids.", "METRIC: Interactive story = -40% bounce."],
  "Global Ops": ["LIVE: Vendor consolidation EMEA.", "OPS: AI-driven SOP generation."],
  "Gemini API": ["UPDATE: Gemini 1.5 Pro context.", "USE CASE: Multimodal accessibility."]
};

const initialData = {
  nodes: [
    // CORE (Hidden anchor for physics, visual is in the Header)
    { id: "JONATHAN", group: 1, val: 100, color: "rgba(0,0,0,0)", title: "", desc: "" },
    
    // STRATEGIC PILLARS
    { id: "Strategy", group: 2, val: 40, color: "#0070F3", title: "STRATEGIC RISK", role: "Geopolitical & Technical", desc: "Mitigating enterprise risk by bridging the gap between policy mandates and code enforcement." },
    { id: "Engineering", group: 2, val: 40, color: "#00FF94", title: "ENGINEERING VELOCITY", role: "Full-Stack & GenAI", desc: "Deploying AI agents (SlideSense) to automate workflows and reclaim $300k+ in executive hours." },
    { id: "Creative", group: 2, val: 40, color: "#FF0055", title: "CREATIVE INTELLIGENCE", role: "High-Fidelity Motion", desc: "Translating abstract strategy into visceral 3D narratives that win stakeholder buy-in." },

    // ORBIT
    { id: "Global Ops", group: 3, val: 20, color: "#0070F3" },
    { id: "Governance", group: 3, val: 20, color: "#0070F3" },
    { id: "Next.js 15", group: 3, val: 20, color: "#00FF94" },
    { id: "Gemini API", group: 3, val: 25, color: "#00FF94" },
    { id: "WebGL", group: 3, val: 20, color: "#FF0055" },
    { id: "GSAP", group: 3, val: 20, color: "#FF0055" },
  ],
  links: [
    { source: "JONATHAN", target: "Strategy" }, { source: "JONATHAN", target: "Engineering" }, { source: "JONATHAN", target: "Creative" },
    { source: "Strategy", target: "Global Ops" }, { source: "Strategy", target: "Governance" },
    { source: "Engineering", target: "Next.js 15" }, { source: "Engineering", target: "Gemini API" },
    { source: "Creative", target: "WebGL" }, { source: "Creative", target: "GSAP" },
    { source: "Gemini API", target: "Governance" }, 
  ]
};

const TOUR_STEPS = ["Strategy", "Engineering", "Creative", "Gemini API"];

export default function TechConstellation() {
  const fgRef = useRef<ForceGraphMethods | undefined>(undefined);
  const [dimensions, setDimensions] = useState({ w: 1000, h: 800 });
  const [activeNode, setActiveNode] = useState<any>(null);
  const [isTransitioning, setIsTransitioning] = useState(false); 
  const [currentTrend, setCurrentTrend] = useState("");
  
  const indexRef = useRef(0);
  const autoPilotRef = useRef(true);
  const currentNodeRef = useRef<any>(null);

  useEffect(() => {
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
        graph.d3Force('charge')?.strength(-150); 
        graph.d3Force('link')?.distance(100);
        
        // Pull everything slightly right
        graph.d3Force('center')?.x(STAGE_X); 
        graph.d3Force('center')?.y(STAGE_Y);

        // Lock Camera to STAGE
        graph.centerAt(STAGE_X, STAGE_Y, 0);
        graph.zoom(3.5, 0);
    }
  }, []);

  // INTELLIGENCE TICKER
  useEffect(() => {
    if (activeNode && !isTransitioning) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const trends = LIVE_TRENDS[activeNode.id as keyof typeof LIVE_TRENDS] || ["ANALYZING DATA STREAM...", "CONNECTING..."];
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
  }, [activeNode, isTransitioning]);

  // ANIMATION SEQUENCE
  const transitionToNode = (node: any) => {
    if (!fgRef.current) return;

    setIsTransitioning(true);

    if (currentNodeRef.current && currentNodeRef.current !== node) {
      currentNodeRef.current.fx = undefined;
      currentNodeRef.current.fy = undefined;
    }
    currentNodeRef.current = node;

    node.fx = node.x;
    node.fy = node.y;
    
    gsap.to(node, {
      fx: STAGE_X,
      fy: STAGE_Y,
      duration: 2.0,
      ease: "power3.inOut",
      onUpdate: () => fgRef.current?.d3ReheatSimulation()
    });

    setTimeout(() => {
      setActiveNode(node);
      setIsTransitioning(false);
    }, 600); 
  };

  // AUTO PILOT
  useEffect(() => {
    const interval = setInterval(() => {
      if (!autoPilotRef.current) return;

      const nextIndex = (indexRef.current + 1) % TOUR_STEPS.length;
      indexRef.current = nextIndex;
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const graphNodes = (initialData.nodes as any[]);
      const node = graphNodes.find(n => n.id === TOUR_STEPS[nextIndex]);

      if (node) transitionToNode(node);
    }, 8000); 

    return () => clearInterval(interval);
  }, []);

  const handleInteraction = useCallback((node: any) => {
    if (node.id === "JONATHAN") return;
    autoPilotRef.current = false;
    transitionToNode(node);
  }, []);

  return (
    <div className="fixed inset-0 bg-[#050505] overflow-hidden">
      
      {/* --- 1. PERSISTENT HEADER (Always Visible) --- */}
      <div className="absolute top-0 left-0 p-8 md:p-12 z-50 pointer-events-auto">
        <div className="flex flex-col items-start">
          <span className="font-mono text-[#0070F3] text-xs mb-2 tracking-[0.3em] uppercase">
            Strategic Technology Executive
          </span>
          <h1 className="text-4xl md:text-5xl font-sans font-bold text-white mb-6 leading-none tracking-tight drop-shadow-xl">
            JONATHAN<br/>W. MARINO
          </h1>
          <button 
             onClick={() => document.getElementById('content-start')?.scrollIntoView({behavior:'smooth'})}
             className="group flex items-center gap-3 text-xs font-mono text-gray-400 hover:text-white transition-colors border-b border-transparent hover:border-white pb-2"
          >
             <span className="relative flex h-2 w-2">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
               <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
             </span>
             INITIATE RESUME SEQUENCE &darr;
          </button>
        </div>
      </div>

      {/* --- 2. DYNAMIC INTELLIGENCE CARD (Bottom Left) --- */}
      <div className="absolute left-0 bottom-0 h-[60%] w-full md:w-[600px] flex items-end p-8 md:p-12 z-20 pointer-events-none">
        <div 
          className={`pointer-events-auto w-full transition-all duration-700 transform 
            ${isTransitioning ? 'opacity-0 translate-y-10' : 'opacity-100 translate-y-0'}`}
        >
           {/* Only show if we have an active node */}
           {activeNode && activeNode.id !== "JONATHAN" && (
             <div className="bg-black/60 backdrop-blur-2xl border border-white/10 p-8 md:p-10 shadow-2xl relative overflow-hidden rounded-tr-2xl">
                
                {/* Color Bar */}
                <div className="absolute top-0 left-0 w-1 h-full transition-colors duration-500" 
                     style={{ backgroundColor: activeNode?.color || '#fff' }} />
                
                {/* Live Trend */}
                <div className="mb-6 border-b border-gray-800 pb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[9px] font-mono text-red-500 uppercase tracking-widest">Live Signal</span>
                    <span className="w-1 h-1 bg-red-500 rounded-full animate-pulse"/>
                  </div>
                  <p className="text-xs font-mono text-[#00FF94] h-8 leading-relaxed">
                    {currentTrend}<span className="animate-pulse text-white">_</span>
                  </p>
                </div>

                {/* Content */}
                <h3 className="font-mono text-[#0070F3] text-xs mb-2 uppercase tracking-widest" 
                    style={{ color: activeNode?.color }}>
                  {activeNode?.role}
                </h3>
                <h2 className="text-3xl md:text-4xl font-sans font-bold text-white mb-4 leading-tight">
                  {activeNode?.title || activeNode?.id}
                </h2>
                <p className="text-md text-gray-300 font-sans leading-relaxed">
                  {activeNode?.desc}
                </p>
             </div>
           )}
        </div>
      </div>

      {/* --- 3. RIGHT BRAIN --- */}
      <ForceGraph2D
        ref={fgRef}
        width={dimensions.w}
        height={dimensions.h}
        graphData={initialData}
        backgroundColor="#050505"
        
        // Interactions
        onNodeClick={handleInteraction}
        onNodeDrag={() => { autoPilotRef.current = false; }}
        onBackgroundClick={() => { autoPilotRef.current = false; }}
        
        // Physics
        cooldownTicks={100}
        d3AlphaDecay={0.02}
        d3VelocityDecay={0.4}
        
        nodeRelSize={8}
        linkColor={() => "#ffffff15"}
        linkWidth={1.5}
        linkDirectionalParticles={2}
        linkDirectionalParticleSpeed={0.005}
        
        nodeCanvasObject={(node, ctx, globalScale) => {
          if (!Number.isFinite(node.x) || !Number.isFinite(node.y)) return;

          const isTarget = node.id === activeNode?.id;
          const color = (node.color as string) || "#fff";
          const isCore = node.id === "JONATHAN";
          
          // Hide Core Visual (Since Header is there)
          if (isCore) return;

          const pulse = Math.sin(Date.now() / 800) * 3; 
          const baseRadius = 6;
          const radius = isTarget ? (baseRadius * 1.5) + pulse : baseRadius;

          // Glow
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

          // Labels
          if (!isTarget && node.group === 2) {
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