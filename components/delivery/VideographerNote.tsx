"use client";

import { motion } from "framer-motion";
import type { VideographerNote as VideographerNoteType } from "@/lib/types";

export default function VideographerNote({
  note,
  videographerName,
}: {
  note: VideographerNoteType;
  videographerName?: string;
}) {
  if (!note.text && !note.audioUrl) return null;

  return (
    <section className="bg-background px-6 py-20 sm:py-28">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto max-w-xl text-center"
      >
        <p className="font-display text-xs tracking-[0.4em] text-white/40 uppercase">
          A Note From Your Videographer
        </p>

        {note.text && (
          <p className="mt-6 text-balance font-display text-xl leading-relaxed text-foreground/90 sm:text-2xl">
            &ldquo;{note.text}&rdquo;
          </p>
        )}

        {note.audioUrl && (
          <audio
            controls
            src={note.audioUrl}
            className="mx-auto mt-8 w-full max-w-sm"
          >
            Your browser does not support the audio element.
          </audio>
        )}

        {videographerName && (
          <p className="mt-6 text-sm tracking-[0.2em] text-white/40 uppercase">
            — {videographerName}
          </p>
        )}
      </motion.div>
    </section>
  );
}
