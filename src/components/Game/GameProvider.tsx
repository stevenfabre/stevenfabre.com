"use client";

import { LiveList, LiveObject } from "@liveblocks/client";
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
import Game from "@/components/Game/Game";
import {
  COLORS,
  PIXELS_RESOLUTION_HEIGHT,
  PIXELS_RESOLUTION_WIDTH,
} from "@/components/Game/constants";
import { Pixel } from "@/components/Game/types";
import { Storage } from "@/components/Game/liveblocks.config";

export default function GameProvider() {
  return (
    <LiveblocksProvider
      publicApiKey={process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY || ""}
      throttle={16}
    >
      <RoomProvider
        id="game-hello-stevenfabre.com"
        initialPresence={() => {
          const colors = Object.values(COLORS);
          return {
            cursor: null,
            color: colors[Math.floor(Math.random() * colors.length)],
            cursorType: null,
          };
        }}
        initialStorage={initializeStorage()}
      >
        <ClientSideSuspense fallback={<></>}>
          {() => <Game />}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}

function initializeStorage(): Storage {
  const pixels = new LiveList<LiveObject<Pixel>>([]);

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
