import { NextRequest, NextResponse } from "next/server";
import { upsertDelivery, getDeliveryBySlug } from "@/lib/deliveries";
import type { DeliveryConfig } from "@/lib/types";

// Protected by middleware.ts (Basic Auth on /api/admin/:path*).
export async function POST(request: NextRequest) {
  const config = (await request.json().catch(() => null)) as DeliveryConfig | null;
  if (!config?.slug) {
    return NextResponse.json({ error: "Missing delivery data" }, { status: 400 });
  }

  const existing = await getDeliveryBySlug(config.slug);
  if (existing) {
    return NextResponse.json(
      { error: `A delivery with slug "${config.slug}" already exists.` },
      { status: 409 }
    );
  }

  await upsertDelivery(config);
  return NextResponse.json({ ok: true, slug: config.slug });
}
