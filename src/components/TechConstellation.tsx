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
  "Gemini API": ["UPDATE: Gemini 1.5 Pro context expansion.", "USE CASE: Multimodal accessibility."],
  "Geopolitics": ["SIGNAL: Digital Borders tightening.", "RISK: Splinternet compliance."],
  "Audio AI": ["TREND: Neural Voice Synthesis.", "TECH: Real-time latency < 200ms."],
  "Accessibility": ["LAW: WCAG 2.2 enforcement.", "UX: AI Screen Readers."],
  "AR / VR": ["TECH: WebXR Standards.", "MARKET: Apple Vision Pro adoption."],
  "Cloud": ["INFRA: Serverless Edge Compute.", "COST: FinOps automation."]
};

// --- 2. RESUME DATA (20 Nodes) ---
const initialData = {
  nodes: [
    // --- CORE ---
    { id: "JONATHAN", group: 1, val: 100, color: "#FFFFFF", title: "JONATHAN W. MARINO", role: "Digital Polymath", desc: "Architecting the intersection of Policy, Code, and Design." },
    
    // --- STRATEGIC ORBIT ---
    { id: "Strategy", group: 2, val: 40, color: "#0070F3", title: "STRATEGIC RISK", role: "Geopolitical & Technical", desc: "Mitigating enterprise risk via policy/code bridges." },
    { id: "Geopolitics", group: 3, val: 20, color: "#0070F3", title: "GEOPOLITICS", role: "Digital Sovereignty", desc: "Mapping unmapped territories (Rio Favelas) to establish civic identity." },
    { id: "Governance", group: 3, val: 20, color: "#0070F3", title: "GOVERNANCE", role: "Policy as Code", desc: "Automating compliance for global data standards." },
    
    // --- ENGINEERING ORBIT ---
    { id: "Engineering", group: 2, val: 40, color: "#00FF94", title: "ENGINEERING VELOCITY", role: "Full-Stack & GenAI", desc: "Deploying AI agents to reclaim executive hours." },
    { id: "GenAI", group: 3, val: 30, color: "#00FF94", title: "GENERATIVE AI", role: "LLM Integration", desc: "Building 'SlideSense' and 'Stevie' on Gemini API." },
    { id: "Audio AI", group: 3, val: 20, color: "#00FF94", title: "AUDIO SYNTHESIS", role: "Neural Speech", desc: "Pioneering text-to-speech accessibility tools." },
    { id: "Cloud", group: 3, val: 20, color: "#00FF94", title: "CLOUD INFRA", role: "GCP & Edge", desc: "Scalable architecture for global tool deployment." },
    { id: "Analytics", group: 3, val: 20, color: "#00FF94", title: "DATA ANALYTICS", role: "GA4 & SQL", desc: "Custom widgets (CARTA) for document tracking." },
    { id: "Next.js", group: 3, val: 20, color: "#00FF94", title: "NEXT.JS", role: "Modern Web", desc: "Server Components and PPR for high-performance UI." },

    // --- CREATIVE ORBIT ---
    { id: "Creative", group: 2, val: 40, color: "#FF0055", title: "CREATIVE INTELLIGENCE", role: "High-Fidelity Motion", desc: "Translating abstract strategy into visceral 3D narratives." },
    { id: "Motion", group: 3, val: 20, color: "#FF0055", title: "MOTION DESIGN", role: "3D & Animation", desc: "Super Bowl campaigns (E-Trade Baby) and viral hits." },
    { id: "WebGL", group: 3, val: 20, color: "#FF0055", title: "WEBGL", role: "Immersive Web", desc: "3D Swirl Ads and browser-based VR experiences." },
    { id: "AR / VR", group: 3, val: 20, color: "#FF0055", title: "XR COMPUTING", role: "Augmented Reality", desc: "YouTube 'Try-On' modules for e-commerce." },
    { id: "Storytelling", group: 3, val: 20, color: "#FF0055", title: "STORYTELLING", role: "Narrative Strategy", desc: "Aligning stakeholders through visual persuasion." },

    // --- OPERATIONS ORBIT ---
    { id: "Global Ops", group: 4, val: 30, color: "#FFCC00", title: "GLOBAL OPS", role: "Scale & Efficiency", desc: "Scaling vendor operations across APAC/EMEA/AMER." },
    { id: "Process", group: 4, val: 20, color: "#FFCC00", title: "PROCESS ENG", role: "SOPs & BRDs", desc: "Codifying tacit knowledge into scalable systems." },
    { id: "Vendor Mgmt", group: 4, val: 20, color: "#FFCC00", title: "VENDOR MGMT", role: "Supply Chain", desc: "Managing multi-million dollar creative pipelines." },
    { id: "Accessibility", group: 4, val: 20, color: "#FFCC00", title: "ACCESSIBILITY", role: "A11y & WCAG", desc: "Democratizing AI access for visually impaired users." },
    { id: "Viral History", group: 4, val: 20, color: "#FFCC00", title: "VIRAL HISTORY", role: "Legacy", desc: "Architect of 'Monk-e-Mail' (50M+ users)." },
  ],
  links: [
    { source: "JONATHAN", target: "Strategy" }, { source: "JONATHAN", target: "Engineering" }, 
    { source: "JONATHAN", target: "Creative" }, { source: "JONATHAN", target: "Global Ops" },
    
    { source: "Strategy", target: "Geopolitics" }, { source: "Strategy", target: "Governance" },
    { source: "Geopolitics", target: "Global Ops" },
    
    { source: "Engineering", target: "GenAI" }, { source: "Engineering", target: "Cloud" },
    { source: "Engineering", target: "Analytics" }, { source: "Engineering", target: "Next.js" },
    { source: "GenAI", target: "Audio AI" }, { source: "GenAI", target: "Governance" },
    
    { source: "Creative", target: "Motion" }, { source: "Creative", target: "WebGL" },
    { source: "Creative", target: "AR / VR" }, { source: "Creative", target: "Storytelling" },
    { source: "Motion", target: "Viral History" },
    
    { source: "Global Ops", target: "Process" }, { source: "Global Ops", target: "Vendor Mgmt" },
    { source: "Global Ops", target: "Accessibility" }, { source: "Accessibility", target: "Audio AI" },
  ]
};

