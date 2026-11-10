"use client";

import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
import Game from "@/components/Game/Game";
import { COLORS } from "@/components/Game/constants";

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
      >
        <ClientSideSuspense fallback={<></>}>
          {() => <Game />}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
