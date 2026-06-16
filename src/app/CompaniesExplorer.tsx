"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import DycomMap from "./DycomMap";
import { Company, dataset } from "./types";
import { brand, stateName } from "./brand";

interface CompaniesExplorerProps {
  mapboxToken: string;
}

export default function CompaniesExplorer({ mapboxToken }: CompaniesExplorerProps) {
  const [query, setQuery] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const companies = dataset.companies;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return companies.filter((c) => {
      const matchesQuery =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.states.some((s) => stateName(s).toLowerCase().includes(q));
      const matchesState = !stateFilter || c.states.includes(stateFilter);
      return matchesQuery && matchesState;
    });
  }, [companies, query, stateFilter]);

  const selected = useMemo(
    () => companies.find((c) => c.id === selectedId) ?? null,
    [companies, selectedId],
  );

  // When a company is selected, the map should still show every company so the
  // user can click between them — only the focus layer changes.
  return (
    <section className="mx-auto w-full max-w-[1400px] px-4 pb-16 sm:px-6">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex h-[80vh] min-h-[560px] flex-col lg:flex-row">
          {/* Sidebar */}
          <aside className="flex w-full shrink-0 flex-col border-b border-slate-200 lg:w-[400px] lg:border-b-0 lg:border-r">
            {selected ? (
              <CompanyDetail
                company={selected}
                onBack={() => setSelectedId(null)}
              />
            ) : (
              <CompanyList
                companies={companies}
                filtered={filtered}
                query={query}
                setQuery={setQuery}
                stateFilter={stateFilter}
                setStateFilter={setStateFilter}
                onSelect={setSelectedId}
                onHover={setHoveredId}
              />
            )}
          </aside>

          {/* Map */}
          <div className="relative min-h-[360px] flex-1">
            <DycomMap
              companies={companies}
              token={mapboxToken}
              selectedId={selectedId}
              hoveredId={hoveredId}
              onSelect={setSelectedId}
            />
            {selected && (
              <button
                onClick={() => setSelectedId(null)}
                className="absolute left-4 top-4 z-10 rounded-full bg-white/95 px-4 py-2 text-sm font-semibold text-[#005cb9] shadow-md ring-1 ring-slate-200 backdrop-blur transition hover:bg-white"
              >
                ← View all companies
              </button>
            )}
            <MapLegend />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- List view ------------------------------- */

function CompanyList({
  companies,
  filtered,
  query,
  setQuery,
  stateFilter,
  setStateFilter,
  onSelect,
  onHover,
}: {
  companies: Company[];
  filtered: Company[];
  query: string;
  setQuery: (v: string) => void;
  stateFilter: string;
  setStateFilter: (v: string) => void;
  onSelect: (id: number) => void;
  onHover: (id: number | null) => void;
}) {
  return (
    <>
      <div className="space-y-3 border-b border-slate-100 p-4">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search companies or states…"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#005cb9] focus:ring-2 focus:ring-[#005cb9]/20"
        />
        <div className="flex items-center justify-between gap-2">
          <select
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#005cb9]"
          >
            <option value="">All states</option>
            {dataset.states.map((s) => (
              <option key={s} value={s}>
                {stateName(s)}
              </option>
            ))}
          </select>
          {(query || stateFilter) && (
            <button
              onClick={() => {
                setQuery("");
                setStateFilter("");
              }}
              className="rounded-lg px-2 py-2 text-xs font-medium text-slate-500 hover:text-slate-900"
            >
              Clear
            </button>
          )}
        </div>
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
          Showing {filtered.length} of {companies.length} companies
        </p>
      </div>

      <ul
        className="flex-1 divide-y divide-slate-100 overflow-y-auto"
        onMouseLeave={() => onHover(null)}
      >
        {filtered.map((c) => (
          <li key={c.id}>
            <button
              onClick={() => onSelect(c.id)}
              onMouseEnter={() => onHover(c.id)}
              onFocus={() => onHover(c.id)}
              className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-[#005cb9]/5"
            >
              <span className="relative flex h-9 w-16 shrink-0 items-center justify-center">
                {c.logo ? (
                  <Image
                    src={c.logo}
                    alt={c.name}
                    fill
                    sizes="64px"
                    className="object-contain"
                  />
                ) : null}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-slate-900">
                  {c.name}
                </span>
                <span className="mt-0.5 block text-xs text-slate-500">
                  {c.locations.length} location
                  {c.locations.length === 1 ? "" : "s"} · {c.states.length} state
                  {c.states.length === 1 ? "" : "s"}
                </span>
              </span>
              <span className="text-slate-300">›</span>
            </button>
          </li>
        ))}
        {filtered.length === 0 && (
          <li className="px-4 py-10 text-center text-sm text-slate-500">
            No companies match your search.
          </li>
        )}
      </ul>
    </>
  );
}

/* ------------------------------ Detail view ------------------------------ */

function CompanyDetail({
  company,
  onBack,
}: {
  company: Company;
  onBack: () => void;
}) {
  const hq = company.headquarters;
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-slate-100 p-4">
        <button
          onClick={onBack}
          className="text-sm font-medium text-[#005cb9] hover:underline"
        >
          ← Back to all companies
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-5">
        <div className="relative mb-4 flex h-16 w-44 items-center">
          {company.logo ? (
            <Image
              src={company.logo}
              alt={company.name}
              fill
              sizes="176px"
              className="object-contain object-left"
            />
          ) : null}
        </div>
        <h2 className="text-xl font-bold text-slate-900">{company.name}</h2>

        <div className="mt-4 flex gap-3">
          <Stat value={company.locations.length} label="Locations" />
          <Stat value={company.states.length} label="States" />
        </div>

        {company.description && (
          <p className="mt-5 text-sm leading-relaxed text-slate-600">
            {company.description}
          </p>
        )}

        {(hq.city || hq.address) && (
          <div className="mt-5">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Headquarters
            </h3>
            <address className="mt-1 text-sm not-italic text-slate-700">
              {hq.address && <div>{hq.address}</div>}
              <div>
                {[hq.city, hq.state].filter(Boolean).join(", ")} {hq.zip}
              </div>
              {hq.phone && (
                <div className="mt-1">
                  <a
                    href={`tel:${hq.phone.replace(/[^0-9+]/g, "")}`}
                    className="text-[#005cb9] hover:underline"
                  >
                    {hq.phone}
                  </a>
                </div>
              )}
            </address>
          </div>
        )}

        <div className="mt-5">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            States served
          </h3>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {company.states.map((s) => (
              <span
                key={s}
                className="rounded-md bg-[#005cb9]/10 px-2 py-1 text-xs font-medium text-[#005cb9]"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-2 border-t border-slate-100 p-4">
        {company.website && (
          <a
            href={company.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 rounded-lg bg-[#005cb9] px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-[#00427f]"
          >
            Visit website
          </a>
        )}
        {company.careers && (
          <a
            href={company.careers}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 rounded-lg border border-[#005cb9] px-4 py-2 text-center text-sm font-semibold text-[#005cb9] transition hover:bg-[#005cb9]/5"
          >
            Careers
          </a>
        )}
      </div>
    </div>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex-1 rounded-lg bg-slate-50 px-3 py-2 text-center">
      <div className="text-2xl font-bold text-[#005cb9]">{value}</div>
      <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
    </div>
  );
}

function MapLegend() {
  return (
    <div className="pointer-events-none absolute bottom-3 right-3 z-10 rounded-lg bg-white/95 px-3 py-2 text-xs shadow ring-1 ring-slate-200 backdrop-blur">
      <div className="flex items-center gap-2">
        <span
          className="inline-block h-3 w-3 rounded-full"
          style={{ background: brand.blue }}
        />
        <span className="text-slate-600">Location clusters</span>
      </div>
      <div className="mt-1 flex items-center gap-2">
        <span
          className="inline-block h-3 w-3 rounded-full"
          style={{ background: brand.orange }}
        />
        <span className="text-slate-600">Headquarters</span>
      </div>
      <div className="mt-1 flex items-center gap-2">
        <span
          className="inline-block h-3 w-3 rounded-full"
          style={{ background: brand.green }}
        />
        <span className="text-slate-600">Selected company</span>
      </div>
    </div>
  );
}
