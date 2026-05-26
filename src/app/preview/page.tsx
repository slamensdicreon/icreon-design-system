import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

export default async function PreviewPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const params = await searchParams;
  const { key, locale, epieditmode } = params;

  if (!key) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-slate-500">No content key provided for preview.</p>
      </div>
    );
  }

  if (epieditmode === "true" || epieditmode === "True") {
    const draft = await draftMode();
    draft.enable();
  }

  const path = locale ? `/${locale}/` : "/en/";
  redirect(`${path}?preview=true&key=${key}`);
}
