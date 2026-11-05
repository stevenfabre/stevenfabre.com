"use client";

import { forwardRef, type AnchorHTMLAttributes } from "react";
import { SiteLink } from "./SiteNavigation";

const CompanyLink = forwardRef<
  HTMLAnchorElement,
  AnchorHTMLAttributes<HTMLAnchorElement> & { clientNavigation?: boolean }
>(function CompanyLink({ className, clientNavigation, href, ...props }, ref) {
  const Component = clientNavigation && href ? SiteLink : "a";
  return (
    <Component
      href={href || "#"}
      {...props}
      ref={ref}
      className={
        className ??
        "shrink-0 underline-offset-4 decoration-2 underline decoration-neutral-300 hover:decoration-neutral-900 focus:decoration-neutral-900 dark:decoration-neutral-700 dark:hover:decoration-neutral-100 dark:focus:decoration-neutral-100 text-neutral-900 dark:text-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-400"
      }
    />
  );
});

export default CompanyLink;
