import React, { useEffect, useRef, useState, useMemo } from 'react';
import { SwarmEngine } from './SwarmEngine';
import HeroCard from './HeroCard';
import { neuralData, HeroContent } from './NeuralData';

interface Props {
  customData: HeroContent[];
}

const SiteHeader = ({ visible }: { visible: boolean }) => {
  return (
    <div style={{
      position: 'absolute', top: 30, left: 40, 
      textAlign: 'left', pointerEvents: 'none', zIndex: 10,
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(-20px)',
      transition: 'opacity 1.5s ease, transform 1.5s ease',
      transitionDelay: '0.5s'
    }}>
      <h1 style={{ margin: 0, fontSize: '24px', color: '#4deeea', textShadow: '0 0 25px rgba(77,238,234,0.6)', letterSpacing: '2px' }}>
        JONATHAN WILLIAM MARINO
      </h1>
      <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#74b9ff', letterSpacing: '1px', fontFamily: 'monospace' }}>
        // DIGITAL_ARCHITECT
      </p>
    </div>
  )
}

const NeuralBackground: React.FC<Props> = ({ customData }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const markerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<SwarmEngine | null>(null);
  
  const [contentIndex, setContentIndex] = useState(0);
  const [showHeader, setShowHeader] = useState(false);

  // Merge Logic
  const activeData = useMemo(() => {
    if (customData && customData.length > 0) return customData;
    return neuralData;
  }, [customData]);

  const handleDeparticlize = () => {
    if (engineRef.current) engineRef.current.departiclize();
  };

  const handleCycleComplete = () => {
    if (engineRef.current) engineRef.current.cycleNextNode();
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    const engine = new SwarmEngine(
        canvasRef.current, 
        (id) => {
            const safeIndex = id % activeData.length;
            setContentIndex(safeIndex);
            if (id > 0) setShowHeader(true);
        },
        activeData.length
    );
    engineRef.current = engine;

    if (markerRef.current) {
      engine.setStreamTarget(markerRef.current.getBoundingClientRect());
    }

    const handleResize = () => {
      if (markerRef.current && engineRef.current) {
        engineRef.current.setStreamTarget(markerRef.current.getBoundingClientRect());
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (engineRef.current) engineRef.current.dispose();
    };
  }, [activeData]);
  
  useEffect(() => {
      const timer = setTimeout(() => {
          if(engineRef.current) engineRef.current.stopStream();
      }, 2500); 
      return () => clearTimeout(timer);
  }, [contentIndex]);

  // SCROLL DOWN LOGIC
  const handleScroll = () => {
      document.getElementById('full-dossier')?.scrollIntoView({ behavior: 'smooth' });
  };


  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', background: '#02040a', overflow: 'hidden' }}>
      <SiteHeader visible={showHeader} />

      <HeroCard 
        ref={markerRef} 
        content={activeData[contentIndex]} 
        onDeparticlize={handleDeparticlize} 
        onCycleComplete={handleCycleComplete} 
      />
      <canvas ref={canvasRef} style={{ display: 'block' }} />
      
      {/* Scroll CTA (New Gentle CTA) */}
      <div 
          onClick={handleScroll}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center cursor-pointer transition-opacity duration-300 hover:opacity-100 hover:scale-105"
          style={{ zIndex: 30 }}
      >
        <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-2 shadow-text">SCROLL FOR FULL DOSSIER</p>
        <svg className="w-6 h-6 text-gray-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
      </div>
       <style jsx>{`
            .shadow-text { text-shadow: 0 0 5px rgba(255, 255, 255, 0.2); }
        `}</style>
    </div>
  );
}

export default NeuralBackground;
