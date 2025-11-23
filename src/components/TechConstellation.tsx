"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import ForceGraph2D, { ForceGraphMethods } from "react-force-graph-2d";

// 1. DATA: Executive Strategy Nodes
const initialData = {
  nodes: [
    // CORE
    { 
      id: "JONATHAN", group: 1, val: 60, color: "#FFFFFF",
      title: "JONATHAN W. MARINO",
      role: "Strategic Technology Executive",
      desc: "The central node. Architecting the intersection of Policy, Code, and Design." 
    },
    
    // STRATEGIC PILLARS
    { 
      id: "Strategy", group: 2, val: 25, color: "#0070F3", 
      title: "STRATEGIC RISK",
      role: "Geopolitical & Technical",
      desc: "Mitigating enterprise risk by bridging the gap between policy mandates and code enforcement." 
    },
    { 
      id: "Engineering", group: 2, val: 25, color: "#00FF94", 
      title: "ENGINEERING VELOCITY",
      role: "Full-Stack & GenAI",
      desc: "Deploying AI agents (SlideSense) to automate workflows and reclaim $300k+ in executive hours." 
    },
    { 
      id: "Creative", group: 2, val: 25, color: "#FF0055", 
      title: "CREATIVE INTELLIGENCE",
      role: "High-Fidelity Motion",
      desc: "Translating abstract strategy into visceral 3D narratives that win stakeholder buy-in." 
    },

    // TACTICAL ORBIT
    { id: "Global Ops", group: 3, val: 10, color: "#0070F3" },
    { id: "Governance", group: 3, val: 10, color: "#0070F3" },
    { id: "Next.js 15", group: 3, val: 10, color: "#00FF94" },
    { id: "Gemini API", group: 3, val: 15, color: "#00FF94" },
    { id: "WebGL", group: 3, val: 10, color: "#FF0055" },
    { id: "GSAP", group: 3, val: 10, color: "#FF0055" },
  ],
  links: [
    { source: "JONATHAN", target: "Strategy" },
    { source: "JONATHAN", target: "Engineering" },
    { source: "JONATHAN", target: "Creative" },
    { source: "Strategy", target: "Global Ops" },
    { source: "Strategy", target: "Governance" },
    { source: "Engineering", target: "Next.js 15" },
    { source: "Engineering", target: "Gemini API" },
    { source: "Creative", target: "WebGL" },
    { source: "Creative", target: "GSAP" },
    { source: "Gemini API", target: "Governance" }, 
  ]
};

const TOUR_STEPS = ["JONATHAN", "Strategy", "Engineering", "Creative"];

