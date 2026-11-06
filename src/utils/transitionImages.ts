/** Decode only what the next snapshot can see; don't wait for videos or a
 * whole gallery. The deadline keeps failed images from blocking navigation. */
export async function decodeVisibleImages(root: ParentNode = document) {
  const images = Array.from(
    root.querySelectorAll<HTMLImageElement>(
      "[data-work-visual] img, [data-site-portrait] img"
    )
  ).filter((image) => {
    const rect = image.getBoundingClientRect();
    return (
      rect.width > 0 &&
      rect.height > 0 &&
      rect.bottom > 0 &&
      rect.top < innerHeight &&
      rect.right > 0 &&
      rect.left < innerWidth
    );
  });
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    await Promise.race([
      Promise.allSettled(
        images.map((image) => {
          // Returning to a gallery can scroll a previously lazy image onscreen.
          image.loading = "eager";
          return image.decode();
        })
      ),
      new Promise<void>((resolve) => {
        timer = setTimeout(resolve, 1200);
      }),
    ]);
  } finally {
    clearTimeout(timer);
  }
}

export function prepareProjectImages(source: HTMLElement) {
  const name = source.style.getPropertyValue("view-transition-name");
  const selected = new Set<HTMLElement>();
  const select = (element: HTMLElement) => {
    element.setAttribute("data-transition-selected", "");
    selected.add(element);
  };
  document.documentElement.setAttribute("data-project-transition", "");
  select(source);
  return {
    selectDestination() {
      const destination = Array.from(
        document.querySelectorAll<HTMLElement>("[data-work-visual]")
      ).find(
        (element) =>
          element.style.getPropertyValue("view-transition-name") === name &&
          !element.closest("[data-swipe-preview]")
      );
      if (destination) select(destination);
    },
    cancel() {
      selected.forEach((element) =>
        element.removeAttribute("data-transition-selected")
      );
      document.documentElement.removeAttribute("data-project-transition");
    },
  };
}
