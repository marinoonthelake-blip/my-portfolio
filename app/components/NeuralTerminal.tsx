"use client";
import { useState, useEffect, useRef } from 'react';

export default function NeuralTerminal({ onComplete, context }: { onComplete: () => void, context: any }) {
  const [phase, setPhase] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [subText, setSubText] = useState("");
  const [textVisible, setTextVisible] = useState(false);
  const [guideOpacity, setGuideOpacity] = useState(0); // RETAINED FOR VISUAL FX

  const timeouts = useRef<NodeJS.Timeout[]>([]);

  const addTimeout = (fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms);
    timeouts.current.push(id);
  };

  const playScene = (main: string, sub: string, delay: number) => {
    addTimeout(() => {
      setTextVisible(false); // Fade out previous text
      setTimeout(() => {
        setDisplayText(main);
        setSubText(sub);
        setTextVisible(true); // Fade in new text
      }, 700); 
    }, delay);
  };

  useEffect(() => {
    // 1. CRITICAL: Clear existing timers on every run/mount.
    timeouts.current.forEach(clearTimeout);
    timeouts.current = [];

    // --- FINAL INTUITIVE GUIDE TIMELINE (15.5s Total) ---

    // 0s: INITIALIZATION START (Almost Instant Visual Reveal)
    setPhase(1);
    setGuideOpacity(1); // CRITICAL FIX: Make guide visible immediately
    setDisplayText("INITIATING BESPOKE ARCHITECTURE");
    setSubText("THIS WEBSITE IS REBUILT DYNAMICALLY FOR YOU.");

    // 3s: AGENTS & DATA
    addTimeout(() => setPhase(2), 3000);
    playScene("PULLING LIVE CONTEXT (RED NODES)", "ACTIVATING MULTI-AGENT SWARM INTELLIGENCE", 3000);

    // 7s: VISUAL PROOF
    addTimeout(() => setPhase(3), 7000);
    playScene("EXTRACTING RELEVANCY PATHWAYS", "RED NODES INDICATE ACTIVE, LIVE NEWS FEEDS", 7000);

    // 11s: SYNTHESIS
    addTimeout(() => setPhase(4), 11000);
    playScene("GENERATING CUSTOM NARRATIVE", `OPTIMIZING PORTFOLIO FOR ${context?.city?.toUpperCase() || "GUEST"} VISITOR`, 11000);

    // 14.5s: EXPANSION
    addTimeout(() => {
      setPhase(5); 
      setGuideOpacity(0); // Fade out the guide panel before site reveal
    }, 14500);

    // END: TRIGGER SITE REVEAL (15.5s)
    addTimeout(onComplete, 15500);

    return () => timeouts.current.forEach(clearTimeout);
  }, [onComplete, context]);

  return (
    <div className="fixed inset-0 bg-black z-[100] flex flex-col items-center justify-center overflow-hidden">
      
      {/* 1. CINEMATIC BACKGROUND (Simplified) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1)_0%,transparent_70%)] opacity-40 animate-pulse"></div>
      
      {/* 2. COMPILING TERMINAL (Off to the side) */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-80 h-96 border-r border-blue-900 px-4 py-8 pointer-events-none transition-opacity duration-1000" style={{ opacity: phase < 3 ? 1 : 0.2 }}>
        <h3 className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-4">Process Log</h3>
        <p className="text-[10px] font-mono text-green-400 leading-tight mb-2">
          {`[${new Date().toLocaleTimeString('en-US')}] STATUS: ONLINE`}
        </p>
        <p className="text-[10px] font-mono text-gray-400 leading-tight mb-2">
          {`>> CORE: Synthesizing V4.0`}
        </p>
        <p className="text-[10px] font-mono text-gray-400 leading-tight mb-2">
          {`>> AGENTS: Swarm Intelligence Active`}
        </p>
        <p className="text-[10px] font-mono text-gray-400 leading-tight mb-2">
          {`>> CONTEXT: Observer Node Detected...`}
        </p>
        <p className="text-[10px] font-mono text-gray-400 leading-tight animate-pulse">
          {`>> RADAR: PULLING LIVE FEEDS...`}
        </p>
      </div>
      
      {/* 3. CENTRAL GUIDE HERO - VISIBLE INSTANTLY */}
      <div className={`relative z-20 transition-opacity duration-700 w-full max-w-4xl px-8`} style={{ opacity: guideOpacity, transitionDelay: '0.5s' }}>
          <h1 className="text-3xl md:text-5xl font-bold text-white tracking-wide mb-6">
              YOU ARE ABOUT TO WITNESS A NEURAL REBUILD.
          </h1>
          <p className="text-base md:text-xl text-gray-400 max-w-3xl mb-10 border-l-4 border-blue-600 pl-4">
              The neural network behind this site is generating content procedurally. It links JONATHAN'S resume to live contextual data to show you **immediate, proven relevancy.**
          </p>
          
          <div className="grid grid-cols-3 gap-8 mt-12 text-center">
              <div className="p-4 bg-gray-900/50 rounded-lg">
                  <h3 className="text-3xl font-bold text-red-500 mb-2">LIVE</h3>
                  <p className="text-xs font-mono text-gray-400">RED NODES ARE ACTIVE NEWS FEEDS PULLING DATA NOW.</p>
              </div>
              <div className="p-4 bg-gray-900/50 rounded-lg">
                  <h3 className="text-3xl font-bold text-white mb-2">UNIQUE</h3>
                  <p className="text-xs font-mono text-gray-400">EVERY RESUME DOWNLOADED IS A COMPLETELY CUSTOM DOCUMENT.</p>
              </div>
              <div className="p-4 bg-gray-900/50 rounded-lg">
                  <h3 className="text-3xl font-bold text-white mb-2">INTUITIVE</h3>
                  <p className="text-xs font-mono text-gray-400">CLICK ANY NODE TO EXPLORE A DIFFERENT STRATEGIC EXECUTION.</p>
              </div>
          </div>
      </div>

      {/* 4. EXPANSION VISUAL */}
      <div className={`absolute border border-white/10 bg-white/5 backdrop-blur-[1px] rounded-full transition-all duration-1000 ease-in-out 
          ${phase === 4 ? 'w-[100vw] h-[100vw] opacity-100' : 'w-0 h-0 opacity-0'}
          ${phase === 5 ? 'w-[300vmax] h-[300vmax] bg-white border-none duration-500' : ''}`}
          style={{ transitionDelay: phase === 4 ? '0.5s' : '0s' }}
      ></div>

      {/* 5. PROGRESS BAR */}
      <div className={`absolute bottom-0 left-0 w-full h-[2px] bg-gray-900 transition-opacity duration-1000 ${phase === 5 ? 'opacity-0' : 'opacity-100'}`}>
        <div className="h-full bg-white shadow-[0_0_20px_white] w-full origin-left animate-[growLine_15.5s_linear]"></div>
      </div>

      <style jsx>{`@keyframes growLine { from { transform: scaleX(0); } to { transform: scaleX(1); } }`}</style>
    </div>
  );
}
