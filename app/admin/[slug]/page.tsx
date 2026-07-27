import { notFound } from "next/navigation";
import { getDeliveryBySlug } from "@/lib/deliveries";
import DeliveryForm from "@/components/admin/DeliveryForm";

export const dynamic = "force-dynamic";

export default async function EditDeliveryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const delivery = await getDeliveryBySlug(slug);
  if (!delivery) notFound();

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <p className="font-display text-xs tracking-[0.4em] text-brand uppercase">
        Squeezy.Media Admin
      </p>
      <h1 className="mt-2 mb-10 font-display text-3xl tracking-tight text-foreground">
        Edit {delivery.clientName}
      </h1>
      <DeliveryForm mode="edit" initial={delivery} />
    </div>
  );
}
