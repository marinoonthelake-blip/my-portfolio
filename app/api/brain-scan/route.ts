import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import fs from 'fs';
import path from 'path';
import { RESUME_TEXT } from "../../data/resume_source";

export const maxDuration = 60; 
export const dynamic = 'force-dynamic';

function cleanAndParseJSON(text: string) {
    try {
        let clean = text.replace(/```json/gi, "").replace(/```/g, "").trim();
        const firstOpen = clean.indexOf('[');
        const lastClose = clean.lastIndexOf(']');
        if (firstOpen === -1 || lastClose === -1) throw new Error("No JSON array found");
        return JSON.parse(clean.substring(firstOpen, lastClose + 1));
    } catch (e: any) {
        console.error("JSON Parse Error:", e.message);
        throw e;
    }
}

export async function POST(req: Request) {
    const debugLog: string[] = [];
    const log = (msg: string) => { console.log(`[Brain]: ${msg}`); debugLog.push(msg); };

    try {
        const apiKey = process.env.GEMINI_API_KEY || "";
        const genAI = new GoogleGenerativeAI(apiKey);
        
        // Get accurate date string for the prompt
        const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

        const promptText = `
        ROLE: Executive Technical Recruiter.
        TARGET PROFILE: ${RESUME_TEXT.substring(0, 8000)}
        TODAY'S DATE: ${today}

        TASK:
        1. **BREAKING NEWS (Item 1):** Find ONE major tech event from the last 24 hours (e.g. ${today}).
           - FORCE the 'date' field for this item to be "LIVE - TODAY".
        
        2. **MARKET TRENDS (Items 2-10):** Find 9 other recent events (last 30 days).

        CRITICAL RULES:
        - "sources.url": MUST BE A REAL LINK.
        - "experience.result": Use exact numbers from the resume.
        - "category": Must be "live".

        OUTPUT JSON ONLY:
        [
          {
            "id": "LIVE_GEN_01",
            "category": "live",
            "headline": { "title": "Headline", "subtitle": "Impact Area" },
            "context": {
              "label": "Market Context",
              "description": "1-sentence summary.",
              "date": "LIVE - TODAY", 
              "sources": [{ "label": "Source", "type": "News", "url": "URL" }]
            },
            "insight": { "label": "Friction", "explanation": "Why this is hard." },
            "experience": {
              "label": "Strategic Response",
              "role": "Role",
              "action": "Detailed action from resume.",
              "result": "Metric",
              "tags": ["Tag1"]
            },
            "icon": "Activity" 
          }
        ]
        `;

        try {
            log("Attempting Gemini 2.5 Flash (Search Enabled)...");
            const model = genAI.getGenerativeModel({ 
                model: "gemini-2.5-flash", 
                // CRITICAL FIX: Use the specific, canonical structure for search tool
                tools: [{ googleSearch: {} }] as any // Casting to 'any' as a final bypass for environmental type issues
            });
            
            const result = await model.generateContent({
                contents: [{ role: "user", parts: [{ text: promptText }] }]
            });
            
            let jsonResult = cleanAndParseJSON(result.response.text());
            
            // Garbage Filter
            jsonResult = jsonResult.filter((item: any) => {
                const url = item.context?.sources?.[0]?.url || "";
                return url && !url.includes("example.com") && url.startsWith("http");
            });
            
            if (process.env.NODE_ENV === 'development') {
                const filePath = path.join(process.cwd(), 'app', 'data', 'live_cache.json');
                fs.writeFileSync(filePath, JSON.stringify(jsonResult, null, 2));
                log("Cache updated.");
            }

            return NextResponse.json({ success: true, logs: debugLog, data: jsonResult });

        } catch (err: any) {
            log("❌ Error: " + err.message);
            throw err;
        }

    } catch (fatalError: any) {
        return NextResponse.json({ success: false, error: fatalError.message, logs: debugLog }, { status: 500 });
    }
}
