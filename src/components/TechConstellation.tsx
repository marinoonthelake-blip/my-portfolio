"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import ForceGraph2D, { ForceGraphMethods } from "react-force-graph-2d";
import gsap from "gsap";

// --- 1. CONFIGURATION ---
const STAGE_X = 250; 
const STAGE_Y = 0;

const LIVE_TRENDS = {
  "strategy": ["DETECTING: EU AI Act enforcement...", "ANALYSIS: Risk migration > Model Gov.", "SIGNAL: Data sovereignty frag."],
  "engineering": ["BENCHMARK: DeepSeek-V3 vs Gemini.", "DEPLOY: Next.js 15 PPR.", "PATTERN: Agentic Workflows."],
  "creative": ["TREND: WebGPU adoption +40%.", "UX: Glassmorphism & Bento Grids.", "METRIC: 3D Storytelling -40% bounce."],
  "global_ops": ["LIVE: Vendor consolidation EMEA.", "OPS: AI-driven SOP generation."],
  "gemini_api": ["UPDATE: Context window expansion.", "USE CASE: Multimodal latency < 200ms."],
  "jonathan": ["SYSTEM: CONNECTED.", "STATUS: READY.", "MODE: EXECUTIVE OVERVIEW."]
};

// --- 2. MASTER DATA (Sanitized System IDs) ---
const MASTER_DATA = {
  nodes: [
    // CORE
    { 
      id: "jonathan", group: 1, val: 120, color: "#FFFFFF",
      title: "JONATHAN W. MARINO", 
      role: "STRATEGIC TECHNOLOGY EXECUTIVE",
      desc: "A hybrid executive architecting the intersection of Geopolitics, Data, and Design. Weaponizing technical curiosity to solve systemic organizational challenges.",
      bullets: ["15+ Years Experience", "Boardroom to Backend Bridge", "1.4M Citizens Mapped"],
      metrics: ["Global Scale", "Polymathic", "Impact-Driven"]
    },
    
    // STRATEGIC PILLAR
    { id: "strategy", group: 2, val: 60, color: "#0070F3", title: "STRATEGIC RISK", role: "Geopolitical Architect", desc: "Mitigating enterprise risk by translating abstract policy mandates into rigorous code enforcement.", bullets: ["Orchestrated 'Beyond the Map'", "Navigated diplomacy", "Established privacy frameworks"], metrics: ["1.4M Citizens", "Privacy Compliance", "Cross-Border"] },
    { id: "geopolitics", group: 3, val: 30, color: "#0070F3", title: "GEOPOLITICS", role: "Digital Sovereignty", desc: "Mapping unmapped territories (Rio Favelas) to establish civic identity.", bullets: ["Partnered with AfroReggae NGO", "Mapped 1.4M Citizens", "Data Sovereignty Policy"], metrics: ["Civic Identity", "NGO Alliance", "Crisis Mapping"] },
    { id: "governance", group: 3, val: 30, color: "#0070F3", title: "GOVERNANCE", role: "Policy as Code", desc: "Automated compliance for global data standards via algorithmic guardrails.", bullets: ["GDPR/CCPA Automation", "Trust & Safety Architect", "Risk Radar Dashboard"], metrics: ["Zero Violations", "Automated Audit", "Policy <-> Code"] },

    // ENGINEERING PILLAR
    { id: "engineering", group: 2, val: 60, color: "#00FF94", title: "ENGINEERING VELOCITY", role: "Full-Stack & GenAI Lead", desc: "Deploying AI agents to automate workflows and reclaim executive hours.", bullets: ["Built 'SlideSense' AI", "Developed 'Stevie' Audio Engine", "Global keyword tools"], metrics: ["$300k+ Savings", "Automated Ops", "Gemini API"] },
    { id: "gen_ai", group: 3, val: 40, color: "#00FF94", title: "GENERATIVE AI", role: "LLM Integration", desc: "Leveraging Large Language Models to solve unstructured data problems.", bullets: ["RAG Pipelines", "Automated Review Systems", "Context-Aware Agents"], metrics: ["Efficiency +400%", "Latency <200ms", "Accuracy"] },
    { id: "audio_ai", group: 3, val: 30, color: "#00FF94", title: "AUDIO SYNTHESIS", role: "Neural Speech", desc: "Creating inclusive audio interfaces for internal tools.", bullets: ["'Stevie' Audio Engine", "Text-to-Speech Pipelines", "WCAG Compliance"], metrics: ["Inclusive Design", "Accessibility", "Innovation"] },
    { id: "next_js", group: 3, val: 30, color: "#00FF94", title: "MODERN STACK", role: "Architecture", desc: "High-performance web architecture using React Server Components.", bullets: ["Next.js 15", "Edge Computing", "Real-time Data"], metrics: ["Performance", "Scalability", "Maintainability"] },
    { id: "cloud", group: 3, val: 30, color: "#00FF94", title: "CLOUD INFRA", role: "GCP", desc: "Scalable global architecture.", bullets: ["Serverless Edge Functions", "Global CDN Strategy", "FinOps Optimization"], metrics: ["99.99% Uptime", "Edge Latency", "Auto-Scale"] },
    { id: "analytics", group: 3, val: 30, color: "#00FF94", title: "DATA ANALYTICS", role: "GA4 & SQL", desc: "Custom widgets (CARTA) for document tracking.", bullets: ["Custom GA4 Implementations", "SQL Data Warehousing", "Looker Studio Dashboards"], metrics: ["Real-time Data", "Custom KPIs", "Full Visibility"] },

    // CREATIVE PILLAR
    { id: "creative", group: 2, val: 60, color: "#FF0055", title: "CREATIVE TECHNOLOGY", role: "High-Fidelity UX", desc: "Translating complex technical concepts into intuitive, engaging user experiences.", bullets: ["Directed 'Monk-e-Mail' (50M+ Users)", "E-Trade Baby Campaign", "3D Swirl Ad Formats"], metrics: ["High Engagement", "User Retention", "Visual Storytelling"] },
    { id: "motion", group: 3, val: 30, color: "#FF0055", title: "MOTION DESIGN", role: "3D & Animation", desc: "Using motion to guide user attention and explain complex systems.", bullets: ["After Effects / C4D", "UI Animation", "Interactive Storytelling"], metrics: ["User Delight", "Clarity", "Adoption"] },
    { id: "webgl", group: 3, val: 30, color: "#FF0055", title: "WEBGL / 3D", role: "Immersive Web", desc: "Pushing the boundaries of browser-based rendering.", bullets: ["Three.js / R3F", "GLSL Shaders", "Performance Optimization"], metrics: ["60FPS", "No Plugins", "Cross-Platform"] },
    { id: "storytelling", group: 3, val: 30, color: "#FF0055", title: "STORYTELLING", role: "Narrative Strategy", desc: "Aligning stakeholders through visual persuasion.", bullets: ["Executive Keynotes", "Vision Decks", "Complex Data Viz"], metrics: ["Board Alignment", "Sales Velocity", "Brand Equity"] },
    { id: "ar_vr", group: 3, val: 30, color: "#FF0055", title: "XR COMPUTING", role: "Spatial", desc: "YouTube 'Try-On' modules for e-commerce.", bullets: ["ARCore Implementation", "WebXR Standards", "Virtual Try-On"], metrics: ["Conversion Lift", "Immersive UX", "Future Tech"] },

    // ORBIT
    { id: "global_ops", group: 4, val: 30, color: "#0070F3", title: "GLOBAL OPS", role: "Scale", desc: "Standardizing operations across APAC and EMEA regions.", bullets: ["Vendor Management", "SOP Standardization", "Operational Excellence"], metrics: ["Cost Reduction", "Reliability", "Global Reach"] },
    { id: "gemini_api", group: 3, val: 30, color: "#00FF94", title: "GEMINI API", role: "Integration", desc: "Deep implementation of Google's multimodal models.", bullets: ["Multimodal Inputs", "Function Calling", "Enterprise Security"], metrics: ["Scale", "Security", "Intelligence"] },
    { id: "process", group: 4, val: 20, color: "#0070F3", title: "PROCESS ENG", role: "SOPs & BRDs", desc: "Codifying tacit knowledge.", bullets: ["Documentation Architecture", "Knowledge Transfer", "Change Management"], metrics: ["Knowledge Retention", "Onboarding Speed", "Consistency"] },
    { id: "vendor_mgmt", group: 4, val: 20, color: "#0070F3", title: "VENDOR MGMT", role: "Supply Chain", desc: "Managing creative pipelines.", bullets: ["Procurement Strategy", "Performance Audits", "Relationship Building"], metrics: ["ROI Optimization", "Delivery Speed", "Partner Trust"] },
    { id: "viral_history", group: 4, val: 20, color: "#FFCC00", title: "VIRAL HISTORY", role: "Legacy", desc: "Architect of 'Monk-e-Mail'.", bullets: ["Flash Era Viral Hits", "Social Engineering", "Mass Scale"], metrics: ["50M+ Users", "Cultural Icon", "Early Web 2.0"] },
    { id: "gsap", group: 3, val: 20, color: "#FF0055", title: "GSAP ANIMATION", role: "Motion", desc: "Complex timeline orchestration.", bullets: ["ScrollTrigger", "Flip Layouts", "Canvas Integration"], metrics: ["Award Winning", "Smooth UX", "Interaction"] },
  ],
  links: [
    // CORE LINKS
    { source: "jonathan", target: "strategy" }, { source: "jonathan", target: "engineering" }, { source: "jonathan", target: "creative" },
    // STRATEGY
    { source: "strategy", target: "geopolitics" }, { source: "strategy", target: "governance" }, { source: "strategy", target: "global_ops" },
    // ENGINEERING
    { source: "engineering", target: "gen_ai" }, { source: "engineering", target: "next_js" }, { source: "engineering", target: "audio_ai" }, { source: "engineering", target: "gemini_api" }, { source: "engineering", target: "cloud" }, { source: "engineering", target: "analytics" },
    // CREATIVE
    { source: "creative", target: "motion" }, { source: "creative", target: "webgl" }, { source: "creative", target: "ar_vr" }, { source: "creative", target: "storytelling" },
    // CROSS & ORBIT
    { source: "gen_ai", target: "audio_ai" }, { source: "global_ops", target: "process" }, { source: "global_ops", target: "vendor_mgmt" },
    { source: "motion", target: "viral_history" }, { source: "motion", target: "gsap" },
    { source: "gemini_api", target: "governance" }
  ]
};

