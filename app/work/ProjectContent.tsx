import BeforeAfter from "./BeforeAfter";
import Link from "next/link";
import { type Film, companies, companyDetails } from "./work-data";
import ProjectVideo from "./ProjectVideo";
import ProjectImage from "./ProjectImage";
import ProjectGallery from "./ProjectGallery";
import ExternalLink from "./ExternalLink";
import ButtonLink from "./../../src/components/ButtonLink";
import WorkIcon from "./WorkIcon";
import ViewOnX from "./ViewOnX";
import { getMediaDimensions } from "./media";
import Collaborators from "./Collaborators";
import Footer from "./../../src/components/Footer";
import styles from "./detail.module.css";
import type { CSSProperties } from "react";

export default function ProjectContent({
  film,
  preview = false,
}: {
  film: Film;
  preview?: boolean;
}) {
  const { width: visualWidth, height: visualHeight } = getMediaDimensions(film);
  const company = companies.find((company) => company.id === film.company)!;
  return (
    <div className="mx-auto w-full">
      <figure
        className="mx-auto w-full"
        style={
          {
            "--film-ratio": visualWidth / visualHeight,
            "--media-width": `${visualWidth}px`,
          } as CSSProperties
        }
      >
        <div className="grid h-[var(--visual-height)] items-center justify-items-center">
          <div
            className={styles.visual}
            data-work-visual
            style={{ viewTransitionName: `film-${film.file}` } as CSSProperties}
          >
            {film.comparison ? (
              <BeforeAfter visual={film} />
            ) : film.kind || preview ? (
              <ProjectImage film={film} />
            ) : (
              <ProjectVideo
                key={film.file}
                film={film}
                autoLoop={film.autoLoop ?? true}
              />
            )}
          </div>
        </div>

        <figcaption className="mx-auto mt-16 w-full max-w-[var(--caption-width)] leading-relaxed lg:grid lg:grid-cols-[180px_minmax(0,1fr)] lg:items-start lg:gap-x-8 max-[520px]:w-[calc(100%-8px)]">
          <div className="text-lg text-[var(--muted)] text-pretty lg:col-start-2 lg:row-start-1">
            <h1 className="mb-4 text-lg font-semibold leading-relaxed text-[var(--ink)] xl:text-xl">
              {film.title}
            </h1>
            <p>{renderProjectText(film.introduction)}</p>
            {film.paragraphs?.map((paragraph) => (
              <p key={paragraph} className="mt-6">
                {renderProjectText(paragraph)}
              </p>
            ))}
            {film.contribution && <p className="mt-6">{film.contribution}</p>}
            <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3 empty:hidden">
              {film.source && <ViewOnX href={film.source} />}
              {film.links?.map((link) => (
                <ButtonLink
                  key={link.href}
                  appearance="raised"
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  iconPosition="end"
                >
                  {link.label}
                  <WorkIcon name="arrow-up-right" />
                </ButtonLink>
              ))}
            </div>
            {film.gallery && (
              <ProjectGallery
                preview={preview}
                visuals={film.gallery}
                layout={film.galleryLayout}
              />
            )}
            {film.collaborators && (
              <Collaborators people={film.collaborators} />
            )}
          </div>
          <aside
            className="mt-8 text-sm leading-relaxed text-[var(--muted)] [&>p+p]:mt-0.5 lg:sticky lg:top-[calc(var(--bar-height)+24px)] lg:self-start lg:col-start-1 lg:row-start-1 lg:mt-0 lg:pt-1 xl:pt-1.5"
            aria-label="Project credits"
          >
            <p className="font-medium text-[var(--ink)]">
              <ExternalLink href={company.url} iconSize={13}>
                {company.name}
              </ExternalLink>
            </p>
            <p>{companyDetails[company.id].role}</p>
            <p className="opacity-70">{film.year}</p>
            <ul className="mt-5 grid gap-1" aria-label="My contributions">
              {film.contributions.map((contribution) => (
                <li key={contribution}>{contribution}</li>
              ))}
            </ul>
          </aside>
          <Footer className="static w-full bg-transparent backdrop-blur-none dark:bg-transparent lg:col-start-2" />
        </figcaption>
      </figure>
    </div>
  );
}

// Project copy supports simple links to related work without a Markdown dependency.
function renderProjectText(text: string) {
  return text.split(/(\[[^\]]+\]\(\/work\/[^)]+\))/g).map((part, index) => {
    const link = part.match(/^\[([^\]]+)\]\((\/work\/[^)]+)\)$/);
    return link ? (
      <Link
        key={index}
        href={link[2]}
        className="text-[var(--ink)] underline decoration-neutral-300 underline-offset-4 hover:decoration-current dark:decoration-neutral-600"
      >
        {link[1]}
      </Link>
    ) : (
      part
    );
  });
}
