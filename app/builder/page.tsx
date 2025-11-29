"use client";
import React, { useState, useEffect } from 'react';
import { LucideIcon } from '../components/builder/Icons';

// --- THE MASTER PORTFOLIO (33 Items) ---
const INITIAL_PORTFOLIO = [
    {
        role: "Tech Lead (Policy)",
        project: "Global Policy Data Mesh",
        situation: "Managing policy across EU, Asia, & US.",
        complication: "Fragmented data created regulatory risk and slow response times.",
        resolution: "Architected a massively parallel data mesh to automate compliance.",
        metricValue: "€20M | 30%",
        metricName: "Fine Avoidance | Regulatory Risk Reduction",
        enhancedBullet: "Architected a massively parallel Global Policy Data Mesh to automate compliance across EU, Asia, & US markets, mitigating fragmented data risks and achieving 30% regulatory risk reduction (approx. €20M fine avoidance).",
        industryStandards: ["GDPR", "Data Sovereignty"],
        skills: ["Problem Solving", "Execution Excellence"]
    },
    {
        role: "Tech Lead (Policy)",
        project: "Ethical AI Governance",
        situation: "AI models were flagging accounts automatically.",
        complication: "High false-positive rates were banning legitimate users and hurting revenue.",
        resolution: "Operationalized 'Human-in-the-Loop' logic layers aligned with NIST AI RMF.",
        metricValue: "$5M LTV | 15%",
        metricName: "Retained User Revenue",
        enhancedBullet: "Operationalized 'Human-in-the-Loop' logic layers aligned with NIST AI RMF standards to correct automated over-flagging, reducing false positives by 15% and retaining $5M in legitimate user LTV.",
        industryStandards: ["NIST AI RMF", "Algorithmic Fairness"],
        skills: ["Problem Solving", "Respect the User"]
    },
    {
        role: "Tech Lead (Policy)",
        project: "TRACE Methodology",
        situation: "Complex hierarchical account relationships existed.",
        complication: "Bad actors were hiding in network structures; manual review was too slow.",
        resolution: "Built a graph-based account explorer to map bad actors at the source.",
        metricValue: "40%",
        metricName: "Reduction in Manual Review",
        enhancedBullet: "Engineered the 'TRACE' graph-based account explorer to map concealed hierarchical bad-actor networks, reducing manual review dependency by 40% and saving ~10,000 engineering hours annually.",
        industryStandards: ["Graph Analysis", "Fraud Detection"],
        skills: ["Execution Excellence", "Building Knowledge"]
    },
    {
        role: "Internal Founder",
        project: "Creative Production Works",
        situation: "Google needed agile creative production internally.",
        complication: "External agencies were slow, expensive, and insecure.",
        resolution: "Founded and scaled an internal startup to handle production in-house.",
        metricValue: "$15M",
        metricName: "Annual Revenue Run Rate",
        enhancedBullet: "Founded and scaled 'Creative Production Works' from concept to a $15M internal enterprise with 50 staff, replacing insecure external agencies with an agile, secure in-house production model.",
        industryStandards: ["Agile Production", "Cost Center to Profit Center"],
        skills: ["Execution Excellence", "Building Knowledge"]
    },
    {
        role: "Internal Founder",
        project: "Global Ops & Vetting",
        situation: "Teams distributed across India, EU, & NA.",
        complication: "Inconsistent security standards created vendor risk.",
        resolution: "Established a unified security framework and handled all contract negotiations.",
        metricValue: "100%",
        metricName: "Vendor Compliance Rate",
        enhancedBullet: "Established a unified Global Ops security framework across India, EU, & NA, achieving 100% vendor compliance and accelerating onboarding speed by 6 weeks through direct contract negotiation.",
        industryStandards: ["VRM", "ISO 27001"],
        skills: ["Risk Management", "Execution Excellence"]
    },
    {
        role: "Data Scientist",
        project: "Internal Tool Commercialization",
        situation: "Internal teams relied on fragmented scripts.",
        complication: "Non-technical staff couldn't access data without engineering help.",
        resolution: "Productized internal tools into a self-service visualization suite.",
        metricValue: "30%",
        metricName: "Time-to-Insight Reduction",
        enhancedBullet: "Productized fragmented internal engineering scripts into a polished self-service visualization suite, reducing time-to-insight by 30% and eliminating engineering bottlenecks for non-technical staff.",
        industryStandards: ["Self-Service BI", "Product-Led Growth"],
        skills: ["Data Democratization", "Collaborating"]
    },
    {
        role: "Creative Tech",
        project: "Oddcast / Viral Marketing",
        situation: "Launching early AR campaigns for Tier-1 clients.",
        complication: "High traffic surges often crashed legacy systems.",
        resolution: "Designed high-availability systems for viral loads (E-Trade Babies, etc.).",
        metricValue: "100M+",
        metricName: "Global Impressions",
        enhancedBullet: "Designed high-availability architecture to sustain massive viral traffic surges (100M+ impressions) for Tier-1 campaigns (e.g., E-Trade Babies), ensuring 99.99% uptime during peak loads.",
        industryStandards: ["High Availability", "Viral Engineering"],
        skills: ["Technical Resilience", "Problem Solving"]
    },
    {
        role: "Tech Lead (Policy)",
        project: "DSA Response",
        situation: "New EU regulations required rapid transparency reporting.",
        complication: "Failure to comply carried a risk of 6% global turnover fines.",
        resolution: "Led a cross-functional task force to build automated transparency reporting pipelines.",
        metricValue: "100%",
        metricName: "Compliance Rate",
        enhancedBullet: "Led the cross-functional engineering task force to automate Digital Services Act (DSA) transparency reporting, achieving 100% compliance and eliminating the risk of 6% global turnover fines.",
        industryStandards: ["Digital Services Act", "Regulatory Reporting"],
        skills: ["Adapting to Ambiguity", "Execution Excellence"]
    },
    {
        role: "Data Scientist",
        project: "Cloud Cost Optimization",
        situation: "Exponential growth in data storage (BigQuery) costs.",
        complication: "Unchecked queries were blowing the OpEx budget.",
        resolution: "Implemented slot management governance and query optimization protocols.",
        metricValue: "$500k",
        metricName: "Annualized Savings",
        enhancedBullet: "Implemented rigorous BigQuery slot management governance and query optimization protocols, reversing exponential cost growth to deliver $500k in annualized OpEx savings.",
        industryStandards: ["FinOps", "Cloud Economics"],
        skills: ["Financial Stewardship", "Problem Solving"]
    },
    {
        role: "Internal Founder",
        project: "Talent Retention Strategy",
        situation: "High attrition in operations teams due to repetitive work.",
        complication: "Brain drain and loss of institutional knowledge.",
        resolution: "Designed a new career ladder and upskilling program to improve retention.",
        metricValue: "25%",
        metricName: "Attrition Reduction",
        enhancedBullet: "Designed and deployed a specialized career ladder and upskilling program for operations teams, reducing attrition by 25% and preserving critical institutional knowledge.",
        industryStandards: ["Human Capital Management", "Upskilling"],
        skills: ["Lift Yourself & Others", "Building Knowledge"]
    },
    {
        role: "Creative Tech",
        project: "Dynamic Creative Optimization",
        situation: "Standard display ads had low engagement.",
        complication: "Creative was static and not personalized to user context.",
        resolution: "Built a DCO pipeline to serve personalized creative assets in real-time.",
        metricValue: "$2M",
        metricName: "Revenue Lift",
        enhancedBullet: "Built a real-time Dynamic Creative Optimization (DCO) pipeline to serve context-aware assets, doubling Click-Through Rates (CTR) and generating a confirmed $2M revenue lift.",
        industryStandards: ["DCO", "Real-Time Bidding"],
        skills: ["Innovation", "Execution Excellence"]
    },
    {
        role: "Tech Lead",
        project: "Legacy Stack Migration",
        situation: "Critical tools ran on deprecated legacy infrastructure.",
        complication: "Security vulnerabilities and inability to scale.",
        resolution: "Orchestrated a zero-downtime migration to modern microservices architecture.",
        metricValue: "0 Downtime",
        metricName: "Migration Success",
        enhancedBullet: "Orchestrated the zero-downtime migration of critical legacy tools to a modern microservices architecture, eliminating security vulnerabilities and reducing API latency by 50%.",
        industryStandards: ["Microservices", "Legacy Modernization"],
        skills: ["Technical Leadership", "Risk Management"]
    },
    {
        role: "Tech Lead (Policy)",
        project: "Election Integrity",
        situation: "Upcoming high-stakes global elections.",
        complication: "Spike in political misinformation and bad actors.",
        resolution: "Deployed a real-time 'War Room' dashboard for rapid policy enforcement.",
        metricValue: "<15 Min",
        metricName: "Mean Time to Detect",
        enhancedBullet: "Deployed a real-time 'War Room' dashboard for global election integrity, enabling rapid detection of misinformation spikes and reducing Mean Time to Detect (MTTD) to under 15 minutes.",
        industryStandards: ["Crisis Management", "Trust & Safety"],
        skills: ["Crisis Response", "Adapting to Ambiguity"]
    },
    {
        role: "Data Scientist",
        project: "Data Democratization",
        situation: "Analysts were a bottleneck for simple business questions.",
        complication: "Slow decision-making velocity across the org.",
        resolution: "Built a 'Data University' self-serve platform for non-technical stakeholders.",
        metricValue: "200+",
        metricName: "Active Users",
        enhancedBullet: "Built the 'Data University' self-serve platform to democratize access for 200+ non-technical stakeholders, removing analyst bottlenecks and accelerating decision-making velocity.",
        industryStandards: ["Data Literacy", "Self-Service Analytics"],
        skills: ["Lift Yourself & Others", "Collaborating"]
    },
    {
        role: "Internal Founder",
        project: "Vendor Consolidation",
        situation: "Sprawl of creative vendors across the organization.",
        complication: "Inefficient spend and fragmented security surface.",
        resolution: "Consolidated vendor list to top 5 preferred partners with negotiated rates.",
        metricValue: "15%",
        metricName: "Cost Reduction",
        enhancedBullet: "Consolidated a fragmented creative vendor landscape into 5 preferred partners, streamlining the security surface and negotiating rate cards to achieve 15% procurement cost savings.",
        industryStandards: ["Strategic Sourcing", "Vendor Governance"],
        skills: ["Operational Efficiency", "Negotiation"]
    },
    {
        role: "Creative Tech",
        project: "Mobile Performance Tuning",
        situation: "Rich media assets were heavy and slow on mobile.",
        complication: "High bounce rates on mobile devices.",
        resolution: "Implemented adaptive streaming and asset compression algorithms.",
        metricValue: "40%",
        metricName: "Faster Load Time",
        enhancedBullet: "Implemented adaptive streaming and asset compression algorithms for rich media, improving mobile page load times by 40% and significantly reducing bounce rates.",
        industryStandards: ["Core Web Vitals", "Mobile-First Design"],
        skills: ["Technical Optimization", "User Focus"]
    },
    {
        role: "Strategist",
        project: "OKR Alignment",
        situation: "Engineering roadmaps were misaligned with business P&L.",
        complication: "Wasted engineering cycles on low-value features.",
        resolution: "Facilitated joint OKR planning to align tech output with revenue goals.",
        metricValue: "100%",
        metricName: "Strategic Alignment",
        enhancedBullet: "Facilitated joint OKR planning sessions to bridge the gap between Engineering and P&L leaders, achieving 100% roadmap alignment with high-priority revenue goals.",
        industryStandards: ["OKRs", "Strategic Planning"],
        skills: ["Strategic Vision", "Collaborating"]
    },
    {
        role: "Tech Lead (Policy)",
        project: "Child Safety (COPPA)",
        situation: "New regulations regarding minor safety online.",
        complication: "High risk of brand damage and regulatory action.",
        resolution: "Architected an age-gating and content classification pipeline.",
        metricValue: "0",
        metricName: "Breach Incidents",
        enhancedBullet: "Architected a robust age-gating and content classification pipeline to meet COPPA/AADC standards, resulting in zero compliance breach incidents and safeguarding platform integrity.",
        industryStandards: ["COPPA", "AADC"],
        skills: ["Doing the Right Thing", "Execution Excellence"]
    },
    {
        role: "Tech Lead",
        project: "Incident Response (SRE)",
        situation: "Frequent SEV1 outages during peak traffic.",
        complication: "Erosion of user trust and advertiser confidence.",
        resolution: "Instituted blameless post-mortems and automated recovery runbooks.",
        metricValue: "50%",
        metricName: "MTTR Reduction",
        enhancedBullet: "Instituted SRE best practices including blameless post-mortems and automated recovery runbooks, reducing Mean Time to Recover (MTTR) for SEV1 outages by 50%.",
        industryStandards: ["SRE", "Incident Management"],
        skills: ["Reliability Engineering", "Leadership"]
    },
    {
        role: "Data Scientist",
        project: "Customer 360 View",
        situation: "User data was siloed across marketing, sales, and product.",
        complication: "Inability to personalize user experience effectively.",
        resolution: "Unified disparate data streams into a single 'Golden Record' customer view.",
        metricValue: "100%",
        metricName: "Data Completeness",
        enhancedBullet: "Unified disparate marketing, sales, and product data streams into a single 'Golden Record' 360-degree view, enabling effective personalization and unlocking new customer insights.",
        industryStandards: ["CDP", "Master Data Management"],
        skills: ["Data Architecture", "Cross-Functional Integration"]
    },
    {
        role: "Tech Lead",
        project: "Billing Team Data Enablement",
        situation: "Billing team lacked automated reporting.",
        complication: "Manual processes consumed 15 hrs/wk and caused ad-hoc engineering requests.",
        resolution: "Automated 3-5 core reports and drove DataSite adoption.",
        metricValue: "15 hrs/wk",
        metricName: "Time Saved",
        enhancedBullet: "Architected scalable data infrastructure for the Billing Team, automating critical reporting to save 15 hours/week and driving 90% DataSite adoption, reducing ad-hoc engineering support by 50%.",
        industryStandards: ["Process Automation", "Self-Service BI"],
        skills: ["Collaborating", "Execution Excellence"]
    },
    {
        role: "Tech Lead",
        project: "Team Enablement",
        situation: "Need for continuous team upskilling.",
        complication: "Knowledge silos were slowing down onboarding.",
        resolution: "Delivered trainings and ran onboarding sessions.",
        metricValue: "100%",
        metricName: "L&D Goals Met",
        enhancedBullet: "Spearheaded team enablement and onboarding initiatives, delivering targeted training sessions that ensured 100% completion of L&D goals and fostered a culture of continuous knowledge sharing.",
        industryStandards: ["Learning & Development", "Knowledge Management"],
        skills: ["Lift Yourself & Others", "Building Knowledge"]
    },
    {
        role: "Tech Lead",
        project: "SSoT Data Ecosystem",
        situation: "Critical data fragmentation across gTech Commerce & T&S.",
        complication: "Siloed data prevented accurate cross-functional analysis.",
        resolution: "Spearheaded unified data strategy for gTech, T&S, gSO, and GTM.",
        metricValue: "100%",
        metricName: "SSoT Adoption",
        enhancedBullet: "Spearheaded the technical strategy and execution of a unified Single Source of Truth (SSoT) data ecosystem for gTech and T&S, resolving critical fragmentation and aligning global stakeholders.",
        industryStandards: ["Data Governance", "SSoT"],
        skills: ["Strategic Vision", "Collaborating"]
    },
    {
        role: "Tech Lead",
        project: "Parent-Child Case Mapping",
        situation: "Disconnected case data between gTech and T&S.",
        complication: "Inability to trace root causes of complex commerce cases.",
        resolution: "Engineered novel parent-child case mapping solution.",
        metricValue: ">95%",
        metricName: "Mapping Accuracy",
        enhancedBullet: "Engineered a novel parent-child case mapping solution between gTech and T&S, achieving >95% accuracy and 100% adoption for all commerce case analysis, eliminating data silos.",
        industryStandards: ["Data Modeling", "Case Management"],
        skills: ["Problem Solving", "Execution Excellence"]
    },
    {
        role: "Tech Lead",
        project: "Commerce Policy DataSite",
        situation: "Policy teams lacked centralized insights.",
        complication: "Slow time-to-insight for policy decisions.",
        resolution: "Architected and launched centralized DataSite.",
        metricValue: "100%",
        metricName: "User Adoption",
        enhancedBullet: "Architected and launched the centralized Commerce Policy DataSite, achieving 100% user adoption and reducing time-to-insight by an estimated 5 hours/week per user.",
        industryStandards: ["Self-Service BI", "Knowledge Management"],
        skills: ["Execution Excellence", "Respect the User"]
    },
    {
        role: "Tech Lead",
        project: "P-Staff SLO Reporting",
        situation: "Manual and inaccurate SLO reporting for leadership.",
        complication: "40 hours/week wasted on manual processing.",
        resolution: "Designed automated data solution for P-Staff.",
        metricValue: "40 hrs/wk",
        metricName: "Manual Work Saved",
        enhancedBullet: "Designed and delivered an automated data solution for P-Staff SLO reporting, improving accuracy by 20% and eliminating 40 hours/week of manual data processing.",
        industryStandards: ["SLO Management", "Executive Reporting"],
        skills: ["Execution Excellence", "Problem Solving"]
    },
    {
        role: "Tech Lead",
        project: "gTech Operations Dashboard",
        situation: "gAE Policy team lacked operational visibility.",
        complication: "Inefficient manual tracking of operational metrics.",
        resolution: "Developed and launched gTech Operations Dashboard.",
        metricValue: "100%",
        metricName: "Adoption",
        enhancedBullet: "Developed and launched the gTech Operations Dashboard, achieving 100% adoption within gAE Policy and saving each user 3-5 hours per week on data tasks.",
        industryStandards: ["Operational Analytics", "Dashboarding"],
        skills: ["Execution Excellence", "Respect the User"]
    },
    {
        role: "Tech Lead",
        project: "AI-Enhanced Reporting Tool",
        situation: "Manual period-over-period analysis was slow.",
        complication: "20-hour reporting tasks delayed insights.",
        resolution: "Architected AI-enhanced automation tool.",
        metricValue: "5 min",
        metricName: "Latency",
        enhancedBullet: "Architected and launched an AI-enhanced reporting tool, automating analysis to reduce a 20-hour manual task to under 5 minutes for hundreds of gTech users.",
        industryStandards: ["AI Automation", "Reporting Efficiency"],
        skills: ["Innovation", "Problem Solving"]
    },
    {
        role: "Tech Lead",
        project: "Internal Keyword Theming Tool (IKTT)",
        situation: "Inefficient manual keyword theming by vendors.",
        complication: "High vendor costs and slow throughput.",
        resolution: "Created IKTT using Google Ads API.",
        metricValue: "20,000 hrs",
        metricName: "Saved Annually",
        enhancedBullet: "Created the Internal Keyword Theming Tool (IKTT) using Google Ads API, published to Marketplace, with potential to save 20,000 vendor hours annually.",
        industryStandards: ["API Automation", "Vendor Efficiency"],
        skills: ["Innovation", "Execution Excellence"]
    },
    {
        role: "Tech Lead",
        project: "SlideSense App",
        situation: "Manual collateral assessment was inconsistent.",
        complication: "Lack of standardized quality checks.",
        resolution: "Led dev of SlideSense Apps Script web app.",
        metricValue: "100%",
        metricName: "Strategy & UI/UX",
        enhancedBullet: "Led development of SlideSense, an Apps Script web app for collateral assessment, owning full stack strategy from UI/UX to testing and deployment.",
        industryStandards: ["Tooling", "QA Automation"],
        skills: ["Innovation", "Execution Excellence"]
    },
    {
        role: "Tech Lead",
        project: "PMOS V2 Pipeline Overhaul",
        situation: "Significant data loss in PMOS pipelines.",
        complication: "20% data loss and wasted FTE time.",
        resolution: "Overhauled data pipelines to resolve loss.",
        metricValue: "20%",
        metricName: "Loss Resolved",
        enhancedBullet: "Overhauled PMOS V2 data pipelines, resolving 20% data loss issues and reducing related FTE manual data tasks by 15-20%.",
        industryStandards: ["Data Engineering", "Pipeline Reliability"],
        skills: ["Problem Solving", "Technical Resilience"]
    },
    {
        role: "Tech Lead",
        project: "YouTube Content Quality (YTCQ)",
        situation: "YTCQ lacked authoritative data source.",
        complication: "Inconsistent metrics for content quality.",
        resolution: "Delivered dedicated DataSite and mapping solutions.",
        metricValue: "100%",
        metricName: "Adoption",
        enhancedBullet: "Established gAE Policy team as the data authority for YouTube Content Quality (YTCQ), delivering a dedicated DataSite that drove full adoption by the operations team.",
        industryStandards: ["Data Authority", "Content Quality"],
        skills: ["Cross-Functional Leadership", "Influence"]
    },
    {
        role: "Tech Lead",
        project: "Merchant Revenue Pipeline",
        situation: "Suspension appeals lacked revenue context.",
        complication: "Hard to prioritize high-impact cases.",
        resolution: "Implemented pipeline to quantify revenue impact.",
        metricValue: "100%",
        metricName: "Revenue Coverage",
        enhancedBullet: "Implemented a data pipeline quantifying merchant revenue impact, enabling 100% of shopping-related appeals to include revenue data and strengthening influence on product roadmaps.",
        industryStandards: ["Revenue Operations", "Decision Support"],
        skills: ["Strategic Vision", "Business Acumen"]
    }
];

