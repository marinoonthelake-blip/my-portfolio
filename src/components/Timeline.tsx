"use client";
import { useState, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

type Project = {
  id: string;
  title: string;
  category: string;
  tech: string[];
  summary: string;
  image: string;
  status: "LIVE" | "INTERNAL" | "ARCHIVED";
  impact: string;
};

export default function ProjectGallery({ projects }: { projects: Project[] }) {
  const [selected, setSelected] = useState<Project | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (selected && modalRef.current) {
      gsap.fromTo(modalRef.current, { opacity: 0, scale: 0.95, y: 20 }, { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: "power3.out" });
    }
  }, [selected]);

  return (
    <>
      <div className="flex items-center justify-between mb-12 border-b border-gray-800 pb-6">
         <div>
            <h3 className="font-mono text-sm text-[#0070F3] tracking-widest mb-2 uppercase">Project Portfolio</h3>
            <h2 className="text-3xl font-sans font-bold text-white">Key Initiatives</h2>
         </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {projects.map((p) => (
          <button key={p.id} id={p.id} onClick={() => setSelected(p)} className="group relative flex flex-col justify-between p-8 border border-gray-800 bg-[#0a0a0a] hover:border-[#0070F3] hover:bg-[#0070F3]/5 transition-all duration-300 text-left h-[320px] overflow-hidden">
            <div className="absolute top-4 right-4 px-2 py-1 bg-white/5 border border-white/10 rounded text-[9px] font-mono text-gray-400 group-hover:text-white group-hover:border-white/30">{p.status}</div>
            <div className="z-10">
               <span className="block text-xs font-mono text-[#0070F3] mb-3 tracking-widest uppercase opacity-70 group-hover:opacity-100">{p.category}</span>
               <h3 className="text-2xl font-sans font-bold text-white mb-4 group-hover:translate-x-1 transition-transform">{p.title}</h3>
               <p className="text-sm text-gray-400 font-sans leading-relaxed line-clamp-3">{p.summary}</p>
            </div>
            <div className="z-10 pt-6 border-t border-gray-800/50 w-full">
               <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    {p.tech.slice(0, 2).map(t => (<span key={t} className="text-[10px] font-mono text-gray-500 bg-black/50 px-1 rounded">{t}</span>))}
                  </div>
                  <span className="text-xs font-mono text-[#00FF94]">{p.impact}</span>
               </div>
            </div>
          </button>
        ))}
      </div>
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <div ref={modalRef} onClick={(e) => e.stopPropagation()} className="bg-[#050505] border border-white/10 p-8 md:p-12 max-w-3xl w-full shadow-2xl relative rounded-xl">
            <button onClick={() => setSelected(null)} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors">✕</button>
            <div className="grid md:grid-cols-2 gap-12">
               <div className="bg-gray-900 border border-gray-800 flex flex-col items-center justify-center relative aspect-square rounded-lg overflow-hidden">
                  <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
                  <span className="text-4xl mb-4">📂</span>
                  <span className="text-xs font-mono text-gray-500">PROJECT ASSET</span>
               </div>
               <div>
                  <div className="flex items-center gap-3 mb-4">
                     <span className="px-2 py-1 bg-[#0070F3] text-white text-[10px] font-mono font-bold rounded">{selected.status}</span>
                     <span className="text-[#0070F3] font-mono text-xs tracking-widest">{selected.category}</span>
                  </div>
                  <h2 className="text-4xl font-sans font-bold text-white mb-6">{selected.title}</h2>
                  <p className="text-lg text-gray-300 leading-relaxed mb-8">{selected.summary}</p>
                  <div className="space-y-4">
                     <div>
                        <h4 className="text-xs font-mono text-gray-500 uppercase mb-2">Business Impact</h4>
                        <p className="text-[#00FF94] font-mono text-sm border-l-2 border-[#00FF94] pl-3">{selected.impact}</p>
                     </div>
                     <div>
                        <h4 className="text-xs font-mono text-gray-500 uppercase mb-2">Technology Stack</h4>
                        <div className="flex flex-wrap gap-2">
                           {selected.tech.map(t => (<span key={t} className="px-2 py-1 border border-white/10 text-gray-300 text-xs font-mono rounded bg-white/5">{t}</span>))}
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}