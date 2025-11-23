"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { z } from "zod";

// 1. Schema Definition (Component Governance)
const HeroSchema = z.object({
  full_name: z.string().min(1, "Name is required"),
  tagline: z.string(),
  cta_text: z.string(),
});

// Derive TypeScript interface from Zod Schema
type HeroProps = z.infer<typeof HeroSchema>;

export default function Hero({ full_name, tagline, cta_text }: HeroProps) {
  // Validate props at runtime (Optional but recommended by Rule #3)
  const validProps = HeroSchema.parse({ full_name, tagline, cta_text });

  const containerRef = useRef<HTMLElement>(null);

  // 2. Motion Logic (GSAP)
  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Motion Logic: timeline.from('.hero-title', { y: 40, opacity: 0 })
      tl.from(".hero-title", {
        y: 40,
        opacity: 0,
        duration: 1,
      })
        .from(
          ".hero-tagline",
          {
            y: 20,
            opacity: 0,
            duration: 0.8,
          },
          "-=0.6"
        )
        .from(
          ".hero-cta",
          {
            y: 10,
            opacity: 0,
            duration: 0.5,
          },
          "-=0.4"
        );
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      // Token Mapping: bg.main (#050505), space.1600 (64px)
      className="flex min-h-screen w-full flex-col justify-center bg-[#050505] p-[64px]"
    >
      <div className="max-w-4xl">
        {/* Content: Full Name */}
        {/* Token Mapping: Font Sans (Inter) */}
        <h1 className="hero-title mb-4 font-sans text-5xl font-bold tracking-tight text-white md:text-7xl">
          {validProps.full_name}
        </h1>

        {/* Content: Tagline */}
        {/* Token Mapping: Font Mono (JetBrains Mono), Text Accent (#0070F3) */}
        <p className="hero-tagline mb-12 max-w-2xl font-mono text-xl text-[#0070F3]">
          {validProps.tagline}
        </p>

        {/* Content: CTA */}
        <div className="hero-cta">
          <button
            type="button"
            className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md border border-[#0070F3] bg-transparent px-6 font-medium text-white transition-all hover:bg-[#0070F3]/10"
          >
            <span className="mr-2">{validProps.cta_text}</span>
            <span className="transition-transform group-hover:translate-x-1">
              &rarr;
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}