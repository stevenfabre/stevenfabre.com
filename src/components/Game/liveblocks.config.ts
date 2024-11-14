import { LiveList, LiveObject } from "@liveblocks/client";
import { CursorType, Pixel, Point } from "./types";

export type Presence = {
  cursor: Point | null;
  color: string;
  cursorType: CursorType | null;
};

export type Storage = {
  pixels: LiveList<LiveObject<Pixel>>;
};

declare global {
  interface Liveblocks {
    Presence: Presence;
    Storage: Storage;
  }
}
