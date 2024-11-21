"use client";

import { useOthers } from "@liveblocks/react/suspense";

export default function Footer() {
  const countOthers = useOthers((others) => others.length);

  return (
    <div className="absolute bottom-0 right-0 left-0 py-4 px-6 flex gap-4 items-center justify-end pointer-events-none">
      <div className="absolute -top-12 left-0 right-0 bottom-0 bg-gradient-to-t from-neutral-900 to-transparent dark:from-neutral-100 opacity-60" />
      <span className="relative z-10 inline-flex items-center gap-2 h-10 sm:h-8 text-sm text-neutral-100 dark:text-neutral-900 font-medium tabular-nums">
        <svg
          aria-hidden="true"
          focusable="false"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M13 7h-1v1h1a1.502 1.502 0 0 1 1.5 1.5v2h1v-2A2.503 2.503 0 0 0 13 7ZM12 2a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm0-1a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5ZM11.5 15h-1v-1A1.502 1.502 0 0 0 9 12.5H7A1.502 1.502 0 0 0 5.5 14v1h-1v-1A2.503 2.503 0 0 1 7 11.5h2a2.503 2.503 0 0 1 2.5 2.5v1ZM8 6.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm0-1a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5ZM4 7H3A2.503 2.503 0 0 0 .5 9.5v2h1v-2A1.502 1.502 0 0 1 3 8h1V7ZM4 2a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm0-1a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z" />
        </svg>
        {countOthers + 1}
      </span>
    </div>
  );
}
