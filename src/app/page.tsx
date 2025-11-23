import Hero from "../components/Hero";
import ExperienceTimeline from "../components/Timeline";

// This is your resume data
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
      {/* The Hero Section */}
      <Hero 
        full_name="Jonathan William Marino"
        tagline="Weaponizing technical curiosity."
        cta_text="View Projects"
      />
      
      {/* The Timeline Section */}
      <section className="w-full max-w-4xl mx-auto px-[64px] pb-20">
        <h2 className="text-2xl font-sans font-bold text-white mb-12 border-b border-gray-800 pb-4">
          Command Log
        </h2>
        <ExperienceTimeline data={careerData} />
      </section>
    </main>
  );
}