const TOUR_STEPS = ["JONATHAN", "Strategy", "Engineering", "Creative", "Global Ops", "GenAI", "Geopolitics"];

// STAGE COORDINATES (Shifted Right to avoid Card)
const FOCUS_X = 350;
const FOCUS_Y = 0;

export default function TechConstellation() {
  const fgRef = useRef<ForceGraphMethods | undefined>(undefined);
  const [dimensions, setDimensions] = useState({ w: 1000, h: 800 });
  const [activeNode, setActiveNode] = useState<any>(null); 
  const [isTransitioning, setIsTransitioning] = useState(false); 
  const [currentTrend, setCurrentTrend] = useState("");
  
  // Refs
  const tourIndexRef = useRef(0);
  const autoPilotRef = useRef(true);
  const currentNodeRef = useRef<any>(null);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const updateSize = () => setDimensions({ w: window.innerWidth, h: window.innerHeight });
      window.addEventListener("resize", updateSize);
      updateSize();
      return () => window.removeEventListener("resize", updateSize);
    }
  }, []);

  // --- PHYSICS INIT ---
  useEffect(() => {
    if (fgRef.current) {
        const graph = fgRef.current;
        // Push everything to the right side of screen
        graph.d3Force('charge')?.strength(-150); 
        graph.d3Force('link')?.distance(80);
        graph.d3Force('center')?.x(FOCUS_X); 
        graph.d3Force('center')?.y(FOCUS_Y);

        // Camera looks at the stage
        graph.centerAt(FOCUS_X, FOCUS_Y, 0);
        graph.zoom(0.1, 0); // Start far out

        // Big Bang Zoom In
        setTimeout(() => {
          graph.zoom(3.5, 2500);
        }, 500);
    }
  }, []);

  // --- INTELLIGENCE ENGINE ---
  useEffect(() => {
    if (activeNode && !isTransitioning) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const trends = LIVE_TRENDS[activeNode.id as keyof typeof LIVE_TRENDS] || ["ANALYZING DATA STREAM...", "CONNECTING TO FEED...", "CALCULATING IMPACT..."];
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

  // --- MAGNETIC DRAG ANIMATION ---
  const magnetizeNode = (nodeId: string) => {
    if (!fgRef.current) return;
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const graphNodes = (initialData.nodes as any[]); 
    const node = graphNodes.find(n => n.id === nodeId);

    if (node) {
      setIsTransitioning(true);

      // Release old node
      if (currentNodeRef.current && currentNodeRef.current !== node) {
        currentNodeRef.current.fx = undefined;
        currentNodeRef.current.fy = undefined;
      }
      currentNodeRef.current = node;

      // Lock start position
      node.fx = node.x;
      node.fy = node.y;

      // Animate to Stage
      gsap.to(node, {
        fx: FOCUS_X,
        fy: FOCUS_Y,
        duration: 2.5,
        ease: "power3.inOut",
        onUpdate: () => {
          // FIX: Wrapped in braces to return void (TypeScript fix)
          fgRef.current?.d3ReheatSimulation(); 
        }
      });

      // UI Transition
      setTimeout(() => {
        setActiveNode(node);
        setIsTransitioning(false);
      }, 800); 
    }
  };

  // --- AUTO-PILOT LOOP ---
  useEffect(() => {
    // Kickoff
    magnetizeNode(TOUR_STEPS[0]);

    const interval = setInterval(() => {
      if (!autoPilotRef.current) return;

      const nextIndex = (tourIndexRef.current + 1) % TOUR_STEPS.length;
      tourIndexRef.current = nextIndex;
      
      magnetizeNode(TOUR_STEPS[nextIndex]);

    }, 10000); // 10s per node

    return () => clearInterval(interval);
  }, []);

  // --- INTERACTION ---
  const handleNodeClick = useCallback((node: any) => {
    // Stop Auto
    autoPilotRef.current = false;
    
    // Move Node
    magnetizeNode(node.id);

    // Restart Auto after 15s idle
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
      autoPilotRef.current = true;
    }, 15000);

  }, []);

  return (
    <div className="fixed inset-0 bg-[#050505] overflow-hidden">
      
      {/* --- PERSISTENT HEADER --- */}
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

      {/* --- LEFT CARD --- */}
      <div className="absolute left-0 bottom-0 h-[65%] w-full md:w-[600px] flex items-end p-8 md:p-12 z-20 pointer-events-none">
        <div 
          className={`pointer-events-auto w-full transition-all duration-700 transform 
            ${isTransitioning ? 'opacity-0 translate-y-10' : 'opacity-100 translate-y-0'}`}
        >
           {activeNode && activeNode.id !== "JONATHAN" && (
             <div className="bg-black/60 backdrop-blur-2xl border border-white/10 p-8 md:p-10 shadow-2xl relative overflow-hidden rounded-tr-2xl">
                <div className="absolute top-0 left-0 w-1 h-full transition-colors duration-500" style={{ backgroundColor: activeNode?.color || '#fff' }} />
                
                <div className="mb-6 border-b border-gray-800 pb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[9px] font-mono text-red-500 uppercase tracking-widest">Live Signal</span>
                    <span className="w-1 h-1 bg-red-500 rounded-full animate-pulse"/>
                  </div>
                  <p className="text-xs font-mono text-[#00FF94] h-8 leading-relaxed">
                    {currentTrend}<span className="animate-pulse text-white">_</span>
                  </p>
                </div>

                <h3 className="font-mono text-[#0070F3] text-xs mb-2 uppercase tracking-widest" style={{ color: activeNode?.color }}>
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

      {/* --- RIGHT BRAIN --- */}
      <ForceGraph2D
        ref={fgRef}
        width={dimensions.w}
        height={dimensions.h}
        graphData={initialData}
        backgroundColor="#050505"
        
        onNodeClick={handleNodeClick}
        onNodeDrag={() => { autoPilotRef.current = false; }}
        onBackgroundClick={() => { autoPilotRef.current = false; }}
        
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
          const isCore = node.id === "JONATHAN";
          const color = (node.color as string) || "#fff";
          
          if (isCore) return; // Hide JONATHAN node visual (handled by HTML header)

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