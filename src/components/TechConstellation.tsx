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

// --- 2. DEEP RESUME DATA (20 NODES) ---
const initialData = {
  nodes: [
    // CORE
    { id: "JONATHAN", group: 1, val: 120, color: "#FFFFFF", title: "JONATHAN W. MARINO", role: "STRATEGIC TECH EXEC", desc: "Architecting the intersection of Geopolitics, Data, and Design.", bullets: ["15+ Years Exp", "Boardroom to Backend", "1.4M Citizens Mapped"], metrics: ["Global Scale", "Polymathic", "Impact-Driven"] },
    
    // STRATEGIC PILLAR
    { id: "Strategy", group: 2, val: 60, color: "#0070F3", title: "STRATEGIC RISK", role: "Geopolitical Architect", desc: "Mitigating enterprise risk by translating abstract policy mandates into rigorous code enforcement.", bullets: ["Orchestrated 'Beyond the Map'", "Navigated multi-stakeholder diplomacy", "Established privacy frameworks"], metrics: ["1.4M Citizens", "Privacy Compliance", "Cross-Border"] },
    { id: "Geopolitics", group: 3, val: 30, color: "#0070F3", title: "GEOPOLITICS", role: "Digital Sovereignty", desc: "Mapping unmapped territories (Rio Favelas) to establish civic identity.", bullets: ["Partnered with AfroReggae NGO", "Mapped 1.4M Citizens", "Data Sovereignty Policy"], metrics: ["Civic Identity", "NGO Alliance", "Crisis Mapping"] },
    { id: "Governance", group: 3, val: 30, color: "#0070F3", title: "GOVERNANCE", role: "Policy as Code", desc: "Automated compliance for global data standards via algorithmic guardrails.", bullets: ["GDPR/CCPA Automation", "Trust & Safety Architect", "Risk Radar Dashboard"], metrics: ["Zero Violations", "Automated Audit", "Policy <-> Code"] },

    // ENGINEERING PILLAR
    { id: "Engineering", group: 2, val: 60, color: "#00FF94", title: "ENGINEERING VELOCITY", role: "Full-Stack & GenAI Lead", desc: "Deploying AI agents to automate workflows and reclaim executive hours.", bullets: ["Built 'SlideSense' AI", "Developed 'Stevie' Audio Engine", "Global keyword tools"], metrics: ["$300k+ Savings", "Automated Ops", "Gemini API"] },
    { id: "GenAI", group: 3, val: 40, color: "#00FF94", title: "GENERATIVE AI", role: "LLM Integration", desc: "Building enterprise tools on Gemini API to solve internal friction.", bullets: ["RAG Pipeline Architecture", "Multimodal Reasoning", "Agentic Workflows"], metrics: ["Efficiency +400%", "Latency <200ms", "Context Aware"] },
    { id: "Audio AI", group: 3, val: 30, color: "#00FF94", title: "AUDIO SYNTHESIS", role: "Neural Speech", desc: "Pioneering text-to-speech accessibility tools for inclusive workspaces.", bullets: ["'Stevie' Audio Engine", "Neural TTS Pipelines", "WCAG 2.1 AA Compliance"], metrics: ["Inclusive Design", "Real-time Audio", "Accessibility"] },
    { id: "Cloud", group: 3, val: 30, color: "#00FF94", title: "CLOUD INFRA", role: "GCP & Edge", desc: "Scalable architecture for global tool deployment.", bullets: ["Serverless Edge Functions", "Global CDN Strategy", "FinOps Optimization"], metrics: ["99.99% Uptime", "Edge Latency", "Auto-Scale"] },
    { id: "Next.js", group: 3, val: 30, color: "#00FF94", title: "NEXT.JS 15", role: "Modern Web", desc: "Server Components and PPR for high-performance UI.", bullets: ["React Server Components", "Partial Prerendering", "Streaming Suspense"], metrics: ["Core Web Vitals", "SEO/GEO Optimized", "Zero-Bundle"] },

    // CREATIVE PILLAR
    { id: "Creative", group: 2, val: 60, color: "#FF0055", title: "CREATIVE INTELLIGENCE", role: "High-Fidelity Motion", desc: "Translating abstract strategy into visceral 3D narratives.", bullets: ["Directed 'Monk-e-Mail'", "E-Trade Baby Design", "3D Swirl formats"], metrics: ["50M+ Engagement", "Super Bowl Ads", "Interactive Story"] },
    { id: "Motion", group: 3, val: 30, color: "#FF0055", title: "MOTION DESIGN", role: "3D & Animation", desc: "Leveraging motion psychology to drive adoption of new technologies.", bullets: ["After Effects / Cinema 4D", "Character Animation", "Physics Simulation"], metrics: ["Oscar-Level VFX", "Viral Mechanics", "User Delight"] },
    { id: "WebGL", group: 3, val: 30, color: "#FF0055", title: "WEBGL", role: "Immersive Web", desc: "Browser-based 3D rendering for high-impact product demos.", bullets: ["Three.js / R3F", "GLSL Shaders", "Performance Optimization"], metrics: ["60FPS Mobile", "GPU Accelerated", "No Plugins"] },
    { id: "Storytelling", group: 3, val: 30, color: "#FF0055", title: "STORYTELLING", role: "Narrative Strategy", desc: "Aligning stakeholders through visual persuasion and data visualization.", bullets: ["Executive Keynotes", "Vision Decks", "Complex Data Viz"], metrics: ["Board Alignment", "Sales Velocity", "Brand Equity"] },

    // OPS ORBIT
    { id: "Global Ops", group: 4, val: 30, color: "#0070F3", title: "GLOBAL OPS", role: "Scale & Efficiency", desc: "Standardizing vendor ops across APAC/EMEA.", bullets: ["Vendor Consolidation", "SOP Standardization", "24/7 Workflow"], metrics: ["Cost Reduction", "Quality Control", "Global Reach"] },
    { id: "GSAP", group: 4, val: 20, color: "#FF0055", title: "GSAP ANIMATION", role: "Motion Dev", desc: "Complex timeline orchestration for web UI.", bullets: ["ScrollTrigger", "Flip Layouts", "Canvas Integration"], metrics: ["Award Winning", "Smooth UX", "Interaction"] },
  ],
  links: [
    // Core
    { source: "JONATHAN", target: "Strategy" }, { source: "JONATHAN", target: "Engineering" }, { source: "JONATHAN", target: "Creative" },
    // Strategy Cluster
    { source: "Strategy", target: "Geopolitics" }, { source: "Strategy", target: "Governance" }, { source: "Geopolitics", target: "Global Ops" },
    // Engineering Cluster
    { source: "Engineering", target: "GenAI" }, { source: "Engineering", target: "Cloud" }, { source: "Engineering", target: "Next.js" },
    { source: "GenAI", target: "Audio AI" }, { source: "GenAI", target: "Governance" },
    // Creative Cluster
    { source: "Creative", target: "Motion" }, { source: "Creative", target: "WebGL" }, { source: "Creative", target: "Storytelling" },
    { source: "Motion", target: "GSAP" },
    // Cross
    { source: "Gemini API", target: "Audio AI" }, { source: "Global Ops", target: "Strategy" }
  ]
};

