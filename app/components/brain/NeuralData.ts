import React from 'react';
import { 
  Fingerprint, Shield, Database, Globe, User, 
  TrendingUp, Activity, Server, Layout, Zap, Cpu, Layers
} from 'lucide-react';

export interface Source {
  label: string;
  type: string;
  url: string;
}

export interface NarrativeCard {
  id: string;
  category: 'bio' | 'portfolio' | 'live';
  headline: {
    title: string;
    subtitle: string;
  };
  context: {
    label: string;
    description: string;
    date?: string; 
    sources: Source[];
  };
  insight: {
    label: string;
    explanation: string;
  };
  experience: {
    label: string;
    role: string;
    action: string;
    result: string;
    tags: string[];
  };
  icon: React.ElementType;
}

// --- FULL RESUME SOURCE (The Source of Truth) ---
export const FULL_RESUME_DATA = {
    header: {
        name: "JONATHAN W. MARINO",
        title: "Tech Strategy Lead & Data Scientist",
        location: "New York City Metropolitan Area",
        contact: ["jmarinonyc@gmail.com", "linkedin.com/in/jwmdigital", "jwm.digital"]
    },
    summary: "I operate at the intersection of creative strategy, data engineering, and global policy. I don't just navigate the future; I build the infrastructure that makes it possible.",
    
    core_competencies: {
        Technical: "GoogleSQL (BigQuery), Python, Policy Infrastructure, AI/ML Safety (Human-in-the-Loop), Data Mesh Architecture.",
        Strategic: "Global Risk Governance, Vendor Management, Crisis Response (ATO), DSA/GDPR Compliance.",
        Leadership: "Intrapreneurship (0 to 1 Scaling), Cross-Functional Team Building, Cost Optimization."
    },
    
    experience: [
        {
            company: "GOOGLE",
            location: "New York, NY",
            roles: [
                {
                    title: "Tech Lead & Data Strategy Architect (Policy)",
                    date: "July 2024 – Present",
                    mandate: "Build the data backbone that allows Google to comply with aggressive global regulations without breaking the business.",
                    bullets: [
                        { head: "Built the 'Global Policy Data Mesh'", body: "Architected a unified compliance engine for EU, Asia, and US markets, effectively mitigating ~€20M in regulatory risk exposure." },
                        { head: "Fixed AI Over-Flagging", body: "Operationalized 'Human-in-the-Loop' logic layers to catch when AI was being too aggressive. This reduced false positives by 15% and saved $5M in legitimate advertiser revenue." },
                        { head: "Automated Regulatory Compliance", body: "Led the engineering task force for the Digital Services Act (DSA). We achieved 100% reporting compliance and eliminated the risk of global turnover fines (6%)." },
                        { head: "Election Integrity", body: "Deployed real-time 'War Room' dashboards that allowed the team to detect and neutralize threats to election integrity in under 15 minutes." }
                    ]
                },
                {
                    title: "Senior Lead, Automation Strategy",
                    date: "Oct 2023 – July 2024",
                    mandate: "Leverage data to drive engineering efficiency and stop exponential cloud cost growth.",
                    bullets: [
                        { head: "Cut Cloud Waste", body: "Implemented strict governance on BigQuery usage and optimized query protocols, delivering $500k in annualized operating expense savings." },
                        { head: "Democratized Data Access", body: "Built 'Data University,' a self-serve platform that allowed 200+ non-technical stakeholders to answer their own questions, removing the bottleneck on data analysts." },
                        { head: "Innovated Internal Tools", body: "Built 'SlideSense,' an NLP/Computer Vision AI tool that automates executive presentation reviews, saving over 1,000 management hours." }
                    ]
                },
                {
                    title: "Strategy Lead & Founder, 'Creative Production Works'",
                    date: "May 2021 – Oct 2023",
                    mandate: "Identify a broken internal supply chain and build a startup inside Google to fix it.",
                    bullets: [
                        { head: "Scaled 0 to 1", body: "Grew an internal concept into a $15M enterprise with 50 staff, replacing insecure external agencies with an agile, secure in-house production model." },
                        { head: "Secured the Supply Chain", body: "Established a unified security framework across India, EU, and North America, achieving 100% vendor compliance and cutting onboarding time by 6 weeks." },
                        { head: "Saved 15% on Procurement", body: "Consolidated a fragmented vendor landscape into 5 preferred partners, negotiating better rate cards and streamlining the security surface." }
                    ]
                },
                {
                    title: "Creative Technical Lead",
                    date: "March 2018 – May 2021",
                    mandate: "Provide high-availability architecture for Google’s largest Tier-1 advertising campaigns.",
                    bullets: [
                        { head: "Launched First-to-Market Ad Tech", body: "Led Technical Program Management for '3D Swirl' (interactive 3D display ads) and YouTube AR 'Virtual Try-On,' pushing new formats to market." },
                        { head: "Managed Crisis Response", body: "Orchestrated 'Code Red' operational cleanups for high-risk Account Takeovers (ATO), directly managing recovery protocols for critical clients." }
                    ]
                }
            ]
        }
    ]
};

