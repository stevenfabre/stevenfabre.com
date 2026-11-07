"use client";

import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { motion, useAnimate, useReducedMotion } from "motion/react";
import * as Select from "@radix-ui/react-select";
import { ChevronsUpDown } from "lucide-react";
import { useSiteNavigation } from "@/components/SiteNavigation";
import { useTouchSelect } from "@/hooks/useTouchSelect";
import {
  SelectMenuSurface,
  type MenuMotion,
} from "@/components/SelectMenuSurface";

const pages = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/work" },
];
const selectedPage = "/work";
const selectedPageIndex = pages.findIndex(({ href }) => href === selectedPage);

export default function WorkPageSelect() {
  const navigate = useSiteNavigation();
  const reducedMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const [touching, setTouching] = useState(false);
  const menuMotion = useRef<MenuMotion>(null);
  const [dismissedSurface, setDismissedSurface] = useState<DOMRect | null>(
    null
  );
  const [focusSurface, animateFocusSurface] = useAnimate<HTMLSpanElement>();
  const menuBackground = useRef<HTMLDivElement>(null);
  const returningToTrigger = useRef(false);
  const selectedHref = useRef<string | null>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const value = useRef<HTMLSpanElement>(null);
  const closedTextBounds = useRef<DOMRect | null>(null);
  const menuContent = useRef<HTMLDivElement | null>(null);
  const alignContent = useCallback((content: HTMLDivElement | null) => {
    menuContent.current = content;
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

  useLayoutEffect(() => {
    if (open || !dismissedSurface || !focusSurface.current) return;
    const surface = focusSurface.current;
    const target = surface.getBoundingClientRect();
    const scaleX = dismissedSurface.width / target.width;
    const scaleY = dismissedSurface.height / target.height;
    const animation = animateFocusSurface(
      surface,
      {
        transform: [
          `translate(${dismissedSurface.left - target.left}px, ${
            dismissedSurface.top - target.top
          }px) scale(${scaleX}, ${scaleY})`,
          "translate(0px, 0px) scale(1, 1)",
        ],
        // Compensate for scaling so the corners stay round during the return.
        borderRadius: [`${16 / scaleX}px / ${16 / scaleY}px`, "16px"],
      },
      { type: "spring", duration: reducedMotion ? 0 : 0.2, bounce: 0.3 }
    );
    return () => {
      animation.stop();
      surface.style.transform = "";
      surface.style.borderRadius = "";
    };
  }, [
    open,
    dismissedSurface,
    reducedMotion,
    focusSurface,
    animateFocusSurface,
  ]);

  function prepareDismissal() {
    returningToTrigger.current = true;
    setFocused(true);
    setDismissedSurface(
      menuBackground.current?.getBoundingClientRect() ?? null
    );
  }

  function syncTypography(open: boolean) {
    if (open) {
      returningToTrigger.current = false;
      setDismissedSurface(null);
    }
    setOpen(open);
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

  const startTouchSelection = useTouchSelect({
    open,
    content: menuContent,
    onOpen: () => syncTypography(true),
    onPosition: (x, y) => {
      setTouching(true);
      menuMotion.current?.move(x, y);
    },
    onEnd: () => {
      setTouching(false);
      menuMotion.current?.reset();
    },
    onSelect: (href) => {
      if (href === selectedPage) prepareDismissal();
      else selectedHref.current = href;
      syncTypography(false);
    },
    onDismiss: () => {
      prepareDismissal();
      syncTypography(false);
    },
  });

  return (
    <Select.Root
      open={open}
      value={selectedPage}
      onValueChange={(href) => {
        selectedHref.current = href;
      }}
      onOpenChange={syncTypography}
    >
      <Select.Trigger
        ref={trigger}
        aria-label="Page: Work"
        onPointerDown={startTouchSelection}
        onFocus={(event) =>
          setFocused(
            returningToTrigger.current ||
              event.currentTarget.matches(":focus-visible")
          )
        }
        onBlur={() => {
          returningToTrigger.current = false;
          setFocused(false);
        }}
        className="group relative isolate -mx-2 inline-flex touch-none select-none cursor-pointer items-center gap-2 rounded-2xl px-2 text-left focus-visible:outline-none [-webkit-touch-callout:none]"
      >
        {focused && !open && (
          <span
            ref={focusSurface}
            aria-hidden="true"
            // Extend only the painted surface to match the menu's padding.
            // The trigger keeps its original dimensions and text baseline.
            className="surface-popover pointer-events-none absolute -inset-x-0.5 -inset-y-1.5 -z-10 origin-top-left md:-inset-x-2.5 md:-inset-y-2.5"
          />
        )}
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
          onPointerDown={startTouchSelection}
          position="item-aligned"
          onPointerDownOutside={prepareDismissal}
          onEscapeKeyDown={prepareDismissal}
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
          data-touching={touching || undefined}
          className="z-50 touch-none outline-none motion-safe:[&[data-touching]_[data-highlighted]_[data-touch-label]]:scale-105 motion-safe:[&_[data-menu-item]]:hover:[&_[data-touch-label]]:scale-105"
        >
          <SelectMenuSurface
            open={open}
            backgroundRef={menuBackground}
            motionRef={menuMotion}
          >
            <Select.Viewport className="p-1 md:p-1.5 [&:not(:has([data-highlighted]))_[data-state=checked]]:text-neutral-900 dark:[&:not(:has([data-highlighted]))_[data-state=checked]]:text-neutral-100">
              {pages.map(({ label, href }, index) => (
                <Select.Item
                  data-menu-item
                  data-select-value={href}
                  key={href}
                  value={href}
                  className="flex cursor-pointer select-none items-center px-1.5 py-0.5 leading-[1.1] text-neutral-400 outline-none data-[highlighted]:text-neutral-900 dark:text-neutral-500 dark:data-[highlighted]:text-neutral-100 md:px-3 md:py-1 md:leading-[inherit]"
                >
                  <Select.ItemText data-page-label>
                    {/* Keep entry transforms separate from cursor-driven item motion. */}
                    <motion.span
                      className="inline-block origin-left"
                      initial={
                        href === selectedPage || reducedMotion
                          ? false
                          : {
                              opacity: 0,
                              scale: 0.96,
                              y: index < selectedPageIndex ? 8 : -8,
                            }
                      }
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{
                        delay: reducedMotion
                          ? 0
                          : (index > selectedPageIndex ? index - 1 : index) *
                            0.02,
                        scale: { type: "spring", duration: 0.4, bounce: 0.6 },
                        y: { type: "spring", duration: 0.4, bounce: 0.2 },
                        opacity: {
                          duration: 0.16,
                          ease: [0.23, 1, 0.32, 1],
                        },
                      }}
                    >
                      <span
                        data-touch-label
                        className="inline-block origin-left transition-transform duration-150 motion-reduce:transition-none"
                      >
                        {label}
                      </span>
                    </motion.span>
                  </Select.ItemText>
                </Select.Item>
              ))}
            </Select.Viewport>
          </SelectMenuSurface>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
