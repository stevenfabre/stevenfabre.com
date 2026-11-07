import { animate } from "motion/mini";
import { spring } from "motion";
import { decodeVisibleImages } from "@/utils/transitionImages";
import { objectPositionOffsets } from "@/utils/objectPosition";
import { prepareTransitionSnapshot, rectStyles } from "./transitionSnapshot";

const mediaTransition = { type: spring, duration: 0.4, bounce: 0.2 };

function animateCaptionEntrance(page: HTMLElement) {
  return ["info", "title", "body"].flatMap((part, index) => {
    const element = page.querySelector<HTMLElement>(
      `[data-project-caption="${part}"]`
    );
    return element
      ? [
          element.animate(
            [
              {
                opacity: 0,
                filter: "blur(4px)",
                transform: "translateY(16px)",
              },
              { opacity: 1, filter: "blur(0px)", transform: "translateY(0)" },
            ],
            {
              duration: 300,
              delay: 80 + index * 40,
              easing: "cubic-bezier(0.22, 1, 0.36, 1.12)",
              fill: "both",
            }
          ),
        ]
      : [];
  });
}

function animateFooterMovement(outgoing: HTMLElement, incoming: HTMLElement) {
  const from = rectStyles(outgoing.getBoundingClientRect());
  const to = rectStyles(incoming.getBoundingClientRect());
  const fromStyle = getComputedStyle(outgoing);
  const toStyle = getComputedStyle(incoming);
  // Both copies travel together while their appearances crossfade. Matching
  // inner gutters keeps mobile controls still despite the outer width change.
  const keyframes = {
    left: [from.left, to.left],
    top: [from.top, to.top],
    width: [from.width, to.width],
    height: [from.height, to.height],
    paddingLeft: [fromStyle.paddingLeft, toStyle.paddingLeft],
    paddingRight: [fromStyle.paddingRight, toStyle.paddingRight],
  };
  return [outgoing, incoming].map((footer) =>
    animate(footer, keyframes, mediaTransition)
  );
}

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
  let frozenVisual: HTMLElement | undefined;
  let targetOpacity = "";
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
    prepareTransitionSnapshot(copy);
    Object.assign(copy.style, {
      position: "fixed",
      ...rectStyles(rect),
      bottom: "auto",
      margin: "0",
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
    if (destinationFooter)
      destinationFooter.style.visibility = footerVisibility;
    if (target) target.style.opacity = targetOpacity;
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
      frozenVisual = Array.from(
        frozen.querySelectorAll<HTMLElement>("[data-work-visual]")
      ).find(
        (visual) =>
          visual.style.getPropertyValue("view-transition-name") === name
      );
      // Clones cannot retain :hover. Freeze the displayed thumbnail opacity
      // before the outgoing layer replaces the interactive overview.
      const thumbnails = currentPage.querySelectorAll<HTMLElement>(
        "[data-project-thumbnail]"
      );
      frozen
        .querySelectorAll<HTMLElement>("[data-project-thumbnail]")
        .forEach((thumbnail, index) => {
          thumbnail.style.opacity = getComputedStyle(thumbnails[index]).opacity;
          thumbnail.style.transition = "none";
        });
      prepareTransitionSnapshot(frozen);
      Object.assign(frozen.style, {
        position: "absolute",
        ...rectStyles(rect),
        margin: "0",
      });
      outgoing.append(frozen);
      const frozenFooter =
        frozen.querySelector<HTMLElement>("[data-site-footer]");
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
          ...rectStyles(paneRect),
          top: `${paneRect.top - rect.top}px`,
          left: `${paneRect.left - rect.left}px`,
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
        ...rectStyles(rect),
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
      // A poster's explicit visibility can override a hidden ancestor. Opacity
      // suppresses the entire visual, including posters and comparison layers.
      if (frozenVisual) frozenVisual.style.opacity = "0";
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
              ...rectStyles(from),
            };
            Object.assign(border.style, sourceBorder);
          }
          const reducedMotion = matchMedia(
            "(prefers-reduced-motion: reduce)"
          ).matches;
          const options: KeyframeAnimationOptions = {
            duration: 320,
            easing: getComputedStyle(document.documentElement)
              .getPropertyValue("--ease-out")
              .trim(),
            fill: "both",
          };
          const fade = (
            element: HTMLElement | null | undefined,
            from: number,
            to: number
          ) => {
            if (element)
              animations.push(
                element.animate([{ opacity: from }, { opacity: to }], options)
              );
          };
          if (!closing && page && !reducedMotion)
            animations.push(...animateCaptionEntrance(page));
          if (page) {
            const incomingFooter = captureFooter(page);
            if (incomingFooter && outgoingFooter && !reducedMotion)
              animations.push(
                ...animateFooterMovement(outgoingFooter, incomingFooter)
              );
            destinationFooter =
              page.querySelector<HTMLElement>("[data-site-footer]");
            if (destinationFooter) {
              footerVisibility = destinationFooter.style.visibility;
              destinationFooter.style.visibility = "hidden";
            }
            fade(incomingFooter, 0, 1);
          }
          fade(outgoingFooter, 1, 0);
          fade(page, 0, 1);
          fade(outgoing, 1, 0);
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
            targetOpacity = target.style.opacity;
            target.style.opacity = "0";
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
