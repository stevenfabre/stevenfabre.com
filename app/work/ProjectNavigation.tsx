"use client";

import { useEffect, useState } from "react";
import ButtonLink from "../../src/components/ButtonLink";
import { Tooltip } from "../../src/components/Tooltip";
import { initializeProjectReturn } from "../../src/utils/projectNavigation";
import { useSiteNavigation } from "../../src/components/SiteNavigation";
import ProjectCounter from "./ProjectCounter";
import WorkIcon from "./WorkIcon";

type Project = { slug: string; title: string };

export default function ProjectNavigation({
  slug,
  index,
  total,
  previous,
  next,
}: {
  slug: string;
  index: number;
  total: number;
  previous: Project;
  next: Project;
}) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 0);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [slug]);
  const [returnView, setReturnView] = useState({ href: "/work" });
  useEffect(() => setReturnView(initializeProjectReturn()), [slug]);

  const navigate = useSiteNavigation();
  const closeHref = returnView.href.startsWith("/work")
    ? `/work#project-${slug}`
    : returnView.href;
  const [pressed, setPressed] = useState<string | null>(null);
  const previousHref = `/work/${previous.slug}`;
  const nextHref = `/work/${next.slug}`;

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (
        event.defaultPrevented ||
        event.repeat ||
        event.isComposing ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        document.fullscreenElement
      )
        return;
      if (
        event.target instanceof Element &&
        event.target.closest(
          'input, textarea, select, video, audio, [contenteditable]:not([contenteditable="false"]), [role="slider"], [data-no-project-swipe], [role="dialog"], dialog[open]'
        )
      )
        return;
      const shortcut =
        event.key === "ArrowRight"
          ? { direction: "next", href: nextHref }
          : event.key === "ArrowLeft"
          ? { direction: "previous", href: previousHref }
          : event.key === "Escape"
          ? { direction: "close", href: closeHref }
          : null;
      if (!shortcut) return;
      event.preventDefault();
      setPressed(shortcut.direction);
      navigate(shortcut.href, { animate: false });
    };
    const release = () => setPressed(null);
    document.addEventListener("keydown", handleKey);
    document.addEventListener("keyup", release);
    window.addEventListener("blur", release);
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.removeEventListener("keyup", release);
      window.removeEventListener("blur", release);
    };
  }, [closeHref, nextHref, previousHref, navigate]);

  return (
    <nav
      className="sticky top-0 z-30 h-[var(--bar-height)] w-[calc(100%+var(--page-padding)*2)] shrink-0 -mx-[var(--page-padding)] px-[var(--bar-padding)] bg-[var(--bar-background)] text-[13px] text-[var(--muted)] backdrop-blur-lg backdrop-saturate-[0.6] [view-transition-name:project-navigation] data-[scrolled=true]:shadow-[0_1px_0_#0000000f] dark:data-[scrolled=true]:shadow-[0_1px_0_#ffffff0f] max-[520px]:text-xs"
      data-scrolled={scrolled}
      aria-label="Project navigation"
    >
      <div className="flex size-full items-center justify-between gap-2">
        <div className="flex items-center gap-2 max-[520px]:gap-0">
          <Tooltip content="Previous project" side="bottom" delayDuration={200}>
            <ButtonLink
              variant="icon"
              href={`/work/${previous.slug}`}
              data-project-direction="previous"
              data-keyboard-pressed={pressed === "previous" || undefined}
              aria-keyshortcuts="ArrowLeft"
              clientNavigation
              aria-label={`Previous project: ${previous.title}`}
            >
              <WorkIcon name="chevron-left" />
            </ButtonLink>
          </Tooltip>
          <ProjectCounter current={index + 1} total={total} />
          <Tooltip content="Next project" side="bottom" delayDuration={200}>
            <ButtonLink
              variant="icon"
              href={`/work/${next.slug}`}
              data-project-direction="next"
              data-keyboard-pressed={pressed === "next" || undefined}
              aria-keyshortcuts="ArrowRight"
              clientNavigation
              aria-label={`Next project: ${next.title}`}
            >
              <WorkIcon name="chevron-right" />
            </ButtonLink>
          </Tooltip>
        </div>
        <Tooltip content="Close project" side="bottom" delayDuration={200}>
          <ButtonLink
            variant="icon"
            className="justify-self-end"
            href={closeHref}
            aria-label="Close project"
            aria-keyshortcuts="Escape"
            data-project-direction="close"
            data-keyboard-pressed={pressed === "close" || undefined}
            clientNavigation
          >
            <WorkIcon name="x" />
          </ButtonLink>
        </Tooltip>
      </div>
    </nav>
  );
}
