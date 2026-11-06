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
  const line = "rounded-sm bg-neutral-900/5 dark:bg-white/5";

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
        <div className="mx-auto mt-16 w-full max-w-[var(--caption-width)] lg:grid lg:grid-cols-[180px_minmax(0,1fr)] lg:items-start lg:gap-x-8 max-[520px]:w-[calc(100%-8px)]">
          <div aria-hidden="true" className="lg:col-start-2 lg:row-start-1">
            <div className="mb-4 flex h-7 items-center xl:h-8">
              <div className={`${line} h-4 w-44`} />
            </div>
            <div className="space-y-3 pt-1.5">
              <div className={`${line} h-4 w-full`} />
              <div className={`${line} h-4 w-full`} />
              <div className={`${line} h-4 w-3/4`} />
            </div>
          </div>
          <div
            aria-hidden="true"
            className="mt-8 space-y-2 lg:col-start-1 lg:row-start-1 lg:mt-0 lg:pt-1 xl:pt-1.5"
          >
            <div className={`${line} h-3.5 w-24`} />
            <div className={`${line} h-3.5 w-32`} />
            <div className={`${line} h-3.5 w-20`} />
          </div>
        </div>
        <span role="status" className="sr-only">
          Loading project…
        </span>
      </main>
    </div>
  );
}
