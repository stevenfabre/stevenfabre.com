"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Tooltip } from "./Tooltip";

export default function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  useEffect(() => setMounted(true), []);

  return (
    <Tooltip content="Switch theme" delayDuration={200}>
      <button
        aria-label="Toggle theme"
        type="button"
        className="size-10 sm:size-8 bg-neutral-200 bg-opacity-0 hover:bg-opacity-100 focus:bg-opacity-100 rounded-md dark:bg-neutral-800 dark:bg-opacity-0 dark:hover:bg-opacity-100 dark:focus:bg-opacity-100 flex items-center justify-center"
        onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      >
        {mounted && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            className="size-6 sm:size-5 text-neutral-500 dark:text-neutral-400"
          >
            {resolvedTheme === "dark" ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            )}
          </svg>
        )}
      </button>
    </Tooltip>
  );
}
