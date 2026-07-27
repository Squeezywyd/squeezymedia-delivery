"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import type { DeliveryConfig } from "@/lib/types";

export default function AdminList({
  deliveries,
}: {
  deliveries: DeliveryConfig[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const created = searchParams.get("created");
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleCopyLink(slug: string) {
    await navigator.clipboard.writeText(`${window.location.origin}/deliveries/${slug}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleDelete(slug: string) {
    if (!confirm(`Delete the delivery for "${slug}"? This cannot be undone.`)) {
      return;
    }
    setDeletingSlug(slug);
    try {
      const res = await fetch(`/api/admin/deliveries/${slug}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      router.refresh();
    } catch {
      alert("Could not delete this delivery. Please try again.");
    } finally {
      setDeletingSlug(null);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-display text-xs tracking-[0.4em] text-brand uppercase">
            Squeezy.Media Admin
          </p>
          <h1 className="mt-2 font-display text-3xl tracking-tight text-foreground">
            Deliveries
          </h1>
        </div>
        <Link
          href="/admin/new"
          className="border border-brand bg-brand px-5 py-3 text-sm tracking-[0.2em] text-brand-foreground uppercase transition hover:opacity-90"
        >
          + New Delivery
        </Link>
      </div>

      {created && (
        <div className="mt-6 flex items-center justify-between gap-4 border border-brand/40 bg-brand/10 px-4 py-3 text-sm text-white">
          <span>
            Delivery created. Live at{" "}
            <span className="font-medium text-brand">/deliveries/{created}</span>
          </span>
          <button
            type="button"
            onClick={() => handleCopyLink(created)}
            className="flex-none text-xs uppercase tracking-wide text-brand hover:opacity-80"
          >
            {copied ? "Copied!" : "Copy link"}
          </button>
        </div>
      )}

      <ul className="mt-10 divide-y divide-white/10 border-y border-white/10">
        {deliveries.length === 0 && (
          <li className="py-8 text-center text-sm text-white/40">
            No deliveries yet.
          </li>
        )}
        {deliveries.map((d) => (
          <li key={d.slug} className="flex items-center justify-between py-4">
            <div>
              <p className="text-sm text-foreground">
                {d.clientName} — {d.carMake} {d.carModel}
              </p>
              <p className="mt-1 text-xs text-white/40">
                /deliveries/{d.slug}
                {d.password ? " · gated" : ""}
                {d.releaseAt && new Date(d.releaseAt) > new Date()
                  ? ` · releases ${new Date(d.releaseAt).toLocaleDateString()}`
                  : ""}
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs uppercase tracking-wide">
              <button
                type="button"
                onClick={() => handleCopyLink(d.slug)}
                className="text-white/60 hover:text-brand"
              >
                {copied ? "Copied!" : "Copy Link"}
              </button>
              <a
                href={`/deliveries/${d.slug}`}
                target="_blank"
                rel="noreferrer"
                className="text-white/60 hover:text-brand"
              >
                View
              </a>
              <Link href={`/admin/${d.slug}`} className="text-white/60 hover:text-brand">
                Edit
              </Link>
              <button
                type="button"
                onClick={() => handleDelete(d.slug)}
                disabled={deletingSlug === d.slug}
                className="text-red-400/80 hover:text-red-400 disabled:opacity-50"
              >
                {deletingSlug === d.slug ? "…" : "Delete"}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
