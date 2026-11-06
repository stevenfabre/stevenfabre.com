"use client";

import { Plus } from "lucide-react";
import { memo } from "react";
import { useOther } from "@liveblocks/react/suspense";

type Props = {
  connectionId: number;
};

function Cursor({ connectionId }: Props) {
  const { cursor, color, cursorType } = useOther(
    connectionId,
    (user) => user.presence
  );

  if (!cursor || cursor.length === 0) {
    return null;
  }

  return (
    <>
      {cursor.map((point, index) => (
        <div key={index}>
          {cursorType === "mouse" && (
            <Plus
              aria-hidden="true"
              width={15}
              height={15}
              strokeWidth={2}
              style={{
                color,
                filter: "drop-shadow(0 0 1px white)",
                transform: `translateX(${point.x}px) translateY(${point.y}px)`,
              }}
            />
          )}

          {cursorType === "touch" && (
            <svg
              style={{
                transform: `translateX(${point.x}px) translateY(${point.y}px)`,
              }}
              width="44"
              height="44"
              viewBox="0 0 44 44"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M40 22C40 31.9411 31.9411 40 22 40C12.0589 40 4 31.9411 4 22C4 12.0589 12.0589 4 22 4C31.9411 4 40 12.0589 40 22Z"
                fill="white"
                fillOpacity="0.4"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M41 22C41 32.4934 32.4934 41 22 41C11.5066 41 3 32.4934 3 22C3 11.5066 11.5066 3 22 3C32.4934 3 41 11.5066 41 22ZM22 40C31.9411 40 40 31.9411 40 22C40 12.0589 31.9411 4 22 4C12.0589 4 4 12.0589 4 22C4 31.9411 12.0589 40 22 40Z"
                fill="black"
                fillOpacity="0.08"
              />
            </svg>
          )}
        </div>
      ))}
    </>
  );
}

export default memo(Cursor);
