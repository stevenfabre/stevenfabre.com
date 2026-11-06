import type { AnchorHTMLAttributes } from "react";
import WorkIcon from "./WorkIcon";
import heading from "../../src/components/HeadingControl.module.css";
import styles from "./external-link.module.css";

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
      className={[styles.link, heading.control, className].filter(Boolean).join(" ")}
    >
      {children}
      <span
        className={styles.arrow}
        style={{ width: iconSize, height: iconSize }}
        aria-hidden="true"
      >
        <WorkIcon
          name="arrow-up-right"
          size={iconSize}
          className={styles.departing}
        />
        <WorkIcon
          name="arrow-up-right"
          size={iconSize}
          className={styles.arriving}
        />
      </span>
    </a>
  );
}
