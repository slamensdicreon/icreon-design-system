interface OdpEmbedBlockProps {
  ContentId?: string;
  displaySettings?: Record<string, string>;
}

export default function OdpEmbedBlock({ ContentId }: OdpEmbedBlockProps) {
  if (!ContentId) {
    return (
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 text-center">
        <p className="text-sm text-slate-500">Embedded form</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-slate-200 p-6">
      <p className="text-sm text-slate-500">
        Optimizely Data Platform Embed: {ContentId}
      </p>
    </div>
  );
}
