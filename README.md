# Dycom Family of Companies — One Connected Network

An interactive demo showing how Dycom's parent map, every subsidiary site,
and SAP SuccessFactors job postings can run off a **single source of
truth** instead of today's fragmented, unlinked maps. Built with Next.js
and Mapbox GL.

## The demo story

- **Parent site (`/`)** — Dycom corporate chrome and the full network: 38
  companies, 551 locations across 50 states, and every open role.
- **Subsidiary sites (`/c/[company]`)** — each one looks like its own
  independent domain (its own logo nav, accent color, hero and footer), but
  embeds the **same connected map**. Even though you land on one company's
  site, you can see **all** open roles across the family, not just theirs —
  the core fix for the SuccessFactors siloing problem.
- **One shared map** — markers look identical on every site (the common,
  connected layer) while the surrounding brand differs site to site.
- **Network map / Open roles map** toggle — see locations or hiring across
  the whole family from any entry point.
- **Demo navigator** — a thin bar at the very top lets you jump between the
  parent and any subsidiary to see the shared map under different brands.

## Getting started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Mapbox token

The map needs a public Mapbox token. Add it to `.env.local`:

```bash
NEXT_PUBLIC_MAPBOX_TOKEN=pk.xxxxx
```

Create a token at https://account.mapbox.com/access-tokens/. It is a
`NEXT_PUBLIC_` variable, so it is inlined at build time and must be set
before `pnpm build` / before the Vercel build runs. Without it, the page
still loads but the map area shows a placeholder.

## Project structure

- `src/app/page.tsx` — parent corporate site
- `src/app/c/[slug]/page.tsx` — per-subsidiary "site" route
- `src/app/SubsidiaryChrome.tsx` — independent-looking subsidiary chrome
- `src/app/NetworkExperience.tsx` — the shared, themeable connected map +
  sidebar (companies, roles, detail)
- `src/app/DycomMap.tsx` — Mapbox map (clustered base + focus layer)
- `src/app/DemoBar.tsx` — top demo navigator (jump between sites)
- `src/app/themes.ts` — per-company accent themes
- `src/app/jobs.ts` — mock SAP SuccessFactors requisition feed
- `src/app/data/dycom-companies.json` — company + location dataset
- `src/app/types.ts`, `src/app/brand.ts` — data helpers and brand tokens
