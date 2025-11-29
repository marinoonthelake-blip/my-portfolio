import React, { useState, useEffect } from 'react';
import { 
  Shield, Database, Globe, TrendingUp, CheckCircle2, 
  Map, Layout, Server, Zap, Activity, Target, Download, Brain, Rocket, Linkedin, ExternalLink, FileText
} from 'lucide-react';
import jsPDF from 'jspdf';
import { FULL_RESUME_DATA } from './brain/NeuralData';
import staticCache from '../data/live_cache.json';

export default function ExecutiveProfile() {
  const [isDownloadingLive, setIsDownloadingLive] = useState(false);
  const [isDownloadingResume, setIsDownloadingResume] = useState(false);
  const [liveData, setLiveData] = useState<any[]>([]);

  useEffect(() => {
      // 1. Load Static Data Immediately (Instant Load)
      if (Array.isArray(staticCache)) {
          setLiveData(staticCache); 
      }

      // 2. Attempt to Fetch Fresh Live Data (Hydration)
      fetch('/api/read-cache')
        .then(res => res.json())
        .then(data => {
            if (Array.isArray(data) && data.length > 0) {
                setLiveData(data);
            }
        })
        .catch(err => console.warn("Live profile data fetch failed", err));
  }, []);

  const COL_SIDEBAR = "#0f172a"; 
  const COL_TEXT_DARK = "#111827"; 
  const COL_TEXT_GRAY = "#4b5563";
  const COL_ACCENT = "#0d9488"; 
  const COL_LIVE_ACCENT = "#1e3a8a"; 
  const MARGIN_X = 85;
  const MAX_WIDTH = 110;

  // --- GENERATOR 1: LIVE BRIEFING (LIVE DATA ONLY) ---
  const downloadLiveBriefing = async () => {
      setIsDownloadingLive(true);
      const doc = new jsPDF();
      
      // Helper: Draw Sidebar (Repeated on every page)
      const drawSidebar = () => {
          const pageHeight = doc.internal.pageSize.getHeight();
          doc.setFillColor(COL_SIDEBAR);
          doc.rect(0, 0, 75, pageHeight, 'F');
          
          let sidebarY = 40;
          
          // Avatar Placeholder (Circle)
          doc.setFillColor(30, 41, 59);
          doc.circle(37.5, sidebarY, 15, 'F');
          doc.setFontSize(20);
          doc.setTextColor(255, 255, 255);
          doc.text("JM", 37.5, sidebarY + 2, { align: 'center' });
          
          sidebarY += 30;

          // Name & Title
          doc.setFont("helvetica", "bold");
          doc.setFontSize(16);
          const nameParts = FULL_RESUME_DATA.header.name.split(" ");
          doc.text(nameParts[0], 12, sidebarY);
          doc.text(nameParts.slice(1).join(" "), 12, sidebarY + 7);
          
          doc.setFont("helvetica", "normal");
          doc.setFontSize(9);
          doc.setTextColor(148, 163, 184); 
          const titleLines = doc.splitTextToSize(FULL_RESUME_DATA.header.title, 55);
          doc.text(titleLines, 12, sidebarY + 16);

          sidebarY += 30;
          
          // Competencies Section
          const addSection = (title: string, items: any) => {
              doc.setFont("helvetica", "bold");
              doc.setFontSize(8);
              doc.setTextColor(13, 148, 136); // Explicit RGB (#0d9488)
              doc.text(title, 12, sidebarY);
              sidebarY += 6;
              doc.setFont("helvetica", "normal");
              doc.setFontSize(8);
              doc.setTextColor(220, 220, 220);
              
              if (Array.isArray(items)) {
                 items.forEach(item => { 
                     doc.text(`• ${item}`, 12, sidebarY); 
                     sidebarY += 5; 
                 });
              } else {
                 Object.entries(items).forEach(([k, v]: any) => {
                    doc.setFont("helvetica", "bold");
                    doc.text(k, 12, sidebarY);
                    sidebarY += 4;
                    doc.setFont("helvetica", "normal");
                    const lines = doc.splitTextToSize(v, 50);
                    doc.text(lines, 12, sidebarY);
                    sidebarY += (lines.length * 3.5) + 4;
                 });
              }
              sidebarY += 8;
          };

          addSection("CONTACT", FULL_RESUME_DATA.header.contact);
          addSection("CORE COMPETENCIES", FULL_RESUME_DATA.core_competencies);
      };

      drawSidebar();

      let cursorY = 20;

      // HEADER: LIVE CONTEXT
      if (liveData.length > 0) {
          doc.setTextColor(30, 58, 138); 
          doc.setFont("helvetica", "bold");
          doc.setFontSize(12);
          doc.text("LIVE STRATEGIC BRIEFING", MARGIN_X, cursorY);
          
          doc.setFontSize(8);
          doc.setTextColor(100);
          const genDate = new Date().toLocaleDateString();
          doc.text(`Generated: ${genDate}`, MARGIN_X + MAX_WIDTH, cursorY, { align: 'right' });
          
          cursorY += 8;
          
          // INTRO NARRATIVE
          doc.setFont("helvetica", "italic");
          doc.setFontSize(9);
          doc.setTextColor(80);
          const introText = "This document represents a real-time analysis of global market signals. An AI Agent has scanned 30+ live news sources and mapped them to specific capabilities in my portfolio to demonstrate immediate relevance.";
          const introLines = doc.splitTextToSize(introText, MAX_WIDTH);
          doc.text(introLines, MARGIN_X, cursorY);
          
          cursorY += (introLines.length * 4.5) + 10;

          // LOOP THROUGH LIVE SIGNALS
          liveData.forEach((signal, index) => {
              // --- SMART PAGINATION CHECK ---
              // Estimate block height (Headline + Context + Solution) approx 50-60mm
              // If cursor is beyond 230mm (A4 is 297mm), push to next page to avoid cuts.
              if (cursorY > 230) { 
                  doc.addPage(); 
                  drawSidebar(); 
                  cursorY = 20; 
              } 

              // Divider
              doc.setDrawColor(220);
              doc.setLineWidth(0.5);
              doc.line(MARGIN_X, cursorY, MARGIN_X + MAX_WIDTH, cursorY);
              cursorY += 6;

              // 1. HEADLINE 
              doc.setTextColor(17, 24, 39); 
              doc.setFont("helvetica", "bold");
              doc.setFontSize(10);
              const titleLines = doc.splitTextToSize(signal.headline.title, MAX_WIDTH); 
              doc.text(titleLines, MARGIN_X, cursorY);
              cursorY += (titleLines.length * 5);

              // 2. SOURCE DATE
              doc.setFont("helvetica", "bold");
              doc.setFontSize(8);
              if (signal.context.date) {
                  const isToday = signal.context.date.includes("TODAY");
                  if (isToday) {
                      doc.setTextColor(220, 38, 38); // Red
                  } else {
                      doc.setTextColor(100, 100, 100); // Gray
                  }
                  doc.text(signal.context.date.toUpperCase(), MARGIN_X, cursorY);
                  
                  // Source Link (If valid)
                  const sourceUrl = signal.context.sources[0]?.url;
                  if (sourceUrl && !sourceUrl.includes("example.com")) {
                       doc.setTextColor(37, 99, 235);
                       doc.textWithLink(`  [SOURCE LINK]`, MARGIN_X + 30, cursorY, { url: sourceUrl });
                  }
                  cursorY += 6;
              }

              // 3. CONTEXT
              doc.setFont("helvetica", "normal");
              doc.setFontSize(9);
              doc.setTextColor(75, 85, 99);
              const contextLines = doc.splitTextToSize(signal.context.description, MAX_WIDTH);
              doc.text(contextLines, MARGIN_X, cursorY);
              cursorY += (contextLines.length * 4.5) + 5;
              
              // 4. MY SOLUTION (Accent Block)
              const actionLines = doc.splitTextToSize(signal.experience.action, MAX_WIDTH - 5);
              const blockHeight = (actionLines.length * 4.5) + 8;
              
              // Accent Bar
              doc.setDrawColor(30, 58, 138); 
              doc.setLineWidth(1.5);
              doc.line(MARGIN_X, cursorY, MARGIN_X, cursorY + blockHeight);

              // Label
              doc.setFont("helvetica", "bold");
              doc.setFontSize(8);
              doc.setTextColor(30, 58, 138); 
              doc.text("STRATEGIC RESPONSE:", MARGIN_X + 4, cursorY + 3);

              // Content
              doc.setFont("helvetica", "normal");
              doc.setFontSize(9);
              doc.setTextColor(17, 24, 39); 
              doc.text(actionLines, MARGIN_X + 4, cursorY + 8); 
              
              // Result
              const resY = cursorY + 8 + (actionLines.length * 4.5);
              doc.setFont("helvetica", "bold");
              doc.setFontSize(8);
              doc.setTextColor(16, 185, 129); // Green
              doc.text(`IMPACT: ${signal.experience.result}`, MARGIN_X + 4, resY);

              cursorY += blockHeight + 10; // Spacing before next item
          });
      }

      doc.save("Jonathan_Marino_Live_Briefing.pdf");
      setIsDownloadingLive(false);
  };

  // --- GENERATOR 2: FULL RESUME (STATIC DATA ONLY) ---
  const downloadResume = async () => {
      setIsDownloadingResume(true);
      const doc = new jsPDF();
      const SIDEBAR_WIDTH = 75;
      const MAIN_X = 85;
      const MAIN_WIDTH = 110;

      // Sidebar Logic (Same as Live, but scoped here to be safe)
      const drawSidebar = () => {
          const pageHeight = doc.internal.pageSize.getHeight();
          doc.setFillColor(15, 23, 42); 
          doc.rect(0, 0, SIDEBAR_WIDTH, pageHeight, 'F');
          
          let sidebarY = 40;
          doc.setTextColor(255, 255, 255);
          doc.setFont("helvetica", "bold");
          doc.setFontSize(18);
          const nameParts = FULL_RESUME_DATA.header.name.split(" ");
          doc.text(nameParts[0], 12, sidebarY);
          doc.text(nameParts.slice(1).join(" "), 12, sidebarY + 8);
          
          doc.setFont("helvetica", "normal");
          doc.setFontSize(9);
          doc.setTextColor(148, 163, 184); 
          const titleLines = doc.splitTextToSize(FULL_RESUME_DATA.header.title, 55);
          doc.text(titleLines, 12, sidebarY + 16);

          sidebarY += 35;
          
          const addSection = (title: string, items: any) => {
              doc.setFont("helvetica", "bold");
              doc.setFontSize(8);
              doc.setTextColor(13, 148, 136); 
              doc.text(title, 12, sidebarY);
              sidebarY += 6;
              doc.setFont("helvetica", "normal");
              doc.setFontSize(8);
              doc.setTextColor(220, 220, 220);
              
              if (Array.isArray(items)) {
                 items.forEach(item => { 
                    doc.text(`• ${item}`, 12, sidebarY); 
                    sidebarY += 5; 
                 });
              } else {
                 Object.entries(items).forEach(([k, v]: any) => {
                    doc.setFont("helvetica", "bold"); doc.text(k, 12, sidebarY); sidebarY += 4;
                    doc.setFont("helvetica", "normal"); const lines = doc.splitTextToSize(v, 50);
                    doc.text(lines, 12, sidebarY); sidebarY += (lines.length * 3.5) + 4;
                 });
              }
              sidebarY += 8;
          };

          addSection("CONTACT", FULL_RESUME_DATA.header.contact);
          addSection("COMPETENCIES", FULL_RESUME_DATA.core_competencies);
      };

      drawSidebar();
      let cursorY = 20;

      // EXECUTIVE SUMMARY
      doc.setTextColor(17, 24, 39); 
      doc.setFont("helvetica", "bold"); doc.setFontSize(12); doc.text("EXECUTIVE SUMMARY", MAIN_X, cursorY);
      cursorY += 6; 
      doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(75, 85, 99); 
      const vpLines = doc.splitTextToSize(FULL_RESUME_DATA.summary, MAIN_WIDTH);
      doc.text(vpLines, MAIN_X, cursorY);
      cursorY += (vpLines.length * 4.5) + 10;

      // EXPERIENCE
      doc.setTextColor(17, 24, 39); 
      doc.setFont("helvetica", "bold"); doc.setFontSize(12); doc.text("PROFESSIONAL EXPERIENCE", MAIN_X, cursorY);
      cursorY += 10;

      FULL_RESUME_DATA.experience.forEach((companyBlock) => {
          companyBlock.roles.forEach((role) => {
              // PAGINATION CHECK
              // Estimating role block size. If we are low on page, force break.
              if (cursorY > 220) { 
                  doc.addPage(); 
                  drawSidebar(); 
                  cursorY = 20; 
              }

              doc.setTextColor(0, 0, 0); doc.setFont("helvetica", "bold"); doc.setFontSize(11);
              const titleLines = doc.splitTextToSize(role.title, MAIN_WIDTH); doc.text(titleLines, MAIN_X, cursorY);
              cursorY += (titleLines.length * 5) + 1;

              doc.setFontSize(9); doc.setTextColor(100); doc.text(role.date, MAIN_X + MAIN_WIDTH, cursorY, { align: 'right' });
              cursorY += 5;

              doc.setTextColor(15, 23, 42); doc.setFont("helvetica", "bold"); doc.setFontSize(9);
              doc.text(`${companyBlock.company} | ${companyBlock.location}`, MAIN_X, cursorY);
              cursorY += 5;

              if (role.mandate) { 
                  doc.setFont("helvetica", "italic"); doc.setTextColor(80); 
                  const mandateLines = doc.splitTextToSize(`Mandate: ${role.mandate}`, MAIN_WIDTH); 
                  doc.text(mandateLines, MAIN_X, cursorY); 
                  cursorY += (mandateLines.length * 4) + 4; 
              }

              role.bullets.forEach((b: any) => {
                  // Micro-pagination check for bullets
                  if (cursorY > 275) { 
                      doc.addPage(); drawSidebar(); cursorY = 20; 
                  }
                  
                  doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(50);
                  if (typeof b === 'string') { 
                      const lines = doc.splitTextToSize(`• ${b}`, MAIN_WIDTH); 
                      doc.text(lines, MAIN_X, cursorY); 
                      cursorY += (lines.length * 3.5) + 1; 
                  } 
                  else { 
                      doc.setFont("helvetica", "bold"); 
                      const headText = `• ${b.head}:`; 
                      doc.text(headText, MAIN_X, cursorY); 
                      const headWidth = doc.getTextWidth(headText);
                      
                      doc.setFont("helvetica", "normal"); 
                      const bodyLines = doc.splitTextToSize(b.body, MAIN_WIDTH - headWidth - 2);
                      if (bodyLines.length > 0) doc.text(bodyLines[0], MAIN_X + headWidth + 2, cursorY);
                      for(let i=1; i<bodyLines.length; i++) { cursorY += 4; doc.text(bodyLines[i], MAIN_X + 4, cursorY); }
                      cursorY += 5;
                  }
              });
              cursorY += 8;
          });
      });

      doc.save("Jonathan_Marino_Executive_Resume.pdf");
      setIsDownloadingResume(false);
  };

  // UI RENDER
  const getCompetencyStyle = (key: string) => {
      if (key === 'Technical') return { icon: Database, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'hover:border-blue-500/30', title: 'text-white' };
      if (key === 'Strategic') return { icon: Target, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'hover:border-emerald-500/30', title: 'text-white' };
      if (key === 'Leadership') return { icon: TrendingUp, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'hover:border-amber-500/30', title: 'text-white' };
      return { icon: Zap, color: 'text-slate-400', bg: 'bg-slate-800', border: 'border-slate-700', title: 'text-slate-200' };
  };

  return (
    <div className="min-h-screen bg-[#02040a] text-slate-200 font-sans selection:bg-blue-500 selection:text-white pb-32">
      
      {/* HERO */}
      <div className="relative pt-32 pb-20 px-6 border-b border-white/5">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-12 items-center">
            <div className="relative group shrink-0">
                <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-1000 rounded-full"></div>
                <div className="w-48 h-48 md:w-56 md:h-56 rounded-full border-2 border-white/10 overflow-hidden relative z-10 shadow-2xl">
                    <img src="/profile.png" alt="Jonathan W. Marino" className="w-full h-full object-cover"/>
                </div>
                <div className="absolute bottom-2 right-2 bg-emerald-500 w-4 h-4 rounded-full border-2 border-[#02040a] z-20 animate-pulse"></div>
            </div>
            <div className="flex-1 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold tracking-widest uppercase mb-6">
                    <Brain size={14} /> {FULL_RESUME_DATA.header.title}
                </div>
                <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-6 leading-tight">
                    Jonathan W. <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Marino</span>
                </h1>
                <p className="text-lg text-slate-400 max-w-2xl leading-relaxed">
                   {FULL_RESUME_DATA.summary}
                </p>
                <div className="flex flex-col sm:flex-row flex-wrap gap-4 mt-8 justify-center md:justify-start w-full">
                    <a href="https://linkedin.com/in/jwmdigital" target="_blank" className="w-full sm:w-auto justify-center px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-blue-50 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] flex items-center gap-2">
                        <Linkedin size={18} /> Connect
                    </a>
                    <button 
                        onClick={downloadLiveBriefing}
                        disabled={isDownloadingLive}
                        className="w-full sm:w-auto justify-center px-6 py-3 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-500 transition-colors shadow-lg shadow-blue-900/30 flex items-center gap-2 text-sm"
                    >
                        {isDownloadingLive ? "Compiling..." : <><Activity size={18}/> Live Briefing (10 Signals)</>}
                    </button>
                    <button 
                        onClick={downloadResume}
                        disabled={isDownloadingResume}
                        className="w-full sm:w-auto justify-center px-6 py-3 border border-white/20 text-white font-bold rounded-full hover:bg-white/5 transition-colors flex items-center gap-2 text-sm"
                    >
                        {isDownloadingResume ? "Generating..." : <><FileText size={18}/> Download Executive Resume</>}
                    </button>
                </div>
            </div>
        </div>
      </div>

      {/* COMPETENCIES */}
      <div className="max-w-6xl mx-auto px-6 py-24">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-8 text-center md:text-left">Core Competencies</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {Object.entries(FULL_RESUME_DATA.core_competencies).map(([category, text], i) => {
                  const style = getCompetencyStyle(category);
                  const Icon = style.icon;
                  return (
                      <div key={i} className={`p-8 rounded-3xl bg-white/5 border border-white/5 ${style.border} transition-all duration-500 group`}>
                          <div className={`w-12 h-12 ${style.bg} rounded-xl flex items-center justify-center mb-6 ${style.color} group-hover:scale-110 transition-transform`}>
                              <Icon size={24} />
                          </div>
                          <h3 className={`text-xl font-bold mb-4 ${style.title}`}>{category}</h3>
                          <p className="text-slate-400 text-sm leading-relaxed">{text}</p>
                      </div>
                  );
              })}
          </div>
      </div>

      {/* HISTORY */}
      <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-white mb-12 flex items-center gap-3">
              <Activity className="text-blue-500" /> Professional History
          </h2>
          <div className="space-y-12 border-l-2 border-white/10 ml-3 pl-12 relative">
              {FULL_RESUME_DATA.experience.map((companyBlock, cIdx) => (
                  <div key={cIdx} className="space-y-12">
                      {companyBlock.roles.map((role: any, rIdx: number) => (
                          <div key={rIdx} className="relative">
                              <div className="absolute -left-[55px] top-1 w-6 h-6 rounded-full bg-blue-500 border-4 border-[#02040a] shadow-[0_0_15px_#3b82f6]"></div>
                              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-2">
                                  <h3 className="text-xl font-bold text-white">{role.title}</h3>
                                  <span className="text-sm font-mono text-blue-400">{role.date}</span>
                              </div>
                              <div className="text-sm font-bold text-slate-400 mb-4">{companyBlock.company} | {companyBlock.location}</div>
                              {role.mandate && (
                                  <div className="p-4 bg-blue-900/10 border border-blue-500/20 rounded-lg mb-6">
                                      <span className="text-xs font-bold text-blue-400 uppercase">Mandate</span>
                                      <p className="text-slate-300 text-sm mt-1">{role.mandate}</p>
                                  </div>
                              )}
                              <ul className="space-y-4">
                                  {role.bullets.map((b: any, bIdx: number) => (
                                      <li key={bIdx} className="group">
                                          <div className="text-white font-bold text-sm group-hover:text-blue-400 transition-colors mb-1">
                                              {typeof b === 'string' ? '' : b.head}
                                          </div>
                                          <p className="text-slate-400 text-sm leading-relaxed">
                                              {typeof b === 'string' ? b : b.body}
                                          </p>
                                      </li>
                                  ))}
                              </ul>
                          </div>
                      ))}
                  </div>
              ))}
          </div>
      </div>
    </div>
  );
}
