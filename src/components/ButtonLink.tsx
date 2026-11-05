"use client";

import { forwardRef, type AnchorHTMLAttributes } from "react";
import cx from "../utils/cx";
import styles from "./ButtonLink.module.css";
import { SiteLink } from "./SiteNavigation";

type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: "text" | "icon";
  appearance?: "ghost" | "raised";
  iconPosition?: "start" | "end";
  compact?: boolean;
  clientNavigation?: boolean;
};

// Shared controls support ordinary links and the persistent home/work layout.
const ButtonLink = forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  function ButtonLink(
    {
      variant = "text",
      appearance = "ghost",
      iconPosition = "start",
      compact = false,
      clientNavigation = false,
      className,
      href,
      ...props
    },
    ref
  ) {
    const classes = cx(
      "inline-flex h-10 shrink-0 items-center justify-center rounded-md text-neutral-500 no-underline transition-colors duration-150 [-webkit-tap-highlight-color:transparent] hover:bg-neutral-200 focus:bg-neutral-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:focus-visible:outline-neutral-100 sm:h-8 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800",
      appearance === "ghost" &&
        "hover:text-neutral-900 focus:text-neutral-900 dark:hover:text-neutral-100 dark:focus:text-neutral-100",
      variant === "icon"
        ? "w-10 sm:w-8 [&_svg]:size-6 sm:[&_svg]:size-5"
        : "gap-1 text-sm font-medium [&_svg]:size-4",
      variant === "text" &&
        (iconPosition === "end"
          ? compact
            ? "pl-3.5 pr-2.5"
            : "pl-4 pr-3"
          : compact
          ? "pl-2.5 pr-3.5"
          : "pl-3 pr-4"),
      appearance === "raised" && styles.raised,
      className
    );
    if (clientNavigation && href) {
      return <SiteLink {...props} href={href} ref={ref} className={classes} />;
    }
    return <a {...props} href={href} ref={ref} className={classes} />;
  }
);

export default ButtonLink;
