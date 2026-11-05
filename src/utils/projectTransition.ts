import { objectPositionOffsets } from "./objectPosition";

// Keep a painted outgoing page during route streaming. Safari can discard native
// full-page snapshots when its browser chrome changes the viewport during a route.
// One poster moves between the two layouts; neither layout paints a second copy.
export function captureProjectTransition(source?: HTMLElement | null) {
  const bounds = source?.getBoundingClientRect();
  const name = source?.style.getPropertyValue("view-transition-name");
  const media = source?.querySelector<HTMLImageElement>(
    "img[data-video-poster], img"
  );
  let overlay: HTMLDivElement | undefined;
  let snapshot: HTMLImageElement | undefined;
  let border: HTMLDivElement | undefined;
  const animations: Animation[] = [];
  let page: HTMLElement | null = null;
  let pageOpacity = "";
  let target: HTMLElement | undefined;
  let targetVisibility = "";
  let cancelled = false;
  let cleaned = false;

  const outgoing = document.createElement("div");
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
    const rect = currentPage.getBoundingClientRect();
    const frozen = currentPage.cloneNode(true) as HTMLElement;
    // Frozen content is purely visual: no duplicate IDs or active media players.
    frozen
      .querySelectorAll("video, audio, iframe, script")
      .forEach((el) => el.remove());
    [frozen, ...Array.from(frozen.querySelectorAll<HTMLElement>("*"))].forEach(
      (el) => {
        el.removeAttribute("id");
        el.removeAttribute("data-transition-selected");
        el.style.setProperty("view-transition-name", "none");
      }
    );
    Object.assign(frozen.style, {
      position: "absolute",
      top: `${rect.top}px`,
      left: `${rect.left}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
      margin: "0",
    });
    outgoing.append(frozen);
    document.body.append(outgoing);
    const originalPane = currentPage.querySelector<HTMLElement>(
      "[data-site-content]"
    );
    const frozenPane = frozen.querySelector<HTMLElement>("[data-site-content]");
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
      rect.width / media!.naturalWidth,
      rect.height / media!.naturalHeight
    );
    const [offsetX, offsetY] = objectPositionOffsets(
      style.objectPosition,
      rect.width - media!.naturalWidth * scale,
      rect.height - media!.naturalHeight * scale
    );
    const x = rect.left + offsetX;
    const y = rect.top + offsetY;
    return `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
  };

  const borderFrame = (element: HTMLElement, rect: DOMRect) => ({
    left: `${rect.left}px`,
    top: `${rect.top}px`,
    width: `${rect.width}px`,
    height: `${rect.height}px`,
    borderRadius: getComputedStyle(element).borderRadius,
    borderColor: getComputedStyle(element, "::after").borderTopColor,
  });

  const sourceBorder =
    source && bounds ? borderFrame(source, bounds) : undefined;

  if (
    source &&
    bounds &&
    bounds.width &&
    bounds.height &&
    media?.naturalWidth
  ) {
    overlay = document.createElement("div");
    overlay.setAttribute("aria-hidden", "true");
    Object.assign(overlay.style, {
      position: "fixed",
      inset: "0",
      pointerEvents: "none",
      zIndex: "100",
      clipPath: clip(bounds, getComputedStyle(source).borderRadius),
    });
    snapshot = new Image();
    snapshot.src = media.currentSrc || media.src;
    Object.assign(snapshot.style, {
      position: "absolute",
      left: "0",
      top: "0",
      maxWidth: "none",
      width: `${media.naturalWidth}px`,
      height: `${media.naturalHeight}px`,
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
  const cleanup = () => {
    if (cleaned) return;
    cleaned = true;
    animations.forEach((animation) => animation.cancel());
    overlay?.remove();
    outgoing.remove();
    if (target) target.style.visibility = targetVisibility;
    if (page) page.style.opacity = pageOpacity;
  };
  return {
    cancel() {
      cancelled = true;
      cleanup();
    },
    prepareDestination() {
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
      const tokens = getComputedStyle(document.documentElement);
      const duration = 320;
      const easing = tokens.getPropertyValue("--ease-out").trim();
      const options: KeyframeAnimationOptions = {
        duration,
        easing,
        fill: "both",
      };
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
        // Match the frozen visual by its poster URL after stripping transition names.
        outgoing
          .querySelectorAll<HTMLImageElement>("[data-work-visual] img")
          .forEach((img) => {
            if (img.src === media?.src) {
              const visual = img.closest<HTMLElement>("[data-work-visual]");
              if (visual) visual.style.visibility = "hidden";
            }
          });
        if (border && sourceBorder) {
          animations.push(
            border.animate([sourceBorder, borderFrame(target, to)], options)
          );
        }
        animations.push(
          snapshot.animate(
            [
              { transform: snapshot.style.transform },
              { transform: fit(to, targetImage) },
            ],
            options
          )
        );
        animations.push(
          overlay.animate(
            [
              { clipPath: overlay.style.clipPath, opacity: 1 },
              {
                clipPath: clip(to, getComputedStyle(target).borderRadius),
                opacity: 1,
              },
            ],
            options
          )
        );
      }
      await Promise.allSettled(
        animations.map((animation) => animation.finished)
      );
      cleanup();
    },
  };
}
