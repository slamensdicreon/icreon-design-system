import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CompaniesExplorer from "../../CompaniesExplorer";
import { companies, companySlug, findCompanyBySlug } from "../../types";

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
  return (
    <CompaniesExplorer mapboxToken={mapboxToken} perspectiveCompanyId={company.id} />
  );
}
