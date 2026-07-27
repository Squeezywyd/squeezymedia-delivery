"use client";

import { createClient } from "@supabase/supabase-js";

/** Anon-key Supabase client for the browser. Only used to PUT files straight
 * to Storage against a signed upload URL issued by the server — it never
 * reads or writes the `deliveries` table directly (RLS blocks that anyway). */
export function createBrowserSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error(
      "Supabase browser credentials are missing. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
  }
  return createClient(url, key, {
    auth: { persistSession: false },
  });
}
