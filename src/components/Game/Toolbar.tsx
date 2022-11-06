import { ColorSwatch } from "./ColorSwatch";
import { COLORS } from "./constants";

export default function Toolbar({
  currentColor,
  setColor,
}: {
  currentColor: string;
  setColor: (color: string) => void;
}) {
  return (
    <div className="absolute top-4 bg-neutral-100 dark:bg-neutral-900 rounded-lg flex p-1 transform md:-translate-y-16 ease-[cubic-bezier(.2,1.35,.36,1)] group-hover:transform-none transition-transform delay-300 duration-500">
      <ColorSwatch
        color={COLORS.ORANGE}
        label="Orange"
        onClick={() => setColor(COLORS.ORANGE)}
        selected={currentColor === COLORS.ORANGE}
      />
      <ColorSwatch
        color={COLORS.PINK}
        label="Pink"
        onClick={() => setColor(COLORS.PINK)}
        selected={currentColor === COLORS.PINK}
      />
      <ColorSwatch
        color={COLORS.RED}
        label="Red"
        onClick={() => setColor(COLORS.RED)}
        selected={currentColor === COLORS.RED}
      />
      <ColorSwatch
        color={COLORS.SKY}
        label="Sky"
        onClick={() => setColor(COLORS.SKY)}
        selected={currentColor === COLORS.SKY}
      />
      <ColorSwatch
        color={COLORS.TEAL}
        label="Teal"
        onClick={() => setColor(COLORS.TEAL)}
        selected={currentColor === COLORS.TEAL}
      />
    </div>
  );
}
