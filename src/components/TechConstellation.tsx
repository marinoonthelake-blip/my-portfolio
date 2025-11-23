"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import ForceGraph2D, { ForceGraphMethods } from "react-force-graph-2d";
import gsap from "gsap";

// --- 1. CONFIGURATION ---
// Shift 400px Right. This places the node in the visual center of the empty right-hand space.
const STAGE_X = 400; 
const STAGE_Y = 0;

const LIVE_TRENDS = {
  "Strategy": [
    "DETECTING: EU AI Act regulatory shifts...",
    "ANALYSIS: Enterprise risk moving from Cloud Sec to Model Gov.",
    "SIGNAL: Geopolitical data sovereignty fragmentation in APAC."
  ],
  "Engineering": [
    "BENCHMARK: DeepSeek-V3 vs Gemini 1.5 Pro inference costs.",
    "DEPLOY: Next.js 15 PPR moving to production.",
    "PATTERN: Shift from RAG pipelines to Agentic Workflows."
  ],
  "Creative": [
    "TREND: WebGPU adoption +40% in e-commerce.",
    "UX: Glassmorphism & Bento Grids dominating SaaS.",
    "METRIC: 3D Storytelling reduces bounce rates by 40%."
  ],
  "Global Ops": ["LIVE: Vendor consolidation trends in EMEA...", "OPS: AI-driven SOP generation active."],
  "Gemini API": ["UPDATE: Context window expansion.", "USE CASE: Multimodal accessibility latency < 200ms."],
  "JONATHAN": ["SYSTEM: CONNECTED.", "STATUS: READY FOR INTERROGATION.", "MODE: EXECUTIVE OVERVIEW."]
};

