"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import ForceGraph2D, { ForceGraphMethods } from "react-force-graph-2d";
import gsap from "gsap";

// --- 1. CONFIGURATION ---
// No offsets. We rely on Canvas Dimensions now.
const DESKTOP_OFFSET_X = 250; 

const LIVE_TRENDS = {
  "Strategy": ["DETECTING: EU AI Act enforcement...", "ANALYSIS: Risk migration > Model Gov.", "SIGNAL: Data sovereignty frag."],
  "Engineering": ["BENCHMARK: DeepSeek-V3 vs Gemini.", "DEPLOY: Next.js 15 PPR.", "PATTERN: Agentic Workflows."],
  "Creative": ["TREND: WebGPU adoption +40%.", "UX: Glassmorphism & Bento Grids.", "METRIC: 3D Storytelling -40% bounce."],
  "Global Ops": ["LIVE: Vendor consolidation EMEA.", "OPS: AI-driven SOP generation."],
  "Gemini API": ["UPDATE: Context window expansion.", "USE CASE: Multimodal latency < 200ms."],
  "JONATHAN": ["SYSTEM: CONNECTED.", "STATUS: READY.", "MODE: EXECUTIVE OVERVIEW."]
};

// --- 2. MASTER DATA ---
const MASTER_DATA = {
  nodes: [
    { id: "JONATHAN", group: 1, val: 120, color: "#FFFFFF", title: "JONATHAN W. MARINO", role: "STRATEGIC TECH EXEC", desc: "Architecting the intersection of Geopolitics, Data, and Design.", bullets: ["15+ Years Experience", "Boardroom to Backend Bridge", "1.4M Citizens Mapped"], metrics: ["Global Scale", "Polymathic", "Impact-Driven"] },
    { id: "Strategy", group: 2, val: 60, color: "#0070F3", title: "STRATEGIC RISK", role: "Geopolitical Architect", desc: "Mitigating enterprise risk by translating abstract policy mandates into rigorous code enforcement.", bullets: ["Orchestrated 'Beyond the Map'", "Navigated diplomacy", "Established privacy frameworks"], metrics: ["1.4M Citizens", "Privacy Compliance", "Cross-Border"] },
    { id: "Geopolitics", group: 3, val: 30, color: "#0070F3", title: "GEOPOLITICS", role: "Digital Sovereignty", desc: "Mapping unmapped territories (Rio Favelas) to establish civic identity.", bullets: ["Partnered with AfroReggae NGO", "Mapped 1.4M Citizens", "Data Sovereignty Policy"], metrics: ["Civic Identity", "NGO Alliance", "Crisis Mapping"] },
    { id: "Governance", group: 3, val: 30, color: "#0070F3", title: "GOVERNANCE", role: "Policy as Code", desc: "Automated compliance for global data standards via algorithmic guardrails.", bullets: ["GDPR/CCPA Automation", "Trust & Safety Architect", "Risk Radar Dashboard"], metrics: ["Zero Violations", "Automated Audit", "Policy <-> Code"] },
    { id: "Engineering", group: 2, val: 60, color: "#00FF94", title: "ENGINEERING VELOCITY", role: "Full-Stack & GenAI Lead", desc: "Deploying AI agents to automate workflows and reclaim executive hours.", bullets: ["Built 'SlideSense' AI", "Developed 'Stevie' Audio Engine", "Global keyword tools"], metrics: ["$300k+ Savings", "Automated Ops", "Gemini API"] },
    { id: "GenAI", group: 3, val: 40, color: "#00FF94", title: "GENERATIVE AI", role: "LLM Integration", desc: "Building enterprise tools on Gemini API to solve internal friction.", bullets: ["RAG Pipeline Architecture", "Multimodal Reasoning", "Agentic Workflows"], metrics: ["Efficiency +400%", "Latency <200ms", "Context Aware"] },
    { id: "Audio AI", group: 3, val: 30, color: "#00FF94", title: "AUDIO SYNTHESIS", role: "Neural Speech", desc: "Pioneering text-to-speech accessibility tools for inclusive workspaces.", bullets: ["'Stevie' Audio Engine", "Neural TTS Pipelines", "WCAG 2.1 AA Compliance"], metrics: ["Inclusive Design", "Real-time Audio", "Accessibility"] },
    { id: "Cloud", group: 3, val: 30, color: "#00FF94", title: "CLOUD INFRA", role: "GCP & Edge", desc: "Scalable architecture for global tool deployment.", bullets: ["Serverless Edge Functions", "Global CDN Strategy", "FinOps Optimization"], metrics: ["99.99% Uptime", "Edge Latency", "Auto-Scale"] },
    { id: "Next.js", group: 3, val: 30, color: "#00FF94", title: "NEXT.JS 15", role: "Modern Web", desc: "Server Components and PPR for high-performance UI.", bullets: ["React Server Components", "Partial Prerendering", "Streaming Suspense"], metrics: ["Core Web Vitals", "SEO/GEO Optimized", "Zero-Bundle"] },
    { id: "Analytics", group: 3, val: 30, color: "#00FF94", title: "DATA ANALYTICS", role: "GA4 & SQL", desc: "Custom widgets (CARTA) for document tracking.", bullets: ["Custom GA4 Implementations", "SQL Data Warehousing", "Looker Studio Dashboards"], metrics: ["Real-time Data", "Custom KPIs", "Full Visibility"] },
    { id: "Creative", group: 2, val: 60, color: "#FF0055", title: "CREATIVE INTELLIGENCE", role: "High-Fidelity Motion", desc: "Translating abstract strategy into visceral 3D narratives.", bullets: ["Directed 'Monk-e-Mail'", "E-Trade Baby Design", "3D Swirl formats"], metrics: ["50M+ Engagement", "Super Bowl Ads", "Interactive Story"] },
    { id: "Motion", group: 3, val: 30, color: "#FF0055", title: "MOTION DESIGN", role: "3D & Animation", desc: "Leveraging motion psychology to drive adoption of new technologies.", bullets: ["After Effects / Cinema 4D", "Character Animation", "Physics Simulation"], metrics: ["Oscar-Level VFX", "Viral Mechanics", "User Delight"] },
    { id: "WebGL", group: 3, val: 30, color: "#FF0055", title: "WEBGL", role: "Immersive Web", desc: "Browser-based 3D rendering for high-impact product demos.", bullets: ["Three.js / R3F", "GLSL Shaders", "Performance Optimization"], metrics: ["60FPS Mobile", "GPU Accelerated", "No Plugins"] },
    { id: "Storytelling", group: 3, val: 30, color: "#FF0055", title: "STORYTELLING", role: "Narrative Strategy", desc: "Aligning stakeholders through visual persuasion and data visualization.", bullets: ["Executive Keynotes", "Vision Decks", "Complex Data Viz"], metrics: ["Board Alignment", "Sales Velocity", "Brand Equity"] },
    { id: "AR / VR", group: 3, val: 30, color: "#FF0055", title: "XR COMPUTING", role: "Spatial", desc: "YouTube 'Try-On' modules for e-commerce.", bullets: ["ARCore Implementation", "WebXR Standards", "Virtual Try-On"], metrics: ["Conversion Lift", "Immersive UX", "Future Tech"] },
    { id: "Global Ops", group: 4, val: 30, color: "#0070F3", title: "GLOBAL OPS", role: "Scale & Efficiency", desc: "Standardizing vendor ops across APAC/EMEA.", bullets: ["Vendor Consolidation", "SOP Standardization", "24/7 Workflow"], metrics: ["Cost Reduction", "Quality Control", "Global Reach"] },
    { id: "GSAP", group: 4, val: 20, color: "#FF0055", title: "GSAP ANIMATION", role: "Motion Dev", desc: "Complex timeline orchestration for web UI.", bullets: ["ScrollTrigger", "Flip Layouts", "Canvas Integration"], metrics: ["Award Winning", "Smooth UX", "Interaction"] },
    { id: "Viral History", group: 4, val: 20, color: "#FFCC00", title: "VIRAL HISTORY", role: "Legacy", desc: "Architect of 'Monk-e-Mail' (50M+ users).", bullets: ["Flash Era Viral Hits", "Social Engineering", "Mass Scale"], metrics: ["50M+ Users", "Cultural Icon", "Early Web 2.0"] },
  ],
  links: [
    { source: "JONATHAN", target: "Strategy" }, { source: "JONATHAN", target: "Engineering" }, { source: "JONATHAN", target: "Creative" },
    { source: "Strategy", target: "Geopolitics" }, { source: "Strategy", target: "Governance" }, { source: "Strategy", target: "Global Ops" },
    { source: "Engineering", target: "GenAI" }, { source: "Engineering", target: "Cloud" }, { source: "Engineering", target: "Next.js" }, { source: "Engineering", target: "Analytics" },
    { source: "GenAI", target: "Audio AI" }, { source: "GenAI", target: "Governance" },
    { source: "Creative", target: "Motion" }, { source: "Creative", target: "WebGL" }, { source: "Creative", target: "Storytelling" }, { source: "Creative", target: "AR / VR" },
    { source: "Motion", target: "GSAP" }, { source: "Motion", target: "Viral History" },
    { source: "Gemini API", target: "Audio AI" }, { source: "Global Ops", target: "Strategy" }
  ]
};

