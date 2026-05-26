interface ParagraphElementData {
  text?: { html?: string };
}

interface ParagraphElementProps {
  content?: ParagraphElementData;
  text?: { html?: string };
  displaySettings?: Record<string, string>;
}

export default function ParagraphElement(props: ParagraphElementProps) {
  const html = props.content?.text?.html ?? props.text?.html;
  if (!html) return null;

  return (
    <div
      className="prose prose-slate max-w-none text-slate-600"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
