import dimensions from "./media-dimensions.json";
import type { ProjectVisual } from "./work-data";

// Measured from the local originals, rather than social-media aspect ratios.
// These dimensions cap detail visuals at their native resolution.
export function getMediaDimensions({ file }: Pick<ProjectVisual, "file">) {
  const size = dimensions[file as keyof typeof dimensions];
  if (!size || size.width <= 0 || size.height <= 0) {
    throw new Error(`Missing original media dimensions for ${file}`);
  }
  return size;
}
