import { notFound } from "next/navigation";
import { getOptimizelyClient } from "@/lib/optimizely";
import {
  OptimizelyComponent,
  OptimizelyComposition,
} from "@optimizely/cms-sdk/react/server";

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export default async function CmsPage({ params }: PageProps) {
  const { slug } = await params;
  const urlPath = `/${slug.join("/")}`;

  try {
    const client = getOptimizelyClient();
    const results = await client.getContentByPath(urlPath);

    if (!results || (Array.isArray(results) && results.length === 0)) {
      notFound();
    }

    const content = Array.isArray(results) ? results[0] : results;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const composition = (content as any)?.composition?.nodes;
    if (composition) {
      return <OptimizelyComposition nodes={composition} />;
    }

    return <OptimizelyComponent content={content} />;
  } catch {
    notFound();
  }
}
