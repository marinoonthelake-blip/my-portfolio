"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import ForceGraph2D, { ForceGraphMethods } from "react-force-graph-2d";
import gsap from "gsap";

// --- 1. CONFIGURATION ---
// The "Stage" is shifted 450px to the right of the screen center.
// This keeps the brain out of the way of the Left Card.
const STAGE_X = 450;
const STAGE_Y = 0;

// Zoom Levels
const ZOOM_WIDE = 2.5;  // Seeing the whole network
const ZOOM_TIGHT = 4.5; // Focused on the active node

// --- 2. LIVE INTELLIGENCE DATA ---
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
    { 
      id: "JONATHAN", group: 1, val: 60, color: "#FFFFFF",
      title: "JONATHAN W. MARINO", role: "Strategic Technology Executive",
      desc: "A hybrid executive architecting the intersection of Geopolitics, Data, and Design.",
      metrics: ["15+ Years Exp", "Global Scale", "Polymathic"]
    },
    { 
      id: "Strategy", group: 2, val: 30, color: "#0070F3", 
      title: "STRATEGIC RISK", role: "Geopolitical & Technical", 
      desc: "Mitigating enterprise risk by bridging the gap between policy mandates and code enforcement.",
      metrics: ["1.4M Citizens Mapped", "Privacy Compliance", "Cross-Border Policy"]
    },
    { 
      id: "Engineering", group: 2, val: 30, color: "#00FF94", 
      title: "ENGINEERING VELOCITY", role: "Full-Stack & GenAI", 
      desc: "Deploying AI agents (SlideSense) to automate workflows and reclaim executive hours.",
      metrics: ["$300k+ Annual Savings", "Automated Governance", "Gemini API Integration"]
    },
    { 
      id: "Creative", group: 2, val: 30, color: "#FF0055", 
      title: "CREATIVE INTELLIGENCE", role: "High-Fidelity Motion", 
      desc: "Translating abstract strategy into visceral 3D narratives that win stakeholder buy-in.",
      metrics: ["50M+ User Engagement", "Super Bowl Campaigns", "Interactive Storytelling"]
    },
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

const TOUR_STEPS = ["JONATHAN", "Strategy", "Engineering", "Creative", "Gemini API"];

