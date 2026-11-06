"use client";

import {
  useEffect,
  useImperativeHandle,
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

export type MenuMotion = {
  move: (x: number, y: number) => void;
  reset: () => void;
};

// Measure a stationary wrapper so neither layer's movement feeds back into
// pointer coordinates or shifts the initial alignment with the heading.
export function SelectMenuSurface({
  children,
  open,
  backgroundRef,
  motionRef,
}: {
  children: ReactNode;
  open: boolean;
  backgroundRef: RefObject<HTMLDivElement>;
  motionRef: RefObject<MenuMotion>;
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

  function move(x: number, y: number) {
    if (reducedMotion || !scope.current) return;
    const bounds = scope.current.getBoundingClientRect();
    const offsetX = resist(x - bounds.left - bounds.width / 2);
    const offsetY = resist(y - bounds.top - bounds.height / 2);
    const transition = { type: "spring" as const, duration: 0.3, bounce: 0 };
    animateItems("[data-menu-item]", { y: offsetY }, transition);
    // Background moves on both axes; labels only move vertically.
    const surfaceTransition = { ...transition, duration: 0.2 };
    animate(backgroundX, offsetX * 1.75, surfaceTransition);
    animate(backgroundY, offsetY * 1.75, surfaceTransition);
  }
  useImperativeHandle(motionRef, () => ({ move, reset }));

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
        move(event.clientX, event.clientY);
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
