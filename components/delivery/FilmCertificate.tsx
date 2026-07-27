"use client";

import { motion } from "framer-motion";
import type { PublicDeliveryConfig } from "@/lib/types";

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

function possessive(name: string): string {
  return /s$/i.test(name) ? `${name}'` : `${name}'s`;
}

export default function FilmCertificate({
  delivery,
}: {
  delivery: PublicDeliveryConfig;
}) {
  const total = delivery.collectionSize ?? delivery.filmNumber;

  return (
    <section className="border-y border-white/10 bg-background px-6 py-24 sm:py-32">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto flex max-w-lg flex-col items-center text-center"
      >
        <span
          className="font-display text-7xl tracking-tight sm:text-9xl"
          style={{ color: "var(--accent)" }}
        >
          {String(delivery.filmNumber).padStart(2, "0")}
        </span>
        <p className="mt-4 text-sm tracking-[0.3em] text-white/50 uppercase">
          Film No. {delivery.filmNumber} of {total}
        </p>
        <p className="mt-1 text-sm text-white/40">
          {possessive(delivery.clientName)} Collection
        </p>

        <div className="mt-10 w-full border-t border-white/10 pt-6">
          <p className="font-display text-xl tracking-tight text-foreground sm:text-2xl">
            {delivery.carMake} {delivery.carModel}
          </p>
          <p className="mt-1 text-sm text-white/40">
            Shot {formatDate(delivery.shootDate)}
          </p>
        </div>
      </motion.div>
    </section>
  );
}
