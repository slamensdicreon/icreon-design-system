interface RichTextElementProps {
  text?: { html?: string };
  displaySettings?: Record<string, string>;
}

export default function RichTextElement({ text }: RichTextElementProps) {
  if (!text?.html) return null;

  return (
    <div
      className="prose prose-slate max-w-none"
      dangerouslySetInnerHTML={{ __html: text.html }}
    />
  );
}