// --- VISUAL GEMS FOR STRATEGY ENGINE ---
const RAW_GEMS = [
  {"category": "Strategic Risk & Governance", "title": "DSA Compliance Engine", "date": "2024", "challenge": "The EU Digital Services Act (DSA) imposed strict liability.", "strategy": "Architected the enterprise engineering response.", "outcome": "Achieved 100% compliance and eliminated the risk of global turnover fines.", "metric_primary": "100% Compliance", "metric_secondary": "Zero Risk Exposure"},
  {"category": "AI Safety & Revenue Retention", "title": "AI Revenue Defense", "date": "2024", "challenge": "Aggressive AI models were flagging high-value accounts as false positives.", "strategy": "Designed 'Human-in-the-Loop' safety layers to intercept AI decisions.", "outcome": "Reduced high-value account suspensions by ~96% and retained $5M+ in annual revenue.", "metric_primary": "$5M+ Revenue Retained", "metric_secondary": "-96% False Positives"},
  {"category": "Cloud FinOps & Efficiency", "title": "Cloud Cost Governance", "date": "2023", "challenge": "Exponential cloud resource growth was threatening margins.", "strategy": "Implemented strict cloud resource governance and query optimization protocols.", "outcome": "Reversed cost growth to deliver $500k in annualized infrastructure savings.", "metric_primary": "$500k Saved/Year", "metric_secondary": "Optimized Compute"},
  {"category": "Intrapreneurship & Scaling", "title": "Internal Enterprise Scale", "date": "2022", "challenge": "Reliance on insecure external vendors created supply chain risk.", "strategy": "Founded and scaled an internal creative supply chain startup from zero.", "outcome": "Built a $15M enterprise, replacing insecure vendors with a high-margin internal operation.", "metric_primary": "$15M Enterprise Built", "metric_secondary": "High-Margin Ops"},
  {"category": "Data Architecture", "title": "Unified Truth Ecosystem", "date": "2023", "challenge": "Fragmented data silos across Global Policy and Sales slowed decision-making.", "strategy": "Unified data into a single 'Truth' ecosystem.", "outcome": "Reduced executive decision-making latency from weeks to real-time.", "metric_primary": "Real-Time Decisions", "metric_secondary": "Silos Eliminated"},
  {"category": "Operational Automation", "title": "Automated Executive Review", "date": "2024", "challenge": "Executive presentation review was a massive manual time sink.", "strategy": "Productized internal AI research into an automated review tool.", "outcome": "Reclaimed 1,000+ management hours annually.", "metric_primary": "1,000+ Hours Saved", "metric_secondary": "AI Productization"},
  {"category": "Global Supply Chain", "title": "Vendor Security Framework", "date": "2022", "challenge": "Inconsistent vendor security posed a global risk.", "strategy": "Engineered a global vendor security framework.", "outcome": "Achieved 100% compliance across international markets and compressed onboarding by 6 weeks.", "metric_primary": "100% Security Compliance", "metric_secondary": "6 Weeks Faster"},
  {"category": "Crisis Management", "title": "Election War Rooms", "date": "2024", "challenge": "Global elections required immediate threat detection.", "strategy": "Deployed real-time 'War Room' dashboards.", "outcome": "Enabled threat detection and neutralization in under 15 minutes.", "metric_primary": "<15 Min Response", "metric_secondary": "Global Integrity"},
  {"category": "Customer Experience Engineering", "title": "Predictive Policy Support", "date": "2023", "challenge": "Reactive support tickets were overwhelming the system.", "strategy": "Orchestrated a predictive analytics initiative to proactively clarify policy.", "outcome": "Eliminated 300,000 annual support tickets.", "metric_primary": "-300k Tickets", "metric_secondary": "Proactive CX"},
  {"category": "Digital Sovereignty", "title": "Geopolitical Engineering", "date": "2023", "challenge": "Ambiguous regulations in high-friction markets threatened operations.", "strategy": "Translated regulations into binary engineering requirements.", "outcome": "Allowed the platform to operate legally in restricted markets.", "metric_primary": "Market Access Secured", "metric_secondary": "Regulatory binary"}
];

