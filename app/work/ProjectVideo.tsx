"use client";

import { useEffect, useRef, useState } from "react";
import { useVideoFrameReady } from "../../src/hooks/useVideoFrameReady";
import WorkIcon from "./WorkIcon";
import type { ProjectVisual } from "./work-data";
import { getMediaDimensions } from "./media";
import playerStyles from "./ProjectVideo.module.css";

type PreviewPlayback = {
  file: string;
  time: number;
  playing: boolean;
  savedAt: number;
};

function getPreviewPlayback(file: string): PreviewPlayback | null {
  try {
    const saved = sessionStorage.getItem("work-playback");
    if (!saved) return null;
    const playback = JSON.parse(saved) as PreviewPlayback;
    return playback.file === file &&
      Number.isFinite(playback.time) &&
      playback.time >= 0 &&
      Date.now() - playback.savedAt < 15000
      ? playback
      : null;
  } catch {
    return null;
  }
}

export default function ProjectVideo({
  film,
  preload = "metadata",
  autoLoop = true,
}: {
  film: ProjectVisual;
  preload?: "metadata" | "none";
  autoLoop?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const frameReady = useVideoFrameReady(ref, film.file);
  const progressRef = useRef<HTMLInputElement>(null);
  const manuallyPaused = useRef(false);
  const soundPreferenceReady = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const togglePlay = () => {
    const video = ref.current;
    if (!video) return;
    manuallyPaused.current = !video.paused;
    if (video.paused) void video.play().catch(() => {});
    else video.pause();
  };
  const fullscreen = () => {
    const video = ref.current as
      | (HTMLVideoElement & { webkitEnterFullscreen?: () => void })
      | null;
    if (!video) return;
    video.controls = true;
    if (video.webkitEnterFullscreen) video.webkitEnterFullscreen();
    else if (video.requestFullscreen)
      void video.requestFullscreen().catch(() => {
        video.controls = false;
      });
    else {
      void video.play().catch(() => {});
    }
  };
  const formatTime = (seconds: number) =>
    `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(
      2,
      "0"
    )}`;
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const video = ref.current;
    const progress = progressRef.current;
    if (!video || !progress) return;
    let frame = 0;
    const updateProgress = () => {
      const length = Number.isFinite(video.duration) ? video.duration : 0;
      // Set the range before its value, including when metadata was cached
      // before React attached its event handlers.
      progress.max = String(length);
      progress.value = String(video.currentTime);
      progress.style.setProperty(
        "--progress",
        `${length > 0 ? (video.currentTime / length) * 100 : 0}%`
      );
    };
    const tick = () => {
      updateProgress();
      frame = requestAnimationFrame(tick);
    };
    const sync = () => {
      updateProgress();
      setTime(Math.floor(video.currentTime));
      setDuration(Number.isFinite(video.duration) ? video.duration : 0);
      setPlaying(!video.paused && !video.ended);
      cancelAnimationFrame(frame);
      if (!video.paused && !video.ended) frame = requestAnimationFrame(tick);
    };
    const events = [
      "loadedmetadata",
      "durationchange",
      "timeupdate",
      "play",
      "pause",
      "ended",
      "seeked",
    ];
    events.forEach((event) => video.addEventListener(event, sync));
    sync();
    return () => {
      cancelAnimationFrame(frame);
      events.forEach((event) => video.removeEventListener(event, sync));
    };
  }, [film.file]);
  const { width, height } = getMediaDimensions(film);
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    try {
      video.muted = sessionStorage.getItem("work-video-muted") !== "false";
      setMuted(video.muted);
    } catch {
      // Keep the default when session storage is unavailable.
    }
    soundPreferenceReady.current = true;
    let cancelled = false;
    const playback = getPreviewPlayback(film.file);
    const restore = () => {
      if (!playback || cancelled) return;
      try {
        sessionStorage.removeItem("work-playback");
        video.currentTime = Math.min(
          playback.time,
          video.duration || playback.time
        );
        if (
          playback.playing &&
          !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
          !cancelled
        )
          void video.play().catch(() => {});
      } catch {
        /* Native playback controls remain available without storage. */
      }
    };
    if (video.readyState >= 1) restore();
    else if (playback) {
      video.addEventListener("loadedmetadata", restore, { once: true });
      // A preview click should resume immediately, even for a supporting clip.
      video.preload = "metadata";
      video.load();
    }
    let visible = false;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPlayback = () => {
      if (!visible || document.hidden || motion.matches) {
        video.pause();
      } else if (
        video.readyState >= 4 &&
        !manuallyPaused.current &&
        !video.ended
      ) {
        void video.play().catch(() => {});
      }
    };
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting && entry.intersectionRatio >= 0.25;
        syncPlayback();
      },
      { threshold: [0, 0.25] }
    );
    visibilityObserver.observe(video);
    video.addEventListener("canplaythrough", syncPlayback);
    motion.addEventListener("change", syncPlayback);
    const observer =
      preload === "none"
        ? new IntersectionObserver(
            ([entry]) => {
              if (!entry.isIntersecting) return;
              // Prepare visible controls without downloading every clip up front.
              if (video.preload === "none") {
                video.preload = "auto";
                video.load();
              }
              observer?.disconnect();
            },
            { rootMargin: "300px" }
          )
        : null;
    observer?.observe(video);
    const pauseWhenHidden = syncPlayback;
    const exitFullscreen = () => {
      if (!document.fullscreenElement) video.controls = false;
    };
    document.addEventListener("fullscreenchange", exitFullscreen);
    video.addEventListener("webkitendfullscreen", exitFullscreen);
    document.addEventListener("visibilitychange", pauseWhenHidden);
    return () => {
      cancelled = true;
      visibilityObserver.disconnect();
      video.removeEventListener("canplaythrough", syncPlayback);
      motion.removeEventListener("change", syncPlayback);
      document.removeEventListener("fullscreenchange", exitFullscreen);
      video.removeEventListener("webkitendfullscreen", exitFullscreen);
      video.removeEventListener("loadedmetadata", restore);
      observer?.disconnect();
      document.removeEventListener("visibilitychange", pauseWhenHidden);
      video.pause();
    };
  }, [film.file, preload]);
  return (
    <div className={playerStyles.player}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        data-video-poster
        src={`/work/media/${film.file}.jpg`}
        alt=""
        width={width}
        height={height}
        decoding="async"
      />
      <video
        data-poster-video
        data-video-ready={frameReady || undefined}
        ref={ref}
        data-file={film.file}
        src={`/work/media/${film.file}.mp4`}
        poster={`/work/media/${film.file}.jpg`}
        width={width}
        height={height}
        loop={autoLoop}
        muted={muted}
        onVolumeChange={(event) => {
          const nextMuted = event.currentTarget.muted;
          setMuted(nextMuted);
          if (soundPreferenceReady.current) {
            try {
              sessionStorage.setItem("work-video-muted", String(nextMuted));
            } catch {
              // Playback still works when session storage is unavailable.
            }
          }
        }}
        onClick={() => {
          if (window.matchMedia("(hover: none), (pointer: coarse)").matches)
            fullscreen();
          else togglePlay();
        }}
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === " " || event.key === "Enter") {
            event.preventDefault();
            togglePlay();
          }
        }}
        playsInline
        preload={preload === "none" ? "none" : "auto"}
        aria-label={film.title}
        onError={() => setFailed(true)}
      />
      <div
        className={playerStyles.controls}
        role="group"
        aria-label="Video controls"
      >
        <button
          type="button"
          onClick={togglePlay}
          aria-label={playing ? "Pause" : "Play"}
        >
          <WorkIcon name={playing ? "pause" : "play"} size={18} />
        </button>
        <span className="shrink-0 text-[11px] tabular-nums">
          {formatTime(time)} /{" "}
          {formatTime(Number.isFinite(duration) ? duration : 0)}
        </span>
        <input
          ref={progressRef}
          aria-label="Video progress"
          type="range"
          min={0}
          step={0.01}
          defaultValue={0}
          className={`${playerStyles.progress} min-w-0 flex-1 cursor-pointer`}
          onChange={(event) => {
            if (ref.current)
              ref.current.currentTime = Number(event.target.value);
          }}
        />
        <button
          type="button"
          aria-label={muted ? "Unmute" : "Mute"}
          onClick={() => {
            if (ref.current) ref.current.muted = !ref.current.muted;
          }}
        >
          <WorkIcon name={muted ? "volume-off" : "volume"} size={18} />
        </button>
        <button type="button" aria-label="Full screen" onClick={fullscreen}>
          <WorkIcon name="maximize" size={18} />
        </button>
      </div>
      {failed && (
        <p className="absolute inset-x-4 bottom-4 rounded-lg bg-neutral-900/90 p-3 text-xs text-white [&_a]:inline-flex [&_a]:items-center [&_a]:gap-2">
          The video couldn’t load.{" "}
          <a href={`/work/media/${film.file}.mp4`}>
            Open the video directly <WorkIcon name="arrow-up-right" size={14} />
          </a>
        </p>
      )}
    </div>
  );
}
