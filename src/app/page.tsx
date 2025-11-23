import Hero from "../components/Hero";
import ExperienceTimeline from "../components/Timeline";
import ProjectGallery from "../components/ProjectGallery";

// 1. Project Data (Narrator Output)
const projectData = [
  {
    id: "slide-sense",
    title: "SlideSense",
    category: "Enterprise AI",
    tech: ["Python", "Computer Vision", "NLP"],
    image: "", // Placeholder
    summary: "Automated corporate presentation review tool saving 1000s of management hours by analyzing slide density."
  },
  {
    id: "stevie",
    title: "Stevie",
    category: "Accessibility (A11y)",
    tech: ["Gemini API", "TTS", "React"],
    image: "", // Placeholder
    summary: "Audio-first interface allowing visually impaired users to converse with Gemini. Featured internal tool."
  },
  {
    id: "monk-e-mail",
    title: "Monk-e-Mail",
    category: "Viral Web",
    tech: ["Server-Side Rendering", "Legacy Flash"],
    image: "", // Placeholder
    summary: "Pioneering viral campaign with 50M+ visitors. One of the first instances of dynamic server-side video personalization."
  }
];

// 2. Resume Data
const careerData = [
  {
    role: "AI Engineer / Technical Program Manager",
    company: "Google",
    date: "2015 - Present",
    desc: "Democratized Gemini AI for visually impaired users via 'Stevie' and led 3D Swirl ad adoption.",
  },
  {
    role: "Motion Graphics Director",
    company: "Boombox",
    date: "2010 - 2015",
    desc: "Managed commercial production pipelines and transitioned team from video to interactive code.",
  },
  {
    role: "Creative Technologist",
    company: "Oddcast",
    date: "2006 - 2010",
    desc: "Pioneered server-side rendering for viral campaigns like 'Monk-e-Mail' (50M+ visitors).",
  }
];

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-[#050505]">
      {/* Hero */}
      <Hero 
        full_name="Jonathan William Marino"
        tagline="Weaponizing technical curiosity."
        cta_text="View Projects"
      />
      
      {/* Project Gallery */}
      <section className="w-full max-w-6xl mx-auto px-[64px] py-20">
         <h2 className="text-2xl font-sans font-bold text-white mb-12 border-b border-gray-800 pb-4">
          Selected Operations
        </h2>
        <ProjectGallery projects={projectData} /> 
      </section>

      {/* Timeline */}
      <section className="w-full max-w-4xl mx-auto px-[64px] pb-20">
        <h2 className="text-2xl font-sans font-bold text-white mb-12 border-b border-gray-800 pb-4">
          Command Log
        </h2>
        <ExperienceTimeline data={careerData} />
      </section>
    </main>
  );
}