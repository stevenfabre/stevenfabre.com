"use client";

import { animate } from "motion/mini";
import { spring } from "motion";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useRef,
  useState,
  type PointerEvent,
  type ReactNode,
} from "react";
import { useSiteNavigation } from "../../src/components/SiteNavigation";
import { swipeDestination } from "./swipe";
const neighborClass =
  "pointer-events-none absolute w-full max-md:px-[var(--page-padding)] [&_[data-work-visual]]:[view-transition-name:none!important] [&_[data-site-footer]]:[view-transition-name:none!important]";

const mobileQuery = "(max-width: 767px)";
const settling = { type: spring, duration: 0.5, bounce: 0.2 };
const reducesMotion = () =>
  matchMedia("(prefers-reduced-motion: reduce)").matches;
type Gesture = {
  id: number;
  startX: number;
  startY: number;
  origin: number;
  lastX: number;
  lastTime: number;
  velocity: number;
  horizontal: boolean;
};

// Set the DOM property: React 18 and Next's bundled renderer differ on inert attributes.
function makePreviewInert(element: HTMLDivElement | null) {
  if (element) element.inert = true;
}

export default function ProjectSwipe({
  children,
  previous,
  next,
  previousHref,
  nextHref,
}: {
  children: ReactNode;
  previous: ReactNode;
  next: ReactNode;
  previousHref: string;
  nextHref: string;
}) {
  const navigate = useSiteNavigation();
  const router = useRouter();
  const track = useRef<HTMLDivElement>(null);
  const position = useRef(0);
  const animation = useRef<ReturnType<typeof animate> | null>(null);
  const viewport = useRef<HTMLElement>(null);
  const gesture = useRef<Gesture | null>(null);
  const sequence = useRef(0);
  const committed = useRef(false);
  const suppressClick = useRef(false);
  const recovery = useRef<ReturnType<typeof setTimeout>>();
  const [neighbors, setNeighbors] = useState<{
    width: number;
    top: number;
  } | null>(null);

  useEffect(() => {
    const mobile = matchMedia(mobileQuery);
    const prefetch = () => {
      if (mobile.matches) {
        router.prefetch(previousHref);
        router.prefetch(nextHref);
      }
    };
    prefetch();
    mobile.addEventListener("change", prefetch);
    return () => mobile.removeEventListener("change", prefetch);
  }, [router, previousHref, nextHref]);

  useEffect(
    () => () => {
      ++sequence.current;
      animation.current?.cancel();
      clearTimeout(recovery.current);
    },
    []
  );

  useEffect(() => {
    const element = viewport.current;
    if (!element) return;

    // Pointer capture alone doesn't stop Safari taking over for page scrolling.
    // Cancel native panning once horizontal intent is established, including
    // the first touchmove, while leaving vertical drags and pinch zoom native.
    const lockHorizontalSwipe = (event: TouchEvent) => {
      const current = gesture.current;
      if (!current || event.touches.length !== 1) return;
      const touch = event.touches[0];
      const dx = Math.abs(touch.clientX - current.startX);
      const dy = Math.abs(touch.clientY - current.startY);
      if (event.cancelable && (current.horizontal || (dx >= 8 && dx > dy)))
        event.preventDefault();
    };

    element.addEventListener("touchmove", lockHorizontalSwipe, {
      passive: false,
    });
    return () => element.removeEventListener("touchmove", lockHorizontalSwipe);
  }, []);

  useEffect(() => {
    let viewportWidth = window.innerWidth;
    const interrupt = () => {
      if (!gesture.current && !committed.current && position.current === 0)
        return;
      ++sequence.current;
      gesture.current = null;
      committed.current = false;
      animation.current?.cancel();
      position.current = 0;
      if (track.current) track.current.style.transform = "translate3d(0, 0, 0)";
      setNeighbors(null);
      clearTimeout(recovery.current);
    };
    const outside = (event: globalThis.PointerEvent) => {
      if (
        event.target instanceof Node &&
        !viewport.current?.contains(event.target)
      )
        interrupt();
    };
    const resize = () => {
      // Safari's browser chrome can change viewport height mid-gesture.
      // Only a width change invalidates our horizontal swipe geometry.
      if (window.innerWidth === viewportWidth) return;
      viewportWidth = window.innerWidth;
      interrupt();
    };
    document.addEventListener("pointerdown", outside, true);
    window.addEventListener("keydown", interrupt, true);
    window.addEventListener("resize", resize);
    window.addEventListener("blur", interrupt);
    return () => {
      document.removeEventListener("pointerdown", outside, true);
      window.removeEventListener("keydown", interrupt, true);
      window.removeEventListener("resize", resize);
      window.removeEventListener("blur", interrupt);
    };
  }, []);

  function moveTo(value: number) {
    position.current = value;
    if (track.current)
      track.current.style.transform = `translate3d(${value}px, 0, 0)`;
  }

  function stopMotion() {
    if (!animation.current || !track.current) return;
    // Capture the visible spring position so a new drag continues from it.
    const value = new DOMMatrixReadOnly(
      getComputedStyle(track.current).transform
    ).m41;
    animation.current.cancel();
    animation.current = null;
    moveTo(value);
  }

  function settle(
    value: number,
    request: number,
    complete: () => void,
    committing = false
  ) {
    if (!track.current) return;
    const controls = animate(
      track.current,
      { transform: `translate3d(${value}px, 0, 0)` },
      // A spring’s invisible settling tail must not delay the next swipe.
      committing ? { duration: 0.22, ease: [0.22, 1, 0.36, 1] } : settling
    );
    animation.current = controls;
    void controls.then(() => {
      if (sequence.current !== request) return;
      moveTo(value);
      animation.current = null;
      complete();
    });
  }

  function reset() {
    gesture.current = null;
    committed.current = false;
    const request = ++sequence.current;
    stopMotion();
    if (reducesMotion()) {
      moveTo(0);
      setNeighbors(null);
    } else {
      settle(0, request, () => setNeighbors(null));
    }
  }

  function start(event: PointerEvent<HTMLElement>) {
    // Leave screen-edge swipes to browser history, and nested controls to
    // their own gestures. A second finger cancels rather than taking over.
    if (!event.isPrimary) {
      if (gesture.current) reset();
      return;
    }
    if (!committed.current) suppressClick.current = false;
    if (
      committed.current ||
      event.button !== 0 ||
      !matchMedia(mobileQuery).matches ||
      document.fullscreenElement ||
      event.clientX < 24 ||
      event.clientX > innerWidth - 24 ||
      (event.target instanceof Element &&
        event.target.closest(
          'a, button, input, textarea, select, [contenteditable], [role="slider"], [role="dialog"], [data-no-project-swipe], video[controls]'
        )) ||
      window.getSelection()?.isCollapsed === false
    )
      return;
    ++sequence.current;
    stopMotion();
    suppressClick.current = false;
    gesture.current = {
      id: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      origin: position.current,
      lastX: event.clientX,
      lastTime: event.timeStamp,
      velocity: 0,
      horizontal: false,
    };
    if (!reducesMotion())
      setNeighbors({ width: innerWidth, top: window.scrollY });
  }

  function move(event: PointerEvent<HTMLElement>) {
    const current = gesture.current;
    if (!current || current.id !== event.pointerId) return;
    const dx = event.clientX - current.startX;
    const dy = event.clientY - current.startY;
    if (!current.horizontal) {
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 8) return;
      if (Math.abs(dy) >= Math.abs(dx)) {
        reset();
        return;
      }
      current.horizontal = true;
      event.currentTarget.setPointerCapture(event.pointerId);
      suppressClick.current = true;
    }
    const elapsed = event.timeStamp - current.lastTime;
    if (elapsed > 0)
      current.velocity = (event.clientX - current.lastX) / elapsed;
    current.lastX = event.clientX;
    current.lastTime = event.timeStamp;
    if (!reducesMotion())
      moveTo(Math.max(-innerWidth, Math.min(innerWidth, current.origin + dx)));
  }

  function finish(event: PointerEvent<HTMLElement>) {
    const current = gesture.current;
    if (!current || current.id !== event.pointerId) return;
    gesture.current = null;
    if (!current.horizontal) {
      reset();
      return;
    }
    // Judge intent from this gesture alone. Catching a returning spring
    // should not give a tiny new drag a head start toward navigation.
    const offset = event.clientX - current.startX;
    // A held drag should not inherit the velocity of its last movement.
    const velocity =
      event.timeStamp - current.lastTime < 100 ? current.velocity : 0;
    const direction = swipeDestination(offset, velocity, innerWidth);
    if (!direction) {
      reset();
      return;
    }
    committed.current = true;
    const href = direction === 1 ? nextHref : previousHref;
    const request = ++sequence.current;
    const complete = () => {
      if (sequence.current !== request) return;
      const incoming = track.current?.querySelector<HTMLElement>(
        `[data-swipe-preview="${
          direction === 1 ? "next" : "previous"
        }"] [data-work-visual]`
      );
      navigate(href, { animate: false, swipeVisual: incoming });
      // Restore an operable current page if navigation never commits.
      recovery.current = setTimeout(reset, 5000);
    };
    if (reducesMotion()) complete();
    else settle(-direction * innerWidth, request, complete, true);
  }

  return (
    <main
      ref={viewport}
      className="w-full flex-1 overflow-x-clip max-md:-mx-[var(--page-padding)] max-md:w-auto max-md:touch-pan-y max-md:touch-pinch-zoom"
      onPointerDownCapture={start}
      onPointerMove={move}
      onPointerUp={finish}
      onPointerCancel={() => {
        if (gesture.current) reset();
      }}
      onLostPointerCapture={(event) => {
        // Touch implicitly captures the original target (often the video).
        // Moving capture to this viewport emits a bubbling capture-loss event
        // from that child; only losing the viewport's own capture cancels us.
        if (
          event.target === event.currentTarget &&
          gesture.current?.id === event.pointerId
        )
          reset();
      }}
      onClickCapture={(event) => {
        if (suppressClick.current) {
          event.preventDefault();
          event.stopPropagation();
          suppressClick.current = false;
        }
      }}
    >
      {/* Clip at the browser edges; page gutters travel with each project. */}
      <div
        ref={track}
        className="relative max-md:px-[var(--page-padding)]"
        data-project-swipe
      >
        {neighbors && (
          <div
            className={neighborClass}
            aria-hidden="true"
            ref={makePreviewInert}
            style={{ left: -neighbors.width, top: neighbors.top }}
            data-swipe-preview="previous"
          >
            {previous}
          </div>
        )}
        {children}
        {neighbors && (
          <div
            className={neighborClass}
            aria-hidden="true"
            ref={makePreviewInert}
            style={{ left: neighbors.width, top: neighbors.top }}
            data-swipe-preview="next"
          >
            {next}
          </div>
        )}
      </div>
    </main>
  );
}
