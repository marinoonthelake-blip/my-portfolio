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
  "Global Ops": [
    "LIVE: Vendor consolidation in EMEA.",
    "OPS: AI-driven SOP generation."
  ],
  "Gemini API": [
    "UPDATE: Gemini 1.5 Pro context expansion.",
    "USE CASE: Multimodal accessibility."
  ]
};

const initialData = {
  nodes: [
    { id: "JONATHAN", group: 1, val: 60, color: "#FFFFFF", title: "JONATHAN W. MARINO", role: "Strategic Tech Exec", desc: "Architecting the intersection of Policy, Code, and Design." },
    { id: "Strategy", group: 2, val: 30, color: "#0070F3", title: "STRATEGIC RISK", role: "Geopolitical & Technical", desc: "Mitigating enterprise risk via policy/code bridges." },
    { id: "Engineering", group: 2, val: 30, color: "#00FF94", title: "ENGINEERING VELOCITY", role: "Full-Stack & GenAI", desc: "Automating workflows to reclaim executive hours." },
    { id: "Creative", group: 2, val: 30, color: "#FF0055", title: "CREATIVE INTELLIGENCE", role: "High-Fidelity Motion", desc: "Translating abstract strategy into visceral 3D narratives." },
    { id: "Global Ops", group: 3, val: 10, color: "#0070F3" },
    { id: "Governance", group: 3, val: 10, color: "#0070F3" },
    { id: "Next.js 15", group: 3, val: 10, color: "#00FF94" },
    { id: "Gemini API", group: 3, val: 15, color: "#00FF94" },
    { id: "WebGL", group: 3, val: 10, color: "#FF0055" },
    { id: "GSAP", group: 3, val: 10, color: "#FF0055" },
  ],
  links: [
    { source: "JONATHAN", target: "Strategy" }, { source: "JONATHAN", target: "Engineering" }, { source: "JONATHAN", target: "Creative" },
    { source: "Strategy", target: "Global Ops" }, { source: "Strategy", target: "Governance" },
    { source: "Engineering", target: "Next.js 15" }, { source: "Engineering", target: "Gemini API" },
    { source: "Creative", target: "WebGL" }, { source: "Creative", target: "GSAP" },
    { source: "Gemini API", target: "Governance" }, 
  ]
};

const TOUR_STEPS = ["JONATHAN", "Strategy", "Engineering", "Creative", "Gemini API"];

// THE STAGE: Where we drag the nodes to (Right side of screen)
const FOCUS_X = 250;
const FOCUS_Y = 0;

