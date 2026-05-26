interface ParagraphElementProps {
  text?: { html?: string };
  displaySettings?: Record<string, string>;
}

export default function ParagraphElement({ text }: ParagraphElementProps) {
  if (!text?.html) return null;

  return (
    <div
      className="prose prose-slate max-w-none text-slate-600"
      dangerouslySetInnerHTML={{ __html: text.html }}
    />
  );
}
