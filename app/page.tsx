import { STUDIO } from "@/lib/brand";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-1 flex-col items-center justify-center bg-background px-6 py-24 text-center text-foreground">
      <p className="font-display text-sm tracking-[0.4em] text-brand uppercase">
        {STUDIO.name}
      </p>
      <h1 className="mt-6 max-w-xl font-display text-4xl tracking-tight sm:text-5xl">
        Private Film Deliveries
      </h1>
      <p className="mt-4 max-w-md text-white/60">
        This page exists to serve private, individually-linked client
        deliveries. If you were sent a link, use that link directly.
      </p>
    </main>
  );
}
