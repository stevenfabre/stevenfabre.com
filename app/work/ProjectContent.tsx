import BeforeAfter from "./BeforeAfter";
import { ProjectTextPreviews, renderProjectText } from "./ProjectText";
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
    <ProjectTextPreviews>
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
              style={
                { viewTransitionName: `film-${film.file}` } as CSSProperties
              }
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

          <figcaption className="mx-auto mt-16 w-full max-w-[var(--caption-width)] leading-relaxed md:grid md:grid-cols-[180px_minmax(0,1fr)] md:items-start md:gap-x-8 max-[520px]:w-[calc(100%-8px)]">
            <div className="@container text-lg text-[var(--muted)] text-pretty md:col-start-2 md:row-start-1">
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
              className="mt-8 text-sm leading-relaxed text-[var(--muted)] [&>p+p]:mt-0.5 md:sticky md:top-[calc(var(--bar-height)+24px)] md:self-start md:col-start-1 md:row-start-1 md:mt-0 md:pt-1 xl:pt-1.5"
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
            <Footer className="static mt-20 xl:mt-24 w-full bg-transparent backdrop-blur-none dark:bg-transparent md:col-start-2" />
          </figcaption>
        </figure>
      </div>
    </ProjectTextPreviews>
  );
}

// Project copy supports simple links to related work without a Markdown dependency.
