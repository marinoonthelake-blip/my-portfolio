"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import ForceGraph2D, { ForceGraphMethods } from "react-force-graph-2d";

// 1. THE STRATEGIC DATA (Your Neural Network)
const initialData = {
  nodes: [
    // CORE NUCLEUS
    { id: "JONATHAN", group: 1, val: 50, color: "#FFFFFF", 
      title: "The Digital Polymath", 
      desc: "A hybrid executive blending high-fidelity creative direction with rigorous engineering architecture." 
    },
    
    // STRATEGIC ORBIT (The "Why")
    { id: "Risk Mitigation", group: 2, val: 25, color: "#00FF94", 
      title: "Geopolitical & Tech Risk", 
      desc: "De-risking enterprise operations by bridging the gap between policy mandates and code enforcement." 
    },
    { id: "Efficiency", group: 2, val: 25, color: "#0070F3", 
      title: "Operational Velocity", 
      desc: "Deploying AI agents (SlideSense) to reclaim $300k+ in executive hours annually." 
    },
    { id: "Persuasion", group: 2, val: 25, color: "#FF0055", 
      title: "High-Fidelity Storytelling", 
      desc: "Translating abstract strategy into visceral 3D narratives that win stakeholder buy-in." 
    },

    // TACTICAL ORBIT (The "How")
    { id: "Global Ops", group: 3, val: 10, color: "#0070F3", desc: "Scaling vendor ops across APAC/EMEA." },
    { id: "Governance", group: 3, val: 10, color: "#00FF94", desc: "Automated policy enforcement." },
    { id: "GenAI", group: 3, val: 15, color: "#00FF94", desc: "LLM integration for enterprise tools." },
    { id: "WebGL", group: 3, val: 10, color: "#FF0055", desc: "Immersive browser-based experiences." },
    { id: "Accessibility", group: 3, val: 10, color: "#00FF94", desc: "WCAG 2.1 AA Compliance via AI." },
  ],
  links: [
    { source: "JONATHAN", target: "Risk Mitigation" },
    { source: "JONATHAN", target: "Efficiency" },
    { source: "JONATHAN", target: "Persuasion" },
    { source: "Risk Mitigation", target: "Governance" },
    { source: "Risk Mitigation", target: "Global Ops" },
    { source: "Efficiency", target: "GenAI" },
    { source: "Efficiency", target: "Accessibility" },
    { source: "Persuasion", target: "WebGL" },
    { source: "GenAI", target: "Governance" }, // Cross-link
  ]
};

// The Patrol Route (Order of auto-visit)
const PATROL_ROUTE = ["JONATHAN", "Risk Mitigation", "Efficiency", "Persuasion", "GenAI"];

