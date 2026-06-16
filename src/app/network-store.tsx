"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";
import { Job, SEED_JOBS } from "./jobs";

/**
 * The "single source of truth" for the demo. One store backs the parent map and
 * every subsidiary site. Live additions persist to localStorage and are shared
 * across tabs via the `storage` event, so an update made on one site shows up on
 * all of them — exactly the behavior the fragmented production setup lacks.
 */

const STORAGE_KEY = "dycom-demo-jobs-v2";
const EMPTY: Job[] = [];

// Module-level cache so useSyncExternalStore gets a stable reference between
// renders (it only changes when the persisted data actually changes).
let cachedRaw: string | null = null;
let cachedJobs: Job[] = EMPTY;
const listeners = new Set<() => void>();

function readSnapshot(): Job[] {
  if (typeof window === "undefined") return EMPTY;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw === cachedRaw) return cachedJobs;
  cachedRaw = raw;
  try {
    cachedJobs = raw ? (JSON.parse(raw) as Job[]) : EMPTY;
  } catch {
    cachedJobs = EMPTY;
  }
  return cachedJobs;
}

function getServerSnapshot(): Job[] {
  return EMPTY;
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}

function writeDemoJobs(jobs: Job[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
  } catch {
    // ignore storage failures in the demo
  }
  cachedRaw = null; // force re-parse on next read
  listeners.forEach((l) => l());
}

interface NewJobInput {
  title: string;
  category: string;
  companyId: number;
  companyName: string;
  lng: number;
  lat: number;
  state: string;
}

interface NetworkContextValue {
  jobs: Job[];
  demoJobs: Job[];
  addJob: (input: NewJobInput) => Job;
  resetDemoJobs: () => void;
}

const NetworkContext = createContext<NetworkContextValue | null>(null);

export function NetworkProvider({ children }: { children: React.ReactNode }) {
  const demoJobs = useSyncExternalStore(subscribe, readSnapshot, getServerSnapshot);

  const addJob = useCallback((input: NewJobInput) => {
    const job: Job = { ...input, id: `demo-${Date.now()}`, postedDays: 0, demo: true };
    writeDemoJobs([job, ...readSnapshot()]);
    return job;
  }, []);

  const resetDemoJobs = useCallback(() => writeDemoJobs([]), []);

  const value = useMemo<NetworkContextValue>(
    () => ({ jobs: [...demoJobs, ...SEED_JOBS], demoJobs, addJob, resetDemoJobs }),
    [demoJobs, addJob, resetDemoJobs],
  );

  return (
    <NetworkContext.Provider value={value}>{children}</NetworkContext.Provider>
  );
}

export function useNetwork(): NetworkContextValue {
  const ctx = useContext(NetworkContext);
  if (!ctx) throw new Error("useNetwork must be used within NetworkProvider");
  return ctx;
}
