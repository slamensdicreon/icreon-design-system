import type { Metadata } from "next";
import CompaniesExplorer from "./CompaniesExplorer";

export const metadata: Metadata = {
  title: "Dycom Family of Companies — One Connected Network",
  description:
    "Explore Dycom's 38 operating companies, their nationwide locations, and every open role across the family — from one connected source.",
};

export default function Home() {
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? "";
  return <CompaniesExplorer mapboxToken={mapboxToken} perspectiveCompanyId={null} />;
}
