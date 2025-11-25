import React, { useEffect, useState, forwardRef } from 'react';
import { HeroContent } from './NeuralData';

interface HeroCardProps {
  content: HeroContent;
  onDeparticlize: () => void;
  onCycleComplete: () => void;
}

const HeroCard = forwardRef<HTMLDivElement, HeroCardProps>(({ content, onDeparticlize, onCycleComplete }, ref) => {
  const [displayedTitle, setDisplayedTitle] = useState("");
  const [displayedDesc, setDisplayedDesc] = useState("");
  
  const [opacity, setOpacity] = useState(0);
  const [scale, setScale] = useState(0.8);
  const [blur, setBlur] = useState(20);
  const [showContent, setShowContent] = useState(false);
  const [metricsVisible, setMetricsVisible] = useState(false);
  const [stackVisible, setStackVisible] = useState<boolean[]>([]);

  const randomChar = () => "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&"[Math.floor(Math.random() * 36)];

  useEffect(() => {
    // RESET
    setOpacity(0); setScale(0.9); setBlur(30); setShowContent(false); 
    setDisplayedTitle(""); setDisplayedDesc(""); 
    setMetricsVisible(false); setStackVisible([]);

    let frame = 0; 
    let reqId: number;
    const fullTitle = content.title;
    const fullDesc = content.description;
    
    const introDuration = 100; 
    const typingDuration = fullDesc.length * 1.5; // SLOWER TYPING
    // MASSIVE READ PAUSE FOR LIVE CARDS (8s) vs Static (5s)
    const readPause = content.isLive ? 800 : 500; 
    const exitDuration = 80; 
    
    const totalDuration = introDuration + typingDuration + readPause + exitDuration;
    const closeStart = totalDuration - exitDuration;

    const animLoop = () => {
      frame++;
      if (frame < introDuration) {
        const p = frame / introDuration;
        const ease = 1 - Math.pow(1 - p, 3);
        setOpacity(ease); setScale(0.95 + (ease * 0.05)); setBlur(20 - (ease * 20)); 
      } 
      if (frame === 60) setShowContent(true);

      if (frame > 60 && frame < 160) {
          const p = (frame - 60) / 100;
          const len = Math.floor(p * fullTitle.length);
          setDisplayedTitle(fullTitle.substring(0, len) + randomChar());
      } else if (frame === 160) {
          setDisplayedTitle(fullTitle);
      }

      if (frame > 160 && frame < closeStart) {
          const p = (frame - 160) * 1.0; 
          if (p < fullDesc.length) {
             const clean = fullDesc.substring(0, Math.floor(p));
             setDisplayedDesc(clean + randomChar());
          } else {
             setDisplayedDesc(fullDesc);
             setMetricsVisible(true);
             const stackStart = 160 + (fullDesc.length / 1.0) + 20;
             if (frame > stackStart) {
                const sIdx = Math.floor((frame - stackStart) / 15); 
                if (content.stack && sIdx < content.stack.length) {
                    setStackVisible(prev => { const next = [...prev]; next[sIdx] = true; return next; });
                }
             }
          }
      }

      if (frame > closeStart) {
          const p = (frame - closeStart) / exitDuration;
          setOpacity(1 - p); setBlur(p * 20); setScale(1 + (p * 0.02)); 
          if (frame === Math.floor(closeStart) + 1) onDeparticlize();
          if (frame >= Math.floor(totalDuration)) { onCycleComplete(); return; }
      }
      reqId = requestAnimationFrame(animLoop);
    };
    reqId = requestAnimationFrame(animLoop);
    return () => cancelAnimationFrame(reqId);
  }, [content, onDeparticlize, onCycleComplete]);

  return (
    <div 
      id="hero-card" 
      style={{
        position: 'absolute', top: '50%', left: '5%', transform: `translateY(-50%) scale(${scale})`, 
        width: 'min(85vw, 700px)', height: 'auto', minHeight: '450px', maxHeight: '85vh',
        opacity: opacity, filter: `blur(${blur}px)`, zIndex: 20, pointerEvents: 'none', userSelect: 'none', transition: 'box-shadow 0.5s ease'
      }}
    >
      <div style={{
        width: '100%', height: '100%',
        background: 'rgba(5, 15, 30, 0.95)', 
        border: content.isLive ? '1px solid rgba(255, 80, 80, 0.5)' : '1px solid rgba(77, 238, 234, 0.2)', 
        borderRight: content.isLive ? '4px solid rgba(255, 80, 80, 0.8)' : '4px solid rgba(77, 238, 234, 0.6)', 
        borderRadius: '12px',
        padding: '0', 
        display: 'flex', flexDirection: 'column', position: 'relative',
        boxShadow: content.isLive ? '0 0 80px rgba(255,0,0,0.2)' : '0 0 100px rgba(0,0,0,0.8)'
      }}>
         
         {/* LIVE HEADER (RED) */}
         {content.isLive && (
           <div className="w-full bg-red-950/50 border-b border-red-500/30 p-4 flex flex-col gap-2 rounded-t-xl pointer-events-auto">
              <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                     <span className="animate-pulse w-2 h-2 rounded-full bg-red-500"></span>
                     <span className="text-[10px] font-mono text-red-400 uppercase tracking-widest">Live Intelligence</span>
                  </div>
                  <span className="text-[10px] font-mono text-gray-500">{content.sourceDate}</span>
              </div>
              
              {/* ARTICLE INFO */}
              <div>
                  <a href={content.sourceUrl} target="_blank" className="text-lg font-bold text-white hover:text-red-400 transition-colors block truncate">
                    {content.articleTitle} ↗
                  </a>
                  <p className="text-xs text-gray-400 mt-1 font-mono border-l-2 border-gray-700 pl-2 italic">
                    {content.articleSummary}
                  </p>
              </div>
           </div>
         )}

         <div style={{ padding: '40px', opacity: showContent ? 1 : 0, transition: 'opacity 0.5s', display: 'flex', flexDirection: 'column', height: '100%' }}>
            
            {/* PROTOCOL HEADER */}
            {!content.isLive && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px' }}>
                  <span style={{ fontSize: '12px', color: '#4deeea', fontFamily: 'monospace', letterSpacing: '3px' }}>ID: {content.id}</span>
                  <span style={{ fontSize: '12px', color: '#74b9ff', fontFamily: 'monospace', letterSpacing: '3px' }}>PROTO: {content.protocol}</span>
                </div>
            )}

            {/* STRATEGIC RELEVANCE HEADER */}
            {content.isLive && (
                <div className="mb-4 mt-2">
                    <span className="text-xs font-mono text-red-400 uppercase tracking-[0.2em] border-b border-red-500/30 pb-1">Strategic Application</span>
                </div>
            )}

            {/* MAIN HEADLINE */}
            <h2 style={{ 
              fontSize: 'clamp(24px, 3vw, 42px)', fontWeight: 600, margin: '0 0 20px 0', color: '#fff', 
              lineHeight: 1.1, fontFamily: 'Segoe UI, sans-serif', letterSpacing: '-0.5px'
            }}>
              {displayedTitle}
            </h2>

            {/* DESCRIPTION (SCROLLABLE) */}
            <div style={{ 
              fontSize: 'clamp(14px, 1.5vw, 16px)', lineHeight: '1.6', color: '#aaddff', fontWeight: 300,
              fontFamily: 'monospace', maxWidth: '98%', flexGrow: 1, overflowY: 'auto', paddingRight: '10px',
              borderLeft: content.isLive ? 'none' : 'none'
            }}>
              {displayedDesc}
            </div>

            {/* FOOTER METRICS */}
            <div style={{ marginTop: '30px' }}>
              <div style={{ 
                 marginBottom: '15px', color: content.isLive ? '#ff6b6b' : '#4deeea', fontSize: '12px', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase',
                 opacity: metricsVisible ? 1 : 0, transform: metricsVisible ? 'translateY(0)' : 'translateY(10px)', transition: 'all 0.8s ease-out'
              }}>
                {content.metrics ? `▶ ${content.metrics}` : ''}
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {(content.stack || []).map((tech, i) => (
                  <span key={i} style={{ 
                    fontSize: '10px', background: 'rgba(255, 255, 255, 0.05)', color: content.isLive ? '#ff6b6b' : '#4deeea', padding: '5px 10px', 
                    border: '1px solid rgba(255, 255, 255, 0.1)', fontFamily: 'monospace', borderRadius: '4px',
                    opacity: stackVisible[i] ? 1 : 0, transform: stackVisible[i] ? 'scale(1)' : 'scale(0.9)', transition: 'all 0.4s ease'
                  }}>{tech}</span>
                ))}
              </div>
            </div>
         </div>
      </div>
      
      <div ref={ref} style={{ position: 'absolute', top: '50%', right: '-4px', width: '4px', height: '40px', background: content.isLive ? '#ff6b6b' : '#4deeea', borderRadius: '2px', zIndex: 5 }}></div>
    </div>
  );
});

HeroCard.displayName = "HeroCard";
export default HeroCard;
