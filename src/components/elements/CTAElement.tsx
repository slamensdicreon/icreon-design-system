import Link from "next/link";

interface CTAElementProps {
  Text?: string;
  Link?: { default?: string };
  displaySettings?: Record<string, string>;
}

export default function CTAElement({ Text: text, Link: link }: CTAElementProps) {
  if (!text || !link?.default) return null;

  return (
    <Link
      href={link.default}
      className="inline-flex items-center rounded-md bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
    >
      {text}
    </Link>
  );
}
