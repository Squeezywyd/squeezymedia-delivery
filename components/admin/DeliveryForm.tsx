"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Dropzone from "./Dropzone";
import { slugify } from "@/lib/slugify";
import { uploadDeliveryFile } from "@/lib/upload";
import { probeVideoFile } from "@/lib/media-probe";
import type { CutInfo, DeliveryConfig } from "@/lib/types";

function fileExt(name: string): string {
  const dot = name.lastIndexOf(".");
  return dot === -1 ? "bin" : name.slice(dot + 1).toLowerCase();
}

function toDatetimeLocalValue(iso?: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

function randomPassphrase(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  return Array.from(bytes, (b) => b.toString(36).padStart(2, "0"))
    .join("")
    .slice(0, 10);
}

interface Props {
  mode: "create" | "edit";
  initial?: DeliveryConfig;
}

export default function DeliveryForm({ mode, initial }: Props) {
  const router = useRouter();
  const [clientName, setClientName] = useState(initial?.clientName ?? "");
  const [carMake, setCarMake] = useState(initial?.carMake ?? "");
  const [carModel, setCarModel] = useState(initial?.carModel ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(mode === "edit");
  const [shootDate, setShootDate] = useState(initial?.shootDate ?? "");
  const [accentColor, setAccentColor] = useState(initial?.accentColor ?? "#8B0000");
  const [password, setPassword] = useState(initial?.password ?? "");
  const [releaseAt, setReleaseAt] = useState(
    toDatetimeLocalValue(initial?.releaseAt)
  );
  const [filmNumber, setFilmNumber] = useState(
    initial ? String(initial.filmNumber) : "1"
  );
  const [collectionSize, setCollectionSize] = useState(
    initial?.collectionSize ? String(initial.collectionSize) : ""
  );
  const [videographerName, setVideographerName] = useState(
    initial?.videographerName ?? "Squeezy.Media"
  );
  const [noteText, setNoteText] = useState(initial?.videographerNote?.text ?? "");

  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [directorsFile, setDirectorsFile] = useState<File | null>(null);
  const [socialFile, setSocialFile] = useState<File | null>(null);
  const [btsFile, setBtsFile] = useState<File | null>(null);
  const [teaserFile, setTeaserFile] = useState<File | null>(null);
  const [noteAudioFile, setNoteAudioFile] = useState<File | null>(null);
  const [newStillsFiles, setNewStillsFiles] = useState<File[]>([]);
  const [existingStills, setExistingStills] = useState<string[]>(
    initial?.stills ?? []
  );

  const [submitting, setSubmitting] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState<string | null>(null);

  const effectiveSlug = useMemo(() => {
    if (slugTouched) return slug;
    return slugify(`${clientName}-${carModel}`);
  }, [slug, slugTouched, clientName, carModel]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!clientName || !carMake || !carModel || !shootDate || !effectiveSlug) {
      setError("Please fill in client, car, date, and slug.");
      return;
    }
    if (mode === "create" && !posterFile) {
      setError("A poster image is required.");
      return;
    }
    if (mode === "create" && !heroFile) {
      setError("The hero cinematic film is required.");
      return;
    }

    setSubmitting(true);
    try {
      const base = effectiveSlug;

      let posterImage = initial?.posterImage ?? "";
      if (posterFile) {
        setProgress("Uploading poster image…");
        posterImage = await uploadDeliveryFile(
          `${base}/images/poster.${fileExt(posterFile.name)}`,
          posterFile
        );
      }

      async function uploadCut(
        file: File | null,
        label: string,
        key: string,
        existing?: CutInfo
      ): Promise<CutInfo | undefined> {
        if (!file) return existing;
        setProgress(`Uploading ${label}…`);
        const { duration, aspectRatio } = await probeVideoFile(file);
        const url = await uploadDeliveryFile(
          `${base}/videos/${key}.${fileExt(file.name)}`,
          file
        );
        return { label, url, duration, aspectRatio };
      }

      const hero = await uploadCut(
        heroFile,
        "Cinematic Film",
        "hero",
        initial?.cuts.hero
      );
      const directors = await uploadCut(
        directorsFile,
        "Director's Cut",
        "directors",
        initial?.cuts.directors
      );
      const social = await uploadCut(
        socialFile,
        "Vertical Cut",
        "social",
        initial?.cuts.social
      );
      const bts = await uploadCut(
        btsFile,
        "Behind the Scenes",
        "bts",
        initial?.cuts.bts
      );
      const teaser = await uploadCut(
        teaserFile,
        "Teaser",
        "teaser",
        initial?.teaser
      );

      let videographerNoteAudioUrl = initial?.videographerNote?.audioUrl;
      if (noteAudioFile) {
        setProgress("Uploading voice note…");
        videographerNoteAudioUrl = await uploadDeliveryFile(
          `${base}/audio/note.${fileExt(noteAudioFile.name)}`,
          noteAudioFile
        );
      }

      const uploadedStills: string[] = [];
      for (let i = 0; i < newStillsFiles.length; i++) {
        const file = newStillsFiles[i];
        setProgress(`Uploading still ${i + 1} of ${newStillsFiles.length}…`);
        const url = await uploadDeliveryFile(
          `${base}/images/still-${Date.now()}-${i}.${fileExt(file.name)}`,
          file
        );
        uploadedStills.push(url);
      }

      if (!hero) {
        setError("The hero cinematic film is required.");
        setSubmitting(false);
        return;
      }

      const config: DeliveryConfig = {
        slug: base,
        clientName,
        carMake,
        carModel,
        shootDate,
        accentColor,
        password: password.trim() ? password.trim() : null,
        releaseAt: releaseAt ? new Date(releaseAt).toISOString() : null,
        filmNumber: Number(filmNumber) || 1,
        collectionSize: collectionSize ? Number(collectionSize) : undefined,
        videographerName: videographerName || undefined,
        videographerNote:
          noteText.trim() || videographerNoteAudioUrl
            ? { text: noteText.trim() || undefined, audioUrl: videographerNoteAudioUrl }
            : undefined,
        posterImage,
        teaser,
        cuts: { hero, directors, social, bts },
        stills: [...existingStills, ...uploadedStills],
      };

      setProgress("Saving delivery…");
      const res = await fetch(
        mode === "create"
          ? "/api/admin/deliveries"
          : `/api/admin/deliveries/${base}`,
        {
          method: mode === "create" ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(config),
        }
      );

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? "Failed to save delivery.");
      }

      router.push(`/admin?created=${base}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setSubmitting(false);
      setProgress("");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-10 pb-24">
      <section className="space-y-4">
        <h2 className="font-display text-lg tracking-tight text-foreground">
          Client & Car
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Client Name" required>
            <input
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="input"
              required
            />
          </Field>
          <Field label="Slug">
            <input
              value={effectiveSlug}
              onChange={(e) => {
                setSlug(slugify(e.target.value));
                setSlugTouched(true);
              }}
              disabled={mode === "edit"}
              className="input disabled:opacity-50"
              required
            />
          </Field>
          <Field label="Car Make" required>
            <input
              value={carMake}
              onChange={(e) => setCarMake(e.target.value)}
              className="input"
              required
            />
          </Field>
          <Field label="Car Model" required>
            <input
              value={carModel}
              onChange={(e) => setCarModel(e.target.value)}
              className="input"
              required
            />
          </Field>
          <Field label="Shoot Date" required>
            <input
              type="date"
              value={shootDate}
              onChange={(e) => setShootDate(e.target.value)}
              className="input"
              required
            />
          </Field>
          <Field label="Accent Color" required>
            <input
              type="color"
              value={accentColor}
              onChange={(e) => setAccentColor(e.target.value)}
              className="h-11 w-full border border-white/20 bg-transparent"
            />
          </Field>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-lg tracking-tight text-foreground">
          Access
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Passphrase (optional)">
            <div className="flex gap-2">
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="No password"
              />
              <button
                type="button"
                onClick={() => setPassword(randomPassphrase())}
                className="border border-white/20 px-3 text-xs uppercase tracking-wide text-white/60 hover:border-brand"
              >
                Generate
              </button>
            </div>
          </Field>
          <Field label="Release Date (optional)">
            <input
              type="datetime-local"
              value={releaseAt}
              onChange={(e) => setReleaseAt(e.target.value)}
              className="input"
            />
          </Field>
          <Field label="Film Number" required>
            <input
              type="number"
              min={1}
              value={filmNumber}
              onChange={(e) => setFilmNumber(e.target.value)}
              className="input"
              required
            />
          </Field>
          <Field label="Collection Size (optional)">
            <input
              type="number"
              min={1}
              value={collectionSize}
              onChange={(e) => setCollectionSize(e.target.value)}
              className="input"
            />
          </Field>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-lg tracking-tight text-foreground">
          Videographer Note
        </h2>
        <Field label="Studio / Signature Name">
          <input
            value={videographerName}
            onChange={(e) => setVideographerName(e.target.value)}
            className="input"
          />
        </Field>
        <Field label="Note text (optional)">
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            rows={4}
            className="input resize-y"
          />
        </Field>
        <Dropzone
          label="Voice note audio (optional)"
          accept="audio/*"
          currentLabel={initial?.videographerNote?.audioUrl ? "Uploaded" : undefined}
          onFiles={(files) => setNoteAudioFile(files[0] ?? null)}
        />
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-lg tracking-tight text-foreground">
          Media
        </h2>
        <Dropzone
          label="Poster Image"
          accept="image/*"
          required={mode === "create"}
          currentLabel={initial?.posterImage ? "Already uploaded" : undefined}
          onFiles={(files) => setPosterFile(files[0] ?? null)}
        />
        <Dropzone
          label="Hero Cinematic Film"
          accept="video/*"
          required={mode === "create"}
          currentLabel={initial?.cuts.hero ? "Already uploaded" : undefined}
          onFiles={(files) => setHeroFile(files[0] ?? null)}
        />
        <Dropzone
          label="Director's Cut (optional)"
          accept="video/*"
          currentLabel={initial?.cuts.directors ? "Already uploaded" : undefined}
          onFiles={(files) => setDirectorsFile(files[0] ?? null)}
        />
        <Dropzone
          label="Vertical / Social Cut (optional)"
          accept="video/*"
          currentLabel={initial?.cuts.social ? "Already uploaded" : undefined}
          onFiles={(files) => setSocialFile(files[0] ?? null)}
        />
        <Dropzone
          label="Behind the Scenes (optional)"
          accept="video/*"
          currentLabel={initial?.cuts.bts ? "Already uploaded" : undefined}
          onFiles={(files) => setBtsFile(files[0] ?? null)}
        />
        <Dropzone
          label="Teaser for countdown mode (optional)"
          accept="video/*"
          currentLabel={initial?.teaser ? "Already uploaded" : undefined}
          onFiles={(files) => setTeaserFile(files[0] ?? null)}
        />

        <div>
          <label className="mb-2 block text-xs tracking-[0.2em] text-white/50 uppercase">
            Stills
          </label>
          {existingStills.length > 0 && (
            <ul className="mb-3 space-y-1">
              {existingStills.map((url) => (
                <li
                  key={url}
                  className="flex items-center justify-between border border-white/10 px-3 py-2 text-xs text-white/60"
                >
                  <span className="truncate">{url.split("/").pop()}</span>
                  <button
                    type="button"
                    onClick={() =>
                      setExistingStills((prev) => prev.filter((u) => u !== url))
                    }
                    className="ml-3 text-red-400 hover:text-red-300"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
          <Dropzone
            label="Add stills"
            accept="image/*"
            multiple
            onFiles={(files) => setNewStillsFiles(files)}
          />
        </div>
      </section>

      {error && (
        <p role="alert" className="text-sm text-red-400">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full border border-brand bg-brand py-4 text-sm font-medium tracking-[0.2em] text-brand-foreground uppercase transition hover:opacity-90 disabled:opacity-50"
      >
        {submitting
          ? progress || "Saving…"
          : mode === "create"
            ? "Create Delivery"
            : "Save Changes"}
      </button>

      <style jsx global>{`
        .input {
          width: 100%;
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 0.65rem 0.75rem;
          color: var(--foreground);
          outline: none;
        }
        .input:focus {
          border-color: var(--brand);
        }
      `}</style>
    </form>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs tracking-[0.2em] text-white/50 uppercase">
        {label}
        {required && <span className="text-brand"> *</span>}
      </span>
      {children}
    </label>
  );
}
