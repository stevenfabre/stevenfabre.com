import type { AnchorHTMLAttributes } from "react";
import HeadingArrow from "../../src/components/HeadingArrow";
import { headingLink } from "../../src/components/controlStyles";
import styles from "../../src/components/HeadingLink.module.css";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  iconSize?: number;
};

export default function ExternalLink({
  children,
  className,
  iconSize = 16,
  ...props
}: Props) {
  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      {...props}
      className={[styles.link, headingLink, className]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
      <HeadingArrow size={iconSize} />
    </a>
  );
}
