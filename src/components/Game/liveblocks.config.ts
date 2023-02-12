import { createClient, LiveList, LiveObject } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";
import { CursorType, Pixel, Point } from "./types";

const client = createClient({
  throttle: 16,
  publicApiKey: process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY as string,
});

export type Presence = {
  cursor: Point | null;
  color: string;
  cursorType: CursorType | null;
};

export type Storage = {
  pixels: LiveList<LiveObject<Pixel>>;
};

export const {
  suspense: {
    RoomProvider,
    useMutation,
    useOthers,
    useOthersMapped,
    useOthersConnectionIds,
    useOther,
    useRoom,
    useSelf,
    useStorage,
    useUpdateMyPresence,
  },
} = createRoomContext<Presence, Storage>(client);
