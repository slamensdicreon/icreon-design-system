import Link from "next/link";
import type { ReactNode } from "react";

interface CTABlockProps {
  heading: string;
  body?: ReactNode;
  primaryButtonText?: string;
  primaryButtonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  displaySettings?: Record<string, string>;
}

export default function CTABlock({
  heading,
  body,
  primaryButtonText,
  primaryButtonLink,
  secondaryButtonText,
  secondaryButtonLink,
}: CTABlockProps) {
  return (
    <section className="bg-indigo-50 px-6 py-16">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          {heading}
        </h2>
        {body && (
          <div className="mt-4 text-lg text-slate-600">{body}</div>
        )}
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          {primaryButtonText && primaryButtonLink && (
            <Link
              href={primaryButtonLink}
              className="rounded-md bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500"
            >
              {primaryButtonText}
            </Link>
          )}
          {secondaryButtonText && secondaryButtonLink && (
            <Link
              href={secondaryButtonLink}
              className="rounded-md border border-slate-300 bg-white px-6 py-3 text-base font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
            >
              {secondaryButtonText}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
