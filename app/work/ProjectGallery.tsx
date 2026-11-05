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
  return (
    <section
      className={styles.gallery}
      data-layout={layout}
      data-posts={visuals.some((visual) => visual.post) || undefined}
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
              className={styles.galleryItem}
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
            className={styles.galleryItem}
            key={visual.file}
            style={dimensions}
          >
            {media}
            <figcaption className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
              <p>{visual.caption || visual.title}</p>
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
