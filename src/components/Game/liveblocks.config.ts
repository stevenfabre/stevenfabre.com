import { createClient, LiveList, LiveObject } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";
import { Pixel, Point } from "./types";

const client = createClient({
  authEndpoint: "/api/auth",
});

export type Presence = {
  cursor: Point | null;
  color: string;
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
