"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import ForceGraph2D, { ForceGraphMethods } from "react-force-graph-2d";
import gsap from "gsap";

// --- 1. LIVE INTELLIGENCE DATA ---
const LIVE_TRENDS = {
  "Strategy": ["SIGNAL: EU AI Act enforcement.", "RISK: Model Governance > Cloud Sec.", "ANALYSIS: Data sovereignty fragmentation."],
  "Engineering": ["TRENDING: DeepSeek-V3 inference.", "STACK: Next.js 15 PPR production.", "SHIFT: Agentic Workflows."],
  "Creative": ["SIGNAL: WebGPU adoption +40%.", "DESIGN: Glassmorphism & Bento Grids.", "METRIC: Interactive story = -40% bounce."],
  "Global Ops": ["LIVE: Vendor consolidation EMEA.", "OPS: AI-driven SOP generation."],
  "Gemini API": ["UPDATE: Gemini 1.5 Pro context.", "USE CASE: Multimodal accessibility."],
  "Geopolitics": ["SIGNAL: Digital Borders tightening.", "RISK: Splinternet compliance."],
  "Audio AI": ["TREND: Neural Voice Synthesis.", "TECH: Real-time latency < 200ms."],
  "Accessibility": ["LAW: WCAG 2.2 enforcement.", "UX: AI Screen Readers."],
  "AR / VR": ["TECH: WebXR Standards.", "MARKET: Apple Vision Pro adoption."],
  "Cloud": ["INFRA: Serverless Edge Compute.", "COST: FinOps automation."],
  "Governance": ["POLICY: Automated Compliance Guardrails.", "RISK: Zero-Trust Architecture."],
  "WebGL": ["PERF: 60fps on Mobile Devices.", "TECH: GLSL Shaders."],
  "Storytelling": ["UX: Narrative-driven User Journeys.", "METRIC: Time-on-site increase."]
};

// --- 2. RESUME DATA (20 Nodes) ---
const initialData = {
  nodes: [
    // CORE
    { id: "JONATHAN", group: 1, val: 100, color: "#FFFFFF", title: "JONATHAN W. MARINO", role: "Digital Polymath", desc: "Architecting the intersection of Policy, Code, and Design." },
    
    // STRATEGIC
    { id: "Strategy", group: 2, val: 40, color: "#0070F3", title: "STRATEGIC RISK", role: "Geopolitical & Technical", desc: "Mitigating enterprise risk via policy/code bridges.", metrics: ["1.4M Citizens Mapped", "Privacy Compliance", "Cross-Border Policy"] },
    { id: "Engineering", group: 2, val: 40, color: "#00FF94", title: "ENGINEERING VELOCITY", role: "Full-Stack & GenAI", desc: "Deploying AI agents to reclaim executive hours.", metrics: ["$300k+ Annual Savings", "Automated Governance", "Gemini API Integration"] },
    { id: "Creative", group: 2, val: 40, color: "#FF0055", title: "CREATIVE INTELLIGENCE", role: "High-Fidelity Motion", desc: "Translating abstract strategy into visceral 3D narratives.", metrics: ["50M+ User Engagement", "Super Bowl Campaigns", "Interactive Storytelling"] },

    // ORBIT
    { id: "Global Ops", group: 3, val: 20, color: "#0070F3", title: "GLOBAL OPERATIONS", role: "Scale", desc: "Standardizing vendor ops across APAC/EMEA." },
    { id: "Governance", group: 3, val: 20, color: "#0070F3", title: "GOVERNANCE", role: "Policy", desc: "Automated policy enforcement via code." },
    { id: "Geopolitics", group: 3, val: 20, color: "#0070F3", title: "GEOPOLITICS", role: "Sovereignty", desc: "Mapping unmapped territories to establish civic identity." },
    
    { id: "Next.js", group: 3, val: 20, color: "#00FF94", title: "NEXT.JS", role: "Architecture", desc: "Server Components and PPR for high-performance UI." },
    { id: "Gemini API", group: 3, val: 25, color: "#00FF94", title: "GEMINI API", role: "LLM Integration", desc: "Building 'SlideSense' and 'Stevie' on Google's AI." },
    { id: "Audio AI", group: 3, val: 20, color: "#00FF94", title: "AUDIO AI", role: "Synthesis", desc: "Neural voice synthesis for accessibility tools." },
    { id: "Cloud", group: 3, val: 20, color: "#00FF94", title: "CLOUD INFRA", role: "GCP", desc: "Scalable architecture for global tool deployment." },
    
    { id: "WebGL", group: 3, val: 20, color: "#FF0055", title: "WEBGL", role: "Immersive", desc: "3D Swirl Ads and browser-based VR experiences." },
    { id: "GSAP", group: 3, val: 20, color: "#FF0055", title: "GSAP ANIMATION", role: "Motion", desc: "Complex timeline orchestration for web UI." },
    { id: "AR / VR", group: 3, val: 20, color: "#FF0055", title: "XR COMPUTING", role: "Spatial", desc: "YouTube 'Try-On' modules for e-commerce." },
    { id: "Storytelling", group: 3, val: 20, color: "#FF0055", title: "STORYTELLING", role: "Narrative", desc: "Aligning stakeholders through visual persuasion." },
  ],
  links: [
    { source: "JONATHAN", target: "Strategy" }, { source: "JONATHAN", target: "Engineering" }, { source: "JONATHAN", target: "Creative" },
    { source: "Strategy", target: "Global Ops" }, { source: "Strategy", target: "Governance" }, { source: "Strategy", target: "Geopolitics" },
    { source: "Engineering", target: "Next.js" }, { source: "Engineering", target: "Gemini API" }, { source: "Engineering", target: "Audio AI" }, { source: "Engineering", target: "Cloud" },
    { source: "Creative", target: "WebGL" }, { source: "Creative", target: "GSAP" }, { source: "Creative", target: "AR / VR" }, { source: "Creative", target: "Storytelling" },
    { source: "Gemini API", target: "Governance" }, // Cross-link
    { source: "Geopolitics", target: "Global Ops" },
  ]
};

