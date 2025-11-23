"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import ForceGraph2D, { ForceGraphMethods } from "react-force-graph-2d";

// 1. DATA
const initialData = {
  nodes: [
    { id: "JONATHAN", group: 1, val: 80, color: "#FFFFFF" }, // Core
    
    // Strategic Pillars
    { id: "Strategy", group: 2, val: 30, color: "#0070F3", desc: "Geopolitical Risk & Tech Policy" },
    { id: "Engineering", group: 2, val: 30, color: "#00FF94", desc: "Full-Stack Architecture & GenAI" },
    { id: "Creative", group: 2, val: 30, color: "#FF0055", desc: "High-Fidelity Motion Storytelling" },

    // Orbit
    { id: "Global Ops", group: 3, val: 10, color: "#0070F3" },
    { id: "Compliance", group: 3, val: 10, color: "#0070F3" },
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
    { source: "Strategy", target: "Compliance" },
    { source: "Engineering", target: "Next.js 15" },
    { source: "Engineering", target: "Gemini API" },
    { source: "Creative", target: "WebGL" },
    { source: "Creative", target: "GSAP" },
    { source: "Gemini API", target: "Compliance" }, 
  ]
};

const PATROL_ROUTE = ["Strategy", "Engineering", "Creative"];

export default function TechConstellation() {
  const fgRef = useRef<ForceGraphMethods | undefined>(undefined);
  const [dimensions, setDimensions] = useState({ w: 1000, h: 800 });
  const [activeNode, setActiveNode] = useState<any>(null);
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

  // PHYSICS: Lock Core
  useEffect(() => {
    if (fgRef.current) {
        const graph = fgRef.current;
        graph.d3Force('charge')?.strength(-200);
        graph.d3Force('link')?.distance(120);
        
        // Force start center
        graph.centerAt(0, 0, 0);
        graph.zoom(0.1, 0); // Start zoomed out
        
        // Big Bang Zoom In
        setTimeout(() => {
            graph.zoom(2.5, 2000);
        }, 500);
    }
  }, [isClient]);

  // THE ROBUST TOUR ENGINE
  useEffect(() => {
    if (!isAutoPilot || !fgRef.current) return;

    const graph = fgRef.current;
    const targetId = PATROL_ROUTE[tourIndex];

    // FIX: Get live node data from the engine, not the static list
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const liveNodes = (graph as any).graphData().nodes;
    const node = liveNodes.find((n: any) => n.id === targetId);

    if (node && node.x) {
      // 1. Fly to Node
      graph.centerAt(node.x, node.y, 2000);
      graph.zoom(3.5, 2000);
      setActiveNode(node);

      // 2. Wait, then Move
      const timer = setTimeout(() => {
        setActiveNode(null); // Close HUD
        
        // Brief pullback to center to re-orient
        graph.centerAt(0, 0, 1500);
        graph.zoom(1.5, 1500);

        setTimeout(() => {
          setTourIndex((prev) => (prev + 1) % PATROL_ROUTE.length);
        }, 2000); 
      }, 6000); // Stay for 6s

      return () => clearTimeout(timer);
    }
  }, [tourIndex, isAutoPilot]);

  const handleInteraction = useCallback((node: any) => {
    if (node.id === "JONATHAN") return; 
    setIsAutoPilot(false);
    setActiveNode(node);
    fgRef.current?.centerAt(node.x, node.y, 1000);
    fgRef.current?.zoom(4, 1000);
  }, []);

  if (!isClient) return null;

  return (
    <div className="absolute inset-0 z-0">
      
      {/* DYNAMIC HUD */}
      <div className={`absolute bottom-24 left-0 right-0 flex justify-center pointer-events-none transition-all duration-700 transform ${activeNode ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="bg-black/80 backdrop-blur-md border-t-2 p-6 max-w-md text-center shadow-[0_0_50px_rgba(0,0,0,0.8)] rounded-t-2xl"
             style={{ borderColor: activeNode?.color || '#fff' }}>
          <h2 className="text-xl font-sans font-bold text-white mb-2 uppercase tracking-widest" style={{ color: activeNode?.color }}>
            {activeNode?.id}
          </h2>
          <p className="text-sm text-gray-300 leading-relaxed font-mono">
            {activeNode?.desc}
          </p>
        </div>
      </div>

      <ForceGraph2D
        ref={fgRef}
        width={dimensions.w}
        height={dimensions.h}
        graphData={initialData}
        backgroundColor="#050505"
        onNodeClick={handleInteraction}
        onNodeDrag={() => setIsAutoPilot(false)}
        onBackgroundClick={() => { setIsAutoPilot(false); setActiveNode(null); fgRef.current?.centerAt(0,0,1000); fgRef.current?.zoom(1,1000); }}
        cooldownTicks={100}
        nodeRelSize={10}
        linkColor={() => "#ffffff20"}
        linkWidth={1.5}
        linkDirectionalParticles={2}
        linkDirectionalParticleSpeed={0.005}
        
        nodeCanvasObject={(node, ctx, globalScale) => {
          if (node.id === "JONATHAN") return; // Hide core (Hero text is there)

          const label = node.id as string;
          const fontSize = 12 / globalScale;
          const isTarget = node.id === activeNode?.id;
          
          // Expansion Effect
          const pulse = Math.sin(Date.now() / 200) * 2; // Fast pulse for active
          const baseRadius = 4;
          const radius = isTarget ? (baseRadius * 3) + pulse : baseRadius;
          const color = (node.color as string) || "#fff";

          // Glow
          ctx.beginPath();
          ctx.arc(node.x!, node.y!, radius * 2, 0, 2 * Math.PI, false);
          ctx.fillStyle = isTarget ? color + '66' : color + '11';
          ctx.fill();

          // Core
          ctx.beginPath();
          ctx.arc(node.x!, node.y!, radius, 0, 2 * Math.PI, false);
          ctx.fillStyle = color;
          ctx.fill();

          // Label
          if (isTarget || node.group === 2) {
             ctx.font = `bold ${fontSize}px Sans-Serif`;
             ctx.textAlign = 'center';
             ctx.textBaseline = 'middle';
             ctx.fillStyle = '#FFF';
             ctx.fillText(label, node.x!, node.y! + radius + fontSize + 2);
          }
        }}
      />
    </div>
  );
}