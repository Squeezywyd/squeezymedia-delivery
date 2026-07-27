import { NextRequest, NextResponse } from "next/server";
import { verifyDeliveryPassword } from "@/lib/deliveries";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const body = await request.json().catch(() => null);
  const attempt = typeof body?.password === "string" ? body.password : "";

  if (!attempt) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const ok = await verifyDeliveryPassword(slug, attempt);
  return NextResponse.json({ ok }, { status: ok ? 200 : 401 });
}
