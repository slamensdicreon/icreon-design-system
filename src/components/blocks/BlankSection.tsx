import { OptimizelyGridSection } from "@optimizely/cms-sdk/react/server";

interface BlankSectionProps {
  nodes?: Array<Record<string, unknown>>;
  displayName?: string;
  displaySettings?: Record<string, string>;
}

export default function BlankSection({ nodes, displaySettings }: BlankSectionProps) {
  if (!nodes?.length) return null;

  const bg = displaySettings?.background;
  const padding = displaySettings?.padding;

  return (
    <section
      className={[
        "px-6 py-12",
        bg === "dark" && "bg-slate-900 text-white",
        bg === "light" && "bg-slate-50",
        bg === "accent" && "bg-indigo-50",
        padding === "large" && "py-20",
        padding === "none" && "py-0",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="mx-auto max-w-7xl">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <OptimizelyGridSection nodes={nodes as any} />
      </div>
    </section>
  );
}
