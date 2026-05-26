import { notFound } from "next/navigation";
import { getExperienceByPath, getContentByPath } from "@/lib/queries";
import { OptimizelyComponent } from "@optimizely/cms-sdk/react/server";
import CmsComposition from "@/components/shared/CmsComposition";

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export default async function CmsPage({ params }: PageProps) {
  const { slug } = await params;
  const urlPath = `/${slug.join("/")}`;

  const pathsToTry = [urlPath, urlPath + "/", `/en${urlPath}`, `/en${urlPath}/`];

  for (const path of pathsToTry) {
    try {
      const experience = await getExperienceByPath(path);
      if (experience?.composition?.nodes) {
        return <CmsComposition nodes={experience.composition.nodes} />;
      }
    } catch {
      // try next path
    }
  }

  try {
    const results = await getContentByPath(urlPath);
    if (!results || (Array.isArray(results) && results.length === 0)) {
      notFound();
    }
    const content = Array.isArray(results) ? results[0] : results;
    return <OptimizelyComponent content={content} />;
  } catch {
    notFound();
  }
}
