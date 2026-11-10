"use client";

import { useEffect, useRef } from "react";
import { DENSITY_PIXELS } from "./constants";
import type { Ripple } from "./types";

export default function Ripples({ ripples }: { ripples: Ripple[] }) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = canvas.current!;
    const ctx = el.getContext("2d");
    if (!ctx) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let width = 0,
      height = 0,
      frame = 0;
    const draw = (now: number) => {
      frame = 0;
      ctx.clearRect(0, 0, width, height);
      const active = ripples.filter(
        (p) => now - p.started < (reduced.matches ? 200 : 1000)
      );
      for (const ripple of active) {
        drawRipple(ctx, ripple, now, width, height, reduced.matches);
      }
      if (active.length) frame = requestAnimationFrame(draw);
    };
    const resize = () => {
      const rect = el.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(devicePixelRatio, 2);
      el.width = Math.round(width * dpr);
      el.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!frame) frame = requestAnimationFrame(draw);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(el);
    resize();
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [ripples]);

  return (
    <canvas
      ref={canvas}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none mix-blend-overlay"
    />
  );
}

function drawRipple(
  ctx: CanvasRenderingContext2D,
  ripple: Ripple,
  now: number,
  width: number,
  height: number,
  reduced: boolean
) {
  const cell = DENSITY_PIXELS;
  const t = (now - ripple.started) / 1000;
  ctx.fillStyle = ripple.color;
  if (reduced) {
    ctx.globalAlpha = Math.max(0, 1 - t * 5) * 0.7;
    ctx.fillRect(
      width / 2 + Math.round(ripple.x / cell) * cell - cell / 2,
      height / 2 + Math.round(ripple.y / cell) * cell - cell / 2,
      cell,
      cell
    );
    return;
  }
  const radius = 190 * (1 - (1 - t) ** 2);
  // Same centered coordinate system as the shared pixels and cursors.
  for (let x = -Math.ceil(width / 2 / cell) * cell; x < width / 2; x += cell) {
    for (
      let y = -Math.ceil(height / 2 / cell) * cell;
      y < height / 2;
      y += cell
    ) {
      const band = Math.max(
        0,
        1 - Math.abs(Math.hypot(x - ripple.x, y - ripple.y) - radius) / 27
      );
      if (!band) continue;
      ctx.globalAlpha = band * (1 - t) * 0.9;
      ctx.fillRect(
        width / 2 + x - cell / 2,
        height / 2 + y - cell / 2,
        cell - 1,
        cell - 1
      );
    }
  }
}
