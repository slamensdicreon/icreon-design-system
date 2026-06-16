"use client";

import { useMemo, useRef, useState } from "react";
import UsMap from "./UsMap";
import {
  CORPORATE,
  SUBSIDIARIES,
  nameFor,
} from "../_data/subsidiaries";
import {
  EXTRA_OPENINGS,
  SEED_POSITIONS,
  type Position,
} from "../_data/positions";

type Mode = "siloed" | "connected";
type LogEntry = { id: number; text: string; tone: "good" | "warn" | "info" };

// Corporate starts out-of-sync in siloed mode: a few subsidiary roles it
// "hasn't ingested" yet — the everyday reality of disconnected systems.
const CORP_MISSING_AT_START = new Set(["kanaan-4", "ansco-4", "prince-4"]);

function seedSilos(truth: Position[]) {
  const silos: Record<string, Position[]> = {
    [CORPORATE.id]: truth.filter((p) => !CORP_MISSING_AT_START.has(p.id)),
  };
  for (const s of SUBSIDIARIES) silos[s.id] = truth.filter((p) => p.brand === s.id);
  return silos;
}

export default function ConnectedMapsDemo() {
  const [mode, setMode] = useState<Mode>("siloed");
  const [truth, setTruth] = useState<Position[]>(SEED_POSITIONS);
  const [silos, setSilos] = useState<Record<string, Position[]>>(() =>
    seedSilos(SEED_POSITIONS)
  );
  const [crossVisible, setCrossVisible] = useState(true);
  const [actingBrand, setActingBrand] = useState(SUBSIDIARIES[0].id);
  const [log, setLog] = useState<LogEntry[]>([
    {
      id: 0,
      text: "Demo loaded in Siloed mode — Dycom Corporate is already missing 3 roles its subsidiaries have posted.",
      tone: "warn",
    },
  ]);
  const [pulseIds, setPulseIds] = useState<Set<string>>(new Set());
  const logId = useRef(1);
  const postCount = useRef(0);
  const pulseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const addLog = (text: string, tone: LogEntry["tone"]) =>
    setLog((l) => [{ id: logId.current++, text, tone }, ...l].slice(0, 8));

  const pulse = (id: string) => {
    setPulseIds(new Set([id]));
    if (pulseTimer.current) clearTimeout(pulseTimer.current);
    pulseTimer.current = setTimeout(() => setPulseIds(new Set()), 3400);
  };

  // ---- derived views per surface ----
  const corporatePositions =
    mode === "connected" ? truth : silos[CORPORATE.id] ?? [];

  const brandOwn = (brand: string) =>
    (mode === "connected" ? truth : silos[brand] ?? []).filter(
      (p) => p.brand === brand
    );
  const brandGhosts = (brand: string) =>
    mode === "connected" && crossVisible
      ? truth.filter((p) => p.brand !== brand)
      : [];

  const corpVisible = corporatePositions.length;
  const corpTruth = truth.length;
  const inSync = corpVisible === corpTruth;

  // ---- actions ----
  function postOpening() {
    const brand = actingBrand;
    const queue = EXTRA_OPENINGS[brand];
    const tmpl = queue[postCount.current % queue.length];
    postCount.current += 1;
    const newPos: Position = {
      ...tmpl,
      brand,
      id: `${brand}-x${postCount.current}`,
    };
    setTruth((t) => [...t, newPos]);
    if (mode === "siloed") {
      setSilos((s) => ({ ...s, [brand]: [...(s[brand] ?? []), newPos] }));
      addLog(
        `${nameFor(brand)} posted “${newPos.title} — ${newPos.city}, ${newPos.state}”. Visible ONLY on the ${nameFor(brand)} site — Dycom Corporate and sibling sites never see it.`,
        "warn"
      );
    } else {
      addLog(
        `${nameFor(brand)} posted “${newPos.title} — ${newPos.city}, ${newPos.state}”. Synced through SuccessFactors to Dycom Corporate + all ${SUBSIDIARIES.length} sites instantly.`,
        "good"
      );
    }
    pulse(newPos.id);
  }

  function fillOpening() {
    const brand = actingBrand;
    const own = brandOwn(brand);
    if (own.length === 0) {
      addLog(`${nameFor(brand)} has no open roles to fill on its site.`, "info");
      return;
    }
    const filled = own[own.length - 1];
    setTruth((t) => t.filter((p) => p.id !== filled.id));
    if (mode === "siloed") {
      setSilos((s) => ({
        ...s,
        [brand]: (s[brand] ?? []).filter((p) => p.id !== filled.id),
      }));
      addLog(
        `${nameFor(brand)} filled “${filled.title} — ${filled.city}”. Dycom Corporate still advertises it as OPEN (stale data → wasted applicants).`,
        "warn"
      );
    } else {
      addLog(
        `${nameFor(brand)} filled “${filled.title} — ${filled.city}”. Pulled from Dycom Corporate + every site at once.`,
        "good"
      );
    }
  }

  function switchMode(next: Mode) {
    if (next === mode) return;
    if (next === "siloed") {
      setSilos(seedSilos(truth));
      addLog(
        "Switched to Siloed (today). Each site now keeps its own copy — updates stop propagating.",
        "warn"
      );
    } else {
      addLog(
        `Switched to Connected (proposed). All maps now read one SuccessFactors source — ${truth.length} positions visible everywhere.`,
        "good"
      );
    }
    setMode(next);
  }

  function reset() {
    postCount.current = 0;
    setTruth(SEED_POSITIONS);
    setSilos(seedSilos(SEED_POSITIONS));
    setMode("siloed");
    setCrossVisible(true);
    setPulseIds(new Set());
    setLog([
      {
        id: logId.current++,
        text: "Reset. Back to Siloed mode with Corporate out-of-sync by 3 roles.",
        tone: "warn",
      },
    ]);
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <ModeBanner mode={mode} />

      {/* control bar */}
      <div className="mt-6 flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="inline-flex rounded-lg border border-slate-300 p-0.5">
          <SegBtn active={mode === "siloed"} onClick={() => switchMode("siloed")}>
            Siloed · today
          </SegBtn>
          <SegBtn active={mode === "connected"} onClick={() => switchMode("connected")}>
            Connected · proposed
          </SegBtn>
        </div>

        <div className="ml-auto flex flex-wrap items-center gap-2">
          <span className="text-sm text-slate-500">Recruiter on</span>
          <select
            value={actingBrand}
            onChange={(e) => setActingBrand(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-800"
          >
            {SUBSIDIARIES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.short}
              </option>
            ))}
          </select>
          <button
            onClick={postOpening}
            className="rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-semibold text-white hover:bg-slate-700"
          >
            + Post opening
          </button>
          <button
            onClick={fillOpening}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
          >
            ✓ Fill opening
          </button>
          <button
            onClick={reset}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-500 hover:bg-slate-50"
          >
            ↺ Reset
          </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* corporate map + subsidiaries */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {CORPORATE.name}
                </h3>
                <p className="text-sm text-slate-500">careers.dycom.com · all subsidiaries</p>
              </div>
              <div
                className={`rounded-lg px-3 py-2 text-right ${
                  inSync ? "bg-emerald-50" : "bg-rose-50"
                }`}
              >
                <div
                  className={`text-2xl font-bold ${
                    inSync ? "text-emerald-700" : "text-rose-600"
                  }`}
                >
                  {corpVisible}
                  <span className="text-slate-400"> / {corpTruth}</span>
                </div>
                <div
                  className={`text-xs font-medium ${
                    inSync ? "text-emerald-600" : "text-rose-500"
                  }`}
                >
                  {inSync
                    ? "in sync with SuccessFactors"
                    : `${corpTruth - corpVisible} roles missing`}
                </div>
              </div>
            </div>
            <div className="mt-3 overflow-hidden rounded-lg border border-slate-100">
              <UsMap positions={corporatePositions} pulseIds={pulseIds} />
            </div>
            <Legend />
          </div>

          {/* subsidiary mini-maps */}
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {SUBSIDIARIES.map((s) => {
              const own = brandOwn(s.id);
              const ghosts = brandGhosts(s.id);
              return (
                <div
                  key={s.id}
                  className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="inline-block h-2.5 w-2.5 rounded-full"
                        style={{ background: s.color }}
                      />
                      <span className="text-sm font-semibold text-slate-800">
                        {s.short}
                      </span>
                    </div>
                    <span className="text-xs font-medium text-slate-500">
                      {own.length} open
                      {ghosts.length > 0 && (
                        <span className="text-slate-400"> · +{ghosts.length} Dycom</span>
                      )}
                    </span>
                  </div>
                  <div className="mt-2 overflow-hidden rounded-md border border-slate-100">
                    <UsMap
                      positions={own}
                      ghosts={ghosts}
                      pulseIds={pulseIds}
                      compact
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* side rail: explainer, cross-visibility, activity */}
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h4 className="text-sm font-bold uppercase tracking-wide text-slate-500">
              Cross-brand visibility
            </h4>
            <label
              className={`mt-3 flex items-start gap-3 ${
                mode === "connected" ? "" : "opacity-50"
              }`}
            >
              <input
                type="checkbox"
                checked={crossVisible && mode === "connected"}
                disabled={mode !== "connected"}
                onChange={(e) => setCrossVisible(e.target.checked)}
                className="mt-0.5 h-4 w-4"
              />
              <span className="text-sm text-slate-600">
                Show every subsidiary site the open roles available across all of
                Dycom (hollow markers). A candidate on one brand&apos;s site can
                discover every opportunity they qualify for.
                {mode !== "connected" && (
                  <span className="mt-1 block text-xs font-medium text-rose-500">
                    Unavailable while siloed — sites can&apos;t see each other.
                  </span>
                )}
              </span>
            </label>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h4 className="text-sm font-bold uppercase tracking-wide text-slate-500">
              Sync activity
            </h4>
            <ul className="mt-3 space-y-2">
              {log.map((e) => (
                <li
                  key={e.id}
                  className={`rounded-lg border-l-2 px-3 py-2 text-sm ${
                    e.tone === "good"
                      ? "border-emerald-400 bg-emerald-50 text-emerald-800"
                      : e.tone === "warn"
                        ? "border-rose-400 bg-rose-50 text-rose-800"
                        : "border-slate-300 bg-slate-50 text-slate-600"
                  }`}
                >
                  {e.text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function ModeBanner({ mode }: { mode: Mode }) {
  const siloed = mode === "siloed";
  return (
    <div
      className={`rounded-xl border p-4 ${
        siloed
          ? "border-rose-200 bg-rose-50"
          : "border-emerald-200 bg-emerald-50"
      }`}
    >
      <p className={`text-sm font-medium ${siloed ? "text-rose-800" : "text-emerald-800"}`}>
        {siloed ? (
          <>
            <strong>Siloed (today):</strong> Dycom Corporate and each subsidiary
            run independent maps off separate SAP SuccessFactors feeds. Post or
            fill a role below — watch it strand on a single site while Corporate
            drifts out of date.
          </>
        ) : (
          <>
            <strong>Connected (proposed):</strong> one SuccessFactors source of
            truth feeds every map. Every post, fill, and relocation propagates to
            Corporate and all sibling sites at once.
          </>
        )}
      </p>
    </div>
  );
}

function SegBtn({
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
        active ? "bg-slate-900 text-white" : "text-slate-600 hover:text-slate-900"
      }`}
    >
      {children}
    </button>
  );
}

function Legend() {
  return (
    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
      {SUBSIDIARIES.map((s) => (
        <span key={s.id} className="flex items-center gap-1.5 text-xs text-slate-600">
          <span
            className="inline-block h-2.5 w-2.5 rounded-full"
            style={{ background: s.color }}
          />
          {s.short}
        </span>
      ))}
    </div>
  );
}
