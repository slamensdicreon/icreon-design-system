import Image from "next/image";

interface HeroBlockProps {
  Heading?: string;
  SubHeading?: string;
  Eyebrow?: string;
  HeroColor?: string;
  HeroImage?: { url?: { default?: string } };
  HeroButton?: { ButtonText?: string; ButtonUrl?: { default?: string }; ButtonVariant?: string };
  Description?: { html?: string };
  Icon?: string;
  displaySettings?: Record<string, string>;
  // Also accept lowercase props for static usage
  heading?: string;
  subheading?: string;
  ctaText?: string;
  ctaLink?: string;
}

export default function HeroBlock(props: HeroBlockProps) {
  const heading = props.Heading || props.heading;
  const subheading = props.SubHeading || props.subheading;
  const eyebrow = props.Eyebrow;
  const heroColor = props.HeroColor || "dark";
  const imgUrl = props.HeroImage?.url?.default;
  const buttonText = props.HeroButton?.ButtonText || props.ctaText;
  const buttonUrl = props.HeroButton?.ButtonUrl?.default || props.ctaLink;
  const description = props.Description?.html;

  const isDark = heroColor === "dark" || heroColor === "Dark";

  return (
    <section
      className={`relative flex min-h-[500px] items-center justify-center px-6 py-24 ${
        isDark ? "bg-slate-900 text-white" : "bg-white text-slate-900"
      }`}
    >
      {imgUrl && (
        <>
          <Image
            src={imgUrl}
            alt={heading || ""}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50" aria-hidden="true" />
        </>
      )}
      <div className="relative z-10 mx-auto max-w-4xl text-center">
        {eyebrow && (
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-indigo-400">
            {eyebrow}
          </p>
        )}
        {heading && (
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            {heading}
          </h1>
        )}
        {subheading && (
          <p
            className={`mx-auto mt-6 max-w-2xl text-lg ${
              isDark ? "text-slate-300" : "text-slate-600"
            }`}
          >
            {subheading}
          </p>
        )}
        {description && (
          <div
            className={`mx-auto mt-6 max-w-2xl text-lg ${
              isDark ? "text-slate-300" : "text-slate-600"
            }`}
            dangerouslySetInnerHTML={{ __html: description }}
          />
        )}
        {buttonText && buttonUrl && (
          <div className="mt-10">
            <a
              href={buttonUrl}
              className="rounded-md bg-indigo-600 px-8 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500"
            >
              {buttonText}
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
