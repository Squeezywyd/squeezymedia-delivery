"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import type { PublicDeliveryConfig } from "@/lib/types";

export default function PasswordGate({
  delivery,
  onUnlock,
}: {
  delivery: PublicDeliveryConfig;
  onUnlock: () => void;
}) {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const [checking, setChecking] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (checking) return;
    setChecking(true);
    try {
      const res = await fetch(
        `/api/deliveries/${delivery.slug}/verify-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: value }),
        }
      );
      const { ok } = await res.json();
      if (ok) {
        onUnlock();
      } else {
        setError(true);
        setShakeKey((k) => k + 1);
      }
    } catch {
      setError(true);
      setShakeKey((k) => k + 1);
    } finally {
      setChecking(false);
    }
  }

  return (
    <main className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-sm"
      >
        <p className="font-display text-xs tracking-[0.5em] text-white/40 uppercase">
          Private Delivery
        </p>
        <h1 className="mt-4 font-display text-2xl tracking-tight text-foreground sm:text-3xl">
          {delivery.clientName}
        </h1>
        <p className="mt-2 text-sm text-white/50">
          {delivery.carMake} {delivery.carModel}
        </p>

        <motion.form
          key={shakeKey}
          onSubmit={handleSubmit}
          initial={error ? { x: 0 } : false}
          animate={
            error ? { x: [0, -10, 10, -8, 8, -4, 4, 0] } : { x: 0 }
          }
          transition={{ duration: 0.5 }}
          className="mt-10 flex flex-col gap-4"
        >
          <label htmlFor="delivery-password" className="sr-only">
            Passphrase
          </label>
          <input
            id="delivery-password"
            type="password"
            autoComplete="off"
            autoFocus
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setError(false);
            }}
            placeholder="Enter passphrase"
            className="w-full border-b border-white/25 bg-transparent px-1 py-3 text-center text-lg tracking-widest text-foreground outline-none placeholder:text-white/30 focus:border-[var(--accent)]"
            aria-invalid={error}
            aria-describedby={error ? "delivery-password-error" : undefined}
          />
          <button
            type="submit"
            disabled={checking}
            className="mt-4 border border-white/20 px-6 py-3 text-sm tracking-[0.3em] uppercase text-white/80 transition hover:border-[var(--accent)] hover:text-white disabled:opacity-50"
          >
            {checking ? "Checking…" : "Unlock"}
          </button>
        </motion.form>

        <p
          id="delivery-password-error"
          role="alert"
          className={`mt-4 text-sm text-red-400 transition-opacity ${
            error ? "opacity-100" : "opacity-0"
          }`}
        >
          That passphrase didn&apos;t work. Please try again.
        </p>
      </motion.div>
    </main>
  );
}
