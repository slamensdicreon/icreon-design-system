import Link from "next/link";

interface HeroBlockProps {
  heading: string;
  subheading?: string;
  ctaText?: string;
  ctaLink?: string;
  backgroundImage?: { url?: { default?: string } };
  displaySettings?: Record<string, string>;
}

export default function HeroBlock({
  heading,
  subheading,
  ctaText,
  ctaLink,
  backgroundImage,
}: HeroBlockProps) {
  const bgUrl = backgroundImage?.url?.default;

  return (
    <section
      className="relative flex min-h-[500px] items-center justify-center bg-slate-900 px-6 py-24 text-white"
      style={
        bgUrl
          ? {
              backgroundImage: `url(${bgUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : undefined
      }
    >
      {bgUrl && (
        <div className="absolute inset-0 bg-black/50" aria-hidden="true" />
      )}
      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          {heading}
        </h1>
        {subheading && (
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300">
            {subheading}
          </p>
        )}
        {ctaText && ctaLink && (
          <div className="mt-10">
            <Link
              href={ctaLink}
              className="rounded-md bg-indigo-600 px-8 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              {ctaText}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
