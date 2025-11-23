"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import ForceGraph2D, { ForceGraphMethods } from "react-force-graph-2d";
import gsap from "gsap";

// --- 1. CONTEXTUAL DATA (For Hero Card) ---
// Specific "Why this matters now" signals linked to nodes
const CONTEXTUAL_SIGNALS = {
  "Strategy": [
    "DETECTING MARKET SHIFT: EU AI Act enforcement phase initiating...",
    "ANALYSIS: Enterprise risk migrating from Cloud Sec to Model Governance.",
    "SIGNAL: Data sovereignty fragmentation in APAC region."
  ],
  "Engineering": [
    "BENCHMARK ALERT: DeepSeek-V3 vs Gemini inference delta widening.",
    "DEPLOYMENT PATTERN: Next.js 15 PPR moving to production standard.",
    "ARCHITECTURAL SHIFT: Agentic Workflows replacing RAG pipelines."
  ],
  "Creative": [
    "VISUAL TREND: WebGPU adoption +40% in e-commerce sectors.",
    "UX SIGNAL: Glassmorphism & Bento Grids dominating SaaS interfaces.",
    "METRIC: 3D Storytelling correlates with -40% bounce rate."
  ],
  "Global Ops": [
    "MARKET WATCH: Vendor consolidation accelerating in EMEA.",
    "OPS SIGNAL: AI-driven SOP generation reducing ramp time."
  ],
  "Gemini API": [
    "MODEL UPDATE: Gemini 1.5 Pro context window expansion.",
    "USE CASE: Multimodal latency dropping below 200ms."
  ],
  "JONATHAN": [
    "SYSTEM STATUS: ONLINE.", 
    "PROTOCOL: EXECUTIVE BRIEFING MODE.", 
    "WAITING FOR INPUT..."
  ]
};

// --- 2. GLOBAL NEWS DATA (For Bottom-Right Feed) ---
// General background noise to make the system feel alive
const GLOBAL_NEWS = [
  "r/LocalLLaMA: 70B model quantization breakthroughs...",
  "TechCrunch: Sovereign AI clouds seeing 200% spend increase...",
  "HuggingFace: New multimodal embeddings top leaderboard...",
  "Bloomberg: Supply chain digitization entering Phase 2...",
  "Wired: The death of prompt engineering and rise of context architecture...",
  "GitHub: Auto-GPT-Pro repository trending #1...",
  "Vercel: Server Actions now default for data mutations..."
];

