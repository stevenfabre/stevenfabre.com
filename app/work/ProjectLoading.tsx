"use client";

import { useParams } from "next/navigation";
import ProjectNavigation from "./ProjectNavigation";
import ProjectPage from "./ProjectPage";
import ProjectFooter from "./ProjectFooter";
import { projectCaptionStyles } from "./projectCaptionStyles";

type Project = {
  slug: string;
  title: string;
  introduction: string;
  company: string;
  role: string;
  year: string;
  contributions: string[];
};

// Text metrics cross the client boundary; galleries and media stay on the server.
export default function ProjectLoading({ projects }: { projects: Project[] }) {
  const { slug } = useParams<{ slug: string }>();
  const index = projects.findIndex((project) => project.slug === slug);
  const project = projects[index];

  return (
    <ProjectPage aria-busy="true">
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
        {project && (
          <div aria-hidden="true" className={projectCaptionStyles.layout}>
            <div className={projectCaptionStyles.body}>
              <div data-loading-title className={projectCaptionStyles.title}>
                <SkeletonText text={project.title} />
              </div>
              <p data-loading-introduction>
                <SkeletonText text={project.introduction} />
              </p>
            </div>
            {/* On mobile, credits follow the full article and galleries below the fold. */}
            <div
              data-loading-info
              className={`${projectCaptionStyles.credits} hidden md:block`}
            >
              <div className="grid gap-1">
                <p className="font-medium text-neutral-900 dark:text-neutral-100">
                  <SkeletonText text={project.company} />
                </p>
                <p>
                  <SkeletonText text={project.role} />
                </p>
                <p className="opacity-70">
                  <SkeletonText text={project.year} />
                </p>
              </div>
              <ul className="mt-5 grid gap-1">
                {project.contributions.map((contribution) => (
                  <li key={contribution} className="flex items-center gap-1.5">
                    <span className="size-3 shrink-0" />
                    <SkeletonText text={contribution} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
        <span role="status" className="sr-only">
          Loading project…
        </span>
      </main>
      <ProjectFooter />
    </ProjectPage>
  );
}

// Invisible real text preserves glyph widths, wrapping, and line boxes exactly.
function SkeletonText({ text }: { text: string }) {
  return (
    <span className="skeleton-shimmer text-transparent [box-decoration-break:clone] bg-[linear-gradient(transparent_35%,rgb(115_115_115/0.1)_35%,rgb(115_115_115/0.1)_80%,transparent_80%)]">
      {text}
    </span>
  );
}
