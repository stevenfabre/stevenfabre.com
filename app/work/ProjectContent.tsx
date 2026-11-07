import Image from "next/image";
import HeadingLink from "../../src/components/HeadingLink";
import ProjectYouTube from "./ProjectYouTube";
import ProjectSlideshow from "./ProjectSlideshow";
import ResponsibilityIcon from "./ResponsibilityIcon";
import { ProjectTextPreviews, renderProjectText } from "./ProjectText";
import {
  type Film,
  type Slideshow,
  companies,
  companyDetails,
} from "./work-data";
import ProjectMedia from "./ProjectMedia";
import ProjectGallery from "./ProjectGallery";
import ExternalLink from "./ExternalLink";
import ButtonLink from "./../../src/components/ButtonLink";
import WorkIcon from "./WorkIcon";
import ViewOnX from "./ViewOnX";
import { getMediaDimensions } from "./media";
import Collaborators from "./Collaborators";
import Footer from "./../../src/components/Footer";
import { Fragment, type CSSProperties } from "react";

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
          <div className="mx-auto grid h-[var(--visual-height)] w-full items-center justify-items-center max-md:max-w-lg">
            <ProjectMedia
              visual={film}
              preview={preview}
              hero
              autoLoop={film.autoLoop}
            />
          </div>

          <figcaption className="mx-auto mt-16 w-full max-w-lg md:max-w-2xl xl:max-w-4xl leading-relaxed md:grid md:grid-cols-4 md:items-start md:gap-x-8">
            <div className="@container text-lg text-neutral-500 dark:text-neutral-400 text-pretty md:col-span-3 md:col-start-2 md:row-start-1">
              <h1 className="mb-4 text-lg font-semibold leading-relaxed text-neutral-900 dark:text-neutral-100 xl:text-xl">
                {film.title}
              </h1>
              <p>{renderProjectText(film.introduction)}</p>
              {film.paragraphs?.map((paragraph, index) => (
                <Fragment key={paragraph}>
                  {film.youtube &&
                    index === (film.paragraphs?.length ?? 0) - 1 && (
                      <figure className="mt-8">
                        {preview ? (
                          // Swipe neighbors are inert visual copies, never active players.
                          <div className="aspect-video w-full" />
                        ) : (
                          <ProjectYouTube {...film.youtube} />
                        )}
                        <figcaption className="mt-3 text-sm text-neutral-500 dark:text-neutral-400">
                          <HeadingLink
                            iconSize={12}
                            className="[--link-arrow-opacity:1] opacity-70 transition-colors hover:text-neutral-950 hover:opacity-100 focus-visible:text-neutral-950 focus-visible:opacity-100 dark:hover:text-neutral-50 dark:focus-visible:text-neutral-50"
                            href={`https://www.youtube.com/watch?v=${film.youtube.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {film.youtube.title}
                          </HeadingLink>
                        </figcaption>
                      </figure>
                    )}
                  <p className="mt-6">{renderProjectText(paragraph)}</p>
                  {film.slideshow &&
                    film.slideshowAfterParagraph === index + 2 && (
                      <SlideshowContent
                        slideshow={film.slideshow}
                        preview={preview}
                      />
                    )}
                </Fragment>
              ))}
              {film.contribution && <p className="mt-6">{film.contribution}</p>}
              <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3 empty:hidden">
                {film.source && <ViewOnX href={film.source} />}
                {film.links?.map((link) => (
                  <ButtonLink
                    key={link.href}
                    appearance="raised"
                    compact
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    iconPosition="end"
                    className="[&_svg]:size-3.5"
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
              {film.afterGalleryParagraphs?.map((paragraph) => (
                <p key={paragraph} className="mt-6">
                  {renderProjectText(paragraph)}
                </p>
              ))}
              {film.slideshow && film.slideshowAfterParagraph == null && (
                <SlideshowContent
                  slideshow={film.slideshow}
                  preview={preview}
                />
              )}
              {film.collaborators && (
                <Collaborators people={film.collaborators} />
              )}
            </div>
            <aside
              className="mt-8 grid grid-cols-2 items-start gap-8 border-t border-black/10 pt-5 text-sm leading-relaxed text-neutral-500 dark:text-neutral-400 dark:border-white/10 md:block md:border-0 md:sticky md:top-22 md:self-start md:col-start-1 md:row-start-1 md:mt-0 md:pt-1 xl:pt-1.5"
              aria-label="Project credits"
            >
              <div className="min-w-0 grid gap-1">
                <p className="flex items-center font-medium text-neutral-900 dark:text-neutral-100">
                  <ExternalLink
                    href={company.url}
                    iconSize={13}
                    className="gap-1"
                  >
                    {company.name}
                  </ExternalLink>
                </p>
                <p>{companyDetails[company.id].role}</p>
                <p className="opacity-70">{film.year}</p>
              </div>
              {film.contributions.length > 0 && (
                <ul
                  className="min-w-0 grid gap-1 md:mt-5"
                  aria-label="My contributions"
                >
                  {film.contributions.map((contribution) => (
                    <li
                      key={contribution}
                      className="flex items-center gap-1.5"
                    >
                      <ResponsibilityIcon name={contribution} />
                      <span>{contribution}</span>
                    </li>
                  ))}
                </ul>
              )}
            </aside>
            <Footer className="static mt-20 xl:mt-24 w-full bg-transparent backdrop-blur-none dark:bg-transparent md:col-start-2" />
          </figcaption>
        </figure>
      </div>
    </ProjectTextPreviews>
  );
}

// Swipe neighbors need a still frame, not another running gallery.
function SlideshowContent({
  slideshow,
  preview,
}: {
  slideshow: Slideshow;
  preview: boolean;
}) {
  if (!preview) return <ProjectSlideshow {...slideshow} />;
  const image = slideshow.images[0];
  if (!image) return null;
  return (
    <figure className="mt-8">
      <div
        className={`relative overflow-hidden rounded-lg ${
          slideshow.thumbnails ? "aspect-[3/2]" : "aspect-[65/32]"
        }`}
      >
        <Image
          src={image.src}
          alt=""
          fill
          sizes="(min-width: 1280px) 704px, (min-width: 768px) 480px, 100vw"
          className={slideshow.thumbnails ? "object-cover" : "object-contain"}
        />
        <span className="pointer-events-none absolute inset-0 rounded-[inherit] border border-black/10 dark:border-white/10" />
      </div>
      <figcaption className="mt-3 truncate text-sm leading-relaxed text-neutral-500 dark:text-neutral-400 opacity-70">
        {image.caption ?? slideshow.caption}
      </figcaption>
    </figure>
  );
}
