import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { GEM_IDENTITY } from "../../gems/identity";
import { GEM_ARTISAN } from "../../gems/artisan";
import { GEM_SCOUT } from "../../gems/scout";

export const runtime = 'edge';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
// UPGRADE: Using 2.5 Flash
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export async function POST(req: Request) {
    try {
        const { fullContext, userPortfolio } = await req.json();
        
        let dynamicIdentity = GEM_IDENTITY;
        if (userPortfolio && userPortfolio.length > 0) {
            const builderData = userPortfolio.map((entry: any) => `
            - PROJECT: ${entry.project} (${entry.role})
              - IMPACT: ${entry.enhancedBullet}
              - METRICS: ${entry.metricValue} ${entry.metricName}
            `).join("\n");
            dynamicIdentity += `\n\n--- LIVE BUILDER DATA ---\n${builderData}`;
        }

        const newsContext = fullContext?.items?.slice(0, 3).map((i: any) => i.articleTitle).join("\n") || "General Tech Context";

        const strategyPrompt = `
        ${GEM_SCOUT}
        LIVE NEWS: ${newsContext}
        PROFILE: ${dynamicIdentity}
        TASK: Identify the strategic angle.
        `;
        const strategyResp = await model.generateContent(strategyPrompt);

        const buildPrompt = `
        ${GEM_ARTISAN}
        STRATEGY: ${strategyResp.response.text()}
        SOURCE: ${dynamicIdentity}
        TASK: Generate JSON Portfolio.
        `;
        const buildResp = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: buildPrompt }] }],
            generationConfig: { responseMimeType: "application/json" }
        });

        return NextResponse.json(JSON.parse(buildResp.response.text()));

    } catch (error) {
        return NextResponse.json({ error: "Generation Failed" }, { status: 500 });
    }
}
