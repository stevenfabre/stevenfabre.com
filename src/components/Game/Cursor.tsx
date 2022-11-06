import { memo } from "react";
import { useOther } from "./liveblocks.config";

type Props = {
  connectionId: number;
};

function Cursor({ connectionId }: Props) {
  const { cursor, color } = useOther(connectionId, (user) => user.presence);

  if (!cursor) {
    return null;
  }

  const { x, y } = cursor;
  return (
    <svg
      style={{
        transition: "transform 80ms linear",
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
  );
}

export default memo(Cursor);
