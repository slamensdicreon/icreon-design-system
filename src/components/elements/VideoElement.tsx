interface VideoElementData {
  title?: string;
  video?: { url?: { default?: string } };
  placeholder?: { url?: { default?: string } };
}

interface VideoElementProps {
  content?: VideoElementData;
  title?: string;
  video?: { url?: { default?: string } };
  placeholder?: { url?: { default?: string } };
  displaySettings?: Record<string, string>;
}

export default function VideoElement(props: VideoElementProps) {
  const title = props.content?.title ?? props.title;
  const videoUrl =
    props.content?.video?.url?.default ?? props.video?.url?.default;
  const posterUrl =
    props.content?.placeholder?.url?.default ??
    props.placeholder?.url?.default;

  if (!videoUrl) return null;

  return (
    <div className="relative w-full overflow-hidden rounded-lg">
      <video controls poster={posterUrl} className="h-auto w-full" title={title}>
        <source src={videoUrl} />
      </video>
    </div>
  );
}
