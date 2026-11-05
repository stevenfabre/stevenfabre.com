"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import styles from "./work.module.css";
import { SiteLink } from "../../src/components/SiteNavigation";

import { companies, companyDetails, allFilms, type Film } from "./work-data";
import Footer from "../../src/components/Footer";
import WorkLink from "./WorkLink";
import ProjectImage from "./ProjectImage";
import ExternalLink from "./ExternalLink";

function Video({ film, paused }: { film: Film; paused: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    const prepare = () => {
      if (!video.getAttribute("src")) {
        video.preload = "auto";
        video.src = `/work/media/${film.file}.mp4`;
        video.load();
      }
    };
    const sync = () => {
      if (visible && !paused && !document.hidden && !motion.matches) {
        prepare();
        if (!video.loop && video.ended) return;
        void video.play().catch(() => {});
      } else video.pause();
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting && entry.intersectionRatio >= 0.25;
        sync();
      },
      { threshold: 0.25 }
    );
    const pane = video.closest("[data-site-content]");
    const root =
      pane && /auto|scroll/.test(getComputedStyle(pane).overflowY)
        ? pane
        : null;
    const nearby = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          prepare();
          nearby.disconnect();
        }
      },
      { root, rootMargin: "600px" }
    );
    nearby.observe(video);
    observer.observe(video);
    document.addEventListener("visibilitychange", sync);
    motion.addEventListener("change", sync);
    return () => {
      observer.disconnect();
      nearby.disconnect();
      document.removeEventListener("visibilitychange", sync);
      motion.removeEventListener("change", sync);
      video.pause();
    };
  }, [film.file, paused]);
  return (
    <div
      className={styles.video}
      data-work-visual
      style={
        {
          viewTransitionName: `film-${film.file}`,
          "--film-ratio": film.aspectRatio,
          "--thumbnail-position": film.thumbnailPosition,
        } as CSSProperties
      }
    >
      <video
        ref={ref}
        data-file={film.file}
        poster={`/work/media/${film.file}.jpg`}
        muted
        loop={film.slug !== "building-liveblocks"}
        playsInline
        preload="none"
        aria-label={`${film.title} — silent preview`}
      />
      <WorkLink
        className="absolute inset-0 cursor-pointer"
        href={`/work/${film.slug}`}
        aria-label={`View project: ${film.title}`}
      />
    </div>
  );
}

function ProjectPreview({
  film,
  paused,
  onHover,
}: {
  film: Film;
  paused: boolean;
  onHover: (slug: string | null) => void;
}) {
  return (
    <figure
      id={`project-${film.slug}`}
      className={styles.project}
      aria-label={film.title}
      onPointerEnter={(event) => {
        if (
          event.pointerType !== "touch" &&
          window.matchMedia("(hover: hover) and (pointer: fine)").matches
        )
          onHover(film.slug);
      }}
      onPointerLeave={() => onHover(null)}
    >
      {film.kind ? (
        <div
          className={styles.video}
          data-work-visual
          style={
            {
              viewTransitionName: `film-${film.file}`,
              "--film-ratio": film.aspectRatio,
              "--thumbnail-position": film.thumbnailPosition,
            } as CSSProperties
          }
        >
          <ProjectImage film={film} loading="lazy" />
          <WorkLink
            href={`/work/${film.slug}`}
            className="absolute inset-0 cursor-pointer"
            aria-label={`View project: ${film.title}`}
          />
        </div>
      ) : (
        <Video film={film} paused={paused} />
      )}
    </figure>
  );
}

function ProjectGrid({ films }: { films: Film[] }) {
  const [hovered, setHovered] = useState<string | null>(null);
  return (
    <div className={styles.projectList} onPointerLeave={() => setHovered(null)}>
      {films.map((film) => (
        <ProjectPreview
          key={film.slug}
          film={film}
          paused={hovered !== null && hovered !== film.slug}
          onHover={setHovered}
        />
      ))}
    </div>
  );
}

export default function WorkPortfolio() {
  useEffect(() => {
    // Restore deep links inside the independently scrolling content column.
    if (!window.location.hash) return;
    // Closing a project restores the exact overview position, which may have
    // moved since the URL's original fragment was opened.
    if (history.state?.portfolioScroll?.pathname === "/work") return;
    try {
      document
        .getElementById(decodeURIComponent(window.location.hash.slice(1)))
        ?.scrollIntoView({ behavior: "instant", block: "start" });
    } catch {
      // Invalid fragments leave the gallery at its normal starting position.
    }
  }, []);

  return (
    <main
      className="relative min-w-0 self-start pt-24 sm:pt-28 lg:pt-32 xl:pt-44 @container/content w-full max-w-lg xl:max-w-3xl px-4 xl:px-8 mx-auto"
      id="content"
    >
      <div id="top" className="absolute top-0" />
      <header className="pb-[52px]">
        <h1 className="text-balance text-3xl tracking-tight font-semibold text-neutral-900 @sm/content:text-4xl @sm/content:tracking-tight dark:text-neutral-100 @xl/content:text-6xl @xl/content:tracking-tight">
          <SiteLink
            href="/"
            className="rounded-sm text-neutral-400 transition-colors duration-150 hover:text-neutral-900 focus-visible:text-neutral-900 focus-visible:outline-2 focus-visible:outline-offset-4 dark:text-neutral-500 dark:hover:text-neutral-100 dark:focus-visible:text-neutral-100"
          >
            Steven Fabre
          </SiteLink>{" "}
          <span className="text-neutral-400 dark:text-neutral-500">/</span> Work
        </h1>
        <p className="text-pretty text-lg leading-relaxed mt-8 xl:mt-10 @xl/content:text-xl @xl/content:leading-relaxed">
          I’ve spent 20 years designing and building products. I love figuring
          out what’s worth making, getting the details right, and building the
          teams and systems that help others do their best work.
        </p>
      </header>
      {companies.map((company) => (
        <section
          id={company.id}
          key={company.id}
          className="scroll-mt-16 md:scroll-mt-24 pb-11 md:pb-16"
        >
          <header className="mb-7">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-4">
              <h2 className="font-semibold text-lg leading-relaxed @xl/content:text-xl @xl/content:leading-relaxed text-neutral-900 dark:text-neutral-100">
                <ExternalLink href={company.url}>{company.name}</ExternalLink>
              </h2>
              <p className={styles.years}>{company.years}</p>
            </div>
            <p className={styles.role}>{companyDetails[company.id].role}</p>
            <p className="mt-5 text-base leading-[1.65] text-balance @xl/content:text-lg">
              {companyDetails[company.id].description}
            </p>
          </header>
          <ProjectGrid
            films={allFilms.filter((film) => film.company === company.id)}
          />
        </section>
      ))}
      <Footer />
    </main>
  );
}