const TOUR_STEPS = ["JONATHAN", "Strategy", "Engineering", "Creative", "Gemini API"];

export default function TechConstellation() {
  const fgRef = useRef<ForceGraphMethods | undefined>(undefined);
  const [dimensions, setDimensions] = useState({ w: 1000, h: 800 });
  
  const graphData = useMemo(() => JSON.parse(JSON.stringify(MASTER_DATA)), []);
  const [activeNode, setActiveNode] = useState<any>(graphData.nodes[0]); 
  const [isTransitioning, setIsTransitioning] = useState(false); 
  const [currentTrend, setCurrentTrend] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  
  const indexRef = useRef(0);
  const autoPilotRef = useRef(true);
  const currentNodeRef = useRef<any>(null);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [isClient, setIsClient] = useState(false);

  // --- RESPONSIVE DETECTOR ---
  useEffect(() => {
    setIsClient(true);
    if (typeof window !== "undefined") {
      const handleResize = () => {
        const mobile = window.innerWidth < 768;
        setIsMobile(mobile);
        setDimensions({ 
          w: window.innerWidth, 
          // CRITICAL FIX: On mobile, canvas is ONLY the top 45% of screen.
          // On Desktop, it is 100% of screen.
          h: mobile ? window.innerHeight * 0.45 : window.innerHeight 
        });
      };
      
      window.addEventListener("resize", handleResize);
      handleResize(); // Run once
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  // --- PHYSICS INIT ---
  useEffect(() => {
    if (fgRef.current) {
        const graph = fgRef.current;
        graph.d3Force('charge')?.strength(isMobile ? -60 : -150); 
        graph.d3Force('link')?.distance(isMobile ? 40 : 90);
        
        // --- CENTER OF UNIVERSE ---
        // On Mobile: (0,0) is center of top half.
        // On Desktop: (250, 0) shifts it right to uncover left card.
        const targetX = isMobile ? 0 : DESKTOP_OFFSET_X;
        
        graph.d3Force('center')?.x(targetX); 
        graph.d3Force('center')?.y(0);
        
        graph.zoom(isMobile ? 3.5 : 3.0, 0); // Tighter zoom on mobile
        graph.centerAt(targetX, 0, 1000);
    }
  }, [isClient, isMobile, dimensions]); // Re-run if dimensions change!

  // --- INTELLIGENCE ENGINE ---
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

  // --- ANIMATION SEQUENCE ---
  const transitionToNode = (node: any) => {
    if (!fgRef.current) return;

    setIsTransitioning(true);

    if (currentNodeRef.current && currentNodeRef.current !== node) {
      currentNodeRef.current.fx = undefined;
      currentNodeRef.current.fy = undefined;
    }
    currentNodeRef.current = node;

    // Lock Target
    node.fx = node.x;
    node.fy = node.y;
    
    // CRITICAL FIX: Always target Y=0.
    // The canvas height itself handles the visual offset now.
    const targetX = isMobile ? 0 : DESKTOP_OFFSET_X;

    gsap.to(node, {
      fx: targetX,
      fy: 0,
      duration: 2.0,
      ease: "power3.inOut",
      onUpdate: () => { fgRef.current?.d3ReheatSimulation(); }
    });

    setTimeout(() => {
      setActiveNode(node);
      setIsTransitioning(false);
    }, 800); 
  };

  // AUTO-PILOT
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
  }, [graphData, isMobile]); // Check isMobile

  const handleInteraction = useCallback((nodeId: string) => {
    autoPilotRef.current = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const graphNodes = (graphData.nodes as any[]); 
    const node = graphNodes.find(n => n.id === nodeId);
    if (node) transitionToNode(node);

    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
      autoPilotRef.current = true;
    }, 6000); 
  }, [graphData, isMobile]);

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
      
      {/* --- RESPONSIVE CARD --- */}
      {/* MOBILE: Positioned at Bottom (0), Height 55%.
         DESKTOP: Positioned Left, Full Height.
      */}
      <div className={`
        absolute z-20 pointer-events-none flex items-center 
        md:left-0 md:top-0 md:h-full md:w-[650px] md:p-12 md:items-center
        bottom-0 left-0 w-full h-[55%] items-end
      `}>
        <div 
          className={`pointer-events-auto w-full h-full md:h-auto transition-all duration-700 transform 
            ${isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}
        >
           <div className="h-full bg-black/85 backdrop-blur-3xl border-t md:border border-white/10 p-6 md:p-12 shadow-[0_0_100px_rgba(0,0,0,0.9)] relative overflow-hidden rounded-t-2xl md:rounded-2xl flex flex-col justify-start">
              
              <div className="absolute top-0 left-0 w-full h-1 md:w-2 md:h-full transition-colors duration-500" 
                   style={{ backgroundColor: activeNode?.color || '#fff' }} />
              
              {/* LIVE FEED */}
              <div className="mb-4 md:mb-8 border-b border-white/10 pb-4 md:pb-6 bg-white/5 -mx-6 -mt-6 md:-mx-12 md:-mt-12 p-6 md:p-12 shrink-0">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                        <span className="text-[9px] font-mono text-white uppercase tracking-wider font-bold">Network Signal</span>
                    </div>
                </div>
                <p className="text-xs md:text-sm font-mono text-[#00FF94] h-6 md:h-8 leading-relaxed overflow-hidden whitespace-nowrap md:whitespace-normal text-ellipsis">
                  {currentTrend}<span className="animate-pulse text-white">_</span>
                </p>
              </div>

              {/* MAIN CONTENT SCROLLER FOR MOBILE */}
              <div className="overflow-y-auto md:overflow-visible flex-1 pr-2">
                  <h3 className="font-mono text-[#0070F3] text-[10px] md:text-xs mb-2 uppercase tracking-widest font-bold" 
                      style={{ color: activeNode?.color }}>
                    {activeNode?.role}
                  </h3>
                  <h1 className="text-3xl md:text-6xl font-sans font-bold text-white mb-4 md:mb-8 leading-none tracking-tight">
                    {activeNode?.title || activeNode?.id}
                  </h1>

                  <p className="text-sm md:text-lg text-gray-300 font-sans leading-relaxed mb-6 md:mb-8 max-w-xl md:border-l-4 md:border-white/10 md:pl-6">
                    {activeNode?.desc}
                  </p>

                  {/* METRICS */}
                  {activeNode?.metrics && (
                    <div className="grid grid-cols-3 gap-2 md:gap-4 mb-6 md:mb-8 pt-4 md:pt-8 border-t border-white/10">
                      {activeNode.metrics.map((m: string) => (
                        <div key={m} className="text-center">
                          <span className="block text-[8px] md:text-xs font-mono text-gray-500 mb-1 uppercase tracking-wider">Metric</span>
                          <span className="block text-[10px] md:text-sm font-bold text-white">{m}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-2 md:mt-4 pt-4 md:pt-6 border-t border-gray-800 pb-12 md:pb-0">
                      <button 
                        onClick={handleDeepLink}
                        className="w-full border border-white/20 bg-white/5 px-4 py-3 md:px-6 md:py-4 text-[10px] md:text-xs font-mono text-white hover:bg-white hover:text-black transition-all uppercase tracking-widest flex justify-between items-center"
                      >
                        <span>{activeNode.id === "JONATHAN" ? "INITIATE SEQUENCE" : "ACCESS DATA"}</span>
                        <span>&darr;</span>
                      </button>
                  </div>
              </div>
           </div>
        </div>
      </div>

      {/* RIGHT BRAIN CANVAS 
         Mobile: Fixed to TOP of screen, Height 45%.
         Desktop: Full Screen.
      */}
      <div className="absolute top-0 left-0 w-full md:h-full z-10" style={{ height: dimensions.h }}>
        <ForceGraph2D
          ref={fgRef}
          width={dimensions.w}
          height={dimensions.h}
          graphData={graphData}
          backgroundColor="#050505"
          
          onNodeClick={(node) => handleInteraction(node.id as string)}
          onNodeDrag={() => { if (activeNode) handleInteraction(activeNode.id as string); }} 
          onBackgroundClick={() => { if (activeNode) handleInteraction(activeNode.id as string); }}
          
          cooldownTicks={100}
          d3AlphaDecay={0.05} 
          d3VelocityDecay={0.6}
          
          nodeRelSize={isMobile ? 7 : 9} 
          linkColor={() => "#ffffff15"}
          linkWidth={1.5}
          linkDirectionalParticles={2}
          linkDirectionalParticleSpeed={0.005}
          
          nodeCanvasObject={(node, ctx, globalScale) => {
            if (!Number.isFinite(node.x) || !Number.isFinite(node.y)) return;

            const isTarget = node.id === activeNode?.id;
            const color = (node.color as string) || "#fff";
            
            const pulse = Math.sin(Date.now() / 800) * 3; 
            const mobileScale = isMobile ? 0.7 : 1; 
            const baseRadius = 6 * mobileScale;
            const radius = (isTarget ? (baseRadius * 1.5) + pulse : baseRadius);

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
              const fontSize = (12 / globalScale) * mobileScale;
              ctx.font = `bold ${fontSize}px Sans-Serif`;
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillStyle = 'rgba(255,255,255,0.7)';
              ctx.fillText(label, node.x!, node.y! + radius + fontSize + 4);
            }
          }}
        />
      </div>
    </div>
  );
}