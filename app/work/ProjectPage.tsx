import type { ComponentProps } from "react";
import cx from "../../src/utils/cx";

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
        "[--visual-height:max(10rem,calc(100svh-15rem))] sm:[--visual-height:max(10rem,calc(100svh-14.5rem))] md:[--visual-height:max(10rem,min(70svh,calc(100svh-18rem)))]",
        "[html:has(&)]:[scrollbar-gutter:stable]",
        className
      )}
    />
  );
}
