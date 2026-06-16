"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { brand } from "./brand";

type FC = GeoJSON.FeatureCollection<GeoJSON.Point>;

interface DycomMapProps {
  token: string;
  /** Clustered base layer (all locations or all open roles). */
  baseData: FC;
  /** Highlighted points for the selected/hovered company. */
  focusData: FC;
  /** Coordinates to frame when the selection changes. */
  focusBounds: [number, number][] | null;
  /** Changes to trigger a camera move; null resets to the national view. */
  selectionKey: number | null;
  onSelectCompany: (id: number) => void;
}

const EMPTY_FC: FC = { type: "FeatureCollection", features: [] };
const US_CENTER: [number, number] = [-96, 38.5];

export default function DycomMap({
  token,
  baseData,
  focusData,
  focusBounds,
  selectionKey,
  onSelectCompany,
}: DycomMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const loadedRef = useRef(false);
  const popupRef = useRef<mapboxgl.Popup | null>(null);

  const baseRef = useRef(baseData);
  const focusRef = useRef(focusData);
  const boundsRef = useRef(focusBounds);
  const selectionRef = useRef(selectionKey);
  const onSelectRef = useRef(onSelectCompany);
  const prevSelectionRef = useRef<number | null>(null);

  useEffect(() => {
    baseRef.current = baseData;
    focusRef.current = focusData;
    boundsRef.current = focusBounds;
    selectionRef.current = selectionKey;
    onSelectRef.current = onSelectCompany;
  });

  function applyFocus() {
    const map = mapRef.current;
    if (!map || !loadedRef.current) return;

    (map.getSource("focus") as mapboxgl.GeoJSONSource | undefined)?.setData(
      focusRef.current,
    );

    const hasFocus = focusRef.current.features.length > 0;
    const baseOpacity = hasFocus ? 0.12 : 1;
    map.setPaintProperty("clusters", "circle-opacity", baseOpacity);
    map.setPaintProperty("clusters", "circle-stroke-opacity", baseOpacity);
    map.setPaintProperty("cluster-count", "text-opacity", hasFocus ? 0.15 : 1);
    map.setPaintProperty("unclustered-point", "circle-opacity", baseOpacity);
    map.setPaintProperty("unclustered-point", "circle-stroke-opacity", baseOpacity);

    const key = selectionRef.current;
    if (key !== prevSelectionRef.current) {
      const pts = boundsRef.current;
      if (key != null && pts && pts.length) {
        const bounds = new mapboxgl.LngLatBounds();
        pts.forEach((p) => bounds.extend(p));
        map.fitBounds(bounds, {
          padding: { top: 90, bottom: 90, left: 90, right: 90 },
          maxZoom: 8.5,
          duration: 900,
        });
      } else if (key == null) {
        map.easeTo({ center: US_CENTER, zoom: 3.4, duration: 800 });
      }
      prevSelectionRef.current = key;
    }
  }

  // Create the map once.
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
    });
    mapRef.current = map;
    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right");
    map.scrollZoom.disable();

    map.on("load", () => {
      map.addSource("locations", {
        type: "geojson",
        data: baseRef.current,
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
          "text-font": ["DIN Pro Bold", "Arial Unicode MS Bold"],
          "text-size": [
            "step",
            ["get", "point_count"],
            14,
            10,
            16,
            40,
            18,
            120,
            20,
          ],
          "text-allow-overlap": true,
          "text-ignore-placement": true,
        },
        paint: {
          "text-color": "#ffffff",
          "text-halo-color": brand.blueDark,
          "text-halo-width": 1.4,
          "text-halo-blur": 0.2,
        },
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

      map.addSource("focus", { type: "geojson", data: EMPTY_FC });
      map.addLayer({
        id: "focus-point",
        type: "circle",
        source: "focus",
        paint: {
          "circle-color": ["case", ["get", "primary"], brand.orange, brand.green],
          "circle-radius": ["case", ["get", "primary"], 9, 6.5],
          "circle-stroke-width": 2.5,
          "circle-stroke-color": "#ffffff",
        },
      });

      loadedRef.current = true;
      applyFocus();

      map.on("click", "clusters", (e) => {
        const features = map.queryRenderedFeatures(e.point, { layers: ["clusters"] });
        const clusterId = features[0]?.properties?.cluster_id;
        if (clusterId == null) return;
        const src = map.getSource("locations") as mapboxgl.GeoJSONSource;
        src.getClusterExpansionZoom(clusterId, (err, zoom) => {
          if (err || zoom == null) return;
          const geom = features[0].geometry as GeoJSON.Point;
          map.easeTo({ center: geom.coordinates as [number, number], zoom, duration: 600 });
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
        const p = f.properties ?? {};
        const label = p.title
          ? `<strong>${p.title}</strong><br/>${p.companyName}`
          : `<strong>${p.companyName}</strong>`;
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
          .setHTML(label)
          .addTo(map);
      };
      const hidePopup = () => {
        map.getCanvas().style.cursor = "";
        popupRef.current?.remove();
      };
      ["unclustered-point", "focus-point", "clusters"].forEach((layer) => {
        map.on("mouseenter", layer, (e) => {
          if (layer === "clusters") map.getCanvas().style.cursor = "pointer";
          else showPopup(e);
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

  // Swap the clustered base layer when the data set (locations vs roles) changes.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !loadedRef.current) return;
    (map.getSource("locations") as mapboxgl.GeoJSONSource | undefined)?.setData(
      baseData,
    );
  }, [baseData]);

  // Reflect selection / hover changes.
  useEffect(() => {
    applyFocus();
  }, [focusData, selectionKey, focusBounds]);

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
            to enable the map. You can still browse everything in the panel.
          </p>
        </div>
      </div>
    );
  }

  return <div ref={containerRef} className="h-full w-full" />;
}
