import React, { useEffect, useState, useRef, forwardRef } from 'react';
import { NarrativeCard } from './NeuralData';
import { ExternalLink, ChevronDown, ChevronUp, CheckCircle2, ArrowRight, Activity } from 'lucide-react';

interface HeroCardProps {
  content: NarrativeCard;
  onDeparticlize: () => void;
  onCycleComplete: () => void;
  triggerBurst: () => void; 
}

const HeroCard = forwardRef<HTMLDivElement, HeroCardProps>(({ content, onDeparticlize, onCycleComplete, triggerBurst }, ref) => {
  if (!content) return null;

  const [phase, setPhase] = useState<"context" | "insight" | "experience">("context");
  
  // Visibility States
  const [showContext, setShowContext] = useState(false);
  const [collapseContext, setCollapseContext] = useState(false);
  
  const [showInsight, setShowInsight] = useState(false);
  const [collapseInsight, setCollapseInsight] = useState(false);
  
  const [showExperience, setShowExperience] = useState(false);
  
  // Text Typing States
  const [txtDescription, setTxtDescription] = useState("");
  const [txtExplanation, setTxtExplanation] = useState("");
  const [txtAction, setTxtAction] = useState("");

  const [clipPath, setClipPath] = useState("inset(0 0 0 100%)");
  
  // Manual Expansion State
  const [forceExpand, setForceExpand] = useState<string | null>(null);

  // Hover Logic
  const [isHovered, setIsHovered] = useState(false);
  const isHoveredRef = useRef(false);
  const frameRef = useRef(0);

  useEffect(() => { isHoveredRef.current = isHovered; }, [isHovered]);
  const randomChar = () => "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 52)];

  useEffect(() => {
    // RESET
    setPhase("context");
    setClipPath("inset(0 0 0 100%)");
    setShowContext(false); setCollapseContext(false);
    setShowInsight(false); setCollapseInsight(false);
    setShowExperience(false);
    setTxtDescription(""); setTxtExplanation(""); setTxtAction("");
    setForceExpand(null);
    frameRef.current = 0;

    let reqId: number;
    const totalDuration = 1400; 
    const closeStart = totalDuration - 60; 

    const animLoop = () => {
      // PAUSE IF HOVERED
      if (isHoveredRef.current) {
         reqId = requestAnimationFrame(animLoop);
         return;
      }

      frameRef.current++;
      const frame = frameRef.current;

      // 1. INIT: WIPE IN FROM RIGHT
      if (frame < 60) {
        const p = frame / 60;
        const ease = 1 - Math.pow(1 - p, 3);
        setClipPath(`inset(0 0 0 ${100 - (ease * 100)}%)`);
      }
      if (frame === 40) setShowContext(true);

      // 2. CONTEXT (60-300)
      if (frame > 60 && frame < 250) {
          const p = (frame - 60) / 1.0;
          const text = content.context?.description || "";
          if (p < text.length) setTxtDescription(text.substring(0, Math.floor(p)) + randomChar());
          else setTxtDescription(text);
      }
      if (frame === 300) { setCollapseContext(true); setPhase("insight"); }

      // 3. INSIGHT (300-650)
      if (frame === 330) setShowInsight(true);
      if (frame > 330 && frame < 600) {
          const p = (frame - 330) / 1.0;
          const text = content.insight?.explanation || "";
          if (p < text.length) setTxtExplanation(text.substring(0, Math.floor(p)) + randomChar());
          else setTxtExplanation(text);
      }
      if (frame === 650) { setCollapseInsight(true); setPhase("experience"); }

      // 4. EXPERIENCE (650-1400)
      if (frame === 680) setShowExperience(true);
      if (frame > 680 && frame < 950) {
          const p = (frame - 680) / 1.0;
          const text = content.experience?.action || "";
          if (p < text.length) setTxtAction(text.substring(0, Math.floor(p)));
          else setTxtAction(text);
      }

      // 5. EXIT
      if (frame > closeStart) {
          const p = (frame - closeStart) / 60;
          setClipPath(`inset(0 0 0 ${p * 100}%)`);
          if (frame % 5 === 0 && triggerBurst) triggerBurst();
          if (frame === closeStart + 1) onDeparticlize();
          if (frame === totalDuration) onCycleComplete();
      }

      reqId = requestAnimationFrame(animLoop);
    };

    reqId = requestAnimationFrame(animLoop);
    return () => cancelAnimationFrame(reqId);
  }, [content, onDeparticlize, onCycleComplete, triggerBurst]);

  const Icon = content.icon || Activity;

  // Manual Toggle Handlers
  const toggleContext = () => { if (isHovered) setForceExpand(prev => prev === 'context' ? null : 'context'); };
  const toggleInsight = () => { if (isHovered) setForceExpand(prev => prev === 'insight' ? null : 'insight'); };

  const activeId = forceExpand || phase;

  return (
    <div 
      id="hero-card" 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
          setIsHovered(false);
          if (frameRef.current >= 1340) onCycleComplete();
      }}
      style={{
        position: 'absolute', top: '50%', left: '60px', width: '600px', minHeight: '420px',
        transform: `translateY(-50%)`, zIndex: 20, userSelect: 'none', cursor: 'default'
      }}
    >
      <div style={{
        width: '100%', height: '100%',
        background: 'rgba(10, 15, 30, 0.90)', 
        border: `1px solid rgba(255,255,255,0.1)`, 
        borderRadius: '24px', padding: '40px',
        position: 'relative',
        boxShadow: `0 20px 60px rgba(0,0,0,0.6)`,
        clipPath: clipPath,
        display: 'flex', flexDirection: 'column',
        backdropFilter: 'blur(20px)',
        transition: 'box-shadow 0.5s ease'
      }}>
          
         {/* Soft Gradient Top */}
         <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500/50 via-purple-500/50 to-emerald-500/50"></div>

         {/* Header Area */}
         <div className="flex justify-between items-start mb-6">
             <div className="flex items-center gap-3">
                 <div className="p-2 bg-white/5 rounded-lg border border-white/10">
                     <Icon className="w-5 h-5 text-white" />
                 </div>
                 <div className="flex flex-col">
                     <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Current Situation</span>
                     <h2 className="text-xl font-bold text-white leading-tight">{content.headline}</h2>
                 </div>
             </div>
         </div>

         <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>

            {/* --- 1. CONTEXT --- */}
            <div 
                onClick={toggleContext}
                className={`transition-all duration-500 ease-out overflow-hidden rounded-xl border ${isHovered && collapseContext ? 'cursor-pointer hover:bg-white/5 border-white/5' : 'border-transparent'}`}
                style={{ 
                    opacity: showContext ? 1 : 0, 
                    transform: showContext ? 'translateY(0)' : 'translateY(10px)',
                    maxHeight: (activeId === 'context' || (!collapseContext && showContext)) ? '200px' : '50px',
                }}
            >
               {/* Collapsed State (Memory Pill) */}
               <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0' }}>
                   <div className={`w-1 h-full bg-blue-500 rounded-full ${collapseContext ? 'opacity-100' : 'opacity-0'} transition-opacity`}></div>
                   <div style={{ flex: 1 }}>
                      <div className="text-xs font-bold text-blue-400 mb-1">{content.context.question}</div>
                      {collapseContext && activeId !== 'context' && (
                          <div className="text-sm text-slate-300 truncate">{content.context.description}</div>
                      )}
                   </div>
                   {isHovered && collapseContext && (activeId === 'context' ? <ChevronUp size={16} className="text-slate-500"/> : <ChevronDown size={16} className="text-slate-500"/>)}
               </div>

               {/* Active State */}
               <div style={{ opacity: (activeId === 'context' || !collapseContext) ? 1 : 0, transition: 'opacity 0.3s' }}>
                   <p className="text-base text-slate-300 leading-relaxed mb-3">{txtDescription}</p>
                   <div className="flex gap-2">
                       {content.context.sources.map((s, i) => (
                           <a 
                               key={i} href={s.url} target="_blank" rel="noopener noreferrer"
                               className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-full text-xs text-slate-400 transition-colors border border-white/5"
                               onClick={(e) => e.stopPropagation()}
                           >
                               <ExternalLink size={10} />
                               <span>{s.label}</span>
                           </a>
                       ))}
                   </div>
               </div>
            </div>

            {/* --- 2. INSIGHT --- */}
            <div 
                onClick={toggleInsight}
                className={`transition-all duration-500 ease-out overflow-hidden rounded-xl border ${isHovered && collapseInsight ? 'cursor-pointer hover:bg-white/5 border-white/5' : 'border-transparent'}`}
                style={{ 
                    opacity: showInsight ? 1 : 0.3, 
                    transform: showInsight ? 'translateY(0)' : 'translateY(10px)',
                    maxHeight: (activeId === 'insight' || (!collapseInsight && showInsight)) ? '200px' : '50px',
                }}
            >
               <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0' }}>
                   <div className={`w-1 h-full bg-amber-500 rounded-full ${collapseInsight ? 'opacity-100' : 'opacity-0'} transition-opacity`}></div>
                   <div style={{ flex: 1 }}>
                      <div className="text-xs font-bold text-amber-400 mb-1">{content.insight.question}</div>
                      {collapseInsight && activeId !== 'insight' && (
                          <div className="text-sm text-slate-300 truncate">{content.insight.explanation}</div>
                      )}
                   </div>
                   {isHovered && collapseInsight && (activeId === 'insight' ? <ChevronUp size={16} className="text-slate-500"/> : <ChevronDown size={16} className="text-slate-500"/>)}
               </div>

               <div style={{ opacity: (activeId === 'insight' || !collapseInsight) ? 1 : 0, transition: 'opacity 0.3s' }}>
                   <p className="text-base text-slate-200 leading-relaxed border-l-2 border-amber-500/30 pl-4">
                       {txtExplanation}
                   </p>
               </div>
            </div>

            {/* --- 3. EXPERIENCE --- */}
            <div style={{ 
                flex: 1, transition: 'all 0.5s ease',
                opacity: showExperience ? 1 : 0.3, transform: showExperience ? 'translateY(0)' : 'translateY(10px)',
                marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.05)'
            }}>
                <div className="text-xs font-bold text-emerald-400 mb-3 flex items-center gap-2">
                    <CheckCircle2 size={14} />
                    {content.experience.question}
                </div>
                
                <div className="bg-emerald-500/5 rounded-xl p-4 border border-emerald-500/20">
                    <div className="flex justify-between items-start mb-2">
                        <div className="text-sm font-bold text-emerald-300">{content.experience.role}</div>
                        <div className="text-xs font-bold bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded">
                            {content.experience.result}
                        </div>
                    </div>
                    <p className="text-sm text-slate-300 mb-3">{txtAction}</p>
                    
                    <div className="flex gap-2">
                        {content.experience.tags.map(tag => (
                            <span key={tag} className="text-[10px] text-emerald-400/70 px-2 py-0.5 rounded border border-emerald-500/20">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
                
                {/* CTA */}
                <button className="mt-4 w-full flex items-center justify-center gap-2 text-xs font-bold text-white/50 hover:text-white transition-colors py-2 pointer-events-auto">
                    View Full Portfolio <ArrowRight size={12} />
                </button>
            </div>

         </div>
      </div>
      
      {/* Anchor Point on the RIGHT edge, matching the stream target */}
      <div ref={ref} style={{ position: 'absolute', top: '50%', right: '-4px', width: '4px', height: '20px', background: '#10b981', boxShadow: '0 0 15px #10b981', borderRadius: '2px', zIndex: 5 }}></div>
    </div>
  );
});

HeroCard.displayName = "HeroCard";
export default HeroCard;
