import Image from "next/image";
import Link from "next/link";

interface CardBlockProps {
  title: string;
  description?: string;
  image?: { url?: { default?: string } };
  linkText?: string;
  linkUrl?: string;
  displaySettings?: Record<string, string>;
}

export default function CardBlock({
  title,
  description,
  image,
  linkText,
  linkUrl,
}: CardBlockProps) {
  const imgUrl = image?.url?.default;

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      {imgUrl && (
        <div className="relative h-48 w-full">
          <Image
            src={imgUrl}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        {description && (
          <p className="mt-2 flex-1 text-sm text-slate-600">{description}</p>
        )}
        {linkText && linkUrl && (
          <div className="mt-4">
            <Link
              href={linkUrl}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              {linkText} &rarr;
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
