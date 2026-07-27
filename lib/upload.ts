"use client";

import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

/** Uploads a file straight from the browser to Supabase Storage: the server
 * only issues a short-lived signed URL (via /api/admin/sign-upload), so file
 * bytes never pass through our own serverless function — no body-size limit
 * to worry about for large video files. Returns the public URL. */
export async function uploadDeliveryFile(
  path: string,
  file: File
): Promise<string> {
  const signRes = await fetch("/api/admin/sign-upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path }),
  });
  if (!signRes.ok) {
    const body = await signRes.json().catch(() => null);
    throw new Error(body?.error ?? "Could not get an upload URL.");
  }
  const { path: signedPath, token, publicUrl } = await signRes.json();

  const supabase = createBrowserSupabaseClient();
  const { error } = await supabase.storage
    .from("deliveries")
    .uploadToSignedUrl(signedPath, token, file, { upsert: true });
  if (error) throw error;

  return publicUrl as string;
}
