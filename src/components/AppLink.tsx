"use client";

import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { SiteLink } from "./SiteNavigation";

// Local routes share the portfolio navigation behavior; external and hash links
// retain native browser behavior. SiteLink preserves modifier clicks and targets.
const AppLink = forwardRef<HTMLAnchorElement, ComponentPropsWithoutRef<"a">>(
  function AppLink({ href, ...props }, ref) {
    if (href?.startsWith("/") && !href.startsWith("//"))
      return <SiteLink {...props} href={href} ref={ref} />;
    return <a {...props} href={href} ref={ref} />;
  }
);

export default AppLink;
