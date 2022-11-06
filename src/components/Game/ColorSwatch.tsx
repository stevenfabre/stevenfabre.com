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
      className="rounded-md overflow-hidden relative w-8 h-8 flex items-center justify-center"
      onClick={onClick}
    >
      {selected && (
        <>
          <span
            className="absolute inset-0 opacity-20 rounded-md"
            style={{ backgroundColor: color }}
          />
          <span className="absolute rounded-full w-5 h-5 bg-neutral-100 dark:bg-neutral-900" />
        </>
      )}
      <span
        className="block relative rounded-full w-4 h-4"
        style={{ backgroundColor: color }}
      />
      <span className="sr-only">{label}</span>
    </button>
  );
}
