import { z } from "zod";
import { config } from "./config.js";

export const historyMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z
    .string()
    .min(1, "Message content cannot be empty.")
    .max(10000, "Message content is too long."),
});

export const farmingContextSchema = z
  .object({
    cropName: z.string().max(100).optional(),
    country: z.string().max(80).optional(),
    state: z.string().max(100).optional(),
    district: z.string().max(100).optional(),
    locality: z.string().max(100).optional(),
    soilType: z.string().max(100).optional(),
    waterAvailability: z
      .enum(["low", "medium", "high", "unknown"])
      .optional(),
    growthStage: z
      .enum([
        "planning",
        "sowing",
        "vegetative",
        "flowering",
        "fruiting",
        "harvesting",
        "unknown",
      ])
      .optional(),
  })
  .optional();

export const chatRequestSchema = z.object({
  message: z
    .string()
    .min(1, "Please enter a question.")
    .max(
      config.maxMessageLength,
      `Message must be ${config.maxMessageLength} characters or fewer.`
    )
    .transform((s) => s.trim())
    .refine((s) => s.length > 0, "Please enter a question."),
  language: z.enum(["en", "hi", "te"]).default("en"),
  context: farmingContextSchema,
  history: z
    .array(historyMessageSchema)
    .max(
      config.maxHistoryLength,
      `Conversation history is too long. Maximum ${config.maxHistoryLength} messages.`
    )
    .optional()
    .default([]),
  sessionId: z.string().max(100).optional(),
  userId: z.string().max(100).optional(),
});

export type ChatRequest = z.infer<typeof chatRequestSchema>;
export type FarmingContext = z.infer<typeof farmingContextSchema>;
export type HistoryMessage = z.infer<typeof historyMessageSchema>;

export const advisoryResponseSchema = z.object({
  answer: z.string().min(1).max(10000),
  category: z
    .enum([
      "crop_selection",
      "soil_management",
      "seeds_sowing",
      "irrigation",
      "nutrient_management",
      "pest_management",
      "plant_diseases",
      "weather_precautions",
      "harvesting",
      "sustainable_farming",
      "general_agriculture",
      "out_of_scope",
    ])
    .default("general_agriculture"),
  possibleCauses: z.array(z.string()).optional().default([]),
  recommendations: z.array(z.string()).optional().default([]),
  precautions: z.array(z.string()).optional().default([]),
  followUpQuestions: z.array(z.string()).optional().default([]),
  safetyLevel: z.enum(["low", "moderate", "high"]).default("low"),
  needsExpert: z.boolean().default(false),
  disclaimer: z.string().optional().default("This is general guidance. Consult a local agricultural expert for specific recommendations."),
});

export type AdvisoryResponse = z.infer<typeof advisoryResponseSchema>;
