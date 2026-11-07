import type { ComponentProps } from "react";
import cx from "../../src/utils/cx";
import styles from "./detail.module.css";

// Loading and loaded projects share the same viewport geometry and gutters.
export default function ProjectPage({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      {...props}
      className={cx(
        styles.page,
        "flex min-h-svh flex-col px-4 text-neutral-900 dark:text-neutral-100",
        className
      )}
    />
  );
}
