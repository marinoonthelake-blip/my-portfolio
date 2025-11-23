"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import ForceGraph2D, { ForceGraphMethods } from "react-force-graph-2d";
import gsap from "gsap";

// --- 1. LIVE INTELLIGENCE DATA ---
const LIVE_TRENDS = {
  "Strategy": ["DETECTING: EU AI Act enforcement...", "ANALYSIS: Risk migration > Model Gov.", "SIGNAL: Data sovereignty frag."],
  "Engineering": ["BENCHMARK: DeepSeek-V3 vs Gemini.", "DEPLOY: Next.js 15 PPR.", "PATTERN: Agentic Workflows."],
  "Creative": ["TREND: WebGPU adoption +40%.", "UX: Glassmorphism & Bento Grids.", "METRIC: 3D Storytelling -40% bounce."],
  "Global Ops": ["LIVE: Vendor consolidation EMEA.", "OPS: AI-driven SOP generation."],
  "Gemini API": ["UPDATE: Context window expansion.", "USE CASE: Multimodal latency < 200ms."],
  "JONATHAN": ["SYSTEM: CONNECTED.", "STATUS: READY.", "MODE: EXECUTIVE OVERVIEW."]
};

const initialData = {
  nodes: [
    { id: "JONATHAN", group: 1, val: 120, color: "#FFFFFF", title: "JONATHAN W. MARINO", role: "STRATEGIC TECH EXEC", desc: "Architecting the intersection of Geopolitics, Data, and Design.", bullets: ["15+ Years Exp", "Boardroom to Backend", "1.4M Citizens Mapped"], metrics: ["Global Scale", "Polymathic", "Impact-Driven"] },
    { id: "Strategy", group: 2, val: 60, color: "#0070F3", title: "STRATEGIC RISK", role: "Geopolitical Architect", desc: "Mitigating enterprise risk by translating abstract policy mandates into code.", bullets: ["Orchestrated 'Beyond the Map'", "Navigated diplomacy", "Privacy frameworks"], metrics: ["1.4M Citizens", "Privacy Compliance", "Cross-Border"] },
    { id: "Engineering", group: 2, val: 60, color: "#00FF94", title: "ENGINEERING VELOCITY", role: "Full-Stack & GenAI Lead", desc: "Deploying AI agents to automate workflows and reclaim executive hours.", bullets: ["Built 'SlideSense'", "Developed 'Stevie'", "Global keyword tools"], metrics: ["$300k+ Savings", "Automated Ops", "Gemini API"] },
    { id: "Creative", group: 2, val: 60, color: "#FF0055", title: "CREATIVE INTELLIGENCE", role: "High-Fidelity Motion", desc: "Translating abstract strategy into visceral 3D narratives.", bullets: ["Directed 'Monk-e-Mail'", "E-Trade Baby Design", "3D Swirl formats"], metrics: ["50M+ Engagement", "Super Bowl Ads", "Interactive Story"] },
    
    { id: "Global Ops", group: 3, val: 20, color: "#0070F3", title: "GLOBAL OPS", role: "Scale", desc: "Standardizing vendor ops across APAC/EMEA." },
    { id: "Governance", group: 3, val: 20, color: "#0070F3", title: "GOVERNANCE", role: "Policy", desc: "Automated policy enforcement via code." },
    { id: "Next.js 15", group: 3, val: 20, color: "#00FF94", title: "NEXT.JS 15", role: "Architecture", desc: "Server Components & PPR." },
    { id: "Gemini API", group: 3, val: 30, color: "#00FF94", title: "GEMINI API", role: "LLM Integration", desc: "Deep integration of Multimodal AI." },
    { id: "Audio AI", group: 3, val: 20, color: "#00FF94", title: "AUDIO SYNTHESIS", role: "Accessibility", desc: "Neural Text-to-Speech pipelines." },
    { id: "WebGL", group: 3, val: 20, color: "#FF0055", title: "WEBGL", role: "Immersive", desc: "Browser-based 3D rendering." },
    { id: "GSAP", group: 3, val: 20, color: "#FF0055", title: "GSAP ANIMATION", role: "Motion", desc: "Complex timeline orchestration." },
  ],
  links: [
    { source: "JONATHAN", target: "Strategy" }, { source: "JONATHAN", target: "Engineering" }, { source: "JONATHAN", target: "Creative" },
    { source: "Strategy", target: "Global Ops" }, { source: "Strategy", target: "Governance" },
    { source: "Engineering", target: "Next.js 15" }, { source: "Engineering", target: "Gemini API" }, { source: "Engineering", target: "Audio AI" },
    { source: "Creative", target: "WebGL" }, { source: "Creative", target: "GSAP" },
    { source: "Gemini API", target: "Governance" }, 
  ]
};

