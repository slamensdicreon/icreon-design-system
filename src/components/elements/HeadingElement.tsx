interface HeadingElementData {
  headingText?: string;
}

interface HeadingElementProps {
  content?: HeadingElementData;
  headingText?: string;
  displaySettings?: Record<string, string>;
}

export default function HeadingElement(props: HeadingElementProps) {
  const headingText = props.content?.headingText ?? props.headingText;
  if (!headingText) return null;

  return (
    <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
      {headingText}
    </h2>
  );
}