const TOUR_STEPS = ["jonathan", "strategy", "engineering", "creative", "gemini_api"];

export default function TechConstellation() {
  const fgRef = useRef<ForceGraphMethods | undefined>(undefined);
  const [dimensions, setDimensions] = useState({ w: 1000, h: 800 });
  
  // Stable Data Clone
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

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== "undefined") {
      const handleResize = () => {
        const mobile = window.innerWidth < 768;
        setIsMobile(mobile);
        setDimensions({ 
          w: window.innerWidth, 
          h: mobile ? window.innerHeight * 0.45 : window.innerHeight 
        });
      };
      window.addEventListener("resize", handleResize);
      handleResize(); 
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  // --- PHYSICS INIT ---
  useEffect(() => {
    if (fgRef.current) {
        const graph = fgRef.current;
        const targetX = isMobile ? 0 : STAGE_X;
        const targetY = isMobile ? -20 : 0;

        graph.d3Force('charge')?.strength(isMobile ? -80 : -200); 
        graph.d3Force('link')?.distance(isMobile ? 50 : 100);
        graph.d3Force('center')?.x(targetX); 
        graph.d3Force('center')?.y(targetY);

        // Camera Start
        graph.centerAt(targetX, targetY, 0);
        graph.zoom(0.1, 0); 

        setTimeout(() => {
          graph.zoom(isMobile ? 2.2 : 3.5, 2000);
        }, 500);
    }
  }, [isClient, isMobile]);

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

    node.fx = node.x;
    node.fy = node.y;
    
    const targetX = isMobile ? 0 : STAGE_X;

    gsap.to(node, {
      fx: targetX,
      fy: 0,
      duration: 2.5,
      ease: "power2.inOut",
      onUpdate: () => { fgRef.current?.d3ReheatSimulation(); }
    });

    setTimeout(() => {
      setActiveNode(node);
      setIsTransitioning(false);
    }, 800); 
  };

  // --- AUTO-PILOT ---
  useEffect(() => {
    const startDelay = setTimeout(() => {
      const interval = setInterval(() => {
        if (!autoPilotRef.current) return;
        const nextIndex = (indexRef.current + 1) % TOUR_STEPS.length;
        indexRef.current = nextIndex;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const graphNodes = (graphData.nodes as any[]);
        const node = graphNodes.find(n => n.id === TOUR_STEPS[nextIndex]);
        if (node) transitionToNode(node);
      }, 10000);
      return () => clearInterval(interval);
    }, 4000);
    return () => clearTimeout(startDelay);
  }, [graphData, isMobile]);

  // --- INTERACTION ---
  const handleInteraction = useCallback((nodeId: string) => {
    autoPilotRef.current = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const graphNodes = (graphData.nodes as any[]); 
    const node = graphNodes.find(n => n.id === nodeId);
    if (node) transitionToNode(node);

    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
      autoPilotRef.current = true;
    }, 15000); 
  }, [graphData, isMobile]);

  const handleDeepLink = () => {
    const targetMap: Record<string, string> = {
        "engineering": "slide-sense",
        "gen_ai": "slide-sense",
        "audio_ai": "stevie",
        "strategy": "beyond-the-map",
        "creative": "monk-e-mail",
        "global_ops": "exp-google"
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
              <div className="absolute top-0 left-0 w-full h-1 md:w-2 md:h-full transition-colors duration-500" style={{ backgroundColor: activeNode?.color || '#fff' }} />
              <div className="mb-4 md:mb-8 border-b border-white/10 pb-4 md:pb-6 bg-white/5 -mx-6 -mt-6 md:-mx-12 md:-mt-12 p-6 md:p-12 shrink-0">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                        <span className="text-[9px] font-mono text-white uppercase tracking-wider font-bold">Live Signal</span>
                    </div>
                </div>
                <p className="text-xs md:text-sm font-mono text-[#00FF94] h-6 md:h-8 leading-relaxed overflow-hidden whitespace-nowrap md:whitespace-normal text-ellipsis">
                  {currentTrend}<span className="animate-pulse text-white">_</span>
                </p>
              </div>
              <div className="overflow-y-auto md:overflow-visible flex-1 pr-2">
                  <h3 className="font-mono text-[#0070F3] text-[10px] md:text-xs mb-2 uppercase tracking-widest font-bold" style={{ color: activeNode?.color }}>{activeNode?.role}</h3>
                  <h1 className="text-3xl md:text-6xl font-sans font-bold text-white mb-4 md:mb-8 leading-none tracking-tight">{activeNode?.title || activeNode?.id}</h1>
                  <p className="text-sm md:text-lg text-gray-300 font-sans leading-relaxed mb-6 md:mb-8 max-w-xl md:border-l-4 md:border-white/10 md:pl-6">{activeNode?.desc}</p>
                  {activeNode?.bullets && (
                    <div className="grid gap-2 md:gap-3 mb-6 md:mb-8 hidden md:grid">
                      {activeNode.bullets.map((b: string, i: number) => (
                        <div key={i} className="flex items-start gap-3 text-gray-400">
                          <span className="text-[#0070F3] mt-1">▸</span>
                          <span className="font-mono text-xs md:text-sm leading-relaxed">{b}</span>
                        </div>
                      ))}
                    </div>
                  )}
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
                      <button onClick={handleDeepLink} className="w-full border border-white/20 bg-white/5 px-4 py-3 md:px-6 md:py-4 text-[10px] md:text-xs font-mono text-white hover:bg-white hover:text-black transition-all uppercase tracking-widest flex justify-between items-center">
                        <span>{activeNode.id === "jonathan" ? "INITIATE RESEARCH" : "INSPECT DATA"}</span>
                        <span>&darr;</span>
                      </button>
                  </div>
              </div>
           </div>
        </div>
      </div>

      {/* RIGHT BRAIN CANVAS */}
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
          
          nodeRelSize={9}
          linkColor={() => "#ffffff15"}
          linkWidth={1.5}
          linkDirectionalParticles={2}
          linkDirectionalParticleSpeed={0.005}
          
          // ULTRON RENDERER
          nodeCanvasObject={(node, ctx, globalScale) => {
            if (!Number.isFinite(node.x) || !Number.isFinite(node.y)) return;

            const isTarget = node.id === activeNode?.id;
            const color = (node.color as string) || "#fff";
            
            const time = Date.now();
            const pulse = Math.sin(time / 500) * 3; 
            const mobileScale = isMobile ? 0.6 : 1; 
            const baseRadius = 6 * mobileScale;
            const radius = (isTarget ? (baseRadius * 1.5) + pulse : baseRadius);

            // 1. OUTER GLOW
            ctx.globalCompositeOperation = 'lighter';
            const gradient = ctx.createRadialGradient(node.x!, node.y!, 0, node.x!, node.y!, radius * 4);
            gradient.addColorStop(0, color);
            gradient.addColorStop(0.5, 'rgba(0,0,0,0)');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(node.x!, node.y!, radius * 4, 0, 2 * Math.PI);
            ctx.fill();

            // 2. REACTOR RING
            if (isTarget) {
                ctx.save();
                ctx.translate(node.x!, node.y!);
                ctx.rotate(time / 1000); 
                ctx.strokeStyle = color;
                ctx.lineWidth = 2;
                ctx.beginPath();
                for(let i=0; i<3; i++) {
                    ctx.arc(0, 0, radius * 1.5, (i * 2 * Math.PI / 3), (i * 2 * Math.PI / 3) + 1);
                    ctx.stroke();
                    ctx.beginPath();
                }
                ctx.restore();
            }

            // 3. CORE
            ctx.globalCompositeOperation = 'source-over';
            ctx.beginPath();
            ctx.arc(node.x!, node.y!, radius, 0, 2 * Math.PI, false);
            ctx.fillStyle = "#000";
            ctx.fill();
            
            ctx.beginPath();
            ctx.arc(node.x!, node.y!, radius * 0.6, 0, 2 * Math.PI, false);
            ctx.fillStyle = color;
            ctx.fill();

            // 4. LABEL
            if (node.group <= 2 || isTarget) {
              const label = node.title || node.id as string; // Use Title if available
              const fontSize = (12 / globalScale) * mobileScale;
              ctx.font = `bold ${fontSize}px Sans-Serif`;
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillStyle = 'rgba(255,255,255,0.8)';
              const textOffset = radius + (isTarget ? 15 : 8);
              // Only show first word of ID for cleaner look on graph
              const shortLabel = label.split(' ')[0].toUpperCase();
              ctx.fillText(shortLabel, node.x!, node.y! + textOffset);
            }
          }}
        />
      </div>
    </div>
  );
}