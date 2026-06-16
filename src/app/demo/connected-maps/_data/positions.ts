// A "position" mirrors a SAP SuccessFactors requisition: a single open role
// at a geographic location, owned by one subsidiary brand.
export type Position = {
  id: string;
  title: string;
  brand: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  category: string;
};

export const SEED_POSITIONS: Position[] = [
  // Ervin Cable — Midwest / Mid-South fiber construction
  { id: "ervin-1", title: "Fiber Splicer", brand: "ervin", city: "Louisville", state: "KY", lat: 38.2527, lng: -85.7585, category: "Fiber" },
  { id: "ervin-2", title: "Aerial Lineman", brand: "ervin", city: "Nashville", state: "TN", lat: 36.1627, lng: -86.7816, category: "Aerial" },
  { id: "ervin-3", title: "Underground Foreman", brand: "ervin", city: "Indianapolis", state: "IN", lat: 39.7684, lng: -86.1581, category: "Underground" },
  { id: "ervin-4", title: "Directional Drill Operator", brand: "ervin", city: "Columbus", state: "OH", lat: 39.9612, lng: -82.9988, category: "Underground" },

  // Kanaan Communications — Northeast
  { id: "kanaan-1", title: "Fiber Technician", brand: "kanaan", city: "Hartford", state: "CT", lat: 41.7658, lng: -72.6734, category: "Fiber" },
  { id: "kanaan-2", title: "Construction Project Manager", brand: "kanaan", city: "Boston", state: "MA", lat: 42.3601, lng: -71.0589, category: "Management" },
  { id: "kanaan-3", title: "Splice Crew Lead", brand: "kanaan", city: "Providence", state: "RI", lat: 41.824, lng: -71.4128, category: "Fiber" },
  { id: "kanaan-4", title: "Aerial Lineman", brand: "kanaan", city: "Albany", state: "NY", lat: 42.6526, lng: -73.7562, category: "Aerial" },

  // UtiliQuest — Southeast utility locating
  { id: "utiliquest-1", title: "Utility Locator", brand: "utiliquest", city: "Atlanta", state: "GA", lat: 33.749, lng: -84.388, category: "Locating" },
  { id: "utiliquest-2", title: "Damage Prevention Tech", brand: "utiliquest", city: "Charlotte", state: "NC", lat: 35.2271, lng: -80.8431, category: "Locating" },
  { id: "utiliquest-3", title: "Locate Technician", brand: "utiliquest", city: "Orlando", state: "FL", lat: 28.5383, lng: -81.3792, category: "Locating" },
  { id: "utiliquest-4", title: "Field Supervisor", brand: "utiliquest", city: "Birmingham", state: "AL", lat: 33.5186, lng: -86.8104, category: "Management" },

  // Ansco & Associates — South Central
  { id: "ansco-1", title: "Network Engineer", brand: "ansco", city: "Dallas", state: "TX", lat: 32.7767, lng: -96.797, category: "Engineering" },
  { id: "ansco-2", title: "Construction Foreman", brand: "ansco", city: "Houston", state: "TX", lat: 29.7604, lng: -95.3698, category: "Underground" },
  { id: "ansco-3", title: "CAD Designer", brand: "ansco", city: "San Antonio", state: "TX", lat: 29.4241, lng: -98.4936, category: "Engineering" },
  { id: "ansco-4", title: "Underground Technician", brand: "ansco", city: "Oklahoma City", state: "OK", lat: 35.4676, lng: -97.5164, category: "Underground" },

  // Prince Telecom — Mid-Atlantic
  { id: "prince-1", title: "Fiber Splicer", brand: "prince", city: "Philadelphia", state: "PA", lat: 39.9526, lng: -75.1652, category: "Fiber" },
  { id: "prince-2", title: "Aerial Lineman", brand: "prince", city: "Baltimore", state: "MD", lat: 39.2904, lng: -76.6122, category: "Aerial" },
  { id: "prince-3", title: "Project Manager", brand: "prince", city: "Washington", state: "DC", lat: 38.9072, lng: -77.0369, category: "Management" },
  { id: "prince-4", title: "Drop Bury Technician", brand: "prince", city: "Richmond", state: "VA", lat: 37.5407, lng: -77.436, category: "Underground" },
];

// Pre-staged openings a recruiter can "post" during the demo (popped in order).
export const EXTRA_OPENINGS: Record<string, Omit<Position, "id" | "brand">[]> = {
  ervin: [
    { title: "Fiber Splicer", city: "Cincinnati", state: "OH", lat: 39.1031, lng: -84.512, category: "Fiber" },
    { title: "Aerial Lineman", city: "St. Louis", state: "MO", lat: 38.627, lng: -90.1994, category: "Aerial" },
    { title: "Underground Technician", city: "Lexington", state: "KY", lat: 38.0406, lng: -84.5037, category: "Underground" },
  ],
  kanaan: [
    { title: "Fiber Technician", city: "Portland", state: "ME", lat: 43.6591, lng: -70.2568, category: "Fiber" },
    { title: "Splice Crew Lead", city: "Manchester", state: "NH", lat: 42.9956, lng: -71.4548, category: "Fiber" },
    { title: "Aerial Lineman", city: "Worcester", state: "MA", lat: 42.2626, lng: -71.8023, category: "Aerial" },
  ],
  utiliquest: [
    { title: "Utility Locator", city: "Tampa", state: "FL", lat: 27.9506, lng: -82.4572, category: "Locating" },
    { title: "Damage Prevention Tech", city: "Raleigh", state: "NC", lat: 35.7796, lng: -78.6382, category: "Locating" },
    { title: "Locate Technician", city: "Jacksonville", state: "FL", lat: 30.3322, lng: -81.6557, category: "Locating" },
  ],
  ansco: [
    { title: "Network Engineer", city: "Austin", state: "TX", lat: 30.2672, lng: -97.7431, category: "Engineering" },
    { title: "Construction Foreman", city: "Fort Worth", state: "TX", lat: 32.7555, lng: -97.3308, category: "Underground" },
    { title: "CAD Designer", city: "Denver", state: "CO", lat: 39.7392, lng: -104.9903, category: "Engineering" },
  ],
  prince: [
    { title: "Fiber Splicer", city: "Pittsburgh", state: "PA", lat: 40.4406, lng: -79.9959, category: "Fiber" },
    { title: "Aerial Lineman", city: "Newark", state: "NJ", lat: 40.7357, lng: -74.1724, category: "Aerial" },
    { title: "Project Manager", city: "Dover", state: "DE", lat: 39.1582, lng: -75.5244, category: "Management" },
  ],
};
