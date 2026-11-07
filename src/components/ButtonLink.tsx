"use client";

import { forwardRef, type AnchorHTMLAttributes } from "react";
import cx from "@/utils/cx";
import { squareControlSize } from "@/components/buttonStyles";
import AppLink from "./AppLink";

type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: "text" | "icon";
  appearance?: "ghost" | "raised";
  iconPosition?: "start" | "end";
  compact?: boolean;
};

// Shared controls support ordinary links and the persistent home/work layout.
const ButtonLink = forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  function ButtonLink(
    {
      variant = "text",
      appearance = "ghost",
      iconPosition = "start",
      compact = false,
      className,
      href,
      ...props
    },
    ref
  ) {
    const classes = cx(
      "inline-flex h-10 shrink-0 items-center justify-center rounded-md no-underline transition-colors duration-300 active:duration-0 [-webkit-tap-highlight-color:transparent] focus-visible:outline-none sm:h-8",
      appearance === "ghost" &&
        "active:bg-neutral-200 active:text-neutral-900 dark:active:bg-neutral-800 dark:active:text-neutral-100 data-[keyboard-pressed=true]:bg-neutral-200 data-[keyboard-pressed=true]:text-neutral-900 dark:data-[keyboard-pressed=true]:bg-neutral-800 dark:data-[keyboard-pressed=true]:text-neutral-100 text-neutral-500 hover:bg-neutral-200 focus-visible:bg-neutral-200 hover:text-neutral-900 focus-visible:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:focus-visible:bg-neutral-800 dark:hover:text-neutral-100 dark:focus-visible:text-neutral-100",
      variant === "icon"
        ? squareControlSize
        : "gap-1.5 text-sm font-medium leading-none [&_svg]:size-4 [&_svg]:shrink-0",
      variant === "text" &&
        (iconPosition === "end"
          ? compact
            ? "pl-3.5 pr-2.5"
            : "pl-4 pr-3"
          : compact
          ? "pl-2.5 pr-3.5"
          : "pl-3 pr-4"),
      appearance === "raised" &&
        "rounded-lg border border-black/8 bg-white text-neutral-700 shadow-raised transition-[background-color,box-shadow] duration-300 hover:bg-neutral-50 focus-visible:bg-neutral-200 active:bg-neutral-100 active:shadow-pressed active:duration-0 dark:border-white/9 dark:border-t-white/13 dark:bg-[#242424] dark:text-neutral-200 dark:hover:bg-[#2c2c2c] dark:focus-visible:bg-neutral-700 dark:active:bg-[#202020]",
      className
    );
    return <AppLink {...props} href={href} ref={ref} className={classes} />;
  }
);

export default ButtonLink;
