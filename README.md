# Dycom Family of Companies — Interactive Map

An interactive map for browsing Dycom's 38 operating companies and their
nationwide network of 551 locations across all 50 states. Built with
Next.js and Mapbox GL.

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

- `src/app/page.tsx` — page shell with the branded hero and stats
- `src/app/CompaniesExplorer.tsx` — searchable sidebar + company detail
- `src/app/DycomMap.tsx` — Mapbox map (clustered locations + focus layer)
- `src/app/data/dycom-companies.json` — the company + location dataset
- `src/app/brand.ts` — Dycom brand tokens and state-name lookup
