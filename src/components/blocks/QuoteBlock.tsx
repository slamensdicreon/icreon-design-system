import Image from "next/image";

interface QuoteBlockProps {
  QuoteText?: string;
  QuoteProfileName?: string;
  QuoteProfileLocation?: string;
  QuoteProfilePicture?: { url?: { default?: string } };
  QuoteColor?: string;
  QuoteActive?: boolean;
  displaySettings?: Record<string, string>;
}

export default function QuoteBlock({
  QuoteText,
  QuoteProfileName,
  QuoteProfileLocation,
  QuoteProfilePicture,
}: QuoteBlockProps) {
  const imgUrl = QuoteProfilePicture?.url?.default;

  return (
    <div className="flex flex-col rounded-lg bg-white p-6 shadow-sm">
      <div className="mb-4 text-4xl leading-none text-indigo-300">&ldquo;</div>
      {QuoteText && (
        <p className="flex-1 text-sm leading-relaxed text-slate-600">
          {QuoteText}
        </p>
      )}
      <div className="mt-4 flex items-center gap-3">
        {imgUrl && (
          <Image
            src={imgUrl}
            alt={QuoteProfileName || ""}
            width={40}
            height={40}
            className="rounded-full object-cover"
          />
        )}
        <div>
          {QuoteProfileName && (
            <p className="text-sm font-semibold text-slate-900">
              {QuoteProfileName}
            </p>
          )}
          {QuoteProfileLocation && (
            <p className="text-xs text-slate-500">{QuoteProfileLocation}</p>
          )}
        </div>
      </div>
    </div>
  );
}
