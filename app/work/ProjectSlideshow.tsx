"use client";

import Image from "next/image";
import { animate } from "motion/mini";
import { spring } from "motion";
import { flushSync } from "react-dom";
import { swipeDestination } from "./swipe";
import { useEffect, useRef, useState } from "react";
import HorizontalScroll from "../../src/components/HorizontalScroll";
import { Tooltip } from "../../src/components/Tooltip";
import Icon from "../../src/components/Icon";
import { iconControl } from "../../src/components/buttonStyles";

import type { Slideshow } from "./work-data";

export default function ProjectSlideshow({
  images,
  caption,
  thumbnails = false,
}: Slideshow) {
  const swipe = useRef<{
    id: number;
    x: number;
    y: number;
    origin: number;
    lastX: number;
    lastTime: number;
    velocity: number;
    horizontal: boolean;
  } | null>(null);
  const track = useRef<HTMLDivElement>(null);
  const offset = useRef(0);
  const settling = useRef<ReturnType<typeof animate> | null>(null);
  const fadeFrame = useRef(0);
  const sequence = useRef(0);
  const [swiping, setSwiping] = useState(false);
  const [disableFade, setDisableFade] = useState(false);
  const [touching, setTouching] = useState(false);
  const thumbnailList = useRef<HTMLDivElement>(null);
  const container = useRef<HTMLElement>(null);
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [paused, setPaused] = useState(false);
  const [explicitPlay, setExplicitPlay] = useState(false);
  const pointerAction = useRef<boolean | null>(null);
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);
  const [loaded, setLoaded] = useState<string[]>([]);

  function moveTrack(value: number) {
    offset.current = value;
    if (track.current) track.current.style.transform = `translateX(${value}px)`;
  }

  function selectImage(next: number) {
    sequence.current++;
    settling.current?.stop();
    cancelAnimationFrame(fadeFrame.current);
    swipe.current = null;
    moveTrack(0);
    setTouching(false);
    setSwiping(false);
    setIndex(next);
    fadeFrame.current = requestAnimationFrame(() => setDisableFade(false));
  }

  function settle(direction: -1 | 0 | 1, velocity = 0) {
    const element = track.current;
    if (!element) return;
    const target = -direction * element.clientWidth;
    const distance = target - offset.current;
    const request = ++sequence.current;
    swipe.current = null;
    settling.current?.stop();
    const animation = animate(
      element,
      {
        transform: [
          `translateX(${offset.current}px)`,
          `translateX(${target}px)`,
        ],
      },
      reducedMotion
        ? { duration: 0 }
        : {
            type: spring,
            stiffness: 380,
            damping: 32,
            // Transform keyframes use a 0–100 interpolation range.
            velocity: distance ? (velocity * 1000 * 100) / distance : 0,
          }
    );
    settling.current = animation;
    void animation.then(() => {
      if (request !== sequence.current) return;
      settling.current = null;
      moveTrack(0);
      flushSync(() => {
        if (direction)
          setIndex(
            (current) => (current + direction + images.length) % images.length
          );
        setSwiping(false);
        setTouching(false);
      });
      fadeFrame.current = requestAnimationFrame(() => setDisableFade(false));
    });
  }

  useEffect(
    () => () => {
      sequence.current++;
      settling.current?.stop();
      cancelAnimationFrame(fadeFrame.current);
    },
    []
  );

  // Once horizontal intent wins, Safari must not steal the gesture for page scrolling.
  useEffect(() => {
    const element = track.current?.parentElement;
    if (!element) return;
    const lockScroll = (event: TouchEvent) => {
      const gesture = swipe.current;
      const touch = event.touches[0];
      if (!gesture || event.touches.length !== 1 || !touch) return;
      const dx = touch.clientX - gesture.x;
      const dy = touch.clientY - gesture.y;
      if (
        gesture.horizontal ||
        (Math.abs(dx) >= 8 && Math.abs(dx) > Math.abs(dy))
      ) {
        if (event.cancelable) event.preventDefault();
      }
    };
    element.addEventListener("touchmove", lockScroll, { passive: false });
    return () => element.removeEventListener("touchmove", lockScroll);
  }, []);

  useEffect(() => {
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(motion.matches);
    update();
    motion.addEventListener("change", update);
    const observer = new IntersectionObserver(([entry]) =>
      setVisible(entry.isIntersecting)
    );
    if (container.current) observer.observe(container.current);
    return () => {
      motion.removeEventListener("change", update);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const list = thumbnailList.current;
    const viewport = list?.parentElement;
    const selected = list?.children[index] as HTMLElement | undefined;
    if (!viewport || !selected) return;
    const reveal = () => {
      if (!viewport.clientWidth) return;
      // Leave room for the scroll-edge fade, so the active thumbnail stays fully visible.
      const left = Math.max(0, selected.offsetLeft - 24);
      const right = selected.offsetLeft + selected.offsetWidth + 24;
      if (left < viewport.scrollLeft)
        viewport.scrollTo({
          left,
          behavior: reducedMotion ? "instant" : "smooth",
        });
      else if (right > viewport.scrollLeft + viewport.clientWidth)
        viewport.scrollTo({
          left: right - viewport.clientWidth,
          behavior: reducedMotion ? "instant" : "smooth",
        });
    };
    reveal();
    const observer = new ResizeObserver(reveal);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, [index, reducedMotion, hovered]);

  const rotationEnabled = !paused && (!reducedMotion || explicitPlay);

  useEffect(() => {
    if (
      hovered ||
      touching ||
      !rotationEnabled ||
      !visible ||
      images.length < 2 ||
      loaded.length < images.length
    )
      return;
    const timer = setInterval(
      () => {
        if (!document.hidden)
          setIndex((current) => (current + 1) % images.length);
      },
      thumbnails ? 4000 : 3000
    );
    return () => clearInterval(timer);
  }, [
    hovered,
    touching,
    rotationEnabled,
    visible,
    loaded.length,
    images.length,
    thumbnails,
    index,
  ]);

  return (
    <figure
      ref={container}
      className="mt-8"
      aria-label={caption}
      data-no-project-swipe
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") setHovered(true);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === "mouse") setHovered(false);
      }}
      onFocusCapture={(event) => {
        // Entering with the keyboard stops rotation until explicitly resumed.
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setPaused(true);
        }
      }}
    >
      <div
        className={`group/gallery relative overflow-hidden rounded-lg ${
          thumbnails ? "aspect-[3/2]" : "aspect-[65/32]"
        }`}
      >
        <div
          className="absolute inset-0 touch-pan-y touch-pinch-zoom"
          onPointerDown={(event) => {
            if (event.pointerType !== "touch" || images.length < 2) return;
            if (!event.isPrimary) {
              if (swipe.current) settle(0);
              return;
            }
            sequence.current++;
            if (settling.current && track.current) {
              const position = new DOMMatrixReadOnly(
                getComputedStyle(track.current).transform
              ).m41;
              settling.current.stop();
              settling.current = null;
              moveTrack(position);
            }
            cancelAnimationFrame(fadeFrame.current);
            swipe.current = {
              id: event.pointerId,
              x: event.clientX,
              y: event.clientY,
              origin: offset.current,
              lastX: event.clientX,
              lastTime: event.timeStamp,
              velocity: 0,
              horizontal: false,
            };
            setTouching(true);
          }}
          onPointerMove={(event) => {
            const gesture = swipe.current;
            if (!gesture || gesture.id !== event.pointerId) return;
            const dx = event.clientX - gesture.x;
            const dy = event.clientY - gesture.y;
            if (!gesture.horizontal) {
              if (Math.max(Math.abs(dx), Math.abs(dy)) < 8) return;
              if (Math.abs(dy) >= Math.abs(dx)) {
                settle(0);
                return;
              }
              gesture.horizontal = true;
              event.currentTarget.setPointerCapture(event.pointerId);
              setSwiping(true);
              setDisableFade(true);
            }
            const elapsed = event.timeStamp - gesture.lastTime;
            if (elapsed > 0)
              gesture.velocity = (event.clientX - gesture.lastX) / elapsed;
            gesture.lastX = event.clientX;
            gesture.lastTime = event.timeStamp;
            const width = event.currentTarget.clientWidth;
            moveTrack(Math.max(-width, Math.min(width, gesture.origin + dx)));
          }}
          onPointerUp={(event) => {
            const gesture = swipe.current;
            if (!gesture || gesture.id !== event.pointerId) return;
            const velocity =
              event.timeStamp - gesture.lastTime < 100 ? gesture.velocity : 0;
            settle(
              gesture.horizontal
                ? swipeDestination(
                    // Catching a returning spring must not give a short drag
                    // a head start toward selecting another photo.
                    event.clientX - gesture.x,
                    velocity,
                    event.currentTarget.clientWidth
                  )
                : 0,
              velocity
            );
          }}
          onPointerCancel={(event) => {
            if (swipe.current?.id === event.pointerId) settle(0);
          }}
          onLostPointerCapture={(event) => {
            // Touch initially captures the image. Transferring capture to
            // this viewport bubbles a capture-loss event from that image;
            // only losing the viewport's own capture cancels the swipe.
            if (
              event.target === event.currentTarget &&
              swipe.current?.id === event.pointerId
            )
              settle(0);
          }}
        >
          <div ref={track} className="absolute inset-0">
            {images.map((image, slide) => {
              let position = (slide - index + images.length) % images.length;
              if (position > images.length / 2) position -= images.length;
              return (
                <Image
                  key={image.src}
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(min-width: 1280px) 704px, (min-width: 768px) 480px, 100vw"
                  loading="lazy"
                  draggable={false}
                  style={{
                    transform: swiping
                      ? `translateX(${position * 100}%)`
                      : undefined,
                    transition: disableFade ? "none" : undefined,
                    opacity: swiping
                      ? Math.abs(position) <= 1
                        ? 1
                        : 0
                      : undefined,
                  }}
                  aria-hidden={slide !== index}
                  className={`transition-opacity duration-1000 ease-in-out motion-reduce:transition-none ${
                    thumbnails ? "object-cover" : "object-contain"
                  } ${slide === index ? "opacity-100" : "opacity-0"}`}
                  onLoad={() =>
                    setLoaded((current) =>
                      current.includes(image.src)
                        ? current
                        : [...current, image.src]
                    )
                  }
                />
              );
            })}
          </div>
        </div>
        {thumbnails && (
          <div className="absolute inset-x-0 bottom-0 z-10 hidden bg-linear-to-b from-transparent to-black/95 px-3 pb-3 pt-8 opacity-0 transition-opacity duration-200 group-hover/gallery:opacity-100 group-focus-within/gallery:opacity-100 md:[@media(hover:hover)_and_(pointer:fine)]:block">
            <HorizontalScroll label="Choose a team photo">
              <div ref={thumbnailList} className="relative flex w-max gap-2">
                {images.map((image, slide) => (
                  <button
                    key={image.src}
                    type="button"
                    aria-label={`Show photo ${slide + 1}: ${image.alt}`}
                    aria-pressed={slide === index}
                    className="relative size-8 shrink-0 overflow-hidden rounded-md opacity-50 transition-opacity hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none aria-pressed:opacity-100 md:size-10"
                    onClick={() => {
                      selectImage(slide);
                    }}
                  >
                    <Image
                      src={image.src}
                      alt=""
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                    <span
                      className={`pointer-events-none absolute inset-0 rounded-md border-2 ${
                        slide === index ? "border-white" : "border-transparent"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </HorizontalScroll>
          </div>
        )}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20 rounded-[inherit] border border-[var(--media-border)]"
        />
      </div>
      <figcaption className="mt-3 flex items-start justify-between gap-4 text-sm leading-relaxed text-[var(--muted)]">
        <div className="grid min-w-0 flex-1">
          {images.map((image, slide) => (
            <p
              key={image.src}
              aria-hidden={slide !== index}
              title={image.caption ?? caption}
              className={`truncate col-start-1 row-start-1 transition-[opacity,filter] duration-1000 ease-in-out motion-reduce:transition-none ${
                slide === index
                  ? "opacity-70 blur-none"
                  : "pointer-events-none opacity-0 blur-xs"
              }`}
            >
              {image.caption ?? caption}
            </p>
          ))}
        </div>
        <div className="flex h-lh shrink-0 items-center gap-px">
          <Tooltip content={rotationEnabled ? "Pause" : "Play"}>
            <button
              type="button"
              className={iconControl}
              aria-label={
                rotationEnabled ? "Pause slideshow" : "Resume slideshow"
              }
              onPointerDown={() => {
                // Remember intent before focusing the button pauses rotation.
                pointerAction.current = rotationEnabled;
              }}
              onPointerCancel={() => {
                pointerAction.current = null;
              }}
              onClick={(event) => {
                const pause =
                  event.detail !== 0
                    ? pointerAction.current ?? rotationEnabled
                    : rotationEnabled;
                pointerAction.current = null;
                setPaused(pause);
                if (!pause) setExplicitPlay(true);
              }}
            >
              <Icon name={rotationEnabled ? "pause" : "play"} />
            </button>
          </Tooltip>
          <Tooltip content="Previous">
            <button
              type="button"
              className={iconControl}
              aria-label="Previous image"
              onClick={() =>
                selectImage((index + images.length - 1) % images.length)
              }
            >
              <Icon name="chevron-left" />
            </button>
          </Tooltip>
          <Tooltip content="Next">
            <button
              type="button"
              className={iconControl}
              aria-label="Next image"
              onClick={() => selectImage((index + 1) % images.length)}
            >
              <Icon name="chevron-right" />
            </button>
          </Tooltip>
        </div>
      </figcaption>
    </figure>
  );
}
