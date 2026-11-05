"use client";

import { useEffect, useState, type MouseEvent } from "react";
import ButtonLink from "../../src/components/ButtonLink";
import { Tooltip } from "../../src/components/Tooltip";
import {
  initializeProjectReturn,
  isPlainNavigation,
  rememberProjectNavigation,
} from "../../src/utils/projectNavigation";
import ProjectCounter from "./ProjectCounter";
import WorkIcon from "./WorkIcon";
import styles from "./detail.module.css";

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
  const [returnView, setReturnView] = useState({ href: "/work", steps: 0 });
  useEffect(() => setReturnView(initializeProjectReturn()), [slug]);

  const navigate = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!isPlainNavigation(event)) return;
    rememberProjectNavigation(event, true);
    event.preventDefault();
    window.history.pushState(null, "", event.currentTarget.pathname);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (
        event.defaultPrevented ||
        event.repeat ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey
      )
        return;
      const target = event.target as HTMLElement;
      if (
        target.closest(
          'input, textarea, select, video, [contenteditable], [role="slider"]'
        ) ||
        document.fullscreenElement
      )
        return;
      const direction =
        event.key === "ArrowRight"
          ? "next"
          : event.key === "ArrowLeft"
          ? "previous"
          : event.key === "Escape"
          ? "close"
          : null;
      if (!direction) return;
      event.preventDefault();
      const button = document.querySelector<HTMLAnchorElement>(
        `[data-project-direction="${direction}"]`
      );
      button?.setAttribute("data-keyboard-pressed", "true");
      button?.click();
    };
    const release = () =>
      document
        .querySelectorAll("[data-keyboard-pressed]")
        .forEach((button) => button.removeAttribute("data-keyboard-pressed"));
    document.addEventListener("keydown", handleKey);
    document.addEventListener("keyup", release);
    window.addEventListener("blur", release);
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.removeEventListener("keyup", release);
      window.removeEventListener("blur", release);
    };
  }, []);

  return (
    <nav
      className={styles.navigation}
      data-scrolled={scrolled}
      aria-label="Project navigation"
    >
      <div className="flex size-full items-center justify-between gap-2">
        <div className={styles.controls}>
          <Tooltip content="Previous project" side="bottom" delayDuration={200}>
            <ButtonLink
              variant="icon"
              href={`/work/${previous.slug}`}
              data-project-direction="previous"
              aria-keyshortcuts="ArrowLeft"
              onClick={navigate}
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
              aria-keyshortcuts="ArrowRight"
              onClick={navigate}
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
            href={
              returnView.href.startsWith("/work")
                ? `/work#project-${slug}`
                : returnView.href
            }
            aria-label="Close project"
            aria-keyshortcuts="Escape"
            data-project-direction="close"
            clientNavigation
          >
            <WorkIcon name="x" />
          </ButtonLink>
        </Tooltip>
      </div>
    </nav>
  );
}
