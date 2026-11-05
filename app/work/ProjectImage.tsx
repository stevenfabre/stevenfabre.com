import { imagePath, type ProjectVisual } from "./work-data";
import { getMediaDimensions } from "./media";

export default function ProjectImage({
  film,
  loading,
}: {
  film: ProjectVisual;
  loading?: "lazy" | "eager";
}) {
  const { width, height } = getMediaDimensions(film);
  // Preserve the original dimensions and share the same asset with thumbnails.
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={imagePath(film)}
      alt={film.imageAlt || film.title}
      width={width}
      height={height}
      decoding="async"
      loading={loading}
    />
  );
}