export default function BuilderPage() {
    const [entries, setEntries] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState('list'); // Default to list view
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [formData, setFormData] = useState({
        role: 'Tech Lead', project: '', situation: '', complication: '', resolution: '', metricName: '', metricValue: ''
    });
    const [analysisResult, setAnalysisResult] = useState<any>(null);

    // AUTO-LOAD LOGIC
    useEffect(() => {
        const saved = localStorage.getItem('jwm_resume_entries');
        if (saved && JSON.parse(saved).length > 0) {
            setEntries(JSON.parse(saved));
        } else {
            // First time visit? Load the 33 defaults automatically.
            const defaultsWithIds = INITIAL_PORTFOLIO.map((item, idx) => ({
                ...item,
                id: Date.now() + idx
            }));
            setEntries(defaultsWithIds);
            localStorage.setItem('jwm_resume_entries', JSON.stringify(defaultsWithIds));
        }
    }, []);

    // Sync state changes to storage
    useEffect(() => {
        if (entries.length > 0) {
            localStorage.setItem('jwm_resume_entries', JSON.stringify(entries));
        }
    }, [entries]);

    const handleInputChange = (e: any) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleAnalyze = async () => {
        if (!formData.project) return alert("Enter a project name.");
        setIsAnalyzing(true);
        try {
            const res = await fetch('/api/enhance-bullet', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            setAnalysisResult(data);
        } catch (e) {
            alert("AI Error. Check connection.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleSave = () => {
        if (!analysisResult) return;
        const newEntry = { ...formData, ...analysisResult, id: Date.now() };
        setEntries(prev => [newEntry, ...prev]);
        setAnalysisResult(null);
        setFormData({ role: 'Tech Lead', project: '', situation: '', complication: '', resolution: '', metricName: '', metricValue: '' });
        setActiveTab('list');
    };

    const handleDelete = (id: number) => {
        if (confirm("Delete this entry?")) {
            setEntries(prev => prev.filter(e => e.id !== id));
        }
    };

    const handleResetToDefaults = () => {
        if(confirm("This will overwrite your current list with the original 33 items. Continue?")) {
            const defaultsWithIds = INITIAL_PORTFOLIO.map((item, idx) => ({
                ...item,
                id: Date.now() + idx
            }));
            setEntries(defaultsWithIds);
            localStorage.setItem('jwm_resume_entries', JSON.stringify(defaultsWithIds));
        }
    }

    const handleExport = () => {
        const blob = new Blob([JSON.stringify(entries, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "master_resume_data.json";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
            {/* HEADER */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
                <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div className="bg-indigo-600 p-2 rounded-lg">
                            <LucideIcon name="Target" className="text-white" size={24} />
                        </div>
                        <h1 className="text-xl font-bold tracking-tight">Resume Impact Architect</h1>
                    </div>
                    <div className="flex space-x-2">
                         <button onClick={() => setActiveTab('form')} className={`px-4 py-2 rounded text-sm font-bold ${activeTab === 'form' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-600'}`}>Draft New</button>
                         <button onClick={() => setActiveTab('list')} className={`px-4 py-2 rounded text-sm font-bold ${activeTab === 'list' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-600'}`}>Library ({entries.length})</button>
                    </div>
                    <div className="flex space-x-2">
                        <button onClick={handleResetToDefaults} className="px-3 py-2 bg-slate-200 hover:bg-slate-300 rounded text-xs font-bold uppercase">Reset</button>
                        <button onClick={handleExport} className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-xs font-bold uppercase flex items-center gap-1">
                            <LucideIcon name="Save" size={14} /> Export JSON
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 py-8">
                {activeTab === 'form' && (
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* FORM */}
                        <div className="flex-1 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                            <h2 className="text-lg font-bold mb-4">1. Raw Context</h2>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <select name="role" value={formData.role} onChange={handleInputChange} className="border p-2 rounded bg-slate-50">
                                        <option>Tech Lead</option><option>Data Scientist</option><option>Internal Founder</option><option>Creative Tech</option><option>Strategist</option>
                                    </select>
                                    <input name="project" value={formData.project} onChange={handleInputChange} placeholder="Project Name" className="border p-2 rounded" />
                                </div>
                                <input name="situation" value={formData.situation} onChange={handleInputChange} placeholder="Situation" className="w-full border p-2 rounded" />
                                <input name="complication" value={formData.complication} onChange={handleInputChange} placeholder="Complication (The Pain)" className="w-full border p-2 rounded border-red-200 bg-red-50" />
                                <textarea name="resolution" value={formData.resolution} onChange={handleInputChange} placeholder="Resolution (The Action)" className="w-full border p-2 rounded border-green-200 bg-green-50 h-24" />
                                <div className="grid grid-cols-2 gap-4">
                                    <input name="metricValue" value={formData.metricValue} onChange={handleInputChange} placeholder="Metric Value (e.g. 40%)" className="border p-2 rounded" />
                                    <input name="metricName" value={formData.metricName} onChange={handleInputChange} placeholder="Metric Name" className="border p-2 rounded" />
                                </div>
                                <button onClick={handleAnalyze} disabled={isAnalyzing} className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors">
                                    {isAnalyzing ? "Analyzing..." : "Analyze with Gemini"}
                                </button>
                            </div>
                        </div>

                        {/* RESULT */}
                        <div className="flex-1">
                            {analysisResult && (
                                <div className="bg-white rounded-xl shadow-lg border border-indigo-200 overflow-hidden">
                                    <div className="bg-indigo-600 p-4 text-white font-bold">Strategy Found</div>
                                    <div className="p-6 space-y-4">
                                        <div>
                                            <label className="text-xs font-bold text-slate-400 uppercase">Enhanced Bullet</label>
                                            <p className="text-lg font-medium text-slate-900 bg-indigo-50 p-4 rounded border border-indigo-100">{analysisResult.enhancedBullet}</p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-xs font-bold text-slate-400 uppercase">Standards</label>
                                                <div className="flex flex-wrap gap-1">
                                                    {analysisResult.industryStandards?.map((s: string, i: number) => <span key={i} className="text-xs bg-slate-100 px-2 py-1 rounded">{s}</span>)}
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-slate-400 uppercase">Market Context</label>
                                                <p className="text-sm text-slate-600">{analysisResult.marketContext}</p>
                                            </div>
                                        </div>
                                        <button onClick={handleSave} className="w-full py-3 bg-slate-900 text-white rounded font-bold hover:bg-black">Save to Library</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'list' && (
                    <div className="grid gap-4">
                        {entries.map((e: any) => (
                            <div key={e.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex justify-between group">
                                <div className="flex-1 pr-6">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-xs font-bold bg-indigo-50 text-indigo-700 px-2 py-1 rounded uppercase tracking-wide">{e.role}</span>
                                        <span className="text-xs text-slate-400 font-mono"> // {e.project}</span>
                                    </div>
                                    <p className="text-lg font-medium text-slate-800 leading-relaxed mb-3">{e.enhancedBullet}</p>
                                    
                                    <div className="flex flex-wrap gap-3 items-center">
                                         {e.metricValue && (
                                            <div className="inline-flex items-center bg-green-50 border border-green-200 text-green-800 text-xs font-bold px-3 py-1 rounded-full">
                                                <LucideIcon name="BarChart3" size={14} className="mr-2 text-green-600" />
                                                {e.metricValue} {e.metricName}
                                            </div>
                                         )}
                                         <div className="flex gap-1">
                                            {e.industryStandards?.map((std: string, i: number) => (
                                                <span key={i} className="text-[10px] bg-slate-100 px-2 py-1 rounded text-slate-500 border border-slate-200">{std}</span>
                                            ))}
                                         </div>
                                    </div>
                                </div>
                                <button onClick={() => handleDelete(e.id)} className="text-slate-300 hover:text-red-500 self-start p-2"><LucideIcon name="Trash2" size={20}/></button>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
