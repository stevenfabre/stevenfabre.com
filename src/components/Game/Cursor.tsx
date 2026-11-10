"use client";

import { memo } from "react";
import { useOther } from "@liveblocks/react/suspense";

type Props = {
  connectionId: number;
};

function Cursor({ connectionId }: Props) {
  const { cursor, color, cursorType, location } = useOther(
    connectionId,
    (user) => user.presence
  );

  const countryMatch = location?.match(/(?:^|, )([A-Z]{2})$/);
  const country = countryMatch?.[1];
  const city = countryMatch ? location!.slice(0, countryMatch.index) : location;

  if (!cursor || cursor.length === 0) {
    return null;
  }

  return (
    <>
      {cursor.map((point, index) => (
        <div
          key={index}
          className="absolute left-1/2 top-1/2"
          style={{ transform: `translate(${point.x}px, ${point.y}px)` }}
        >
          {/* The supplied SVG tip is at (5, 5); keep that hotspot at the pointer. */}
          {cursorType === "mouse" && (
            <svg
              aria-hidden="true"
              width={24}
              height={24}
              viewBox="0 0 24 24"
              fill="none"
              className="absolute -left-[5px] -top-[5px] overflow-visible drop-shadow-[0_1px_1px_rgba(0,0,0,0.4)]"
            >
              <path
                d="M5.036 5.6103C5.00118 5.52995 4.99133 5.44099 5.00772 5.35496C5.0241 5.26894 5.06598 5.18982 5.1279 5.1279C5.18982 5.06598 5.26894 5.0241 5.35496 5.00772C5.44099 4.99133 5.52995 5.00118 5.6103 5.036L19.7253 10.7702C19.8112 10.8052 19.8838 10.8663 19.9329 10.9449C19.982 11.0235 20.0052 11.1155 19.999 11.208C19.9929 11.3005 19.9578 11.3887 19.8986 11.46C19.8395 11.5314 19.7595 11.5824 19.6698 11.6057L14.2672 12.9995C13.962 13.078 13.6833 13.2368 13.4602 13.4594C13.2371 13.6821 13.0777 13.9604 12.9986 14.2655L11.6057 19.6698C11.5824 19.7595 11.5314 19.8395 11.46 19.8986C11.3887 19.9578 11.3005 19.9929 11.208 19.999C11.1155 20.0052 11.0235 19.982 10.9449 19.9329C10.8663 19.8838 10.8052 19.8112 10.7702 19.7253L5.036 5.6103Z"
                fill={color}
                stroke="white"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}

          {cursorType === "touch" && (
            <svg
              className="absolute -left-[22px] -top-[22px]"
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
          {location && index === 0 && (
            <span
              className="absolute isolate flex w-max max-w-48 items-center gap-1 rounded-[5px] py-0.5 pl-1.5 pr-0.5 text-[10px] font-medium leading-[14px] text-white shadow-[0_1px_3px_rgba(0,0,0,0.2)]"
              style={{
                backgroundColor: color,
                left: cursorType === "touch" ? 18 : 14,
                top: cursorType === "touch" ? 18 : 14,
              }}
            >
              {city && <span className="min-w-0 truncate">{city}</span>}
              {country && (
                <span className="relative flex h-3.5 shrink-0 items-center justify-center rounded-[3px] px-1 text-white font-semibold tracking-[0.06em]">
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 rounded-[inherit] opacity-60 mix-blend-multiply"
                    style={{ backgroundColor: color }}
                  />
                  <span className="relative text-[8px] leading-none opacity-60">
                    {country}
                  </span>
                </span>
              )}
            </span>
          )}
        </div>
      ))}
    </>
  );
}

export default memo(Cursor);
