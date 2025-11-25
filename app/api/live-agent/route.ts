import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Fix 504 Timeout by using Edge Runtime (25s+ limit)
export const runtime = 'edge';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const MINI_RESUME = `
User: Jonathan William Marino
Role: Tech Lead for Policy at Google (2015-Present)
Core Value: "Integrity Infrastructure"
Key Projects: TRACE (Safe), SlideSense (AI), Stevie (A11y), Global Ops.
`;

async function getLiveTechNews() {
  try {
    const topIdsRes = await fetch('https://hacker-news.firebaseio.com/v0/newstories.json', { next: { revalidate: 0 } });
    const topIds = await topIdsRes.json();
    const shuffled = topIds.slice(0, 60).sort(() => 0.5 - Math.random());
    const selectedIds = shuffled.slice(0, 5);

    const newsPromises = selectedIds.map((id: number) =>
      fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(res => res.json())
    );
    const rawStories = await Promise.all(newsPromises);
    
    return rawStories.map((s: any) => ({
      title: s.title,
      url: s.url || `https://news.ycombinator.com/item?id=${s.id}`,
      date: new Date(s.time * 1000).toLocaleDateString("en-US", { hour: 'numeric', minute: 'numeric' }),
      source: s.url ? new URL(s.url).hostname.replace('www.','') : "HackerNews"
    }));
  } catch (e) {
    return [];
  }
}

export async function POST(req: Request) {
  try {
    const { userContext } = await req.json();
    const newsItems = await getLiveTechNews();

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    const prompt = `
    ROLE: Autonomous Intelligence Agent for Jonathan Marino.
    INPUT: 5 News Stories: ${JSON.stringify(newsItems)}
    RESUME: ${MINI_RESUME}
    
    TASK: For EACH news story, generate:
    1. "article_summary": A 1-sentence summary of the news.
    2. "strategy_connection": How Jonathan's specific experience applies to this topic.
    
    OUTPUT JSON ARRAY (5 items):
    [
      {
        "headline": "Action Headline",
        "article_summary": "Brief summary of what happened.",
        "strategy_connection": "Detailed explanation of how Jonathan's work (e.g. TRACE/Stevie) solves this.",
        "project": "Relevant Project Name",
        "protocol": "GENERATED_PROTOCOL_NAME"
      }
    ]
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const cleanJson = text.replace(/```json|```/g, "").trim();
    const strategies = JSON.parse(cleanJson);
    
    const finalData = newsItems.map((news: any, i: number) => ({
      id: "LIVE_NODE_" + (i+1),
      protocol: strategies[i]?.protocol || "LIVE_INTEL",
      title: strategies[i]?.headline || "Live Intel Received",
      description: strategies[i]?.strategy_connection || "Analyzing global impact...",
      metrics: strategies[i]?.project || "Strategic Analysis",
      stack: ["Live Feed", "Context Aware", "Gemini 2.0"],
      
      // NEW FIELDS FOR LAYOUT
      articleTitle: news.title,
      articleSummary: strategies[i]?.article_summary || "Processing incoming stream...",
      sourceName: news.source,
      sourceDate: news.date,
      sourceUrl: news.url,
      isLive: true
    }));
    
    return NextResponse.json({ items: finalData });
    
  } catch (error) {
    console.error("Brain Failure:", error);
    return NextResponse.json({ items: [] });
  }
}
