import ExperienceTimeline from "../components/Timeline";
import ProjectGallery from "../components/ProjectGallery";
import ConstellationWrapper from "../components/ConstellationWrapper";
import LogoTicker from "../components/LogoTicker";
import ImpactMetrics from "../components/ImpactMetrics";

// ... (Keep projectData and careerData arrays as they are) ...
const projectData = [
  {
    id: "slide-sense",
    title: "SlideSense",
    category: "AI Governance & Ops",
    tech: ["Gemini API", "NLP", "React"],
    image: "/slide-sense.jpg", 
    summary: "Operationalizing AI to automate executive review cycles, saving $300k+ in management overhead annually."
  },
  {
    id: "stevie",
    title: "Stevie",
    category: "Policy & Accessibility",
    tech: ["Speech-to-Text", "Generative AI", "A11y"],
    image: "/stevie.jpg", 
    summary: "Engineered compliance with WCAG 2.1 AA standards via a neural audio interface for visually impaired staff."
  },
  {
    id: "beyond-the-map",
    title: "Beyond the Map",
    category: "Geopolitical Strategy",
    tech: ["WebGL", "360 Video", "GIS"],
    image: "/beyondthemap.jpg",
    summary: "Digital enfranchisement initiative for 1.4M citizens in Rio, merging Google technology with NGO diplomacy."
  }
];

const careerData = [
  {
    role: "Technical Program Manager / Creative Lead",
    company: "Google",
    date: "2015 - Present",
    desc: "Leading multi-million dollar global vendor operations and pioneering GenAI internal tooling.",
  },
  {
    role: "Motion Graphics Director",
    company: "Boombox",
    date: "2010 - 2015",
    desc: "Scaled creative production teams and established QA pipelines for high-velocity commercial campaigns.",
  },
  {
    role: "Creative Technologist",
    company: "Oddcast",
    date: "2006 - 2010",
    desc: "Architected server-side personalized video engines for viral campaigns (Monk-e-Mail, 50M+ users).",
  }
];

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-[#050505] overflow-x-hidden">
      
      {/* SECTION 1: THE NEURAL HERO */}
      <div className="relative w-full h-screen overflow-hidden">
        <ConstellationWrapper />
        
        {/* Subtle scroll indicator */}
        <div className="absolute bottom-10 left-0 right-0 flex justify-center pointer-events-none">
           <span className="text-xs font-mono text-gray-500 animate-bounce">
             SCROLL TO EXPLORE ↓
           </span>
        </div>
      </div>

      <div className="relative z-20 bg-[#050505] border-t border-gray-900">
        <LogoTicker />
        <ImpactMetrics />
        
        <section className="w-full max-w-6xl mx-auto px-[24px] md:px-[64px] py-20">
           <h2 className="text-2xl font-sans font-bold text-white mb-12 border-b border-gray-800 pb-4">
            Selected Operations
          </h2>
          <ProjectGallery projects={projectData} /> 
        </section>

        <section className="w-full max-w-4xl mx-auto px-[24px] md:px-[64px] pb-20">
          <h2 className="text-2xl font-sans font-bold text-white mb-12 border-b border-gray-800 pb-4">
            Command Log
          </h2>
          <ExperienceTimeline data={careerData} />
        </section>
      </div>
    </main>
  );
}