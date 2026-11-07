"use client";

import {
  useCallback,
  useEffect,
  useRef,
  type PointerEvent,
  type RefObject,
} from "react";
import { swipeDestination } from "@/utils/swipe";

type Gesture = {
  id: number;
  x: number;
  y: number;
  origin: number;
  lastX: number;
  lastTime: number;
  velocity: number;
  horizontal: boolean;
};

type Options = {
  canStart?: (event: PointerEvent<HTMLElement>) => boolean;
  onStart: () => number;
  onMove: (position: number, firstMove: boolean) => void;
  onEnd: (direction: -1 | 0 | 1, velocity: number) => void;
  onCancel: () => void;
};

// Own gesture recognition and capture here; consumers own animations and actions.
export function useSwipeGesture(
  viewport: RefObject<HTMLElement>,
  options: Options
) {
  const gesture = useRef<Gesture | null>(null);
  const clear = useCallback(() => {
    gesture.current = null;
  }, []);
  const isActive = useCallback(() => gesture.current !== null, []);
  const cancel = () => {
    if (!gesture.current) return;
    clear();
    options.onCancel();
  };

  useEffect(() => {
    const element = viewport.current;
    if (!element) return;
    // Cancel horizontal panning before Safari takes over; keep vertical scrolling,
    // pinch zoom, and nested native scroll areas available.
    const lockScroll = (event: TouchEvent) => {
      const current = gesture.current;
      if (!current || event.touches.length !== 1) return;
      const touch = event.touches[0];
      const dx = Math.abs(touch.clientX - current.x);
      const dy = Math.abs(touch.clientY - current.y);
      if (event.cancelable && (current.horizontal || (dx >= 8 && dx > dy)))
        event.preventDefault();
    };
    element.addEventListener("touchmove", lockScroll, { passive: false });
    return () => element.removeEventListener("touchmove", lockScroll);
  }, [viewport]);

  function onPointerDown(event: PointerEvent<HTMLElement>) {
    if (event.pointerType !== "touch") return;
    if (!event.isPrimary) {
      cancel();
      return;
    }
    if (event.button !== 0 || options.canStart?.(event) === false) return;
    const origin = options.onStart();
    gesture.current = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      origin,
      lastX: event.clientX,
      lastTime: event.timeStamp,
      velocity: 0,
      horizontal: false,
    };
  }

  function onPointerMove(event: PointerEvent<HTMLElement>) {
    const current = gesture.current;
    if (!current || current.id !== event.pointerId) return;
    const dx = event.clientX - current.x;
    const dy = event.clientY - current.y;
    const firstMove = !current.horizontal;
    if (firstMove) {
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 8) return;
      if (Math.abs(dy) >= Math.abs(dx)) {
        cancel();
        return;
      }
      current.horizontal = true;
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    const elapsed = event.timeStamp - current.lastTime;
    if (elapsed > 0)
      current.velocity = (event.clientX - current.lastX) / elapsed;
    current.lastX = event.clientX;
    current.lastTime = event.timeStamp;
    const width = event.currentTarget.clientWidth;
    options.onMove(
      Math.max(-width, Math.min(width, current.origin + dx)),
      firstMove
    );
  }

  function onPointerUp(event: PointerEvent<HTMLElement>) {
    const current = gesture.current;
    if (!current || current.id !== event.pointerId) return;
    clear();
    const velocity =
      event.timeStamp - current.lastTime < 100 ? current.velocity : 0;
    // Intent depends on this drag, not the position of a returning spring.
    options.onEnd(
      current.horizontal
        ? swipeDestination(
            event.clientX - current.x,
            velocity,
            event.currentTarget.clientWidth
          )
        : 0,
      velocity
    );
  }

  return {
    clear,
    isActive,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel: cancel,
    onLostPointerCapture: (event: PointerEvent<HTMLElement>) => {
      // Capture transfers from the touched child to the viewport. Ignore that
      // child's bubbling capture-loss event; only losing our own capture cancels.
      if (
        event.target === event.currentTarget &&
        gesture.current?.id === event.pointerId
      )
        cancel();
    },
  };
}
