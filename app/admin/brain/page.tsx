"use client";
import React, { useState } from 'react';
import { Activity, Save, RefreshCw, AlertCircle, Terminal, Database } from 'lucide-react';

export default function BrainConsole() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [errorLog, setErrorLog] = useState<string | null>(null);
  const [showRaw, setShowRaw] = useState(false);

  const runScan = async () => {
    setLoading(true);
    setErrorLog(null);
    setResult(null);
    setShowRaw(false);
    
    try {
        const res = await fetch('/api/brain-scan', { method: 'POST' });
        const payload = await res.json();
        
        if (!res.ok || !payload.success) {
            throw new Error(payload.error || "Server Error " + res.status);
        }
        
        // Normalize: If API returns { list: [...] } or just [...], handle both
        const data = Array.isArray(payload.data) ? payload.data : (payload.data?.items || []);
        
        if (data.length === 0) throw new Error("API returned success but ZERO data items.");
        
        setResult(data);
    } catch (e: any) {
        setErrorLog(e.message);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-12 font-mono selection:bg-red-500/30">
      <div className="max-w-5xl mx-auto">
        <header className="mb-12 border-b border-slate-800 pb-6 flex justify-between items-center">
            <div>
                <h1 className="text-3xl font-bold text-red-500 mb-2 flex items-center gap-3">
                    <Activity /> LIVE INTELLIGENCE CONSOLE
                </h1>
                <p className="text-slate-400">Google Search Grounding Engine</p>
            </div>
            <div className="text-xs text-slate-600 border border-slate-800 px-3 py-1 rounded">
                MODE: EXECUTIVE_SEARCH
            </div>
        </header>

        {/* CONTROLS */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 mb-8 shadow-2xl">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Database size={20}/> Deep Research Protocol</h2>
            <p className="text-sm text-slate-400 mb-6 max-w-2xl leading-relaxed">
                This triggers <strong>Gemini 2.0 Flash</strong> (with Google Search Tools) to analyze your resume against live market data. 
                It generates 10 strategic narrative cards and saves them to <code>app/data/live_cache.json</code>.
            </p>
            
            <button 
                onClick={runScan} 
                disabled={loading}
                className={`w-full py-4 rounded font-bold tracking-widest transition-all flex items-center justify-center gap-3 ${loading ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-900/20'}`}
            >
                {loading ? <RefreshCw className="animate-spin" /> : <Activity />}
                {loading ? "SEARCHING GLOBAL NETWORKS (MAY TAKE 20s)..." : "INITIATE LIVE SCAN"}
            </button>
        </div>

        {/* ERROR LOGGING */}
        {errorLog && (
            <div className="bg-red-950/50 border border-red-500/50 p-6 rounded-xl mb-8 animate-in fade-in">
                <div className="flex items-center gap-2 text-red-400 font-bold mb-2">
                    <AlertCircle size={20} /> SYSTEM FAILURE
                </div>
                <pre className="text-xs text-red-200 overflow-x-auto whitespace-pre-wrap font-mono bg-black/30 p-4 rounded">{errorLog}</pre>
            </div>
        )}

        {/* SUCCESS RESULT */}
        {result && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-green-400">
                        <Save size={16} />
                        <span className="text-xs font-bold uppercase">{result.length} Signals Captured & Cached</span>
                    </div>
                    <button onClick={() => setShowRaw(!showRaw)} className="text-xs text-slate-500 hover:text-white underline">
                        {showRaw ? "Hide Raw Data" : "Inspect Raw JSON"}
                    </button>
                </div>
                
                {/* PREVIEW CARD */}
                <div className="bg-slate-900 border border-red-500/30 rounded-xl p-8 relative overflow-hidden mb-4 shadow-2xl">
                    <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
                    <div className="mb-6">
                        <span className="text-xs font-bold text-red-500 bg-red-950/30 px-2 py-1 rounded border border-red-500/20">LATEST SIGNAL (1 of {result.length})</span>
                        <h3 className="text-3xl font-bold mt-3 text-white tracking-tight">{result[0]?.headline?.title || "MISSING TITLE"}</h3>
                        <p className="text-slate-400 mt-1">{result[0]?.headline?.subtitle || "MISSING SUBTITLE"}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                        <div className="bg-black/20 p-4 rounded border border-white/5">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Live Source</label>
                            <a href={result[0]?.context?.sources?.[0]?.url} target="_blank" rel="noreferrer" className="text-sm mt-2 text-blue-400 hover:underline block truncate">
                                {result[0]?.context?.sources?.[0]?.url || "No URL Generated"}
                            </a>
                            <p className="text-xs text-slate-400 mt-2 leading-relaxed">{result[0]?.context?.description}</p>
                        </div>
                        <div className="bg-black/20 p-4 rounded border border-white/5">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Strategic Insight</label>
                            <p className="text-sm mt-2 text-slate-300 leading-relaxed">{result[0]?.insight?.explanation}</p>
                        </div>
                    </div>

                    <div className="bg-green-900/10 p-4 rounded border border-green-500/20">
                        <label className="text-[10px] font-bold text-green-500 uppercase tracking-widest">Matched Portfolio Capability</label>
                        <div className="flex justify-between items-center mt-2">
                            <span className="font-bold text-white text-sm">{result[0]?.experience?.role}</span>
                            <span className="text-[10px] font-bold bg-green-500/20 text-green-400 px-2 py-1 rounded border border-green-500/30">{result[0]?.experience?.result}</span>
                        </div>
                        <p className="text-sm text-slate-400 mt-2">{result[0]?.experience?.action}</p>
                    </div>
                </div>

                {showRaw && (
                    <pre className="text-[10px] text-slate-500 bg-black p-4 rounded overflow-auto h-64 border border-slate-800 mb-4">
                        {JSON.stringify(result, null, 2)}
                    </pre>
                )}

                <div className="p-4 bg-blue-900/20 border border-blue-500/20 text-blue-200 text-xs rounded flex items-center gap-3">
                    <Terminal size={16} />
                    <span><strong>SYSTEM READY:</strong> Your live cache is updated. Return to the homepage to see the rotation.</span>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}