export default function TechConstellation() {
  const fgRef = useRef<ForceGraphMethods | undefined>(undefined);
  const [dimensions, setDimensions] = useState({ w: 1000, h: 800 });
  const [activeNode, setActiveNode] = useState<any>(initialData.nodes[0]); // Start with Core
  const [tourIndex, setTourIndex] = useState(0);
  const [isAutoPilot, setIsAutoPilot] = useState(true);
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

  // PHYSICS: Shift Center of Gravity to the RIGHT
  useEffect(() => {
    if (fgRef.current) {
        const graph = fgRef.current;
        graph.d3Force('charge')?.strength(-150);
        // Shift center X force to positive (Right side)
        graph.d3Force('center')?.x(200); 
    }
  }, [isClient]);

  // AUTO-PILOT
  useEffect(() => {
    if (!isAutoPilot || !fgRef.current) return;

    const targetId = TOUR_STEPS[tourIndex];
    
    // Safe cast to access internal graph data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const liveNodes = (fgRef.current as any).graphData().nodes;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const node = liveNodes.find((n: any) => n.id === targetId);

    if (node && node.x) {
      // Panning Logic: Center camera to LEFT of node to push node RIGHT
      fgRef.current.centerAt(node.x - 150, node.y, 2000);
      fgRef.current.zoom(2.5, 2000);
      setActiveNode(node);

      const timer = setTimeout(() => {
        setTourIndex((prev) => (prev + 1) % TOUR_STEPS.length);
      }, 6000); 

      return () => clearTimeout(timer);
    } 
  }, [tourIndex, isAutoPilot]);

  const handleInteraction = useCallback((node: any) => {
    setIsAutoPilot(false);
    setActiveNode(node);
    fgRef.current?.centerAt(node.x - 100, node.y, 1000); 
    fgRef.current?.zoom(3, 1000);
  }, []);

  if (!isClient) return null;

  return (
    <div className="fixed inset-0 bg-[#050505] overflow-hidden">
      
      {/* --- LEFT COLUMN: THE ACTIVE CARD --- */}
      <div className="absolute left-0 top-0 h-full w-full md:w-1/2 flex items-center justify-center p-8 z-20 pointer-events-none">
        
        <div className={`pointer-events-auto transition-all duration-700 transform ${activeNode ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
           
           {/* Glassmorphism Card */}
           <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-10 rounded-none shadow-2xl max-w-xl relative overflow-hidden group">
              
              <div className="absolute top-0 left-0 w-1 h-full transition-colors duration-500" 
                   style={{ backgroundColor: activeNode?.color || '#fff' }} />
              
              <h3 className="font-mono text-sm mb-4 tracking-[0.2em] uppercase" 
                  style={{ color: activeNode?.color }}>
                {activeNode?.role || "System Node"}
              </h3>

              <h1 className="text-5xl md:text-6xl font-sans font-bold text-white mb-6 leading-[0.9]">
                {activeNode?.title || activeNode?.id}
              </h1>

              <p className="text-lg text-gray-300 font-sans leading-relaxed">
                {activeNode?.desc || "Operational competency node detected."}
              </p>

              {activeNode?.id === "JONATHAN" && (
                 <button 
                   onClick={() => document.getElementById('content-start')?.scrollIntoView({behavior:'smooth'})}
                   className="mt-8 rounded-full border border-white/20 bg-white/5 px-8 py-3 text-xs font-mono text-white hover:bg-white hover:text-black transition-all"
                 >
                   INITIATE SEQUENCE &darr;
                 </button>
              )}
           </div>
        </div>
      </div>

      {/* --- RIGHT COLUMN: THE BRAIN --- */}
      <ForceGraph2D
        ref={fgRef}
        width={dimensions.w}
        height={dimensions.h}
        graphData={initialData}
        backgroundColor="#050505"
        
        onNodeClick={handleInteraction}
        onNodeDrag={() => setIsAutoPilot(false)}
        onBackgroundClick={() => setIsAutoPilot(false)}

        cooldownTicks={100}
        d3AlphaDecay={0.02}
        d3VelocityDecay={0.3}

        nodeRelSize={8}
        linkColor={() => "#ffffff15"}
        linkWidth={1.5}
        linkDirectionalParticles={2}
        linkDirectionalParticleSpeed={0.005}
        
        // HOLOGRAPHIC NODE RENDERER (With Crash Fix)
        nodeCanvasObject={(node, ctx, globalScale) => {
          // CRITICAL FIX: Check for valid coordinates before drawing
          if (!Number.isFinite(node.x) || !Number.isFinite(node.y)) return;

          const isTarget = node.id === activeNode?.id;
          const isCore = node.group === 1;
          const color = (node.color as string) || "#fff";
          
          const pulse = Math.sin(Date.now() / 800) * 3; 
          const baseRadius = isCore ? 15 : 6;
          const radius = isTarget ? (baseRadius * 1.5) + pulse : baseRadius;

          // 1. Gradient Glow
          const gradient = ctx.createRadialGradient(node.x!, node.y!, 0, node.x!, node.y!, radius * 3);
          gradient.addColorStop(0, color);
          gradient.addColorStop(0.4, color + '44');
          gradient.addColorStop(1, 'transparent');

          ctx.beginPath();
          ctx.arc(node.x!, node.y!, radius * 3, 0, 2 * Math.PI, false);
          ctx.fillStyle = gradient;
          ctx.fill();

          // 2. Solid Core
          ctx.beginPath();
          ctx.arc(node.x!, node.y!, radius * 0.6, 0, 2 * Math.PI, false);
          ctx.fillStyle = "#000";
          ctx.fill();
          ctx.strokeStyle = color;
          ctx.lineWidth = 2;
          ctx.stroke();

          // 3. Label (Only for non-active nodes)
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