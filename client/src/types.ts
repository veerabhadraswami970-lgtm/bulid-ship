export type SupportedLanguage = "en" | "hi" | "te";

export interface FarmingContext {
  cropName?: string;
  country?: string;
  state?: string;
  district?: string;
  locality?: string;
  soilType?: string;
  waterAvailability?: "low" | "medium" | "high" | "unknown";
  growthStage?:
    | "planning"
    | "sowing"
    | "vegetative"
    | "flowering"
    | "fruiting"
    | "harvesting"
    | "unknown";
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  category?: string;
  possibleCauses?: string[];
  recommendations?: string[];
  precautions?: string[];
  followUpQuestions?: string[];
  safetyLevel?: "low" | "moderate" | "high";
  needsExpert?: boolean;
  disclaimer?: string;
  error?: boolean;
}

export interface AdvisoryResponse {
  answer: string;
  category: string;
  possibleCauses: string[];
  recommendations: string[];
  precautions: string[];
  followUpQuestions: string[];
  safetyLevel: "low" | "moderate" | "high";
  needsExpert: boolean;
  disclaimer: string;
}

export interface ApiSuccessResponse {
  success: true;
  data: AdvisoryResponse;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

export type ApiResponse = ApiSuccessResponse | ApiErrorResponse;

export interface AppConfig {
  appName: string;
  supportedLanguages: string[];
  maxMessageLength: number;
  persistenceEnabled: boolean;
}