// --- 2. DEEP RESUME DATA ---
const initialData = {
  nodes: [
    // CORE
    { 
      id: "JONATHAN", group: 1, val: 120, color: "#FFFFFF",
      title: "JONATHAN W. MARINO", 
      role: "STRATEGIC TECHNOLOGY EXECUTIVE",
      desc: "A hybrid executive architecting the intersection of Geopolitics, Data, and Design. I don't just manage technology; I weaponize technical curiosity to solve systemic organizational challenges.",
      bullets: [
        "15+ Years Experience (Google, Agency, Startup)",
        "Bridging the gap between Boardroom Strategy & Backend Code",
        "Architect of 'Digital Enfranchisement' for 1.4M Citizens"
      ],
      metrics: ["Global Scale", "Polymathic", "Impact-Driven"]
    },
    
    // STRATEGIC PILLAR
    { 
      id: "Strategy", group: 2, val: 60, color: "#0070F3", 
      title: "STRATEGIC RISK & POLICY", 
      role: "Geopolitical Architect", 
      desc: "Mitigating enterprise risk by translating abstract policy mandates into rigorous code enforcement. Specializing in data sovereignty and compliance across fractured geopolitical landscapes.",
      bullets: [
        "Orchestrated 'Beyond the Map' to provide digital addresses to 1.4M favela residents.",
        "Navigated multi-stakeholder diplomacy between Google, NGOs, and local gov.",
        "Established privacy frameworks for mapping vulnerable populations."
      ],
      metrics: ["1.4M Citizens", "Privacy Compliance", "Cross-Border Policy"]
    },

    // ENGINEERING PILLAR
    { 
      id: "Engineering", group: 2, val: 60, color: "#00FF94", 
      title: "ENGINEERING VELOCITY", 
      role: "Full-Stack & GenAI Lead", 
      desc: "Deploying AI agents to automate workflows and reclaim executive hours. I build internal tools that turn operational bottlenecks into automated efficiencies.",
      bullets: [
        "Built 'SlideSense' (GenAI) to automate executive presentation review.",
        "Developed 'Stevie' (Audio AI) to democratize access for visually impaired staff.",
        "Architected global keyword theming tools adopted by 100% of non-English markets."
      ],
      metrics: ["$300k+ Savings", "Automated Ops", "Gemini API Integration"]
    },

    // CREATIVE PILLAR
    { 
      id: "Creative", group: 2, val: 60, color: "#FF0055", 
      title: "CREATIVE INTELLIGENCE", 
      role: "High-Fidelity Motion", 
      desc: "Translating abstract strategy into visceral 3D narratives that win stakeholder buy-in. Leveraging motion psychology to drive adoption of new technologies.",
      bullets: [
        "Directed 'Monk-e-Mail' viral campaign (50M+ Visitors).",
        "Led 3D Design/Animation for the iconic E-Trade Baby Super Bowl ads.",
        "Pioneered '3D Swirl' display formats for Google's global clients."
      ],
      metrics: ["50M+ Engagement", "Super Bowl Ads", "Interactive Storytelling"]
    },

    // TACTICAL ORBIT (The "How")
    { id: "Global Ops", group: 3, val: 20, color: "#0070F3", title: "GLOBAL OPERATIONS", role: "Scale", desc: "Standardizing vendor ops across APAC/EMEA to ensure 24/7 delivery continuity." },
    { id: "Governance", group: 3, val: 20, color: "#0070F3", title: "GOVERNANCE", role: "Policy", desc: "Automated policy enforcement via code guardrails." },
    { id: "Next.js 15", group: 3, val: 20, color: "#00FF94", title: "NEXT.JS 15", role: "Architecture", desc: "Server Components, PPR, and Edge Middleware for sub-second latency." },
    { id: "Gemini API", group: 3, val: 30, color: "#00FF94", title: "GEMINI API", role: "LLM Integration", desc: "Deep integration of Multimodal AI for enterprise tooling." },
    { id: "Audio AI", group: 3, val: 20, color: "#00FF94", title: "AUDIO SYNTHESIS", role: "Accessibility", desc: "Neural Text-to-Speech pipelines for inclusive interfaces." },
    { id: "WebGL", group: 3, val: 20, color: "#FF0055", title: "WEBGL / THREE.JS", role: "Immersive", desc: "Browser-based 3D rendering for high-impact product demos." },
    { id: "GSAP", group: 3, val: 20, color: "#FF0055", title: "GSAP ANIMATION", role: "Motion", desc: "Complex timeline orchestration for fluid UI transitions." },
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

  // --- PHYSICS CONFIG ---
  useEffect(() => {
    if (fgRef.current) {
        const graph = fgRef.current;
        graph.d3Force('charge')?.strength(-250); 
        graph.d3Force('link')?.distance(120);
        
        // CENTER PHYSICS ON THE RIGHT SIDE (400px offset)
        graph.d3Force('center')?.x(STAGE_X); 
        graph.d3Force('center')?.y(STAGE_Y);

        // CENTER CAMERA ON THE RIGHT SIDE
        graph.centerAt(STAGE_X, STAGE_Y, 0);
        graph.zoom(3.5, 0);
    }
  }, []);

  // --- LIVE SCANNER EFFECT ---
  useEffect(() => {
    if (activeNode && !isTransitioning) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const trends = LIVE_TRENDS[activeNode.id as keyof typeof LIVE_TRENDS] || ["SCANNING NETWORK...", "ACQUIRING TARGET..."];
      const randomTrend = trends[Math.floor(Math.random() * trends.length)];
      
      let i = 0;
      setCurrentTrend("");
      const typeInterval = setInterval(() => {
        setCurrentTrend(randomTrend.substring(0, i + 1));
        i++;
        if (i > randomTrend.length) clearInterval(typeInterval);
      }, 30); // Fast typing
      return () => clearInterval(typeInterval);
    }
  }, [activeNode, isTransitioning]);

  // --- MAGNETIC DRAG ANIMATION ---
  const magnetizeNode = (nodeId: string) => {
    if (!fgRef.current) return;
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const graphNodes = (initialData.nodes as any[]); 
    const node = graphNodes.find(n => n.id === nodeId);

    if (node) {
      setIsTransitioning(true);

      // Release old node to float back
      if (currentNodeRef.current && currentNodeRef.current !== node) {
        currentNodeRef.current.fx = undefined;
        currentNodeRef.current.fy = undefined;
      }
      currentNodeRef.current = node;

      // Lock start position
      node.fx = node.x;
      node.fy = node.y;

      // Drag to STAGE_X (Right Side)
      gsap.to(node, {
        fx: STAGE_X,
        fy: STAGE_Y,
        duration: 2.5,
        ease: "power3.inOut",
        onUpdate: () => { fgRef.current?.d3ReheatSimulation(); }
      });

      // Delay UI update for drama
      setTimeout(() => {
        setActiveNode(node);
        setIsTransitioning(false);
      }, 800); 
    }
  };

  // --- AUTO-PILOT LOOP ---
  useEffect(() => {
    // Initial kick to center JONATHAN
    magnetizeNode("JONATHAN");

    const interval = setInterval(() => {
      if (!autoPilotRef.current) return;

      const nextIndex = (tourIndexRef.current + 1) % TOUR_STEPS.length;
      tourIndexRef.current = nextIndex;
      
      magnetizeNode(TOUR_STEPS[nextIndex]);

    }, 12000); // 12 Seconds per node (More time to read)

    return () => clearInterval(interval);
  }, []);

  const handleInteraction = useCallback((node: any) => {
    autoPilotRef.current = false;
    magnetizeNode(node.id);
  }, []);

  return (
    <div className="fixed inset-0 bg-[#050505] overflow-hidden">
      
      {/* --- LEFT CARD: THE COMMAND DECK --- */}
      <div className="absolute left-0 top-0 h-full w-full md:w-[900px] flex items-center p-8 md:p-16 z-20 pointer-events-none">
        <div 
          className={`pointer-events-auto w-full transition-all duration-700 transform 
            ${isTransitioning ? 'opacity-0 translate-y-10' : 'opacity-100 translate-y-0'}`}
        >
           <div className="bg-black/80 backdrop-blur-3xl border border-white/10 p-10 md:p-14 shadow-[0_0_150px_rgba(0,0,0,1)] relative overflow-hidden rounded-xl">
              
              {/* Sidebar Accent */}
              <div className="absolute top-0 left-0 w-3 h-full transition-colors duration-500" 
                   style={{ backgroundColor: activeNode?.color || '#fff' }} />
              
              {/* LIVE SCANNER HEADER */}
              <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-6">
                <div className="flex flex-col">
                  <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-gray-500 mb-2">
                    Current System Focus
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-xs font-mono text-[#00FF94] h-4">
                      {currentTrend}<span className="animate-pulse text-white">_</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* IDENTITY BLOCK */}
              <h3 className="font-mono text-[#0070F3] text-sm mb-4 uppercase tracking-widest font-bold" 
                  style={{ color: activeNode?.color }}>
                {activeNode?.role}
              </h3>
              <h1 className="text-5xl md:text-7xl font-sans font-bold text-white mb-8 leading-[0.9] tracking-tight">
                {activeNode?.title || activeNode?.id}
              </h1>

              {/* DEEP DIVE CONTENT */}
              <p className="text-xl text-gray-300 font-sans leading-relaxed mb-10 max-w-3xl">
                {activeNode?.desc}
              </p>

              {/* RESUME BULLETS */}
              {activeNode?.bullets && (
                <div className="grid gap-3 mb-10">
                  {activeNode.bullets.map((b: string, i: number) => (
                    <div key={i} className="flex items-start gap-3 text-gray-400">
                      <span className="text-[#0070F3] mt-1">▸</span>
                      <span className="font-mono text-sm leading-relaxed">{b}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* METRICS GRID */}
              {activeNode?.metrics && (
                <div className="grid grid-cols-3 gap-4 mb-8 pt-8 border-t border-white/10">
                  {activeNode.metrics.map((m: string) => (
                    <div key={m} className="text-center">
                      <span className="block text-xs font-mono text-gray-500 mb-1 uppercase tracking-wider">Key Metric</span>
                      <span className="block text-sm font-bold text-white">{m}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* CTA (Only on Jonathan) */}
              {activeNode?.id === "JONATHAN" && (
                 <button 
                   onClick={() => document.getElementById('content-start')?.scrollIntoView({behavior:'smooth'})}
                   className="w-full border border-white/20 bg-white/5 px-8 py-6 text-sm font-mono text-white hover:bg-white hover:text-black transition-all tracking-widest uppercase"
                 >
                   INITIATE RESUME SEQUENCE &darr;
                 </button>
              )}
           </div>
        </div>
      </div>

      {/* --- RIGHT BRAIN CANVAS --- */}
      <ForceGraph2D
        ref={fgRef}
        width={dimensions.w}
        height={dimensions.h}
        graphData={initialData}
        backgroundColor="#050505"
        
        onNodeClick={handleInteraction}
        onNodeDrag={() => { autoPilotRef.current = false; }}
        onBackgroundClick={() => { autoPilotRef.current = false; }}
        
        cooldownTicks={100}
        d3AlphaDecay={0.05} 
        d3VelocityDecay={0.6} // High friction for stability
        
        nodeRelSize={9}
        linkColor={() => "#ffffff15"}
        linkWidth={1.5}
        linkDirectionalParticles={2}
        linkDirectionalParticleSpeed={0.005}
        
        nodeCanvasObject={(node, ctx, globalScale) => {
          if (!Number.isFinite(node.x) || !Number.isFinite(node.y)) return;

          const isTarget = node.id === activeNode?.id;
          const color = (node.color as string) || "#fff";
          
          // Pulse Math
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

          // Label
          if (!isTarget && node.group <= 2) {
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