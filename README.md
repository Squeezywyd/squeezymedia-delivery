# Squeezy.Media — Film Delivery

A private, cinematic delivery microsite for Squeezy.Media's finished client
films. Each client gets a unique URL (`/deliveries/<slug>`) with a branded
loading sequence, a full-bleed hero film, a stills gallery, downloadable
cuts, an optional password gate, and an optional countdown/teaser mode.

Studio identity (name, contact email, brand accent) lives in `lib/brand.ts`.
Each delivery still themes itself with its own `accentColor` per car — the
studio brand is the site chrome (index page, 404, footer), not the per-film
theme.

Built with Next.js (App Router) + TypeScript + Tailwind CSS + Framer Motion.
No database — every client is a single config file.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — it lists the local
example deliveries. Two are included out of the box:

- `/deliveries/johnson-gt3` — live delivery, no password, all four cuts, note, stills.
- `/deliveries/carter-m3` — password-gated (`m3carter`) + countdown/teaser mode.

Both use small royalty-free placeholder clips/stills under
`public/deliveries/johnson-gt3/`, wired up so you can see the entire
experience end to end before dropping in real footage.

## Adding a new client delivery

1. **Add the media.** Create `public/deliveries/<slug>/videos/` and
   `public/deliveries/<slug>/images/`, and drop in the exported cuts and
   stills (any web-safe mp4 + jpg/png/webp works).

2. **Add the config.** Create `data/deliveries/<slug>.ts`:

   ```ts
   import type { DeliveryConfig } from "@/lib/types";

   const BASE = "/deliveries/<slug>";

   export const mySlug: DeliveryConfig = {
     slug: "<slug>",
     clientName: "The Smiths",
     carMake: "Porsche",
     carModel: "911 GT3",
     shootDate: "2026-08-01",
     accentColor: "#8B0000",       // drives buttons, loader, hover states
     password: null,               // or a passphrase string to gate the page
     releaseAt: null,              // or an ISO timestamp for countdown mode
     filmNumber: 5,
     collectionSize: 12,           // optional, for "Film No. X of Y"
     videographerName: "Your Studio",
     videographerNote: { text: "..." },   // or { audioUrl: "..." }, or omit
     posterImage: `${BASE}/images/poster.jpg`,
     teaser: {                     // optional, shown behind the countdown
       label: "Teaser",
       url: `${BASE}/videos/teaser.mp4`,
       duration: "0:15",
     },
     cuts: {
       hero: { label: "Cinematic Film", url: `${BASE}/videos/hero.mp4`, duration: "1:32" },
       directors: { label: "Director's Cut", url: `${BASE}/videos/directors.mp4`, duration: "4:10" },
       social: { label: "Vertical Cut", url: `${BASE}/videos/social.mp4`, duration: "0:32", aspectRatio: 9 / 16 },
       bts: { label: "Behind the Scenes", url: `${BASE}/videos/bts.mp4`, duration: "0:45" },
     },
     stills: [`${BASE}/images/still-01.jpg`, `${BASE}/images/still-02.jpg`],
   };
   ```

   `password`, `releaseAt`, `teaser`, `videographerNote`, `cuts.directors`,
   `cuts.social`, `cuts.bts`, and `stills` are all optional — omit whatever
   doesn't apply and that section of the page just won't render.

3. **Register it.** Add one line to `data/deliveries/index.ts`:

   ```ts
   import { mySlug } from "./<slug>";
   export const deliveries: DeliveryConfig[] = [johnsonGt3, carterM3, mySlug];
   ```

4. Visit `/deliveries/<slug>`. That's it — no other code changes needed.

Visiting a slug that isn't registered renders a clean 404 (`app/not-found.tsx`)
instead of crashing.

## How the page behaves

- **Password gate** (`password` set): full-screen passphrase prompt. On
  success, the unlock is stored in `sessionStorage` for that slug only (not
  `localStorage` — it doesn't persist across browser sessions or leak to
  other clients' pages).
- **Countdown / teaser** (`releaseAt` in the future, checked after the
  password gate): shows a live countdown over a looping muted teaser clip
  (or the poster image if no teaser is set), then automatically continues
  to the ignition sequence the moment the clock hits zero.
- **Ignition loader**: a ~2s animated gauge sweep in the client's
  `accentColor`, then fades into the hero film.
- **Hero film**: full-bleed, autoplay muted with a tap-to-unmute prompt,
  custom play/pause/mute/fullscreen controls (no native browser chrome),
  poster image while loading, and a graceful "unavailable" message instead
  of a broken player if the file fails to load.
- Below the fold: stills gallery, remaining cuts with download buttons, a
  numbered film certificate, an optional note from the videographer
  (text and/or an audio player), and a footer.

## Project structure

```
app/
  page.tsx                        local index of deliveries (dev convenience)
  not-found.tsx                   global 404
  deliveries/[slug]/page.tsx      loads the config, 404s on unknown slugs
  deliveries/[slug]/DeliveryExperience.tsx   client-side state machine
components/delivery/              PasswordGate, CountdownTeaser, IgnitionLoader,
                                   HeroPlayer, StillsGallery, CutsAlbum,
                                   FilmCertificate, VideographerNote,
                                   DeliveryFooter, SafeVideo
data/deliveries/                  one config file per client + index.ts registry
lib/types.ts                      DeliveryConfig type
lib/deliveries.ts                 getDeliveryBySlug / getAllSlugs
lib/color.ts                      derives hover/gradient shades from accentColor
public/deliveries/<slug>/         per-client video + image assets
```

Swapping the static config for a database later (e.g. Supabase) only touches
`lib/deliveries.ts` — every component reads from a plain `DeliveryConfig`
object and doesn't know where it came from.

## Deploying

Push to a Git repo and import it in Vercel — no environment variables or
build configuration needed. `npm run build` prerenders every registered
slug as static HTML (`generateStaticParams`), so delivery pages load fast
and don't need a server round-trip.

## Notes

- The bundled placeholder clips are small royalty-free samples (not the
  client's actual footage) purely so the full experience is viewable out of
  the box. Replace them before sending a real delivery link to a client.
- Passwords here are a simple front-end passphrase gate for casual privacy,
  not real authentication — don't use this for anything that needs to be
  properly access-controlled.
