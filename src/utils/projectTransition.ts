// Browsers without View Transitions use the same decoded poster as the native
// path. Move/crop an image instead of stretching a video or sampling its GPU layer.
export function captureProjectTransition(source?: HTMLElement | null) {
  const bounds = source?.getBoundingClientRect();
  const name = source?.style.getPropertyValue("view-transition-name");
  const media = source?.querySelector<HTMLImageElement>(
    "img[data-video-poster], img"
  );
  let overlay: HTMLDivElement | undefined;
  let snapshot: HTMLImageElement | undefined;
  const animations: Animation[] = [];
  let page: HTMLElement | null = null;
  let pageOpacity = "";
  let cancelled = false;

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
    const position = style.objectPosition
      .split(" ")
      .map((value) => parseFloat(value) / 100);
    const x =
      rect.left +
      (rect.width - media!.naturalWidth * scale) *
        (Number.isFinite(position[0]) ? position[0] : 0.5);
    const y =
      rect.top +
      (rect.height - media!.naturalHeight * scale) *
        (Number.isFinite(position[1]) ? position[1] : 0.5);
    return `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
  };

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
    overlay.append(snapshot);
    document.body.append(overlay);
  }
  const cleanup = () => {
    animations.forEach((animation) => animation.cancel());
    overlay?.remove();
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
      const duration = parseFloat(
        tokens.getPropertyValue("--page-transition-duration")
      );
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
      const target = Array.from(
        document.querySelectorAll<HTMLElement>("[data-work-visual]")
      ).find(
        (visual) =>
          visual.style.getPropertyValue("view-transition-name") === name &&
          !visual.closest("[data-swipe-preview]")
      );
      const targetImage = target?.querySelector<HTMLImageElement>(
        "img[data-video-poster], img"
      );
      if (overlay && snapshot && target && targetImage && bounds) {
        const to = target.getBoundingClientRect();
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
                offset: 0.8,
              },
              {
                clipPath: clip(to, getComputedStyle(target).borderRadius),
                opacity: 0,
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
