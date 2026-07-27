import DeliveryForm from "@/components/admin/DeliveryForm";

export default function NewDeliveryPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <p className="font-display text-xs tracking-[0.4em] text-brand uppercase">
        Squeezy.Media Admin
      </p>
      <h1 className="mt-2 mb-10 font-display text-3xl tracking-tight text-foreground">
        New Delivery
      </h1>
      <DeliveryForm mode="create" />
    </div>
  );
}
