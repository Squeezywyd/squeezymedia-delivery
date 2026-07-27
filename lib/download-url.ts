import { slugify } from "@/lib/slugify";

/** Cross-origin `<a download>` is silently ignored by browsers — the file
 * just opens/plays instead of downloading. Supabase Storage's public URLs
 * support a `?download` query param that sets Content-Disposition: attachment
 * server-side instead, which works regardless of origin. Only use this for
 * the download link's href — never for a <video src>, which should keep
 * playing inline. */
export function forceDownloadUrl(url: string, filename?: string): string {
  const separator = url.includes("?") ? "&" : "?";
  const param = filename ? `download=${encodeURIComponent(filename)}` : "download";
  return `${url}${separator}${param}`;
}

export function buildDownloadFilename(parts: string[], url: string): string {
  const clean = url.split("?")[0];
  const dot = clean.lastIndexOf(".");
  const ext = dot === -1 ? "mp4" : clean.slice(dot + 1);
  return `${slugify(parts.join(" "))}.${ext}`;
}
