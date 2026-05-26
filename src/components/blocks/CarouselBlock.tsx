import QuoteBlock from "./QuoteBlock";

interface QuoteItem {
  _metadata?: { types?: string[]; displayName?: string };
  QuoteText?: string;
  QuoteProfileName?: string;
  QuoteProfileLocation?: string;
  QuoteProfilePicture?: { url?: { default?: string } };
}

interface CarouselBlockProps {
  CarouselItemsContentArea?: QuoteItem[];
  displaySettings?: Record<string, string>;
}

export default function CarouselBlock({
  CarouselItemsContentArea,
}: CarouselBlockProps) {
  if (!CarouselItemsContentArea?.length) return null;

  return (
    <section className="bg-slate-50 px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {CarouselItemsContentArea.map((item, index) => (
            <QuoteBlock
              key={index}
              QuoteText={item.QuoteText}
              QuoteProfileName={
                item.QuoteProfileName || item._metadata?.displayName
              }
              QuoteProfileLocation={item.QuoteProfileLocation}
              QuoteProfilePicture={item.QuoteProfilePicture}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
