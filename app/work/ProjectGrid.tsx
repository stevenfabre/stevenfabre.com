"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import {
  readVideoFrame,
  readVideoPlayback,
  clearVideoPlayback,
} from "../../src/utils/videoPlayback";
import type { Film } from "./work-data";
import styles from "./work.module.css";
import { useVideoFrameReady } from "../../src/hooks/useVideoFrameReady";
import WorkLink from "./WorkLink";
import ProjectImage from "./ProjectImage";

type Thumbnail = Pick<
  Film,
  | "slug"
  | "file"
  | "title"
  | "kind"
  | "imageExtension"
  | "imageAlt"
  | "aspectRatio"
  | "thumbnailPosition"
>;

function Video({ film, paused }: { film: Thumbnail; paused: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  const poster = useRef<HTMLImageElement>(null);
  const resume = useRef(true);
  useLayoutEffect(() => {
    const frame = readVideoFrame(film.file);
    if (frame && poster.current) poster.current.src = frame;
  }, [film.file]);
  const frameReady = useVideoFrameReady(ref, film.file);
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const playback = readVideoPlayback(film.file);
    let restoring = !!playback;
    if (playback) resume.current = playback.playing;
    let visible = false;
    const prepare = () => {
      if (video.preload === "none") {
        video.preload = "auto";
        video.load();
      }
    };
    const sync = () => {
      if (
        visible &&
        !paused &&
        !document.hidden &&
        !motion.matches &&
        !restoring &&
        resume.current &&
        !document.documentElement.hasAttribute("data-project-transition")
      ) {
        prepare();
        if (
          !video.loop &&
          (video.ended || video.currentTime >= video.duration - 0.02)
        )
          return;
        void video.play().catch(() => {});
      } else video.pause();
    };
    const restore = () => {
      if (!playback || !restoring) return;
      video.currentTime = Math.min(
        playback.time,
        video.duration || playback.time
      );
      clearVideoPlayback();
      restoring = false;
      sync();
    };
    if (playback) {
      if (video.readyState >= 1) restore();
      else {
        video.addEventListener("loadedmetadata", restore, { once: true });
        prepare();
      }
    }
    const transition = new MutationObserver(sync);
    transition.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-project-transition"],
    });
    video.addEventListener("seeked", sync);
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
      transition.disconnect();
      video.removeEventListener("loadedmetadata", restore);
      video.removeEventListener("seeked", sync);
      nearby.disconnect();
      document.removeEventListener("visibilitychange", sync);
      motion.removeEventListener("change", sync);
      video.pause();
    };
  }, [film.file, paused]);
  return (
    <>
      {/* An actual image survives video decoding and browser snapshots. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={poster}
        data-video-poster
        src={`/work/media/${film.file}.jpg`}
        alt=""
        decoding="async"
      />
      <video
        data-poster-video
        data-video-ready={frameReady || undefined}
        ref={ref}
        data-file={film.file}
        src={`/work/media/${film.file}.mp4`}
        poster={`/work/media/${film.file}.jpg`}
        muted
        loop={film.slug !== "building-liveblocks"}
        playsInline
        preload="none"
        aria-hidden="true"
      />
    </>
  );
}

function ProjectPreview({
  film,
  paused,
  onHover,
}: {
  film: Thumbnail;
  paused: boolean;
  onHover: (slug: string | null) => void;
}) {
  const figure = useRef<HTMLElement>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const image = figure.current?.querySelector("img");
    if (!image) return;
    let cancelled = false;
    const finish = () => {
      if (!cancelled) setLoading(false);
    };
    const reveal = () => {
      // Wait for decoded pixels, including when the image came from cache.
      void image
        .decode()
        .catch(() => {})
        .then(finish);
    };
    setLoading(true);
    if (image.complete) reveal();
    else {
      image.addEventListener("load", reveal);
      image.addEventListener("error", finish);
    }
    return () => {
      cancelled = true;
      image.removeEventListener("load", reveal);
      image.removeEventListener("error", finish);
    };
  }, [film.file]);

  return (
    <figure
      ref={figure}
      data-thumbnail-loading={loading || undefined}
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
        {film.kind ? (
          <ProjectImage film={film} loading="lazy" />
        ) : (
          <Video film={film} paused={paused} />
        )}
        <WorkLink
          href={`/work/${film.slug}`}
          className="absolute inset-0 cursor-pointer"
          aria-label={`View project: ${film.title}`}
        />
      </div>
    </figure>
  );
}

export default function ProjectGrid({ films }: { films: Thumbnail[] }) {
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
