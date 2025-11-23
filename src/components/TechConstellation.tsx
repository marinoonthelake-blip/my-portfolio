"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import ForceGraph2D, { ForceGraphMethods } from "react-force-graph-2d";
import gsap from "gsap";

// --- 1. LIVE INTELLIGENCE DATA (Simulated) ---
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
    // Core Connections
    { source: "JONATHAN", target: "Strategy" }, { source: "JONATHAN", target: "Engineering" }, 
    { source: "JONATHAN", target: "Creative" }, { source: "JONATHAN", target: "Global Ops" },
    
    // Strategy Cluster
    { source: "Strategy", target: "Geopolitics" }, { source: "Strategy", target: "Governance" },
    { source: "Geopolitics", target: "Global Ops" },
    
    // Engineering Cluster
    { source: "Engineering", target: "GenAI" }, { source: "Engineering", target: "Cloud" },
    { source: "Engineering", target: "Analytics" }, { source: "Engineering", target: "Next.js" },
    { source: "GenAI", target: "Audio AI" }, { source: "GenAI", target: "Governance" },
    
    // Creative Cluster
    { source: "Creative", target: "Motion" }, { source: "Creative", target: "WebGL" },
    { source: "Creative", target: "AR / VR" }, { source: "Creative", target: "Storytelling" },
    { source: "Motion", target: "Viral History" },
    
    // Ops Cluster
    { source: "Global Ops", target: "Process" }, { source: "Global Ops", target: "Vendor Mgmt" },
    { source: "Global Ops", target: "Accessibility" }, { source: "Accessibility", target: "Audio AI" },
  ]
};

const TOUR_STEPS = ["JONATHAN", "Strategy", "Engineering", "Creative", "Global Ops", "GenAI", "Geopolitics"];

