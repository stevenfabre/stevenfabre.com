"use client";

import { useCallback, useEffect, useState } from "react";
import { useOthersListener } from "@liveblocks/react/suspense";
import { COLORS, DELAY_TIMEOUT_PIXEL, DENSITY_PIXELS } from "./constants";
import type { Point } from "./types";
import styles from "./Trails.module.css";

type Trail = Point & { color: string; started: number };

export default function Trails({
  cursor,
  color,
}: {
  cursor: readonly Point[] | null;
  color: string;
}) {
  const [pixels, setPixels] = useState<Trail[]>([]);
  const paint = useCallback((points: readonly Point[] | null, tint: string) => {
    if (!points?.length || !Object.values<string>(COLORS).includes(tint))
      return;
    const started = performance.now();
    const next = points
      .filter((p) => Number.isFinite(p.x) && Number.isFinite(p.y))
      .map((p) => ({
        x: Math.round(p.x / DENSITY_PIXELS) * DENSITY_PIXELS,
        y: Math.round(p.y / DENSITY_PIXELS) * DENSITY_PIXELS,
        color: tint,
        started,
      }));
    setPixels((current) => {
      const cells = new Map(
        current
          .filter((p) => started - p.started < DELAY_TIMEOUT_PIXEL)
          .map((p) => [`${p.x},${p.y}`, p])
      );
      for (const pixel of next) cells.set(`${pixel.x},${pixel.y}`, pixel);
      return Array.from(cells.values()).slice(-1500);
    });
  }, []);

  useEffect(() => {
    paint(cursor, color);
  }, [cursor, color, paint]);
  useOthersListener((event) => {
    // Only movement paints; location changes and disconnects don't refresh trails.
    if (event.type === "update" && "cursor" in event.updates) {
      paint(event.user.presence.cursor, event.user.presence.color);
    }
  });

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none overflow-hidden mix-blend-overlay"
    >
      {pixels.map((pixel) => (
        <div
          key={`${pixel.x},${pixel.y},${pixel.started}`}
          className={styles.pixel}
          onAnimationEnd={() => {
            // Only remove this paint, not a newer visit to the same cell.
            setPixels((current) => current.filter((p) => p !== pixel));
          }}
          style={{
            width: DENSITY_PIXELS,
            height: DENSITY_PIXELS,
            transform: `translate(${pixel.x - DENSITY_PIXELS / 2}px, ${
              pixel.y - DENSITY_PIXELS / 2
            }px)`,
            backgroundColor: pixel.color,
            animationDuration: `${DELAY_TIMEOUT_PIXEL}ms`,
          }}
        />
      ))}
    </div>
  );
}
