"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import ForceGraph2D, { ForceGraphMethods } from "react-force-graph-2d";
import gsap from "gsap";

// --- 1. CONFIGURATION ---
const STAGE_X = 250; 
const STAGE_Y = 0;

// Toned down, professional "Tech Trends"
const LIVE_TRENDS = {
  "Trust & Safety": ["TREND: Content authenticity standards (C2PA).", "POLICY: AI labeling requirements in EU/US.", "SCALE: Automated enforcement pipelines."],
  "Engineering": ["BENCHMARK: Optimizing inference costs at scale.", "STACK: Next.js 15 Server Actions adoption.", "SHIFT: From microservices to modular monoliths."],
  "Creative": ["UX: 3D Product configurations driving conversion.", "DESIGN: Spatial computing interface standards.", "METRIC: Interaction time correlates with retention."],
  "Global Ops": ["SCALE: 24/7 Vendor operations reliability.", "OPS: Human-in-the-Loop (HITL) optimization."],
  "Gemini API": ["UPDATE: Multimodal reasoning capabilities.", "INTEGRATION: Enterprise context caching."],
  "JONATHAN": ["STATUS: ONLINE.", "ROLE: TECHNICAL LEAD.", "FOCUS: USER SAFETY & SCALE."]
};

// --- 2. MASTER DATA (Professional Tone) ---
const MASTER_DATA = {
  nodes: [
    // CORE
    { 
      id: "JONATHAN", group: 1, val: 120, color: "#FFFFFF",
      title: "JONATHAN W. MARINO", 
      role: "STRATEGIC TECHNOLOGY EXECUTIVE",
      desc: "A Technical Lead and Policy Architect bridging the gap between Product Strategy and Engineering. Solving scale, safety, and efficiency challenges for global user bases.",
      bullets: ["15+ Years Experience", "Tech Lead for Policy", "User-Centric Architecture"],
      metrics: ["Global Scale", "Product Policy", "Operational Efficiency"]
    },
    
    // PILLAR 1: TRUST & SAFETY (Replaces Strategy/Geopolitics)
    { id: "Trust & Safety", group: 2, val: 60, color: "#0070F3", title: "TRUST & SAFETY", role: "Policy Architect", desc: "Protecting users and brand equity by translating complex policy mandates into rigorous technical enforcement.", bullets: ["Led 'Beyond the Map' Inclusion Initiative", "Policy Compliance Frameworks", "Risk Mitigation at Scale"], metrics: ["User Protection", "Regulatory Compliance", "Brand Safety"] },
    { id: "Policy", group: 3, val: 30, color: "#0070F3", title: "PRODUCT POLICY", role: "Compliance", desc: "Defining and enforcing digital standards across global markets.", bullets: ["GDPR/CCPA Alignment", "Content Moderation Rules", "User Safety Guidelines"], metrics: ["Global Standards", "Risk Reduction", "User Trust"] },
    { id: "Inclusion", group: 3, val: 30, color: "#0070F3", title: "DIGITAL INCLUSION", role: "Access", desc: "Ensuring technology serves under-represented populations.", bullets: ["Mapped 1.4M Citizens (Rio)", "Digital Identity Access", "Civic Tech Partnerships"], metrics: ["1.4M Users", "Social Impact", "Accessibility"] },

    // PILLAR 2: ENGINEERING
    { id: "Engineering", group: 2, val: 60, color: "#00FF94", title: "ENGINEERING LEADERSHIP", role: "Full-Stack & GenAI", desc: "Building scalable internal tools that automate workflows and reduce friction for policy and operations teams.", bullets: ["Built 'SlideSense' Automation", "Developed 'Stevie' Accessibility Tool", "Global Tooling Architecture"], metrics: ["$300k+ Savings", "Process Automation", "Gemini Integration"] },
    { id: "GenAI", group: 3, val: 40, color: "#00FF94", title: "GENERATIVE AI", role: "LLM Integration", desc: "Leveraging Large Language Models to solve unstructured data problems.", bullets: ["RAG Pipelines", "Automated Review Systems", "Context-Aware Agents"], metrics: ["Efficiency +400%", "Latency <200ms", "Accuracy"] },
    { id: "Audio AI", group: 3, val: 30, color: "#00FF94", title: "AUDIO SYNTHESIS", role: "Neural Speech", desc: "Creating inclusive audio interfaces for internal tools.", bullets: ["'Stevie' Audio Engine", "Text-to-Speech Pipelines", "WCAG Compliance"], metrics: ["Inclusive Design", "Accessibility", "Innovation"] },
    { id: "Next.js", group: 3, val: 30, color: "#00FF94", title: "MODERN STACK", role: "Architecture", desc: "High-performance web architecture using React Server Components.", bullets: ["Next.js 15", "Edge Computing", "Real-time Data"], metrics: ["Performance", "Scalability", "Maintainability"] },

    // PILLAR 3: CREATIVE
    { id: "Creative", group: 2, val: 60, color: "#FF0055", title: "CREATIVE TECHNOLOGY", role: "High-Fidelity UX", desc: "Translating complex technical concepts into intuitive, engaging user experiences.", bullets: ["Directed 'Monk-e-Mail' (50M+ Users)", "E-Trade Baby Campaign", "3D Swirl Ad Formats"], metrics: ["High Engagement", "User Retention", "Visual Storytelling"] },
    { id: "Motion", group: 3, val: 30, color: "#FF0055", title: "MOTION DESIGN", role: "3D & Animation", desc: "Using motion to guide user attention and explain complex systems.", bullets: ["After Effects / C4D", "UI Animation", "Interactive Storytelling"], metrics: ["User Delight", "Clarity", "Adoption"] },
    { id: "WebGL", group: 3, val: 30, color: "#FF0055", title: "WEBGL / 3D", role: "Immersive Web", desc: "Pushing the boundaries of browser-based rendering.", bullets: ["Three.js / R3F", "GLSL Shaders", "Performance Optimization"], metrics: ["60FPS", "No Plugins", "Cross-Platform"] },

    // ORBIT
    { id: "Global Ops", group: 4, val: 30, color: "#0070F3", title: "GLOBAL OPS", role: "Scale", desc: "Standardizing operations across APAC and EMEA regions.", bullets: ["Vendor Management", "SOP Standardization", "Operational Excellence"], metrics: ["Cost Reduction", "Reliability", "Global Reach"] },
    { id: "Gemini API", group: 3, val: 30, color: "#00FF94", title: "GEMINI API", role: "Integration", desc: "Deep implementation of Google's multimodal models.", bullets: ["Multimodal Inputs", "Function Calling", "Enterprise Security"], metrics: ["Scale", "Security", "Intelligence"] },
  ],
  links: [
    { source: "JONATHAN", target: "Trust & Safety" }, { source: "JONATHAN", target: "Engineering" }, { source: "JONATHAN", target: "Creative" },
    { source: "Trust & Safety", target: "Policy" }, { source: "Trust & Safety", target: "Inclusion" }, { source: "Trust & Safety", target: "Global Ops" },
    { source: "Engineering", target: "GenAI" }, { source: "Engineering", target: "Next.js" }, { source: "Engineering", target: "Audio AI" }, { source: "Engineering", target: "Gemini API" },
    { source: "Creative", target: "Motion" }, { source: "Creative", target: "WebGL" },
    { source: "GenAI", target: "Audio AI" }, { source: "Policy", target: "Inclusion" }, { source: "Global Ops", target: "Policy" }
  ]
};

