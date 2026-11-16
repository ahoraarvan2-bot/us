# ONYX Motor House

A cinematic website for a fictional performance-car house: rendered hero films, an
interactive 3D studio, an eight-car collection with sourced specifications, a
performance comparison tool, a gallery with a full-screen viewer, and working
test-drive and contact forms.

ONYX is a demonstration brand. The cars, their specifications and their prices are
real and sourced (see each car's page and `/credits`); the business details
(address, phone, email, social handles) are placeholders.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · React Three Fiber
+ drei (three.js) · GSAP + ScrollTrigger · Motion · Lenis · Zod

## Run it

```bash
npm install
cp .env.example .env.local      # optional: request storage and forwarding
npm run dev                     # http://localhost:3000
npm run build && npm start      # production
npm run typecheck
```

Node 20.9 or newer.

## Pages

| Route | What it has |
| --- | --- |
| `/` | Hero film (three rendered scenes, autoplay, muted, loop, poster and 720p mobile sources), statement, pinned horizontal collection rail, 3D studio, performance gauges, gallery preview, test-drive invitation |
| `/collection` | All eight cars with filters (hybrid, combustion, mid-engined, limited and heritage) and sorting |
| `/collection/[slug]` | Full-screen hero, description, exterior and interior galleries, performance figures, specification table, configurator (paint, wheels, interior), pricing, test-drive and enquiry buttons, sources |
| `/performance` | Engine, horsepower, torque, acceleration (a live launch race), aerodynamics, suspension, braking, driving modes, and a comparison tool for up to three cars |
| `/technology` | Full-screen 3D studio, hybrid power-flow diagrams, technology by car |
| `/gallery` | Filterable gallery, full-screen viewer with keyboard, swipe and previous/next |
| `/about`, `/contact`, `/test-drive` | The house, contact form with showroom details, test-drive booking |
| `/privacy`, `/terms`, `/credits` | Legal pages and every licence and source |

## Forms and the request API

`POST /api/inquiries` validates every request again on the server (Zod), applies a
per-IP rate limit and a honeypot, gives it a reference number and stores it as one
JSON line in `INQUIRY_STORE_PATH` (default `./data/inquiries.jsonl`). It can also
forward each request to a webhook (`INQUIRY_WEBHOOK_URL`, e.g. n8n, Zapier, a CRM)
and to a Telegram chat (`TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`).

The form never reports success unless the request was recorded. On a host where the
API is missing it says so and shows the showroom's phone and email instead.

On serverless hosts the project folder is read-only: set `INQUIRY_STORE_PATH=/tmp/...`
(temporary) and use the webhook or Telegram forwarder as the real record.

## Media

- **Hero films and studio stills** (`public/films`, `public/studio`) were rendered for
  this project from a 3D model of a Ferrari 458 Spider with its manufacturer badges
  removed (`scripts/model/debadge.mjs`). They ship with the project.
- **3D model**: by vicent091036, distributed with the three.js car-materials example.
  Check the model's licence on its source page before commercial use.
- **Photographs of the other seven cars** come from Unsplash, Pexels and Wikimedia
  Commons and are listed in `src/content/media.json`. The site loads them from each
  provider's CDN. Where a photo cannot load, a designed long-exposure plate in the
  car's accent colour takes its place and names the missing photo.

### Before you launch

1. Run `MEDIA_CONTACT=you@yourdomain.com npm run media:pull`. It self-hosts every
   remote photo as responsive WebP in `public/media`, and reads the exact author and
   licence of each Wikimedia Commons file into the credits. Until you run it, the four
   Commons photos are credited as "Wikimedia Commons contributor" with a link to the
   file page, which is not full CC BY-SA attribution.
2. `npm run media:check` reports any remote photo that no longer loads.
3. Replace everything marked `PLACEHOLDER` in `src/content/site.ts` (address, phone,
   email, social links) and set `NEXT_PUBLIC_SITE_URL`.
4. Have the privacy policy and terms reviewed for your jurisdiction.
5. Prices are US list prices where the maker publishes one, as of November 2026. Check
   them again before launch.

## Self-contained preview

`npm run build:preview` compiles the same views with Vite into `preview-dist/`: hash
routing, relative asset paths, the model wrapped as JSON, and forms that save to the
host's database where one is available. It runs from any static host. The preview
cannot reach third-party image hosts, so it shows the long-exposure plates in place of
the seven cars' photographs.

## Project layout

```
src/app/            Next.js routes, API route, layout, global CSS (design tokens)
src/views/          One component per page, shared by Next.js and the preview
src/components/     layout, home, vehicle, studio (3D), performance, gallery, forms, media, ui
src/content/        vehicles.ts (specs, prices, sources), media.json, studio.ts, engineering.ts, site.ts
src/lib/            media resolution, motion helpers, form validation and submission
src/preview/        Vite entry, hash router and next/* shims for the preview build
scripts/            media pull and optimisation, preview build, model tools
public/             films, studio stills, model, Draco decoder, icons
```

## Accessibility and performance

Skip link, landmarks, visible focus, keyboard-operable menus, studio, gallery and
forms, `prefers-reduced-motion` respected throughout (films pause, scroll effects and
trails stop). Films ship as 1080p and 720p H.264 with posters; the 3D studio is
lazy-loaded, renders only while on screen and lowers its resolution on slow devices;
images are responsive and lazy-loaded.
