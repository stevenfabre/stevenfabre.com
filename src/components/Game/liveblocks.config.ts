import { createClient, LiveList, LiveObject } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";
import { Pixel, Point } from "./types";

const client = createClient({
  publicApiKey:
    "pk_prod_OBt1rwR5ktdr5_6f10yeHG3mYayAa41oVetV_9io3No568b2l8wE7C9meQiDBZRA",
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
