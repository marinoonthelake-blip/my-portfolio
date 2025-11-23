"use client";

import dynamic from 'next/dynamic';

// This dynamic import now lives safely inside a Client Component
const TechConstellation = dynamic(() => import('./TechConstellation'), { 
  ssr: false,
  loading: () => <div className="h-[600px] w-full bg-[#050505] animate-pulse" />
});

export default function ConstellationWrapper() {
  return <TechConstellation />;
}