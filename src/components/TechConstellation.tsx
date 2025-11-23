"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import ForceGraph2D, { ForceGraphMethods } from "react-force-graph-2d";
import gsap from "gsap";

// 1. DATA: Nodes now have "narrative" fields for the tour
const initialData = {
  nodes: [
    // CORE
    { 
      id: "JONATHAN", group: 1, val: 40, color: "#FFFFFF",
      desc: "The central node. Architecting the intersection of Policy, Code, and Design." 
    },
    
    // PILLARS (Tour Stops)
    { 
      id: "Strategy", group: 2, val: 20, color: "#0070F3", // Blue
      desc: "Solving systemic inefficiencies. From global vendor ops to geopolitical mapping." 
    },
    { 
      id: "Engineering", group: 2, val: 20, color: "#00FF94", // Green
      desc: "Building the impossible. Full-stack architecture, GenAI tooling, and cloud scale." 
    },
    { 
      id: "Creative", group: 2, val: 20, color: "#FF0055", // Pink
      desc: "Visualizing the complex. High-fidelity motion, 3D storytelling, and user empathy." 
    },

    // SATELLITES
    { id: "Policy", group: 3, val: 8, color: "#0070F3" },
    { id: "Global Ops", group: 3, val: 8, color: "#0070F3" },
    { id: "Trust & Safety", group: 3, val: 8, color: "#0070F3" },
    { id: "Next.js", group: 3, val: 8, color: "#00FF94" },
    { id: "Gemini API", group: 3, val: 12, color: "#00FF94" },
    { id: "WebGL", group: 3, val: 8, color: "#FF0055" },
    { id: "GSAP", group: 3, val: 8, color: "#FF0055" },
  ],
  links: [
    { source: "JONATHAN", target: "Strategy" },
    { source: "JONATHAN", target: "Engineering" },
    { source: "JONATHAN", target: "Creative" },
    { source: "Strategy", target: "Policy" },
    { source: "Strategy", target: "Global Ops" },
    { source: "Engineering", target: "Next.js" },
    { source: "Engineering", target: "Gemini API" },
    { source: "Creative", target: "WebGL" },
    { source: "Creative", target: "GSAP" },
    // Cross-links
    { source: "Gemini API", target: "Policy" },
    { source: "WebGL", target: "Engineering" }
  ]
};

// The sequence of nodes to visit automatically
const TOUR_STEPS = ["JONATHAN", "Strategy", "Engineering", "Creative"];

