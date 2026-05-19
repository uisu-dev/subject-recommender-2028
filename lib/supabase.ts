import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Returns a configured Supabase client when env vars are present, otherwise null.
 * Code paths must handle the null case and fall back to localStorage so the app
 * still runs without a backend (local dev, preview branches, etc.).
 */
export const supabase: SupabaseClient | null =
  url && anonKey ? createClient(url, anonKey) : null;

export const isSupabaseEnabled = !!supabase;
