import React, { useEffect, useRef, useState } from 'react';
import { SwarmEngine } from './SwarmEngine';
import HeroContainer from './HeroCard';
import { narrativeData, NarrativeCard } from './NeuralData';
import { Activity, MousePointer2, Move } from 'lucide-react';
import liveCache from '../../data/live_cache.json';

interface Props {
  active: boolean;
}

export const NeuralBackground: React.FC<Props> = ({ active }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<SwarmEngine | null>(null);
  
  const [cards, setCards] = useState<NarrativeCard[]>([]);
  const [contentIndex, setContentIndex] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
      const bioCard = narrativeData.find(n => n.category === 'bio');
      const portfolioCards = narrativeData.filter(n => n.category === 'portfolio').slice(0, 10);

      let liveCards: NarrativeCard[] = [];
      if (Array.isArray(liveCache)) {
          const shuffled = [...liveCache].sort(() => 0.5 - Math.random());
          liveCards = shuffled.slice(0, 10).map((item: any) => ({
              ...item,
              category: 'live',
              icon: Activity 
          }));
      }

      const merged: NarrativeCard[] = bioCard ? [bioCard] : [];
      
      const maxLen = Math.max(liveCards.length, portfolioCards.length);
      for(let i=0; i<maxLen; i++) {
          if(liveCards[i]) merged.push(liveCards[i]);
          if(portfolioCards[i]) merged.push(portfolioCards[i]);
      }

      setCards(merged);
  }, []);

  useEffect(() => {
    if (!active) return;
    if (!canvasRef.current) return;
    if (cards.length === 0) return;

    const engine = new SwarmEngine(canvasRef.current, (id) => {
        setContentIndex(id);
        setStarted(true); 
    }, cards); 
    
    engineRef.current = engine;

    const handleResize = () => engine.resize();
    window.addEventListener('resize', handleResize);
    
    return () => {
        window.removeEventListener('resize', handleResize);
        engine.dispose();
    };
  }, [active, cards]);

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', background: '#02040a', overflow: 'hidden' }}>
      
      {/* TOP LEFT HEADER */}
      <div style={{ 
          position: 'absolute', top: 30, left: 60, zIndex: 10, 
          opacity: started ? 1 : 0, transition: 'opacity 2s ease 1s'
      }}>
          <h1 className="text-xl font-bold text-white">JONATHAN WILLIAM MARINO</h1>
          <div className="text-xs text-slate-500 font-mono mt-1 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
              LIVE INTELLIGENCE // ACTIVE
          </div>
      </div>

      {/* BOTTOM RIGHT LEGEND */}
      <div style={{
          position: 'absolute', bottom: 40, right: 60, zIndex: 10,
          textAlign: 'right', opacity: started ? 1 : 0, transition: 'opacity 1s ease 2s',
          pointerEvents: 'none' 
      }}>
          <div className="flex flex-col items-end space-y-3">
              
              <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest drop-shadow-md">Live Market Signal</span>
                  <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)] animate-pulse"></div>
              </div>
              <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest drop-shadow-md">Proven Capability</span>
                  <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]"></div>
              </div>
              <div className="flex items-center gap-3 mb-2">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest drop-shadow-md">Core Identity</span>
                  <div className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.8)]"></div>
              </div>

              <div className="mt-4 bg-slate-900/80 border-r-2 border-blue-500/50 p-4 rounded-l-xl backdrop-blur-md max-w-xs shadow-2xl">
                  <p className="text-[10px] text-slate-300 leading-relaxed font-sans border-b border-white/10 pb-3 mb-3">
                      <strong>SYSTEM STATUS:</strong> Autonomous.<br/>
                      Engine is mapping live news (Red) to resume skills (Green) in real-time.
                  </p>
                  <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-end gap-2 text-blue-400">
                          <span className="text-[9px] uppercase tracking-widest font-bold">DRAG NODES</span>
                          <Move size={12} />
                      </div>
                      <div className="flex items-center justify-end gap-2 text-slate-400">
                          <span className="text-[9px] uppercase tracking-widest font-bold">CLICK TO ACTIVATE</span>
                          <MousePointer2 size={12} />
                      </div>
                  </div>
              </div>

          </div>
      </div>

      {started && cards.length > 0 && (
          <HeroContainer content={cards[contentIndex] || cards[0]} engine={engineRef.current} />
      )}
      
      <canvas ref={canvasRef} style={{ display: 'block' }} />
    </div>
  );
};

export default NeuralBackground;
