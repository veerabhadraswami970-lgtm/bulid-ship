import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

let clientInstance: SupabaseClient | null = null;

if (isSupabaseConfigured && supabaseUrl && supabaseAnonKey) {
  clientInstance = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  });
}

/**
 * Returns the initialized Supabase client.
 * Throws a clear development error if configuration is missing,
 * avoiding silent failures or confusing application crashes.
 */
export function getSupabase(): SupabaseClient {
  if (!clientInstance) {
    throw new Error(
      "Supabase frontend configuration is missing. " +
      "Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in client/.env."
    );
  }
  return clientInstance;
}

/**
 * Exported client reference. Null if Supabase credentials have not been configured yet.
 */
export const supabase = clientInstance;
