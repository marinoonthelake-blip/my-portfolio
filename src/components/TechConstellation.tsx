"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import ForceGraph2D, { ForceGraphMethods } from "react-force-graph-2d";
import gsap from "gsap";

// --- 1. CONFIGURATION ---
// Desktop: Shift right (250). Mobile: Center (0).
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
    { id: "JONATHAN", group: 1, val: 120, color: "#FFFFFF", title: "JONATHAN W. MARINO", role: "STRATEGIC TECH EXEC", desc: "Architecting the intersection of Policy, Code, and Design." },
    
    { id: "Strategy", group: 2, val: 60, color: "#0070F3", title: "STRATEGIC RISK", role: "Geopolitical Architect", desc: "Mitigating enterprise risk by translating abstract policy mandates into rigorous code enforcement.", bullets: ["Orchestrated 'Beyond the Map'", "Navigated diplomacy", "Established privacy frameworks"], metrics: ["1.4M Citizens", "Privacy Compliance", "Cross-Border"] },
    { id: "Engineering", group: 2, val: 60, color: "#00FF94", title: "ENGINEERING VELOCITY", role: "Full-Stack & GenAI Lead", desc: "Deploying AI agents to automate workflows and reclaim executive hours.", bullets: ["Built 'SlideSense' AI", "Developed 'Stevie' Audio Engine", "Global keyword tools"], metrics: ["$300k+ Savings", "Automated Ops", "Gemini API"] },
    { id: "Creative", group: 2, val: 60, color: "#FF0055", title: "CREATIVE INTELLIGENCE", role: "High-Fidelity Motion", desc: "Translating abstract strategy into visceral 3D narratives.", bullets: ["Directed 'Monk-e-Mail'", "Led 3D Design for E-Trade Baby", "Pioneered '3D Swirl' formats"], metrics: ["50M+ Engagement", "Super Bowl Ads", "Interactive Story"] },
    
    { id: "Global Ops", group: 3, val: 30, color: "#0070F3", title: "GLOBAL OPS", role: "Scale", desc: "Standardizing vendor ops across APAC/EMEA." },
    { id: "Governance", group: 3, val: 30, color: "#0070F3", title: "GOVERNANCE", role: "Policy", desc: "Automated policy enforcement via code." },
    { id: "Geopolitics", group: 3, val: 30, color: "#0070F3", title: "GEOPOLITICS", role: "Sovereignty", desc: "Mapping unmapped territories." },
    
    { id: "Next.js", group: 3, val: 30, color: "#00FF94", title: "NEXT.JS 15", role: "Architecture", desc: "Server Components and PPR." },
    { id: "Gemini API", group: 3, val: 40, color: "#00FF94", title: "GEMINI API", role: "LLM Integration", desc: "Deep integration of Multimodal AI." },
    { id: "Audio AI", group: 3, val: 30, color: "#00FF94", title: "AUDIO SYNTHESIS", role: "Accessibility", desc: "Neural Text-to-Speech pipelines." },
    { id: "Cloud", group: 3, val: 30, color: "#00FF94", title: "CLOUD INFRA", role: "GCP", desc: "Scalable global architecture." },
    
    { id: "WebGL", group: 3, val: 30, color: "#FF0055", title: "WEBGL", role: "Immersive", desc: "Browser-based 3D rendering." },
    { id: "GSAP", group: 3, val: 30, color: "#FF0055", title: "GSAP ANIMATION", role: "Motion", desc: "Complex timeline orchestration." },
    { id: "AR / VR", group: 3, val: 30, color: "#FF0055", title: "XR COMPUTING", role: "Spatial", desc: "YouTube 'Try-On' modules." },
  ],
  links: [
    { source: "JONATHAN", target: "Strategy" }, { source: "JONATHAN", target: "Engineering" }, { source: "JONATHAN", target: "Creative" },
    { source: "Strategy", target: "Geopolitics" }, { source: "Strategy", target: "Governance" }, { source: "Strategy", target: "Global Ops" },
    { source: "Engineering", target: "GenAI" }, { source: "Engineering", target: "Next.js" }, { source: "Engineering", target: "Audio AI" }, { source: "Engineering", target: "Cloud" },
    { source: "Creative", target: "WebGL" }, { source: "Creative", target: "GSAP" }, { source: "Creative", target: "AR / VR" },
    { source: "Gemini API", target: "Audio AI" }, { source: "Global Ops", target: "Strategy" }, { source: "GenAI", target: "Gemini API" }
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

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== "undefined") {
      const handleResize = () => {
        const mobile = window.innerWidth < 768;
        setIsMobile(mobile);
        setDimensions({ 
          w: window.innerWidth, 
          h: mobile ? window.innerHeight * 0.45 : window.innerHeight // Top 45% on mobile
        });
      };
      window.addEventListener("resize", handleResize);
      handleResize(); 
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  useEffect(() => {
    if (fgRef.current) {
        const graph = fgRef.current;
        const startX = isMobile ? 0 : DESKTOP_OFFSET_X;
        const startY = isMobile ? 0 : 0; // Keep centered on Y

        graph.d3Force('charge')?.strength(isMobile ? -100 : -200); 
        graph.d3Force('link')?.distance(isMobile ? 60 : 100);
        
        // Physics Center
        graph.d3Force('center')?.x(startX); 
        graph.d3Force('center')?.y(startY);

        // Camera Center
        graph.centerAt(startX, startY, 0);
        graph.zoom(0.1, 0); 

        setTimeout(() => {
          const targetZoom = isMobile ? 2.5 : 3.5;
          graph.zoom(targetZoom, 2000);
        }, 1000);
    }
  }, [isClient, isMobile]);

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
    
    // DYNAMIC TARGET
    // Mobile: X=0 (Center). Desktop: X=250 (Right).
    const targetX = isMobile ? 0 : DESKTOP_OFFSET_X;

    gsap.to(node, {
      fx: targetX,
      fy: 0, // Always align to vertical center of canvas
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
    }, 8000);
    return () => clearInterval(interval);
  }, [graphData, isMobile]);

  const handleInteraction = useCallback((nodeId: string) => {
    autoPilotRef.current = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const graphNodes = (graphData.nodes as any[]); 
    const node = graphNodes.find(n => n.id === nodeId);
    if (node) transitionToNode(node);

    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
      autoPilotRef.current = true;
    }, 10000); 
  }, [graphData, isMobile]);

  const handleDeepLink = () => {
    const targetMap: Record<string, string> = {
        "Engineering": "slide-sense",
        "GenAI": "slide-sense",
        "Audio AI": "stevie",
        "Strategy": "beyond-the-map",
        "Creative": "monk-e-mail",
        "Global Ops": "exp-google"
    };
    const targetId = targetMap[activeNode.title] || targetMap[activeNode.id] || "content-start";
    const element = document.getElementById(targetId);
    if (element) element.scrollIntoView({ behavior: "smooth", block: "center" });
    else document.getElementById('content-start')?.scrollIntoView({ behavior: "smooth" });
  };

  if (!isClient) return null;

  return (
    <div className="fixed inset-0 bg-[#050505] overflow-hidden">
      
      {/* --- LEFT CARD (Bottom Sheet on Mobile) --- */}
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
              
              {/* FEED */}
              <div className="mb-4 md:mb-8 border-b border-white/10 pb-4 md:pb-6 bg-white/5 -mx-6 -mt-6 md:-mx-12 md:-mt-12 p-6 md:p-12 shrink-0">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                        <span className="text-[9px] font-mono text-white uppercase tracking-wider font-bold">System Status</span>
                    </div>
                </div>
                <p className="text-xs md:text-sm font-mono text-[#00FF94] h-6 md:h-8 leading-relaxed overflow-hidden whitespace-nowrap md:whitespace-normal text-ellipsis">
                  {currentTrend}<span className="animate-pulse text-white">_</span>
                </p>
              </div>

              {/* SCROLLER */}
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

                  <div className="mt-2 md:mt-4 pt-4 md:pt-6 border-t border-gray-800 pb-12 md:pb-0">
                      <button onClick={handleDeepLink} className="w-full border border-white/20 bg-white/5 px-4 py-3 md:px-6 md:py-4 text-[10px] md:text-xs font-mono text-white hover:bg-white hover:text-black transition-all uppercase tracking-widest flex justify-between items-center">
                        <span>{activeNode.id === "JONATHAN" ? "INITIATE RESEARCH" : "INSPECT DATA"}</span>
                        <span>&darr;</span>
                      </button>
                  </div>
              </div>
           </div>
        </div>
      </div>

      {/* RIGHT BRAIN CANVAS (Top 45% on Mobile) */}
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
          
          // --- ULTRON REACTOR RENDERER ---
          nodeCanvasObject={(node, ctx, globalScale) => {
            if (!Number.isFinite(node.x) || !Number.isFinite(node.y)) return;

            const isTarget = node.id === activeNode?.id;
            const color = (node.color as string) || "#fff";
            
            // Time for rotation
            const time = Date.now();
            const pulse = Math.sin(time / 500) * 3; 
            const mobileScale = isMobile ? 0.7 : 1; 
            const baseRadius = 6 * mobileScale;
            
            // Active nodes are larger and pulsate
            const radius = (isTarget ? (baseRadius * 2) + pulse : baseRadius);

            // 1. OUTER GLOW
            const gradient = ctx.createRadialGradient(node.x!, node.y!, 0, node.x!, node.y!, radius * 4);
            gradient.addColorStop(0, color);
            gradient.addColorStop(0.5, 'rgba(0,0,0,0)');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(node.x!, node.y!, radius * 4, 0, 2 * Math.PI);
            ctx.fill();

            // 2. THE REACTOR RING (Rotating Segments)
            if (isTarget) {
                ctx.save();
                ctx.translate(node.x!, node.y!);
                ctx.rotate(time / 1000); // Slow rotation
                ctx.strokeStyle = color;
                ctx.lineWidth = 2;
                ctx.beginPath();
                // Draw 3 segments
                for(let i=0; i<3; i++) {
                    ctx.arc(0, 0, radius * 1.5, (i * 2 * Math.PI / 3), (i * 2 * Math.PI / 3) + 1);
                    ctx.stroke();
                    ctx.beginPath(); // Reset for next segment
                }
                ctx.restore();
            }

            // 3. THE CORE (Solid Energy)
            ctx.beginPath();
            ctx.arc(node.x!, node.y!, radius, 0, 2 * Math.PI, false);
            ctx.fillStyle = "#000"; // Black center
            ctx.fill();
            
            ctx.beginPath();
            ctx.arc(node.x!, node.y!, radius * 0.6, 0, 2 * Math.PI, false);
            ctx.fillStyle = color; // Hot core
            ctx.fill();

            // 4. LABEL
            if (node.group <= 2) {
              const label = node.id as string;
              const fontSize = (12 / globalScale) * mobileScale;
              ctx.font = `bold ${fontSize}px Sans-Serif`;
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillStyle = 'rgba(255,255,255,0.8)';
              // Push text further down
              const textOffset = radius + (isTarget ? 15 : 8);
              ctx.fillText(label, node.x!, node.y! + textOffset);
            }
          }}
        />
      </div>
    </div>
  );
}