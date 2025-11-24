"use client";

import { useState, useEffect, useCallback } from "react";
import { ForceGraphMethods } from "react-force-graph-2d";
import gsap from "gsap";

const STAGE_X = 400;
const STAGE_Y = 0;

export function useBrainPhysics(fgRef: React.RefObject<ForceGraphMethods | undefined>) {
  const [dimensions, setDimensions] = useState({ w: 1000, h: 800 });
  const [isMobile, setIsMobile] = useState(false);

  // 1. RESPONSIVE HANDLER
  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => {
        const mobile = window.innerWidth < 768;
        setIsMobile(mobile);
        setDimensions({
          w: window.innerWidth,
          // Match your stable code: 45% height on mobile
          h: mobile ? window.innerHeight * 0.45 : window.innerHeight
        });
      };
      window.addEventListener("resize", handleResize);
      handleResize();
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  // 2. PHYSICS INIT (Exact match to your stable snippet)
  useEffect(() => {
    if (fgRef.current) {
      const graph = fgRef.current;
      
      // Exact settings from your provided code
      graph.d3Force('charge')?.strength(-150);
      graph.d3Force('link')?.distance(100);
      
      // Desktop default centering
      graph.d3Force('center')?.x(STAGE_X);
      graph.d3Force('center')?.y(STAGE_Y);
      
      graph.centerAt(STAGE_X, STAGE_Y, 0);
      graph.zoom(3.5, 0);
    }
  }, [dimensions.w]); // Re-run on resize to keep alignment

  // 3. TRANSITION LOGIC (Exact match)
  const moveNodeToStage = useCallback((node: any, onComplete: () => void) => {
    if (!fgRef.current) return;

    // Lock Node
    node.fx = node.x;
    node.fy = node.y;

    // Dynamic Target: 0 for Mobile, 400 for Desktop
    const targetX = isMobile ? 0 : STAGE_X;
    const targetY = 0; // Your code had 0 for both

    gsap.to(node, {
      fx: targetX,
      fy: targetY,
      duration: 2.0,
      ease: "power2.inOut",
      onUpdate: () => { 
        fgRef.current?.d3ReheatSimulation(); 
      },
      onComplete: () => {
        onComplete();
      }
    });
  }, [isMobile]);

  return { dimensions, isMobile, moveNodeToStage };
}