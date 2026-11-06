/** Keep the incoming swipe visual painted while its route mounts a new player. */
export function holdSwipeVisual(source: HTMLElement) {
  const bounds = source.getBoundingClientRect();
  const style = getComputedStyle(source);
  const overlay = source.cloneNode(true) as HTMLElement;
  overlay.inert = true;
  overlay.setAttribute("aria-hidden", "true");
  overlay.removeAttribute("data-work-visual");
  overlay
    .querySelectorAll("video, audio, iframe, script")
    .forEach((node) => node.remove());
  [overlay, ...Array.from(overlay.querySelectorAll<HTMLElement>("*"))].forEach(
    (node) => {
      node.removeAttribute("id");
      node.style.setProperty("view-transition-name", "none");
    }
  );
  Object.assign(overlay.style, {
    position: "fixed",
    left: `${bounds.left}px`,
    top: `${bounds.top}px`,
    width: `${bounds.width}px`,
    height: `${bounds.height}px`,
    margin: "0",
    zIndex: "40",
    pointerEvents: "none",
    borderRadius: style.borderRadius,
    background: style.backgroundColor,
  });
  overlay.style.setProperty(
    "--media-border",
    style.getPropertyValue("--media-border")
  );
  // The preview is already decoded; don't defer painting the retained copy.
  overlay.querySelectorAll("img").forEach((image) => {
    image.loading = "eager";
    image.decoding = "sync";
  });
  document.body.append(overlay);
  return () => overlay.remove();
}
