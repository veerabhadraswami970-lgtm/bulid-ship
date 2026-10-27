import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { config } from "./config.js";

let adminClient: SupabaseClient | null = null;
let anonClient: SupabaseClient | null = null;

/**
 * Returns a Supabase client with the service role key for authorized server operations,
 * or falls back to anon key if service role is not provided.
 * Never exposes this client or its keys to the frontend.
 */
export function getSupabaseAdmin(): SupabaseClient | null {
  if (!config.isSupabaseConfigured) return null;

  if (!adminClient) {
    const key = config.supabaseServiceRoleKey || config.supabaseAnonKey;
    if (!key || !config.supabaseUrl) return null;

    adminClient = createClient(config.supabaseUrl, key, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }

  return adminClient;
}

/**
 * Returns a Supabase client configured with the anonymous key.
 */
export function getSupabaseAnon(): SupabaseClient | null {
  if (!config.supabaseUrl || !config.supabaseAnonKey) return null;

  if (!anonClient) {
    anonClient = createClient(config.supabaseUrl, config.supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }

  return anonClient;
}

/**
 * Safe database connectivity check that verifies connection without revealing credentials.
 */
export async function checkSupabaseConnection(): Promise<{
  status: "configured" | "not_configured" | "connected" | "error";
  details?: string;
}> {
  if (!config.isSupabaseConfigured) {
    return { status: "not_configured" };
  }

  const client = getSupabaseAdmin();
  if (!client) {
    return { status: "not_configured" };
  }

  try {
    // Perform a lightweight probe to test connectivity
    const { error } = await client
      .from("chat_sessions")
      .select("id")
      .limit(1);

    if (error) {
      // 42P01 is PostgreSQL "relation does not exist" - connection succeeded, but table not yet created
      if (error.code === "42P01") {
        return {
          status: "connected",
          details: "Connected to Supabase (tables pending migration)",
        };
      }
      return {
        status: "error",
        details: "Supabase connection error (check network or credentials)",
      };
    }

    return { status: "connected" };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return {
      status: "error",
      details: message.includes("fetch") ? "Network unreachable" : "Connection failed",
    };
  }
}

/**
 * Persists an advisory interaction to Supabase if persistence is enabled.
 * If Supabase is disabled or unavailable, this function silently no-ops.
 */
export async function persistChatInteraction(params: {
  sessionId: string;
  userId?: string;
  userMessage: string;
  language: string;
  context?: Record<string, unknown>;
  advisoryResponse: Record<string, unknown>;
}): Promise<void> {
  if (!config.persistenceEnabled) return;

  const client = getSupabaseAdmin();
  if (!client) return;

  try {
    // Upsert session
    await client.from("chat_sessions").upsert(
      {
        id: params.sessionId,
        user_id: params.userId || null,
        language: params.language,
        context: params.context || {},
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );

    // Insert user message and assistant reply
    await client.from("chat_messages").insert([
      {
        session_id: params.sessionId,
        role: "user",
        content: params.userMessage,
        language: params.language,
        created_at: new Date().toISOString(),
      },
      {
        session_id: params.sessionId,
        role: "assistant",
        content:
          (params.advisoryResponse.answer as string) ||
          JSON.stringify(params.advisoryResponse),
        structured_data: params.advisoryResponse,
        language: params.language,
        created_at: new Date().toISOString(),
      },
    ]);
  } catch (err: unknown) {
    // Non-blocking: log warning without crashing user advisory
    console.warn(
      "Supabase chat persistence warning:",
      err instanceof Error ? err.message : err
    );
  }
}

/**
 * Retrieves chat history for a session from Supabase if persistence is active.
 */
export async function getSessionMessages(sessionId: string): Promise<Array<{
  role: string;
  content: string;
  createdAt: string;
}>> {
  if (!config.persistenceEnabled) return [];

  const client = getSupabaseAdmin();
  if (!client) return [];

  try {
    const { data, error } = await client
      .from("chat_messages")
      .select("role, content, created_at")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: true })
      .limit(config.maxHistoryMessages);

    if (error || !data) return [];

    return data.map((msg) => ({
      role: msg.role,
      content: msg.content,
      createdAt: msg.created_at,
    }));
  } catch {
    return [];
  }
}

/**
 * Deletes session and associated messages if persistence is active.
 */
export async function deleteSessionHistory(sessionId: string): Promise<boolean> {
  if (!config.persistenceEnabled) return true;

  const client = getSupabaseAdmin();
  if (!client) return true;

  try {
    await client.from("chat_messages").delete().eq("session_id", sessionId);
    await client.from("chat_sessions").delete().eq("id", sessionId);
    return true;
  } catch {
    return false;
  }
}
