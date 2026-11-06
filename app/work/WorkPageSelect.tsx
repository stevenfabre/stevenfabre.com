"use client";

import { useCallback, useRef, useState, type CSSProperties } from "react";
import surface from "../../src/components/PopoverSurface.module.css";
import styles from "./WorkPageSelect.module.css";
import heading from "../../src/components/HeadingControl.module.css";
import * as Select from "@radix-ui/react-select";
import { ChevronsUpDown } from "lucide-react";
import { useSiteNavigation } from "../../src/components/SiteNavigation";

const pages = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/work" },
];

export default function WorkPageSelect() {
  const navigate = useSiteNavigation();
  const trigger = useRef<HTMLButtonElement>(null);
  const value = useRef<HTMLSpanElement>(null);
  const alignContent = useCallback((content: HTMLDivElement | null) => {
    if (!content) return;
    // Radix clamps its item-aligned menu away from the viewport edge. On
    // narrow screens that moves the label; correct it after Radix positions
    // the menu, before paint, without changing either element's layout.
    queueMicrotask(() => {
      if (!content.isConnected || !value.current) return;
      const label = content.querySelector<HTMLElement>(
        '[data-state="checked"] [data-page-label]'
      );
      if (!label) return;
      content.style.transform = "";
      const offset =
        value.current.getBoundingClientRect().left -
        label.getBoundingClientRect().left;
      content.style.transform = `translateX(${offset}px)`;
    });
  }, []);
  const [typography, setTypography] = useState<CSSProperties>();

  function syncTypography(open: boolean) {
    if (!open || !trigger.current) return;
    // The portal sits outside the heading's responsive container. Copy its
    // resolved typography rather than duplicating container-query breakpoints.
    const style = getComputedStyle(trigger.current);
    setTypography({
      fontFamily: style.fontFamily,
      fontSize: style.fontSize,
      fontWeight: style.fontWeight,
      lineHeight: style.lineHeight,
      letterSpacing: style.letterSpacing,
    });
  }

  return (
    <Select.Root
      value="/work"
      onValueChange={(href) => navigate(href)}
      onOpenChange={syncTypography}
    >
      <Select.Trigger
        ref={trigger}
        aria-label="Page: Work"
        className={`${heading.control} group inline-flex cursor-pointer items-center gap-2 text-left`}
      >
        <Select.Value ref={value}>Work</Select.Value>
        <Select.Icon asChild>
          <ChevronsUpDown
            aria-hidden="true"
            className="size-[0.55em] translate-y-[0.08em] text-neutral-400 transition-colors duration-150 group-hover:text-neutral-900 dark:text-neutral-500 dark:group-hover:text-neutral-100"
          />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content
          ref={alignContent}
          position="item-aligned"
          style={typography}
          className={`${surface.surface} ${styles.content}`}
        >
          <Select.Viewport className={styles.viewport}>
            {pages.map(({ label, href }) => (
              <Select.Item key={href} value={href} className={styles.item}>
                <Select.ItemText data-page-label>{label}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
