"use client";

import { saveVideoPlayback } from "@/utils/videoPlayback";
import { SiteLink } from "@/components/SiteNavigation";
import { type AnchorHTMLAttributes, type MouseEvent } from "react";
import { isPlainNavigation } from "@/utils/projectNavigation";

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
    if (video) saveVideoPlayback(video);
  }
  return (
    <SiteLink {...props} href={href || "/work"} onClick={navigate}>
      {children}
    </SiteLink>
  );
}
