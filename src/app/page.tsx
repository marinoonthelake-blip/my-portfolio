import ExperienceTimeline from "../components/Timeline";
import ProjectGallery from "../components/ProjectGallery";
import ConstellationWrapper from "../components/ConstellationWrapper";
import LogoTicker from "../components/LogoTicker";
import ImpactMetrics from "../components/ImpactMetrics";
import LiveNewsFeed from "../components/LiveNewsFeed";

// --- 1. PROJECT DATA ---
const projectData = [
  {
    id: "slide-sense",
    title: "SlideSense",
    category: "Enterprise AI",
    status: "INTERNAL" as const,
    impact: "$300k+ Saved / Year",
    tech: ["Gemini API", "Computer Vision", "React", "Node.js"],
    image: "/slide-sense.jpg", 
    summary: "An AI-powered internal tool that automates the review of executive presentations. By using Computer Vision to analyze slide density and Gemini to audit narrative flow, it reclaims thousands of management hours annually."
  },
  {
    id: "stevie",
    title: "Stevie",
    category: "Accessibility (A11y)",
    status: "LIVE" as const,
    impact: "100% A11y Compliance",
    tech: ["Speech-to-Text", "Generative AI", "Web Speech API"],
    image: "/stevie.jpg", 
    summary: "A neural audio interface designed to democratize access to LLMs for visually impaired employees. 'Stevie' converts complex dashboard data into conversational audio, ensuring WCAG 2.1 AA compliance."
  },
  {
    id: "beyond-the-map",
    title: "Beyond the Map",
    category: "Digital Inclusion",
    status: "ARCHIVED" as const,
    impact: "1.4M Users Mapped",
    tech: ["WebGL", "360 Video", "GIS Data", "Google Maps API"],
    image: "/beyondthemap.jpg",
    summary: "A global initiative mapping the unmapped favelas of Rio de Janeiro. Partnered with AfroReggae and Google to provide digital addresses to 1.4 million residents, enabling access to banking and civic services."
  },
  {
    id: "monk-e-mail",
    title: "Monk-e-Mail",
    category: "Viral Engineering",
    status: "ARCHIVED" as const,
    impact: "50M+ Unique Visitors",
    tech: ["Server-Side Rendering", "Legacy Flash", "AWS"],
    image: "/monk.jpg",
    summary: "One of the first viral web applications in history. Architected a server-side video personalization engine that allowed 50 million users to customize and share avatars, defining the 'Web 2.0' era of marketing."
  },
  {
    id: "swirl-ads",
    title: "3D Swirl",
    category: "AdTech Infrastructure",
    status: "LIVE" as const,
    impact: "Global Format Standard",
    tech: ["WebGL", "glTF", "Three.js", "Google Ads SDK"],
    image: "/swirl.jpg",
    summary: "Pioneered the technical standards for 3D display advertising (Swirl). Led vendor training and engineering validation to move the industry from static banners to interactive, lightweight 3D models."
  },
  {
    id: "keyword-tool",
    title: "Global Keyword Engine",
    category: "Global Operations",
    status: "INTERNAL" as const,
    impact: "100% Adoption (Non-EN)",
    tech: ["Python", "NLP", "Google Ads API"],
    image: "/keyword.jpg",
    summary: "Solved a critical internationalization gap where internal tools only worked for English. Built a language-agnostic keyword theming engine adopted by all EMEA/APAC teams."
  }
];

// --- 2. CAREER DATA ---
const careerData = [
  {
    id: "exp-google",
    role: "Technical Program Manager / Creative Lead",
    company: "Google",
    date: "2015 - Present",
    location: "New York, NY",
    mission: "Orchestrate global creative operations and build internal GenAI infrastructure.",
    impact_metric: "SCALED VENDOR OPS TO MULTI-MILLION $",
    tech_stack: ["GCP", "Gemini", "SQL", "Python", "Looker"],
    details: [
      "Founded 'Production Creative Works', scaling a small internal team into a global operation across APAC, EMEA, and AMER.",
      "Architected 'SlideSense' and 'Stevie' internal tools, reducing operational friction via AI automation.",
      "Led technical rollout of '3D Swirl' and 'YouTube AR' formats, training external agencies on WebGL standards.",
      "Built custom analytics dashboards (CARTA) using GA4 and BigQuery to track asset performance."
    ]
  },
  {
    id: "exp-boombox",
    role: "Motion Graphics Director",
    company: "Boombox",
    date: "2010 - 2015",
    location: "New York, NY",
    mission: "Establish high-velocity production pipelines for commercial campaigns.",
    impact_metric: "DIRECTED SUPER BOWL CAMPAIGNS",
    tech_stack: ["After Effects", "Maya", "Deadline Render Farm"],
    details: [
      "Evolved from singular editor to Director, hiring and managing a team of motion designers and 3D artists.",
      "Established QA pipelines and file naming conventions for high-volume deliverables.",
      "Managed client relationships for Fortune 500 accounts including E*TRADE and Pepsi."
    ]
  },
  {
    id: "exp-oddcast",
    role: "Creative Technologist",
    company: "Oddcast",
    date: "2006 - 2010",
    location: "New York, NY",
    mission: "Engineer server-side personalization for viral web applications.",
    impact_metric: "50M+ USERS (MONK-E-MAIL)",
    tech_stack: ["Flash/ActionScript", "PHP", "FFmpeg", "TTS Engines"],
    details: [
      "Core engineer/artist for 'Monk-e-Mail' (CareerBuilder) and 'Elf Yourself' (OfficeMax).",
      "Developed real-time lip-syncing technology for the 'E-Trade Baby' campaign.",
      "Bridged the gap between character animation and dynamic code execution."
    ]
  }
];

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-[#050505] overflow-x-hidden">
      
      <LiveNewsFeed />

      <div className="relative w-full h-screen overflow-hidden">
        <ConstellationWrapper />
      </div>

      <div id="content-start" className="relative z-20 bg-[#050505] border-t border-gray-900 md:pr-80">
        <LogoTicker />
        <ImpactMetrics />
        
        <section className="w-full max-w-6xl mx-auto px-[24px] md:px-[64px] py-24">
           <div className="flex items-center gap-4 mb-12">
             <div className="h-[1px] bg-[#0070F3] w-12" />
             <h2 className="text-sm font-mono text-[#0070F3] tracking-widest uppercase">
               Key Initiatives
             </h2>
           </div>
           <h3 className="text-4xl font-sans font-bold text-white mb-16 max-w-3xl leading-tight">
            Selected Case Studies in <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0070F3] to-[#00FF94]">Technical Leadership.</span>
          </h3>
          <ProjectGallery projects={projectData} /> 
        </section>

        <section className="w-full max-w-4xl mx-auto px-[24px] md:px-[64px] pb-32">
          <div className="flex items-center gap-4 mb-12">
             <div className="h-[1px] bg-[#0070F3] w-12" />
             <h2 className="text-sm font-mono text-[#0070F3] tracking-widest uppercase">
               Career History
             </h2>
           </div>
          <ExperienceTimeline data={careerData} />
        </section>
      </div>
    </main>
  );
}