import { Company, companies } from "./types";

/**
 * Mock "SAP SuccessFactors" requisition feed.
 *
 * In production these postings would stream from a single SuccessFactors
 * instance and be projected onto every Dycom property. Here we generate them
 * deterministically from the company/location data so the parent map and every
 * subsidiary "site" render identical counts on the server and the client.
 */

export interface Job {
  id: string;
  title: string;
  category: string;
  companyId: number;
  companyName: string;
  lng: number;
  lat: number;
  state: string;
  postedDays: number;
  /** True for roles added live during the demo. */
  demo?: boolean;
}

export const JOB_CATEGORIES = [
  "Wireline Construction",
  "Wireless Construction",
  "Engineering",
  "Locating",
  "Fulfillment",
  "Maintenance & Restoration",
  "Project Management",
  "Fleet & Equipment",
  "Safety",
] as const;

const TITLES: Record<string, string[]> = {
  "Wireline Construction": [
    "Fiber Splice Technician",
    "Underground Crew Foreman",
    "Aerial Lineman",
    "Cable Construction Laborer",
  ],
  "Wireless Construction": [
    "Tower Technician",
    "Small Cell Installer",
    "RF Engineer",
    "Wireless Foreman",
  ],
  Engineering: [
    "OSP Design Engineer",
    "Network Planner",
    "CAD Designer",
    "Permitting Specialist",
  ],
  Locating: ["Utility Locator", "Damage Prevention Tech", "Locate Supervisor"],
  Fulfillment: [
    "Field Service Technician",
    "Install & Repair Technician",
    "Fulfillment Lead",
  ],
  "Maintenance & Restoration": [
    "Restoration Technician",
    "Maintenance Crew Member",
    "Splicing Maintenance Tech",
  ],
  "Project Management": [
    "Project Manager",
    "Project Coordinator",
    "Construction Manager",
  ],
  "Fleet & Equipment": ["Diesel Mechanic", "Fleet Coordinator", "Equipment Operator"],
  Safety: ["Safety Manager", "Field Safety Coordinator", "Compliance Specialist"],
};

// Small deterministic PRNG so output is stable across server/client renders.
function lcg(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 2 ** 32;
  };
}

function buildSeedJobs(source: Company[]): Job[] {
  const jobs: Job[] = [];
  for (const company of source) {
    const rng = lcg(company.id * 2654435761);
    const count = Math.max(2, Math.round(company.locations.length * 1.6));
    for (let i = 0; i < count; i++) {
      const loc = company.locations[Math.floor(rng() * company.locations.length)];
      const category = JOB_CATEGORIES[Math.floor(rng() * JOB_CATEGORIES.length)];
      const titles = TITLES[category];
      const title = titles[Math.floor(rng() * titles.length)];
      jobs.push({
        id: `${company.id}-${i}`,
        title,
        category,
        companyId: company.id,
        companyName: company.name,
        lng: loc.lng,
        lat: loc.lat,
        state: loc.state,
        postedDays: 1 + Math.floor(rng() * 30),
      });
    }
  }
  return jobs;
}

export const SEED_JOBS: Job[] = buildSeedJobs(companies);
export const SEED_JOB_COUNT = SEED_JOBS.length;

export type JobFeature = GeoJSON.Feature<
  GeoJSON.Point,
  { companyId: number; companyName: string; category: string; title: string }
>;

export function jobsToFeatureCollection(
  jobs: Job[],
): GeoJSON.FeatureCollection<GeoJSON.Point> {
  return {
    type: "FeatureCollection",
    features: jobs.map((j) => ({
      type: "Feature",
      geometry: { type: "Point", coordinates: [j.lng, j.lat] },
      properties: {
        companyId: j.companyId,
        companyName: j.companyName,
        category: j.category,
        title: j.title,
      },
    })),
  };
}
