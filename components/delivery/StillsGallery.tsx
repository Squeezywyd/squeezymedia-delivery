"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function StillsGallery({
  stills,
  carLabel,
}: {
  stills: string[];
  carLabel: string;
}) {
  if (stills.length === 0) return null;

  return (
    <section className="bg-background py-20 sm:py-28">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="px-6 sm:px-10"
      >
        <p className="font-display text-xs tracking-[0.4em] text-white/40 uppercase">
          Stills
        </p>
        <h2 className="mt-2 font-display text-2xl tracking-tight text-foreground sm:text-3xl">
          From the Session
        </h2>
      </motion.div>

      <div className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 sm:px-10 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {stills.map((src, i) => (
          <motion.div
            key={src}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{
              duration: 0.7,
              delay: (i % 6) * 0.08,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="relative aspect-[4/5] w-[72vw] flex-none snap-start overflow-hidden bg-white/5 sm:w-[38vw] lg:w-[26vw]"
          >
            <Image
              src={src}
              alt={`${carLabel} — still ${i + 1}`}
              fill
              sizes="(min-width: 1024px) 26vw, (min-width: 640px) 38vw, 72vw"
              className="object-cover"
              loading="lazy"
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
