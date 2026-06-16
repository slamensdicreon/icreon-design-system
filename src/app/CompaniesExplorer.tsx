"use client";

import { useEffect, useMemo, useState } from "react";
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
import { Job, JOB_CATEGORIES, jobsToFeatureCollection } from "./jobs";
import { useNetwork } from "./network-store";
import { brand, stateName } from "./brand";

const EMPTY_FC: GeoJSON.FeatureCollection<GeoJSON.Point> = {
  type: "FeatureCollection",
  features: [],
};

type View = "network" | "roles";

interface ExplorerProps {
  mapboxToken: string;
  perspectiveCompanyId?: number | null;
}

export default function CompaniesExplorer({
  mapboxToken,
  perspectiveCompanyId = null,
}: ExplorerProps) {
  const router = useRouter();
  const { jobs, addJob, demoJobs, resetDemoJobs } = useNetwork();

  const perspective =
    perspectiveCompanyId != null ? getCompany(perspectiveCompanyId) ?? null : null;

  const [view, setView] = useState<View>("network");
  const [selectedId, setSelectedId] = useState<number | null>(perspectiveCompanyId);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [category, setCategory] = useState("");
  const [scope, setScope] = useState<"family" | "company">("family");
  const [posting, setPosting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 6000);
    return () => clearTimeout(t);
  }, [toast]);

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

  // The scope toggle ("this company") only makes sense on a subsidiary site.
  const scopeCompanyId = perspective?.id ?? null;
  const scopeActive = scope === "company" && scopeCompanyId != null;

  // Base (clustered) map data: the whole network in network view, or open roles
  // — family-wide by default — in roles view.
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
      return jobsToFeatureCollection(
        jobs.filter((j) => j.companyId === focusCompany.id),
      );
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

  function handlePost(input: {
    title: string;
    category: string;
    company: Company;
  }) {
    const hq = input.company.headquarters;
    const job = addJob({
      title: input.title,
      category: input.category,
      companyId: input.company.id,
      companyName: input.company.name,
      lng: hq.lng ?? input.company.locations[0]?.lng ?? 0,
      lat: hq.lat ?? input.company.locations[0]?.lat ?? 0,
      state: hq.state || input.company.locations[0]?.state || "",
    });
    setPosting(false);
    setView("roles");
    setScope("family");
    setCategory("");
    setQuery("");
    setSelectedId(job.companyId);
    setToast(
      `Posted “${job.title}” at ${job.companyName} — instantly synced to the parent map, ${job.companyName}'s site, and SAP SuccessFactors.`,
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <BrandHeader
        perspective={perspective}
        view={view}
        onSwitchView={switchView}
        openRolesTotal={jobs.length}
        perspectiveRoleCount={
          perspective ? jobsByCompany.get(perspective.id)?.length ?? 0 : 0
        }
        onPerspectiveChange={(slug) => router.push(slug ? `/c/${slug}` : "/")}
        onPostRole={() => setPosting(true)}
      />

      <section className="mx-auto w-full max-w-[1400px] px-4 pb-16 sm:px-6">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex h-[78vh] min-h-[560px] flex-col lg:flex-row">
            {/* Sidebar */}
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

            {/* Map */}
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
                  className="absolute left-4 top-4 z-10 rounded-full bg-white/95 px-4 py-2 text-sm font-semibold text-[#005cb9] shadow-md ring-1 ring-slate-200 backdrop-blur transition hover:bg-white"
                >
                  ← View the whole network
                </button>
              )}
              <MapLegend view={view} />
            </div>
          </div>
        </div>

        {demoJobs.length > 0 && (
          <p className="mt-3 text-center text-xs text-slate-500">
            {demoJobs.length} role{demoJobs.length === 1 ? "" : "s"} added in this
            demo session are live across every view.{" "}
            <button
              onClick={resetDemoJobs}
              className="font-medium text-[#005cb9] hover:underline"
            >
              Reset demo data
            </button>
          </p>
        )}
      </section>

      {posting && (
        <PostRoleDialog
          perspective={perspective}
          onClose={() => setPosting(false)}
          onSubmit={handlePost}
        />
      )}

      {toast && (
        <div className="fixed bottom-5 left-1/2 z-50 w-[min(92vw,560px)] -translate-x-1/2 rounded-xl bg-[#0d1b2a] px-4 py-3 text-sm text-white shadow-2xl ring-1 ring-white/10">
          <div className="flex items-start gap-2">
            <span className="mt-0.5 text-[#84bd00]">✓</span>
            <span>{toast}</span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------- Header --------------------------------- */

function BrandHeader({
  perspective,
  view,
  onSwitchView,
  openRolesTotal,
  perspectiveRoleCount,
  onPerspectiveChange,
  onPostRole,
}: {
  perspective: Company | null;
  view: View;
  onSwitchView: (v: View) => void;
  openRolesTotal: number;
  perspectiveRoleCount: number;
  onPerspectiveChange: (slug: string) => void;
  onPostRole: () => void;
}) {
  return (
    <header className="bg-gradient-to-br from-[#005cb9] to-[#00427f] text-white">
      <div className="mx-auto max-w-[1400px] px-4 pb-6 pt-8 sm:px-6">
        {/* Connected-network bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-white/10 px-4 py-3 ring-1 ring-white/15">
          <div className="flex items-center gap-2 text-sm">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#84bd00] text-xs font-bold text-[#0d1b2a]">
              ↻
            </span>
            <span className="font-medium">
              One connected network —{" "}
              <span className="text-blue-100">
                synced across dycomind.com · 38 subsidiary sites · SAP
                SuccessFactors
              </span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-blue-100">Viewing site:</label>
            <select
              value={perspective ? companySlug(perspective) : ""}
              onChange={(e) => onPerspectiveChange(e.target.value)}
              className="rounded-lg border border-white/20 bg-white/95 px-2 py-1.5 text-sm font-medium text-slate-900 outline-none"
            >
              <option value="">Dycom Industries (parent)</option>
              {companies.map((c) => (
                <option key={c.id} value={companySlug(c)}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Title row */}
        <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#84bd00]">
              {perspective ? "Dycom Family Company" : "Dycom Industries"}
            </p>
            <h1 className="mt-2 max-w-3xl text-3xl font-bold leading-tight sm:text-4xl">
              {perspective
                ? perspective.name
                : "Explore the Dycom family of companies"}
            </h1>
            {perspective ? (
              <p className="mt-2 max-w-2xl text-blue-100">
                You&apos;re on {perspective.name}&apos;s site. As part of the
                Dycom family, you can see{" "}
                <strong className="text-white">
                  all {openRolesTotal.toLocaleString()} open roles
                </strong>{" "}
                across {dataset.companyCount} companies — not just the{" "}
                {perspectiveRoleCount} here.
              </p>
            ) : (
              <p className="mt-2 max-w-2xl text-blue-100">
                One organization, nationwide reach. Every subsidiary site reads
                from this same network — browse companies, locations, and{" "}
                {openRolesTotal.toLocaleString()} open roles.
              </p>
            )}
          </div>

          <button
            onClick={onPostRole}
            className="rounded-lg bg-[#84bd00] px-4 py-2.5 text-sm font-semibold text-[#0d1b2a] shadow-sm transition hover:brightness-105"
          >
            + Post a role (demo)
          </button>
        </div>

        {/* Stats + view toggle */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <HeroStat value={dataset.companyCount} label="Companies" />
            <HeroStat value={dataset.locationCount} label="Locations" />
            <HeroStat value={dataset.stateCount} label="States" />
            <HeroStat value={openRolesTotal} label="Open roles" accent />
          </dl>

          <div className="inline-flex rounded-lg bg-white/10 p-1 ring-1 ring-white/15">
            <ToggleBtn active={view === "network"} onClick={() => onSwitchView("network")}>
              Network map
            </ToggleBtn>
            <ToggleBtn active={view === "roles"} onClick={() => onSwitchView("roles")}>
              Open roles map
            </ToggleBtn>
          </div>
        </div>
      </div>
    </header>
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
        active ? "bg-white text-[#005cb9]" : "text-white/90 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

function HeroStat({
  value,
  label,
  accent,
}: {
  value: number;
  label: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-xl px-4 py-3 ring-1 ${
        accent ? "bg-[#84bd00]/20 ring-[#84bd00]/40" : "bg-white/10 ring-white/15"
      }`}
    >
      <dd className="text-2xl font-bold sm:text-3xl">{value.toLocaleString()}</dd>
      <dt className="mt-0.5 text-xs font-medium uppercase tracking-wide text-blue-100">
        {label}
      </dt>
    </div>
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
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#005cb9] focus:ring-2 focus:ring-[#005cb9]/20"
        />
        <select
          value={stateFilter}
          onChange={(e) => setStateFilter(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#005cb9]"
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
              className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-[#005cb9]/5"
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
                  <span className="font-medium text-[#005cb9]">
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
      .sort(
        (a, b) =>
          Number(!!b.demo) - Number(!!a.demo) || a.postedDays - b.postedDays,
      );
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
                scope === "family"
                  ? "bg-white text-[#005cb9] shadow-sm"
                  : "text-slate-500"
              }`}
            >
              All Dycom family
            </button>
            <button
              onClick={() => setScope("company")}
              className={`flex-1 rounded-md px-2 py-1.5 font-semibold transition ${
                scope === "company"
                  ? "bg-white text-[#005cb9] shadow-sm"
                  : "text-slate-500"
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
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#005cb9] focus:ring-2 focus:ring-[#005cb9]/20"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#005cb9]"
        >
          <option value="">All categories</option>
          {JOB_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
          {filtered.length.toLocaleString()} open role
          {filtered.length === 1 ? "" : "s"}
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
              className="flex w-full items-start gap-3 px-4 py-3 text-left transition hover:bg-[#005cb9]/5"
            >
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2">
                  <span className="truncate text-sm font-semibold text-slate-900">
                    {j.title}
                  </span>
                  {j.demo && (
                    <span className="rounded bg-[#84bd00]/20 px-1.5 py-0.5 text-[10px] font-bold uppercase text-[#4a6b00]">
                      New
                    </span>
                  )}
                </span>
                <span className="mt-0.5 block truncate text-xs text-slate-500">
                  {j.companyName} · {stateName(j.state)}
                </span>
                <span className="mt-0.5 block text-xs text-slate-400">
                  {j.category} ·{" "}
                  {j.postedDays === 0 ? "Just now" : `${j.postedDays}d ago`}
                </span>
              </span>
              <span className="text-slate-300">›</span>
            </button>
          </li>
        ))}
        {filtered.length > shown.length && (
          <li className="px-4 py-3 text-center text-xs text-slate-400">
            Showing first {shown.length} of {filtered.length.toLocaleString()} —
            refine with the filters above.
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
        <button onClick={onBack} className="text-sm font-medium text-[#005cb9] hover:underline">
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
          className="mt-3 w-full rounded-lg border border-[#005cb9]/30 bg-[#005cb9]/5 px-3 py-2 text-sm font-semibold text-[#005cb9] transition hover:bg-[#005cb9]/10"
        >
          View {roleCount} open role{roleCount === 1 ? "" : "s"} on the map →
        </button>

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
                  <a href={`tel:${hq.phone.replace(/[^0-9+]/g, "")}`} className="text-[#005cb9] hover:underline">
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
              <span key={s} className="rounded-md bg-[#005cb9]/10 px-2 py-1 text-xs font-medium text-[#005cb9]">
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
            className="flex-1 rounded-lg bg-[#005cb9] px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-[#00427f]"
          >
            Open their site
          </button>
        )}
        {company.website && (
          <a
            href={company.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 rounded-lg border border-[#005cb9] px-4 py-2 text-center text-sm font-semibold text-[#005cb9] transition hover:bg-[#005cb9]/5"
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
      <div className="text-xl font-bold text-[#005cb9]">{value}</div>
      <div className="text-[10px] uppercase tracking-wide text-slate-500">{label}</div>
    </div>
  );
}

/* ------------------------------- Post dialog ----------------------------- */

function PostRoleDialog({
  perspective,
  onClose,
  onSubmit,
}: {
  perspective: Company | null;
  onClose: () => void;
  onSubmit: (input: { title: string; category: string; company: Company }) => void;
}) {
  const [companyId, setCompanyId] = useState<number>(
    perspective?.id ?? companies[0].id,
  );
  const [category, setCategory] = useState<string>(JOB_CATEGORIES[0]);
  const [title, setTitle] = useState("Fiber Splice Technician");

  const company = getCompany(companyId) ?? companies[0];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold text-slate-900">Post a new role</h3>
        <p className="mt-1 text-sm text-slate-500">
          Add it once. It appears on the parent map, the subsidiary&apos;s site,
          and SAP SuccessFactors at the same time.
        </p>

        <label className="mt-4 block text-xs font-semibold uppercase tracking-wide text-slate-500">
          Title
        </label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#005cb9]"
        />

        <label className="mt-3 block text-xs font-semibold uppercase tracking-wide text-slate-500">
          Company
        </label>
        <select
          value={companyId}
          onChange={(e) => setCompanyId(Number(e.target.value))}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#005cb9]"
        >
          {companies.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <label className="mt-3 block text-xs font-semibold uppercase tracking-wide text-slate-500">
          Category
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#005cb9]"
        >
          {JOB_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <div className="mt-6 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={() =>
              title.trim() && onSubmit({ title: title.trim(), category, company })
            }
            className="flex-1 rounded-lg bg-[#84bd00] px-4 py-2 text-sm font-semibold text-[#0d1b2a] transition hover:brightness-105"
          >
            Post &amp; sync
          </button>
        </div>
      </div>
    </div>
  );
}

/* --------------------------------- Legend -------------------------------- */

function MapLegend({ view }: { view: View }) {
  return (
    <div className="pointer-events-none absolute bottom-3 right-3 z-10 rounded-lg bg-white/95 px-3 py-2 text-xs shadow ring-1 ring-slate-200 backdrop-blur">
      <div className="flex items-center gap-2">
        <span className="inline-block h-3 w-3 rounded-full" style={{ background: brand.blue }} />
        <span className="text-slate-600">
          {view === "roles" ? "Open roles" : "Locations"} (clustered)
        </span>
      </div>
      <div className="mt-1 flex items-center gap-2">
        <span className="inline-block h-3 w-3 rounded-full" style={{ background: brand.green }} />
        <span className="text-slate-600">Selected company</span>
      </div>
    </div>
  );
}
