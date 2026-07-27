"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { PublicDeliveryConfig } from "@/lib/types";
import SafeVideo from "./SafeVideo";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  done: boolean;
}

function getTimeLeft(releaseAt: string): TimeLeft {
  const diff = new Date(releaseAt).getTime() - Date.now();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true };
  }
  const seconds = Math.floor(diff / 1000);
  return {
    days: Math.floor(seconds / 86400),
    hours: Math.floor((seconds % 86400) / 3600),
    minutes: Math.floor((seconds % 3600) / 60),
    seconds: seconds % 60,
    done: false,
  };
}

function Segment({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="font-display text-4xl tabular-nums text-foreground sm:text-6xl">
        {String(value).padStart(2, "0")}
      </span>
      <span className="mt-2 text-[10px] tracking-[0.35em] text-white/40 uppercase sm:text-xs">
        {label}
      </span>
    </div>
  );
}

export default function CountdownTeaser({
  delivery,
  onComplete,
}: {
  delivery: PublicDeliveryConfig;
  onComplete: () => void;
}) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    if (!delivery.releaseAt) {
      onComplete();
      return;
    }
    const tick = () => {
      const t = getTimeLeft(delivery.releaseAt as string);
      setTimeLeft(t);
      if (t.done) onComplete();
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [delivery.releaseAt, onComplete]);

  const teaser = delivery.teaser;

  return (
    <main className="fixed inset-0 z-40 flex flex-col items-center justify-center overflow-hidden bg-background text-center">
      <div className="absolute inset-0">
        {teaser ? (
          <SafeVideo
            className="h-full w-full object-cover opacity-40"
            src={teaser.url}
            poster={delivery.posterImage}
            autoPlay
            muted
            loop
            playsInline
            fallbackClassName="h-full w-full bg-cover bg-center opacity-40"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={delivery.posterImage}
            alt=""
            className="h-full w-full object-cover opacity-40"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/40" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 px-6"
      >
        <p className="font-display text-xs tracking-[0.5em] text-white/50 uppercase">
          {delivery.clientName} · {delivery.carMake} {delivery.carModel}
        </p>
        <h1 className="mt-4 font-display text-2xl tracking-tight text-foreground sm:text-4xl">
          The Film Releases In
        </h1>

        {timeLeft && (
          <div className="mt-10 flex items-center justify-center gap-6 sm:gap-10">
            <Segment value={timeLeft.days} label="Days" />
            <Segment value={timeLeft.hours} label="Hrs" />
            <Segment value={timeLeft.minutes} label="Min" />
            <Segment value={timeLeft.seconds} label="Sec" />
          </div>
        )}
      </motion.div>
    </main>
  );
}
