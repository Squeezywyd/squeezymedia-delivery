"use client";

import { motion } from "framer-motion";
import type { CutInfo, PublicDeliveryConfig } from "@/lib/types";

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

function Row({ cut, index }: { cut: CutInfo; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-center justify-between gap-4 border-b border-white/10 py-6"
    >
      <div>
        <p className="font-display text-lg tracking-tight text-foreground sm:text-xl">
          {cut.label}
        </p>
        <p className="mt-1 text-sm tabular-nums text-white/40">{cut.duration}</p>
      </div>
      <a
        href={cut.url}
        download
        className="flex flex-none items-center gap-2 border border-white/20 px-4 py-2 text-xs tracking-[0.2em] text-white/80 uppercase transition hover:border-[var(--accent)] hover:text-white"
      >
        <DownloadIcon className="h-3.5 w-3.5" />
        Download
      </a>
    </motion.div>
  );
}

export default function CutsAlbum({ delivery }: { delivery: PublicDeliveryConfig }) {
  const extraCuts = [
    delivery.cuts.directors,
    delivery.cuts.social,
    delivery.cuts.bts,
  ].filter((c): c is CutInfo => Boolean(c));

  if (extraCuts.length === 0) return null;

  return (
    <section className="bg-background px-6 py-20 sm:px-10 sm:py-28">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto max-w-2xl"
      >
        <p className="font-display text-xs tracking-[0.4em] text-white/40 uppercase">
          The Collection
        </p>
        <h2 className="mt-2 font-display text-2xl tracking-tight text-foreground sm:text-3xl">
          Every Cut
        </h2>

        <div className="mt-8">
          {extraCuts.map((cut, i) => (
            <Row key={cut.label} cut={cut} index={i} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
