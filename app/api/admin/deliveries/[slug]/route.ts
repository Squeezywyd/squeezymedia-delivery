import { NextRequest, NextResponse } from "next/server";
import { upsertDelivery, deleteDelivery } from "@/lib/deliveries";
import type { DeliveryConfig } from "@/lib/types";

// Protected by middleware.ts (Basic Auth on /api/admin/:path*).
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const config = (await request.json().catch(() => null)) as DeliveryConfig | null;
  if (!config || config.slug !== slug) {
    return NextResponse.json({ error: "Slug mismatch" }, { status: 400 });
  }

  await upsertDelivery(config);
  return NextResponse.json({ ok: true, slug });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  await deleteDelivery(slug);
  return NextResponse.json({ ok: true });
}
