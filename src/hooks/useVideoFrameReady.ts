"use client";

import { useEffect, useState, type RefObject } from "react";

// A poster must stay visible until a decoded video frame can actually paint.
// `play()` resolving (or metadata loading) does not guarantee that on iOS.
export function useVideoFrameReady(
  ref: RefObject<HTMLVideoElement>,
  file: string
) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    let frame = 0;
    let paint = 0;
    let cancelled = false;
    const clear = () => {
      if (frame) video.cancelVideoFrameCallback?.(frame);
      cancelAnimationFrame(paint);
      frame = 0;
    };
    const show = () => {
      if (!cancelled && video.readyState >= 2 && !video.seeking) setReady(true);
    };
    const check = () => {
      if (
        video.readyState < 2 ||
        video.seeking ||
        (video.paused && video.currentTime === 0)
      )
        return;
      clear();
      if (video.requestVideoFrameCallback && !video.paused) {
        frame = video.requestVideoFrameCallback(show);
      } else {
        // Paused videos may not schedule another video-frame callback.
        paint = requestAnimationFrame(() => {
          paint = requestAnimationFrame(show);
        });
      }
    };
    const hide = () => {
      clear();
      setReady(false);
    };
    const readyEvents = ["loadeddata", "playing", "seeked"];
    const resetEvents = ["emptied", "seeking", "error"];
    readyEvents.forEach((event) => video.addEventListener(event, check));
    resetEvents.forEach((event) => video.addEventListener(event, hide));
    setReady(false);
    check();
    return () => {
      cancelled = true;
      clear();
      readyEvents.forEach((event) => video.removeEventListener(event, check));
      resetEvents.forEach((event) => video.removeEventListener(event, hide));
    };
  }, [ref, file]);
  return ready;
}
