import { ClientSideSuspense } from "@liveblocks/react";
import { RoomProvider, Storage } from "./liveblocks.config";
import Game from "./Game";
import {
  COLORS,
  PIXELS_RESOLUTION_WIDTH,
  PIXELS_RESOLUTION_HEIGHT,
} from "./constants";
import { LiveList, LiveObject } from "@liveblocks/client";
import { Pixel } from "./types";

export default function GameProvider() {
  const colorKeys = Object.keys(COLORS);
  console.log("Real-time collaboration powered by liveblocks.io");

  return (
    <RoomProvider
      id="game"
      initialPresence={{
        cursor: null,
        color: COLORS.ORANGE,
      }}
      initialStorage={initializeStorage()}
    >
      <ClientSideSuspense fallback={<></>}>{() => <Game />}</ClientSideSuspense>
    </RoomProvider>
  );
}

function initializeStorage(): Storage {
  const pixels = new LiveList<LiveObject<Pixel>>();

  for (
    let x = -PIXELS_RESOLUTION_WIDTH / 2;
    x < PIXELS_RESOLUTION_WIDTH / 2;
    x++
  ) {
    for (
      let y = -PIXELS_RESOLUTION_HEIGHT / 2;
      y < PIXELS_RESOLUTION_HEIGHT / 2;
      y++
    ) {
      pixels.push(new LiveObject({ x, y, color: COLORS.ORANGE }));
    }
  }

  return {
    pixels,
  };
}
