import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export const runtime = 'edge';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
// UPGRADE: Using 2.5 Flash
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export async function POST(req: Request) {
    try {
        const formData = await req.json();

        const prompt = `
        ROLE: Executive Resume Strategist.
        TASK: Transform raw input into a C-Suite Impact Bullet.
        
        INPUT:
        Role: ${formData.role}
        Project: ${formData.project}
        Context: ${formData.situation} / ${formData.complication}
        Action: ${formData.resolution}
        Metric: ${formData.metricValue} ${formData.metricName}

        OUTPUT JSON:
        {
            "industryStandards": ["Standard1", "Standard2"],
            "marketContext": "Why a CTO cares.",
            "skills": ["Skill1", "Skill2"],
            "enhancedBullet": "Action-oriented, metric-driven bullet point."
        }
        `;

        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json" }
        });

        return NextResponse.json(JSON.parse(result.response.text()));

    } catch (error) {
        return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
    }
}