// ALL VISITABLE NODES (The Deck)
const ALL_STEPS = [
  "Strategy", "Engineering", "Creative", 
  "Geopolitics", "Governance", "GenAI", "Audio AI", 
  "Cloud", "Next.js", "Motion", "WebGL", "Storytelling", "Global Ops"
];

const STAGE_X = 400; // Push to right side
const STAGE_Y = 0;

export default function TechConstellation() {
  const fgRef = useRef<ForceGraphMethods | undefined>(undefined);
  const [dimensions, setDimensions] = useState({ w: 1000, h: 800 });
  
  const [activeNode, setActiveNode] = useState<any>(initialData.nodes[0]); 
  const [isTransitioning, setIsTransitioning] = useState(false); 
  const [currentTrend, setCurrentTrend] = useState("");
  
  // Logic Refs
  const deckRef = useRef<string[]>([]); // The "Deck" of unvisited nodes
  const autoPilotRef = useRef(true);
  const currentNodeRef = useRef<any>(null);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);

  // --- SHUFFLE LOGIC ---
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
        graph.d3Force('charge')?.strength(-200); 
        graph.d3Force('link')?.distance(80);
        graph.d3Force('center')?.x(STAGE_X); 
        graph.d3Force('center')?.y(STAGE_Y);
        graph.centerAt(STAGE_X, STAGE_Y, 0);
        graph.zoom(3.5, 0);
        
        // Init Deck
        deckRef.current = shuffleDeck();
    }
  }, []);

  // --- INTELLIGENCE ENGINE ---
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
      setActiveNode(node);
      setIsTransitioning(false);
    }, 800); 
  };

  // --- SMART AUTO-PILOT ---
  const playNextCard = useCallback(() => {
    if (!autoPilotRef.current) return;

    // 1. Reshuffle if empty
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
    const interval = setInterval(() => {
       playNextCard();
    }, 10000); // 10 Seconds per node

    return () => clearInterval(interval);
  }, [playNextCard]);

  // --- INTERACTION ---
  const triggerInteraction = useCallback((nodeId: string) => {
    autoPilotRef.current = false;
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const graphNodes = (initialData.nodes as any[]); 
    const node = graphNodes.find(n => n.id === nodeId);
    
    if (node) transitionToNode(node);

    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
      autoPilotRef.current = true;
    }, 15000); 
  }, []);

  return (
    <div className="fixed inset-0 bg-[#050505] overflow-hidden">
      
      {/* LEFT CARD - EXPANDED */}
      <div className="absolute left-0 top-0 h-full w-full md:w-[800px] flex items-center p-8 md:p-12 z-20 pointer-events-none">
        <div 
          className={`pointer-events-auto w-full transition-all duration-700 transform 
            ${isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}
        >
           <div className="bg-black/70 backdrop-blur-3xl border border-white/10 p-10 md:p-14 shadow-[0_0_120px_rgba(0,0,0,0.9)] relative overflow-hidden rounded-2xl">
              
              <div className="absolute top-0 left-0 w-2 h-full transition-colors duration-500" 
                   style={{ backgroundColor: activeNode?.color || '#fff' }} />
              
              {/* HEADER */}
              <div className="mb-8 border-b border-white/10 pb-6 bg-white/5 -mx-14 -mt-14 p-14">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        <span className="text-[10px] font-mono text-white uppercase tracking-wider font-bold">Live Intelligence Stream</span>
                    </div>
                </div>
                <p className="text-sm font-mono text-[#00FF94] leading-relaxed">
                  {currentTrend}<span className="animate-pulse text-white">_</span>
                </p>
              </div>

              {/* IDENTITY */}
              <h3 className="font-mono text-[#0070F3] text-xs mb-3 uppercase tracking-widest font-bold" 
                  style={{ color: activeNode?.color }}>
                {activeNode?.role}
              </h3>
              <h1 className="text-5xl md:text-7xl font-sans font-bold text-white mb-8 leading-[0.9] tracking-tight">
                {activeNode?.title || activeNode?.id}
              </h1>

              {/* DESCRIPTION */}
              <p className="text-xl text-gray-300 font-sans leading-relaxed mb-8 max-w-3xl border-l-4 border-white/10 pl-6">
                {activeNode?.desc}
              </p>

              {/* BULLETS */}
              {activeNode?.bullets && (
                <div className="grid gap-4 mb-10">
                  {activeNode.bullets.map((b: string, i: number) => (
                    <div key={i} className="flex items-start gap-3 text-gray-300">
                      <span className="text-[#0070F3] mt-1.5 text-xs">●</span>
                      <span className="font-sans text-md leading-relaxed">{b}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* METRICS */}
              {activeNode?.metrics && (
                <div className="grid grid-cols-3 gap-4 mb-8 pt-8 border-t border-white/10">
                  {activeNode.metrics.map((m: string) => (
                    <div key={m} className="text-center p-2 bg-white/5 rounded">
                      <span className="block text-[10px] font-mono text-gray-500 mb-1 uppercase tracking-wider">Impact Metric</span>
                      <span className="block text-sm font-bold text-white">{m}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* CTA */}
              <div className="mt-4 pt-6 border-t border-gray-800">
                  <button 
                    onClick={() => document.getElementById('content-start')?.scrollIntoView({behavior:'smooth'})}
                    className="w-full border border-white/20 bg-white/5 px-6 py-5 text-sm font-mono text-white hover:bg-white hover:text-black transition-all uppercase tracking-widest"
                  >
                    INITIATE RESEARCH &darr;
                  </button>
              </div>
           </div>
        </div>
      </div>

      {/* RIGHT BRAIN */}
      <ForceGraph2D
        ref={fgRef}
        width={dimensions.w}
        height={dimensions.h}
        graphData={initialData}
        backgroundColor="#050505"
        
        // FIX: Cast ID to string
        onNodeClick={(node) => triggerInteraction(node.id as string)}
        onNodeDrag={() => { if (activeNode) triggerInteraction(activeNode.id as string); }} 
        onBackgroundClick={() => { if (activeNode) triggerInteraction(activeNode.id as string); }}
        
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