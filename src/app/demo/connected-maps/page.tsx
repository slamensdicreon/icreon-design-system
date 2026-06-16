import type { Metadata } from "next";
import ConnectedMapsDemo from "./_components/ConnectedMapsDemo";

export const metadata: Metadata = {
  title: "Connected Careers Map — Dycom Demo",
  description:
    "A single source of truth linking the Dycom corporate map with every subsidiary map.",
};

export default function ConnectedMapsPage() {
  return (
    <div className="bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">
            Dycom · Connected Careers Experience
          </p>
          <h1 className="mt-2 max-w-3xl text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            One map, every brand — linked through SuccessFactors
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-slate-600">
            Today the Dycom corporate site and each subsidiary site run their own
            careers map off separate SAP SuccessFactors feeds, so they fall out of
            sync and a candidate entering through one brand never sees the full
            set of openings. This demo connects them to a single source of truth.
          </p>
        </div>
      </section>
      <ConnectedMapsDemo />
    </div>
  );
}
