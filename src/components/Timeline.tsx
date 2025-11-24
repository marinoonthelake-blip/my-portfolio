"use client";
import { useState } from "react";

// Define the shape of a Career History Item
type ExperienceItem = {
  id: string;
  role: string;
  company: string;
  date: string;
  location: string;
  mission: string;
  impact_metric: string;
  details: string[];
  tech_stack: string[];
};

export default function ExperienceTimeline({ data }: { data: ExperienceItem[] }) {
  // Default to the first item being open
  const [expandedId, setExpandedId] = useState<string | null>(data[0]?.id || null);

  return (
    <section className="w-full relative">
      
      {/* HEADER */}
      <div className="flex items-center justify-between mb-12 border-b border-gray-800 pb-6">
         <div>
            <h3 className="font-mono text-sm text-[#0070F3] tracking-widest mb-2 uppercase">
              Professional History
            </h3>
            <h2 className="text-3xl font-sans font-bold text-white">
              Career Trajectory
            </h2>
         </div>
         <div className="text-right hidden md:block">
            <div className="text-[10px] font-mono text-gray-500 mb-1">INDUSTRY TENURE</div>
            <div className="text-xl font-mono text-[#00FF94]">15+ YEARS</div>
         </div>
      </div>

      {/* TIMELINE LIST */}
      <div className="relative border-l border-gray-800 ml-3 md:ml-0 space-y-8">
        {data.map((item) => {
          const isOpen = expandedId === item.id;
          
          return (
            <div 
              key={item.id} 
              id={item.id}
              className={`relative pl-8 md:pl-0 transition-all duration-500 ${isOpen ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}
            >
              {/* Interactive Dot */}
              <button 
                onClick={() => setExpandedId(isOpen ? null : item.id)}
                className={`absolute left-[-5px] top-0 w-3 h-3 rounded-full border transition-all duration-300 z-10
                  ${isOpen ? 'bg-[#0070F3] border-[#0070F3] shadow-[0_0_10px_#0070F3]' : 'bg-black border-gray-600 hover:border-white'}
                `}
              />

              {/* Card Container */}
              <div 
                className={`
                  md:ml-12 border-l-2 p-6 cursor-pointer transition-all duration-500
                  ${isOpen ? 'border-[#0070F3] bg-white/5' : 'border-transparent hover:border-gray-700'}
                `}
                onClick={() => setExpandedId(isOpen ? null : item.id)}
              >
                {/* Role Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold font-sans text-white mb-1">
                      {item.role}
                    </h3>
                    <div className="flex items-center gap-3 text-sm font-mono">
                      <span className="text-[#0070F3]">{item.company}</span>
                      <span className="text-gray-600">|</span>
                      <span className="text-gray-400">{item.date}</span>
                    </div>
                  </div>
                  
                  {/* Impact Badge */}
                  <div className={`mt-4 md:mt-0 px-3 py-1 rounded border border-white/10 bg-black/50 text-xs font-mono ${isOpen ? 'text-[#00FF94]' : 'text-gray-500'}`}>
                    KEY IMPACT: {item.impact_metric}
                  </div>
                </div>

                {/* High Level Summary */}
                <p className="text-md text-gray-300 font-sans leading-relaxed mb-4">
                  <span className="text-gray-500 font-mono text-xs uppercase mr-2">// OVERVIEW:</span>
                  {item.mission}
                </p>

                {/* Expanded Details */}
                <div className={`overflow-hidden transition-all duration-500 ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="pt-4 border-t border-white/10">
                    <ul className="space-y-3 mb-6">
                      {item.details.map((detail, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-gray-400">
                          <span className="text-[#0070F3] mt-1">▸</span>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="flex flex-wrap gap-2">
                      {item.tech_stack.map((tech) => (
                        <span key={tech} className="px-2 py-1 text-[10px] font-mono border border-gray-700 rounded text-gray-500 hover:text-white hover:border-gray-500 transition-colors">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}