export default function TechConstellation() {
  const fgRef = useRef<ForceGraphMethods | undefined>(undefined);
  const [dimensions, setDimensions] = useState({ w: 1000, h: 800 });
  const [activeNode, setActiveNode] = useState<any>(initialData.nodes[0]); 
  const [isTransitioning, setIsTransitioning] = useState(false); 
  const [currentTrend, setCurrentTrend] = useState("");
  
  const tourIndexRef = useRef(0);
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

  // 1. INITIALIZATION: Set Physics Center and Camera
  useEffect(() => {
    if (fgRef.current) {
        const graph = fgRef.current;
        
        // PHYSICS: Nodes naturally float around the Stage (Right Side)
        graph.d3Force('charge')?.strength(-200); 
        graph.d3Force('link')?.distance(100);
        graph.d3Force('center')?.x(STAGE_X); 
        graph.d3Force('center')?.y(STAGE_Y);

        // CAMERA: Start looking exactly at the Stage
        // Start ZOOMED OUT (0.1) for the "Big Bang" effect
        graph.centerAt(STAGE_X, STAGE_Y, 0); 
        graph.zoom(0.1, 0);

        // ANIMATE IN: Zoom to Wide View
        setTimeout(() => {
          graph.zoom(ZOOM_WIDE, 2000);
        }, 500);
    }
  }, []);

  // 2. TYPING EFFECT
  useEffect(() => {
    if (activeNode && !isTransitioning) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const trends = LIVE_TRENDS[activeNode.id as keyof typeof LIVE_TRENDS] || ["ANALYZING SYSTEM DATA...", "CONNECTING..."];
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

  // --- 3. CINEMATIC TRANSITION ENGINE ---
  const transitionToNode = (node: any) => {
    if (!fgRef.current) return;

    // A. CARD FADE OUT
    setIsTransitioning(true);

    // B. CAMERA BREATH (Zoom Out)
    // Pull back to see the movement
    fgRef.current.zoom(ZOOM_WIDE, 1000);

    // C. RELEASE OLD NODE
    if (currentNodeRef.current && currentNodeRef.current !== node) {
      currentNodeRef.current.fx = undefined;
      currentNodeRef.current.fy = undefined;
    }
    currentNodeRef.current = node;

    // D. DRAG NEW NODE TO CENTER STAGE
    // Lock starting position to prevent teleporting
    node.fx = node.x;
    node.fy = node.y;
    
    gsap.to(node, {
      fx: STAGE_X, // Drag to Right-Side Center
      fy: STAGE_Y,
      duration: 2.0,
      ease: "power4.inOut",
      onUpdate: () => {
        fgRef.current?.d3ReheatSimulation(); // Keep lines elastic
      },
      onComplete: () => {
        // E. CAMERA FOCUS (Zoom In)
        // Once arrived, zoom in tight on the subject
        fgRef.current?.zoom(ZOOM_TIGHT, 1500);
        
        // F. CARD FADE IN
        setActiveNode(node);
        setIsTransitioning(false);
      }
    });
  };

  // --- 4. AUTO-PILOT LOOP ---
  useEffect(() => {
    const interval = setInterval(() => {
      if (!autoPilotRef.current) return;

      const nextIndex = (tourIndexRef.current + 1) % TOUR_STEPS.length;
      tourIndexRef.current = nextIndex;
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const graphNodes = (initialData.nodes as any[]);
      const node = graphNodes.find(n => n.id === TOUR_STEPS[nextIndex]);

      if (node) {
        transitionToNode(node);
      }
    }, 8000); // 8 Seconds per beat

    return () => clearInterval(interval);
  }, []);

  const handleInteraction = useCallback((node: any) => {
    autoPilotRef.current = false;
    transitionToNode(node);
  }, []);

  return (
    <div className="fixed inset-0 bg-[#050505] overflow-hidden">
      
      {/* --- LEFT CARD --- */}
      <div className="absolute left-0 top-0 h-full w-full md:w-[750px] flex items-center p-8 md:p-16 z-20 pointer-events-none">
        <div 
          className={`pointer-events-auto w-full transition-all duration-700 transform 
            ${isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}
        >
           <div className="bg-black/70 backdrop-blur-3xl border border-white/10 p-12 shadow-[0_0_100px_rgba(0,0,0,0.9)] relative overflow-hidden rounded-2xl">
              <div className="absolute top-0 left-0 w-2 h-full transition-colors duration-500" style={{ backgroundColor: activeNode?.color || '#fff' }} />
              
              {/* HEADER */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex flex-col">
                  <span className="font-mono text-xs tracking-[0.3em] uppercase text-gray-500 mb-1">System Node</span>
                  <span className="font-mono text-white text-lg">{activeNode?.group === 1 ? 'KERNEL' : `SECTOR_0${activeNode?.group}`}</span>
                </div>
                <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_red]" />
                  <span className="text-[10px] font-mono text-white uppercase tracking-wider">Live Feed</span>
                </div>
              </div>

              {/* CONTENT */}
              <h3 className="font-mono text-[#0070F3] text-sm mb-3 uppercase tracking-widest" style={{ color: activeNode?.color }}>{activeNode?.role}</h3>
              <h1 className="text-5xl md:text-6xl font-sans font-bold text-white mb-8 leading-[0.9] tracking-tight">{activeNode?.title || activeNode?.id}</h1>
              <p className="text-lg text-gray-300 font-sans leading-relaxed mb-8 border-l-2 border-gray-800 pl-6">{activeNode?.desc}</p>

              {/* METRICS */}
              {activeNode?.metrics && (
                <div className="grid grid-cols-3 gap-4 mb-8">
                  {activeNode.metrics.map((m: string) => (
                    <div key={m} className="bg-white/5 border border-white/5 p-3 rounded text-center">
                      <span className="text-xs font-mono text-gray-400">{m}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="mb-8 border-t border-gray-800 pt-6">
                <p className="text-[10px] font-mono text-gray-500 mb-2 uppercase">// LIVE INTELLIGENCE</p>
                <p className="text-sm font-mono text-[#00FF94] h-6 leading-relaxed">{currentTrend}<span className="animate-pulse text-white">_</span></p>
              </div>

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
        
        // INTERACTION
        onNodeClick={handleInteraction}
        onNodeDrag={() => { autoPilotRef.current = false; }}
        onBackgroundClick={() => { autoPilotRef.current = false; }}
        
        // PHYSICS
        cooldownTicks={100}
        d3AlphaDecay={0.01} 
        d3VelocityDecay={0.4}
        
        // VISUALS
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

          // GRADIENT GLOW
          const gradient = ctx.createRadialGradient(node.x!, node.y!, 0, node.x!, node.y!, radius * 3);
          gradient.addColorStop(0, color);
          gradient.addColorStop(0.4, color + '44');
          gradient.addColorStop(1, 'transparent');

          ctx.beginPath();
          ctx.arc(node.x!, node.y!, radius * 3, 0, 2 * Math.PI, false);
          ctx.fillStyle = gradient;
          ctx.fill();

          // SOLID CORE
          ctx.beginPath();
          ctx.arc(node.x!, node.y!, radius * 0.6, 0, 2 * Math.PI, false);
          ctx.fillStyle = "#000";
          ctx.fill();
          ctx.strokeStyle = color;
          ctx.lineWidth = 2;
          ctx.stroke();

          // DATA RINGS (Active only)
          if (isTarget) {
             ctx.beginPath();
             ctx.arc(node.x!, node.y!, radius * 1.8, 0, 2 * Math.PI, false);
             ctx.strokeStyle = color + '33';
             ctx.lineWidth = 1;
             ctx.stroke();
          }

          // LABELS
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