"use client";

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

  if (!cursor) {
    return null;
  }

  const { x, y } = cursor;
  return (
    <>
      {cursorType === "mouse" && (
        <svg
          style={{
            transform: `translateX(${x}px) translateY(${y}px)`,
          }}
          width="15"
          height="15"
          viewBox="0 0 15 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M6 0H9V6H15V9H9V15H6V9H0V6H6V0ZM7 1H8V7H14V8H8V14H7V8H1V7H7V1Z"
            fill="white"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M8 1H7V7H1V8H7V14H8V8H14V7H8V1Z"
            fill={color}
          />
        </svg>
      )}

      {cursorType === "touch" && (
        <svg
          style={{
            transform: `translateX(${x}px) translateY(${y}px)`,
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
    </>
  );
}

export default memo(Cursor);
