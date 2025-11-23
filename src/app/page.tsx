import Hero from "../components/Hero";
import ExperienceTimeline from "../components/Timeline";
import ProjectGallery from "../components/ProjectGallery";
import ConstellationWrapper from "../components/ConstellationWrapper";
import LogoTicker from "../components/LogoTicker";
import ImpactMetrics from "../components/ImpactMetrics";

// ... (Keep your projectData and careerData arrays as they are) ...

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-[#050505] overflow-x-hidden">
      
      {/* SECTION 1: THE IMMERSIVE OPENING */}
      <div className="relative w-full h-screen flex flex-col">
        
        {/* Layer 1: The Living Brain (Background) */}
        <div className="absolute inset-0 z-0">
          <ConstellationWrapper />
        </div>

        {/* Layer 2: The Hero Text (Foreground - with transparency) */}
        {/* We add pointer-events-none to the text container so you can click the nodes behind it */}
        <div className="relative z-10 pointer-events-none h-full flex flex-col justify-center">
           {/* Pass a prop to Hero to tell it to be transparent/overlay style if needed, 
               or just use it as is but ensure it doesn't block clicks */}
           <div className="pointer-events-auto"> 
              {/* Wrap Hero in pointer-events-auto ONLY where buttons are */}
              <Hero /> 
           </div>
        </div>
      </div>

      <LogoTicker />
      <ImpactMetrics />
      
      <section className="w-full max-w-6xl mx-auto px-[24px] md:px-[64px] py-20 relative z-10 bg-[#050505]">
         <h2 className="text-2xl font-sans font-bold text-white mb-12 border-b border-gray-800 pb-4">
          Selected Operations
        </h2>
        <ProjectGallery projects={projectData} /> 
      </section>

      <section className="w-full max-w-4xl mx-auto px-[24px] md:px-[64px] pb-20 relative z-10 bg-[#050505]">
        <h2 className="text-2xl font-sans font-bold text-white mb-12 border-b border-gray-800 pb-4">
          Command Log
        </h2>
        <ExperienceTimeline data={careerData} />
      </section>
    </main>
  );
}