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
import { useSiteNavigation } from "@/components/SiteNavigation";
import { useSwipeGesture } from "@/hooks/useSwipeGesture";
const neighborClass =
  "pointer-events-none absolute w-full px-4 [&_[data-work-visual]]:[view-transition-name:none!important] [&_[data-site-footer]]:[view-transition-name:none!important]";

const touchQuery = "(any-pointer: coarse)";
const settling = { type: spring, duration: 0.5, bounce: 0.2 };
const reducesMotion = () =>
  matchMedia("(prefers-reduced-motion: reduce)").matches;
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
  const sequence = useRef(0);
  const committed = useRef(false);
  const suppressClick = useRef(false);
  const recovery = useRef<ReturnType<typeof setTimeout>>();
  const [neighbors, setNeighbors] = useState<{
    width: number;
    top: number;
  } | null>(null);

  const swipe = useSwipeGesture(viewport, {
    canStart,
    onStart: () => {
      ++sequence.current;
      stopMotion();
      suppressClick.current = false;
      if (!reducesMotion())
        setNeighbors({ width: innerWidth, top: window.scrollY });
      return position.current;
    },
    onMove: (position) => {
      suppressClick.current = true;
      if (!reducesMotion()) moveTo(position);
    },
    onEnd: finish,
    onCancel: reset,
  });

  const { clear, isActive } = swipe;

  useEffect(() => {
    const touch = matchMedia(touchQuery);
    const prefetch = () => {
      if (touch.matches) {
        router.prefetch(previousHref);
        router.prefetch(nextHref);
      }
    };
    prefetch();
    touch.addEventListener("change", prefetch);
    return () => touch.removeEventListener("change", prefetch);
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
    let viewportWidth = window.innerWidth;
    const interrupt = () => {
      if (!isActive() && !committed.current && position.current === 0) return;
      ++sequence.current;
      clear();
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
  }, [clear, isActive]);

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
    clear();
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

  function canStart(event: PointerEvent<HTMLElement>) {
    if (!committed.current) suppressClick.current = false;
    if (
      committed.current ||
      document.fullscreenElement ||
      event.clientX < 24 ||
      event.clientX > innerWidth - 24 ||
      (event.target instanceof Element &&
        event.target.closest(
          'a, button, input, textarea, select, [contenteditable], [role="slider"], [role="dialog"], [data-no-project-swipe], video[controls]'
        )) ||
      window.getSelection()?.isCollapsed === false
    )
      return false;
    return true;
  }

  function finish(direction: -1 | 0 | 1) {
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
      className="-mx-4 w-auto flex-1 overflow-x-clip touch-auto"
      onPointerDownCapture={swipe.onPointerDown}
      onPointerMove={swipe.onPointerMove}
      onPointerUp={swipe.onPointerUp}
      onPointerCancel={swipe.onPointerCancel}
      onLostPointerCapture={swipe.onLostPointerCapture}
      onClickCapture={(event) => {
        if (suppressClick.current) {
          event.preventDefault();
          event.stopPropagation();
          suppressClick.current = false;
        }
      }}
    >
      {/* Clip at the browser edges; page gutters travel with each project. */}
      <div ref={track} className="relative px-4" data-project-swipe>
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
