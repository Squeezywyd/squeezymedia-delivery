export interface CutInfo {
  label: string;
  url: string;
  duration: string;
  /** Aspect ratio as width/height, e.g. 16/9 or 9/16. Defaults to 16/9. */
  aspectRatio?: number;
}

export interface VideographerNote {
  text?: string;
  audioUrl?: string;
}

export interface DeliveryCuts {
  hero: CutInfo;
  directors?: CutInfo;
  social?: CutInfo;
  bts?: CutInfo;
}

export interface DeliveryConfig {
  slug: string;
  clientName: string;
  carMake: string;
  carModel: string;
  shootDate: string;
  accentColor: string;
  /** Optional passphrase. Null/undefined = no gate. Server-side only — never sent to the client, see PublicDeliveryConfig. */
  password?: string | null;
  /** ISO timestamp. If in the future, page shows a countdown until this time. Null/undefined = live immediately. */
  releaseAt?: string | null;
  /** Muted looping clip shown behind the countdown. Falls back to the hero poster if omitted. */
  teaser?: CutInfo;
  filmNumber: number;
  /** Total films in this client's collection, for the "Film No. X of Y" certificate copy. Defaults to filmNumber. */
  collectionSize?: number;
  videographerName?: string;
  videographerNote?: VideographerNote;
  posterImage: string;
  cuts: DeliveryCuts;
  stills: string[];
}

/** What actually reaches the browser: everything except the passphrase itself. */
export type PublicDeliveryConfig = Omit<DeliveryConfig, "password"> & {
  hasPassword: boolean;
};

export function toPublicDelivery(delivery: DeliveryConfig): PublicDeliveryConfig {
  const { password, ...rest } = delivery;
  return { ...rest, hasPassword: Boolean(password) };
}
