"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useVideoFrameReady } from "@/hooks/useVideoFrameReady";
import { registerNativeAudio } from "@/utils/mediaAudio";
import {
  readVideoPlayback,
  readVideoFrame,
  clearVideoPlayback,
} from "@/utils/videoPlayback";

const nativeControlsQuery =
  "(max-width: 767px), (hover: none), (pointer: coarse)";

// ProjectMedia keys the player by file, so every new video starts with fresh state.
export function useProjectVideo(file: string, preload: "metadata" | "none") {
  const ref = useRef<HTMLVideoElement>(null);
  const posterRef = useRef<HTMLImageElement>(null);
  const [nativeControls, setNativeControls] = useState(false);
  const [nativeControlsRevealed, setNativeControlsRevealed] = useState(false);
  const nativeControlsRequested = useRef(false);
  useLayoutEffect(() => {
    const query = window.matchMedia(nativeControlsQuery);
    const update = () => setNativeControls(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  useLayoutEffect(() => {
    const frame = readVideoFrame(file);
    if (frame && posterRef.current) posterRef.current.src = frame;
  }, [file]);
  const frameReady = useVideoFrameReady(ref, file);
  const progressRef = useRef<HTMLInputElement>(null);
  const manuallyPaused = useRef(false);
  const userRequestedPlayback = useRef(false);
  useEffect(() => {
    const video = ref.current;
    if (video) return registerNativeAudio(video);
  }, [file]);
  const [playing, setPlaying] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(false);
  const [muted, setMuted] = useState(true);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const togglePlay = () => {
    const video = ref.current;
    if (!video) return;
    userRequestedPlayback.current = true;
    setControlsVisible(true);
    manuallyPaused.current = !video.paused;
    if (video.paused) void video.play().catch(() => {});
    else video.pause();
  };
  const fullscreen = () => {
    const video = ref.current as
      | (HTMLVideoElement & { webkitEnterFullscreen?: () => void })
      | null;
    if (!video) return;
    userRequestedPlayback.current = true;
    manuallyPaused.current = false;
    video.controls = true;
    if (video.webkitEnterFullscreen) video.webkitEnterFullscreen();
    else if (video.requestFullscreen)
      void video.requestFullscreen().catch(() => {
        video.controls =
          window.matchMedia(nativeControlsQuery).matches &&
          nativeControlsRequested.current;
      });
    else {
      void video.play().catch(() => {});
    }
  };
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
  }, [file, nativeControls]);
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    let cancelled = false;
    const playback = readVideoPlayback(file);
    if (playback) manuallyPaused.current = !playback.playing;
    const restore = () => {
      if (!playback || cancelled) return;
      try {
        clearVideoPlayback();
        video.currentTime = Math.min(
          playback.time,
          video.duration || playback.time
        );
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
    let playPending = false;
    let automaticPauses = 0;
    const onNativePlay = () => {
      if (video.controls && !playPending) {
        userRequestedPlayback.current = true;
        manuallyPaused.current = false;
      }
    };
    const onNativePause = () => {
      if (automaticPauses > 0) automaticPauses--;
      else if (video.controls && !video.ended) manuallyPaused.current = true;
    };
    video.addEventListener("play", onNativePlay);
    video.addEventListener("pause", onNativePause);
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPlayback = () => {
      const fullscreen =
        document.fullscreenElement === video ||
        (video as HTMLVideoElement & { webkitDisplayingFullscreen?: boolean })
          .webkitDisplayingFullscreen;
      if (
        (!visible && !fullscreen) ||
        document.hidden ||
        (motion.matches && !userRequestedPlayback.current) ||
        document.documentElement.hasAttribute("data-project-transition")
      ) {
        // Native pause/seeking must not be undone by the visibility observer.
        // Track our own pauses separately from the browser's controls.
        if (!video.paused) {
          automaticPauses++;
          video.pause();
        }
      } else if (
        !manuallyPaused.current &&
        !video.ended &&
        video.paused &&
        !playPending
      ) {
        // Safari may defer decoding until play() is requested. Waiting for
        // canplay first can leave a visible player stuck on its poster.
        playPending = true;
        void video
          .play()
          .catch(() => {
            if (!cancelled && visible && !document.hidden)
              setControlsVisible(true);
          })
          .finally(() => {
            playPending = false;
          });
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
    video.addEventListener("canplay", syncPlayback);
    video.addEventListener("seeked", syncPlayback);
    // Resume only after the moving frame has handed over to the real player.
    const transitionObserver = new MutationObserver(syncPlayback);
    transitionObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-project-transition"],
    });
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
    const exitFullscreen = () => {
      if (!document.fullscreenElement)
        video.controls =
          window.matchMedia(nativeControlsQuery).matches &&
          nativeControlsRequested.current;
    };
    document.addEventListener("fullscreenchange", exitFullscreen);
    video.addEventListener("webkitendfullscreen", exitFullscreen);
    document.addEventListener("visibilitychange", syncPlayback);
    return () => {
      cancelled = true;
      visibilityObserver.disconnect();
      transitionObserver.disconnect();
      video.removeEventListener("canplay", syncPlayback);
      video.removeEventListener("seeked", syncPlayback);
      video.removeEventListener("play", onNativePlay);
      video.removeEventListener("pause", onNativePause);
      motion.removeEventListener("change", syncPlayback);
      document.removeEventListener("fullscreenchange", exitFullscreen);
      video.removeEventListener("webkitendfullscreen", exitFullscreen);
      video.removeEventListener("loadedmetadata", restore);
      observer?.disconnect();
      document.removeEventListener("visibilitychange", syncPlayback);
      video.pause();
    };
  }, [file, preload]);
  function revealControls() {
    const video = ref.current;
    if (!video) return;
    nativeControlsRequested.current = true;
    video.controls = true;
    setNativeControlsRevealed(true);
    video.focus();
  }

  return {
    ref,
    posterRef,
    progressRef,
    frameReady,
    nativeControls,
    nativeControlsRevealed,
    controlsVisible,
    playing,
    muted,
    setMuted,
    time,
    duration,
    togglePlay,
    fullscreen,
    revealControls,
  };
}