const TOUR_STEPS = ["JONATHAN", "Strategy", "Engineering", "Creative", "Gemini API"];
const STAGE_X = 400; 
const STAGE_Y = 0;

export default function TechConstellation() {
  const fgRef = useRef<ForceGraphMethods | undefined>(undefined);
  const [dimensions, setDimensions] = useState({ w: 1000, h: 800 });
  const [activeNode, setActiveNode] = useState<any>(initialData.nodes[0]); 
  const [isTransitioning, setIsTransitioning] = useState(false); 
  const [currentTrend, setCurrentTrend] = useState("");
  
  const indexRef = useRef(0);
  const autoPilotRef = useRef(true);
  const currentNodeRef = useRef<any>(null);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setDimensions({ w: window.innerWidth, h: window.innerHeight });
      const resize = () => setDimensions({ w: window.innerWidth, h: window.innerHeight });
      window.addEventListener("resize", resize);
      return () => window.removeEventListener("resize", resize);
    }
  }, []);

  useEffect(() => {
    if (fgRef.current) {
        const graph = fgRef.current;
        graph.d3Force('charge')?.strength(-200); 
        graph.d3Force('link')?.distance(100);
        graph.d3Force('center')?.x(STAGE_X); 
        graph.d3Force('center')?.y(STAGE_Y);
        graph.centerAt(STAGE_X, STAGE_Y, 0);
        graph.zoom(3.5, 0);
    }
  }, []);

  useEffect(() => {
    if (activeNode && !isTransitioning) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const trends = LIVE_TRENDS[activeNode.id as keyof typeof LIVE_TRENDS] || ["SCANNING...", "CONNECTING..."];
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
      duration: 2.5,
      ease: "power3.inOut",
      onUpdate: () => { fgRef.current?.d3ReheatSimulation(); }
    });

    setTimeout(() => {
      setActiveNode(node);
      setIsTransitioning(false);
    }, 800); 
  };

  // AUTO-PILOT LOOP
  useEffect(() => {
    const interval = setInterval(() => {
      if (!autoPilotRef.current) return;

      const nextIndex = (indexRef.current + 1) % TOUR_STEPS.length;
      indexRef.current = nextIndex;
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const graphNodes = (initialData.nodes as any[]);
      const node = graphNodes.find(n => n.id === TOUR_STEPS[nextIndex]);

      if (node) transitionToNode(node);
    }, 12000);

    return () => clearInterval(interval);
  }, []);

  // --- FIX: Added string casting to node.id ---
  const triggerInteraction = useCallback((nodeId: string) => {
    autoPilotRef.current = false;
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const graphNodes = (initialData.nodes as any[]); 
    const node = graphNodes.find(n => n.id === nodeId);
    
    if (node) transitionToNode(node);

    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
      autoPilotRef.current = true;
    }, 5000); 
  }, []);

  return (
    <div className="fixed inset-0 bg-[#050505] overflow-hidden">
      
      {/* LEFT CARD */}
      <div className="absolute left-0 top-0 h-full w-full md:w-[650px] flex items-center p-8 md:p-12 z-20 pointer-events-none">
        <div 
          className={`pointer-events-auto w-full transition-all duration-700 transform 
            ${isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}
        >
           <div className="bg-black/70 backdrop-blur-3xl border border-white/10 p-10 md:p-12 shadow-[0_0_100px_rgba(0,0,0,0.9)] relative overflow-hidden rounded-2xl">
              
              <div className="absolute top-0 left-0 w-2 h-full transition-colors duration-500" 
                   style={{ backgroundColor: activeNode?.color || '#fff' }} />
              
              {/* LIVE FEED */}
              <div className="mb-8 border-b border-gray-800 pb-6">
                <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-gray-500">System Focus</span>
                    <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                        <span className="text-[9px] font-mono text-white uppercase tracking-wider">Scanning</span>
                    </div>
                </div>
                <p className="text-xs font-mono text-[#00FF94] h-8 leading-relaxed">
                  {currentTrend}<span className="animate-pulse text-white">_</span>
                </p>
              </div>

              <h3 className="font-mono text-[#0070F3] text-xs mb-3 uppercase tracking-widest" 
                  style={{ color: activeNode?.color }}>
                {activeNode?.role}
              </h3>
              <h1 className="text-5xl md:text-6xl font-sans font-bold text-white mb-8 leading-[0.9] tracking-tight">
                {activeNode?.title || activeNode?.id}
              </h1>

              <p className="text-lg text-gray-300 font-sans leading-relaxed mb-8 max-w-xl">
                {activeNode?.desc}
              </p>

              {activeNode?.bullets && (
                <div className="grid gap-3 mb-8">
                  {activeNode.bullets.map((b: string, i: number) => (
                    <div key={i} className="flex items-start gap-3 text-gray-400">
                      <span className="text-[#0070F3] mt-1">▸</span>
                      <span className="font-mono text-sm leading-relaxed">{b}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeNode?.metrics && (
                <div className="grid grid-cols-3 gap-4 mb-8 pt-8 border-t border-white/10">
                  {activeNode.metrics.map((m: string) => (
                    <div key={m} className="text-center">
                      <span className="block text-xs font-mono text-gray-500 mb-1 uppercase tracking-wider">Metric</span>
                      <span className="block text-sm font-bold text-white">{m}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4 pt-6 border-t border-gray-800">
                  <button 
                    onClick={() => document.getElementById('content-start')?.scrollIntoView({behavior:'smooth'})}
                    className="w-full border border-white/20 bg-white/5 px-6 py-4 text-xs font-mono text-white hover:bg-white hover:text-black transition-all uppercase tracking-widest"
                  >
                    INITIATE RESEARCH &darr;
                  </button>
              </div>
           </div>
        </div>
      </div>

      {/* RIGHT BRAIN CANVAS */}
      <ForceGraph2D
        ref={fgRef}
        width={dimensions.w}
        height={dimensions.h}
        graphData={initialData}
        backgroundColor="#050505"
        
        // FIX: Explicitly cast ID to string
        onNodeClick={(node) => triggerInteraction(node.id as string)}
        onNodeDrag={() => triggerInteraction(activeNode.id as string)} 
        onBackgroundClick={() => triggerInteraction(activeNode.id as string)}
        
        cooldownTicks={100}
        d3AlphaDecay={0.05} 
        d3VelocityDecay={0.6}
        
        nodeRelSize={9}
        linkColor={() => "#ffffff15"}
        linkWidth={1.5}
        linkDirectionalParticles={2}
        linkDirectionalParticleSpeed={0.005}
        
        nodeCanvasObject={(node, ctx, globalScale) => {
          if (!Number.isFinite(node.x) || !Number.isFinite(node.y)) return;

          const isTarget = node.id === activeNode?.id;
          const color = (node.color as string) || "#fff";
          
          const pulse = Math.sin(Date.now() / 800) * 3; 
          const baseRadius = 6;
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

          if (node.group <= 2) {
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