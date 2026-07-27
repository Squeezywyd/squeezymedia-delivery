"use client";

import { motion } from "framer-motion";
import type { PublicDeliveryConfig } from "@/lib/types";
import { forceDownloadUrl, buildDownloadFilename } from "@/lib/download-url";

function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M12 4v11m0 0 4.5-4.5M12 15l-4.5-4.5M5 19h14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function HeroDownload({
  delivery,
}: {
  delivery: PublicDeliveryConfig;
}) {
  const cut = delivery.cuts.hero;
  const filename = buildDownloadFilename(
    [delivery.clientName, delivery.carMake, delivery.carModel, cut.label],
    cut.url
  );
  const href = forceDownloadUrl(cut.url, filename);

  return (
    <section className="bg-background px-6 py-16 text-center sm:py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="font-display text-xs tracking-[0.4em] text-white/40 uppercase">
          Your Final Film
        </p>
        <h2 className="mt-2 font-display text-2xl tracking-tight text-foreground sm:text-3xl">
          {cut.label}
        </h2>
        <p className="mt-1 text-sm tabular-nums text-white/40">{cut.duration}</p>

        <a
          href={href}
          className="mt-8 inline-flex items-center gap-3 px-8 py-4 text-sm font-medium tracking-[0.25em] uppercase shadow-lg transition hover:opacity-90 hover:shadow-xl"
          style={{
            background: "var(--accent)",
            color: "var(--accent-foreground)",
            boxShadow: "0 8px 30px -8px var(--accent)",
          }}
        >
          <DownloadIcon className="h-4 w-4" />
          Download Your Film
        </a>
      </motion.div>
    </section>
  );
}
