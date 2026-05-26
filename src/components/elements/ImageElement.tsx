import Image from "next/image";

interface ImageElementProps {
  altText?: string;
  imageLink?: { url?: { default?: string } };
  displaySettings?: Record<string, string>;
}

export default function ImageElement({
  altText,
  imageLink,
}: ImageElementProps) {
  const src = imageLink?.url?.default;
  if (!src) return null;

  return (
    <div className="relative w-full overflow-hidden rounded-lg">
      <Image
        src={src}
        alt={altText || ""}
        width={800}
        height={600}
        className="h-auto w-full object-cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
      />
    </div>
  );
}
