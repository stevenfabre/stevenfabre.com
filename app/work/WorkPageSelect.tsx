"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
} from "motion/react";
import { headingControl } from "../../src/components/HeadingLink";
import * as Select from "@radix-ui/react-select";
import { ChevronsUpDown } from "lucide-react";
import { useSiteNavigation } from "../../src/components/SiteNavigation";

const pages = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/work" },
];

export default function WorkPageSelect() {
  const navigate = useSiteNavigation();
  const selectedHref = useRef<string | null>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const value = useRef<HTMLSpanElement>(null);
  const closedTextBounds = useRef<DOMRect | null>(null);
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
      // Compare glyph boxes, not line boxes: the mobile menu has tighter
      // line-height, and Radix rounds its positioning to whole pixels.
      const textBounds = (element: HTMLElement) => {
        const range = document.createRange();
        range.selectNodeContents(element);
        return range.getBoundingClientRect();
      };
      const from = closedTextBounds.current || textBounds(value.current);
      const to = textBounds(label);
      content.style.transform = `translate(${from.left - to.left}px, ${
        from.top - to.top
      }px)`;
    });
  }, []);
  const [typography, setTypography] = useState<CSSProperties>();

  function syncTypography(open: boolean) {
    if (!open || !trigger.current) return;
    // The portal sits outside the heading's responsive container. Copy its
    // resolved typography rather than duplicating container-query breakpoints.
    if (value.current) {
      // Anchor to the closed trigger, before Radix locks scrolling or focuses
      // the menu. Measuring only after opening can preserve a shifted baseline.
      const range = document.createRange();
      range.selectNodeContents(value.current);
      closedTextBounds.current = range.getBoundingClientRect();
    }
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
      onValueChange={(href) => {
        selectedHref.current = href;
      }}
      onOpenChange={syncTypography}
    >
      <Select.Trigger
        ref={trigger}
        aria-label="Page: Work"
        className={`${headingControl} group inline-flex cursor-pointer items-center gap-2 text-left`}
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
          onCloseAutoFocus={(event) => {
            const href = selectedHref.current;
            if (!href) return;
            // Navigation owns focus/scroll now. Returning focus to the trigger
            // can scroll the outgoing page just before its snapshot is taken.
            event.preventDefault();
            selectedHref.current = null;
            requestAnimationFrame(() => {
              // Let Radix remove its portal and body scroll lock first.
              navigate(href, { scrollToContent: true });
            });
          }}
          style={typography}
          className="z-50 outline-none"
        >
          <MenuSurface>
            <Select.Viewport className="p-1 md:p-1.5 [&:not(:has([data-highlighted]))_[data-state=checked]]:text-neutral-900 dark:[&:not(:has([data-highlighted]))_[data-state=checked]]:text-neutral-100">
              {pages.map(({ label, href }) => (
                <Select.Item
                  key={href}
                  value={href}
                  className="flex cursor-pointer select-none items-center px-1.5 py-0.5 leading-[1.1] text-neutral-400 outline-none data-[highlighted]:text-neutral-900 dark:text-neutral-500 dark:data-[highlighted]:text-neutral-100 md:px-3 md:py-1 md:leading-[inherit]"
                >
                  <Select.ItemText data-page-label>{label}</Select.ItemText>
                </Select.Item>
              ))}
            </Select.Viewport>
          </MenuSurface>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}

// Keep Radix’s alignment and measurement on a stationary wrapper. Only the
// visual surface follows the pointer, so its movement cannot feed back into
// pointer coordinates or shift the initial alignment with the heading.
function MenuSurface({ children }: { children: ReactNode }) {
  const reducedMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const reset = () => {
    const transition = { type: "spring" as const, duration: 0.3, bounce: 0.3 };
    animate(x, 0, transition);
    animate(y, 0, transition);
  };
  useEffect(() => {
    // Radix can focus the listbox outside this surface before an item.
    const stop = () => {
      x.jump(0);
      y.jump(0);
    };
    document.addEventListener("keydown", stop);
    return () => {
      document.removeEventListener("keydown", stop);
      x.stop();
      y.stop();
    };
  }, [x, y]);
  // As displacement increases, resistance grows smoothly toward a 10px limit.
  const resist = (distance: number) =>
    (distance * 10) / (100 + Math.abs(distance));

  return (
    <div
      onPointerMove={(event) => {
        if (
          reducedMotion ||
          event.pointerType !== "mouse" ||
          event.buttons ||
          !matchMedia("(hover: hover) and (pointer: fine)").matches
        )
          return;
        const bounds = event.currentTarget.getBoundingClientRect();
        const transition = {
          type: "spring" as const,
          duration: 0.3,
          bounce: 0,
        };
        animate(
          x,
          resist(event.clientX - bounds.left - bounds.width / 2),
          transition
        );
        animate(
          y,
          resist(event.clientY - bounds.top - bounds.height / 2),
          transition
        );
      }}
      onPointerLeave={reset}
      onPointerCancel={reset}
    >
      <motion.div
        className="surface-popover overflow-hidden"
        style={{ x: reducedMotion ? 0 : x, y: reducedMotion ? 0 : y }}
      >
        {children}
      </motion.div>
    </div>
  );
}
