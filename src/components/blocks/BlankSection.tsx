import { OptimizelyGridSection } from "@optimizely/cms-sdk/react/server";

interface BlankSectionProps {
  nodes?: Array<Record<string, unknown>>;
  displayName?: string;
  displaySettings?: Record<string, string>;
}

export default function BlankSection({ nodes }: BlankSectionProps) {
  if (!nodes?.length) return null;

  return (
    <section className="px-6 py-12">
      <div className="mx-auto max-w-7xl">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <OptimizelyGridSection nodes={nodes as any} />
      </div>
    </section>
  );
}
