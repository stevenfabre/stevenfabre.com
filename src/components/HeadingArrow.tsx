import Icon from "./Icon";
import styles from "./HeadingLink.module.css";

export default function HeadingArrow({ size = 16 }: { size?: number }) {
  return (
    <span
      aria-hidden="true"
      className={styles.arrow}
      style={{ width: size, height: size }}
    >
      <Icon name="arrow-up-right" size={size} className={styles.departing} />
      <Icon name="arrow-up-right" size={size} className={styles.arriving} />
    </span>
  );
}
