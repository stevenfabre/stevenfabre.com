import type { AnchorHTMLAttributes } from "react";
import AppLink from "./AppLink";
import HeadingArrow from "@/components/HeadingArrow";
import cx from "@/utils/cx";
import styles from "@/components/HeadingLink.module.css";

export const headingControl =
  "px-2 -mx-2 rounded-md focus-visible:outline-none focus-visible:bg-neutral-200 dark:focus-visible:bg-neutral-800";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  iconSize?: number;
};

export default function HeadingLink({
  children,
  className,
  iconSize = 16,
  ...props
}: Props) {
  return (
    <AppLink
      {...props}
      className={cx(
        headingControl,
        "inline-flex items-center gap-1 no-underline",
        styles.link,
        className
      )}
    >
      {children}
      <HeadingArrow size={iconSize} />
    </AppLink>
  );
}
