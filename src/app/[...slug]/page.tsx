import { notFound } from "next/navigation";
import { getOptimizelyClient } from "@/lib/optimizely";
import { OptimizelyComponent } from "@optimizely/cms-sdk/react/server";

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export default async function CmsPage({ params }: PageProps) {
  const { slug } = await params;
  const urlPath = `/${slug.join("/")}`;

  try {
    const client = getOptimizelyClient();
    const content = await client.getContentByPath(urlPath);

    if (!content || (Array.isArray(content) && content.length === 0)) {
      notFound();
    }

    const pageContent = Array.isArray(content) ? content[0] : content;

    return (
      <div>
        <OptimizelyComponent content={pageContent} />
      </div>
    );
  } catch {
    notFound();
  }
}
