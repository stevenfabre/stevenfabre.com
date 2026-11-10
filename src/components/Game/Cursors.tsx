"use client";

import Cursor from "@/components/Game/Cursor";
import { useOthersConnectionIds } from "@liveblocks/react/suspense";

export default function Cursors() {
  const ids = useOthersConnectionIds();

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {ids.map((connectionId) => (
        <Cursor key={connectionId} connectionId={connectionId} />
      ))}
    </div>
  );
}
