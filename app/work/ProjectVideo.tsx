"use client";

import { useState } from "react";
import Icon from "@/components/Icon";
import type { ProjectVisual } from "./work-data";
import { getMediaDimensions } from "./media";
import { useProjectVideo } from "./useProjectVideo";
import playerStyles from "./ProjectVideo.module.css";

const formatTime = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(
    2,
    "0"
  )}`;

export default function ProjectVideo({
  film,
  preload = "metadata",
  autoLoop = true,
}: {
  film: ProjectVisual;
  preload?: "metadata" | "none";
  autoLoop?: boolean;
}) {
  const {
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
  } = useProjectVideo(film.file, preload);
  const [failed, setFailed] = useState(false);
  const { width, height } = getMediaDimensions(film);
  return (
    <div
      className={playerStyles.player}
      data-native-controls={
        (nativeControls && nativeControlsRevealed) || undefined
      }
      data-frame-ready={frameReady || undefined}
      data-controls-visible={controlsVisible || !playing || undefined}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={posterRef}
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
        controls={nativeControls && nativeControlsRevealed}
        onVolumeChange={(event) => {
          const nextMuted = event.currentTarget.muted;
          setMuted(nextMuted);
        }}
        onClick={nativeControls ? undefined : togglePlay}
        tabIndex={nativeControls && !nativeControlsRevealed ? -1 : 0}
        onKeyDown={
          nativeControls
            ? undefined
            : (event) => {
                if (event.key === " " || event.key === "Enter") {
                  event.preventDefault();
                  togglePlay();
                }
              }
        }
        playsInline
        preload={preload === "none" ? "none" : "auto"}
        aria-label={film.title}
        onError={() => setFailed(true)}
      />
      {nativeControls && !nativeControlsRevealed && (
        <button
          type="button"
          className="absolute inset-0 z-[2] cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white"
          data-video-reveal
          aria-label={`Show video controls for ${film.title}`}
          onClick={revealControls}
        />
      )}
      {!nativeControls && (
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
            <Icon name={playing ? "pause" : "play"} size={18} />
          </button>
          <span className="shrink-0 text-xs tabular-nums">
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
            <Icon name={muted ? "volume-off" : "volume"} size={18} />
          </button>
          <button type="button" aria-label="Full screen" onClick={fullscreen}>
            <Icon name="maximize" size={18} />
          </button>
        </div>
      )}
      {failed && (
        <p className="absolute inset-x-4 bottom-4 rounded-lg bg-neutral-900/90 p-3 text-xs text-white [&_a]:inline-flex [&_a]:items-center [&_a]:gap-2">
          The video couldn’t load.{" "}
          <a href={`/work/media/${film.file}.mp4`}>
            Open the video directly <Icon name="arrow-up-right" size={14} />
          </a>
        </p>
      )}
    </div>
  );
}
