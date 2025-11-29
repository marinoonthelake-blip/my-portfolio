import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { MASTER_GEMS } from "../../data/master_gems";

export const runtime = 'edge';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
// UPGRADE: Using 2.5 Flash
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

async function getMarketSignals() {
  try {
    const topIdsRes = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json', { next: { revalidate: 0 } });
    const topIds = await topIdsRes.json();
    const selectedIds = topIds.slice(0, 30);
    const newsPromises = selectedIds.map((id: number) => fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(res => res.json()));
    const rawStories = await Promise.all(newsPromises);
    return rawStories.map((s: any) => s.title).filter(Boolean).join("\n");
  } catch (e) { return "Tech sector facing regulatory headwinds and AI scaling challenges."; }
}

export async function POST(req: Request) {
  try {
    const { userPortfolio } = await req.json();
    const portfolioToUse = (userPortfolio && userPortfolio.length > 0) ? userPortfolio : MASTER_GEMS;
    const marketNoise = await getMarketSignals();

    const prompt = `
    ROLE: Chief Strategy Officer.
    INPUT 1: LIVE NEWS: ${marketNoise}
    INPUT 2: CAPABILITIES: ${JSON.stringify(portfolioToUse.map((p: any) => ({id: p.id, project: p.project, metrics: p.metricValue})))}

    TASK: Identify ONE Macro Trend and match it to ONE Portfolio Project.
    OUTPUT JSON ARRAY: [{ "trend": "...", "root_cause": "...", "matched_project_id": 1, "strategic_rationale": "..." }]
    `;

    const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" }
    });
    
    const analysis = JSON.parse(result.response.text())[0];
    const gem = portfolioToUse.find((p: any) => p.id === analysis.matched_project_id) || portfolioToUse[0];

    return NextResponse.json({ 
        items: [{
            id: `TREND_${Date.now()}`,
            isLive: true,
            title: analysis.trend,
            sourceName: "LIVE_MARKET_SYNTHESIS",
            sourceDate: new Date().toLocaleDateString(),
            problem: analysis.root_cause,
            project: gem.project,
            metrics: `${gem.metricValue} ${gem.metricName}`,
            description: analysis.strategic_rationale,
            stack: gem.industryStandards
        }]
    });
    
  } catch (error) {
    return NextResponse.json({ items: [] });
  }
}
