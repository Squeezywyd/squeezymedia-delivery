import "server-only";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { rowToDeliveryConfig, deliveryConfigToRow } from "@/lib/supabase/mappers";
import type { DeliveryRow } from "@/lib/supabase/mappers";
import type { DeliveryConfig } from "@/lib/types";

/** Full config, including the passphrase. Server-only — never pass this
 * directly to a Client Component; use `toPublicDelivery` first. */
export async function getDeliveryBySlug(
  slug: string
): Promise<DeliveryConfig | null> {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("deliveries")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;
  return rowToDeliveryConfig(data as DeliveryRow);
}

export async function getAllSlugs(): Promise<string[]> {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase.from("deliveries").select("slug");
  if (error) throw error;
  return (data ?? []).map((row) => row.slug as string);
}

export async function getAllDeliveries(): Promise<DeliveryConfig[]> {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("deliveries")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((row) => rowToDeliveryConfig(row as DeliveryRow));
}

/** Creates or fully replaces a delivery. Used by the admin form. */
export async function upsertDelivery(config: DeliveryConfig): Promise<void> {
  const supabase = createServiceRoleClient();
  const { error } = await supabase
    .from("deliveries")
    .upsert(deliveryConfigToRow(config));
  if (error) throw error;
}

export async function deleteDelivery(slug: string): Promise<void> {
  const supabase = createServiceRoleClient();
  const { error } = await supabase.from("deliveries").delete().eq("slug", slug);
  if (error) throw error;
}

/** True passphrase check, done entirely server-side — the value never
 * reaches the browser either way. */
export async function verifyDeliveryPassword(
  slug: string,
  attempt: string
): Promise<boolean> {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("deliveries")
    .select("password")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  if (!data?.password) return false;
  return attempt.trim().toLowerCase() === data.password.trim().toLowerCase();
}
