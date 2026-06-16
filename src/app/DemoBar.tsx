"use client";

import { usePathname, useRouter } from "next/navigation";
import { companies, companySlug, findCompanyBySlug } from "./types";

/**
 * A thin, deliberately "meta" bar that sits above each site's own chrome. It is
 * the demo navigator — it lets you jump between the parent and any subsidiary so
 * you can see that every (differently branded) site shares the same connected
 * map and data.
 */
export default function DemoBar() {
  const pathname = usePathname();
  const router = useRouter();

  const slug = pathname?.startsWith("/c/") ? pathname.split("/")[2] : "";
  const current = slug ? findCompanyBySlug(slug) : null;
  const value = current ? companySlug(current) : "";

  return (
    <div className="bg-[#0d1b2a] text-white">
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-2 px-4 py-1.5 text-xs sm:px-6">
        <span className="font-medium text-slate-300">
          <span className="text-[#84bd00]">●</span> Connected demo — every site
          below is its own brand, powered by one shared map &amp; data
        </span>
        <label className="flex items-center gap-2">
          <span className="text-slate-400">Jump to site:</span>
          <select
            value={value}
            onChange={(e) => router.push(e.target.value ? `/c/${e.target.value}` : "/")}
            className="rounded border border-white/20 bg-white/10 px-2 py-1 text-xs text-white outline-none [&>option]:text-slate-900"
          >
            <option value="">Dycom Industries (parent)</option>
            {companies.map((c) => (
              <option key={c.id} value={companySlug(c)}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}
