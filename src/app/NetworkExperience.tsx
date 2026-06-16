"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import DycomMap from "./DycomMap";
import {
  Company,
  companies,
  companySlug,
  dataset,
  getCompany,
  toFeatureCollection,
} from "./types";
import { Job, JOB_CATEGORIES, SEED_JOBS, jobsToFeatureCollection } from "./jobs";
import { brand, stateName } from "./brand";
import { Theme, themeVars } from "./themes";

const EMPTY_FC: GeoJSON.FeatureCollection<GeoJSON.Point> = {
  type: "FeatureCollection",
  features: [],
};

type View = "network" | "roles";

interface Props {
  mapboxToken: string;
  accent: Theme;
  perspectiveCompanyId?: number | null;
}

export default function NetworkExperience({
  mapboxToken,
  accent,
  perspectiveCompanyId = null,
}: Props) {
  const router = useRouter();
  const jobs = SEED_JOBS;

  const perspective =
    perspectiveCompanyId != null ? getCompany(perspectiveCompanyId) ?? null : null;

  const [view, setView] = useState<View>("network");
  const [selectedId, setSelectedId] = useState<number | null>(perspectiveCompanyId);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [category, setCategory] = useState("");
  const [scope, setScope] = useState<"family" | "company">("family");

  const jobsByCompany = useMemo(() => {
    const map = new Map<number, Job[]>();
    for (const j of jobs) {
      const arr = map.get(j.companyId);
      if (arr) arr.push(j);
      else map.set(j.companyId, [j]);
    }
    return map;
  }, [jobs]);

  const selected = selectedId != null ? getCompany(selectedId) ?? null : null;
  const focusCompany =
    selectedId != null || hoveredId != null
      ? getCompany((selectedId ?? hoveredId) as number) ?? null
      : null;

  const scopeCompanyId = perspective?.id ?? null;
  const scopeActive = scope === "company" && scopeCompanyId != null;

  const baseData = useMemo(() => {
    if (view === "roles") {
      const src = scopeActive
        ? jobs.filter((j) => j.companyId === scopeCompanyId)
        : jobs;
      return jobsToFeatureCollection(src);
    }
    return toFeatureCollection(companies);
  }, [view, scopeActive, scopeCompanyId, jobs]);

  const focusData = useMemo(() => {
    if (!focusCompany) return EMPTY_FC;
    if (view === "roles") {
      return jobsToFeatureCollection(jobs.filter((j) => j.companyId === focusCompany.id));
    }
    return toFeatureCollection([focusCompany]);
  }, [focusCompany, view, jobs]);

  const focusBounds = useMemo<[number, number][] | null>(
    () =>
      focusCompany
        ? focusCompany.locations.map((l) => [l.lng, l.lat] as [number, number])
        : null,
    [focusCompany],
  );

  function switchView(next: View) {
    setView(next);
    setSelectedId(null);
    setQuery("");
  }

  return (
    <div style={themeVars(accent)} className="mx-auto w-full max-w-[1400px] px-4 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3 py-4">
        <div className="inline-flex rounded-lg bg-white p-1 shadow-sm ring-1 ring-slate-200">
          <ToggleBtn active={view === "network"} onClick={() => switchView("network")}>
            Network map
          </ToggleBtn>
          <ToggleBtn active={view === "roles"} onClick={() => switchView("roles")}>
            Open roles map
          </ToggleBtn>
        </div>
        <p className="text-sm text-slate-500">
          <span className="font-semibold text-slate-700">
            {jobs.length.toLocaleString()}
          </span>{" "}
          open roles across all {dataset.companyCount} Dycom companies
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex h-[72vh] min-h-[540px] flex-col lg:flex-row">
          <aside className="flex w-full shrink-0 flex-col border-b border-slate-200 lg:w-[400px] lg:border-b-0 lg:border-r">
            {selected ? (
              <CompanyDetail
                company={selected}
                roleCount={jobsByCompany.get(selected.id)?.length ?? 0}
                isPerspective={perspective?.id === selected.id}
                onBack={() => setSelectedId(null)}
                onViewSite={() => router.push(`/c/${companySlug(selected)}`)}
                onViewRoles={() => {
                  setView("roles");
                  setScope("company");
                }}
              />
            ) : view === "roles" ? (
              <RolesList
                jobs={jobs}
                perspective={perspective}
                scope={scope}
                setScope={setScope}
                category={category}
                setCategory={setCategory}
                query={query}
                setQuery={setQuery}
                onSelectCompany={setSelectedId}
                onHoverCompany={setHoveredId}
              />
            ) : (
              <CompanyList
                filtered={companies.filter((c) => {
                  const q = query.trim().toLowerCase();
                  const mq =
                    !q ||
                    c.name.toLowerCase().includes(q) ||
                    c.states.some((s) => stateName(s).toLowerCase().includes(q));
                  const ms = !stateFilter || c.states.includes(stateFilter);
                  return mq && ms;
                })}
                query={query}
                setQuery={setQuery}
                stateFilter={stateFilter}
                setStateFilter={setStateFilter}
                roleCountFor={(id) => jobsByCompany.get(id)?.length ?? 0}
                onSelect={setSelectedId}
                onHover={setHoveredId}
              />
            )}
          </aside>

          <div className="relative min-h-[360px] flex-1">
            <DycomMap
              token={mapboxToken}
              baseData={baseData}
              focusData={focusData}
              focusBounds={focusBounds}
              selectionKey={selectedId}
              onSelectCompany={setSelectedId}
            />
            {selected && (
              <button
                onClick={() => setSelectedId(null)}
                className="absolute left-4 top-4 z-10 rounded-full bg-white/95 px-4 py-2 text-sm font-semibold text-[var(--accent)] shadow-md ring-1 ring-slate-200 backdrop-blur transition hover:bg-white"
              >
                ← View the whole network
              </button>
            )}
            <MapLegend view={view} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ToggleBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-md px-3 py-1.5 text-sm font-semibold transition ${
        active ? "bg-[var(--accent)] text-white" : "text-slate-600 hover:text-slate-900"
      }`}
    >
      {children}
    </button>
  );
}

/* ------------------------------ Company list ----------------------------- */

function CompanyList({
  filtered,
  query,
  setQuery,
  stateFilter,
  setStateFilter,
  roleCountFor,
  onSelect,
  onHover,
}: {
  filtered: Company[];
  query: string;
  setQuery: (v: string) => void;
  stateFilter: string;
  setStateFilter: (v: string) => void;
  roleCountFor: (id: number) => number;
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
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-ring)]"
        />
        <select
          value={stateFilter}
          onChange={(e) => setStateFilter(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
        >
          <option value="">All states</option>
          {dataset.states.map((s) => (
            <option key={s} value={s}>
              {stateName(s)}
            </option>
          ))}
        </select>
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
              className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-[var(--accent-soft)]"
            >
              <span className="relative flex h-9 w-16 shrink-0 items-center justify-center">
                {c.logo ? (
                  <Image src={c.logo} alt={c.name} fill sizes="64px" className="object-contain" />
                ) : null}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-slate-900">
                  {c.name}
                </span>
                <span className="mt-0.5 block text-xs text-slate-500">
                  {c.locations.length} locations · {c.states.length} states ·{" "}
                  <span className="font-medium text-[var(--accent)]">
                    {roleCountFor(c.id)} open roles
                  </span>
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

/* ------------------------------- Roles list ------------------------------ */

function RolesList({
  jobs,
  perspective,
  scope,
  setScope,
  category,
  setCategory,
  query,
  setQuery,
  onSelectCompany,
  onHoverCompany,
}: {
  jobs: Job[];
  perspective: Company | null;
  scope: "family" | "company";
  setScope: (s: "family" | "company") => void;
  category: string;
  setCategory: (c: string) => void;
  query: string;
  setQuery: (q: string) => void;
  onSelectCompany: (id: number) => void;
  onHoverCompany: (id: number | null) => void;
}) {
  const scopeActive = scope === "company" && perspective != null;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return jobs
      .filter((j) => (!scopeActive ? true : j.companyId === perspective!.id))
      .filter((j) => !category || j.category === category)
      .filter(
        (j) =>
          !q ||
          j.title.toLowerCase().includes(q) ||
          j.companyName.toLowerCase().includes(q) ||
          stateName(j.state).toLowerCase().includes(q),
      )
      .sort((a, b) => a.postedDays - b.postedDays);
  }, [jobs, scopeActive, perspective, category, query]);

  const shown = filtered.slice(0, 200);

  return (
    <>
      <div className="space-y-3 border-b border-slate-100 p-4">
        {perspective && (
          <div className="inline-flex w-full rounded-lg bg-slate-100 p-1 text-sm">
            <button
              onClick={() => setScope("family")}
              className={`flex-1 rounded-md px-2 py-1.5 font-semibold transition ${
                scope === "family" ? "bg-white text-[var(--accent)] shadow-sm" : "text-slate-500"
              }`}
            >
              All Dycom family
            </button>
            <button
              onClick={() => setScope("company")}
              className={`flex-1 rounded-md px-2 py-1.5 font-semibold transition ${
                scope === "company" ? "bg-white text-[var(--accent)] shadow-sm" : "text-slate-500"
              }`}
            >
              {perspective.name.split(" ")[0]} only
            </button>
          </div>
        )}
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search roles, companies, states…"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-ring)]"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
        >
          <option value="">All categories</option>
          {JOB_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
          {filtered.length.toLocaleString()} open role{filtered.length === 1 ? "" : "s"}
          {scopeActive ? ` at ${perspective!.name}` : " across the family"}
        </p>
      </div>
      <ul
        className="flex-1 divide-y divide-slate-100 overflow-y-auto"
        onMouseLeave={() => onHoverCompany(null)}
      >
        {shown.map((j) => (
          <li key={j.id}>
            <button
              onClick={() => onSelectCompany(j.companyId)}
              onMouseEnter={() => onHoverCompany(j.companyId)}
              className="flex w-full items-start gap-3 px-4 py-3 text-left transition hover:bg-[var(--accent-soft)]"
            >
              <span className="min-w-0 flex-1">
                <span className="truncate text-sm font-semibold text-slate-900">
                  {j.title}
                </span>
                <span className="mt-0.5 block truncate text-xs text-slate-500">
                  {j.companyName} · {stateName(j.state)}
                </span>
                <span className="mt-0.5 block text-xs text-slate-400">
                  {j.category} · {j.postedDays}d ago
                </span>
              </span>
              <span className="text-slate-300">›</span>
            </button>
          </li>
        ))}
        {filtered.length > shown.length && (
          <li className="px-4 py-3 text-center text-xs text-slate-400">
            Showing first {shown.length} of {filtered.length.toLocaleString()} — refine
            with the filters above.
          </li>
        )}
        {filtered.length === 0 && (
          <li className="px-4 py-10 text-center text-sm text-slate-500">
            No open roles match your filters.
          </li>
        )}
      </ul>
    </>
  );
}

/* ------------------------------ Company detail --------------------------- */

function CompanyDetail({
  company,
  roleCount,
  isPerspective,
  onBack,
  onViewSite,
  onViewRoles,
}: {
  company: Company;
  roleCount: number;
  isPerspective: boolean;
  onBack: () => void;
  onViewSite: () => void;
  onViewRoles: () => void;
}) {
  const hq = company.headquarters;
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-slate-100 p-4">
        <button onClick={onBack} className="text-sm font-medium text-[var(--accent)] hover:underline">
          ← Back
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-5">
        <div className="relative mb-4 flex h-16 w-44 items-center">
          {company.logo ? (
            <Image src={company.logo} alt={company.name} fill sizes="176px" className="object-contain object-left" />
          ) : null}
        </div>
        <h2 className="text-xl font-bold text-slate-900">{company.name}</h2>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <Stat value={company.locations.length} label="Locations" />
          <Stat value={company.states.length} label="States" />
          <Stat value={roleCount} label="Open roles" />
        </div>

        <button
          onClick={onViewRoles}
          className="mt-3 w-full rounded-lg border border-[var(--accent)] bg-[var(--accent-soft)] px-3 py-2 text-sm font-semibold text-[var(--accent)] transition hover:brightness-95"
        >
          View {roleCount} open role{roleCount === 1 ? "" : "s"} on the map →
        </button>

        {company.description && (
          <p className="mt-5 text-sm leading-relaxed text-slate-600">{company.description}</p>
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
                  <a href={`tel:${hq.phone.replace(/[^0-9+]/g, "")}`} className="text-[var(--accent)] hover:underline">
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
                className="rounded-md bg-[var(--accent-soft)] px-2 py-1 text-xs font-medium text-[var(--accent)]"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-2 border-t border-slate-100 p-4">
        {!isPerspective && (
          <button
            onClick={onViewSite}
            className="flex-1 rounded-lg bg-[var(--accent)] px-4 py-2 text-center text-sm font-semibold text-white transition hover:brightness-110"
          >
            Open their site
          </button>
        )}
        {company.website && (
          <a
            href={company.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 rounded-lg border border-[var(--accent)] px-4 py-2 text-center text-sm font-semibold text-[var(--accent)] transition hover:bg-[var(--accent-soft)]"
          >
            Visit website
          </a>
        )}
      </div>
    </div>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-lg bg-slate-50 px-2 py-2 text-center">
      <div className="text-xl font-bold text-[var(--accent)]">{value}</div>
      <div className="text-[10px] uppercase tracking-wide text-slate-500">{label}</div>
    </div>
  );
}

function MapLegend({ view }: { view: View }) {
  return (
    <div className="pointer-events-none absolute bottom-3 right-3 z-10 rounded-lg bg-white/95 px-3 py-2 text-xs shadow ring-1 ring-slate-200 backdrop-blur">
      <div className="flex items-center gap-2">
        <span className="inline-block h-3 w-3 rounded-full" style={{ background: brand.blue }} />
        <span className="text-slate-600">{view === "roles" ? "Open roles" : "Locations"} (clustered)</span>
      </div>
      <div className="mt-1 flex items-center gap-2">
        <span className="inline-block h-3 w-3 rounded-full" style={{ background: brand.green }} />
        <span className="text-slate-600">Selected company</span>
      </div>
    </div>
  );
}