// --- 3. RESUME DATA ---
const initialData = {
  nodes: [
    // CORE
    { 
      id: "JONATHAN", group: 1, val: 120, color: "#FFFFFF",
      title: "JONATHAN W. MARINO", 
      role: "STRATEGIC TECHNOLOGY EXECUTIVE",
      desc: "A hybrid executive architecting the intersection of Geopolitics, Data, and Design. Weaponizing technical curiosity to solve systemic organizational challenges.",
      bullets: ["15+ Years Experience", "Boardroom to Backend Bridge", "1.4M Citizens Mapped"],
      metrics: ["Global Scale", "Polymathic", "Impact-Driven"]
    },
    // STRATEGIC
    { 
      id: "Strategy", group: 2, val: 60, color: "#0070F3", 
      title: "STRATEGIC RISK & POLICY", role: "Geopolitical Architect", 
      desc: "Mitigating enterprise risk by translating abstract policy mandates into rigorous code enforcement. Specializing in data sovereignty and compliance.",
      bullets: ["Orchestrated 'Beyond the Map' (1.4M Citizens)", "Navigated multi-stakeholder diplomacy", "Established privacy frameworks"],
      metrics: ["1.4M Citizens", "Privacy Compliance", "Cross-Border"]
    },
    // ENGINEERING
    { 
      id: "Engineering", group: 2, val: 60, color: "#00FF94", 
      title: "ENGINEERING VELOCITY", role: "Full-Stack & GenAI Lead", 
      desc: "Deploying AI agents to automate workflows and reclaim executive hours. Building internal tools that turn operational bottlenecks into efficiencies.",
      bullets: ["Built 'SlideSense' (GenAI Automation)", "Developed 'Stevie' (Audio AI)", "Architected global keyword tools"],
      metrics: ["$300k+ Savings", "Automated Ops", "Gemini API"]
    },
    // CREATIVE
    { 
      id: "Creative", group: 2, val: 60, color: "#FF0055", 
      title: "CREATIVE INTELLIGENCE", role: "High-Fidelity Motion", 
      desc: "Translating abstract strategy into visceral 3D narratives that win stakeholder buy-in. Leveraging motion psychology to drive adoption.",
      bullets: ["Directed 'Monk-e-Mail' (50M+ Visitors)", "Led 3D Design for E-Trade Baby", "Pioneered '3D Swirl' formats"],
      metrics: ["50M+ Engagement", "Super Bowl Ads", "Interactive Story"]
    },
    // ORBIT
    { id: "Global Ops", group: 3, val: 20, color: "#0070F3", title: "GLOBAL OPERATIONS", role: "Scale", desc: "Standardizing vendor ops across APAC/EMEA." },
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
const STAGE_X = 250; 
const STAGE_Y = 0;

export default function TechConstellation() {
  const fgRef = useRef<ForceGraphMethods | undefined>(undefined);
  const [dimensions, setDimensions] = useState({ w: 1000, h: 800 });
  const [activeNode, setActiveNode] = useState<any>(initialData.nodes[0]); 
  const [isTransitioning, setIsTransitioning] = useState(false); 
  const [contextualSignal, setContextualSignal] = useState("");
  const [globalTicker, setGlobalTicker] = useState(GLOBAL_NEWS[0]);
  
  const indexRef = useRef(0);
  const autoPilotRef = useRef(true);
  const currentNodeRef = useRef<any>(null);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
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
  }, [isClient]);

  // --- 1. CONTEXTUAL SIGNAL ENGINE (Hero Card) ---
  useEffect(() => {
    if (activeNode && !isTransitioning) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const signals = CONTEXTUAL_SIGNALS[activeNode.id as keyof typeof CONTEXTUAL_SIGNALS] || ["SCANNING FOR RELEVANCE...", "ACQUIRING TARGET..."];
      const randomSignal = signals[Math.floor(Math.random() * signals.length)];
      
      let i = 0;
      setContextualSignal("");
      const typeInterval = setInterval(() => {
        setContextualSignal(randomSignal.substring(0, i + 1));
        i++;
        if (i > randomSignal.length) clearInterval(typeInterval);
      }, 25);
      return () => clearInterval(typeInterval);
    }
  }, [activeNode, isTransitioning]);

  // --- 2. GLOBAL TICKER ENGINE (Bottom Right) ---
  useEffect(() => {
    const tickerInterval = setInterval(() => {
      const nextNews = GLOBAL_NEWS[Math.floor(Math.random() * GLOBAL_NEWS.length)];
      setGlobalTicker(nextNews);
    }, 5000); // Rotate every 5s
    return () => clearInterval(tickerInterval);
  }, []);

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
      setActiveNode(node);
      setIsTransitioning(false);
    }, 800); 
  };

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

  const handleInteraction = useCallback((nodeId: string) => {
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

  if (!isClient) return null;

  return (
    <div className="fixed inset-0 bg-[#050505] overflow-hidden">
      
      {/* --- LEFT CARD: HERO CONTEXT --- */}
      <div className="absolute left-0 top-0 h-full w-full md:w-[650px] flex items-center p-8 md:p-12 z-20 pointer-events-none">
        <div 
          className={`pointer-events-auto w-full transition-all duration-700 transform 
            ${isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}
        >
           <div className="bg-black/70 backdrop-blur-3xl border border-white/10 p-10 md:p-12 shadow-[0_0_100px_rgba(0,0,0,0.9)] relative overflow-hidden rounded-2xl">
              
              <div className="absolute top-0 left-0 w-2 h-full transition-colors duration-500" 
                   style={{ backgroundColor: activeNode?.color || '#fff' }} />
              
              {/* CONTEXTUAL SIGNAL HEADER */}
              <div className="mb-8 border-b border-white/10 pb-6 bg-white/5 -mx-10 -mt-10 p-10">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        <span className="text-[10px] font-mono text-white uppercase tracking-wider font-bold">Relevant Context</span>
                    </div>
                </div>
                <p className="text-sm font-mono text-[#00FF94] leading-relaxed min-h-[3rem]">
                  {contextualSignal}<span className="animate-pulse text-white">_</span>
                </p>
              </div>

              {/* IDENTITY */}
              <h3 className="font-mono text-[#0070F3] text-xs mb-3 uppercase tracking-widest font-bold" 
                  style={{ color: activeNode?.color }}>
                {activeNode?.role}
              </h3>
              <h1 className="text-5xl md:text-6xl font-sans font-bold text-white mb-8 leading-[0.9] tracking-tight">
                {activeNode?.title || activeNode?.id}
              </h1>

              {/* DESCRIPTION */}
              <p className="text-lg text-gray-300 font-sans leading-relaxed mb-8 max-w-xl border-l-4 border-white/10 pl-6">
                {activeNode?.desc}
              </p>

              {/* BULLETS */}
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

              {/* METRICS */}
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

      {/* --- BOTTOM RIGHT: GLOBAL INTELLIGENCE FEED --- */}
      <div className="absolute bottom-8 right-8 z-30 w-[350px] pointer-events-none">
        <div className="bg-black/80 backdrop-blur-md border border-white/20 p-6 rounded-lg shadow-2xl pointer-events-auto">
            <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-2">
                <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                    <span className="text-[9px] font-mono text-blue-400 uppercase tracking-wider font-bold">Global Data Stream</span>
                </div>
                <span className="text-[9px] font-mono text-gray-500">LIVE</span>
            </div>
            <p className="text-xs font-mono text-gray-300 leading-relaxed animate-pulse">
                {globalTicker}
            </p>
        </div>
      </div>

      {/* RIGHT BRAIN CANVAS */}
      <ForceGraph2D
        ref={fgRef}
        width={dimensions.w}
        height={dimensions.h}
        graphData={initialData}
        backgroundColor="#050505"
        
        onNodeClick={(node) => handleInteraction(node.id as string)}
        onNodeDrag={() => { if (activeNode) handleInteraction(activeNode.id as string); }} 
        onBackgroundClick={() => { if (activeNode) handleInteraction(activeNode.id as string); }}
        
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