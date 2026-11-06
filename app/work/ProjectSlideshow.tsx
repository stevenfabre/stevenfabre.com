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

  const rotationEnabled = !paused && (!reducedMotion || explicitPlay);

  useEffect(() => {
    if (
      hovered ||
      !rotationEnabled ||
      !visible ||
      images.length < 2 ||
      loaded.length < images.length
    )
      return;
    const timer = setInterval(() => {
      if (!document.hidden)
        setIndex((current) => (current + 1) % images.length);
    }, 1000);
    return () => clearInterval(timer);
  }, [hovered, rotationEnabled, visible, loaded.length, images.length]);

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
        if (!event.currentTarget.contains(event.relatedTarget)) setPaused(true);
      }}
    >
      <div className={`relative overflow-hidden rounded-lg ${thumbnails ? "aspect-[3/2]" : "aspect-[65/32]"}`}>
        {images.map((image, slide) => (
          <Image
            key={image.src}
            src={image.src}
            alt={image.alt}
            fill
            sizes="(min-width: 1280px) 704px, (min-width: 768px) 480px, 100vw"
            loading="eager"
            aria-hidden={slide !== index}
            className={
              slide === index ? "object-contain" : "invisible object-contain"
            }
            onLoad={() =>
              setLoaded((current) =>
                current.includes(image.src) ? current : [...current, image.src]
              )
            }
          />
        ))}
      </div>
      <figcaption className="mt-3 flex items-start justify-between gap-4 text-sm leading-relaxed text-[var(--muted)]">
        <p className="opacity-70">{images[index]?.caption ?? caption}</p>
        <div className="flex h-lh shrink-0 items-center">
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
      {thumbnails && (
        <div className="mt-4">
          <HorizontalScroll label="Choose a team photo" snap>
            <div ref={thumbnailList} className="relative flex w-max gap-2">
              {images.map((image, slide) => (
                <button
                  key={image.src}
                  type="button"
                  aria-label={`Show photo ${slide + 1}: ${image.alt}`}
                  aria-pressed={slide === index}
                  className="relative size-16 shrink-0 snap-start overflow-hidden rounded-md opacity-50 transition-opacity hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none aria-pressed:opacity-100 md:size-20"
                  onClick={() => { setIndex(slide); setPaused(true); }}
                >
                  <Image src={image.src} alt="" fill sizes="80px" className="object-cover" />
                  <span className={`pointer-events-none absolute inset-0 rounded-md border-2 ${slide === index ? "border-neutral-900 dark:border-white" : "border-transparent"}`} />
                </button>
              ))}
            </div>
          </HorizontalScroll>
        </div>
      )}
    </figure>
  );
}
