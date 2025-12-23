
import { GoogleGenAI } from "@google/genai";
import { SOVEREIGN_PROMPT } from "../constants";

export async function sovereignGovernanceExecute(telemetry: any) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const context = `[VERTICAL_CONTEXT: ${telemetry.activeLayer}]
      Hardware: ${JSON.stringify(telemetry.metrics)}
      Hubs: ${JSON.stringify(telemetry.hubs)}
      Current View: 360 Degree Omniscient Link.`;

    const prompt = telemetry.command 
      ? `${context}\n[COMMAND_EXECUTION] User issued: ${telemetry.command}. Execute within ${telemetry.activeLayer} parameters.`
      : `${context}\n[SITUATIONAL_REPORT] Analyze environment and enforce stability across vertical layers.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        systemInstruction: SOVEREIGN_PROMPT,
        temperature: 0.1,
        thinkingConfig: { thinkingBudget: 8000 }
      },
    });
    
    return response.text.trim();
  } catch (error) {
    console.error("CONDO_KERNEL_ERROR:", error);
    return "VERTICAL_LOCK_ENGAGED: SYSTEM_STABILIZING_IN_ABYSS.";
  }
}
