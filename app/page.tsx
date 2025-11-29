"use client";
import { useState, useEffect } from 'react';
import CinematicIntro from './components/CinematicIntro';
import NeuralBackground from './components/brain/NeuralBackground';
import ExecutiveProfile from './components/ExecutiveProfile';
import { MASTER_GEMS } from './data/master_gems';

// Simple fallback structure for StrategyGenerator props
const EmptyFn = () => {};

export default function Home() {
  const [mode, setMode] = useState<'NEURAL' | 'PROFILE'>('NEURAL');
  const [showIntro, setShowIntro] = useState(true);
  const [showNav, setShowNav] = useState(false); 
  const [userContext] = useState({ city: "Global" });
  const [userPortfolio] = useState(MASTER_GEMS);

  const handleIntroComplete = () => {
      setShowIntro(false);
      // Delay Nav appearance by 1 second to let the Neural Web build first
      setTimeout(() => setShowNav(true), 1000); 
  };

  if (showIntro) {
    return <CinematicIntro context={userContext} onComplete={handleIntroComplete} />;
  }

  return (
    <main className="min-h-screen bg-black text-white font-sans">

      {/* NAVIGATION (Fade-In Controlled) */}
      <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-1000 ease-out ${showNav ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
          <div className="bg-gray-900/80 backdrop-blur-md border border-gray-700 rounded-full px-2 py-2 flex gap-2 shadow-2xl">
              <button onClick={() => setMode('NEURAL')} className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${mode === 'NEURAL' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}>Live Neural</button>
              <button onClick={() => setMode('PROFILE')} className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${mode === 'PROFILE' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}>Executive Bio</button>
              {/* REMOVED: Strategy Generator Button */}
          </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="pt-16">
        {mode === 'NEURAL' && <NeuralBackground active={!showIntro} />}
        {mode === 'PROFILE' && <ExecutiveProfile />}
        {/* REMOVED: Strategy Generator Component */}
      </div>

    </main>
  );
}
