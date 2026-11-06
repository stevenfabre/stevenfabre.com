"use client";

import {
  useEffect,
  useRef,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from "react";

/** Adds press-drag-release selection without replacing Radix's keyboard behavior. */
export function useTouchSelect({
  open,
  content,
  onOpen,
  onSelect,
  onDismiss,
  onPosition,
  onEnd,
}: {
  open: boolean;
  content: RefObject<HTMLElement>;
  onOpen: () => void;
  onSelect: (value: string) => void;
  onDismiss: () => void;
  onPosition?: (x: number, y: number) => void;
  onEnd?: () => void;
}) {
  const cleanup = useRef<(() => void) | null>(null);
  const clearClick = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!open) cleanup.current?.();
  }, [open]);
  useEffect(
    () => () => {
      cleanup.current?.();
      clearClick.current?.();
    },
    []
  );

  return (event: ReactPointerEvent<HTMLElement>) => {
    if (open || event.pointerType !== "touch" || !event.isPrimary) return;
    // Prevent Radix's default trigger handling. touch-action on the trigger
    // reserves this gesture before the browser decides to scroll the page.
    event.preventDefault();
    cleanup.current?.();
    clearClick.current?.();
    const { pointerId, clientX: startX, clientY: startY } = event;
    let moved = false;
    let initialFrame = 0;

    const itemAt = (x: number, y: number) => {
      const item = document
        .elementFromPoint(x, y)
        ?.closest<HTMLElement>("[data-page-value]:not([data-disabled])");
      return item && content.current?.contains(item) ? item : null;
    };
    const move = (event: PointerEvent) => {
      if (event.pointerId !== pointerId) return;
      onPosition?.(event.clientX, event.clientY);
      moved ||= Math.hypot(event.clientX - startX, event.clientY - startY) > 6;
      if (!moved) return;
      const item = itemAt(event.clientX, event.clientY);
      // Radix derives its highlight from focus; don't maintain a second selection.
      (item ?? content.current)?.focus({ preventScroll: true });
    };
    const suppressReleaseClick = () => {
      // Touch can synthesize a click after pointerup, reopening the trigger or
      // selecting again. A new pointerdown always starts a fresh interaction.
      const clear = () => {
        window.clearTimeout(timer);
        document.removeEventListener("click", suppress, true);
        document.removeEventListener("pointerdown", clear, true);
        clearClick.current = null;
      };
      const suppress = (event: MouseEvent) => {
        if (event.detail === 0) return; // Preserve keyboard/assistive activation.
        event.preventDefault();
        event.stopImmediatePropagation();
        clear();
      };
      const timer = window.setTimeout(clear, 700);
      document.addEventListener("click", suppress, true);
      document.addEventListener("pointerdown", clear, true);
      clearClick.current = clear;
    };
    const finish = (event: PointerEvent) => {
      if (event.pointerId !== pointerId) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      const item = itemAt(event.clientX, event.clientY);
      cleanup.current?.();
      suppressReleaseClick();
      // A tap opens the menu; a drag commits only the option under the finger.
      if (!moved) return;
      const value = item?.dataset.pageValue;
      if (value) onSelect(value);
      else onDismiss();
    };
    const cancel = () => {
      cleanup.current?.();
      suppressReleaseClick();
      onDismiss();
    };
    const cancelPointer = (event: PointerEvent) => {
      if (event.pointerId === pointerId) cancel();
    };
    const additionalPointer = (event: PointerEvent) => {
      if (event.pointerId !== pointerId) cancel();
    };
    const detach = () => {
      window.cancelAnimationFrame(initialFrame);
      document.removeEventListener("pointermove", move, true);
      document.removeEventListener("pointerup", finish, true);
      document.removeEventListener("pointercancel", cancelPointer, true);
      document.removeEventListener("pointerdown", additionalPointer, true);
      window.removeEventListener("blur", cancel);
      window.removeEventListener("resize", cancel);
      cleanup.current = null;
      onEnd?.();
    };
    cleanup.current = detach;
    document.addEventListener("pointermove", move, true);
    document.addEventListener("pointerup", finish, true);
    document.addEventListener("pointercancel", cancelPointer, true);
    document.addEventListener("pointerdown", additionalPointer, true);
    window.addEventListener("blur", cancel);
    window.addEventListener("resize", cancel);
    onOpen();
    // Wait until the portal has aligned its text before applying touch motion.
    initialFrame = window.requestAnimationFrame(() =>
      onPosition?.(startX, startY)
    );
  };
}
