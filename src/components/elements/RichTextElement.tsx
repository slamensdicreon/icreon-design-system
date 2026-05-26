interface RichTextElementData {
  text?: { html?: string };
}

interface RichTextElementProps {
  content?: RichTextElementData;
  text?: { html?: string };
  displaySettings?: Record<string, string>;
}

export default function RichTextElement(props: RichTextElementProps) {
  const html = props.content?.text?.html ?? props.text?.html;
  if (!html) return null;

  return (
    <div
      className="prose prose-slate max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
