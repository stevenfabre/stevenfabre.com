"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/** Native touch scrolling with mouse dragging; links remain clickable until a drag begins. */
export default function HorizontalScroll({
  children,
  label,
  snap = false,
}: {
  children: ReactNode;
  label: string;
  snap?: boolean;
}) {
  const drag = useRef<{ x: number; scroll: number; moved: boolean } | null>(
    null
  );
  const [overflow, setOverflow] = useState(false);
  const suppressClick = useRef(false);
  const viewport = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = viewport.current;
    if (!element) return;
    const updateEdges = () => {
      const hasOverflow = element.scrollWidth > element.clientWidth + 1;
      setOverflow(hasOverflow);
      element.toggleAttribute("data-overflow", hasOverflow);
      element.style.setProperty(
        "--fade-left",
        element.scrollLeft > 1 ? "24px" : "0px"
      );
      element.style.setProperty(
        "--fade-right",
        element.scrollWidth - element.clientWidth - element.scrollLeft > 1
          ? "24px"
          : "0px"
      );
    };
    const observer = new ResizeObserver(updateEdges);
    observer.observe(element);
    if (element.firstElementChild) observer.observe(element.firstElementChild);
    element.addEventListener("scroll", updateEdges, { passive: true });
    updateEdges();
    return () => {
      observer.disconnect();
      element.removeEventListener("scroll", updateEdges);
    };
  }, []);

  return (
    <div
      ref={viewport}
      className={(snap ? "snap-x snap-mandatory " : "") + "data-[overflow]:cursor-grab data-[overflow]:active:cursor-grabbing data-[overflow]:active:[&_a]:cursor-grabbing outline-none focus-visible:bg-black/5 dark:focus-visible:bg-white/5 select-none overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [mask-image:linear-gradient(to_right,transparent,black_var(--fade-left,0px),black_calc(100%_-_var(--fade-right,0px)),transparent)]"}
      tabIndex={overflow ? 0 : -1}
      role="region"
      aria-label={label}
      data-no-project-swipe
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight")
          event.stopPropagation();
      }}
      onDragStart={(event) => event.preventDefault()}
      onPointerDown={(event) => {
        if (!overflow || event.pointerType !== "mouse" || event.button !== 0)
          return;
        suppressClick.current = false;
        drag.current = {
          x: event.clientX,
          scroll: event.currentTarget.scrollLeft,
          moved: false,
        };
      }}
      onPointerMove={(event) => {
        const current = drag.current;
        if (!current) return;
        const distance = event.clientX - current.x;
        if (!current.moved && Math.abs(distance) < 5) return;
        current.moved = true;
        suppressClick.current = true;
        event.currentTarget.setPointerCapture(event.pointerId);
        event.preventDefault();
        event.currentTarget.scrollLeft = current.scroll - distance;
      }}
      onPointerUp={() => {
        drag.current = null;
      }}
      onPointerCancel={() => {
        drag.current = null;
      }}
      onLostPointerCapture={() => {
        drag.current = null;
      }}
      onPointerLeave={() => {
        if (!drag.current?.moved) drag.current = null;
      }}
      onClickCapture={(event) => {
        if (!suppressClick.current) return;
        event.preventDefault();
        event.stopPropagation();
        suppressClick.current = false;
      }}
    >
      {children}
    </div>
  );
}
