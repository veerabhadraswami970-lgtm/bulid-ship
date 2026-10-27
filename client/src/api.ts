import type {
  ApiResponse,
  FarmingContext,
  ChatMessage,
} from "./types";

const API_BASE = (import.meta.env.VITE_API_BASE_URL || "/api").replace(/\/+$/, "");

export async function sendChatMessage(
  message: string,
  language: string,
  context?: FarmingContext,
  history?: Array<{ role: string; content: string }>
): Promise<ApiResponse> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 35000);

  try {
    const response = await fetch(`${API_BASE}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        language,
        context,
        history: history?.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.status === 413) {
      return {
        success: false,
        error: { code: "PAYLOAD_TOO_LARGE", message: "Your message is too long. Please shorten it." },
      };
    }

    if (response.status === 429) {
      return {
        success: false,
        error: { code: "RATE_LIMITED", message: "Too many requests. Please wait a moment and try again." },
      };
    }

    const data = await response.json();
    return data as ApiResponse;
  } catch (error: unknown) {
    clearTimeout(timeoutId);
    const err = error as { name?: string };

    if (err.name === "AbortError") {
      return {
        success: false,
        error: { code: "TIMEOUT", message: "The request took too long. Please try again." },
      };
    }

    return {
      success: false,
      error: { code: "NETWORK_ERROR", message: "Could not connect to the server. Please check your connection." },
    };
  }
}

export async function clearSession(): Promise<void> {
  try {
    await fetch(`${API_BASE}/chat/session`, { method: "DELETE" });
  } catch {
    // Best effort
  }
}

export async function fetchConfig(): Promise<{
  maxMessageLength: number;
} | null> {
  try {
    const res = await fetch(`${API_BASE}/config`);
    if (res.ok) return await res.json();
  } catch {
    // Fallback to defaults
  }
  return null;
}

export function buildHistoryFromMessages(
  messages: ChatMessage[]
): Array<{ role: string; content: string }> {
  return messages
    .filter((m) => !m.error)
    .map((m) => ({
      role: m.role,
      content: m.content,
    }));
}
