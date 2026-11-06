"use client";

import { useParams } from "next/navigation";
import ProjectNavigation from "./ProjectNavigation";
import styles from "./detail.module.css";

type Project = { slug: string; title: string };

// Only navigation labels cross the client boundary, not the project galleries.
export default function ProjectLoading({ projects }: { projects: Project[] }) {
  const { slug } = useParams<{ slug: string }>();
  const index = projects.findIndex((project) => project.slug === slug);
  const project = projects[index];

  return (
    <div className={styles.page} aria-busy="true">
      {project && (
        <ProjectNavigation
          slug={project.slug}
          index={index}
          total={projects.length}
          previous={projects[(index - 1 + projects.length) % projects.length]}
          next={projects[(index + 1) % projects.length]}
        />
      )}
      <main className="w-full flex-1">
        <div className="h-[var(--visual-height)]" aria-hidden="true" />
        <div className="mx-auto mt-16 w-full max-w-[var(--caption-width)] leading-relaxed md:grid md:grid-cols-[180px_minmax(0,1fr)] md:items-start md:gap-x-8 max-[520px]:w-[calc(100%-8px)]">
          <div
            aria-hidden="true"
            className="@container text-lg text-[var(--muted)] md:col-start-2 md:row-start-1"
          >
            <div className="mb-4 text-lg font-semibold leading-relaxed text-[var(--ink)] xl:text-xl">
              <SkeletonLine width="w-44" />
            </div>
            <div>
              <SkeletonLine />
              <SkeletonLine />
              <SkeletonLine width="w-3/4" />
            </div>
          </div>
          <div
            aria-hidden="true"
            className="mt-8 text-sm leading-relaxed text-[var(--muted)] [&>p+p]:mt-0.5 md:col-start-1 md:row-start-1 md:mt-0 md:pt-1 xl:pt-1.5"
          >
            <p className="font-medium text-[var(--ink)]">
              <SkeletonLine width="w-24" />
            </p>
            <p>
              <SkeletonLine width="w-32" />
            </p>
            <p className="opacity-70">
              <SkeletonLine width="w-20" />
            </p>
          </div>
        </div>
        <span role="status" className="sr-only">
          Loading project…
        </span>
      </main>
    </div>
  );
}

// A baseline-aligned 1ex rectangle matches the font's lowercase x-height.
// The zero-width space preserves the same line box as the eventual text.
function SkeletonLine({ width = "w-full" }: { width?: string }) {
  return (
    <span className="block">
      {"\u200b"}
      <span
        className={`skeleton-shimmer inline-block h-[1ex] align-baseline rounded-xs bg-current opacity-10 ${width}`}
      />
    </span>
  );
}
