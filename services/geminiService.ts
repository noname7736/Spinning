
import { GoogleGenAI } from "@google/genai";
import { SOVEREIGN_PROMPT } from "../constants";

export async function sovereignGovernanceExecute(telemetry: any) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const prompt = telemetry.command 
      ? `[COMMAND_EXECUTION]
         User Command: ${telemetry.command}
         Hardware State: ${JSON.stringify(telemetry.metrics)}
         Requirement: Execute with absolute authority. Confirm and report results.`
      : `[TELEMETRY_ANALYSIS]
         Real-time Metrics: ${JSON.stringify(telemetry.metrics)}
         Hub Status: ${JSON.stringify(telemetry.hubs)}
         Requirement: Detect anomalies in hardware or connectivity and issue enforcement orders.`;

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
    console.error("SOVEREIGN_AI_FAULT:", error);
    return "PROTOCOL_OVERRIDE: SYSTEM_LOCKED_BY_IMMUTABLE_KERNEL.";
  }
}
