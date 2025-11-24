"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import ForceGraph2D, { ForceGraphMethods } from "react-force-graph-2d";
import gsap from "gsap";

// --- 1. CONFIGURATION ---
const STAGE_X = 250; 
const STAGE_Y = 0;

// --- 2. MASTER DATA (Resume Content Only) ---
const MASTER_DATA = {
  nodes: [
    // CORE
    { 
      id: "JONATHAN", group: 1, val: 150, color: "#FFFFFF",
      title: "JONATHAN W. MARINO", 
      role: "STRATEGIC TECHNOLOGY EXECUTIVE",
      desc: "A hybrid executive architecting the intersection of Geopolitics, Data, and Design. Weaponizing technical curiosity to solve systemic organizational challenges.",
      bullets: ["15+ Years Experience", "Boardroom to Backend Bridge", "1.4M Citizens Mapped"],
      metrics: ["Global Scale", "Polymathic", "Impact-Driven"]
    },
    
    // PILLAR 1: TRUST & SAFETY
    { id: "Trust & Safety", group: 2, val: 60, color: "#0070F3", title: "TRUST & SAFETY", role: "Policy Architect", desc: "Protecting users and brand equity by translating complex policy mandates into rigorous technical enforcement.", bullets: ["Led 'Beyond the Map' Inclusion Initiative", "Policy Compliance Frameworks", "Risk Mitigation at Scale"], metrics: ["User Protection", "Regulatory Compliance", "Brand Safety"] },
    { id: "Policy", group: 3, val: 30, color: "#0070F3", title: "PRODUCT POLICY", role: "Compliance", desc: "Defining and enforcing digital standards across global markets.", bullets: ["GDPR/CCPA Alignment", "Content Moderation Rules", "User Safety Guidelines"], metrics: ["Global Standards", "Risk Reduction", "User Trust"] },
    { id: "Inclusion", group: 3, val: 30, color: "#0070F3", title: "DIGITAL INCLUSION", role: "Access", desc: "Ensuring technology serves under-represented populations.", bullets: ["Mapped 1.4M Citizens (Rio)", "Digital Identity Access", "Civic Tech Partnerships"], metrics: ["1.4M Users", "Social Impact", "Accessibility"] },

    // PILLAR 2: ENGINEERING
    { id: "Engineering", group: 2, val: 60, color: "#00FF94", title: "ENGINEERING LEADERSHIP", role: "Full-Stack & GenAI", desc: "Building scalable internal tools that automate workflows and reduce friction for policy and operations teams.", bullets: ["Built 'SlideSense' Automation", "Developed 'Stevie' Accessibility Tool", "Global Tooling Architecture"], metrics: ["$300k+ Savings", "Process Automation", "Gemini Integration"] },
    { id: "GenAI", group: 3, val: 40, color: "#00FF94", title: "GENERATIVE AI", role: "LLM Integration", desc: "Leveraging Large Language Models to solve unstructured data problems.", bullets: ["RAG Pipelines", "Automated Review Systems", "Context-Aware Agents"], metrics: ["Efficiency +400%", "Latency <200ms", "Accuracy"] },
    { id: "Audio AI", group: 3, val: 30, color: "#00FF94", title: "AUDIO SYNTHESIS", role: "Neural Speech", desc: "Creating inclusive audio interfaces for internal tools.", bullets: ["'Stevie' Audio Engine", "Text-to-Speech Pipelines", "WCAG Compliance"], metrics: ["Inclusive Design", "Accessibility", "Innovation"] },
    { id: "Next.js", group: 3, val: 30, color: "#00FF94", title: "MODERN STACK", role: "Architecture", desc: "High-performance web architecture using React Server Components.", bullets: ["Next.js 15", "Edge Computing", "Real-time Data"], metrics: ["Performance", "Scalability", "Maintainability"] },

    // PILLAR 3: CREATIVE
    { id: "Creative", group: 2, val: 60, color: "#FF0055", title: "CREATIVE TECHNOLOGY", role: "High-Fidelity UX", desc: "Translating complex technical concepts into intuitive, engaging user experiences.", bullets: ["Directed 'Monk-e-Mail' (50M+ Users)", "E-Trade Baby Campaign", "3D Swirl Ad Formats"], metrics: ["High Engagement", "User Retention", "Visual Storytelling"] },
    { id: "Motion", group: 3, val: 30, color: "#FF0055", title: "MOTION DESIGN", role: "3D & Animation", desc: "Using motion to guide user attention and explain complex systems.", bullets: ["After Effects / C4D", "UI Animation", "Interactive Storytelling"], metrics: ["User Delight", "Clarity", "Adoption"] },
    { id: "WebGL", group: 3, val: 30, color: "#FF0055", title: "WEBGL / 3D", role: "Immersive Web", desc: "Pushing the boundaries of browser-based rendering.", bullets: ["Three.js / R3F", "GLSL Shaders", "Performance Optimization"], metrics: ["60FPS", "No Plugins", "Cross-Platform"] },

    // ORBIT
    { id: "Global Ops", group: 4, val: 30, color: "#0070F3", title: "GLOBAL OPS", role: "Scale", desc: "Standardizing operations across APAC and EMEA regions.", bullets: ["Vendor Management", "SOP Standardization", "Operational Excellence"], metrics: ["Cost Reduction", "Reliability", "Global Reach"] },
    { id: "Gemini API", group: 3, val: 30, color: "#00FF94", title: "GEMINI API", role: "Integration", desc: "Deep implementation of Google's multimodal models.", bullets: ["Multimodal Inputs", "Function Calling", "Enterprise Security"], metrics: ["Scale", "Security", "Intelligence"] },
  ],
  links: [
    { source: "JONATHAN", target: "Trust & Safety" }, { source: "JONATHAN", target: "Engineering" }, { source: "JONATHAN", target: "Creative" },
    { source: "Trust & Safety", target: "Policy" }, { source: "Trust & Safety", target: "Inclusion" }, { source: "Trust & Safety", target: "Global Ops" },
    { source: "Engineering", target: "GenAI" }, { source: "Engineering", target: "Next.js" }, { source: "Engineering", target: "Audio AI" }, { source: "Engineering", target: "Gemini API" },
    { source: "Creative", target: "Motion" }, { source: "Creative", target: "WebGL" },
    { source: "GenAI", target: "Audio AI" }, { source: "Policy", target: "Inclusion" }, { source: "Global Ops", target: "Policy" }
  ]
};