export default function TechConstellation() {
  const fgRef = useRef<ForceGraphMethods | undefined>(undefined);
  const [dimensions, setDimensions] = useState({ w: 1000, h: 800 });
  
  // State
  const [activeNode, setActiveNode] = useState<any>(initialData.nodes[0]); 
  const [isTransitioning, setIsTransitioning] = useState(false); 
  const [currentTrend, setCurrentTrend] = useState("");
  
  // Logic Refs
  const tourIndexRef = useRef(0);
  const autoPilotRef = useRef(true);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);

  // --- RESPONSIVE SIZING ---
  useEffect(() => {
    if (typeof window !== "undefined") {
      const updateSize = () => setDimensions({ w: window.innerWidth, h: window.innerHeight });
      window.addEventListener("resize", updateSize);
      updateSize();
      return () => window.removeEventListener("resize", updateSize);
    }
  }, []);

  // --- PHYSICS ENGINE CONFIG (Tight & Stable) ---
  useEffect(() => {
    if (fgRef.current) {
        const graph = fgRef.current;
        
        // Stronger Gravity to keep 20 nodes tight
        graph.d3Force('charge')?.strength(-120); 
        graph.d3Force('link')?.distance(60);
        graph.d3Force('center')?.strength(0.05); 
        
        // Initial Camera Position (Right Side)
        // We look at (200, 0) to keep the brain on the right
        graph.centerAt(200, 0, 0);
        graph.zoom(4.0, 0);
    }
  }, []);

  // --- TYPING EFFECT ---
  useEffect(() => {
    if (activeNode && !isTransitioning) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const trends = LIVE_TRENDS[activeNode.id as keyof typeof LIVE_TRENDS] || ["ANALYZING SYSTEM DATA...", "CONNECTING TO FEED...", "CALCULATING IMPACT..."];
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

  // --- CAMERA MOVER (The core animation logic) ---
  const focusOnNode = useCallback((node: any) => {
    if (!fgRef.current) return;

    // A. FADE UI OUT
    setIsTransitioning(true);

    // B. ANIMATE CAMERA (Not the node)
    // We want the node to appear on the RIGHT side of the screen.
    // So we center the camera to the LEFT of the node.
    // Target Camera X = Node X - (ScreenOffset)
    const offsetX = dimensions.w < 768 ? 0 : 200; // 0 for mobile, 200 for desktop
    
    fgRef.current.centerAt(node.x - offsetX, node.y, 1500); 
    fgRef.current.zoom(4.0, 1500);

    // C. FADE UI IN
    setTimeout(() => {
      setActiveNode(node);
      setIsTransitioning(false);
    }, 800); 
  }, [dimensions.w]);

  // --- AUTO-PILOT LOOP ---
  useEffect(() => {
    const interval = setInterval(() => {
      if (!autoPilotRef.current) return;

      const nextIndex = (tourIndexRef.current + 1) % TOUR_STEPS.length;
      tourIndexRef.current = nextIndex;
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const graphNodes = (initialData.nodes as any[]);
      const node = graphNodes.find(n => n.id === TOUR_STEPS[nextIndex]);

      if (node && Number.isFinite(node.x)) {
        focusOnNode(node);
      }
    }, 8000); // 8 seconds per stop

    return () => clearInterval(interval);
  }, [focusOnNode]);

  // --- USER INTERACTION HANDLER ---
  const handleNodeClick = useCallback((node: any) => {
    // 1. Stop Auto-Pilot
    autoPilotRef.current = false;
    
    // 2. Move Immediately
    focusOnNode(node);

    // 3. Restart Auto-Pilot after 15s of idleness
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
      autoPilotRef.current = true;
    }, 15000);

  }, [focusOnNode]);

  // --- RENDER ---
  if (!dimensions.w) return null; // Wait for hydration

  return (
    <div className="fixed inset-0 bg-[#050505] overflow-hidden">
      
      {/* --- LEFT CARD UI --- */}
      <div className="absolute left-0 top-0 h-full w-full md:w-[650px] flex items-center p-6 md:p-12 z-20 pointer-events-none">
        <div 
          className={`pointer-events-auto w-full transition-all duration-700 transform 
            ${isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}
        >
           <div className="bg-black/80 backdrop-blur-3xl border border-white/10 p-8 md:p-10 shadow-[0_0_100px_rgba(0,0,0,0.9)] relative overflow-hidden rounded-2xl">
              
              {/* Color Bar */}
              <div className="absolute top-0 left-0 w-2 h-full transition-colors duration-500" 
                   style={{ backgroundColor: activeNode?.color || '#fff' }} />
              
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex flex-col">
                  <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-gray-500 mb-1">
                    System Node
                  </span>
                  <span className="font-mono text-white text-sm">
                    {activeNode?.group === 1 ? 'KERNEL' : `MODULE_0${activeNode?.group}`}
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-[9px] font-mono text-white uppercase tracking-wider">Live</span>
                </div>
              </div>

              {/* Title */}
              <h3 className="font-mono text-[#0070F3] text-xs mb-2 uppercase tracking-widest" 
                  style={{ color: activeNode?.color }}>
                {activeNode?.role}
              </h3>
              <h1 className="text-4xl md:text-5xl font-sans font-bold text-white mb-6 leading-[0.9] tracking-tight">
                {activeNode?.title || activeNode?.id}
              </h1>

              {/* Description */}
              <p className="text-md text-gray-300 font-sans leading-relaxed mb-6 border-l-2 border-gray-800 pl-4">
                {activeNode?.desc}
              </p>

              {/* Trends */}
              <div className="mb-6 border-t border-gray-800 pt-4">
                <p className="text-[9px] font-mono text-gray-500 mb-2 uppercase">
                  // LIVE INTELLIGENCE
                </p>
                <p className="text-xs font-mono text-[#00FF94] h-4 leading-relaxed">
                  {currentTrend}<span className="animate-pulse text-white">_</span>
                </p>
              </div>

              {/* CTA */}
              {activeNode?.id === "JONATHAN" && (
                 <button 
                   onClick={() => document.getElementById('content-start')?.scrollIntoView({behavior:'smooth'})}
                   className="w-full border border-white/20 bg-white/5 px-6 py-4 text-xs font-mono text-white hover:bg-white hover:text-black transition-all"
                 >
                   INITIATE SEQUENCE &darr;
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
        
        onNodeClick={handleNodeClick}
        onNodeDrag={() => { autoPilotRef.current = false; }}
        onBackgroundClick={() => { autoPilotRef.current = false; }}
        
        // STABLE PHYSICS (No Shaking)
        cooldownTicks={100}
        d3AlphaDecay={0.05}     // Higher decay = Stops faster
        d3VelocityDecay={0.6}   // High friction = Smooth, heavy feel
        
        nodeRelSize={12} // Larger hit area
        linkColor={() => "#ffffff10"}
        linkWidth={1}
        linkDirectionalParticles={2}
        linkDirectionalParticleSpeed={0.005}
        
        nodeCanvasObject={(node, ctx, globalScale) => {
          if (!Number.isFinite(node.x) || !Number.isFinite(node.y)) return;

          const isTarget = node.id === activeNode?.id;
          const isCore = node.group === 1;
          const color = (node.color as string) || "#fff";
          
          // Smooth Pulse
          const pulse = Math.sin(Date.now() / 1000) * 2; 
          const baseRadius = isCore ? 12 : 5;
          const radius = isTarget ? (baseRadius * 1.5) + pulse : baseRadius;

          // 1. Outer Glow (Large, faint)
          const gradient = ctx.createRadialGradient(node.x!, node.y!, 0, node.x!, node.y!, radius * 4);
          gradient.addColorStop(0, color);
          gradient.addColorStop(0.1, color + '44');
          gradient.addColorStop(1, 'transparent');

          ctx.beginPath();
          ctx.arc(node.x!, node.y!, radius * 4, 0, 2 * Math.PI, false);
          ctx.fillStyle = gradient;
          ctx.fill();

          // 2. Core Body (Solid)
          ctx.beginPath();
          ctx.arc(node.x!, node.y!, radius, 0, 2 * Math.PI, false);
          ctx.fillStyle = isTarget ? "#000" : color;
          ctx.fill();
          ctx.strokeStyle = color;
          ctx.lineWidth = isTarget ? 3 : 0;
          ctx.stroke();

          // 3. Data Ring (Active Only)
          if (isTarget) {
             ctx.beginPath();
             ctx.arc(node.x!, node.y!, radius * 1.6, 0, 2 * Math.PI, false);
             ctx.strokeStyle = color + '55';
             ctx.lineWidth = 1;
             ctx.stroke();
          }

          // 4. Text Label (Context-Aware)
          // Show label if Active OR if it's a main pillar (Group 2)
          if (isTarget || node.group <= 2) {
             const label = node.id as string;
             const fontSize = 14 / globalScale;
             ctx.font = `bold ${fontSize}px Sans-Serif`;
             ctx.textAlign = 'center';
             ctx.textBaseline = 'middle';
             ctx.fillStyle = isTarget ? '#FFF' : 'rgba(255,255,255,0.4)';
             ctx.fillText(label, node.x!, node.y! + radius + fontSize + 2);
          }
        }}
      />
    </div>
  );
}