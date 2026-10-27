import { config as dotenvConfig } from "dotenv";
import { resolve } from "path";
import { existsSync } from "fs";

// Load .env from cwd or parent directories
const envPath = resolve(process.cwd(), ".env");
if (existsSync(envPath)) {
  dotenvConfig({ path: envPath });
} else {
  dotenvConfig();
}

function parseEnvInt(key: string, defaultValue: number): number {
  const val = process.env[key];
  if (!val) return defaultValue;
  const parsed = parseInt(val, 10);
  return Number.isNaN(parsed) ? defaultValue : parsed;
}

function parseEnvBool(key: string, defaultValue: boolean): boolean {
  const val = process.env[key]?.trim().toLowerCase();
  if (val === undefined) return defaultValue;
  return val === "true" || val === "1" || val === "yes";
}

const supabaseUrl = process.env.SUPABASE_URL?.trim() || "";
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY?.trim() || "";
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || "";
const persistenceRequested = parseEnvBool("PERSISTENCE_ENABLED", false);

// Only truly active if requested AND at least one key is provided
const isSupabaseConfigured = Boolean(
  supabaseUrl && (supabaseAnonKey || supabaseServiceRoleKey)
);

const frontendUrl =
  process.env.FRONTEND_URL?.trim() ||
  process.env.CLIENT_URL?.trim() ||
  "http://localhost:5173";

export const config = {
  port: parseEnvInt("PORT", 5000),
  frontendUrl,
  clientUrl: frontendUrl, // backward compatibility
  nodeEnv: process.env.NODE_ENV || "development",

  // Gemini AI
  geminiApiKey: process.env.GEMINI_API_KEY?.trim() || "",
  geminiModel: process.env.GEMINI_MODEL?.trim() || "gemini-2.0-flash",

  // Supabase PostgreSQL
  supabaseUrl,
  supabaseAnonKey,
  supabaseServiceRoleKey,
  isSupabaseConfigured,
  persistenceRequested,
  persistenceEnabled: persistenceRequested && isSupabaseConfigured,

  // Guardrails and limits
  maxMessageLength: parseEnvInt("MAX_MESSAGE_LENGTH", 2000),
  maxHistoryMessages: parseEnvInt("MAX_HISTORY_MESSAGES", 12),
  maxHistoryLength: parseEnvInt("MAX_HISTORY_MESSAGES", 12), // backward compatibility
  requestTimeoutMs: parseEnvInt("AI_REQUEST_TIMEOUT_MS", 30000),

  // Rate Limiting
  rateLimitWindowMs: parseEnvInt("RATE_LIMIT_WINDOW_MS", 60000),
  rateLimitMaxRequests: parseEnvInt("RATE_LIMIT_MAX_REQUESTS", 10),

  // Supported agricultural localization
  supportedLanguages: ["en", "hi", "te"] as const,
  appName: "KrishiMitra AI",
} as const;

export type SupportedLanguage = (typeof config.supportedLanguages)[number];

/**
 * Validates configuration at startup without logging secrets or credentials.
 */
export function validateConfig(): { valid: boolean; warnings: string[] } {
  const warnings: string[] = [];

  if (!config.geminiApiKey) {
    warnings.push(
      "GEMINI_API_KEY is not set. AI advisory queries will return a service-not-configured notice."
    );
  }

  if (config.persistenceRequested && !config.isSupabaseConfigured) {
    warnings.push(
      "PERSISTENCE_ENABLED is true, but SUPABASE_URL or keys are missing. Falling back to temporary in-memory mode."
    );
  }

  return {
    valid: true,
    warnings,
  };
}
