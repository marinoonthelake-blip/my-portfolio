"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import ForceGraph2D, { ForceGraphMethods } from "react-force-graph-2d";
import gsap from "gsap";

// --- 1. CONFIGURATION ---
const STAGE_X = 300; 
const STAGE_Y = 0;

const LIVE_TRENDS = {
  "Strategy": ["DETECTING: EU AI Act enforcement...", "ANALYSIS: Risk migration > Model Gov.", "SIGNAL: Data sovereignty frag."],
  "Engineering": ["BENCHMARK: DeepSeek-V3 vs Gemini.", "DEPLOY: Next.js 15 PPR.", "PATTERN: Agentic Workflows."],
  "Creative": ["TREND: WebGPU adoption +40%.", "UX: Glassmorphism & Bento Grids.", "METRIC: 3D Storytelling -40% bounce."],
  "GlobalOps": ["LIVE: Vendor consolidation EMEA.", "OPS: AI-driven SOP generation."],
  "GeminiAPI": ["UPDATE: Context window expansion.", "USE CASE: Multimodal latency < 200ms."],
  "JONATHAN": ["SYSTEM: CONNECTED.", "STATUS: READY.", "MODE: EXECUTIVE OVERVIEW."]
};

// --- 2. MASTER DATA (Sanitized IDs: No Spaces!) ---
const MASTER_DATA = {
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
    
    // STRATEGIC PILLAR
    { id: "Strategy", group: 2, val: 60, color: "#0070F3", title: "STRATEGIC RISK", role: "Geopolitical Architect", desc: "Mitigating enterprise risk by translating abstract policy mandates into rigorous code enforcement.", bullets: ["Orchestrated 'Beyond the Map'", "Navigated diplomacy", "Established privacy frameworks"], metrics: ["1.4M Citizens", "Privacy Compliance", "Cross-Border"] },
    { id: "Geopolitics", group: 3, val: 30, color: "#0070F3", title: "GEOPOLITICS", role: "Digital Sovereignty", desc: "Mapping unmapped territories (Rio Favelas) to establish civic identity.", bullets: ["Partnered with AfroReggae NGO", "Mapped 1.4M Citizens", "Data Sovereignty Policy"], metrics: ["Civic Identity", "NGO Alliance", "Crisis Mapping"] },
    { id: "Governance", group: 3, val: 30, color: "#0070F3", title: "GOVERNANCE", role: "Policy as Code", desc: "Automated compliance for global data standards via algorithmic guardrails.", bullets: ["GDPR/CCPA Automation", "Trust & Safety Architect", "Risk Radar Dashboard"], metrics: ["Zero Violations", "Automated Audit", "Policy <-> Code"] },

    // ENGINEERING PILLAR
    { id: "Engineering", group: 2, val: 60, color: "#00FF94", title: "ENGINEERING VELOCITY", role: "Full-Stack & GenAI Lead", desc: "Deploying AI agents to automate workflows and reclaim executive hours.", bullets: ["Built 'SlideSense' AI", "Developed 'Stevie' Audio Engine", "Global keyword tools"], metrics: ["$300k+ Savings", "Automated Ops", "Gemini API"] },
    { id: "GenAI", group: 3, val: 40, color: "#00FF94", title: "GENERATIVE AI", role: "LLM Integration", desc: "Building enterprise tools on Gemini API to solve internal friction.", bullets: ["RAG Pipeline Architecture", "Multimodal Reasoning", "Agentic Workflows"], metrics: ["Efficiency +400%", "Latency <200ms", "Context Aware"] },
    { id: "AudioAI", group: 3, val: 30, color: "#00FF94", title: "AUDIO SYNTHESIS", role: "Neural Speech", desc: "Pioneering text-to-speech accessibility tools for inclusive workspaces.", bullets: ["'Stevie' Audio Engine", "Neural TTS Pipelines", "WCAG 2.1 AA Compliance"], metrics: ["Inclusive Design", "Real-time Audio", "Accessibility"] },
    { id: "Cloud", group: 3, val: 30, color: "#00FF94", title: "CLOUD INFRA", role: "GCP & Edge", desc: "Scalable architecture for global tool deployment.", bullets: ["Serverless Edge Functions", "Global CDN Strategy", "FinOps Optimization"], metrics: ["99.99% Uptime", "Edge Latency", "Auto-Scale"] },
    { id: "NextJS", group: 3, val: 30, color: "#00FF94", title: "NEXT.JS 15", role: "Modern Web", desc: "Server Components and PPR for high-performance UI.", bullets: ["React Server Components", "Partial Prerendering", "Streaming Suspense"], metrics: ["Core Web Vitals", "SEO/GEO Optimized", "Zero-Bundle"] },
    { id: "Analytics", group: 3, val: 30, color: "#00FF94", title: "DATA ANALYTICS", role: "GA4 & SQL", desc: "Custom widgets (CARTA) for document tracking.", bullets: ["Custom GA4 Implementations", "SQL Data Warehousing", "Looker Studio Dashboards"], metrics: ["Real-time Data", "Custom KPIs", "Full Visibility"] },
    { id: "GeminiAPI", group: 3, val: 30, color: "#00FF94", title: "GEMINI API", role: "LLM Integration", desc: "Deep integration of Multimodal AI.", bullets: ["Context Caching", "Multimodal Inputs", "Vertex AI"], metrics: ["Enterprise Scale", "Security", "Performance"] },

    // CREATIVE PILLAR
    { id: "Creative", group: 2, val: 60, color: "#FF0055", title: "CREATIVE INTELLIGENCE", role: "High-Fidelity Motion", desc: "Translating abstract strategy into visceral 3D narratives.", bullets: ["Directed 'Monk-e-Mail'", "E-Trade Baby Design", "3D Swirl formats"], metrics: ["50M+ Engagement", "Super Bowl Ads", "Interactive Story"] },
    { id: "Motion", group: 3, val: 30, color: "#FF0055", title: "MOTION DESIGN", role: "3D & Animation", desc: "Leveraging motion psychology to drive adoption of new technologies.", bullets: ["After Effects / Cinema 4D", "Character Animation", "Physics Simulation"], metrics: ["Oscar-Level VFX", "Viral Mechanics", "User Delight"] },
    { id: "WebGL", group: 3, val: 30, color: "#FF0055", title: "WEBGL", role: "Immersive Web", desc: "Browser-based 3D rendering for high-impact product demos.", bullets: ["Three.js / R3F", "GLSL Shaders", "Performance Optimization"], metrics: ["60FPS Mobile", "GPU Accelerated", "No Plugins"] },
    { id: "Storytelling", group: 3, val: 30, color: "#FF0055", title: "STORYTELLING", role: "Narrative Strategy", desc: "Aligning stakeholders through visual persuasion and data visualization.", bullets: ["Executive Keynotes", "Vision Decks", "Complex Data Viz"], metrics: ["Board Alignment", "Sales Velocity", "Brand Equity"] },
    { id: "ARVR", group: 3, val: 30, color: "#FF0055", title: "XR COMPUTING", role: "Spatial", desc: "YouTube 'Try-On' modules for e-commerce.", bullets: ["ARCore Implementation", "WebXR Standards", "Virtual Try-On"], metrics: ["Conversion Lift", "Immersive UX", "Future Tech"] },

    // OPS ORBIT
    { id: "GlobalOps", group: 4, val: 30, color: "#0070F3", title: "GLOBAL OPS", role: "Scale & Efficiency", desc: "Standardizing vendor ops across APAC/EMEA.", bullets: ["Vendor Consolidation", "SOP Standardization", "24/7 Workflow"], metrics: ["Cost Reduction", "Quality Control", "Global Reach"] },
    { id: "GSAP", group: 4, val: 20, color: "#FF0055", title: "GSAP ANIMATION", role: "Motion Dev", desc: "Complex timeline orchestration for web UI.", bullets: ["ScrollTrigger", "Flip Layouts", "Canvas Integration"], metrics: ["Award Winning", "Smooth UX", "Interaction"] },
    { id: "ViralHistory", group: 4, val: 20, color: "#FFCC00", title: "VIRAL HISTORY", role: "Legacy", desc: "Architect of 'Monk-e-Mail' (50M+ users).", bullets: ["Flash Era Viral Hits", "Social Engineering", "Mass Scale"], metrics: ["50M+ Users", "Cultural Icon", "Early Web 2.0"] },
  ],
  links: [
    { source: "JONATHAN", target: "Strategy" }, { source: "JONATHAN", target: "Engineering" }, { source: "JONATHAN", target: "Creative" },
    { source: "Strategy", target: "Geopolitics" }, { source: "Strategy", target: "Governance" }, { source: "Strategy", target: "GlobalOps" },
    { source: "Engineering", target: "GenAI" }, { source: "Engineering", target: "Cloud" }, { source: "Engineering", target: "NextJS" }, { source: "Engineering", target: "Analytics" },
    { source: "GenAI", target: "AudioAI" }, { source: "GenAI", target: "Governance" }, { source: "GenAI", target: "GeminiAPI" },
    { source: "Creative", target: "Motion" }, { source: "Creative", target: "WebGL" }, { source: "Creative", target: "Storytelling" }, { source: "Creative", target: "ARVR" },
    { source: "Motion", target: "GSAP" }, { source: "Motion", target: "ViralHistory" },
    { source: "GeminiAPI", target: "AudioAI" }, { source: "GlobalOps", target: "Strategy" }
  ]
};

