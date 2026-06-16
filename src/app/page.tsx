import type { Metadata } from "next";
import NetworkExperience from "./NetworkExperience";
import { dataset } from "./types";
import { SEED_JOB_COUNT } from "./jobs";
import { DYCOM_THEME } from "./themes";

export const metadata: Metadata = {
  title: "Dycom Family of Companies — One Connected Network",
  description:
    "Explore Dycom's 38 operating companies, their nationwide locations, and every open role across the family — from one connected source.",
};

export default function Home() {
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? "";

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Parent corporate chrome */}
      <header className="bg-gradient-to-br from-[#005cb9] to-[#00427f] text-white">
        <div className="mx-auto max-w-[1400px] px-4 py-14 sm:px-6 lg:py-16">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#84bd00]">
            Dycom Industries
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">
            One organization. One connected network.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-blue-100">
            Dycom is {dataset.companyCount} operating companies working as one.
            This map — and the {SEED_JOB_COUNT.toLocaleString()} open roles on it
            — is shared by every Dycom company site, so the picture is always the
            same no matter where you start.
          </p>

          <dl className="mt-10 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4">
            <Stat value={dataset.companyCount} label="Companies" />
            <Stat value={dataset.locationCount} label="Locations" />
            <Stat value={dataset.stateCount} label="States" />
            <Stat value={SEED_JOB_COUNT} label="Open roles" />
          </dl>
        </div>
      </header>

      <NetworkExperience
        mapboxToken={mapboxToken}
        accent={DYCOM_THEME}
        perspectiveCompanyId={null}
      />
      <div className="h-12" />
    </div>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-xl bg-white/10 px-4 py-3 ring-1 ring-white/15">
      <dd className="text-2xl font-bold sm:text-3xl">{value.toLocaleString()}</dd>
      <dt className="mt-0.5 text-xs font-medium uppercase tracking-wide text-blue-100">
        {label}
      </dt>
    </div>
  );
}
