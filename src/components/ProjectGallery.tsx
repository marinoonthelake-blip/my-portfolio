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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {projects.map((p) => (
          <button
            key={p.id}
            id={p.id} // <--- THIS IS THE NEW ANCHOR ID
            onClick={() => setSelected(p)}
            className="group relative flex flex-col items-start p-6 border border-gray-800 bg-[#111] hover:border-[#0070F3] transition-colors text-left w-full overflow-hidden"
          >
            <div className="absolute inset-0 bg-[#0070F3]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative text-xs font-mono text-[#0070F3] mb-2 z-10">{p.category}</span>
            <h3 className="relative text-xl font-sans font-bold text-white mb-2 group-hover:translate-x-1 transition-transform z-10">{p.title}</h3>
            <p className="relative text-sm text-gray-400 font-sans line-clamp-3 z-10">{p.summary}</p>
          </button>
        ))}
      </div>
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <div ref={modalRef} onClick={(e) => e.stopPropagation()} className="bg-[#050505] border border-gray-700 p-8 max-w-2xl w-full shadow-2xl relative">
            <button onClick={() => setSelected(null)} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors">✕</button>
            <div className="text-[#0070F3] font-mono text-sm mb-2">{selected.category}</div>
            <h2 className="text-3xl font-sans font-bold text-white mb-4">{selected.title}</h2>
            <p className="text-gray-300 mb-6 leading-relaxed text-sm">{selected.summary}</p>
            <div className="flex flex-wrap gap-2">
              {selected.tech.map((t) => (<span key={t} className="px-2 py-1 bg-gray-900 border border-gray-700 text-gray-300 text-xs font-mono rounded">{t}</span>))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}