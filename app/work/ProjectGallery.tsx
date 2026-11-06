import cx from "../../src/utils/cx";
import BeforeAfter from "./BeforeAfter";
import type { ProjectVisual } from "./work-data";
import type { CSSProperties } from "react";
import ProjectImage from "./ProjectImage";
import ProjectVideo from "./ProjectVideo";
import ViewOnX from "./ViewOnX";
import SocialPostCard from "./SocialPostCard";
import { getMediaDimensions } from "./media";
import styles from "./detail.module.css";

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
    "m-0 min-w-0 justify-self-center scroll-mt-[calc(var(--bar-height)+24px)]",
    hasPosts
      ? "w-full"
      : "w-[min(100%,calc(80svh*var(--gallery-ratio)),var(--media-width))] last:odd:col-span-full"
  );
  return (
    <section
      className={cx(
        "mt-12 grid w-full grid-cols-1 @2xl:grid-cols-2 gap-x-6 gap-y-12 max-[520px]:mt-10 max-[520px]:grid-cols-1 max-[520px]:gap-8",
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
        const media = (
          <div
            className={styles.galleryMedia}
            data-work-visual
            style={
              { viewTransitionName: `film-${visual.file}` } as CSSProperties
            }
          >
            {visual.comparison ? (
              <BeforeAfter visual={visual} />
            ) : visual.kind || preview ? (
              <ProjectImage film={visual} loading="lazy" />
            ) : (
              <ProjectVideo film={visual} preload="none" />
            )}
          </div>
        );
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
            <figcaption className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
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
