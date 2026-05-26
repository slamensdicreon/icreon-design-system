import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import Script from "next/script";
import { getExperienceByPath } from "@/lib/queries";
import CmsComposition from "@/components/shared/CmsComposition";

const cmsUrl = process.env.OPTIMIZELY_CMS_URL;

export default async function PreviewPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const params = await searchParams;
  const {
    key,
    locale,
    epieditmode,
    url: contentUrl,
    path: contentPath,
  } = params;

  if (epieditmode === "true" || epieditmode === "True") {
    const draft = await draftMode();
    draft.enable();
  }

  const targetPath = contentUrl || contentPath;
  if (targetPath) {
    redirect(targetPath);
  }

  if (!key && !targetPath) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-slate-500">
          Preview mode active. No content key or path provided.
        </p>
        {cmsUrl && (
          <Script
            src={`${cmsUrl}/ui/CMS/latest/clientresources/communicationinjector.js`}
            strategy="afterInteractive"
          />
        )}
      </div>
    );
  }

  const path = locale ? `/${locale}/` : "/en/";

  try {
    const experience = await getExperienceByPath(path);
    if (experience?.composition?.nodes) {
      return (
        <>
          {cmsUrl && (
            <Script
              src={`${cmsUrl}/ui/CMS/latest/clientresources/communicationinjector.js`}
              strategy="afterInteractive"
            />
          )}
          <CmsComposition nodes={experience.composition.nodes} />
        </>
      );
    }
  } catch {
    // fall through
  }

  redirect(path);
}
