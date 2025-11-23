"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import ForceGraph2D, { ForceGraphMethods } from "react-force-graph-2d";
import gsap from "gsap";

// --- 1. LIVE INTELLIGENCE DATA ---
const LIVE_TRENDS = {
  "Strategy": [
    "SIGNAL: EU AI Act enforcement beginning.",
    "RISK SHIFT: Model Governance > Cloud Sec.",
    "ANALYSIS: Data sovereignty fragmentation."
  ],
  "Engineering": [
    "TRENDING: DeepSeek-V3 inference costs.",
    "STACK: Next.js 15 PPR production readiness.",
    "SHIFT: Agentic Workflows > RAG."
  ],
  "Creative": [
    "SIGNAL: WebGPU adoption +40%.",
    "DESIGN: Glassmorphism & Bento Grids.",
    "METRIC: Interactive story = -40% bounce."
  ],
  "Global Ops": ["LIVE: Vendor consolidation in EMEA.", "OPS: AI-driven SOP generation."],
  "Gemini API": ["UPDATE: Gemini 1.5 Pro context expansion.", "USE CASE: Multimodal accessibility."]
};

const initialData = {
  nodes: [
    // CORE (Now Static in Top Left, but exists in graph as anchor)
    { 
      id: "JONATHAN", group: 1, val: 60, color: "#FFFFFF",
      title: "JONATHAN W. MARINO", role: "Strategic Tech Exec", 
      desc: "Architecting the intersection of Policy, Code, and Design." 
    },
    { id: "Strategy", group: 2, val: 30, color: "#0070F3", title: "STRATEGIC RISK", role: "Geopolitical & Technical", desc: "Mitigating enterprise risk via policy/code bridges." },
    { id: "Engineering", group: 2, val: 30, color: "#00FF94", title: "ENGINEERING VELOCITY", role: "Full-Stack & GenAI", desc: "Deploying AI agents to reclaim executive hours." },
    { id: "Creative", group: 2, val: 30, color: "#FF0055", title: "CREATIVE INTELLIGENCE", role: "High-Fidelity Motion", desc: "Translating abstract strategy into visceral 3D narratives." },
    
    // ORBIT
    { id: "Global Ops", group: 3, val: 10, color: "#0070F3" },
    { id: "Governance", group: 3, val: 10, color: "#0070F3" },
    { id: "Next.js 15", group: 3, val: 10, color: "#00FF94" },
    { id: "Gemini API", group: 3, val: 15, color: "#00FF94" },
    { id: "WebGL", group: 3, val: 10, color: "#FF0055" },
    { id: "GSAP", group: 3, val: 10, color: "#FF0055" },
  ],
  links: [
    { source: "JONATHAN", target: "Strategy" }, { source: "JONATHAN", target: "Engineering" }, { source: "JONATHAN", target: "Creative" },
    { source: "Strategy", target: "Global Ops" }, { source: "Strategy", target: "Governance" },
    { source: "Engineering", target: "Next.js 15" }, { source: "Engineering", target: "Gemini API" },
    { source: "Creative", target: "WebGL" }, { source: "Creative", target: "GSAP" },
    { source: "Gemini API", target: "Governance" }, 
  ]
};

// REMOVED "JONATHAN" from tour. We never go back.
const TOUR_STEPS = ["Strategy", "Engineering", "Creative", "Gemini API", "Global Ops"];

// THE STAGE: Explicit Right-Side Coordinates
// 0 is center screen. +300 is right side.
const FOCUS_X = 300; 
const FOCUS_Y = 0;