const TOUR_STEPS = ["JONATHAN", "Trust & Safety", "Engineering", "Creative", "GenAI"];

export default function TechConstellation() {
  const fgRef = useRef<ForceGraphMethods | undefined>(undefined);
  const [dimensions, setDimensions] = useState({ w: 1000, h: 800 });
  
  // CLONE DATA & GENERATE PARTICLES
  const graphData = useMemo(() => {
    const data = JSON.parse(JSON.stringify(MASTER_DATA));
    // Add particle metadata to each node for the "Swarm" effect
    data.nodes.forEach((node: any) => {
      node.particles = Array.from({ length: 40 }).map(() => ({
        angle: Math.random() * Math.PI * 2,
        speed: 0.02 + Math.random() * 0.04,
        radiusOffset: Math.random() * 15,
        size: Math.random() * 2
      }));
    });
    return data;
  }, []);

  const [activeNode, setActiveNode] = useState<any>(graphData.nodes[0]); 
  const [isTransitioning, setIsTransitioning] = useState(false); 
  const [isMobile, setIsMobile] = useState(false);
  
  const indexRef = useRef(0);
  const autoPilotRef = useRef(true);
  const currentNodeRef = useRef<any>(null);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const mousePos = useRef({ x: 0, y: 0 }); // Mouse tracking for magnetism
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== "undefined") {
      const handleResize = () => {
        const mobile = window.innerWidth < 768;
        setIsMobile(mobile);
        setDimensions({ 
          w: window.innerWidth, 
          h: mobile ? window.innerHeight * 0.45 : window.innerHeight 
        });
      };
      window.addEventListener("resize", handleResize);
      handleResize(); 
      
      // Mouse Tracking
      const handleMouseMove = (e: MouseEvent) => {
          // Convert screen pixels to canvas coordinates (roughly)
          // The center of the screen is 0,0 in the graph
          mousePos.current = {
              x: e.clientX - window.innerWidth / 2,
              y: e.clientY - window.innerHeight / 2
          };
      };
      window.addEventListener("mousemove", handleMouseMove);

      return () => {
          window.removeEventListener("resize", handleResize);
          window.removeEventListener("mousemove", handleMouseMove);
      };
    }
  }, []);

  // --- PHYSICS INIT ---
  useEffect(() => {
    if (fgRef.current) {
        const graph = fgRef.current;
        const targetX = isMobile ? 0 : STAGE_X;
        const targetY = isMobile ? -20 : 0;

        // Standard Forces
        graph.d3Force('charge')?.strength(isMobile ? -80 : -200); 
        graph.d3Force('link')?.distance(isMobile ? 50 : 100);
        
        // CUSTOM MAGNETIC MOUSE FORCE
        // Nodes gently drift towards the mouse if they are idle
        graph.d3Force('mouseGravity', (alpha: number) => {
            if (!autoPilotRef.current && !isMobile) {
                graph.graphData().nodes.forEach((node: any) => {
                    // Only pull nodes that aren't the active target
                    if (node.id !== activeNode?.id) {
                        const dx = mousePos.current.x - node.x;
                        const dy = mousePos.current.y - node.y;
                        const dist = Math.sqrt(dx*dx + dy*dy);
                        
                        // Pull if within 300px
                        if (dist < 300) {
                            node.vx += dx * alpha * 0.05;
                            node.vy += dy * alpha * 0.05;
                        }
                    }
                });
            }
        });

        graph.d3Force('center')?.x(targetX); 
        graph.d3Force('center')?.y(targetY);
        
        graph.centerAt(targetX, targetY, 0);
        graph.zoom(0.1, 0); 

        setTimeout(() => {
          graph.zoom(isMobile ? 2.2 : 3.5, 2000);
        }, 500);
    }
  }, [isClient, isMobile, activeNode]);

  // --- ANIMATION SEQUENCE ---
  const transitionToNode = (node: any) => {
    if (!fgRef.current) return;
    setIsTransitioning(true);

    if (currentNodeRef.current && currentNodeRef.current !== node) {
      currentNodeRef.current.fx = undefined;
      currentNodeRef.current.fy = undefined;
    }
    currentNodeRef.current = node;

    node.fx = node.x;
    node.fy = node.y;
    
    const targetX = isMobile ? 0 : STAGE_X;

    gsap.to(node, {
      fx: targetX,
      fy: 0,
      duration: 2.0,
      ease: "power2.inOut",
      onUpdate: () => { fgRef.current?.d3ReheatSimulation(); }
    });

    setTimeout(() => {
      setActiveNode(node);
      setIsTransitioning(false);
    }, 800); 
  };

  // --- AUTO-PILOT ---
  useEffect(() => {
    const startDelay = setTimeout(() => {
      const interval = setInterval(() => {
        if (!autoPilotRef.current) return;
        const nextIndex = (indexRef.current + 1) % TOUR_STEPS.length;
        indexRef.current = nextIndex;
        const graphNodes = (graphData.nodes as any[]);
        const node = graphNodes.find(n => n.id === TOUR_STEPS[nextIndex]);
        if (node) transitionToNode(node);
      }, 10000);
      return () => clearInterval(interval);
    }, 4000);
    return () => clearTimeout(startDelay);
  }, [graphData, isMobile]);

  // --- INTERACTION ---
  const handleInteraction = useCallback((nodeId: string) => {
    autoPilotRef.current = false;
    const graphNodes = (graphData.nodes as any[]); 
    const node = graphNodes.find(n => n.id === nodeId);
    
    // EXPLOSION EFFECT
    // We temporarily increase the "swarm radius"
    if (node) {
       node.particles.forEach((p: any) => {
           p.radiusOffset += 50; // Blast out
       });
       // Animate them back in
       setTimeout(() => {
           node.particles.forEach((p: any) => {
              p.radiusOffset -= 50;
           });
       }, 500);
       
       transitionToNode(node);
    }

    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
      autoPilotRef.current = true;
    }, 10000); 
  }, [graphData, isMobile]);

  const handleDeepLink = () => {
    const targetMap: Record<string, string> = {
        "Engineering": "slide-sense",
        "GenAI": "slide-sense",
        "Audio AI": "stevie",
        "Trust & Safety": "beyond-the-map",
        "Creative": "monk-e-mail",
        "Global Ops": "exp-google"
    };
    const targetId = targetMap[activeNode.title] || targetMap[activeNode.id] || "content-start";
    const element = document.getElementById(targetId);
    if (element) element.scrollIntoView({ behavior: "smooth", block: "center" });
    else document.getElementById('content-start')?.scrollIntoView({ behavior: "smooth" });
  };

  if (!isClient) return null;

  return (
    <div className="fixed inset-0 bg-[#050505] overflow-hidden">
      
      {/* --- LEFT CARD --- */}
      <div className={`
        absolute z-20 pointer-events-none flex items-center 
        md:left-0 md:top-0 md:h-full md:w-[650px] md:p-12 md:items-center
        bottom-0 left-0 w-full h-[55%] items-end
      `}>
        <div 
          className={`pointer-events-auto w-full h-full md:h-auto transition-all duration-700 transform 
            ${isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}
        >
           <div className="h-full bg-black/85 backdrop-blur-3xl border-t md:border border-white/10 p-6 md:p-12 shadow-[0_0_100px_rgba(0,0,0,0.9)] relative overflow-hidden rounded-t-2xl md:rounded-2xl flex flex-col justify-start">
              <div className="absolute top-0 left-0 w-full h-1 md:w-2 md:h-full transition-colors duration-500" style={{ backgroundColor: activeNode?.color || '#fff' }} />
              
              {/* CONTENT */}
              <div className="overflow-y-auto md:overflow-visible flex-1 pr-2 mt-6">
                  <h3 className="font-mono text-[#0070F3] text-[10px] md:text-xs mb-2 uppercase tracking-widest font-bold" style={{ color: activeNode?.color }}>{activeNode?.role}</h3>
                  <h1 className="text-3xl md:text-6xl font-sans font-bold text-white mb-4 md:mb-8 leading-none tracking-tight">{activeNode?.title || activeNode?.id}</h1>
                  
                  <p className="text-sm md:text-lg text-gray-300 font-sans leading-relaxed mb-6 md:mb-8 max-w-xl md:border-l-4 md:border-white/10 md:pl-6">
                    {activeNode?.desc}
                  </p>

                  {activeNode?.bullets && (
                    <div className="grid gap-2 md:gap-3 mb-6 md:mb-8">
                      {activeNode.bullets.map((b: string, i: number) => (
                        <div key={i} className="flex items-start gap-3 text-gray-400">
                          <span className="text-[#0070F3] mt-1">▸</span>
                          <span className="font-mono text-xs md:text-sm leading-relaxed">{b}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeNode?.metrics && (
                    <div className="grid grid-cols-3 gap-2 md:gap-4 mb-6 md:mb-8 pt-4 md:pt-8 border-t border-white/10">
                      {activeNode.metrics.map((m: string) => (
                        <div key={m} className="text-center">
                          <span className="block text-[8px] md:text-xs font-mono text-gray-500 mb-1 uppercase tracking-wider">Metric</span>
                          <span className="block text-[10px] md:text-sm font-bold text-white">{m}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-2 md:mt-4 pt-4 md:pt-6 border-t border-gray-800 pb-12 md:pb-0">
                      <button onClick={handleDeepLink} className="w-full border border-white/20 bg-white/5 px-4 py-3 md:px-6 md:py-4 text-[10px] md:text-xs font-mono text-white hover:bg-white hover:text-black transition-all uppercase tracking-widest flex justify-between items-center">
                        <span>{activeNode.id === "JONATHAN" ? "INITIATE RESEARCH" : "INSPECT DATA"}</span>
                        <span>&darr;</span>
                      </button>
                  </div>
              </div>
           </div>
        </div>
      </div>

      {/* RIGHT BRAIN CANVAS */}
      <div className="absolute top-0 left-0 w-full md:h-full z-10" style={{ height: dimensions.h }}>
        <ForceGraph2D
          ref={fgRef}
          width={dimensions.w}
          height={dimensions.h}
          graphData={graphData}
          backgroundColor="#050505"
          
          onNodeClick={(node) => handleInteraction(node.id as string)}
          onNodeDrag={() => { if (activeNode) handleInteraction(activeNode.id as string); }} 
          onBackgroundClick={() => { if (activeNode) handleInteraction(activeNode.id as string); }}
          
          cooldownTicks={100}
          d3AlphaDecay={0.05} 
          d3VelocityDecay={0.6}
          
          nodeRelSize={isMobile ? 7 : 9} 
          linkColor={() => "#ffffff15"}
          linkWidth={1.5}
          linkDirectionalParticles={2}
          linkDirectionalParticleSpeed={0.005}
          
          // --- PARTICLE SWARM RENDERER ---
          nodeCanvasObject={(node, ctx, globalScale) => {
            if (!Number.isFinite(node.x) || !Number.isFinite(node.y)) return;

            const isTarget = node.id === activeNode?.id;
            const color = (node.color as string) || "#fff";
            
            const time = Date.now();
            const mobileScale = isMobile ? 0.6 : 1; 
            const baseRadius = 6 * mobileScale;
            
            // RENDER SWARM (Orbiting Particles)
            if ((node as any).particles) {
               (node as any).particles.forEach((p: any, i: number) => {
                  // Orbit Physics
                  p.angle += p.speed * (i % 2 === 0 ? 1 : -1); // Orbit direction varies
                  const orbitRadius = (isTarget ? baseRadius * 3 : baseRadius * 1.5) + p.radiusOffset;
                  
                  const px = node.x! + Math.cos(p.angle) * orbitRadius;
                  const py = node.y! + Math.sin(p.angle) * orbitRadius;

                  ctx.beginPath();
                  ctx.arc(px, py, p.size * (isTarget ? 1.5 : 1), 0, 2 * Math.PI);
                  ctx.fillStyle = color;
                  ctx.fill();
               });
            }

            // CORE
            ctx.beginPath();
            ctx.arc(node.x!, node.y!, baseRadius, 0, 2 * Math.PI, false);
            ctx.fillStyle = isTarget ? "#FFF" : color; // Bright white if active
            ctx.fill();
            
            // INNER GLOW
            ctx.globalCompositeOperation = 'lighter';
            ctx.beginPath();
            ctx.arc(node.x!, node.y!, baseRadius * 1.2, 0, 2 * Math.PI, false);
            ctx.fillStyle = color + '66';
            ctx.fill();
            ctx.globalCompositeOperation = 'source-over';

            // LABEL
            if (node.group <= 2 || isTarget) {
              const label = node.id as string;
              const fontSize = (12 / globalScale) * mobileScale;
              ctx.font = `bold ${fontSize}px Sans-Serif`;
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillStyle = 'rgba(255,255,255,0.8)';
              const textOffset = (isTarget ? baseRadius * 3.5 : baseRadius * 2) + 4;
              ctx.fillText(label, node.x!, node.y! + textOffset);
            }
          }}
        />
      </div>
    </div>
  );
}