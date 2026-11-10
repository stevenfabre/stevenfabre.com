"use client";

import { useEffect, useState, type TouchEvent } from "react";
import Toolbar from "@/components/Game/Toolbar";
import {
  COLORS,
  DELAY_TIMEOUT_PIXEL,
  DENSITY_PIXELS,
  RIPPLE_DURATION_MS,
  MAX_RIPPLES,
  MAX_TRAIL_PIXELS,
} from "@/components/Game/constants";
import Cursors from "@/components/Game/Cursors";
import {
  useBroadcastEvent,
  useEventListener,
  useSelf,
  useOthersListener,
  useUpdateMyPresence,
} from "@liveblocks/react/suspense";
import {
  CursorType,
  Point,
  Ripple,
  RippleEvent,
  Trail,
} from "@/components/Game/types";
import Footer from "@/components/Game/Footer";

import Effects from "./Effects";

export default function Game() {
  const [trails, setTrails] = useState<Trail[]>([]);
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
      ...current
        .filter((ripple) => started - ripple.started < RIPPLE_DURATION_MS)
        .slice(-(MAX_RIPPLES - 1)),
      { ...event, started },
    ]);
  };
  useEventListener(({ event }) => addRipple(event));
  const me = useSelf();
  const updateMyPresence = useUpdateMyPresence();

  const paintTrail = (points: readonly Point[] | null, color: string) => {
    if (!points?.length || !Object.values<string>(COLORS).includes(color))
      return;
    const started = performance.now();
    setTrails((current) => {
      const cells = new Map(
        current
          .filter((p) => started - p.started < DELAY_TIMEOUT_PIXEL)
          .map((p) => [`${p.x},${p.y}`, p])
      );
      for (const point of points) {
        if (!Number.isFinite(point.x) || !Number.isFinite(point.y)) continue;
        const x = Math.round(point.x / DENSITY_PIXELS) * DENSITY_PIXELS;
        const y = Math.round(point.y / DENSITY_PIXELS) * DENSITY_PIXELS;
        cells.set(`${x},${y}`, { x, y, color, started });
      }
      return Array.from(cells.values()).slice(-MAX_TRAIL_PIXELS);
    });
  };
  useOthersListener((event) => {
    if (event.type === "update" && "cursor" in event.updates) {
      paintTrail(event.user.presence.cursor, event.user.presence.color);
    }
  });

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
    const points = touches.map((touch) => toGamePoint(touch, bounds));

    paintTrail(points, me.presence.color);
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
            ...toGamePoint(e, bounds),
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

      <Effects trails={trails} ripples={ripples} />

      <Footer>
        <Toolbar currentColor={me.presence.color} setColor={setColor} />
      </Footer>

      <Cursors />
    </div>
  );
}

function toGamePoint(
  point: { clientX: number; clientY: number },
  bounds: DOMRect
): Point {
  return {
    x: point.clientX - bounds.left - bounds.width / 2,
    y: point.clientY - bounds.top - bounds.height / 2,
  };
}
