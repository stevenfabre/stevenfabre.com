import { prepareTransitionSnapshot, rectStyles } from "./transitionSnapshot";

/** Keep the incoming swipe visual painted while its route mounts a new player. */
export function holdSwipeVisual(source: HTMLElement) {
  const bounds = source.getBoundingClientRect();
  const style = getComputedStyle(source);
  const overlay = source.cloneNode(true) as HTMLElement;
  prepareTransitionSnapshot(overlay);
  overlay.removeAttribute("data-work-visual");
  overlay.setAttribute("data-swipe-handoff", "");
  Object.assign(overlay.style, {
    position: "fixed",
    ...rectStyles(bounds),
    margin: "0",
    zIndex: "40",
    pointerEvents: "none",
    borderRadius: style.borderRadius,
    background: style.backgroundColor,
  });
  // The preview is already decoded; don't defer painting the retained copy.
  overlay.querySelectorAll("img").forEach((image) => {
    image.loading = "eager";
    image.decoding = "sync";
  });
  document.body.append(overlay);
  return () => overlay.remove();
}
