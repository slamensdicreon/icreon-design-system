import Image from "next/image";
import Link from "next/link";
import { Company, dataset } from "./types";
import { Theme, themeVars } from "./themes";

/**
 * Independent-feeling chrome for a subsidiary "site": its own logo nav, accent
 * color, hero and footer. The connected map is passed in as children, so each
 * visually distinct site embeds the exact same shared network.
 */
export default function SubsidiaryChrome({
  company,
  theme,
  roleCount,
  children,
}: {
  company: Company;
  theme: Theme;
  roleCount: number;
  children: React.ReactNode;
}) {
  const nav = ["Services", "Our Network", "Careers", "Safety", "Contact"];
  return (
    <div style={themeVars(theme)} className="flex min-h-screen flex-col bg-slate-50">
      {/* Site nav — looks like the company's own website */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-4 py-3 sm:px-6">
          <div className="relative h-9 w-40">
            {company.logo ? (
              <Image src={company.logo} alt={company.name} fill sizes="160px" className="object-contain object-left" />
            ) : (
              <span className="font-bold text-slate-900">{company.name}</span>
            )}
          </div>
          <nav className="hidden items-center gap-7 md:flex">
            {nav.map((item) => (
              <span key={item} className="text-sm font-medium text-slate-600">
                {item}
              </span>
            ))}
          </nav>
          <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold text-[var(--accent)]">
            A Dycom Company
          </span>
        </div>
      </header>

      {/* Hero in the company's own accent */}
      <section className="bg-[var(--accent)] text-white">
        <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6">
          <h1 className="max-w-3xl text-3xl font-bold leading-tight sm:text-4xl">
            {company.name}
          </h1>
          <p className="mt-3 max-w-2xl text-white/85">
            {company.description
              ? company.description.split(". ")[0] + "."
              : "Connecting communities across the country."}
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <span className="rounded-lg bg-white/15 px-3 py-2 font-semibold ring-1 ring-white/20">
              {company.locations.length} locations
            </span>
            <span className="rounded-lg bg-white/15 px-3 py-2 font-semibold ring-1 ring-white/20">
              {company.states.length} states
            </span>
            <span className="rounded-lg bg-white/15 px-3 py-2 font-semibold ring-1 ring-white/20">
              {roleCount} open roles here
            </span>
          </div>
        </div>
      </section>

      {/* Connected map section */}
      <section className="mx-auto w-full max-w-[1400px] px-4 pt-8 sm:px-6">
        <div className="px-1">
          <h2 className="text-2xl font-bold text-slate-900">
            Explore careers across the Dycom family
          </h2>
          <p className="mt-1 max-w-3xl text-slate-600">
            {company.name} is one of {dataset.companyCount} Dycom companies. The
            map below is shared across every Dycom site — so from here you can
            explore the entire network and all{" "}
            {dataset.companyCount}-company hiring, not just our own roles.
          </p>
        </div>
      </section>

      <main className="flex-1 pb-10">{children}</main>

      {/* Footer ties it back to the family */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-2 px-4 py-6 text-sm sm:px-6">
          <span className="text-slate-500">
            © {new Date().getFullYear()} {company.name}. A Dycom family company.
          </span>
          <Link href="/" className="font-semibold text-[var(--accent)] hover:underline">
            View the full Dycom network →
          </Link>
        </div>
      </footer>
    </div>
  );
}
