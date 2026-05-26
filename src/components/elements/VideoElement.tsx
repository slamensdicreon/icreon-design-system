interface VideoElementProps {
  title?: string;
  video?: { url?: { default?: string } };
  placeholder?: { url?: { default?: string } };
  displaySettings?: Record<string, string>;
}

export default function VideoElement({
  title,
  video,
  placeholder,
}: VideoElementProps) {
  const videoUrl = video?.url?.default;
  const posterUrl = placeholder?.url?.default;

  if (!videoUrl) return null;

  return (
    <div className="relative w-full overflow-hidden rounded-lg">
      <video
        controls
        poster={posterUrl}
        className="h-auto w-full"
        title={title}
      >
        <source src={videoUrl} />
      </video>
    </div>
  );
}
