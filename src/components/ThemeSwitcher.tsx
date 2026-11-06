"use client";

import { iconControl } from "./buttonStyles";
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
        className={iconControl}
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
