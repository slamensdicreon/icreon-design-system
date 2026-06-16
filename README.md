# Dycom Family of Companies — One Connected Network

An interactive demo showing how Dycom's parent map, every subsidiary site,
and SAP SuccessFactors job postings can run off a **single source of
truth** instead of today's fragmented, unlinked maps. Built with Next.js
and Mapbox GL.

## The demo story

- **Parent view (`/`)** — the full network: 38 operating companies, 551
  locations across 50 states, and every open role across the family.
- **Subsidiary sites (`/c/[company]`)** — each child "website" reads from
  the same data. Even though you land on one company's site, you can see
  **all** open roles across the family, not just theirs — the core fix for
  the SuccessFactors siloing problem.
- **Network map / Open roles map** toggle — see locations or hiring
  density nationwide from any entry point.
- **Post a role (demo)** — add a role once and it appears instantly on the
  parent map, the subsidiary's site, and the "SuccessFactors" feed.
  Updates persist (localStorage) and sync across browser tabs.

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

- `src/app/page.tsx` — parent network view
- `src/app/c/[slug]/page.tsx` — per-subsidiary "site" view
- `src/app/CompaniesExplorer.tsx` — the connected experience (header,
  perspective switcher, sidebar, post-a-role)
- `src/app/DycomMap.tsx` — Mapbox map (clustered base + focus layer)
- `src/app/network-store.tsx` — the shared single-source-of-truth store
- `src/app/jobs.ts` — mock SAP SuccessFactors requisition feed
- `src/app/data/dycom-companies.json` — company + location dataset
- `src/app/types.ts`, `src/app/brand.ts` — data helpers and brand tokens
