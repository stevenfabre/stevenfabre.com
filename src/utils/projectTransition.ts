import { animate } from "motion/mini";
import { spring } from "motion";
import { decodeVisibleImages } from "@/utils/transitionImages";
import { objectPositionOffsets } from "@/utils/objectPosition";

const mediaTransition = { type: spring, duration: 0.4, bounce: 0.2 };

// Keep a painted outgoing page during route streaming. Safari can discard native
// full-page snapshots when its browser chrome changes the viewport during a route.
// One poster moves between the two layouts; neither layout paints a second copy.
export function captureProjectTransition(
  source?: HTMLElement | null,
  closing = false
) {
  const bounds = source?.getBoundingClientRect();
  const name = source?.style.getPropertyValue("view-transition-name");
  const media = source?.querySelector<HTMLImageElement>(
    "img[data-video-poster], img"
  );
  let overlay: HTMLDivElement | undefined;
  const video = source?.querySelector("video");
  const videoReady =
    video &&
    video.dataset.videoReady === "true" &&
    video.readyState >= 2 &&
    video.videoWidth > 0;
  const mediaWidth = videoReady ? video.videoWidth : media?.naturalWidth || 0;
  const mediaHeight = videoReady
    ? video.videoHeight
    : media?.naturalHeight || 0;
  let snapshot: HTMLImageElement | HTMLCanvasElement | undefined;
  let border: HTMLDivElement | undefined;
  let closingFeedback: Animation | undefined;
  const animations: { cancel(): void; finished: Promise<unknown> }[] = [];
  let page: HTMLElement | null = null;
  let pageOpacity = "";
  let target: HTMLElement | undefined;
  let targetVisibility = "";
  let cancelled = false;
  let cleaned = false;
  let destinationFooter: HTMLElement | null = null;
  let footerVisibility = "";
  const footerLayer = document.createElement("div");
  const captureFooter = (root: HTMLElement) => {
    const footer = root.querySelector<HTMLElement>("[data-site-footer]");
    if (!footer) return;
    const rect = footer.getBoundingClientRect();
    const copy = footer.cloneNode(true) as HTMLElement;
    copy.removeAttribute("data-site-footer");
    [copy, ...Array.from(copy.querySelectorAll<HTMLElement>("*"))].forEach(
      (element) => element.removeAttribute("id")
    );
    Object.assign(copy.style, {
      position: "fixed",
      top: `${rect.top}px`,
      left: `${rect.left}px`,
      bottom: "auto",
      width: `${rect.width}px`,
      height: `${rect.height}px`,
      margin: "0",
      viewTransitionName: "none",
    });
    footerLayer.append(copy);
    return copy;
  };
  let outgoingFooter: HTMLElement | undefined;

  const outgoing = document.createElement("div");
  const cleanup = () => {
    if (cleaned) return;
    cleaned = true;
    // A failed animation must not prevent restoring the real page.
    animations.forEach((animation) => {
      try {
        animation.cancel();
      } catch {
        /* Already detached or unavailable. */
      }
    });
    closingFeedback?.cancel();
    overlay?.remove();
    outgoing.remove();
    footerLayer.remove();
    if (destinationFooter) destinationFooter.style.visibility = footerVisibility;
    if (target) target.style.visibility = targetVisibility;
    if (page) page.style.opacity = pageOpacity;
  };
  try {
    // Page opacity creates a stacking context, so footer copies live above both
    // page snapshots and the moving visual throughout the route handoff.
    footerLayer.setAttribute("data-transition-footer", "");
    footerLayer.setAttribute("aria-hidden", "true");
    footerLayer.inert = true;
    Object.assign(footerLayer.style, {
      position: "fixed",
      inset: "0",
      pointerEvents: "none",
      zIndex: "101",
    });
    document.body.append(footerLayer);
    outgoing.setAttribute("aria-hidden", "true");
    outgoing.inert = true;
    Object.assign(outgoing.style, {
      position: "fixed",
      inset: "0",
      overflow: "hidden",
      pointerEvents: "none",
      zIndex: "99",
      background: getComputedStyle(document.body).backgroundColor,
    });
    const currentPage = document.querySelector<HTMLElement>(
      "[data-project-slug], [data-site-layout]"
    );
    if (currentPage) {
      outgoingFooter = captureFooter(currentPage);
      const rect = currentPage.getBoundingClientRect();
      const frozen = currentPage.cloneNode(true) as HTMLElement;
      // Frozen content is purely visual: no duplicate IDs or active media players.
      frozen
        .querySelectorAll("video, audio, iframe, script")
        .forEach((el) => el.remove());
      [
        frozen,
        ...Array.from(frozen.querySelectorAll<HTMLElement>("*")),
      ].forEach((el) => {
        el.removeAttribute("id");
        el.removeAttribute("data-transition-selected");
        el.style.setProperty("view-transition-name", "none");
      });
      Object.assign(frozen.style, {
        position: "absolute",
        top: `${rect.top}px`,
        left: `${rect.left}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
        margin: "0",
      });
      outgoing.append(frozen);
      const frozenFooter = frozen.querySelector<HTMLElement>("[data-site-footer]");
      if (frozenFooter) frozenFooter.style.visibility = "hidden";
      document.body.append(outgoing);
      const originalPane = currentPage.querySelector<HTMLElement>(
        "[data-site-content]"
      );
      const frozenPane = frozen.querySelector<HTMLElement>(
        "[data-site-content]"
      );
      if (originalPane && frozenPane) {
        const paneRect = originalPane.getBoundingClientRect();
        // The overview's mobile top margin collapses through its parent. Once
        // frozen in an absolute layer it no longer collapses, so preserve the
        // measured pane position instead of laying out that margin a second time.
        Object.assign(frozenPane.style, {
          position: "absolute",
          top: `${paneRect.top - rect.top}px`,
          left: `${paneRect.left - rect.left}px`,
          width: `${paneRect.width}px`,
          height: `${paneRect.height}px`,
          margin: "0",
        });
        frozenPane.scrollTop = originalPane.scrollTop;
      }
      // This stays visible while loading; remove its selected image only once
      // the moving poster starts, so cold routes never expose an empty canvas.
    }

    const clip = (rect: DOMRect, radius: string) =>
      `inset(${rect.top}px ${innerWidth - rect.right}px ${
        innerHeight - rect.bottom
      }px ${rect.left}px round ${radius})`;
    const fit = (rect: DOMRect, element: HTMLImageElement) => {
      const style = getComputedStyle(element);
      const scale = (style.objectFit === "contain" ? Math.min : Math.max)(
        rect.width / mediaWidth,
        rect.height / mediaHeight
      );
      const [offsetX, offsetY] = objectPositionOffsets(
        style.objectPosition,
        rect.width - mediaWidth * scale,
        rect.height - mediaHeight * scale
      );
      const x = rect.left + offsetX;
      const y = rect.top + offsetY;
      return `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
    };

    const borderFrame = (element: HTMLElement, rect: DOMRect) => {
      const borderElement = element.querySelector<HTMLElement>(
        ":scope > [data-media-border]"
      );
      return {
        left: `${rect.left}px`,
        top: `${rect.top}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
        borderRadius: getComputedStyle(element).borderRadius,
        // Detail media uses an explicit border; overview thumbnails use ::after.
        // Reading an absent pseudo-element returns currentColor (opaque white in
        // dark mode), not the translucent border visible on the media.
        borderColor: borderElement
          ? getComputedStyle(borderElement).borderTopColor
          : getComputedStyle(element, "::after").borderTopColor,
      };
    };

    let sourceBorder =
      source && bounds ? borderFrame(source, bounds) : undefined;

    if (
      source &&
      bounds &&
      bounds.width &&
      bounds.height &&
      media &&
      mediaWidth &&
      mediaHeight
    ) {
      overlay = document.createElement("div");
      overlay.setAttribute("aria-hidden", "true");
      overlay.setAttribute("data-project-morph", "");
      Object.assign(overlay.style, {
        position: "fixed",
        inset: "0",
        pointerEvents: "none",
        zIndex: "100",
        clipPath: clip(bounds, getComputedStyle(source).borderRadius),
      });
      if (videoReady) {
        // Copy the displayed frame synchronously. Waiting for a freshly encoded
        // poster to decode adds a visible pause before the close can begin.
        const canvas = document.createElement("canvas");
        canvas.width = mediaWidth;
        canvas.height = mediaHeight;
        canvas.getContext("2d")?.drawImage(video, 0, 0);
        snapshot = canvas;
      } else {
        snapshot = new Image();
        snapshot.src = media.currentSrc || media.src;
      }
      Object.assign(snapshot.style, {
        position: "absolute",
        left: "0",
        top: "0",
        maxWidth: "none",
        width: `${mediaWidth}px`,
        height: `${mediaHeight}px`,
        transformOrigin: "top left",
        transform: fit(bounds, media),
      });
      border = document.createElement("div");
      Object.assign(border.style, {
        position: "absolute",
        boxSizing: "border-box",
        border: "1px solid transparent",
        ...sourceBorder,
      });
      overlay.append(snapshot, border);
      document.body.append(overlay);
    }
    const hideFrozenVisual = () => {
      outgoing
        .querySelectorAll<HTMLImageElement>("[data-work-visual] img")
        .forEach((img) => {
          if (img.src === media?.src) {
            const visual = img.closest<HTMLElement>("[data-work-visual]");
            if (visual) visual.style.visibility = "hidden";
          }
        });
    };
    if (closing && overlay && bounds) {
      // Start responding on the tap, even if the return route is still mounting.
      // Continue from this live geometry once the thumbnail can be measured.
      hideFrozenVisual();
      overlay.style.transformOrigin = `${bounds.left + bounds.width / 2}px ${
        bounds.top + bounds.height / 2
      }px`;
      closingFeedback = overlay.animate(
        [{ transform: "scale(1)" }, { transform: "scale(0.96)" }],
        {
          duration: 120,
          easing: "cubic-bezier(0.23, 1, 0.32, 1)",
          fill: "forwards",
        }
      );
      void closingFeedback.finished.catch(() => {});
    }
    return {
      cancel() {
        cancelled = true;
        cleanup();
      },
      prepareDestination() {
        if (cancelled || cleaned || page) return;
        page = document.querySelector<HTMLElement>(
          "[data-project-slug], [data-site-layout]"
        );
        if (page) {
          pageOpacity = page.style.opacity;
          page.style.opacity = "0";
        }
      },
      async play() {
        if (cancelled) return;
        try {
          if (
            closingFeedback &&
            overlay &&
            snapshot &&
            border &&
            media &&
            sourceBorder
          ) {
            const from = border.getBoundingClientRect();
            closingFeedback.cancel();
            overlay.style.clipPath = clip(from, sourceBorder.borderRadius);
            snapshot.style.transform = fit(from, media);
            sourceBorder = {
              ...sourceBorder,
              left: `${from.left}px`,
              top: `${from.top}px`,
              width: `${from.width}px`,
              height: `${from.height}px`,
            };
            Object.assign(border.style, sourceBorder);
          }
          const tokens = getComputedStyle(document.documentElement);
          const duration = 320;
          const easing = tokens.getPropertyValue("--ease-out").trim();
          const options: KeyframeAnimationOptions = {
            duration,
            easing,
            fill: "both",
          };
          if (page) {
            const incomingFooter = captureFooter(page);
            destinationFooter = page.querySelector<HTMLElement>(
              "[data-site-footer]"
            );
            if (destinationFooter) {
              footerVisibility = destinationFooter.style.visibility;
              destinationFooter.style.visibility = "hidden";
            }
            if (incomingFooter)
              animations.push(
                incomingFooter.animate([{ opacity: 0 }, { opacity: 1 }], options)
              );
          }
          if (outgoingFooter)
            animations.push(
              outgoingFooter.animate([{ opacity: 1 }, { opacity: 0 }], options)
            );
          if (page)
            animations.push(
              page.animate([{ opacity: 0 }, { opacity: 1 }], options)
            );
          animations.push(
            outgoing.animate([{ opacity: 1 }, { opacity: 0 }], options)
          );
          target = Array.from(
            document.querySelectorAll<HTMLElement>("[data-work-visual]")
          ).find(
            (visual) =>
              visual.style.getPropertyValue("view-transition-name") === name &&
              !visual.closest("[data-swipe-preview]") &&
              !outgoing.contains(visual)
          );
          const targetImage = target?.querySelector<HTMLImageElement>(
            "img[data-video-poster], img"
          );
          if (overlay && snapshot && target && targetImage && bounds) {
            const to = target.getBoundingClientRect();
            targetVisibility = target.style.visibility;
            target.style.visibility = "hidden";
            hideFrozenVisual();
            if (border && sourceBorder) {
              const destinationBorder = borderFrame(target, to);
              animations.push(
                animate(
                  border,
                  {
                    left: [sourceBorder.left, destinationBorder.left],
                    top: [sourceBorder.top, destinationBorder.top],
                    width: [sourceBorder.width, destinationBorder.width],
                    height: [sourceBorder.height, destinationBorder.height],
                    borderRadius: [
                      sourceBorder.borderRadius,
                      destinationBorder.borderRadius,
                    ],
                    borderColor: [
                      sourceBorder.borderColor,
                      destinationBorder.borderColor,
                    ],
                  },
                  mediaTransition
                )
              );
            }
            animations.push(
              animate(
                snapshot,
                { transform: [snapshot.style.transform, fit(to, targetImage)] },
                mediaTransition
              )
            );
            animations.push(
              animate(
                overlay,
                {
                  clipPath: [
                    overlay.style.clipPath,
                    clip(to, getComputedStyle(target).borderRadius),
                  ],
                },
                mediaTransition
              )
            );
          }
          // Decode the landing poster while the snapshot is already moving.
          // Only its pixels matter at handoff; unrelated gallery images don't.
          await Promise.allSettled([
            ...animations.map((animation) => animation.finished),
            ...(target ? [decodeVisibleImages(target)] : []),
          ]);
        } finally {
          cleanup();
        }
      },
    };
  } catch (error) {
    cleanup();
    throw error;
  }
}
