import type { AnchorHTMLAttributes } from "react";
import { SiteLink } from "./SiteNavigation";
import HeadingArrow from "./HeadingArrow";
import cx from "../utils/cx";
import styles from "./HeadingLink.module.css";

export const headingControl =
  "px-2 -mx-2 rounded-md focus-visible:outline-none focus-visible:bg-neutral-200 dark:focus-visible:bg-neutral-800";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  clientNavigation?: boolean;
  iconSize?: number;
};

export default function HeadingLink({
  children,
  className,
  clientNavigation,
  iconSize = 16,
  ...props
}: Props) {
  const Component = clientNavigation ? SiteLink : "a";
  return (
    <Component
      {...props}
      className={cx(
        headingControl,
        "inline-flex items-center gap-1.5 no-underline",
        styles.link,
        className
      )}
    >
      {children}
      <HeadingArrow size={iconSize} />
    </Component>
  );
}
