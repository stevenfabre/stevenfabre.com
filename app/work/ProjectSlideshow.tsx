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
  const [focused, setFocused] = useState(false);
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
    if (
      hovered ||
      focused ||
      !visible ||
      reducedMotion ||
      loaded.length < images.length
    )
      return;
    const timer = setInterval(() => {
      if (!document.hidden)
        setIndex((current) => (current + 1) % images.length);
    }, 1000);
    return () => clearInterval(timer);
  }, [hovered, focused, visible, reducedMotion, loaded.length, images.length]);

  return (
    <figure
      ref={container}
      className="mt-8"
      aria-label="Template gallery interaction details"
      data-no-project-swipe
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setFocused(false);
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
        <div className="flex shrink-0 gap-1">
          <button
            type="button"
            className={iconControl}
            aria-label="Previous image"
            onClick={() =>
              setIndex((index + images.length - 1) % images.length)
            }
          >
            <Icon name="chevron-left" size={16} />
          </button>
          <button
            type="button"
            className={iconControl}
            aria-label="Next image"
            onClick={() => setIndex((index + 1) % images.length)}
          >
            <Icon name="chevron-right" size={16} />
          </button>
        </div>
      </figcaption>
    </figure>
  );
}
