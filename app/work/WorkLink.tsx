"use client";

import { SiteLink } from "../../src/components/SiteNavigation";
import { type AnchorHTMLAttributes, type MouseEvent } from "react";
import { isPlainNavigation } from "../../src/utils/projectNavigation";

// Client navigation keeps the app mounted and can show the route loading state.
export default function WorkLink({
  href,
  children,
  onClick,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement>) {
  function navigate(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);
    if (!isPlainNavigation(event)) return;
    const video = event.currentTarget
      .closest("[data-work-visual]")
      ?.querySelector("video");
    if (video) {
      try {
        sessionStorage.setItem(
          "work-playback",
          JSON.stringify({
            file: video.dataset.file,
            time: video.currentTime,
            playing: !video.paused,
            savedAt: Date.now(),
          })
        );
      } catch {
        /* Navigation still works when storage is unavailable. */
      }
    }
  }
  return (
    <SiteLink {...props} href={href || "/work"} onClick={navigate}>
      {children}
    </SiteLink>
  );
}
