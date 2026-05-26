import Image from "next/image";

interface BlogPostPageProps {
  Heading?: string;
  ArticleSubHeading?: string;
  BlogPostBody?: { html?: string };
  ArticleAuthor?: string;
  BlogPostPromoImage?: { url?: { default?: string } };
  Topic?: string;
  displaySettings?: Record<string, string>;
}

export default function BlogPostPage({
  Heading,
  ArticleSubHeading,
  BlogPostBody,
  ArticleAuthor,
  BlogPostPromoImage,
  Topic,
}: BlogPostPageProps) {
  const imgUrl = BlogPostPromoImage?.url?.default;

  return (
    <article className="mx-auto max-w-3xl px-6 py-12">
      {Topic && (
        <span className="mb-4 inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700">
          {Topic}
        </span>
      )}
      {Heading && (
        <h1 className="text-4xl font-bold tracking-tight text-slate-900">
          {Heading}
        </h1>
      )}
      {ArticleSubHeading && (
        <p className="mt-4 text-xl text-slate-600">{ArticleSubHeading}</p>
      )}
      {ArticleAuthor && (
        <p className="mt-4 text-sm text-slate-500">By {ArticleAuthor}</p>
      )}
      {imgUrl && (
        <div className="relative mt-8 h-80 w-full overflow-hidden rounded-lg">
          <Image
            src={imgUrl}
            alt={Heading || ""}
            fill
            className="object-cover"
          />
        </div>
      )}
      {BlogPostBody?.html && (
        <div
          className="prose prose-slate mt-8 max-w-none"
          dangerouslySetInnerHTML={{ __html: BlogPostBody.html }}
        />
      )}
    </article>
  );
}