// ALL VISITABLE NODES (Excluding Core)
const ALL_STEPS = [
  "Strategy", "Engineering", "Creative", 
  "Global Ops", "Governance", "Geopolitics",
  "Next.js", "Gemini API", "Audio AI", "Cloud",
  "WebGL", "GSAP", "AR / VR", "Storytelling"
];

const STAGE_X = 350; // Center of the "Right Side" empty space
const STAGE_Y = 0;

export default function TechConstellation() {
  const fgRef = useRef<ForceGraphMethods | undefined>(undefined);
  const [dimensions, setDimensions] = useState({ w: 1000, h: 800 });
  
  const [activeNode, setActiveNode] = useState<any>(initialData.nodes[0]); 
  const [isIntro, setIsIntro] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false); 
  const [currentTrend, setCurrentTrend] = useState("");
  
  // "Deck of Cards" Logic Refs
  const deckRef = useRef<string[]>([]); 
  const autoPilotRef = useRef(true);
  const currentNodeRef = useRef<any>(null);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Helper: Shuffle Array (Fisher-Yates)
  const shuffleDeck = () => {
    const deck = [...ALL_STEPS];
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  };

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
        graph.d3Force('charge')?.strength(-150); 
        graph.d3Force('link')?.distance(100);
        graph.d3Force('center')?.x(STAGE_X); 
        graph.d3Force('center')?.y(STAGE_Y);

        graph.centerAt(STAGE_X, STAGE_Y, 0);
        graph.zoom(3.5, 0);
        
        // Initialize Deck
        deckRef.current = shuffleDeck();
    }
  }, []);

  // --- TYPING EFFECT ---
  useEffect(() => {
    if (activeNode && !isTransitioning) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const trends = LIVE_TRENDS[activeNode.id as keyof typeof LIVE_TRENDS] || ["ANALYZING DATA...", "CONNECTING..."];
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

  // --- ANIMATION SEQUENCE ---
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
      onUpdate: () => { fgRef.current?.d3ReheatSimulation(); }
    });

    setTimeout(() => {
      if (node.id !== "JONATHAN") setIsIntro(false);
      setActiveNode(node);
      setIsTransitioning(false);
    }, 800); 
  };

  // --- AUTO-PILOT (DECK LOGIC) ---
  const playNextCard = useCallback(() => {
    if (!autoPilotRef.current) return;

    // 1. If deck is empty, reshuffle
    if (deckRef.current.length === 0) {
      deckRef.current = shuffleDeck();
    }

    // 2. Draw Card
    const nextId = deckRef.current.pop();
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const graphNodes = (initialData.nodes as any[]);
    const node = graphNodes.find(n => n.id === nextId);

    if (node) transitionToNode(node);
  }, []);

  useEffect(() => {
    // Initial Delay for Intro Reading
    const firstTimer = setTimeout(() => {
       playNextCard();
    }, 5000);

    // Game Loop
    const interval = setInterval(() => {
       playNextCard();
    }, 10000); 

    return () => {
        clearTimeout(firstTimer);
        clearInterval(interval);
    };
  }, [playNextCard]);

  const handleInteraction = useCallback((node: any) => {
    autoPilotRef.current = false;
    transitionToNode(node);
    
    // Restart logic
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
      autoPilotRef.current = true;
    }, 15000);
  }, []);

  return (
    <div className="fixed inset-0 bg-[#050505] overflow-hidden">
      
      {/* HEADER */}
      <div className={`absolute top-0 left-0 p-8 md:p-12 z-50 pointer-events-auto transition-all duration-1000 transform ${!isIntro ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
        <div className="flex flex-col items-start">
          <span className="font-mono text-[#0070F3] text-xs mb-2 tracking-[0.3em] uppercase">Strategic Technology Executive</span>
          <h1 className="text-3xl font-sans font-bold text-white mb-4 leading-none">JONATHAN<br/>W. MARINO</h1>
          <button onClick={() => document.getElementById('content-start')?.scrollIntoView({behavior:'smooth'})} className="flex items-center gap-2 text-xs font-mono text-gray-400 hover:text-white transition-colors border-b border-transparent hover:border-white pb-1">
             <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"/>
             INITIATE SEQUENCE &darr;
          </button>
        </div>
      </div>

      {/* LEFT CARD */}
      <div className="absolute left-0 bottom-0 h-[70%] w-full md:w-[650px] flex items-end p-8 md:p-12 z-20 pointer-events-none">
        <div className={`pointer-events-auto w-full transition-all duration-700 transform ${isTransitioning ? 'opacity-0 translate-y-10' : 'opacity-100 translate-y-0'}`}>
           {activeNode && (
             <div className="bg-black/60 backdrop-blur-2xl border border-white/10 p-8 md:p-10 shadow-2xl relative overflow-hidden rounded-tr-2xl">
                <div className="absolute top-0 left-0 w-1 h-full transition-colors duration-500" style={{ backgroundColor: activeNode?.color || '#fff' }} />
                
                <div className="flex items-center justify-between mb-6">
                  <span className="font-mono text-xs tracking-[0.2em] uppercase text-gray-500">{activeNode.id === "JONATHAN" ? "SYSTEM IDENTITY" : "ACTIVE NODE"}</span>
                  {activeNode.id !== "JONATHAN" && (
                    <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                        <span className="text-[9px] font-mono text-white uppercase tracking-wider">Live</span>
                    </div>
                  )}
                </div>

                <h3 className="font-mono text-[#0070F3] text-xs mb-2 uppercase tracking-widest" style={{ color: activeNode?.color }}>{activeNode?.role}</h3>
                <h2 className="text-4xl md:text-5xl font-sans font-bold text-white mb-6 leading-tight">{activeNode?.title || activeNode?.id}</h2>
                
                {activeNode.metrics && (
                    <div className="grid grid-cols-3 gap-3 mb-6">
                        {activeNode.metrics.map((m: string) => (
                            <div key={m} className="bg-white/5 border border-white/10 p-2 rounded text-center">
                                <span className="text-[10px] font-mono text-gray-300">{m}</span>
                            </div>
                        ))}
                    </div>
                )}

                <p className="text-md text-gray-300 font-sans leading-relaxed">{activeNode?.desc}</p>

                {activeNode.id === "JONATHAN" && (
                    <div className="mt-8 pt-6 border-t border-gray-800">
                        <button onClick={() => document.getElementById('content-start')?.scrollIntoView({behavior:'smooth'})} className="w-full border border-white/20 bg-white/5 px-6 py-4 text-xs font-mono text-white hover:bg-white hover:text-black transition-all">INITIATE SEQUENCE &darr;</button>
                    </div>
                )}
             </div>
           )}
        </div>
      </div>

      {/* RIGHT BRAIN */}
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
        d3VelocityDecay={0.6}
        
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
          
          if (isCore) return; 

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

          if ((!isTarget || node.group <= 2) && !isCore) {
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