"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Icon from "../../src/components/Icon";
import { iconControl } from "../../src/components/buttonStyles";

export type Slideshow = {
  images: { src: string; alt: string }[];
  caption: string;
};

export default function ProjectSlideshow({ images, caption }: Slideshow) {
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
      aria-label="Template gallery interaction details"
      data-no-project-swipe
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={(event) => {
        // Entering with the keyboard stops rotation until explicitly resumed.
        if (!event.currentTarget.contains(event.relatedTarget)) setPaused(true);
      }}
    >
      <div className="relative aspect-[65/32] overflow-hidden rounded-lg">
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
        <p className="opacity-70">{caption}</p>
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
    </figure>
  );
}
