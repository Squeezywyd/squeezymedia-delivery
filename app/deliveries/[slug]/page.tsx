import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDeliveryBySlug } from "@/lib/deliveries";
import { toPublicDelivery } from "@/lib/types";
import { STUDIO } from "@/lib/brand";
import DeliveryExperience from "./DeliveryExperience";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Deliveries live in Supabase and can be created at any time via /admin, so
// this route renders per-request rather than prerendering a fixed slug list.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const delivery = await getDeliveryBySlug(slug);
  if (!delivery) return { title: "Film Not Found" };
  return {
    title: `${delivery.clientName} — ${delivery.carMake} ${delivery.carModel} | ${STUDIO.name}`,
    description: `A private film delivery for ${delivery.clientName} from ${STUDIO.name}.`,
    robots: { index: false, follow: false },
  };
}

export default async function DeliveryPage({ params }: PageProps) {
  const { slug } = await params;
  const delivery = await getDeliveryBySlug(slug);

  if (!delivery) {
    notFound();
  }

  return <DeliveryExperience delivery={toPublicDelivery(delivery)} />;
}
