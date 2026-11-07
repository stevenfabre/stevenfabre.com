import type { CSSProperties } from "react";
import cx from "../../src/utils/cx";
import BeforeAfter from "./BeforeAfter";
import ProjectImage from "./ProjectImage";
import ProjectVideo from "./ProjectVideo";
import type { ProjectVisual } from "./work-data";

export default function ProjectMedia({
  visual,
  preview = false,
  hero = false,
  autoLoop = true,
}: {
  visual: ProjectVisual;
  preview?: boolean;
  hero?: boolean;
  autoLoop?: boolean;
}) {
  return (
    <div
      className={cx(
        "relative overflow-hidden rounded-lg [&_video]:block [&_video]:size-full [&_video]:object-contain [&_img]:block [&_img]:size-full [&_img]:object-contain",
        hero
          ? "w-[min(100%,calc(var(--visual-height)*var(--film-ratio)),var(--media-width))] aspect-[var(--film-ratio)] bg-neutral-950 [view-transition-class:project] max-sm:rounded-md"
          : "aspect-[var(--gallery-ratio)] bg-black/3"
      )}
      data-work-visual
      style={{ viewTransitionName: `film-${visual.file}` } as CSSProperties}
    >
      {visual.comparison ? (
        <BeforeAfter visual={visual} />
      ) : visual.kind || preview ? (
        <ProjectImage film={visual} loading={hero ? undefined : "lazy"} />
      ) : (
        <ProjectVideo
          key={visual.file}
          film={visual}
          preload={hero ? "metadata" : "none"}
          autoLoop={autoLoop}
        />
      )}
      <span className="pointer-events-none absolute inset-0 z-1 rounded-[inherit] border border-black/10 dark:border-white/10" />
    </div>
  );
}