// Helper to Map Raw Gem to NarrativeCard Format
const mapGemToCard = (gem: any, index: number): NarrativeCard => {
    let icon = Database;
    if (gem.category.includes("Risk") || gem.category.includes("Crisis")) icon = Shield;
    if (gem.category.includes("Data") || gem.category.includes("Legacy")) icon = Server;
    if (gem.category.includes("Global") || gem.category.includes("Sovereignty")) icon = Globe;
    if (gem.category.includes("Revenue") || gem.category.includes("Commercial") || gem.category.includes("FinOps")) icon = TrendingUp;
    if (gem.category.includes("AI") || gem.category.includes("Automation")) icon = Cpu;
    if (gem.category.includes("Product") || gem.category.includes("Brand")) icon = Layers;

    return {
        id: "PORTFOLIO_" + index,
        category: 'portfolio',
        headline: { title: gem.title, subtitle: gem.category },
        context: {
            label: "The Challenge",
            description: gem.challenge,
            date: gem.date, 
            sources: [] 
        },
        insight: {
            label: "The Strategy",
            explanation: gem.strategy
        },
        experience: {
            label: "Impact",
            role: "Digital Architect",
            action: gem.outcome,
            result: gem.metric_primary,
            tags: [gem.metric_primary, gem.metric_secondary]
        },
        icon: icon
    };
};

const portfolioCards = RAW_GEMS.map(mapGemToCard); 

// Bio Card
const bioCard: NarrativeCard = { 
    id: "BIO_001", 
    category: 'bio',
    headline: { title: "Jonathan W. Marino", subtitle: "Identity: Digital Architect" },
    context: {
      label: "Profile",
      description: "Executive leader bridging Engineering Velocity and Operational Safety. Transforming regulatory frameworks into automated data meshes.",
      date: "EST. 2005",
      sources: [
        { label: "LinkedIn", type: "Social", url: "https://www.linkedin.com/in/jwmdigital" }
      ]
    },
    insight: {
      label: "Core Competency",
      explanation: "Operating at the rare convergence of Data Engineering, Creative Strategy, and Global Policy to de-risk enterprise scale."
    },
    experience: {
      label: "Executive Function",
      role: "Digital Architect",
      action: "From viral engineering (100M+ views) to enterprise risk architectures (GDPR/DSA), I translate C-Suite goals into code.",
      result: "20 Years of Innovation.",
      tags: ["Strategy", "Leadership", "Polymath"]
    },
    icon: Fingerprint
};

export const narrativeData = [bioCard, ...portfolioCards];