export default function TechConstellation() {
  const fgRef = useRef<ForceGraphMethods | undefined>(undefined);
  const [dimensions, setDimensions] = useState({ w: 800, h: 800 });
  const [isClient, setIsClient] = useState(false);
  
  // State for the Tour
  const [tourIndex, setTourIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [activeNode, setActiveNode] = useState<any>(null);

  useEffect(() => setIsClient(true), []);

  // Resize Handler
  useEffect(() => {
    if (typeof window !== "undefined") {
      setDimensions({ w: window.innerWidth, h: window.innerHeight * 0.9 }); // 90% of screen height
      const handleResize = () => setDimensions({ w: window.innerWidth, h: window.innerHeight * 0.9 });
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  // --- THE CINEMATIC TOUR ENGINE ---
  useEffect(() => {
    if (!isAutoPlaying || !fgRef.current) return;

    const targetId = TOUR_STEPS[tourIndex];
    const node = initialData.nodes.find(n => n.id === targetId);

    if (node) {
      // 1. Fly Camera to Node
      fgRef.current.centerAt(node.x as number + 20, node.y as number, 2000); // Offset x for text panel
      fgRef.current.zoom(2.5, 2000);
      
      // 2. Set Active Data (for the panel)
      setActiveNode(node);

      // 3. Schedule Next Step
      const timer = setTimeout(() => {
        setTourIndex((prev) => (prev + 1) % TOUR_STEPS.length);
      }, 5000); // Stay for 5 seconds

      return () => clearTimeout(timer);
    }
  }, [tourIndex, isAutoPlaying]);

  // --- INTERACTION HANDLERS ---
  const handleNodeClick = useCallback((node: any) => {
    // STOP the auto-pilot immediately
    setIsAutoPlaying(false);
    
    // Manual "Explosion" Zoom
    fgRef.current?.centerAt(node.x, node.y, 1000);
    fgRef.current?.zoom(3, 1000);
    setActiveNode(node);
  }, []);

  const handleBackgroundClick = useCallback(() => {
    setIsAutoPlaying(false);
    setActiveNode(null);
    fgRef.current?.zoom(1, 1000); // Reset zoom
  }, []);

  if (!isClient) return null;

  return (
    <div className="relative w-full border-y border-gray-800 bg-[#050505] overflow-hidden group">
      
      {/* --- THE HEADS-UP DISPLAY (HUD) --- */}
      <div className={`absolute top-20 left-10 z-20 pointer-events-none transition-opacity duration-500 ${activeNode ? 'opacity-100' : 'opacity-0'}`}>
        <div className="bg-black/80 backdrop-blur-md border border-gray-700 p-6 max-w-md shadow-[0_0_30px_rgba(0,112,243,0.3)] border-l-4"
             style={{ borderLeftColor: activeNode?.color || '#fff' }}>
          <h3 className="text-xs font-mono text-gray-400 mb-2 uppercase tracking-widest">
            System Node Detected
          </h3>
          <h2 className="text-3xl font-sans font-bold text-white mb-4" style={{ color: activeNode?.color }}>
            {activeNode?.id}
          </h2>
          <p className="text-lg text-gray-200 leading-relaxed font-sans">
            {activeNode?.desc || "Operational competency node."}
          </p>
          
          {/* Animated Terminal Cursor */}
          <div className="mt-4 flex gap-2">
             <span className="w-2 h-4 bg-blue-500 animate-pulse"/>
          </div>
        </div>
      </div>

      {/* --- CONTROL HINT --- */}
      <div className="absolute bottom-10 right-10 z-20 text-right">
        <div className={`transition-all duration-500 ${isAutoPlaying ? 'opacity-100' : 'opacity-0 translate-y-10'}`}>
           <p className="text-xs font-mono text-[#00FF94] animate-pulse">AUTO-PILOT ENGAGED</p>
           <p className="text-gray-500 text-xs">Click any node to override</p>
        </div>
        {!isAutoPlaying && (
           <button 
             onClick={() => { setIsAutoPlaying(true); setTourIndex(0); }}
             className="text-xs font-mono text-[#0070F3] border border-[#0070F3] px-3 py-1 hover:bg-[#0070F3] hover:text-white transition-colors"
           >
             RESUME TOUR
           </button>
        )}
      </div>

      <ForceGraph2D
        ref={fgRef}
        width={dimensions.w}
        height={dimensions.h}
        graphData={initialData}
        backgroundColor="#050505"
        
        // Interaction
        onNodeClick={handleNodeClick}
        onBackgroundClick={handleBackgroundClick}
        onNodeDragEnd={() => setIsAutoPlaying(false)} // Stop tour if user drags

        // Physics
        cooldownTicks={100}
        d3AlphaDecay={0.02}
        d3VelocityDecay={0.3}

        // VISUALS
        nodeRelSize={6}
        linkColor={() => "#ffffff20"}
        linkDirectionalParticles={2}
        linkDirectionalParticleSpeed={0.005}
        
        // Custom Glowing Node Renderer
        nodeCanvasObject={(node, ctx, globalScale) => {
          const label = node.id as string;
          const fontSize = 14 / globalScale;
          const isTarget = node.id === activeNode?.id;
          const baseRadius = Math.max((node.val as number) / 2, 2);
          
          // "Explode" size if active
          const radius = isTarget ? baseRadius * 1.5 : baseRadius;

          // 1. Glow Ring
          ctx.beginPath();
          ctx.arc(node.x!, node.y!, radius * 2.5, 0, 2 * Math.PI, false);
          ctx.fillStyle = (node.color as string) + (isTarget ? '33' : '11'); 
          ctx.fill();

          // 2. Core
          ctx.beginPath();
          ctx.arc(node.x!, node.y!, radius, 0, 2 * Math.PI, false);
          ctx.fillStyle = node.color as string;
          ctx.fill();

          // 3. Label (Always show for main nodes, show others on hover/active)
          if ((node.val as number) > 10 || isTarget) {
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