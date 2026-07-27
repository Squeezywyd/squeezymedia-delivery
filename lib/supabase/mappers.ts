import type { CutInfo, DeliveryConfig, DeliveryCuts } from "@/lib/types";

/** Shape of a row in the `deliveries` table (snake_case, as Postgres returns it). */
export interface DeliveryRow {
  slug: string;
  client_name: string;
  car_make: string;
  car_model: string;
  shoot_date: string;
  accent_color: string;
  password: string | null;
  release_at: string | null;
  film_number: number;
  collection_size: number | null;
  videographer_name: string | null;
  videographer_note_text: string | null;
  videographer_note_audio_url: string | null;
  poster_image: string;
  teaser: CutInfo | null;
  cuts: DeliveryCuts;
  stills: string[];
}

export function rowToDeliveryConfig(row: DeliveryRow): DeliveryConfig {
  const hasNote = Boolean(
    row.videographer_note_text || row.videographer_note_audio_url
  );
  return {
    slug: row.slug,
    clientName: row.client_name,
    carMake: row.car_make,
    carModel: row.car_model,
    shootDate: row.shoot_date,
    accentColor: row.accent_color,
    password: row.password,
    releaseAt: row.release_at,
    filmNumber: row.film_number,
    collectionSize: row.collection_size ?? undefined,
    videographerName: row.videographer_name ?? undefined,
    videographerNote: hasNote
      ? {
          text: row.videographer_note_text ?? undefined,
          audioUrl: row.videographer_note_audio_url ?? undefined,
        }
      : undefined,
    posterImage: row.poster_image,
    teaser: row.teaser ?? undefined,
    cuts: row.cuts,
    stills: row.stills,
  };
}

/** Inverse mapping, used by the admin create/update routes. */
export function deliveryConfigToRow(
  config: DeliveryConfig
): Omit<DeliveryRow, "created_at" | "updated_at"> {
  return {
    slug: config.slug,
    client_name: config.clientName,
    car_make: config.carMake,
    car_model: config.carModel,
    shoot_date: config.shootDate,
    accent_color: config.accentColor,
    password: config.password ?? null,
    release_at: config.releaseAt ?? null,
    film_number: config.filmNumber,
    collection_size: config.collectionSize ?? null,
    videographer_name: config.videographerName ?? null,
    videographer_note_text: config.videographerNote?.text ?? null,
    videographer_note_audio_url: config.videographerNote?.audioUrl ?? null,
    poster_image: config.posterImage,
    teaser: config.teaser ?? null,
    cuts: config.cuts,
    stills: config.stills,
  };
}
