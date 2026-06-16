// Dycom Industries operates through many independently-branded subsidiaries.
// (Representative sample for the demo.)
export type Subsidiary = {
  id: string;
  name: string;
  short: string;
  color: string;
  hq: string;
};

export const CORPORATE = {
  id: "dycom",
  name: "Dycom Industries",
  short: "Dycom Corporate",
  color: "#0f172a",
};

export const SUBSIDIARIES: Subsidiary[] = [
  { id: "ervin", name: "Ervin Cable Construction", short: "Ervin Cable", color: "#059669", hq: "Sturgis, KY" },
  { id: "kanaan", name: "Kanaan Communications", short: "Kanaan", color: "#2563eb", hq: "Wallingford, CT" },
  { id: "utiliquest", name: "UtiliQuest", short: "UtiliQuest", color: "#d97706", hq: "Alpharetta, GA" },
  { id: "ansco", name: "Ansco & Associates", short: "Ansco", color: "#7c3aed", hq: "Fort Worth, TX" },
  { id: "prince", name: "Prince Telecom", short: "Prince Telecom", color: "#e11d48", hq: "New Castle, DE" },
];

export const BRAND_BY_ID: Record<string, Subsidiary> = Object.fromEntries(
  SUBSIDIARIES.map((s) => [s.id, s])
);

export function colorFor(brandId: string): string {
  return BRAND_BY_ID[brandId]?.color ?? CORPORATE.color;
}

export function nameFor(brandId: string): string {
  return BRAND_BY_ID[brandId]?.short ?? CORPORATE.short;
}
