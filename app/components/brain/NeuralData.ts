export interface HeroContent {
  id?: string; 
  protocol?: string; 
  title: string; 
  description: string; 
  metrics?: string; 
  stack?: string[];
  sourceName?: string;
  sourceDate?: string;
  sourceUrl?: string;
  isLive?: boolean;
  // Fields for API response
  articleTitle?: string;
  articleSummary?: string;
}

export const PROFILE_NODE: HeroContent = { 
  id: "USER_001", 
  protocol: "ARCHITECT_PRIME", 
  title: "Jonathan William Marino", 
  description: "THE DIGITAL ARCHITECT. Tech Lead for Policy at Google. I build the systems that power the future of digital integrity, bridging the gap between creative vision and enterprise engineering.", 
  stack: ["Leadership", "Engineering", "Creative Strategy"], 
  metrics: "12 Years @ Google" 
};

export const STATIC_NODES: HeroContent[] = [
  { 
    id: "TECH_AR", 
    protocol: "IMMERSIVE_DISPLAY", 
    title: "Interactive Scale", 
    description: "Pioneered '3D Swirl' and YouTube AR 'Virtual Try-On' at Google. Transformed passive display ads into interactive, real-time 3D experiences for brands like Pixel and Purina.", 
    stack: ["WebGL", "ARCore", "glTF"], 
    metrics: "Real-Time Rendering" 
  },
  { 
    id: "OPS_GLOBAL", 
    protocol: "SUPPLY_CHAIN", 
    title: "Global Operations", 
    description: "Built a multi-million dollar creative supply chain across APAC, EMEA, and AMER. Transformed internal production into a data-driven powerhouse through rigorous SOPs and metrics.", 
    stack: ["SQL", "Data Viz", "Vendor Mgmt"], 
    metrics: "3 Continents Scaled" 
  },
  { 
    id: "TOOL_AI", 
    protocol: "ACCESSIBILITY_CORE", 
    title: "AI & Accessibility", 
    description: "Creator of 'Stevie'. Leveraged Gemini LLMs to build audio-first chat tools for the visually impaired, democratizing access to AI through voice-native interfaces.", 
    stack: ["Gemini LLM", "Speech-to-Text", "Audio Engineering"], 
    metrics: "Accessibility First" 
  },
  { 
    id: "TOOL_SLIDE", 
    protocol: "EFFICIENCY_BOT", 
    title: "SlideSense Automation", 
    description: "Developed internal NLP tools to automate executive presentation review. Reduced management friction by identifying narrative gaps and formatting errors automatically.", 
    stack: ["NLP", "Python", "Internal Tools"], 
    metrics: "1000s Hours Saved" 
  }
];

export const neuralData = [PROFILE_NODE, ...STATIC_NODES];
