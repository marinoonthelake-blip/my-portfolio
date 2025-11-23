"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import ForceGraph2D, { ForceGraphMethods } from "react-force-graph-2d";

// 1. DATA: The Core Node is now your full Hero Identity
const initialData = {
  nodes: [
    // CORE (Your Name)
    { 
      id: "JONATHAN", group: 1, val: 80, color: "#FFFFFF", 
      label: "JONATHAN WILLIAM MARINO",
      sub: "Strategic Technology Executive"
    },
    
    // PILLARS (The Story)
    { id: "Strategy", group: 2, val: 30, color: "#0070F3", desc: "Geopolitical Risk & Tech Policy" },
    { id: "Engineering", group: 2, val: 30, color: "#00FF94", desc: "Full-Stack Architecture & GenAI" },
    { id: "Creative", group: 2, val: 30, color: "#FF0055", desc: "High-Fidelity Motion Storytelling" },

    // ORBIT
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

const TOUR_STEPS = ["JONATHAN", "Strategy", "Engineering", "Creative"];

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

  // PHYSICS SETUP
  useEffect(() => {
    if (fgRef.current) {
        const graph = fgRef.current;
        // Strong repulsion to spread them out
        graph.d3Force('charge')?.strength(-300);
        graph.d3Force('link')?.distance(100);
    }
  }, [isClient]);

  // THE TOUR LOGIC
  useEffect(() => {
    if (!isAutoPilot || !fgRef.current) return;

    const targetId = TOUR_STEPS[tourIndex];
    const node = initialData.nodes.find(n => n.id === targetId) as any;

    if (node && typeof node.x === 'number') {
      // Zoom logic depends on if it's the Core or a Satellite
      const isCore = node.group === 1;
      const zoomLevel = isCore ? 1.5 : 3.5; // Zoom closer for small nodes, back for the big core
      
      fgRef.current.centerAt(node.x, node.y, 2500);
      fgRef.current.zoom(zoomLevel, 2500);
      
      // "Open" the node (triggering expansion in the renderer)
      setActiveNode(node);

      const timer = setTimeout(() => {
        setActiveNode(null); // "Close" node
        setTimeout(() => {
          setTourIndex((prev) => (prev + 1) % TOUR_STEPS.length);
        }, 1000);
      }, 6000); // Stay for 6s

      return () => clearTimeout(timer);
    } 
  }, [tourIndex, isAutoPilot]);

  const handleInteraction = useCallback((node: any) => {
    setIsAutoPilot(false);
    setActiveNode(node);
    fgRef.current?.centerAt(node.x, node.y, 1000);
    fgRef.current?.zoom(3, 1000);
  }, []);

  if (!isClient) return null;

  return (
    <div className="absolute inset-0 z-0 bg-[#050505]">
      
      {/* MANUAL OVERRIDE INDICATOR */}
      {!isAutoPilot && (
        <div className="absolute top-10 right-10 z-20">
           <button 
             onClick={() => setIsAutoPilot(true)}
             className="text-xs font-mono text-[#0070F3] border border-[#0070F3] px-4 py-2 hover:bg-[#0070F3] hover:text-white transition-colors"
           >
             RE-ENGAGE AUTO-PILOT
           </button>
        </div>
      )}

      <ForceGraph2D
        ref={fgRef}
        width={dimensions.w}
        height={dimensions.h}
        graphData={initialData}
        backgroundColor="#050505"
        
        onNodeClick={handleInteraction}
        onNodeDrag={() => setIsAutoPilot(false)}
        onBackgroundClick={() => { setIsAutoPilot(false); setActiveNode(null); }}

        cooldownTicks={100}
        d3AlphaDecay={0.02}
        d3VelocityDecay={0.3}

        nodeRelSize={10}
        linkColor={() => "#ffffff15"}
        linkWidth={1}
        linkDirectionalParticles={2}
        linkDirectionalParticleSpeed={0.005}
        
        nodeCanvasObject={(node, ctx, globalScale) => {
          const isCore = node.group === 1;
          const isTarget = node.id === activeNode?.id;
          
          // THE EXPANSION: If active, radius grows
          const baseRadius = isCore ? 30 : 6;
          const radius = isTarget ? baseRadius * 1.3 : baseRadius;
          
          // Draw Node
          ctx.beginPath();
          ctx.arc(node.x!, node.y!, radius, 0, 2 * Math.PI, false);
          ctx.fillStyle = node.color as string;
          ctx.fill();

          // Glow for active
          if (isTarget) {
            ctx.beginPath();
            ctx.arc(node.x!, node.y!, radius * 1.5, 0, 2 * Math.PI, false);
            ctx.fillStyle = (node.color as string) + '33';
            ctx.fill();
          }

          // TEXT RENDERING
          const label = (node as any).label || node.id;
          const sub = (node as any).sub || (node as any).desc;
          
          // 1. Core Node Text (Always visible, Huge)
          if (isCore) {
             const fontSize = 32 / globalScale; // Scales with zoom
             ctx.font = `bold ${fontSize}px Sans-Serif`;
             ctx.textAlign = 'center';
             ctx.textBaseline = 'middle';
             ctx.fillStyle = '#000'; // Black text inside white core? Or inverted?
             // Let's do White text on Black background? No, Core is White.
             // Black text on White Core
             ctx.fillStyle = '#000';
             ctx.fillText("JW MARINO", node.x!, node.y!);
             
             // Subtitle below core
             ctx.font = `${fontSize * 0.4}px Monospace`;
             ctx.fillStyle = '#0070F3';
             ctx.fillText("STRATEGIC TECH EXEC", node.x!, node.y! + (radius * 0.5));
          } 
          // 2. Other Nodes (Show text when Active or Large)
          else if (isTarget || globalScale > 2) {
             const fontSize = 14 / globalScale;
             ctx.font = `bold ${fontSize}px Sans-Serif`;
             ctx.textAlign = 'center';
             ctx.textBaseline = 'middle';
             ctx.fillStyle = '#FFF';
             ctx.fillText(label as string, node.x!, node.y! + radius + fontSize + 2);
             
             // Description (The "Opening Up" effect)
             if (isTarget && sub) {
                ctx.font = `${fontSize * 0.8}px Monospace`;
                ctx.fillStyle = '#aaa';
                ctx.fillText(sub, node.x!, node.y! + radius + (fontSize * 2.5));
             }
          }
        }}
      />
    </div>
  );
}