"use client";
import { useState, useEffect } from 'react';
import NeuralTerminal from './components/NeuralTerminal';
import NeuralBackground from './components/brain/NeuralBackground';
import { PROFILE_NODE, STATIC_NODES } from './components/brain/NeuralData';
import { HeroContent } from './components/brain/NeuralData';

export default function Home() {
  const [showTerminal, setShowTerminal] = useState(true);
  const [userContext, setUserContext] = useState<any>(null);
  const [liveHeroes, setLiveHeroes] = useState<any[]>([]);
  const [fullContextData, setFullContextData] = useState<any>(null);

  useEffect(() => {
    const ctx = {
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      city: Intl.DateTimeFormat().resolvedOptions().timeZone.split('/')[1] || "Global", 
      device: /Mobi|Android/i.test(navigator.userAgent) ? "Mobile" : "Desktop"
    };
    setUserContext(ctx);

    fetch('/api/live-agent', {
      method: 'POST',
      body: JSON.stringify({ userContext: ctx })
    })
    .then(res => res.json())
    .then(data => {
      if (data.items) {
        setLiveHeroes(data.items);
        setFullContextData(data); // Store full response for resume generation
      }
    })
    .catch(err => console.error("API Error:", err));
  }, []);

  const mergedData: HeroContent[] = [PROFILE_NODE, ...liveHeroes, ...STATIC_NODES];

  const handleDownloadResume = async () => {
    if (!fullContextData || !fullContextData.items || fullContextData.items.length === 0) {
      alert("System not yet synthesized. Please wait or refresh.");
      return;
    }

    // The first card (Index 0) is the Profile Node, the second (Index 1) is the first Live Card.
    const currentHero = mergedData[0]; // The active card is most relevant, but we use the Profile for consistency
    const firstLiveCard = fullContextData.items[0]; // Use the actual first live card for context

    const response = await fetch('/api/generate-resume', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        currentHero: currentHero, 
        fullContext: fullContextData // Pass the entire live payload
      }),
    });

    if (response.ok) {
      const blob = await response.blob();
      const filename = response.headers.get('Content-Disposition')?.split('filename=')[1].replace(/"/g, '') || 'JWM_Contextual_Resume.md';
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } else {
      alert('Failed to generate contextual resume. Check console for API error.');
    }
  };

  return (
    <main className="min-h-screen bg-black text-white font-sans selection:bg-blue-500 selection:text-white">
      
      {/* 1. CINEMATIC INTRO */}
      {showTerminal && (
        <NeuralTerminal 
          context={userContext} 
          onComplete={() => setShowTerminal(false)} 
        />
      )}

      {/* 2. THE NEURAL HERO (Above the Fold) */}
      <div className={`transition-opacity duration-1000 ${showTerminal ? 'opacity-0 fixed' : 'opacity-100 relative'}`}>
        
        <NeuralBackground customData={mergedData} />
        
        {/* Scroll CTA - New Static/Visible CTA */}
        <div 
            onClick={() => document.getElementById('full-dossier')?.scrollIntoView({ behavior: 'smooth' })}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center cursor-pointer transition-opacity duration-300 hover:opacity-100 hover:scale-105"
            style={{ zIndex: 30 }}
        >
          <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-2 shadow-text">SCROLL FOR FULL DOSSIER</p>
          <svg className="w-6 h-6 text-gray-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
        </div>


        {/* 3. THE FULL DOSSIER (Below the Fold) */}
        <div id="full-dossier" className="relative z-10 bg-black border-t border-gray-900">
          
          {/* BIO SECTION */}
          <section id="bio" className="py-32 px-6 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
              <div className="relative group">
                <div className="absolute -inset-4 border border-blue-900/50 rounded-lg group-hover:border-blue-500/50 transition-colors duration-500"></div>
                <img 
                  src="/profile.png" 
                  alt="Jonathan William Marino" 
                  className="relative w-full h-[600px] object-cover rounded shadow-2xl grayscale group-hover:grayscale-0 transition-all duration-700"
                />
              </div>
              <div>
                <h2 className="text-xs font-mono text-blue-500 uppercase tracking-widest mb-6">The Architect</h2>
                <h3 className="text-4xl font-serif font-bold mb-8">From E-Trade Babies to Enterprise Policy.</h3>
                <p className="text-gray-400 text-lg leading-relaxed mb-6">
                  I don't just write code; I build <strong>Integrity Infrastructure</strong>. My career has been defined by the synthesis of creative chaos and rigorous engineering.
                </p>
                <p className="text-gray-400 text-lg leading-relaxed mb-8">
                  At Google, I architected the systems that protect billions of users (TRACE). Before that, I designed the viral campaigns that defined the Web 2.0 era (Oddcast). I bridge the gap between "Make it Look Good" and "Make it Scale."
                </p>
                <div className="grid grid-cols-2 gap-8 mt-12 border-t border-gray-900 pt-8">
                  <div>
                    <p className="text-4xl font-bold text-white mb-2">12+</p>
                    <p className="text-xs font-mono text-gray-500 uppercase">Years at Google</p>
                  </div>
                  <div>
                    <p className="text-4xl font-bold text-white mb-2">$XM</p>
                    <p className="text-xs font-mono text-gray-500 uppercase">Supply Chain Managed</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 5 STRATEGIC INTERVENTIONS */}
          <section id="strategy" className="py-32 bg-gray-950 px-6 border-y border-gray-900">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-20 border-b border-gray-900 pb-4">Strategic Executions (The Full Career Arc)</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-32">
                
                {/* EXECUTION 1: PIONEERING VIRAL ENGINEERING */}
                <div className="group">
                  <div className="bg-gray-900 h-64 rounded mb-8 border border-gray-800 group-hover:border-blue-900 transition-colors flex items-center justify-center overflow-hidden relative">
                     <img src="/projects/immersive.png" alt="Viral Engineering" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-4 group-hover:text-blue-500 transition-colors">Pioneering Viral Engineering (Oddcast)</h3>
                  <p className="text-gray-400 leading-relaxed mb-6">
                    <strong>The Strategy:</strong> Defined the early web's personalized, interactive standard by architecting server-side rendering for Monk-e-Mail and using 3D/Motion Capture for the E-Trade Baby campaign.
                  </p>
                  <p className="text-gray-400 leading-relaxed mb-6">
                    <strong>The Impact:</strong> 50 Million+ visitors; created Super Bowl icons; mastered full-stack pioneer capability.
                  </p>
                  <div className="flex gap-4 mt-8">
                    <span className="px-3 py-1 bg-gray-900 text-xs font-mono text-gray-300 rounded border border-gray-800">Viral Scale</span>
                    <span className="px-3 py-1 bg-gray-900 text-xs font-mono text-gray-300 rounded border border-gray-800">3D/Motion Capture</span>
                  </div>
                </div>

                {/* EXECUTION 2: RAPID ASCENT & CREATIVE LEADERSHIP */}
                <div className="group">
                  <div className="bg-gray-900 h-64 rounded mb-8 border border-gray-800 group-hover:border-blue-900 transition-colors flex items-center justify-center overflow-hidden relative">
                     <img src="/projects/global-ops.png" alt="Creative Leadership" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-4 group-hover:text-blue-500 transition-colors">Rapid Ascent & Creative Leadership (Boombox)</h3>
                  <p className="text-gray-400 leading-relaxed mb-6">
                    <strong>The Strategy:</strong> Evolved from individual editor to Motion Graphics Director in a compressed timeframe, demonstrating high-potential talent for operational scaling and high-stakes client relations.
                  </p>
                  <p className="text-gray-400 leading-relaxed mb-6">
                    <strong>The Impact:</strong> Built a full production powerhouse and managed multiple award-winning campaigns, proving organizational leadership early in career.
                  </p>
                  <div className="flex gap-4 mt-8">
                    <span className="px-3 py-1 bg-gray-900 text-xs font-mono text-gray-300 rounded border border-gray-800">Organizational Scale</span>
                    <span className="px-3 py-1 bg-gray-900 text-xs font-mono text-gray-300 rounded border border-gray-800">High-Stakes Delivery</span>
                  </div>
                </div>

                {/* EXECUTION 3: GLOBAL PRODUCTION ARCHITECTURE */}
                <div className="group">
                  <div className="bg-gray-900 h-64 rounded mb-8 border border-gray-800 group-hover:border-blue-900 transition-colors flex items-center justify-center overflow-hidden relative">
                     <img src="/projects/global-ops.png" alt="Global Production" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-4 group-hover:text-blue-500 transition-colors">Global Production Architecture (Early Google)</h3>
                  <p className="text-gray-400 leading-relaxed mb-6">
                    <strong>The Strategy:</strong> Unify fragmented creative supply chains across APAC, EMEA, and AMER into a single, scalable production architecture. Authored foundational SOPs and managed vendor vetting.
                  </p>
                  <p className="text-gray-400 leading-relaxed mb-6">
                    <strong>The Impact:</strong> Converted an internal team into a multi-million dollar operation, ensuring quality control and speed across 3 continents.
                  </p>
                  <div className="flex gap-4 mt-8">
                    <span className="px-3 py-1 bg-gray-900 text-xs font-mono text-gray-300 rounded border border-gray-800">Vendor Management</span>
                    <span className="px-3 py-1 bg-gray-900 text-xs font-mono text-gray-300 rounded border border-gray-800">Operational Scaling</span>
                  </div>
                </div>

                {/* EXECUTION 4: AI-DRIVEN ENTERPRISE EFFICIENCY */}
                <div className="group">
                  <div className="bg-gray-900 h-64 rounded mb-8 border border-gray-800 group-hover:border-blue-900 transition-colors flex items-center justify-center overflow-hidden relative">
                     <img src="/projects/slidesense.png" alt="AI Efficiency" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-4 group-hover:text-blue-500 transition-colors">AI-Driven Enterprise Efficiency (Mid Google)</h3>
                  <p className="text-gray-400 leading-relaxed mb-6">
                    <strong>The Strategy:</strong> Applied AI/NLP/Gemini to internal friction points, building tools like SlideSense and Stevie to drive internal productivity and accessibility.
                  </p>
                  <p className="text-gray-400 leading-relaxed mb-6">
                    <strong>The Impact:</strong> Saved thousands of management hours by automating executive presentation review and democratizing LLM access for visually impaired users (A11y).
                  </p>
                  <div className="flex gap-4 mt-8">
                    <span className="px-3 py-1 bg-gray-900 text-xs font-mono text-gray-300 rounded border border-gray-800">NLP/Vision AI</span>
                    <span className="px-3 py-1 bg-gray-900 text-xs font-mono text-gray-300 rounded border border-gray-800">Product-Led Growth</span>
                  </div>
                </div>

                {/* EXECUTION 5: FRICTIONLESS POLICY INTEGRITY (Current Google - Full Width) */}
                <div className="group col-span-1 md:col-span-2 border-t border-gray-800 pt-16">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                    <div className="order-2 md:order-1">
                      <h3 className="text-3xl font-bold text-white mb-4 group-hover:text-blue-500 transition-colors">Frictionless Policy Integrity (Tech Lead)</h3>
                      <p className="text-gray-400 leading-relaxed mb-6">
                        <strong>The Strategy:</strong> Design and architect high-scale data solutions (TRACE) that actively identify and eliminate policy friction, ensuring fairness and integrity across global operations.
                      </p>
                      <p className="text-gray-400 leading-relaxed mb-6">
                        <strong>The Impact:</strong> Reduced customer dissatisfaction, protected policy consistency, and built predictive tools to manage high-risk compliance issues at scale.
                      </p>
                      <div className="flex gap-4 mt-8">
                        <span className="px-3 py-1 bg-gray-900 text-xs font-mono text-gray-300 rounded border border-gray-800">Data Governance</span>
                        <span className="px-3 py-1 bg-gray-900 text-xs font-mono text-gray-300 rounded border border-gray-800">Risk Mitigation</span>
                      </div>
                    </div>
                    <div className="order-1 md:order-2 bg-gray-900 h-64 rounded border border-gray-800 group-hover:border-blue-900 transition-colors flex items-center justify-center overflow-hidden relative">
                       <img src="/projects/trace.png" alt="TRACE Mapping" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* TIMELINE */}
          <section id="timeline" className="py-32 px-6 max-w-4xl mx-auto">
            <h2 className="text-center text-xs font-mono text-gray-500 uppercase tracking-widest mb-20">The Impact Ladder</h2>
            <div className="relative border-l-2 border-gray-800 pl-12 space-y-24">
              
              <div className="relative group">
                <span className="absolute -left-[54px] top-1 h-4 w-4 rounded-full bg-blue-600 border-4 border-black group-hover:scale-150 transition-transform"></span>
                <p className="text-xs font-mono text-blue-500 mb-2">2015 - PRESENT</p>
                <h3 className="text-3xl font-bold text-white">Tech Lead, Policy & Trust Safety @ Google</h3>
                <p className="mt-4 text-gray-400 text-lg leading-relaxed">Architecting global data solutions. Managing crisis response. Building AI tooling (SlideSense, Stevie). Led global production for APAC/EMEA.</p>
              </div>

              <div className="relative group">
                <span className="absolute -left-[54px] top-1 h-4 w-4 rounded-full bg-gray-700 border-4 border-black group-hover:bg-white transition-colors"></span>
                <p className="text-xs font-mono text-gray-500 mb-2">2010 - 2015</p>
                <h3 className="text-3xl font-bold text-white">Motion Graphics Director @ Boombox</h3>
                <p className="mt-4 text-gray-400 text-lg leading-relaxed">Evolved from singular editor to Director. Built internal creative production powerhouse from scratch. Managed award-winning campaigns.</p>
              </div>

               <div className="relative group">
                <span className="absolute -left-[54px] top-1 h-4 w-4 rounded-full bg-gray-700 border-4 border-black group-hover:bg-white transition-colors"></span>
                <p className="text-xs font-mono text-gray-500 mb-2">2006 - 2010</p>
                <h3 className="text-3xl font-bold text-white">Production Designer @ Oddcast</h3>
                <p className="mt-4 text-gray-400 text-lg leading-relaxed">Designed "Elf Yourself" and "E-Trade Babies." Pioneered personalized viral interactivity and AR applications.</p>
              </div>

            </div>
          </section>

          <footer className="py-20 border-t border-gray-900 text-center">
            <div className="flex justify-center gap-4 mb-8">
               <button onClick={handleDownloadResume} className="bg-blue-600 hover:bg-blue-700 text-white uppercase text-sm tracking-widest transition-colors px-6 py-3 rounded-lg font-bold shadow-lg">Download Contextual Resume</button>
               <button className="border border-gray-700 text-gray-500 px-6 py-3 uppercase text-xs tracking-widest transition-colors hover:text-white hover:border-white font-bold">Contact</button>
            </div>
            <p className="text-xs font-mono text-gray-600">
              JONATHAN WILLIAM MARINO // AI-POWERED PORTFOLIO V4.0 [ver. 0.1]
            </p>
          </footer>
        </div>
      </div>
    </main>
  );
}
