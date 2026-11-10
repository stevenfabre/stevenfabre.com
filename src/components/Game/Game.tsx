"use client";

import { useEffect, useState, type TouchEvent } from "react";
import Toolbar from "@/components/Game/Toolbar";
import { COLORS } from "@/components/Game/constants";
import Cursors from "@/components/Game/Cursors";
import {
  useBroadcastEvent,
  useEventListener,
  useSelf,
  useUpdateMyPresence,
} from "@liveblocks/react/suspense";
import {
  CursorType,
  Point,
  Ripple,
  RippleEvent,
} from "@/components/Game/types";
import Footer from "@/components/Game/Footer";

import Ripples from "./Ripples";
import Trails from "./Trails";

export default function Game() {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const broadcast = useBroadcastEvent();
  const addRipple = (event: RippleEvent) => {
    if (
      event.type !== "RIPPLE" ||
      !Number.isFinite(event.x) ||
      !Number.isFinite(event.y) ||
      !Object.values<string>(COLORS).includes(event.color)
    )
      return;
    const started = performance.now();
    setRipples((current) => [
      ...current.filter((ripple) => started - ripple.started < 1000).slice(-31),
      { ...event, started },
    ]);
  };
  useEventListener(({ event }) => addRipple(event));
  const me = useSelf();
  const updateMyPresence = useUpdateMyPresence();

  useEffect(() => {
    const controller = new AbortController();
    void fetch("/api/location", {
      signal: controller.signal,
      cache: "no-store",
    })
      .then(async (response) => {
        if (!response.ok) return;
        const { location } = await response.json();
        if (!controller.signal.aborted && typeof location === "string") {
          updateMyPresence({ location });
        }
      })
      .catch(() => {
        // Location is optional; the game works without it.
      });
    return () => controller.abort();
  }, [updateMyPresence]);

  const setColor = (color: string) => updateMyPresence({ color });
  const setCursor = (cursor: Point[] | null, cursorType: CursorType | null) =>
    updateMyPresence({ cursor, cursorType });

  useEffect(() => {
    const onWindowBlur = () => {
      updateMyPresence({ cursor: null, cursorType: null });
    };

    window.addEventListener("blur", onWindowBlur);

    return () => {
      window.removeEventListener("blur", onWindowBlur);
    };
  }, [updateMyPresence]);

  const onDraw = (
    touches: { clientX: number; clientY: number }[],
    cursorType: CursorType,
    target: HTMLElement
  ) => {
    const bounds = target.getBoundingClientRect();
    const points = touches.map((touch) => ({
      x: touch.clientX - bounds.left - bounds.width / 2,
      y: touch.clientY - bounds.top - bounds.height / 2,
    }));

    setCursor(points.length ? points : null, points.length ? cursorType : null);
  };

  const onTouch = (event: TouchEvent<HTMLDivElement>) =>
    onDraw(Array.from(event.touches), "touch", event.currentTarget);

  return (
    <div className="group absolute inset-0 flex justify-center items-center touch-none md:touch-auto">
      <div
        className="absolute inset-0 flex items-center justify-center mix-blend-overlay cursor-crosshair"
        onPointerDown={(e) => {
          if (e.button !== 0) return;
          const bounds = e.currentTarget.getBoundingClientRect();
          const event: RippleEvent = {
            type: "RIPPLE",
            x: e.clientX - bounds.left - bounds.width / 2,
            y: e.clientY - bounds.top - bounds.height / 2,
            color: me.presence.color,
          };
          addRipple(event);
          // One event per press; don't replay stale clicks after reconnecting.
          broadcast(event, { shouldQueueEventIfNotReady: false });
        }}
        onPointerMove={(e) => {
          // Only handle mouse pointer, touches are handled by onTouchMove
          if (e.pointerType !== "touch") {
            onDraw(
              [{ clientX: e.clientX, clientY: e.clientY }],
              "mouse",
              e.currentTarget
            );
          }
        }}
        onTouchStart={onTouch}
        onTouchMove={onTouch}
        onTouchEnd={onTouch}
        onTouchCancel={onTouch}
        onPointerLeave={() => setCursor(null, null)}
      />

      <Trails cursor={me.presence.cursor} color={me.presence.color} />

      <Ripples ripples={ripples} />

      <Footer>
        <Toolbar currentColor={me.presence.color} setColor={setColor} />
      </Footer>

      <Cursors />
    </div>
  );
}
