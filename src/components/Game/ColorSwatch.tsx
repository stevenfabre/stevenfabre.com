import { MouseEventHandler } from "react";

export function ColorSwatch({
  color,
  label,
  onClick,
  selected,
}: {
  color: string;
  label: string;
  onClick?: MouseEventHandler;
  selected?: boolean;
}) {
  return (
    <button
      aria-label={`Select ${label}`}
      type="button"
      className="rounded-md overflow-hidden relative size-10 sm:size-8 flex items-center justify-center"
      onClick={onClick}
    >
      {selected && (
        <>
          <span
            className="absolute inset-0 opacity-20 rounded-md"
            style={{ backgroundColor: color }}
          />
          <span className="absolute rounded-full size-6 sm:size-5 bg-neutral-50 dark:bg-neutral-900" />
        </>
      )}
      <span
        className="block relative rounded-full size-5 sm:size-4"
        style={{ backgroundColor: color }}
      />
      <span className="sr-only">{label}</span>
    </button>
  );
}
