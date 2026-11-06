"use client";

import { useState, type PointerEvent } from "react";
import { ChevronsLeftRight } from "lucide-react";
import { imagePath, type ProjectVisual } from "./work-data";

/** The normal image is the after state; comparison supplies the before image. */
export default function BeforeAfter({ visual }: { visual: ProjectVisual }) {
  const [position, setPosition] = useState(50);
  const [handleY, setHandleY] = useState(50);
  const [returning, setReturning] = useState(false);
  const transition = returning
    ? "var(--page-transition-duration) var(--ease-out)"
    : "none";
  const before = visual.comparison;
  if (!before) return null;
  function move(event: PointerEvent<HTMLDivElement>) {
    if (
      event.pointerType !== "mouse" &&
      !event.currentTarget.hasPointerCapture(event.pointerId)
    )
      return;
    const bounds = event.currentTarget.getBoundingClientRect();
    setReturning(false);
    setHandleY(
      (Math.max(16, Math.min(bounds.height - 16, event.clientY - bounds.top)) /
        bounds.height) *
        100
    );
    setPosition(
      Math.max(
        0,
        Math.min(100, ((event.clientX - bounds.left) / bounds.width) * 100)
      )
    );
  }
  return (
    <div
      data-no-project-swipe
      className="relative h-full w-full touch-pan-y select-none overflow-hidden"
      style={{ aspectRatio: visual.aspectRatio }}
      onPointerMove={move}
      onPointerLeave={() => {
        setReturning(true);
        setPosition(50);
        setHandleY(50);
      }}
      onPointerDown={(event) => {
        event.currentTarget.setPointerCapture(event.pointerId);
        move(event);
      }}
      onPointerUp={(event) =>
        event.currentTarget.releasePointerCapture(event.pointerId)
      }
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imagePath(visual)}
        alt={visual.imageAlt || `${visual.title}, after`}
        draggable={false}
      />
      <div
        className="pointer-events-none absolute inset-0 motion-reduce:!transition-none"
        style={{
          clipPath: `inset(0 ${100 - position}% 0 0)`,
          transition: returning ? `clip-path ${transition}` : "none",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/work/media/${before.file}.png`}
          alt={before.alt}
          draggable={false}
          className="h-full w-full object-contain"
        />
        <span className="absolute left-3 top-3 rounded-full bg-black/65 px-3 py-1 text-xs font-medium text-white">
          Before
        </span>
      </div>
      <div
        className="pointer-events-none absolute inset-0 motion-reduce:!transition-none"
        style={{
          clipPath: `inset(0 0 0 ${position}%)`,
          transition: returning ? `clip-path ${transition}` : "none",
        }}
      >
        <span className="absolute right-3 top-3 rounded-full bg-black/65 px-3 py-1 text-xs font-medium text-white">
          After
        </span>
      </div>
      <div
        role="slider"
        tabIndex={0}
        aria-label={`${visual.title}: before and after`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(position)}
        aria-valuetext={`${Math.round(position)}% before`}
        aria-orientation="horizontal"
        className="absolute inset-y-0 z-10 w-px touch-none bg-white shadow-[0_0_2px_1px_#0002] motion-reduce:!transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-500"
        style={{
          left: `${position}%`,
          transition: returning ? `left ${transition}` : "none",
        }}
        onKeyDown={(event) => {
          if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key))
            return;
          event.preventDefault();
          event.stopPropagation();
          setReturning(false);
          setPosition((value) =>
            event.key === "Home"
              ? 0
              : event.key === "End"
              ? 100
              : Math.max(
                  0,
                  Math.min(100, value + (event.key === "ArrowRight" ? 5 : -5))
                )
          );
        }}
      >
        <span
          className="absolute left-1/2 flex [@media(hover:hover)_and_(pointer:fine)]:hidden size-7 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full bg-white text-neutral-800 shadow-sm motion-reduce:!transition-none"
          style={{
            top: `${handleY}%`,
            transition: returning ? `top ${transition}` : "none",
          }}
        >
          <ChevronsLeftRight size={14} aria-hidden="true" />
        </span>
      </div>
    </div>
  );
}
