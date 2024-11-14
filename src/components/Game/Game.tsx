"use client";

import { useEffect } from "react";
import Toolbar from "./Toolbar";
import { DELAY_TIMEOUT_PIXEL, DENSITY_PIXELS } from "./constants";
import Cursors from "./Cursors";
import { useMutation, useSelf, useStorage } from "@liveblocks/react/suspense";
import { CursorType, Point } from "./types";
import Footer from "./Footer";

export default function Game() {
  const me = useSelf();
  const pixels = useStorage((root) => root.pixels);

  const setColor = useMutation(
    ({ setMyPresence }, color: string) => setMyPresence({ color }),
    []
  );

  const setCursor = useMutation(
    ({ setMyPresence }, cursor: Point | null, cursorType: CursorType | null) =>
      setMyPresence({ cursor, cursorType }),
    []
  );

  const setPixel = useMutation(
    ({ storage }, index: number) => {
      const pixels = storage.get("pixels");
      const pixel = pixels.get(index);

      if (!pixel) {
        return;
      }

      pixel.set("color", me.presence.color);
      pixel.set("on", true);

      setTimeout(() => {
        pixel.set("on", false);
      }, DELAY_TIMEOUT_PIXEL);
    },
    [me]
  );

  useEffect(() => {
    const onWindowBlur = () => {
      setCursor(null, null);
    };

    window.addEventListener("blur", onWindowBlur);

    return () => {
      window.removeEventListener("blur", onWindowBlur);
    };
  });

  const onDraw = (
    clientX: number,
    clientY: number,
    cursorType: CursorType,
    target: HTMLElement
  ) => {
    const bounds = target.getBoundingClientRect();
    const point = {
      x: Math.round(clientX - bounds.width / 2),
      y: Math.round(clientY - bounds.height / 2),
    };

    setCursor(point, cursorType);

    const pixelIndexFromPoint = pixels.findIndex((pixel) => {
      return (
        pixel.x * DENSITY_PIXELS + DENSITY_PIXELS / 2 >= point.x &&
        pixel.y * DENSITY_PIXELS + DENSITY_PIXELS / 2 >= point.y
      );
    });

    setPixel(pixelIndexFromPoint);
  };

  return (
    <div className="group absolute inset-0 flex justify-center items-center touch-none md:touch-auto">
      <div
        className="absolute inset-0 flex items-center justify-center mix-blend-overlay cursor-crosshair"
        onPointerMove={(e) => {
          const cursorType = e.pointerType === "touch" ? "touch" : "mouse";
          onDraw(e.clientX, e.clientY, cursorType, e.currentTarget);
        }}
        onPointerLeave={() => setCursor(null, null)}
      >
        {pixels.map((pixel, index) => {
          const { x, y, color, on } = pixel;

          return (
            <div
              key={index}
              className="absolute flex items-center justify-center"
              style={{
                transform: `translateX(${x * DENSITY_PIXELS}px) translateY(${
                  y * DENSITY_PIXELS
                }px)`,
                width: `${DENSITY_PIXELS}px`,
                height: `${DENSITY_PIXELS}px`,
              }}
            >
              {on && (
                <div
                  className="absolute w-full h-full"
                  style={{
                    backgroundColor: color,
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      <Footer />

      <Cursors />

      <Toolbar
        currentColor={me.presence.color}
        setColor={(color) => setColor(color)}
      />
    </div>
  );
}
