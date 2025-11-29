import React, { useEffect, useRef, useState } from 'react';
import { SwarmEngine } from './SwarmEngine';
import HeroCard from './HeroCard';
import { narrativeData } from './NeuralData';

const SiteHeader = ({ visible }: { visible: boolean }) => {
  const [text, setText] = useState("");
  
  // Dynamic Header Text Cycle
  useEffect(() => {
      const phrases = [
        "IDENTIFYING OPPORTUNITIES...",
        "ANALYZING MARKET GAPS...",
        "MATCHING EXPERTISE...",
        "SYNTHESIZING SOLUTIONS..."
      ];
      let phraseIndex = 0;
      let charIndex = 0;
      let currentPhrase = "";
      let isDeleting = false;

      const timer = setInterval(() => {
          const target = phrases[phraseIndex];
          
          if (isDeleting) {
              currentPhrase = target.substring(0, charIndex--);
              if (charIndex < 0) {
                  isDeleting = false;
                  phraseIndex = (phraseIndex + 1) % phrases.length;
                  charIndex = 0;
              }
          } else {
              currentPhrase = target.substring(0, charIndex++);
              if (charIndex > target.length) {
                  // Wait before deleting
                  if (charIndex > target.length + 30) { // 30 ticks * 50ms = 1.5s pause
                      isDeleting = true;
                  }
              }
          }
          setText(currentPhrase);
      }, 50);
      return () => clearInterval(timer);
  }, []);

  return (
    <div style={{
      position: 'absolute', top: 30, left: 40, 
      textAlign: 'left', pointerEvents: 'none', zIndex: 10,
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(-20px)',
      transition: 'opacity 1.5s ease, transform 1.5s ease',
      transitionDelay: '0.5s'
    }}>
      <h1 style={{ margin: 0, fontSize: '24px', color: '#fff', letterSpacing: '1px', fontWeight: 700 }}>
        JONATHAN WILLIAM MARINO
      </h1>
      <div className="flex items-center gap-2 mt-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8', fontFamily: 'monospace' }}>
            {text}
          </p>
      </div>
    </div>
  )
}

const NeuralBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const markerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<SwarmEngine | null>(null);
  const [contentIndex, setContentIndex] = useState(0);

  // Bridges React Events -> Canvas Engine Methods
  const handleDeparticlize = () => { if (engineRef.current) engineRef.current.departiclize(); };
  const handleCycleComplete = () => { if (engineRef.current) engineRef.current.cycleNextNode(); };
  const handleTriggerBurst = () => { if (engineRef.current) engineRef.current.triggerReverseBurst(); }; 

  useEffect(() => {
    if (!canvasRef.current) return;
    // Initialize Engine
    const engine = new SwarmEngine(canvasRef.current, (id) => setContentIndex(id));
    engineRef.current = engine;
    
    // Pass initial target coordinates
    if (markerRef.current) engine.setStreamTarget(markerRef.current.getBoundingClientRect());
    
    const handleResize = () => {
      if (markerRef.current && engineRef.current) engineRef.current.setStreamTarget(markerRef.current.getBoundingClientRect());
    };
    window.addEventListener('resize', handleResize);
    
    // Cleanup on Unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      if (engineRef.current) engineRef.current.dispose();
    };
  }, []);
  
  // Safety: Stop streaming particles if the user lingers too long
  useEffect(() => {
      const timer = setTimeout(() => { if(engineRef.current) engineRef.current.stopStream(); }, 1350); 
      return () => clearTimeout(timer);
  }, [contentIndex]);

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', background: '#02040a', overflow: 'hidden' }}>
      <SiteHeader visible={true} />
      <HeroCard 
          ref={markerRef} 
          content={narrativeData[contentIndex]} 
          onDeparticlize={handleDeparticlize} 
          onCycleComplete={handleCycleComplete} 
          triggerBurst={handleTriggerBurst}
      />
      <canvas ref={canvasRef} style={{ display: 'block' }} />
    </div>
  );
};

export default NeuralBackground;