export default function TechConstellation() {
  const fgRef = useRef<ForceGraphMethods | undefined>(undefined);
  const [dimensions, setDimensions] = useState({ w: 1000, h: 800 });
  const [activeNode, setActiveNode] = useState<any>(null);
  const [tourIndex, setTourIndex] = useState(0);
  const [isAutoPilot, setIsAutoPilot] = useState(true);
  const [isClient, setIsClient] = useState(false);

  // Init
  useEffect(() => {
    setIsClient(true);
    if (typeof window !== "undefined") {
      setDimensions({ w: window.innerWidth, h: window.innerHeight });
      const resize = () => setDimensions({ w: window.innerWidth, h: window.innerHeight });
      window.addEventListener("resize", resize);
      return () => window.removeEventListener("resize", resize);
    }
  }, []);

  // --- THE BIG BANG (Intro Zoom) ---
  useEffect(() => {
    if (fgRef.current) {
      // Start far away
      fgRef.current.zoom(0.1, 0);
      // Zoom in dramatically
      setTimeout(() => {
        fgRef.current?.zoom(2.5, 2500);
      }, 500);
    }
  }, [isClient]);

  // --- THE PATROL LOGIC (Auto-Pilot) ---
  useEffect(() => {
    if (!isAutoPilot || !fgRef.current) return;

    const targetId = PATROL_ROUTE[tourIndex];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const node = initialData.nodes.find(n => n.id === targetId) as any;

    if (node && node.x) {
      // Cinematic Pan
      fgRef.current.centerAt(node.x + 15, node.y, 3000); // Offset X to leave room for sidebar
      fgRef.current.zoom(3.5, 3000);
      
      // "Open" the node
      setActiveNode(node);

      // Move to next node after delay
      const timer = setTimeout(() => {
        setActiveNode(null); // Close node briefly
        setTimeout(() => {
          setTourIndex((prev) => (prev + 1) % PATROL_ROUTE.length);
        }, 1000); // Wait for fade out
      }, 6000); // Read time

      return () => clearTimeout(timer);
    }
  }, [tourIndex, isAutoPilot]);

  // --- MANUAL OVERRIDE ---
  const handleInteraction = useCallback(() => {
    setIsAutoPilot(false); // User took control
  }, []);

  const handleNodeClick = useCallback((node: any) => {
    handleInteraction();
    fgRef.current?.centerAt(node.x, node.y, 1000);
    fgRef.current?.zoom(4, 1000);
    setActiveNode(node);
  }, [handleInteraction]);

  if (!isClient) return null;

  return (
    <div className="fixed inset-0 bg-[#050505] overflow-hidden">
      
      {/* --- THE SIDEBAR HUD (Fades In/Out) --- */}
      <div className={`absolute top-0 right-0 h-full w-full md:w-[450px] pointer-events-none flex items-center justify-end p-8 md:p-12 z-20`}>
        <div 
          className={`
            bg-black/80 backdrop-blur-xl border-l border-t border-b border-gray-800 p-8 md:p-12 rounded-l-2xl shadow-2xl 
            transition-all duration-1000 transform 
            ${activeNode ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'}
          `}
          style={{ borderLeftColor: activeNode?.color || '#333', borderWidth: '0 0 0 4px' }}
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: activeNode?.color }} />
            <span className="text-xs font-mono text-gray-500 tracking-[0.2em] uppercase">
              System Node: {activeNode?.group === 1 ? 'CORE' : 'MODULE'}
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-sans font-bold text-white mb-6 leading-tight">
            {activeNode?.title || activeNode?.id}
          </h2>
          
          <p className="text-lg text-gray-300 font-sans leading-relaxed border-l-2 border-gray-800 pl-6">
            {activeNode?.desc}
          </p>

          {/* Decorative Data Stream */}
          <div className="mt-12 font-mono text-[10px] text-gray-700 space-y-1">
            <p>HASH: 0x{Math.random().toString(16).substr(2, 8)}</p>
            <p>LINK_STATUS: VERIFIED</p>
            <p>LATENCY: 12ms</p>
          </div>
        </div>
      </div>

      {/* --- STATUS INDICATOR --- */}
      <div className="absolute bottom-10 left-10 z-20">
        <div className={`flex items-center gap-3 transition-opacity duration-500 ${isAutoPilot ? 'opacity-100' : 'opacity-30'}`}>
          <span className="w-2 h-2 bg-[#00FF94] rounded-full animate-ping" />
          <span className="text-xs font-mono text-[#00FF94] tracking-widest">
            {isAutoPilot ? "NEURAL AUTO-PILOT ENGAGED" : "MANUAL OVERRIDE"}
          </span>
        </div>
      </div>

      <ForceGraph2D
        ref={fgRef}
        width={dimensions.w}
        height={dimensions.h}
        graphData={initialData}
        backgroundColor="#050505"
        
        // Interactions
        onNodeClick={handleNodeClick}
        onNodeDrag={handleInteraction}
        onBackgroundClick={() => { handleInteraction(); setActiveNode(null); }}
        
        // Physics (Breathing)
        cooldownTicks={100}
        d3AlphaDecay={0.01}
        d3VelocityDecay={0.3}

        // Render
        nodeRelSize={8}
        linkColor={() => "#ffffff15"}
        linkWidth={1.5}
        linkDirectionalParticles={2}
        linkDirectionalParticleSpeed={0.005}
        
        nodeCanvasObject={(node, ctx, globalScale) => {
          const label = node.id as string;
          const fontSize = 12 / globalScale;
          const isTarget = node.id === activeNode?.id;
          const isCore = node.group === 1;
          
          // Breathing Calculation
          const pulse = Math.sin(Date.now() / 1000) * 2; 
          const baseRadius = isCore ? 8 : 4;
          const radius = isTarget ? (baseRadius * 2) + pulse : baseRadius;

          const color = (node.color as string) || "#fff";

          // Glow
          ctx.beginPath();
          ctx.arc(node.x!, node.y!, radius * 4, 0, 2 * Math.PI, false);
          ctx.fillStyle = isTarget ? color + '44' : color + '05';
          ctx.fill();

          // Core
          ctx.beginPath();
          ctx.arc(node.x!, node.y!, radius, 0, 2 * Math.PI, false);
          ctx.fillStyle = color;
          ctx.fill();

          // Label (Only show important ones or active)
          if (isTarget || isCore || node.group === 2) {
             ctx.font = `bold ${fontSize}px Sans-Serif`;
             ctx.textAlign = 'center';
             ctx.textBaseline = 'middle';
             ctx.fillStyle = isTarget ? '#FFF' : 'rgba(255,255,255,0.6)';
             ctx.fillText(label, node.x!, node.y! + radius + fontSize + 2);
          }
        }}
      />
    </div>
  );
}