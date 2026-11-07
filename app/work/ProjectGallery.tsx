import cx from "../../src/utils/cx";
import type { ProjectVisual } from "./work-data";
import type { CSSProperties } from "react";
import ProjectMedia from "./ProjectMedia";
import ViewOnX from "./ViewOnX";
import SocialPostCard from "./SocialPostCard";
import { getMediaDimensions } from "./media";

export default function ProjectGallery({
  visuals,
  layout = "grid",
  preview = false,
}: {
  visuals: ProjectVisual[];
  preview?: boolean;
  layout?: "grid" | "stack";
}) {
  const hasPosts = visuals.some((visual) => visual.post);
  const itemClass = cx(
    "m-0 min-w-0 justify-self-center scroll-mt-24 sm:scroll-mt-22",
    hasPosts
      ? "w-full"
      : "w-[min(100%,calc(80svh*var(--gallery-ratio)),var(--media-width))] last:odd:col-span-full"
  );
  return (
    <section
      className={cx(
        "mt-8 grid w-full grid-cols-1 @2xl:grid-cols-2 gap-x-6 gap-y-8 max-sm:grid-cols-1 max-sm:gap-8",
        layout === "stack" && "@2xl:grid-cols-1",
        hasPosts && "items-start gap-6"
      )}
      data-layout={layout}
      data-posts={hasPosts || undefined}
      aria-label="More from this project"
    >
      {visuals.map((visual) => {
        const { width, height } = getMediaDimensions(visual);
        const dimensions = {
          "--gallery-ratio": width / height,
          "--media-width": `${width}px`,
        } as CSSProperties;
        const media = <ProjectMedia visual={visual} preview={preview} />;
        if (visual.post && visual.source) {
          return (
            <SocialPostCard
              key={visual.file}
              id={preview ? undefined : `visual-${visual.file}`}
              className={itemClass}
              style={dimensions}
              post={visual.post}
              source={visual.source}
            >
              {media}
            </SocialPostCard>
          );
        }
        return (
          <figure
            id={preview ? undefined : `visual-${visual.file}`}
            className={itemClass}
            key={visual.file}
            style={dimensions}
          >
            {media}
            <figcaption className="mt-3 text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
              <p className="opacity-70">{visual.caption || visual.title}</p>
              {visual.source && (
                <div className="mt-2">
                  <ViewOnX href={visual.source} />
                </div>
              )}
            </figcaption>
          </figure>
        );
      })}
    </section>
  );
}
