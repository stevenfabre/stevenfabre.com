// WebKit and older browsers may not expose same-document View Transitions.
// Keep their navigation animated too, without retaining an entire page snapshot.
export function captureProjectTransition(source?: HTMLElement | null) {
  const bounds = source?.getBoundingClientRect();
  const name = source?.style.getPropertyValue("view-transition-name");
  let overlay: HTMLDivElement | undefined;
  if (source && bounds && bounds.width && bounds.height && name) {
    overlay = document.createElement("div");
    overlay.setAttribute("aria-hidden", "true");
    Object.assign(overlay.style, {
      position: "fixed",
      left: `${bounds.left}px`,
      top: `${bounds.top}px`,
      width: `${bounds.width}px`,
      height: `${bounds.height}px`,
      overflow: "hidden",
      pointerEvents: "none",
      zIndex: "100",
      borderRadius: getComputedStyle(source).borderRadius,
      transformOrigin: "top left",
    });
    const media = source.querySelector("video, img");
    let snapshot: HTMLElement | undefined;
    if (media instanceof HTMLVideoElement && media.readyState >= 2) {
      const canvas = document.createElement("canvas");
      canvas.width = media.videoWidth;
      canvas.height = media.videoHeight;
      canvas.getContext("2d")?.drawImage(media, 0, 0);
      snapshot = canvas;
    } else if (
      media instanceof HTMLImageElement ||
      media instanceof HTMLVideoElement
    ) {
      const image = new Image();
      image.src =
        media instanceof HTMLVideoElement
          ? media.poster
          : media.currentSrc || media.src;
      snapshot = image;
    }
    if (snapshot && media) {
      Object.assign(snapshot.style, {
        width: "100%",
        height: "100%",
        display: "block",
        objectFit: getComputedStyle(media).objectFit,
        objectPosition: getComputedStyle(media).objectPosition,
      });
      overlay.append(snapshot);
      document.body.append(overlay);
    }
  }
  const cleanup = () => overlay?.remove();
  return {
    cancel: cleanup,
    play() {
      const tokens = getComputedStyle(document.documentElement);
      const duration = parseFloat(
        tokens.getPropertyValue("--page-transition-duration")
      );
      const easing = tokens.getPropertyValue("--ease-out").trim();
      const target = Array.from(
        document.querySelectorAll<HTMLElement>("[data-work-visual]")
      ).find(
        (visual) =>
          visual.style.getPropertyValue("view-transition-name") === name
      );
      const page = document.querySelector<HTMLElement>(
        "[data-project-slug], [data-site-content]"
      );
      page?.animate([{ opacity: 0 }, { opacity: 1 }], { duration, easing });
      if (!overlay || !target || !bounds) {
        cleanup();
        return;
      }
      const to = target.getBoundingClientRect();
      const animation = overlay.animate(
        [
          { transform: "none", opacity: 1 },
          {
            transform: `translate(${to.left - bounds.left}px, ${
              to.top - bounds.top
            }px) scale(${to.width / bounds.width}, ${
              to.height / bounds.height
            })`,
            opacity: 0,
          },
        ],
        { duration, easing }
      );
      void animation.finished.then(cleanup, cleanup);
    },
  };
}
