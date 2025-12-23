
import { GoogleGenAI } from "@google/genai";
import { SOVEREIGN_PROMPT } from "../constants";

export async function sovereignGovernanceExecute(telemetry: any) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const isCommand = !!telemetry.command;
    const prompt = isCommand 
      ? `USER_COMMAND_RECEIVED: [${telemetry.command}]
         CONTEXT: ${JSON.stringify(telemetry.metrics)}
         ACTION: วิเคราะห์และออกคำสั่งยืนยันการปฏิบัติงาน (Final Order) ไม่เกิน 100 ตัวอักษร.`
      : `TELEMETRY_STREAM: ${JSON.stringify(telemetry.metrics)}
         ANALYSIS: ตรวจสอบความผิดปกติและออกคำสั่งบังคับใช้ (Enforcement Order) ไม่เกิน 100 ตัวอักษร.`;

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
