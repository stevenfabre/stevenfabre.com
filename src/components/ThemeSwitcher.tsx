"use client";

import Icon from "./Icon";
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
        className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 focus:text-neutral-900 dark:hover:text-neutral-100 dark:focus:text-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:focus-visible:outline-neutral-100 size-10 sm:size-8 bg-neutral-200/0 hover:bg-neutral-200 focus:bg-neutral-200 rounded-md dark:bg-neutral-800/0 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800 flex items-center justify-center"
        onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      >
        {mounted && (
          <Icon
            name={resolvedTheme === "dark" ? "sun" : "moon"}
            className="size-6 sm:size-5"
          />
        )}
      </button>
    </Tooltip>
  );
}
