import rawData from "./data/dycom-companies.json";

/**
 * A single physical location (office / yard) operated by a company.
 * `primary` marks the company headquarters.
 */
export interface CompanyLocation {
  lng: number;
  lat: number;
  state: string;
  primary: boolean;
}

export interface Headquarters {
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  fax: string;
  lng: number | null;
  lat: number | null;
}

export interface Company {
  id: number;
  name: string;
  logo: string;
  website: string;
  careers: string;
  description: string;
  headquarters: Headquarters;
  /** Distinct two-letter state codes this company operates in. */
  states: string[];
  /** Every location (headquarters + satellite offices). */
  locations: CompanyLocation[];
}

export interface CompaniesDataset {
  companyCount: number;
  locationCount: number;
  stateCount: number;
  states: string[];
  companies: Company[];
}

export const dataset = rawData as CompaniesDataset;
export const companies = dataset.companies;

/** URL-safe slug for a company (used for the per-subsidiary "site" routes). */
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function companySlug(company: Company): string {
  return slugify(company.name);
}

export function findCompanyBySlug(slug: string): Company | undefined {
  return companies.find((c) => companySlug(c) === slug);
}

export function getCompany(id: number): Company | undefined {
  return companies.find((c) => c.id === id);
}

/** GeoJSON feature for one location, carrying its company id for interaction. */
export type LocationFeature = GeoJSON.Feature<
  GeoJSON.Point,
  { companyId: number; companyName: string; state: string; primary: boolean }
>;

/** Build a GeoJSON FeatureCollection from a set of companies. */
export function toFeatureCollection(
  source: Company[],
): GeoJSON.FeatureCollection<GeoJSON.Point> {
  const features: LocationFeature[] = [];
  for (const company of source) {
    for (const loc of company.locations) {
      features.push({
        type: "Feature",
        geometry: { type: "Point", coordinates: [loc.lng, loc.lat] },
        properties: {
          companyId: company.id,
          companyName: company.name,
          state: loc.state,
          primary: loc.primary,
        },
      });
    }
  }
  return { type: "FeatureCollection", features };
}
