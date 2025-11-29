"use client";
import { useState, useEffect, useRef } from 'react';

interface Props {
  onComplete: () => void;
  context: any;
  realTimeLog?: string | null;
}

export default function NeuralTerminal({ onComplete, context, realTimeLog }: Props) {
  const [logs, setLogs] = useState<string[]>([]);
  const [mainText, setMainText] = useState("");
  const [subText, setSubText] = useState("");
  const [progress, setProgress] = useState(0);
  const logEndRef = useRef<HTMLDivElement>(null);

  // Sound effect simulation (Visual only for now)
  const [activeZone, setActiveZone] = useState<"BOOT" | "NETWORK" | "MIND" | "COMPLETE">("BOOT");

  const addLog = (text: string) => {
    setLogs(prev => [...prev, `> ${text}`]);
  };

  // Auto-scroll logs
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  // THE CINEMATIC SEQUENCE
  useEffect(() => {
    let timer = 0;
    
    // 0s: BOOT
    setTimeout(() => {
        addLog(`KERNEL: DETECTED VISITOR [${context?.city?.toUpperCase() || "UNKNOWN"}]`);
        addLog("PROTOCOL: AUTHENTICATING...");
        setMainText("INITIALIZING NEURAL HANDSHAKE");
        setActiveZone("BOOT");
    }, 500);

    // 2s: NETWORK (The "Live" aspect)
    setTimeout(() => {
        addLog("CONN: ESTABLISHED SECURE UPLINK.");
        addLog("TARGET: HACKER_NEWS_API // PORT 443");
        addLog("TARGET: GOOGLE_GEMINI_2.0_FLASH // KEY_VALID");
        setMainText("INGESTING GLOBAL DATA STREAMS");
        setSubText("THIS SITE IS BEING GENERATED IN REAL-TIME BASED ON LIVE EVENTS.");
        setActiveZone("NETWORK");
        setProgress(30);
    }, 3500);

    // 7s: THE MIND (The Narrative)
    setTimeout(() => {
        addLog("ARCHITECT: JONATHAN_MARINO_PRIME");
        addLog("STRATEGY: SYNTHESIZING RESUME DATA...");
        addLog("WARN: COMPLEXITY THRESHOLD EXCEEDED.");
        setMainText("ENTERING JON'S MIND");
        setSubText("DECODING STRATEGIC ARCHITECTURE...");
        setActiveZone("MIND");
        setProgress(65);
    }, 8000);

    // 12s: DYNAMIC BUILD
    setTimeout(() => {
        addLog("RENDER: COMPILING 3D ASSETS...");
        addLog("RENDER: CALCULATING NEURAL PATHWAYS...");
        addLog("BUILD: HERO_SECTION [DYNAMIC]");
        addLog("BUILD: EXECUTIVE_BIO [STATIC]");
        setMainText("FINALIZING CONSTRUCT");
        setProgress(90);
    }, 13000);

    // 16s: COMPLETE
    setTimeout(() => {
        addLog("STATUS: ONLINE.");
        setMainText("WELCOME.");
        setProgress(100);
        setActiveZone("COMPLETE");
    }, 16000);

    // 18s: EXIT
    setTimeout(() => {
        onComplete();
    }, 18000);

  }, [context, onComplete]);

  // Listen to Real-Time Logs from Parent (if any)
  useEffect(() => {
    if (realTimeLog) {
        setLogs(prev => [...prev, `>> LIVE_AGENT: ${realTimeLog}`]);
    }
  }, [realTimeLog]);

  return (
    <div className="fixed inset-0 bg-black z-[100] flex flex-col font-mono text-green-500 overflow-hidden scanline cursor-none">
      
      {/* BACKGROUND GRID */}
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,6px_100%] pointer-events-none"></div>

      {/* TOP BAR */}
      <div className="w-full border-b border-green-900/50 p-4 flex justify-between items-center text-xs tracking-widest opacity-70">
        <div className="flex gap-4">
            <span>SYS.VER: 4.0.2</span>
            <span>MEM: 64TB</span>
            <span className="animate-pulse text-red-500">{activeZone} SEQUENCE</span>
        </div>
        <div>
            <span>VISITOR_ID: {context?.city || "ANONYMOUS"}</span>
        </div>
      </div>

      {/* CENTER STAGE */}
      <div className="flex-grow flex flex-col items-center justify-center relative z-10">
        {/* Progress Ring */}
        <div className="relative w-64 h-64 mb-8 flex items-center justify-center">
            <svg className="w-full h-full rotate-[-90deg]" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#064e3b" strokeWidth="2" />
                <circle 
                    cx="50" cy="50" r="45" fill="none" stroke="#22c55e" strokeWidth="2" 
                    strokeDasharray="283" 
                    strokeDashoffset={283 - (283 * progress) / 100} 
                    className="transition-all duration-1000 ease-linear"
                />
            </svg>
            <div className="absolute text-4xl font-bold text-white glitch">
                {progress}%
            </div>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tighter mb-4 text-center glitch" data-text={mainText}>
            {mainText}
        </h1>
        <p className="text-sm md:text-base text-green-400/80 tracking-widest uppercase max-w-xl text-center">
            {subText}
        </p>
      </div>

      {/* LOG STREAM (Bottom Left) */}
      <div className="absolute bottom-8 left-8 w-96 h-48 overflow-hidden border-l-2 border-green-700/50 pl-4 hidden md:block">
        <div className="flex flex-col justify-end h-full">
            {logs.slice(-6).map((log, i) => (
                <p key={i} className="text-xs text-green-600/80 mb-1 leading-tight font-mono">
                    {log}
                </p>
            ))}
            <div ref={logEndRef} />
        </div>
      </div>

      {/* SKIP BUTTON (Bottom Right) */}
      <div className="absolute bottom-8 right-8 z-50">
        <button 
            onClick={onComplete}
            className="text-xs text-gray-600 hover:text-white border border-gray-800 hover:border-white px-4 py-2 rounded uppercase tracking-widest transition-all"
        >
            [ESC] ABORT SEQUENCE
        </button>
      </div>

    </div>
  );
}
