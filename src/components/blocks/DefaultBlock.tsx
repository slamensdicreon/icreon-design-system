interface DefaultBlockProps {
  _metadata?: {
    types?: string[];
    displayName?: string;
  };
  [key: string]: unknown;
}

export default function DefaultBlock({ _metadata }: DefaultBlockProps) {
  const typeName = _metadata?.types?.[0] || "Unknown";
  const displayName = _metadata?.displayName || "";

  if (process.env.NODE_ENV === "production") return null;

  return (
    <div className="rounded-md border-2 border-dashed border-amber-300 bg-amber-50 p-4">
      <p className="text-sm font-medium text-amber-800">
        Unmapped component: <code>{typeName}</code>
      </p>
      {displayName && (
        <p className="mt-1 text-xs text-amber-600">{displayName}</p>
      )}
    </div>
  );
}