const TOUR_STEPS = ["JONATHAN", "Trust & Safety", "Engineering", "Creative", "GenAI"];

export default function TechConstellation() {
  const fgRef = useRef<ForceGraphMethods | undefined>(undefined);
  const [dimensions, setDimensions] = useState({ w: 1000, h: 800 });
  
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

  // --- PHYSICS CONFIG ---
  useEffect(() => {
    if (fgRef.current) {
        const graph = fgRef.current;
        graph.d3Force('charge')?.strength(-120); // Relaxed repulsion
        graph.d3Force('link')?.distance(90);
        
        // Center Physics
        graph.d3Force('center')?.x(STAGE_X); 
        graph.d3Force('center')?.y(STAGE_Y);

        // --- THE BIG REVEAL SEQUENCE ---
        // 1. Start Wide (Show everything)
        graph.centerAt(STAGE_X, STAGE_Y, 0);
        graph.zoom(0.6, 0); 

        // 2. Wait 2s, then Zoom In to Core
        setTimeout(() => {
          graph.zoom(3.0, 2500); // Slow, cinematic zoom in
        }, 2000);
    }
  }, [isClient]);

  // INTELLIGENCE ENGINE
  useEffect(() => {
    if (activeNode && !isTransitioning) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const trends = LIVE_TRENDS[activeNode.id as keyof typeof LIVE_TRENDS] || ["ANALYZING...", "CONNECTING..."];
      const randomTrend = trends[Math.floor(Math.random() * trends.length)];
      
      let i = 0;
      setCurrentTrend("");
      const typeInterval = setInterval(() => {
        setCurrentTrend(randomTrend.substring(0, i + 1));
        i++;
        if (i > randomTrend.length) clearInterval(typeInterval);
      }, 25);
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
    
    // Smoother easing
    gsap.to(node, {
      fx: STAGE_X,
      fy: STAGE_Y,
      duration: 2.5,
      ease: "power2.inOut", // Less jerky than power3
      onUpdate: () => { fgRef.current?.d3ReheatSimulation(); }
    });

    setTimeout(() => {
      setActiveNode(node);
      setIsTransitioning(false);
    }, 800); 
  };

  // AUTO-PILOT
  useEffect(() => {
    // Initial Delay for the "Big Reveal"
    const startDelay = setTimeout(() => {
        // Start cycling
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
    }, 5000); // Wait 5s before moving

    return () => clearTimeout(startDelay);
  }, [graphData]);

  // INTERACTION
  const handleInteraction = useCallback((nodeId: string) => {
    autoPilotRef.current = false;
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const graphNodes = (graphData.nodes as any[]); 
    const node = graphNodes.find(n => n.id === nodeId);
    
    if (node) transitionToNode(node);

    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
      autoPilotRef.current = true;
    }, 8000); 
  }, [graphData]);

  const handleDeepLink = () => {
    const targetMap: Record<string, string> = {
        "Engineering": "slide-sense",
        "GenAI": "slide-sense",
        "Audio AI": "stevie",
        "Inclusion": "beyond-the-map",
        "Trust & Safety": "beyond-the-map",
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
      
      {/* LEFT CARD */}
      <div className="absolute left-0 top-0 h-full w-full md:w-[650px] flex items-center p-8 md:p-12 z-20 pointer-events-none">
        <div 
          className={`pointer-events-auto w-full transition-all duration-700 transform 
            ${isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}
        >
           <div className="bg-black/70 backdrop-blur-3xl border border-white/10 p-10 md:p-12 shadow-[0_0_100px_rgba(0,0,0,0.9)] relative overflow-hidden rounded-2xl">
              
              <div className="absolute top-0 left-0 w-2 h-full transition-colors duration-500" 
                   style={{ backgroundColor: activeNode?.color || '#fff' }} />
              
              {/* LIVE FEED HEADER (Cleaned Up) */}
              <div className="mb-8 border-b border-white/10 pb-6 bg-white/5 -mx-10 -mt-10 p-10">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                        <span className="text-[10px] font-mono text-white uppercase tracking-wider font-bold">Current Relevance</span>
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
        graphData={graphData}
        backgroundColor="#050505"
        
        onNodeClick={(node) => handleInteraction(node.id as string)}
        onNodeDrag={() => { if (activeNode) handleInteraction(activeNode.id as string); }} 
        onBackgroundClick={() => { if (activeNode) handleInteraction(activeNode.id as string); }}
        
        cooldownTicks={100}
        d3AlphaDecay={0.02}   // Lower decay = smoother float
        d3VelocityDecay={0.4} // Lower friction = more drift
        
        nodeRelSize={9}
        linkColor={() => "#ffffff15"}
        linkWidth={1.5}
        linkDirectionalParticles={4} // More particles = more "Flow"
        linkDirectionalParticleSpeed={0.008} // Faster flow
        
        nodeCanvasObject={(node, ctx, globalScale) => {
          if (!Number.isFinite(node.x) || !Number.isFinite(node.y)) return;

          const isTarget = node.id === activeNode?.id;
          const color = (node.color as string) || "#fff";
          
          // RIPPLE EFFECT
          // We draw expanding rings based on time
          const time = Date.now();
          const pulse = Math.sin(time / 800) * 3; 
          const baseRadius = 6;
          const radius = isTarget ? (baseRadius * 1.5) + pulse : baseRadius;

          // Ripple 1
          if (isTarget) {
             const rippleRadius = (time % 1000) / 1000 * 30 + radius;
             ctx.beginPath();
             ctx.arc(node.x!, node.y!, rippleRadius, 0, 2 * Math.PI, false);
             ctx.strokeStyle = color + '33';
             ctx.lineWidth = 1;
             ctx.stroke();
          }

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

          if (node.group <= 2) {
             const label = node.id as string;
             const fontSize = 12 / globalScale;
             ctx.font = `bold ${fontSize}px Sans-Serif`;
             ctx.textAlign = 'center';
             ctx.textBaseline = 'middle';
             ctx.fillStyle = 'rgba(255,255,255,0.8)'; // Brighter text
             ctx.fillText(label, node.x!, node.y! + radius + fontSize + 4);
          }
        }}
      />
    </div>
  );
}