const TOUR_STEPS = ["JONATHAN", "Strategy", "Engineering", "Creative", "GeminiAPI"];

export default function TechConstellation() {
  const fgRef = useRef<ForceGraphMethods | undefined>(undefined);
  const [dimensions, setDimensions] = useState({ w: 1000, h: 800 });
  
  // CRITICAL FIX: useMemo creates a stable clone. 
  // The physics engine mutates this clone, leaving MASTER_DATA pure.
  const graphData = useMemo(() => JSON.parse(JSON.stringify(MASTER_DATA)), []);

  const [activeNode, setActiveNode] = useState<any>(graphData.nodes[0]); 
  const [isTransitioning, setIsTransitioning] = useState(false); 
  const [currentTrend, setCurrentTrend] = useState("");
  
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
        graph.d3Force('charge')?.strength(-250); 
        graph.d3Force('link')?.distance(100);
        graph.d3Force('center')?.x(STAGE_X); 
        graph.d3Force('center')?.y(STAGE_Y);
        graph.centerAt(STAGE_X, STAGE_Y, 0);
        graph.zoom(3.5, 0);
    }
  }, [isClient]);

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
      const graphNodes = (graphData.nodes as any[]);
      const node = graphNodes.find(n => n.id === TOUR_STEPS[nextIndex]);

      if (node) transitionToNode(node);
    }, 12000);

    return () => clearInterval(interval);
  }, [graphData]);

  const handleInteraction = useCallback((nodeId: string) => {
    autoPilotRef.current = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const graphNodes = (graphData.nodes as any[]); 
    const node = graphNodes.find(n => n.id === nodeId);
    if (node) transitionToNode(node);

    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
      autoPilotRef.current = true;
    }, 5000); 
  }, [graphData]);

  // Deep Linking
  const handleDeepLink = () => {
    const targetMap: Record<string, string> = {
        "SlideSense": "slide-sense",
        "Stevie": "stevie",
        "Beyond the Map": "beyond-the-map",
        "Global Ops": "exp-google",
        "Monk-e-Mail": "monk-e-mail"
    };
    const targetId = targetMap[activeNode.title] || targetMap[activeNode.id] || "content-start";
    const element = document.getElementById(targetId);
    if (element) element.scrollIntoView({ behavior: "smooth", block: "center" });
    else document.getElementById('content-start')?.scrollIntoView({ behavior: "smooth" });
  };

  if (!isClient) return null;

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
              <div className="mb-8 border-b border-white/10 pb-6 bg-white/5 -mx-10 -mt-10 p-10">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        <span className="text-[10px] font-mono text-white uppercase tracking-wider font-bold">Live Market Signal</span>
                    </div>
                </div>
                <p className="text-sm font-mono text-[#00FF94] h-8 leading-relaxed">
                  {currentTrend}<span className="animate-pulse text-white">_</span>
                </p>
              </div>

              <h3 className="font-mono text-[#0070F3] text-xs mb-3 uppercase tracking-widest font-bold" 
                  style={{ color: activeNode?.color }}>
                {activeNode?.role}
              </h3>
              <h1 className="text-5xl md:text-6xl font-sans font-bold text-white mb-8 leading-[0.9] tracking-tight">
                {activeNode?.title || activeNode?.id}
              </h1>

              <p className="text-lg text-gray-300 font-sans leading-relaxed mb-8 max-w-xl border-l-4 border-white/10 pl-6">
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
                    onClick={handleDeepLink}
                    className="w-full border border-white/20 bg-white/5 px-6 py-4 text-xs font-mono text-white hover:bg-white hover:text-black transition-all uppercase tracking-widest flex justify-between items-center"
                  >
                    <span>{activeNode.id === "JONATHAN" ? "INITIATE RESEARCH" : "INSPECT RELATED DATA"}</span>
                    <span>&darr;</span>
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
        graphData={graphData} // USING CLONED DATA
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