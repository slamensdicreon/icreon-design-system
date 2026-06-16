"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Company, toFeatureCollection } from "./types";
import { brand } from "./brand";

interface DycomMapProps {
  companies: Company[];
  token: string;
  selectedId: number | null;
  hoveredId: number | null;
  onSelect: (id: number | null) => void;
}

const EMPTY_FC: GeoJSON.FeatureCollection<GeoJSON.Point> = {
  type: "FeatureCollection",
  features: [],
};

const US_CENTER: [number, number] = [-96, 38.5];

export default function DycomMap({
  companies,
  token,
  selectedId,
  hoveredId,
  onSelect,
}: DycomMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const loadedRef = useRef(false);
  const popupRef = useRef<mapboxgl.Popup | null>(null);

  // Keep the latest props available to map event handlers without re-binding.
  const companiesRef = useRef(companies);
  const selectedRef = useRef(selectedId);
  const hoveredRef = useRef(hoveredId);
  const onSelectRef = useRef(onSelect);
  const prevSelectedRef = useRef<number | null>(null);

  // Keep refs in sync after each render so map event handlers (bound once) can
  // read the latest props without being re-created.
  useEffect(() => {
    companiesRef.current = companies;
    selectedRef.current = selectedId;
    hoveredRef.current = hoveredId;
    onSelectRef.current = onSelect;
  });

  // ---- Reflect the current selection / hover onto the map ----
  function applyFocus() {
    const map = mapRef.current;
    if (!map || !loadedRef.current) return;

    const focusId = selectedRef.current ?? hoveredRef.current;
    const company = focusId
      ? companiesRef.current.find((c) => c.id === focusId) ?? null
      : null;

    const focusSource = map.getSource("focus") as mapboxgl.GeoJSONSource | undefined;
    focusSource?.setData(company ? toFeatureCollection([company]) : EMPTY_FC);

    // Dim the nationwide layer while a single company is in focus.
    const baseOpacity = company ? 0.12 : 1;
    map.setPaintProperty("clusters", "circle-opacity", baseOpacity);
    map.setPaintProperty("clusters", "circle-stroke-opacity", baseOpacity);
    map.setPaintProperty("cluster-count", "text-opacity", company ? 0.15 : 1);
    map.setPaintProperty("unclustered-point", "circle-opacity", baseOpacity);
    map.setPaintProperty(
      "unclustered-point",
      "circle-stroke-opacity",
      baseOpacity,
    );

    // Fly the map only on an explicit selection change (not on hover).
    const selected = selectedRef.current;
    if (selected !== prevSelectedRef.current) {
      if (selected && company) {
        const bounds = new mapboxgl.LngLatBounds();
        company.locations.forEach((l) => bounds.extend([l.lng, l.lat]));
        map.fitBounds(bounds, {
          padding: { top: 90, bottom: 90, left: 90, right: 90 },
          maxZoom: 8.5,
          duration: 900,
        });
      } else if (!selected) {
        map.easeTo({ center: US_CENTER, zoom: 3.4, duration: 800 });
      }
      prevSelectedRef.current = selected;
    }
  }

  // ---- Create the map once ----
  useEffect(() => {
    if (!token || !containerRef.current || mapRef.current) return;

    mapboxgl.accessToken = token;
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: US_CENTER,
      zoom: 3.4,
      minZoom: 2.5,
      maxZoom: 14,
      attributionControl: true,
    });
    mapRef.current = map;

    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right");
    map.scrollZoom.disable(); // avoid hijacking page scroll; users zoom with +/- or pinch

    map.on("load", () => {
      map.addSource("locations", {
        type: "geojson",
        data: toFeatureCollection(companiesRef.current),
        cluster: true,
        clusterRadius: 46,
        clusterMaxZoom: 9,
      });

      map.addLayer({
        id: "clusters",
        type: "circle",
        source: "locations",
        filter: ["has", "point_count"],
        paint: {
          "circle-color": brand.blue,
          "circle-stroke-color": "#ffffff",
          "circle-stroke-width": 2,
          "circle-radius": [
            "step",
            ["get", "point_count"],
            16,
            10,
            22,
            40,
            30,
            120,
            38,
          ],
        },
      });

      map.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: "locations",
        filter: ["has", "point_count"],
        layout: {
          "text-field": ["get", "point_count_abbreviated"],
          "text-font": ["DIN Pro Medium", "Arial Unicode MS Bold"],
          "text-size": 13,
        },
        paint: { "text-color": "#ffffff" },
      });

      map.addLayer({
        id: "unclustered-point",
        type: "circle",
        source: "locations",
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-color": brand.blue,
          "circle-radius": 5,
          "circle-stroke-width": 1.5,
          "circle-stroke-color": "#ffffff",
        },
      });

      // Focus layer: the selected / hovered company's locations.
      map.addSource("focus", { type: "geojson", data: EMPTY_FC });
      map.addLayer({
        id: "focus-point",
        type: "circle",
        source: "focus",
        paint: {
          "circle-color": [
            "case",
            ["get", "primary"],
            brand.orange,
            brand.green,
          ],
          "circle-radius": ["case", ["get", "primary"], 9, 6.5],
          "circle-stroke-width": 2.5,
          "circle-stroke-color": "#ffffff",
        },
      });

      loadedRef.current = true;
      applyFocus();

      // --- Interactions ---
      map.on("click", "clusters", (e) => {
        const features = map.queryRenderedFeatures(e.point, {
          layers: ["clusters"],
        });
        const clusterId = features[0]?.properties?.cluster_id;
        if (clusterId == null) return;
        const src = map.getSource("locations") as mapboxgl.GeoJSONSource;
        src.getClusterExpansionZoom(clusterId, (err, zoom) => {
          if (err || zoom == null) return;
          const geom = features[0].geometry as GeoJSON.Point;
          map.easeTo({
            center: geom.coordinates as [number, number],
            zoom,
            duration: 600,
          });
        });
      });

      const selectFromFeature = (e: mapboxgl.MapMouseEvent) => {
        const id = e.features?.[0]?.properties?.companyId;
        if (typeof id === "number") onSelectRef.current(id);
      };
      map.on("click", "unclustered-point", selectFromFeature);
      map.on("click", "focus-point", selectFromFeature);

      const showPopup = (e: mapboxgl.MapMouseEvent) => {
        const f = e.features?.[0];
        if (!f) return;
        map.getCanvas().style.cursor = "pointer";
        const name = f.properties?.companyName as string;
        const geom = f.geometry as GeoJSON.Point;
        if (!popupRef.current) {
          popupRef.current = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false,
            offset: 12,
            className: "dycom-popup",
          });
        }
        popupRef.current
          .setLngLat(geom.coordinates as [number, number])
          .setHTML(`<strong>${name}</strong>`)
          .addTo(map);
      };
      const hidePopup = () => {
        map.getCanvas().style.cursor = "";
        popupRef.current?.remove();
      };
      ["unclustered-point", "focus-point", "clusters"].forEach((layer) => {
        map.on("mouseenter", layer, (e) => {
          if (layer === "clusters") {
            map.getCanvas().style.cursor = "pointer";
          } else {
            showPopup(e);
          }
        });
        map.on("mouseleave", layer, hidePopup);
      });
    });

    return () => {
      map.remove();
      mapRef.current = null;
      loadedRef.current = false;
    };
  }, [token]);

  // ---- React to selection / hover / data changes ----
  useEffect(() => {
    applyFocus();
  }, [selectedId, hoveredId, companies]);

  if (!token) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-slate-100 p-8 text-center">
        <div className="max-w-md">
          <h3 className="text-lg font-semibold text-slate-900">
            Interactive map needs a Mapbox token
          </h3>
          <p className="mt-2 text-sm text-slate-600">
            Add a public token as{" "}
            <code className="rounded bg-slate-200 px-1 py-0.5 text-xs">
              NEXT_PUBLIC_MAPBOX_TOKEN
            </code>{" "}
            in your environment to enable the map. You can still browse every
            company in the list on the left.
          </p>
        </div>
      </div>
    );
  }

  return <div ref={containerRef} className="h-full w-full" />;
}
