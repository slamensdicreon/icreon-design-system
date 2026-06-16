import type { Metadata } from "next";
import CompaniesExplorer from "./CompaniesExplorer";
import { dataset } from "./types";

export const metadata: Metadata = {
  title: "Dycom Family of Companies — Interactive Map",
  description:
    "Explore Dycom's 38 operating companies and their nationwide network of locations across all 50 states.",
};

export default function CompaniesPage() {
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? "";

  return (
    <div className="bg-slate-50">
      {/* Brand hero */}
      <header className="bg-gradient-to-br from-[#005cb9] to-[#00427f] text-white">
        <div className="mx-auto max-w-[1400px] px-4 py-14 sm:px-6 lg:py-16">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#84bd00]">
            Dycom Industries
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">
            Explore the Dycom family of companies
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-blue-100">
            One organization, nationwide reach. Browse all{" "}
            {dataset.companyCount} operating companies and the communities they
            connect across the country.
          </p>

          <dl className="mt-10 grid max-w-2xl grid-cols-3 gap-4">
            <HeroStat value={dataset.companyCount} label="Operating companies" />
            <HeroStat value={dataset.locationCount} label="Locations" />
            <HeroStat value={dataset.stateCount} label="States served" />
          </dl>
        </div>
      </header>

      <div className="-mt-8">
        <CompaniesExplorer mapboxToken={mapboxToken} />
      </div>
    </div>
  );
}

function HeroStat({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-xl bg-white/10 px-4 py-4 ring-1 ring-white/15">
      <dd className="text-3xl font-bold sm:text-4xl">{value}</dd>
      <dt className="mt-1 text-xs font-medium uppercase tracking-wide text-blue-100">
        {label}
      </dt>
    </div>
  );
}
