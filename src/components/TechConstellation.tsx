"use client";

import { useEffect, useRef, useState } from "react";
import ForceGraph2D from "react-force-graph-2d";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

// DATA: The Neural Network of your Career
const graphData = {
  nodes: [
    // Core Nucleus
    { id: "JONATHAN", group: 1, val: 20, color: "#FFFFFF" },
    
    // Primary Orbits
    { id: "Creative Tech", group: 2, val: 10, color: "#0070F3" },
    { id: "AI Engineering", group: 2, val: 10, color: "#0070F3" },
    { id: "Operations", group: 2, val: 10, color: "#0070F3" },

    // Leaf Nodes (Skills)
    { id: "Next.js", group: 3, val: 5, color: "#444" },
    { id: "React", group: 3, val: 5, color: "#444" },
    { id: "GSAP", group: 3, val: 5, color: "#444" },
    { id: "WebGL", group: 3, val: 5, color: "#444" },
    { id: "Gemini API", group: 3, val: 5, color: "#00FF94" },
    { id: "Python", group: 3, val: 5, color: "#00FF94" },
    { id: "Team Leadership", group: 3, val: 5, color: "#FF0055" },
    { id: "Strategy", group: 3, val: 5, color: "#FF0055" },
  ],
  links: [
    { source: "JONATHAN", target: "Creative Tech" },
    { source: "JONATHAN", target: "AI Engineering" },
    { source: "JONATHAN", target: "Operations" },
    { source: "Creative Tech", target: "Next.js" },
    { source: "Creative Tech", target: "React" },
    { source: "Creative Tech", target: "GSAP" },
    { source: "Creative Tech", target: "WebGL" },
    { source: "AI Engineering", target: "Gemini API" },
    { source: "AI Engineering", target: "Python" },
    { source: "Operations", target: "Team Leadership" },
    { source: "Operations", target: "Strategy" },
    // Cross-pollination links (The Polymath Flex)
    { source: "React", target: "Gemini API" }, 
  ]
};

export default function TechConstellation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ w: 800, h: 600 });

  // 1. Responsive Resize Handler
  useEffect(() => {
    if (typeof window !== "undefined") {
      setDimensions({ w: window.innerWidth, h: 600 });
      
      const handleResize = () => {
        setDimensions({ w: window.innerWidth, h: 600 });
      };
      
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  return (
    <div ref={containerRef} className="w-full h-[600px] border-y border-gray-800 bg-[#050505] relative overflow-hidden group">
      
      {/* Overlay Title */}
      <div className="absolute top-6 left-6 z-10 pointer-events-none">
        <h3 className="text-[#0070F3] font-mono text-xs mb-1">DATA VISUALIZATION</h3>
        <h2 className="text-white font-sans font-bold text-2xl">Neural Competency Map</h2>
        <p className="text-gray-500 text-sm mt-2 max-w-xs">
          Interactive force-directed graph representing cross-disciplinary technical skills. Drag nodes to rearrange.
        </p>
      </div>

      <ForceGraph2D
        width={dimensions.w}
        height={dimensions.h}
        graphData={graphData}
        backgroundColor="#050505"
        nodeLabel="id"
        nodeRelSize={6}
        // Physics Engine Config
        cooldownTicks={100}
        onEngineStop={() => console.log("Physics settled")}
        
        // Visual Styling
        linkColor={() => "#222"}
        nodeCanvasObject={(node, ctx, globalScale) => {
          const label = node.id as string;
          const fontSize = 12/globalScale;
          ctx.font = `${fontSize}px Sans-Serif`;
          const textWidth = ctx.measureText(label).width;
          const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2);

          // Draw Node Circle
          ctx.beginPath();
          ctx.arc(node.x!, node.y!, 4, 0, 2 * Math.PI, false);
          ctx.fillStyle = node.color as string;
          ctx.fill();

          // Draw Label
          ctx.fillStyle = 'rgba(5, 5, 5, 0.8)';
          ctx.fillRect(node.x! - bckgDimensions[0] / 2, node.y! - bckgDimensions[1] - 4, bckgDimensions[0], bckgDimensions[1]);
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = node.color as string;
          ctx.fillText(label, node.x!, node.y! - (fontSize * 0.8) - 4);
        }}
      />
    </div>
  );
}