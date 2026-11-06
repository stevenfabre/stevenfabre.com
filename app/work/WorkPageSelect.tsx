"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from "react";
import {
  animate,
  motion,
  stagger,
  useAnimate,
  useMotionValue,
  useReducedMotion,
} from "motion/react";
import * as Select from "@radix-ui/react-select";
import { ChevronsUpDown } from "lucide-react";
import { useSiteNavigation } from "../../src/components/SiteNavigation";

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
        className="group relative isolate -mx-2 inline-flex cursor-pointer items-center gap-2 rounded-2xl px-2 text-left focus-visible:outline-none"
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
          className="z-50 outline-none"
        >
          <MenuSurface open={open} backgroundRef={menuBackground}>
            <Select.Viewport className="p-1 md:p-1.5 [&:not(:has([data-highlighted]))_[data-state=checked]]:text-neutral-900 dark:[&:not(:has([data-highlighted]))_[data-state=checked]]:text-neutral-100">
              {pages.map(({ label, href }, index) => (
                <Select.Item
                  data-menu-item
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
                      {label}
                    </motion.span>
                  </Select.ItemText>
                </Select.Item>
              ))}
            </Select.Viewport>
          </MenuSurface>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}

// Measure a stationary wrapper so neither layer's movement feeds back into
// pointer coordinates or shifts the initial alignment with the heading.
function MenuSurface({
  children,
  open,
  backgroundRef,
}: {
  children: ReactNode;
  open: boolean;
  backgroundRef: RefObject<HTMLDivElement>;
}) {
  const reducedMotion = useReducedMotion();
  const [scope, animateItems] = useAnimate<HTMLDivElement>();
  const backgroundX = useMotionValue(0);
  const backgroundY = useMotionValue(0);
  const reset = () => {
    // Read the current displacement, including interrupted animations, so the
    // leading edge returns first: bottom-to-top downwards, top-to-bottom upwards.
    const items =
      scope.current.querySelectorAll<HTMLElement>("[data-menu-item]");
    const displacement = Array.from(items).reduce((total, item) => {
      const transform = getComputedStyle(item).transform;
      return (
        total +
        (transform === "none" ? 0 : new DOMMatrixReadOnly(transform).m42)
      );
    }, 0);
    const transition = { type: "spring" as const, duration: 0.4, bounce: 0.4 };
    animateItems(
      "[data-menu-item]",
      { y: 0 },
      reducedMotion
        ? { duration: 0 }
        : {
            ...transition,
            delay: stagger(0.02, {
              startDelay: 0.08,
              from: displacement < 0 ? "last" : "first",
            }),
          }
    );
    animate(backgroundX, 0, { ...transition, duration: 0.25 });
    animate(backgroundY, 0, { ...transition, duration: 0.25 });
  };
  useEffect(() => {
    // Radix can focus the listbox outside this surface before an item.
    const stop = () => {
      animateItems("[data-menu-item]", { y: 0 }, { duration: 0 });
      backgroundX.jump(0);
      backgroundY.jump(0);
    };
    document.addEventListener("keydown", stop);
    return () => {
      document.removeEventListener("keydown", stop);
      backgroundX.stop();
      backgroundY.stop();
    };
  }, [animateItems, backgroundX, backgroundY]);
  // As displacement increases, resistance grows smoothly toward a 12px limit.
  const resist = (distance: number) =>
    (distance * 12) / (100 + Math.abs(distance));

  return (
    <div
      ref={scope}
      className="relative isolate"
      onPointerMove={(event) => {
        if (
          reducedMotion ||
          event.pointerType !== "mouse" ||
          event.buttons ||
          !matchMedia("(hover: hover) and (pointer: fine)").matches
        )
          return;
        const bounds = event.currentTarget.getBoundingClientRect();
        const offsetX = resist(event.clientX - bounds.left - bounds.width / 2);
        const offsetY = resist(event.clientY - bounds.top - bounds.height / 2);
        const transition = {
          type: "spring" as const,
          duration: 0.3,
          bounce: 0,
        };
        animateItems("[data-menu-item]", { y: offsetY }, transition);
        // The surface responds sooner and travels a little farther than the text.
        const surfaceTransition = { ...transition, duration: 0.2 };
        animate(backgroundX, offsetX * 1.75, surfaceTransition);
        animate(backgroundY, offsetY * 1.75, surfaceTransition);
      }}
      onPointerLeave={reset}
      onPointerCancel={reset}
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          x: reducedMotion ? 0 : backgroundX,
          y: reducedMotion ? 0 : backgroundY,
        }}
      >
        {/* Keep entrance scaling separate from cursor-driven movement. */}
        <motion.div
          ref={backgroundRef}
          className="surface-popover absolute inset-0"
          initial={{ opacity: 0, scale: reducedMotion ? 1 : 0.9 }}
          animate={{
            opacity: open ? 1 : 0,
            scale: open || reducedMotion ? 1 : 0.9,
          }}
          transition={{
            scale: { type: "spring", duration: 0.4, bounce: 0.2 },
            opacity: { duration: 0.16, ease: [0.23, 1, 0.32, 1] },
          }}
          style={{ transformOrigin: "50% 75%" }}
        />
      </motion.div>
      <div className="relative">{children}</div>
    </div>
  );
}
