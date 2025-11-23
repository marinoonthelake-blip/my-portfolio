"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import ForceGraph2D, { ForceGraphMethods } from "react-force-graph-2d";

// 1. THE BRAIN DATA (Neurons)
const initialData = {
  nodes: [
    // THE CORE (Left Brain - Logic)
    { id: "JONATHAN", group: 1, val: 30, color: "#FFFFFF" },
    { id: "Engineering", group: 2, val: 15, color: "#0070F3" }, // Blue
    { id: "Architecture", group: 2, val: 15, color: "#0070F3" },
    
    // THE SPARK (Right Brain - Creative)
    { id: "Motion", group: 2, val: 15, color: "#FF0055" },      // Pink
    { id: "Vision", group: 2, val: 15, color: "#FF0055" },

    // SYNAPSES (Skills)
    { id: "Next.js", group: 3, val: 5, color: "#444" },
    { id: "React", group: 3, val: 5, color: "#444" },
    { id: "TypeScript", group: 3, val: 5, color: "#444" },
    { id: "WebGL", group: 3, val: 5, color: "#FF0055" },
    { id: "GSAP", group: 3, val: 5, color: "#FF0055" },
    { id: "Generative AI", group: 3, val: 8, color: "#00FF94" }, // Green
    { id: "LLMs", group: 3, val: 5, color: "#00FF94" },
    { id: "Operations", group: 4, val: 10, color: "#0070F3" },
  ],
  links: [
    { source: "JONATHAN", target: "Engineering" },
    { source: "JONATHAN", target: "Motion" },
    { source: "JONATHAN", target: "Vision" },
    { source: "JONATHAN", target: "Architecture" },
    { source: "Engineering", target: "Next.js" },
    { source: "Engineering", target: "React" },
    { source: "Engineering", target: "TypeScript" },
    { source: "Architecture", target: "Operations" },
    { source: "Motion", target: "GSAP" },
    { source: "Motion", target: "WebGL" },
    { source: "Vision", target: "Generative AI" },
    { source: "Generative AI", target: "LLMs" },
    // Cross-Connections (Morphing Pathways)
    { source: "React", target: "GSAP" },
    { source: "WebGL", target: "React" },
  ]
};

export default function TechConstellation() {
  const fgRef = useRef<ForceGraphMethods | null>(null);
  const [dimensions, setDimensions] = useState({ w: 800, h: 600 });
  const [isClient, setIsClient] = useState(false);

  // Hydration fix
  useEffect(() => setIsClient(true), []);

  // Resize Handler
  useEffect(() => {
    if (typeof window !== "undefined") {
      setDimensions({ w: window.innerWidth, h: 600 });
      const handleResize = () => setDimensions({ w: window.innerWidth, h: 600 });
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  // THE BREATHING ALGORITHM (Morphing Logic)
  useEffect(() => {
    if (!fgRef.current) return;

    // A heartbeat that expands and contracts the graph
    const breathe = setInterval(() => {
      const graph = fgRef.current;
      if (!graph) return;

      // Randomly shift the center of gravity to create a "drifting thought" effect
      graph.d3Force('center')?.strength(0.05);
      
      // Pulse the charge (Expansion/Contraction)
      const currentCharge = graph.d3Force('charge')?.strength();
      const newCharge = (currentCharge as number) < -100 ? -50 : -200; // Oscillate
      
      // Smoothly animate the physics change
      graph.d3Force('charge')?.strength(newCharge);
      
      // Re-heat the simulation so it moves
      graph.d3ReheatSimulation();
    }, 3000); // Every 3 seconds

    return () => clearInterval(breathe);
  }, []);

  if (!isClient) return null;

  return (
    <div className="w-full h-[600px] border-y border-gray-800 bg-[#050505] relative overflow-hidden">
      
      {/* Title Overlay */}
      <div className="absolute top-6 left-6 z-10 pointer-events-none select-none">
        <h3 className="text-[#00FF94] font-mono text-xs mb-1 animate-pulse">LIVE SYSTEM</h3>
        <h2 className="text-white font-sans font-bold text-2xl">Neural Competency Map</h2>
      </div>

      <ForceGraph2D
        ref={fgRef}
        width={dimensions.w}
        height={dimensions.h}
        graphData={initialData}
        backgroundColor="#050505"
        
        // PHYSICS SETTINGS
        cooldownTicks={100} 
        d3AlphaDecay={0.01} // Low decay = keeps moving longer (floaty)
        d3VelocityDecay={0.3} // Low friction = slippery movement

        // RENDERING: GLOWING NEURONS
        nodeCanvasObject={(node, ctx, globalScale) => {
          const label = node.id as string;
          const fontSize = 12 / globalScale;
          const radius = Math.max(node.val as number / 2, 2);

          // 1. Draw "Glow" Ring
          ctx.beginPath();
          ctx.arc(node.x!, node.y!, radius * 2, 0, 2 * Math.PI, false);
          ctx.fillStyle = (node.color as string) + '11'; // 10% opacity
          ctx.fill();

          // 2. Draw Core Node
          ctx.beginPath();
          ctx.arc(node.x!, node.y!, radius, 0, 2 * Math.PI, false);
          ctx.fillStyle = node.color as string;
          ctx.fill();

          // 3. Draw Label
          ctx.font = `${fontSize}px monospace`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = 'rgba(255,255,255,0.7)';
          // Only show label if node is big enough or hovered (optional logic)
          if (node.val && (node.val as number) > 5) {
             ctx.fillText(label, node.x!, node.y! + radius + fontSize);
          }
        }}

        // RENDERING: SYNAPTIC LINKS
        linkColor={() => "#ffffff20"} // Faint white lines
        linkWidth={1}
        linkDirectionalParticles={2} // Particles moving along the lines
        linkDirectionalParticleWidth={2}
        linkDirectionalParticleSpeed={0.005} // Slow flow of data
        linkDirectionalParticleColor={() => "#0070F3"} // Blue data packets
      />
    </div>
  );
}