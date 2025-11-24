"use client";

import { useState, useEffect, useCallback } from "react";
import { ForceGraphMethods } from "react-force-graph-2d";
import gsap from "gsap";

// --- PHYSICS CONSTANTS (LOCKED) ---
const DESKTOP_X = 250; // Center of the "Right Side" empty space
const DESKTOP_Y = 0;
const MOBILE_X = 0;    // Center of the screen
const MOBILE_Y = -20;  // Slightly up to clear the bottom card

export function useBrainPhysics(fgRef: React.RefObject<ForceGraphMethods | undefined>) {
  const [dimensions, setDimensions] = useState({ w: 1000, h: 800 });
  const [isMobile, setIsMobile] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // 1. RESPONSIVE HANDLER
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setDimensions({
        w: window.innerWidth,
        // Mobile: Canvas takes top 45%. Desktop: Full Screen.
        h: mobile ? window.innerHeight * 0.45 : window.innerHeight
      });
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Init
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 2. INITIAL PHYSICS SETUP (The "Big Bang")
  useEffect(() => {
    if (!fgRef.current) return;
    const graph = fgRef.current;
    
    // Target Coordinates based on device
    const targetX = isMobile ? MOBILE_X : DESKTOP_X;
    const targetY = isMobile ? MOBILE_Y : DESKTOP_Y;

    // Force Configuration
    graph.d3Force('charge')?.strength(isMobile ? -80 : -150);
    graph.d3Force('link')?.distance(isMobile ? 50 : 100);
    
    // Center Gravity
    graph.d3Force('center')?.x(targetX);
    graph.d3Force('center')?.y(targetY);

    // Camera Start
    graph.centerAt(targetX, targetY, 0);
    graph.zoom(0.1, 0);

    // Cinematic Zoom In
    setTimeout(() => {
      graph.zoom(isMobile ? 2.5 : 3.5, 2500);
      setIsReady(true);
    }, 500);

  }, [dimensions.w, isMobile]); // Re-run if screen size changes dramatically

  // 3. MOVEMENT ENGINE (The "Move" Command)
  const moveCameraToNode = useCallback((node: any, onComplete?: () => void) => {
    if (!fgRef.current) return;

    // Determine where we want the node to end up
    const targetX = isMobile ? MOBILE_X : DESKTOP_X;
    const targetY = isMobile ? MOBILE_Y : DESKTOP_Y;

    // We use GSAP to animate the Node's "Fixed Position" (fx, fy)
    // The physics engine will drag the rest of the net along with it
    gsap.to(node, {
      fx: targetX,
      fy: targetY,
      duration: 2.0,
      ease: "power2.inOut",
      onUpdate: () => {
        // Keep physics "hot" during drag so lines stretch smoothly
        fgRef.current?.d3ReheatSimulation();
      },
      onComplete: () => {
        if (onComplete) onComplete();
      }
    });
  }, [isMobile]);

  return { dimensions, isMobile, moveCameraToNode, isReady };
}