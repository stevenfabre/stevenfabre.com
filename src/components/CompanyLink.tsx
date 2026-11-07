"use client";

import { forwardRef, type AnchorHTMLAttributes } from "react";
import AppLink from "./AppLink";

const CompanyLink = forwardRef<
  HTMLAnchorElement,
  AnchorHTMLAttributes<HTMLAnchorElement>
>(function CompanyLink({ className, href, ...props }, ref) {
  return (
    <AppLink
      href={href || "#"}
      {...props}
      ref={ref}
      className={
        className ??
        "shrink-0 underline-offset-4 decoration-2 underline decoration-neutral-300 hover:decoration-neutral-900 focus:decoration-neutral-900 dark:decoration-neutral-700 dark:hover:decoration-neutral-100 dark:focus:decoration-neutral-100 text-neutral-900 dark:text-neutral-100 focus-visible:outline-none"
      }
    />
  );
});

export default CompanyLink;
