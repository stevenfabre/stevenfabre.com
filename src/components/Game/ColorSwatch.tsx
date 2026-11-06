export function ColorSwatch({ color }: { color: string }) {
  return (
    <span
      aria-hidden="true"
      className="block size-5 shrink-0 rounded-full sm:size-4"
      style={{ backgroundColor: color }}
    />
  );
}
