interface QuoteItem {
  _metadata?: {
    types?: string[];
    displayName?: string;
  };
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
            <div
              key={index}
              className="rounded-lg bg-white p-6 shadow-sm"
            >
              <div className="mb-4 text-4xl text-indigo-300">&ldquo;</div>
              <p className="text-sm text-slate-600">
                {item._metadata?.displayName}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
