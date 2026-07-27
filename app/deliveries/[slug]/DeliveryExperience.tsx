"use client";

import { useCallback, useEffect, useState, type CSSProperties } from "react";
import type { PublicDeliveryConfig } from "@/lib/types";
import { accentCssVars } from "@/lib/color";
import PasswordGate from "@/components/delivery/PasswordGate";
import CountdownTeaser from "@/components/delivery/CountdownTeaser";
import IgnitionLoader from "@/components/delivery/IgnitionLoader";
import HeroPlayer from "@/components/delivery/HeroPlayer";
import StillsGallery from "@/components/delivery/StillsGallery";
import CutsAlbum from "@/components/delivery/CutsAlbum";
import FilmCertificate from "@/components/delivery/FilmCertificate";
import VideographerNote from "@/components/delivery/VideographerNote";
import DeliveryFooter from "@/components/delivery/DeliveryFooter";

type Phase = "boot" | "gate" | "countdown" | "loading" | "revealed";

function unlockKey(slug: string) {
  return `delivery-unlock:${slug}`;
}

function isReleased(delivery: PublicDeliveryConfig): boolean {
  if (!delivery.releaseAt) return true;
  return new Date(delivery.releaseAt).getTime() <= Date.now();
}

function computeInitialPhase(delivery: PublicDeliveryConfig): Phase {
  if (delivery.hasPassword) {
    const unlocked =
      typeof window !== "undefined" &&
      window.sessionStorage.getItem(unlockKey(delivery.slug)) === "true";
    if (!unlocked) return "gate";
  }
  return isReleased(delivery) ? "loading" : "countdown";
}

export default function DeliveryExperience({
  delivery,
}: {
  delivery: PublicDeliveryConfig;
}) {
  const [phase, setPhase] = useState<Phase>("boot");

  useEffect(() => {
    const resolveInitialPhase = () => setPhase(computeInitialPhase(delivery));
    resolveInitialPhase();
  }, [delivery]);

  const handleUnlock = useCallback(() => {
    window.sessionStorage.setItem(unlockKey(delivery.slug), "true");
    setPhase(isReleased(delivery) ? "loading" : "countdown");
  }, [delivery]);

  const handleCountdownComplete = useCallback(() => setPhase("loading"), []);
  const handleLoadingComplete = useCallback(() => setPhase("revealed"), []);

  const accentVars = accentCssVars(delivery.accentColor) as CSSProperties;

  return (
    <div
      style={accentVars}
      className="relative min-h-screen bg-background text-foreground"
    >
      {phase === "boot" && <div className="fixed inset-0 z-50 bg-background" />}

      {phase === "gate" && (
        <PasswordGate delivery={delivery} onUnlock={handleUnlock} />
      )}

      {phase === "countdown" && (
        <CountdownTeaser
          delivery={delivery}
          onComplete={handleCountdownComplete}
        />
      )}

      {phase === "loading" && (
        <IgnitionLoader
          delivery={delivery}
          onComplete={handleLoadingComplete}
        />
      )}

      {phase === "revealed" && (
        <>
          <HeroPlayer delivery={delivery} />
          <StillsGallery
            stills={delivery.stills}
            carLabel={`${delivery.carMake} ${delivery.carModel}`}
          />
          <CutsAlbum delivery={delivery} />
          <FilmCertificate delivery={delivery} />
          {delivery.videographerNote && (
            <VideographerNote
              note={delivery.videographerNote}
              videographerName={delivery.videographerName}
            />
          )}
          <DeliveryFooter delivery={delivery} />
        </>
      )}
    </div>
  );
}