export default function TechConstellation() {
  const fgRef = useRef<ForceGraphMethods | undefined>(undefined);
  const [dimensions, setDimensions] = useState({ w: 1000, h: 800 });
  const [activeNode, setActiveNode] = useState<any>(initialData.nodes[0]); 
  const [isAutoPilot, setIsAutoPilot] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [currentTrend, setCurrentTrend] = useState("");
  
  // Internal Refs for Animation Loop
  const tourIndexRef = useRef(0);
  const draggingNodeRef = useRef<any>(null);

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== "undefined") {
      setDimensions({ w: window.innerWidth, h: window.innerHeight });
      const resize = () => setDimensions({ w: window.innerWidth, h: window.innerHeight });
      window.addEventListener("resize", resize);
      return () => window.removeEventListener("resize", resize);
    }
  }, []);

  // 1. INITIAL SETUP: Lock Camera, Start Physics
  useEffect(() => {
    if (fgRef.current) {
        const graph = fgRef.current;
        
        // Set Physics: Loose and floaty
        graph.d3Force('charge')?.strength(-150); 
        graph.d3Force('link')?.distance(80);
        graph.d3Force('center')?.strength(0.01); // Very weak center pull so we can drag easily

        // CAMERA: Lock it once. We never move the camera again.
        // We zoom into the "Stage" area at (250, 0)
        graph.centerAt(FOCUS_X, FOCUS_Y, 0);
        graph.zoom(3.5, 0);
    }
  }, [isClient]);

  // 2. TYPING EFFECT (Updates Left Card)
  useEffect(() => {
    if (activeNode) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const trends = LIVE_TRENDS[activeNode.id as keyof typeof LIVE_TRENDS] || ["ANALYZING DATA STREAM...", "CONNECTING..."];
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
  }, [activeNode]);

  // 3. THE "MAGNETIC DRAG" FUNCTION
  const magnetizeNode = (nodeId: string) => {
    if (!fgRef.current) return;
    
    // Find node in LIVE data (d3 mutates it)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const graphNodes = (initialData.nodes as any[]); 
    const node = graphNodes.find(n => n.id === nodeId);

    if (node) {
      // A. Release previous node
      if (draggingNodeRef.current && draggingNodeRef.current !== node) {
        draggingNodeRef.current.fx = undefined; // Let it float free
        draggingNodeRef.current.fy = undefined;
      }

      // B. Update State (Left Card) immediately
      setActiveNode(node);
      draggingNodeRef.current = node;

      // C. ANIMATE PHYSICS PROPERTIES (The Seamless Move)
      // Instead of moving camera, we animate the node's "Fixed Position" (fx, fy)
      // to the center of our stage. The physics engine handles the rest.
      
      // Lock current position to start drag
      node.fx = node.x;
      node.fy = node.y;

      gsap.to(node, {
        fx: FOCUS_X, // Drag to Target X
        fy: FOCUS_Y, // Drag to Target Y
        duration: 2.5,
        ease: "power3.inOut",
        onUpdate: () => {
          // Keep physics hot during animation so lines stretch smoothly
          fgRef.current?.d3ReheatSimulation(); 
        }
      });
    }
  };

  // 4. THE GAME LOOP (Auto-Pilot)
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAutoPilot) return;

      // Advance Index
      const nextIndex = (tourIndexRef.current + 1) % TOUR_STEPS.length;
      tourIndexRef.current = nextIndex;
      
      const targetId = TOUR_STEPS[nextIndex];
      magnetizeNode(targetId);

    }, 5000); // Every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPilot]);

  // 5. MANUAL INTERACTION
  const handleInteraction = useCallback((node: any) => {
    setIsAutoPilot(false); // Stop loop
    magnetizeNode(node.id); // Drag clicked node to center
  }, []);

  if (!isClient) return null;

  return (
    <div className="fixed inset-0 bg-[#050505] overflow-hidden">
      
      {/* LEFT CARD (Fixed UI) */}
      <div className="absolute left-0 top-0 h-full w-full md:w-[750px] flex items-center p-8 md:p-16 z-20 pointer-events-none">
        <div className={`pointer-events-auto w-full transition-all duration-700 transform ${activeNode ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
           <div className="bg-black/80 backdrop-blur-2xl border border-white/10 p-12 shadow-[0_0_100px_rgba(0,0,0,0.9)] relative overflow-hidden rounded-2xl">
              <div className="absolute top-0 left-0 w-2 h-full transition-colors duration-500" style={{ backgroundColor: activeNode?.color || '#fff' }} />
              
              <div className="flex items-center justify-between mb-8">
                <div className="flex flex-col">
                  <span className="font-mono text-xs tracking-[0.3em] uppercase text-gray-500 mb-1">System Node</span>
                  <span className="font-mono text-white text-lg">{activeNode?.group === 1 ? 'KERNEL' : 'MODULE'}</span>
                </div>
                <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_red]" />
                  <span className="text-[10px] font-mono text-white uppercase tracking-wider">Live Feed</span>
                </div>
              </div>

              <h3 className="font-mono text-[#0070F3] text-sm mb-3 uppercase tracking-widest" style={{ color: activeNode?.color }}>{activeNode?.role}</h3>
              <h1 className="text-6xl font-sans font-bold text-white mb-10 leading-[0.9] tracking-tight">{activeNode?.title || activeNode?.id}</h1>

              <div className="mb-10 border-y border-gray-800 py-8 bg-black/40 -mx-12 px-12">
                <p className="text-[10px] font-mono text-gray-500 mb-3 uppercase flex justify-between">
                  <span>// INCOMING SIGNAL</span>
                  <span>{new Date().toLocaleTimeString()}</span>
                </p>
                <p className="text-md font-mono text-[#00FF94] h-12 leading-relaxed">{currentTrend}<span className="animate-pulse text-white">_</span></p>
              </div>

              <p className="text-xl text-gray-300 font-sans leading-relaxed mb-10 max-w-2xl">{activeNode?.desc}</p>

              {activeNode?.id === "JONATHAN" && (
                 <button 
                   onClick={() => document.getElementById('content-start')?.scrollIntoView({behavior:'smooth'})}
                   className="w-full border border-white/20 bg-white/5 px-8 py-5 text-sm font-mono text-white hover:bg-white hover:text-black transition-all"
                 >
                   INITIATE SEQUENCE &darr;
                 </button>
              )}
           </div>
        </div>
      </div>

      {/* RIGHT BRAIN (Canvas) */}
      <ForceGraph2D
        ref={fgRef}
        width={dimensions.w}
        height={dimensions.h}
        graphData={initialData}
        backgroundColor="#050505"
        
        // Interaction Handlers
        onNodeClick={handleInteraction}
        onNodeDrag={() => setIsAutoPilot(false)}
        onBackgroundClick={() => setIsAutoPilot(false)}

        // Physics Settings
        cooldownTicks={100}
        d3AlphaDecay={0.01} 
        d3VelocityDecay={0.3}

        // Visuals
        nodeRelSize={8}
        linkColor={() => "#ffffff15"}
        linkWidth={1.5}
        linkDirectionalParticles={2}
        linkDirectionalParticleSpeed={0.005}
        
        // Node Renderer
        nodeCanvasObject={(node, ctx, globalScale) => {
          if (!Number.isFinite(node.x) || !Number.isFinite(node.y)) return;

          const isTarget = node.id === activeNode?.id;
          const isCore = node.group === 1;
          const color = (node.color as string) || "#fff";
          
          const pulse = Math.sin(Date.now() / 800) * 3; 
          const baseRadius = isCore ? 15 : 6;
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

          // Only show labels for non-active nodes (Active is on the card)
          if (!isTarget && (isCore || node.group === 2)) {
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