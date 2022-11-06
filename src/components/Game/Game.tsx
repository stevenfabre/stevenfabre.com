import { useEffect } from "react";
import ColorPicker from "./ColorPicker";
import { DENSITY_PIXELS } from "./constants";
import Cursors from "./Cursors";
import { useMutation, useSelf, useStorage } from "./liveblocks.config";
import { Point } from "./types";

export default function Game() {
  const me = useSelf();
  const pixels = useStorage((root) => root.pixels);

  const setColor = useMutation(
    ({ setMyPresence }, color: string) => setMyPresence({ color }),
    []
  );

  const setCursor = useMutation(
    ({ setMyPresence }, cursor: Point | null) => setMyPresence({ cursor }),
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
      }, 1000);
    },
    [me]
  );

  useEffect(() => {
    const onWindowBlur = () => {
      setCursor(null);
    };

    window.addEventListener("blur", onWindowBlur);

    return () => {
      window.removeEventListener("blur", onWindowBlur);
    };
  });

  return (
    <div className="group absolute inset-0 flex justify-center items-center">
      <div
        className="absolute inset-0 flex items-center justify-center mix-blend-overlay cursor-crosshair"
        onPointerMove={(e) => {
          const bounds = e.currentTarget.getBoundingClientRect();

          setCursor({
            x: Math.round(e.clientX - bounds.width / 2),
            y: Math.round(e.clientY - bounds.height / 2),
          });
        }}
        onPointerLeave={() => setCursor(null)}
      >
        {pixels.map((pixel, index) => {
          const { x, y, color, on } = pixel;

          return (
            <div
              key={index}
              onPointerEnter={() => setPixel(index)}
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

      <Cursors />

      <ColorPicker
        currentColor={me.presence.color}
        setColor={(color) => setColor(color)}
      />
    </div>
  );
}
