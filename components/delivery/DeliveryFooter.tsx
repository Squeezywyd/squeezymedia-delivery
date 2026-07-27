import type { PublicDeliveryConfig } from "@/lib/types";
import { STUDIO } from "@/lib/brand";

export default function DeliveryFooter({
  delivery,
}: {
  delivery: PublicDeliveryConfig;
}) {
  return (
    <footer className="border-t border-white/10 bg-background px-6 py-14 text-center sm:px-10">
      <p className="font-display text-sm tracking-[0.3em] text-foreground/80 uppercase">
        {delivery.videographerName ?? STUDIO.name}
      </p>
      <p className="mt-3 text-xs text-white/35">
        Delivered privately to {delivery.clientName}. Please don&apos;t share
        this link publicly.
      </p>
      <a
        href={`mailto:${STUDIO.email}`}
        className="mt-4 inline-block text-xs tracking-wide text-white/40 underline decoration-white/20 underline-offset-4 transition hover:text-brand hover:decoration-brand"
      >
        {STUDIO.email}
      </a>
    </footer>
  );
}
