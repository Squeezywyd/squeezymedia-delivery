"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { PublicDeliveryConfig } from "@/lib/types";
import SafeVideo from "./SafeVideo";

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}
function PauseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
    </svg>
  );
}
function MuteIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M16.5 12a4.5 4.5 0 0 0-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.42.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.94 8.94 0 0 0 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06a8.99 8.99 0 0 0 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4 9.91 6.09 12 8.18V4z" />
    </svg>
  );
}
function UnmuteIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
    </svg>
  );
}
function FullscreenIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
    </svg>
  );
}

export default function HeroPlayer({ delivery }: { delivery: PublicDeliveryConfig }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);
  const [showUnmuteHint, setShowUnmuteHint] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.play().catch(() => setPlaying(false));
  }, []);

  function togglePlay() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => {});
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  }

  function toggleMute() {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
    setShowUnmuteHint(false);
  }

  function toggleFullscreen() {
    const section = sectionRef.current;
    if (!section) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      section.requestFullscreen?.().catch(() => {});
    }
  }

  return (
    <section
      ref={sectionRef}
      className="relative flex h-[100dvh] w-full items-center justify-center overflow-hidden bg-black"
    >
      <SafeVideo
        ref={videoRef}
        src={delivery.cuts.hero.url}
        poster={delivery.posterImage}
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted={muted}
        loop
        playsInline
        onCanPlay={() => setReady(true)}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        fallbackLabel="The cinematic film is temporarily unavailable. Please check back shortly."
        fallbackClassName="absolute inset-0 flex items-center justify-center bg-black px-6 text-center text-white/50"
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/40" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        className="pointer-events-none absolute left-1/2 top-[18%] -translate-x-1/2 px-6 text-center"
      >
        <p className="font-display text-xs tracking-[0.5em] text-white/60 uppercase">
          {delivery.clientName}
        </p>
        <h1 className="mt-3 font-display text-3xl tracking-tight text-white sm:text-5xl">
          {delivery.carMake} {delivery.carModel}
        </h1>
      </motion.div>

      {muted && showUnmuteHint && (
        <button
          type="button"
          onClick={toggleMute}
          className="absolute bottom-28 left-1/2 -translate-x-1/2 border border-white/30 px-4 py-2 text-xs tracking-[0.2em] text-white/80 uppercase backdrop-blur-sm transition hover:border-white/60 hover:text-white sm:bottom-32"
        >
          Tap for sound
        </button>
      )}

      <div className="absolute inset-x-0 bottom-6 flex items-center justify-center gap-4 px-6 sm:bottom-10">
        <button
          type="button"
          onClick={togglePlay}
          aria-label={playing ? "Pause" : "Play"}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 text-white transition hover:border-white/60"
        >
          {playing ? (
            <PauseIcon className="h-4 w-4" />
          ) : (
            <PlayIcon className="h-4 w-4" />
          )}
        </button>
        <button
          type="button"
          onClick={toggleMute}
          aria-label={muted ? "Unmute" : "Mute"}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 text-white transition hover:border-white/60"
        >
          {muted ? (
            <MuteIcon className="h-4 w-4" />
          ) : (
            <UnmuteIcon className="h-4 w-4" />
          )}
        </button>
        <button
          type="button"
          onClick={toggleFullscreen}
          aria-label="Toggle fullscreen"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 text-white transition hover:border-white/60"
        >
          <FullscreenIcon className="h-4 w-4" />
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 1, 0], y: [0, 6, 6, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-24 left-1/2 -translate-x-1/2 text-white/50 sm:bottom-28"
        aria-hidden="true"
      >
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
          <path
            d="M6 9l6 6 6-6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.div>
    </section>
  );
}
