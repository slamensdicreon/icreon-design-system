import { RichText } from "@optimizely/cms-sdk/react/richText";
import type { ReactNode } from "react";

type RichTextContent = Parameters<typeof RichText>[0]["content"];

interface TextBlockProps {
  heading?: string;
  body: RichTextContent | ReactNode;
  displaySettings?: Record<string, string>;
}

function isRichTextContent(value: unknown): value is RichTextContent {
  return (
    typeof value === "object" &&
    value !== null &&
    "type" in value &&
    (value as { type: string }).type === "richText"
  );
}

export default function TextBlock({ heading, body }: TextBlockProps) {
  return (
    <section className="px-6 py-12">
      <div className="mx-auto max-w-3xl">
        {heading && (
          <h2 className="mb-6 text-3xl font-bold tracking-tight text-slate-900">
            {heading}
          </h2>
        )}
        <div className="prose prose-slate max-w-none">
          {isRichTextContent(body) ? <RichText content={body} /> : body}
        </div>
      </div>
    </section>
  );
}
