import type { Metadata } from "next";
import { notFound } from "next/navigation";
import NetworkExperience from "../../NetworkExperience";
import SubsidiaryChrome from "../../SubsidiaryChrome";
import { companies, companySlug, findCompanyBySlug } from "../../types";
import { SEED_JOBS } from "../../jobs";
import { companyTheme } from "../../themes";

export function generateStaticParams() {
  return companies.map((c) => ({ slug: companySlug(c) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const company = findCompanyBySlug(slug);
  if (!company) return { title: "Company not found" };
  return {
    title: `${company.name} — A Dycom Family Company`,
    description: `${company.name} is part of the Dycom family. Explore the full network and every open role across all of Dycom's companies.`,
  };
}

export default async function SubsidiarySite({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const company = findCompanyBySlug(slug);
  if (!company) notFound();

  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? "";
  const theme = companyTheme(company.id);
  const roleCount = SEED_JOBS.filter((j) => j.companyId === company.id).length;

  return (
    <SubsidiaryChrome company={company} theme={theme} roleCount={roleCount}>
      <NetworkExperience
        mapboxToken={mapboxToken}
        accent={theme}
        perspectiveCompanyId={company.id}
      />
    </SubsidiaryChrome>
  );
}
