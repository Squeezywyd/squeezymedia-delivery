"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { PublicDeliveryConfig } from "@/lib/types";

const RADIUS = 88;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function IgnitionLoader({
  delivery,
  onComplete,
}: {
  delivery: PublicDeliveryConfig;
  onComplete: () => void;
}) {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const applyPreference = () => {
      const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
      setReducedMotion(mql.matches);
    };
    applyPreference();
  }, []);

  const duration = reducedMotion ? 0.4 : 2.2;

  useEffect(() => {
    const id = setTimeout(onComplete, duration * 1000 + 150);
    return () => clearTimeout(id);
  }, [duration, onComplete]);

  return (
    <motion.main
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-30 flex flex-col items-center justify-center bg-background"
    >
      <div className="relative flex h-56 w-56 items-center justify-center">
        <svg
          viewBox="0 0 200 200"
          className="absolute inset-0 h-full w-full -rotate-90"
          aria-hidden="true"
        >
          <circle
            cx="100"
            cy="100"
            r={RADIUS}
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="1.5"
          />
          <motion.circle
            cx="100"
            cy="100"
            r={RADIUS}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            initial={{ strokeDashoffset: CIRCUMFERENCE }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration, ease: [0.65, 0, 0.35, 1] }}
          />
        </svg>

        <motion.div
          initial={{ rotate: -140 }}
          animate={{ rotate: 40 }}
          transition={{ duration, ease: [0.65, 0, 0.35, 1] }}
          className="absolute h-full w-full"
          style={{ transformOrigin: "50% 50%" }}
          aria-hidden="true"
        >
          <div
            className="absolute top-1/2 left-1/2 h-[2px] w-16 origin-left rounded-full"
            style={{ background: "var(--accent)" }}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: duration * 0.3, duration: duration * 0.4 }}
          className="text-center"
        >
          <p className="font-display text-[10px] tracking-[0.5em] text-white/40 uppercase">
            Igniting
          </p>
          <p className="mt-2 font-display text-sm tracking-widest text-foreground">
            {delivery.carMake} {delivery.carModel}
          </p>
        </motion.div>
      </div>
    </motion.main>
  );
}