export default function TechConstellation() {
  const fgRef = useRef<ForceGraphMethods | undefined>(undefined);
  const [dimensions, setDimensions] = useState({ w: 1000, h: 800 });
  const [activeNode, setActiveNode] = useState<any>(null); // Start null to show "Initializing"
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

  // PHYSICS INIT
  useEffect(() => {
    if (fgRef.current) {
        const graph = fgRef.current;
        // 1. Push Gravity Well to the RIGHT (+300)
        // This ensures all nodes naturally float on the right side
        graph.d3Force('charge')?.strength(-200); 
        graph.d3Force('center')?.x(FOCUS_X); 
        graph.d3Force('center')?.y(FOCUS_Y);

        // 2. Lock Camera to the Right Side
        graph.centerAt(FOCUS_X, FOCUS_Y, 0);
        graph.zoom(3.0, 0); // Tight zoom on the "Stage"
    }
  }, []);

  // INTELLIGENCE STREAM
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

  // --- MAGNETIC DRAG ENGINE ---
  const magnetizeNode = (nodeId: string) => {
    if (!fgRef.current) return;
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const graphNodes = (initialData.nodes as any[]); 
    const node = graphNodes.find(n => n.id === nodeId);

    if (node) {
      // Release old node
      if (currentNodeRef.current && currentNodeRef.current !== node) {
        currentNodeRef.current.fx = undefined;
        currentNodeRef.current.fy = undefined;
      }
      currentNodeRef.current = node;
      setActiveNode(node);

      // Lock & Drag to Stage (Right Side)
      node.fx = node.x;
      node.fy = node.y;

      gsap.to(node, {
        fx: FOCUS_X,
        fy: FOCUS_Y,
        duration: 2.0,
        ease: "power3.inOut",
        onUpdate: () => {
          fgRef.current?.d3ReheatSimulation(); 
        }
      });
    }
  };

  // --- AUTO-PILOT LOOP ---
  useEffect(() => {
    // Initial kickoff: Start at Index 0 ("Strategy") immediately
    magnetizeNode(TOUR_STEPS[0]);

    const interval = setInterval(() => {
      if (!autoPilotRef.current) return;

      const nextIndex = (indexRef.current + 1) % TOUR_STEPS.length;
      indexRef.current = nextIndex;
      
      magnetizeNode(TOUR_STEPS[nextIndex]);

    }, 6000); // 6 Seconds per node

    return () => clearInterval(interval);
  }, []);

  const handleInteraction = useCallback((node: any) => {
    if (node.id === "JONATHAN") return;
    autoPilotRef.current = false;
    magnetizeNode(node.id);
  }, []);

  return (
    <div className="fixed inset-0 bg-[#050505] overflow-hidden">
      
      {/* --- 1. PERSISTENT TOP-LEFT IDENTITY (Always Visible) --- */}
      <div className="absolute top-0 left-0 p-8 z-50 pointer-events-auto">
        <div className="flex flex-col items-start">
          <span className="font-mono text-[#0070F3] text-xs mb-2 tracking-[0.2em] uppercase">
            System Core
          </span>
          <h1 className="text-3xl font-sans font-bold text-white mb-4 leading-none">
            JONATHAN<br/>W. MARINO
          </h1>
          <button 
             onClick={() => document.getElementById('content-start')?.scrollIntoView({behavior:'smooth'})}
             className="flex items-center gap-2 text-xs font-mono text-gray-400 hover:text-white transition-colors border-b border-transparent hover:border-white pb-1"
          >
             <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"/>
             INITIATE SEQUENCE &darr;
          </button>
        </div>
      </div>

      {/* --- 2. DYNAMIC LEFT CARD (Updates with Nodes) --- */}
      <div className="absolute left-0 top-0 h-full w-full md:w-[600px] flex items-center p-8 z-20 pointer-events-none">
        <div className={`pointer-events-auto w-full transition-all duration-700 transform ${activeNode ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
           
           {/* Only show this card if we are NOT on the core node (which we shouldn't be anymore) */}
           {activeNode && activeNode.id !== "JONATHAN" && (
             <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-10 mt-24 shadow-2xl relative overflow-hidden rounded-lg">
                <div className="absolute top-0 left-0 w-1 h-full transition-colors duration-500" style={{ backgroundColor: activeNode?.color || '#fff' }} />
                
                <div className="flex items-center justify-between mb-6">
                  <span className="font-mono text-xs tracking-[0.2em] uppercase text-gray-500">
                    Active Neural Node
                  </span>
                  <div className="px-2 py-1 bg-white/5 rounded text-[10px] font-mono text-white">
                    LIVE
                  </div>
                </div>

                <h2 className="text-4xl font-sans font-bold text-white mb-4 leading-tight">
                  {activeNode.title || activeNode.id}
                </h2>

                {/* Live Trend Ticker */}
                <div className="mb-6 font-mono text-xs text-[#00FF94]">
                  &gt; {currentTrend}<span className="animate-pulse">_</span>
                </div>

                <p className="text-md text-gray-300 font-sans leading-relaxed">
                  {activeNode.desc}
                </p>
             </div>
           )}
        </div>
      </div>

      {/* --- 3. RIGHT BRAIN (Canvas) --- */}
      <ForceGraph2D
        ref={fgRef}
        width={dimensions.w}
        height={dimensions.h}
        graphData={initialData}
        backgroundColor="#050505"
        
        onNodeClick={handleInteraction}
        onNodeDrag={() => { autoPilotRef.current = false; }}
        onBackgroundClick={() => { autoPilotRef.current = false; }}
        
        // PHYSICS
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
          const isCore = node.id === "JONATHAN";
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

          // Solid Core
          ctx.beginPath();
          ctx.arc(node.x!, node.y!, radius * 0.6, 0, 2 * Math.PI, false);
          ctx.fillStyle = "#000";
          ctx.fill();
          ctx.strokeStyle = color;
          ctx.lineWidth = 2;
          ctx.stroke();

          // Labels: Show only non-active nodes on graph (Active is in card)
          // Exception: Show JONATHAN always so we see the anchor
          if ((!isTarget || isCore) && (node.group <= 2)) {
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