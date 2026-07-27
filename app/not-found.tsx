import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center text-foreground">
      <p className="font-display text-sm tracking-[0.4em] text-white/40 uppercase">
        Film Not Found
      </p>
      <h1 className="mt-6 font-display text-4xl tracking-tight sm:text-5xl">
        This reel doesn&apos;t exist.
      </h1>
      <p className="mt-4 max-w-md text-white/60">
        The delivery link you followed may be mistyped, expired, or not yet
        created. Double-check the link your videographer sent you.
      </p>
      <Link
        href="/"
        className="mt-10 inline-block border border-white/20 px-6 py-3 text-sm tracking-[0.2em] uppercase text-white/80 transition hover:border-brand hover:text-white"
      >
        Back Home
      </Link>
    </main>
  );
}
