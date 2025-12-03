import React, { useEffect, useState, useRef, forwardRef } from 'react';
import { 
  ExternalLink, Lightbulb, User, Activity, Calendar, MousePointer2, PauseCircle
} from 'lucide-react';
import { NarrativeCard } from './NeuralData';
import { SwarmEngine } from './SwarmEngine';

const CardModule = forwardRef(({ title, children, color, isVisible, delay, glow, date, link }: any, ref: any) => {
    return (
        <div 
            style={{ 
                background: `rgba(15, 23, 42, 0.9)`,
                borderLeft: "4px solid " + color,
                borderTop: '1px solid rgba(255,255,255,0.05)',
                borderRight: '1px solid rgba(255,255,255,0.05)',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '0 12px 12px 0',
                marginBottom: '16px',
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateX(0)' : 'translateX(-20px)',
                transition: "all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) " + delay + "ms",
                boxShadow: isVisible ? "0 4px 30px " + color + (glow ? "40" : "10") : "none",
                position: 'relative'
            }}
            className="w-full p-4 md:p-5"
        >
            <div className="flex justify-between items-start mb-2">
                <div style={{ fontSize: '10px', fontWeight: 700, color: color, textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {glow && <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>}
                    {title}
                </div>
                {date && (
                    <div className={"text-[10px] font-mono flex items-center gap-1 " + (glow ? 'text-red-400' : 'text-slate-500')}>
                        <Calendar size={10} />
                        {date}
                    </div>
                )}
            </div>
            
            <div>{children}</div>
            
            {link && (
                <a 
                    href={link} 
                    target="_blank" 
                    rel="noreferrer"
                    className="absolute top-4 right-4 group"
                >
                    <div className={"p-2 rounded-full transition-all " + (glow ? 'bg-red-500/10 hover:bg-red-500/30 text-red-400' : 'bg-blue-500/10 hover:bg-blue-500/30 text-blue-400')}>
                        <ExternalLink size={16} />
                    </div>
                </a>
            )}
            
            <div 
                ref={ref}
                style={{ 
                    position: 'absolute', 
                    top: '50%', 
                    right: '-4px', 
                    width: '4px', 
                    height: '12px', 
                    marginTop: '-6px', 
                    background: color, 
                    borderRadius: '2px',
                    opacity: isVisible ? 1 : 0, 
                    transition: 'opacity 1s'
                }} 
            />
        </div>
    )
});

CardModule.displayName = "CardModule";

interface HeroProps {
    content: NarrativeCard;
    engine: SwarmEngine | null;
}

const HeroContainer: React.FC<HeroProps> = ({ content, engine }) => {
    const [activeContent, setActiveContent] = useState<NarrativeCard | null>(null);
    const [visible, setVisible] = useState([false, false, false, false]);
    const [isHovered, setIsHovered] = useState(false);
    const [isTouch, setIsTouch] = useState(false);
    
    const card1Ref = useRef<HTMLDivElement>(null);
    const card2Ref = useRef<HTMLDivElement>(null);
    const card3Ref = useRef<HTMLDivElement>(null);
    const card4Ref = useRef<HTMLDivElement>(null);
    
    const isHoveredRef = useRef(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

    useEffect(() => { isHoveredRef.current = isHovered; }, [isHovered]);

    useEffect(() => {
        setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
    }, []);
    
    useEffect(() => {
        if (!engine) return;
        
        let rafId: number;
        
        const updateTargets = () => {
            const refs = [card1Ref, card2Ref, card3Ref, card4Ref];
            const rects = refs.map(r => r.current?.getBoundingClientRect() || new DOMRect(0,0,0,0));
            
            if (rects[0] && rects[0].top !== 0) {
                engine.setTargets(rects);
            }
            
            rafId = requestAnimationFrame(updateTargets);
        };
        
        rafId = requestAnimationFrame(updateTargets);
        return () => cancelAnimationFrame(rafId);
    }, [engine, content]);

    useEffect(() => {
        if (timerRef.current) clearTimeout(timerRef.current);
        
        timeoutsRef.current.forEach(clearTimeout);
        timeoutsRef.current = [];

        if (content.id !== activeContent?.id) {
            if (!activeContent) {
                setActiveContent(content);
                startEnterSequence();
            } else {
                startExitSequence().then(() => {
                    setActiveContent(content);
                    startEnterSequence();
                });
            }
        }
    }, [content]);

    const startEnterSequence = () => {
        setVisible([false, false, false, false]);
        const t1 = setTimeout(() => setVisible(v => [true, false, false, false]), 100); 
        const t2 = setTimeout(() => setVisible(v => [true, true, false, false]), 600); 
        const t3 = setTimeout(() => setVisible(v => [true, true, true, false]), 1100); 
        const t4 = setTimeout(() => setVisible(v => [true, true, true, true]), 1600);
        
        timeoutsRef.current.push(t1, t2, t3, t4);
        
        const cycleT = setTimeout(checkCycleCondition, 12000);
        timerRef.current = cycleT;
    };

    const startExitSequence = () => {
        return new Promise<void>(resolve => {
            setVisible([false, false, false, false]); 
            const t = setTimeout(resolve, 500); 
            timeoutsRef.current.push(t);
        });
    };

    const checkCycleCondition = () => {
        if (!isHoveredRef.current) {
            if (engine) engine.cycleNextNode();
        } else {
            const t = setTimeout(checkCycleCondition, 1000);
            timerRef.current = t;
        }
    };

    if (!activeContent) return null;

    const Icon = activeContent.icon || User;
    let themeColor = '#10b981'; 
    let isLive = false;

    if (activeContent.category === 'live') {
        themeColor = '#ef4444'; 
        isLive = true;
    } else if (activeContent.category === 'bio') {
        themeColor = '#eab308'; 
    }

    const primaryLink = activeContent.context.sources.length > 0 ? activeContent.context.sources[0].url : null;

    return (
        <div 
            // FIXED LAYOUT:
            // Mobile: inset-0 (Full Screen) + pt-32 (Top Padding) -> Prevents overlap with Header
            // Desktop (md): Floating Card behavior restored
            className="absolute z-20 flex flex-col no-scrollbar
                       inset-0 pt-32 pb-20 px-4 overflow-y-auto 
                       md:overflow-visible md:inset-auto md:top-1/2 md:bottom-auto md:h-auto md:left-[60px] md:right-auto md:w-[500px] md:-translate-y-1/2 md:px-0 md:pb-0"
            onMouseEnter={() => !isTouch && setIsHovered(true)}
            onMouseLeave={() => !isTouch && setIsHovered(false)}
            onClick={() => isTouch && setIsHovered(!isHovered)} 
        >
            <style jsx>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
            
            {/* Mobile Gradient Fade at top of scroll area */}
            <div className="sticky top-0 h-8 w-full bg-gradient-to-b from-[#02040a] to-transparent z-10 md:hidden pointer-events-none"></div>

            <CardModule ref={card1Ref} title={activeContent.category === 'live' ? "LIVE_INTERCEPT" : "IDENTITY_SIGNAL"} color={themeColor} isVisible={visible[0]} delay={0} glow={isLive} date={activeContent.context.date}>
                <div className="flex items-center gap-3">
                    <div className={"p-2 rounded border " + (isLive ? 'bg-red-950/50 border-red-500/50' : 'bg-slate-800 border-slate-700')}>
                        <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </div>
                    <div className="pr-2 md:pr-8">
                        <h2 className="text-lg md:text-xl font-bold text-white leading-tight">{activeContent.headline.title}</h2>
                        <p className="text-[10px] md:text-xs text-slate-400 mt-1 font-mono">{activeContent.headline.subtitle}</p>
                    </div>
                </div>
            </CardModule>

            <CardModule ref={card2Ref} title={activeContent.context.label} color={themeColor} isVisible={visible[1]} delay={0} link={isLive ? primaryLink : null}>
                <p className="text-xs md:text-sm text-slate-300 mb-3 leading-relaxed pr-6">{activeContent.context.description}</p>
                <div className="flex gap-2 flex-wrap">
                    {!isLive && activeContent.context.sources.map((s, i) => (
                        <a key={i} href={s.url} target="_blank" rel="noreferrer" 
                           className="px-2 py-1 bg-blue-900/30 border border-blue-500/30 rounded text-[10px] text-blue-300 hover:bg-blue-900/50 transition-colors flex items-center gap-1">
                            <ExternalLink size={8}/> {s.label}
                        </a>
                    ))}
                    {isLive && (
                        <span className="text-[10px] text-red-400 font-mono flex items-center gap-1">
                            <Activity size={10} /> SOURCE VERIFIED
                        </span>
                    )}
                </div>
            </CardModule>

            <CardModule ref={card3Ref} title={activeContent.insight.label} color={themeColor} isVisible={visible[2]} delay={0}>
                 <div className="flex items-start gap-3">
                     <div className={"mt-1 " + (isLive ? 'text-red-500' : 'text-amber-500')}><Lightbulb size={16} /></div>
                     <p className="text-xs md:text-sm text-slate-200 leading-relaxed">
                         {activeContent.insight.explanation}
                     </p>
                 </div>
            </CardModule>

            <CardModule ref={card4Ref} title={activeContent.experience.label} color={themeColor} isVisible={visible[3]} delay={0}>
                <div className={"rounded p-3 border " + (isLive ? 'bg-red-950/20 border-red-500/20' : 'bg-emerald-950/30 border-emerald-500/20')}>
                     <div className="flex justify-between items-center mb-2">
                         <span className={"text-[10px] md:text-xs font-bold " + (isLive ? 'text-red-400' : 'text-emerald-400')}>{activeContent.experience.role}</span>
                         <span className={"text-[10px] px-2 py-0.5 rounded " + (isLive ? 'bg-red-500/20 text-red-300' : 'bg-emerald-500/20 text-emerald-300')}>
                             {activeContent.experience.result}
                         </span>
                     </div>
                     <p className="text-[10px] md:text-xs text-slate-300 mb-2">{activeContent.experience.action}</p>
                     <div className="flex gap-1 flex-wrap">
                         {activeContent.experience.tags.map(t => (
                             <span key={t} className="text-[9px] text-slate-500 border border-slate-700 px-1.5 rounded">{t}</span>
                         ))}
                     </div>
                </div>
            </CardModule>
            
            <div className="mt-4 pb-4 flex items-center gap-3 animate-in fade-in duration-700 pl-1 shrink-0">
                <div className={"flex items-center gap-2 px-3 py-1.5 rounded-full border backdrop-blur-md text-[10px] font-mono tracking-widest uppercase transition-all " + (
                    isHovered 
                    ? 'bg-red-500/10 border-red-500/50 text-red-400 shadow-[0_0_15px_rgba(220,38,38,0.4)]' 
                    : 'bg-slate-900/50 border-slate-700/50 text-slate-500'
                )}>
                    {isHovered ? (
                        <><PauseCircle size={12} className="animate-pulse" />System Paused</>
                    ) : (
                        <><MousePointer2 size={12} />{isTouch ? "Tap to Pause" : "Hover to Pause"}</>
                    )}
                </div>
                
                {!isHovered && (
                    <div className="h-0.5 bg-slate-800 w-16 md:w-24 rounded-full overflow-hidden">
                        <div 
                            key={activeContent.id} 
                            className="h-full bg-slate-500/50 animate-progress origin-left"
                        ></div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HeroContainer;
