"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import ForceGraph2D, { ForceGraphMethods } from "react-force-graph-2d";

// 1. DATA: The Brain now focuses on BENEFITS
const initialData = {
  nodes: [
    // CORE
    { id: "JONATHAN", group: 1, val: 30, color: "#FFFFFF" },
    
    // KEY BENEFITS (The "Thoughts")
    { id: "Risk Reduction", group: 2, val: 15, color: "#00FF94", desc: "Mitigating geopolitical and technical debt." },
    { id: "Speed to Market", group: 2, val: 15, color: "#0070F3", desc: "Accelerating deployment via AI ops." },
    { id: "Innovation", group: 2, val: 15, color: "#FF0055", desc: "Pioneering GenAI and WebGL formats." },

    // SUPPORTING NODES
    { id: "Security", group: 3, val: 8, color: "#444" },
    { id: "Scale", group: 3, val: 8, color: "#444" },
    { id: "Compliance", group: 3, val: 8, color: "#444" },
    { id: "UX", group: 3, val: 8, color: "#444" },
    { id: "Architecture", group: 3, val: 8, color: "#444" },
  ],
  links: [
    { source: "JONATHAN", target: "Risk Reduction" },
    { source: "JONATHAN", target: "Speed to Market" },
    { source: "JONATHAN", target: "Innovation" },
    { source: "Risk Reduction", target: "Security" },
    { source: "Risk Reduction", target: "Compliance" },
    { source: "Speed to Market", target: "Scale" },
    { source: "Speed to Market", target: "Architecture" },
    { source: "Innovation", target: "UX" },
    { source: "Security", target: "Compliance" }, // Cross-link
  ]
};

const TOUR_STEPS = ["Risk Reduction", "Speed to Market", "Innovation"];

export default function TechConstellation() {
  const fgRef = useRef<ForceGraphMethods | undefined>(undefined);
  const [dimensions, setDimensions] = useState({ w: 600, h: 600 }); // Default square for right col
  const [isClient, setIsClient] = useState(false);
  const [activeNode, setActiveNode] = useState<any>(null);
  const [tourIndex, setTourIndex] = useState(0);

  useEffect(() => setIsClient(true), []);

  // Responsive Sizing (Fits parent container)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const updateSize = () => {
        // Grab the width of the column we live in
        const container = document.getElementById("brain-container");
        if (container) {
          setDimensions({ w: container.clientWidth, h: 500 });
        }
      };
      
      window.addEventListener("resize", updateSize);
      updateSize(); // Init
      return () => window.removeEventListener("resize", updateSize);
    }
  }, []);

  // Auto-Pilot: Cycle through Benefits
  useEffect(() => {
    if (!fgRef.current) return;

    const targetId = TOUR_STEPS[tourIndex];
    const node = initialData.nodes.find(n => n.id === targetId) as any;

    if (node && node.x !== undefined) {
      // Gentle focus
      fgRef.current.centerAt(node.x, node.y, 2000);
      fgRef.current.zoom(3, 2000);
      setActiveNode(node);

      const timer = setTimeout(() => {
        setTourIndex((prev) => (prev + 1) % TOUR_STEPS.length);
      }, 4000); // Change every 4s

      return () => clearTimeout(timer);
    }
  }, [tourIndex]);

  if (!isClient) return null;

  return (
    <div id="brain-container" className="relative w-full h-[500px] flex items-center justify-center">
      
      {/* THE "THOUGHT" BUBBLE */}
      <div className={`absolute bottom-4 left-4 right-4 z-20 transition-opacity duration-500 ${activeNode ? 'opacity-100' : 'opacity-0'}`}>
        <div className="bg-black/90 backdrop-blur border border-gray-800 p-4 rounded-lg border-l-4"
             style={{ borderLeftColor: activeNode?.color || '#fff' }}>
          <h3 className="text-sm font-bold text-white mb-1 uppercase tracking-widest">
            {activeNode?.id}
          </h3>
          <p className="text-xs text-gray-400 font-mono">
            {activeNode?.desc}
          </p>
        </div>
      </div>

      <ForceGraph2D
        ref={fgRef}
        width={dimensions.w}
        height={dimensions.h}
        graphData={initialData}
        backgroundColor="rgba(0,0,0,0)" // Transparent background
        
        // Physics - "Breathing" feel
        cooldownTicks={100}
        d3AlphaDecay={0.01} 
        d3VelocityDecay={0.4} 

        // Visuals
        nodeRelSize={6}
        linkColor={() => "#ffffff15"} // Subtle links
        linkDirectionalParticles={2}
        linkDirectionalParticleSpeed={0.005}
        
        nodeCanvasObject={(node, ctx, globalScale) => {
          const label = node.id as string;
          const fontSize = 12 / globalScale;
          const isTarget = node.id === activeNode?.id;
          const baseRadius = 4;
          
          ctx.beginPath();
          ctx.arc(node.x!, node.y!, isTarget ? 12 : 4, 0, 2 * Math.PI, false);
          ctx.fillStyle = isTarget ? node.color as string : '#333';
          ctx.fill();
          
          // Glow for active node
          if (isTarget) {
             ctx.beginPath();
             ctx.arc(node.x!, node.y!, 20, 0, 2 * Math.PI, false);
             ctx.fillStyle = (node.color as string) + '33';
             ctx.fill();
          }
        }}
      />
    </div>
  );
}