import { GoogleGenAI } from "@google/genai";
import { config } from "./config.js";
import { AppError } from "./errors.js";
import { SYSTEM_PROMPT, buildContextPrompt } from "./prompts.js";
import {
  advisoryResponseSchema,
  type AdvisoryResponse,
  type FarmingContext,
  type HistoryMessage,
} from "./schemas.js";

let aiClient: GoogleGenAI | null = null;

function getClient(): GoogleGenAI {
  if (!config.geminiApiKey) {
    throw new AppError(503, "AI_NOT_CONFIGURED", "The AI service is not configured. Please set GEMINI_API_KEY.");
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey: config.geminiApiKey });
  }
  return aiClient;
}

function extractJsonFromText(text: string): string {
  // Try to extract JSON from markdown code blocks
  const codeBlockMatch = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?\s*```/);
  if (codeBlockMatch) {
    return codeBlockMatch[1].trim();
  }
  // Try to find raw JSON object
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return jsonMatch[0].trim();
  }
  return text.trim();
}

function buildFallbackResponse(rawText: string, language: string): AdvisoryResponse {
  const disclaimer =
    language === "hi"
      ? "यह सामान्य मार्गदर्शन है। विशिष्ट सिफारिशों के लिए स्थानीय कृषि विशेषज्ञ से परामर्श करें।"
      : language === "te"
        ? "ఇది సాధారణ మార్గదర్శకం. నిర్దిష్ట సిఫారసుల కోసం స్థానిక వ్యవసాయ నిపుణులను సంప్రదించండి."
        : "This is general guidance. Consult a local agricultural expert for specific recommendations.";

  return {
    answer: rawText,
    category: "general_agriculture",
    possibleCauses: [],
    recommendations: [],
    precautions: [],
    followUpQuestions: [],
    safetyLevel: "low",
    needsExpert: false,
    disclaimer,
  };
}

export async function generateAgricultureAdvice(
  message: string,
  language: string,
  context?: FarmingContext,
  history?: HistoryMessage[]
): Promise<AdvisoryResponse> {
  const client = getClient();

  const contextPrompt = buildContextPrompt(language, context);
  const fullSystemPrompt = SYSTEM_PROMPT + contextPrompt;

  // Build conversation contents
  const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];

  // Add conversation history
  if (history && history.length > 0) {
    for (const msg of history) {
      contents.push({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      });
    }
  }

  // Add current message
  contents.push({
    role: "user",
    parts: [{ text: message }],
  });

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), config.requestTimeoutMs);

    let response;
    try {
      response = await client.models.generateContent({
        model: config.geminiModel,
        contents,
        config: {
          systemInstruction: fullSystemPrompt,
          maxOutputTokens: 2048,
          temperature: 0.7,
          topP: 0.9,
        },
      });
    } finally {
      clearTimeout(timeout);
    }

    const rawText = response?.text;

    if (!rawText || rawText.trim().length === 0) {
      throw new AppError(502, "EMPTY_AI_RESPONSE", "The AI service returned an empty response. Please try again.");
    }

    // Attempt to parse structured JSON
    const jsonStr = extractJsonFromText(rawText);

    try {
      const parsed = JSON.parse(jsonStr);
      const validated = advisoryResponseSchema.safeParse(parsed);

      if (validated.success) {
        return validated.data;
      }

      // Partial parse succeeded but validation failed — use the answer field if available
      if (parsed.answer && typeof parsed.answer === "string") {
        return buildFallbackResponse(parsed.answer, language);
      }
    } catch {
      // JSON parse failed — use the raw text as the answer
    }

    return buildFallbackResponse(rawText, language);
  } catch (error: unknown) {
    if (error instanceof AppError) throw error;

    const err = error as { status?: number; message?: string; code?: string; name?: string };

    // Handle AbortController timeout
    if (err.name === "AbortError") {
      throw new AppError(504, "AI_TIMEOUT", "The AI service took too long to respond. Please try again.");
    }

    // Handle Gemini-specific errors
    if (err.status === 429 || err.message?.includes("429") || err.message?.toLowerCase().includes("rate limit")) {
      throw new AppError(429, "RATE_LIMITED", "The AI service is busy. Please wait a moment and try again.");
    }

    if (err.status === 401 || err.status === 403 || err.message?.includes("API key")) {
      throw new AppError(503, "AI_AUTH_ERROR", "The AI service could not authenticate. Please contact the administrator.");
    }

    if (err.message?.includes("not found") || err.message?.includes("does not exist")) {
      throw new AppError(503, "MODEL_NOT_FOUND", `The configured AI model "${config.geminiModel}" is not available. Please contact the administrator.`);
    }

    if (err.message?.toLowerCase().includes("safety")) {
      throw new AppError(
        502,
        "SAFETY_BLOCK",
        "The AI response was blocked by safety filters. Please rephrase your question."
      );
    }

    console.error("Gemini API error:", err.message || "Unknown error");
    throw new AppError(503, "AI_UNAVAILABLE", "The AI service is currently unavailable. Please try again later.");
  }
}
