// Self-contained equirectangular projection for the continental US.
// No runtime deps, no API keys — paths are derived from the bundled GeoJSON.
import statesGeo from "../_data/us-states.geo.json";

type Ring = number[][];
type Geometry =
  | { type: "Polygon"; coordinates: Ring[] }
  | { type: "MultiPolygon"; coordinates: Ring[][] };
type Feature = {
  type: "Feature";
  id: string;
  properties: { name: string };
  geometry: Geometry;
};

// Drop the non-contiguous territories so the continental map fills the frame.
const EXCLUDE = new Set(["02", "15", "72"]); // Alaska, Hawaii, Puerto Rico
const FEATURES = (statesGeo as { features: Feature[] }).features.filter(
  (f) => !EXCLUDE.has(f.id)
);

// Longitude is compressed by cos(latitude) so the country isn't stretched wide.
const KX = Math.cos((39 * Math.PI) / 180);

/** lng/lat -> SVG units (y is negated so north points up). */
export function project([lng, lat]: [number, number]): [number, number] {
  return [lng * KX, -lat];
}

function polygons(geom: Geometry): Ring[][] {
  return geom.type === "Polygon" ? [geom.coordinates] : geom.coordinates;
}

// Compute the projected bounding box once at module load.
let minX = Infinity,
  minY = Infinity,
  maxX = -Infinity,
  maxY = -Infinity;
for (const f of FEATURES) {
  for (const poly of polygons(f.geometry)) {
    for (const ring of poly) {
      for (const c of ring) {
        const [x, y] = project(c as [number, number]);
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
}

const PAD = 0.6;
export const VIEWBOX = {
  x: minX - PAD,
  y: minY - PAD,
  w: maxX - minX + PAD * 2,
  h: maxY - minY + PAD * 2,
};
export const ASPECT = VIEWBOX.w / VIEWBOX.h;

/** Pre-built <path> data for each contiguous state. */
export const STATE_PATHS: { id: string; name: string; d: string }[] = FEATURES.map(
  (f) => {
    let d = "";
    for (const poly of polygons(f.geometry)) {
      for (const ring of poly) {
        ring.forEach((c, i) => {
          const [x, y] = project(c as [number, number]);
          d += (i === 0 ? "M" : "L") + x.toFixed(2) + " " + y.toFixed(2);
        });
        d += "Z";
      }
    }
    return { id: f.id, name: f.properties.name, d };
  }
);
