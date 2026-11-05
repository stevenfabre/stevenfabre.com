import type { MouseEvent } from "react";

type ReturnView = { href: string; steps: number };
const pendingKey = "portfolio-navigation";
const fallback: ReturnView = { href: "/work", steps: 0 };

function isReturnView(value: unknown): value is ReturnView {
  if (!value || typeof value !== "object") return false;
  const { href, steps } = value as ReturnView;
  return (
    typeof href === "string" &&
    /^(\/|\/work)([?#].*)?$/.test(href) &&
    Number.isInteger(steps) &&
    steps >= 0
  );
}

export function isPlainNavigation(event: MouseEvent<HTMLAnchorElement>) {
  return (
    !event.defaultPrevented &&
    event.button === 0 &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.shiftKey &&
    !event.altKey &&
    (!event.currentTarget.target || event.currentTarget.target === "_self")
  );
}

// Store the return view per history entry. Back/forward and reloads therefore
// keep the correct distance, even after browsing several fullscreen projects.
export function rememberProjectNavigation(
  event: MouseEvent<HTMLAnchorElement>,
  clientNavigation = false
) {
  if (!isPlainNavigation(event)) return;
  const destination = new URL(event.currentTarget.href);
  if (
    destination.origin !== location.origin ||
    !destination.pathname.startsWith("/work/")
  )
    return;
  const overview = location.pathname === "/" || location.pathname === "/work";
  const current = history.state?.portfolioReturn;
  const returnView: ReturnView = overview
    ? { href: location.pathname + location.search + location.hash, steps: 1 }
    : isReturnView(current) && current.steps > 0
    ? { ...current, steps: current.steps + 1 }
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
        clientNavigation,
        from: location.href.split("#")[0],
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
      (pending.clientNavigation ||
        pending.from === document.referrer.split("#")[0]) &&
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
