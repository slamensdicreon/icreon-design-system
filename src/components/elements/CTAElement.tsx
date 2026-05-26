import Link from "next/link";

interface CTAElementData {
  Text?: string;
  Link?: { default?: string };
}

interface CTAElementProps {
  content?: CTAElementData;
  Text?: string;
  Link?: { default?: string };
  displaySettings?: Record<string, string>;
}

export default function CTAElement(props: CTAElementProps) {
  const text = props.content?.Text ?? props.Text;
  const link = props.content?.Link ?? props.Link;

  if (!text || !link?.default) return null;

  return (
    <Link
      href={link.default}
      className="inline-flex items-center rounded-md bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500"
    >
      {text}
    </Link>
  );
}
