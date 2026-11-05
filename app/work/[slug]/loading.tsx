import styles from "../detail.module.css";

export default function LoadingProject() {
  return (
    <div className={styles.page} aria-busy="true" aria-label="Loading project">
      <div className="h-[var(--bar-height)] shrink-0" />
      <div className="h-[var(--visual-height)] w-full rounded-lg bg-black/5 dark:bg-white/5" />
      <div
        role="status"
        className="mx-auto mt-16 w-full max-w-[var(--caption-width)] text-sm text-neutral-500"
      >
        Loading project…
      </div>
    </div>
  );
}
