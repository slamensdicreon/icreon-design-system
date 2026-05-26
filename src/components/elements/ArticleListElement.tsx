interface ArticleListElementData {
  articleListCount?: number;
  topics?: string;
}

interface ArticleListElementProps {
  content?: ArticleListElementData;
  articleListCount?: number;
  topics?: string;
  displaySettings?: Record<string, string>;
}

export default function ArticleListElement(props: ArticleListElementProps) {
  const count = props.content?.articleListCount ?? props.articleListCount;
  const topics = props.content?.topics ?? props.topics;

  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 text-center">
      <p className="text-sm text-slate-500">
        Article recommendations
        {topics && <span> &middot; {topics}</span>}
        {count && <span> &middot; {count} articles</span>}
      </p>
    </div>
  );
}
