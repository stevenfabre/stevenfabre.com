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
    let presented = false;
    const clear = () => {
      if (frame) video.cancelVideoFrameCallback?.(frame);
      cancelAnimationFrame(paint);
      frame = 0;
    };
    const show = () => {
      frame = 0;
      if (cancelled || video.readyState < 2 || video.seeking) return;
      // A frame callback runs before compositing. Keep the poster through that
      // paint, then reveal the video without an empty WebKit surface underneath.
      paint = requestAnimationFrame(() => {
        paint = requestAnimationFrame(() => {
          paint = 0;
          if (!cancelled && video.readyState >= 2 && !video.seeking) {
            presented = true;
            setReady(true);
          }
        });
      });
    };
    const check = () => {
      if (presented || frame || paint || video.readyState < 2 || video.seeking)
        return;
      if (video.requestVideoFrameCallback) {
        frame = video.requestVideoFrameCallback(show);
      } else if (!video.paused || video.currentTime > 0) {
        // Browsers without frame callbacks can only use playback readiness.
        show();
      }
    };
    const hide = () => {
      clear();
      paint = 0;
      presented = false;
      setReady(false);
    };
    // Playback time can advance before WebKit paints the decoded frame. It may
    // schedule a readiness check, but must never bypass the frame callback.
    const onTimeUpdate = check;
    video.addEventListener("timeupdate", onTimeUpdate);
    const readyEvents = ["loadeddata", "playing", "seeked"];
    const resetEvents = ["emptied", "seeking", "error"];
    readyEvents.forEach((event) => video.addEventListener(event, check));
    resetEvents.forEach((event) => video.addEventListener(event, hide));
    setReady(false);
    check();
    return () => {
      cancelled = true;
      clear();
      video.removeEventListener("timeupdate", onTimeUpdate);
      readyEvents.forEach((event) => video.removeEventListener(event, check));
      resetEvents.forEach((event) => video.removeEventListener(event, hide));
    };
  }, [ref, file]);
  return ready;
}
