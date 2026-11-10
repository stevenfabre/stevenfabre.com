import type { RippleEvent } from "./types";
import { CursorType, Point } from "@/components/Game/types";

export type Presence = {
  cursor: Point[] | null;
  color: string;
  cursorType: CursorType | null;
  location?: string | null;
};

declare global {
  interface Liveblocks {
    RoomEvent: RippleEvent;
    Presence: Presence;
  }
}
