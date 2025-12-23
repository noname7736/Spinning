
import { GoogleGenAI } from "@google/genai";
import { SOVEREIGN_PROMPT } from "../constants";

export async function sovereignGovernanceExecute(telemetry: any) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `TELEMETRY_REALTIME_STREAM:
[NETWORK]: ${JSON.stringify(telemetry.nodes)}
[METRICS]: ${JSON.stringify(telemetry.metrics)}
[AUDIT_LOGS]: ${telemetry.logs}

MISSION: วิเคราะห์ความสมบูรณ์ของระบบและออก "คำสั่งบังคับใช้" (Enforcement Order) ทันที (ไม่เกิน 120 ตัวอักษร). 
ห้ามใช้คำแนะนำ ให้ใช้คำสั่งบังคับใช้เท่านั้น.`,
      config: {
        systemInstruction: SOVEREIGN_PROMPT,
        temperature: 0, // Deterministic logic for safety
        thinkingConfig: { thinkingBudget: 16000 }
      },
    });
    return response.text;
  } catch (error) {
    console.error("CRITICAL_SOVEREIGN_FAILURE:", error);
    return "PROTOCOL_OVERRIDE: ระบบถูกล็อกโดย Immutable Code. กำลังกู้คืนสิทธิการสั่งการ...";
  }
}
