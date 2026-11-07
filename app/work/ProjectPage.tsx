import type { ComponentProps } from "react";
import cx from "@/utils/cx";

// Loading and loaded projects share the same viewport geometry and gutters.
export default function ProjectPage({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      {...props}
      className={cx(
        "flex min-h-svh flex-col px-4 text-neutral-900 dark:text-neutral-100",
        // Reserve caption space, with a 10rem floor on short screens.
        "[--visual-height:clamp(10rem,calc(100svh-15rem),70svh)]",
        "[html:has(&)]:[scrollbar-gutter:stable]",
        className
      )}
    />
  );
}
