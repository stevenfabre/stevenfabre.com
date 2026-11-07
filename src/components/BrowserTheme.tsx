"use client";

import { useTheme } from "next-themes";
import { useEffect } from "react";

export default function BrowserTheme() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (!resolvedTheme) return;
    // Honor the site's override even when it differs from the device theme.
    document
      .querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')
      .forEach((meta) => {
        meta.content = resolvedTheme === "dark" ? "#0a0a0a" : "#fafafa";
      });
  }, [resolvedTheme]);

  return null;
}
