"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function Hero() {
  const containerRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    
    tl.from(".hero-label", { y: 20, opacity: 0, duration: 0.8 })
      .from(".hero-title", { y: 40, opacity: 0, duration: 1 }, "-=0.6")
      .from(".hero-desc", { y: 20, opacity: 0, duration: 0.8 }, "-=0.6")
      .from(".hero-cta", { y: 20, opacity: 0, duration: 0.5 }, "-=0.4");
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative z-10 flex min-h-[80vh] w-full flex-col justify-center px-[24px] md:px-[64px] pt-32">
      <div className="max-w-5xl">
        <span className="hero-label block font-mono text-[#0070F3] text-sm mb-4 tracking-widest uppercase">
          Strategic Technology Executive | Policy Architect
        </span>

        <h1 className="hero-title mb-6 font-sans text-5xl font-bold tracking-tight text-white md:text-8xl leading-[0.9]">
          Solving systemic challenges at the intersection of <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0070F3] to-[#00FF94]">Geopolitics, Data, & Design.</span>
        </h1>

        <p className="hero-desc mb-10 max-w-2xl font-sans text-xl text-gray-400 leading-relaxed">
          Bridging the gap between Boardroom Strategy and Backend Reality. 
          Architecting digital enfranchisement, automated governance, and high-fidelity creative intelligence.
        </p>

        <div className="hero-cta flex gap-4">
          <button className="group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-none border border-[#0070F3] bg-transparent px-8 font-medium text-white transition-all hover:bg-[#0070F3]/10">
            <span className="mr-2 font-mono">View Case Studies</span>
            <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
          </button>
        </div>
      </div>
    </section>
  );
}