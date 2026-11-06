"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import HorizontalScroll from "../../src/components/HorizontalScroll";
import Icon from "../../src/components/Icon";
import { iconControl } from "../../src/components/buttonStyles";

export type Slideshow = {
  images: { src: string; alt: string; caption?: string }[];
  caption: string;
  thumbnails?: boolean;
};

export default function ProjectSlideshow({ images, caption, thumbnails = false }: Slideshow) {
  const swipe = useRef<{ id: number; x: number; y: number } | null>(null);
  const [touching, setTouching] = useState(false);
  const thumbnailList = useRef<HTMLDivElement>(null);
  const container = useRef<HTMLElement>(null);
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [paused, setPaused] = useState(false);
  const [explicitPlay, setExplicitPlay] = useState(false);
  const pointerAction = useRef<boolean | null>(null);
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);
  const [loaded, setLoaded] = useState<string[]>([]);

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
    const left = selected.offsetLeft;
    const right = left + selected.offsetWidth;
    if (left < viewport.scrollLeft)
      viewport.scrollTo({ left, behavior: reducedMotion ? "instant" : "smooth" });
    else if (right > viewport.scrollLeft + viewport.clientWidth)
      viewport.scrollTo({ left: right - viewport.clientWidth, behavior: reducedMotion ? "instant" : "smooth" });
  }, [index, reducedMotion]);

  const rotationEnabled = !(thumbnails ? focused : paused) && (!reducedMotion || explicitPlay);

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
    const timer = setInterval(() => {
      if (!document.hidden)
        setIndex((current) => (current + 1) % images.length);
    }, thumbnails ? 4000 : 3000);
    return () => clearInterval(timer);
  }, [hovered, touching, rotationEnabled, visible, loaded.length, images.length, thumbnails, index]);

  return (
    <figure
      ref={container}
      className="mt-8"
      aria-label={caption}
      data-no-project-swipe
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={(event) => {
        // Entering with the keyboard stops rotation until explicitly resumed.
        if (!event.currentTarget.contains(event.relatedTarget)) {
          if (thumbnails) setFocused(true);
          else setPaused(true);
        }
      }}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
      }}
    >
      <div className={`group/gallery relative overflow-hidden rounded-lg ${thumbnails ? "aspect-[3/2]" : "aspect-[65/32]"}`}>
        <div
          className={thumbnails ? "absolute inset-0 touch-pan-y" : "absolute inset-0"}
          onPointerDown={(event) => {
            if (!thumbnails || event.pointerType !== "touch") return;
            if (!event.isPrimary) {
              swipe.current = null;
              setTouching(false);
              return;
            }
            swipe.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
            setTouching(true);
            event.currentTarget.setPointerCapture(event.pointerId);
          }}
          onPointerUp={(event) => {
            const start = swipe.current;
            swipe.current = null;
            setTouching(false);
            if (!start || start.id !== event.pointerId) return;
            const dx = event.clientX - start.x;
            const dy = event.clientY - start.y;
            const threshold = Math.max(48, event.currentTarget.clientWidth * 0.15);
            if (Math.abs(dx) < threshold || Math.abs(dx) <= Math.abs(dy)) return;
            setIndex((current) => (current + (dx < 0 ? 1 : -1) + images.length) % images.length);
          }}
          onPointerCancel={() => {
            swipe.current = null;
            setTouching(false);
          }}
          onLostPointerCapture={() => {
            swipe.current = null;
            setTouching(false);
          }}
        >
        {images.map((image, slide) => (
          <Image
            key={image.src}
            src={image.src}
            alt={image.alt}
            fill
            sizes="(min-width: 1280px) 704px, (min-width: 768px) 480px, 100vw"
            loading="eager"
            aria-hidden={slide !== index}
            className={`transition-opacity duration-1000 ease-in-out motion-reduce:transition-none ${thumbnails ? "object-cover" : "object-contain"} ${slide === index ? "opacity-100" : "opacity-0"}`}
            onLoad={() =>
              setLoaded((current) =>
                current.includes(image.src) ? current : [...current, image.src]
              )
            }
          />
        ))}
        </div>
      {thumbnails && (
        <div className="absolute inset-x-0 bottom-0 z-10 bg-linear-to-b from-transparent to-black/95 px-3 pb-3 pt-8 opacity-0 transition-opacity duration-200 group-hover/gallery:opacity-100 group-focus-within/gallery:opacity-100 [@media(hover:none)]:opacity-100">
          <HorizontalScroll label="Choose a team photo">
            <div ref={thumbnailList} className="relative flex w-max gap-2">
              {images.map((image, slide) => (
                <button
                  key={image.src}
                  type="button"
                  aria-label={`Show photo ${slide + 1}: ${image.alt}`}
                  aria-pressed={slide === index}
                  className="relative size-8 shrink-0 overflow-hidden rounded-md opacity-50 transition-opacity hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none aria-pressed:opacity-100 md:size-10"
                  onClick={() => { setIndex(slide); }}
                >
                  <Image src={image.src} alt="" fill sizes="40px" className="object-cover" />
                  <span className={`pointer-events-none absolute inset-0 rounded-md border-2 ${slide === index ? "border-white" : "border-transparent"}`} />
                </button>
              ))}
            </div>
          </HorizontalScroll>
        </div>
      )}
      </div>
      <figcaption className="mt-3 flex items-start justify-between gap-4 text-sm leading-relaxed text-[var(--muted)]">
        <div className="grid min-w-0 flex-1">
          {images.map((image, slide) => (
            <p
              key={image.src}
              aria-hidden={slide !== index}
              title={image.caption ?? caption}
              className={`truncate col-start-1 row-start-1 transition-[opacity,filter] duration-1000 ease-in-out motion-reduce:transition-none ${slide === index ? "opacity-70 blur-none" : "pointer-events-none opacity-0 blur-xs"}`}
            >
              {image.caption ?? caption}
            </p>
          ))}
        </div>
        <div className="flex h-lh shrink-0 items-center gap-px">
          {!thumbnails && <button
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
          </button>}
          <button
            type="button"
            className={iconControl}
            aria-label="Previous image"
            onClick={() =>
              setIndex((index + images.length - 1) % images.length)
            }
          >
            <Icon name="chevron-left" />
          </button>
          <button
            type="button"
            className={iconControl}
            aria-label="Next image"
            onClick={() => setIndex((index + 1) % images.length)}
          >
            <Icon name="chevron-right" />
          </button>
        </div>
      </figcaption>
    </figure>
  );
}
