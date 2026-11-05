import type { MouseEvent } from "react";

type ReturnView = { href: string };
const pendingKey = "portfolio-navigation";
const fallback: ReturnView = { href: "/work" };

function isReturnView(value: unknown): value is ReturnView {
  if (!value || typeof value !== "object") return false;
  const { href } = value as ReturnView;
  return typeof href === "string" && /^(\/|\/work)([?#].*)?$/.test(href);
}

export function isPlainNavigation(event: MouseEvent<HTMLAnchorElement>) {
  return (
    !event.defaultPrevented &&
    event.button === 0 &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.shiftKey &&
    !event.altKey &&
    !event.currentTarget.hasAttribute("download") &&
    (!event.currentTarget.target || event.currentTarget.target === "_self")
  );
}

// Store the return view per history entry. Back/forward and reloads therefore
// keep the original overview, even after browsing several fullscreen projects.
export function rememberProjectHref(href: string) {
  const destination = new URL(href, location.href);
  if (
    destination.origin !== location.origin ||
    !destination.pathname.startsWith("/work/")
  )
    return;
  const overview = location.pathname === "/" || location.pathname === "/work";
  const current = history.state?.portfolioReturn;
  const returnView: ReturnView = overview
    ? { href: location.pathname + location.search + location.hash }
    : isReturnView(current)
    ? current
    : fallback;
  try {
    if (overview) {
      history.replaceState(
        {
          ...history.state,
          portfolioScroll: {
            pathname: location.pathname,
            pane: document.querySelector("[data-site-content]")?.scrollTop || 0,
            window: window.scrollY,
          },
        },
        ""
      );
    }
    sessionStorage.setItem(
      pendingKey,
      JSON.stringify({
        destination: destination.pathname,
        returnView,
        savedAt: Date.now(),
      })
    );
  } catch {
    // The ordinary link remains usable when browser storage is unavailable.
  }
}

export function initializeProjectReturn(): ReturnView {
  const current = history.state?.portfolioReturn;
  let returnView = isReturnView(current) ? current : fallback;
  try {
    const pending = JSON.parse(sessionStorage.getItem(pendingKey) || "null");
    sessionStorage.removeItem(pendingKey);
    if (
      pending &&
      pending.destination === location.pathname &&
      Date.now() - pending.savedAt < 60_000 &&
      isReturnView(pending.returnView)
    ) {
      returnView = pending.returnView;
    }
    history.replaceState({ ...history.state, portfolioReturn: returnView }, "");
  } catch {
    // A direct visit (or unavailable storage) closes to the work overview.
  }
  return returnView;
}
