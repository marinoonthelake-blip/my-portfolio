import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) return NextResponse.json({ error: "No API Key" });

        const genAI = new GoogleGenerativeAI(apiKey);
        
        // List all models available to your key
        let modelResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        let data = await modelResponse.json();

        if (data.error) {
            throw new Error(data.error.message);
        }

        const availableModels = data.models
            .filter((m: any) => m.supportedGenerationMethods.includes("generateContent"))
            .map((m: any) => ({
                name: m.name,
                displayName: m.displayName,
                description: m.description,
                version: m.version
            }));

        return NextResponse.json({ 
            count: availableModels.length,
            models: availableModels 
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
