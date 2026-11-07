// Call on a detached clone after reading any original transition names.
// Snapshots keep still images, never active players, IDs, or named transitions.
export function prepareTransitionSnapshot(snapshot: HTMLElement) {
  snapshot.inert = true;
  snapshot.setAttribute("aria-hidden", "true");
  snapshot
    .querySelectorAll("video, audio, iframe, script")
    .forEach((element) => element.remove());
  [
    snapshot,
    ...Array.from(snapshot.querySelectorAll<HTMLElement>("*")),
  ].forEach((element) => {
    element.removeAttribute("id");
    element.removeAttribute("data-transition-selected");
    element.style.setProperty("view-transition-name", "none");
  });
}

export function rectStyles(rect: DOMRect) {
  return {
    left: `${rect.left}px`,
    top: `${rect.top}px`,
    width: `${rect.width}px`,
    height: `${rect.height}px`,
  };
}
