import { useEffect, useId, useRef, useState } from "react";
import { ColorSwatch } from "./ColorSwatch";
import { COLORS } from "./constants";
import { iconControl } from "../buttonStyles";
import { Tooltip } from "../Tooltip";

export default function Toolbar({
  currentColor,
  setColor,
}: {
  currentColor: string;
  setColor: (color: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const id = useId();

  useEffect(() => {
    if (!open) return;
    const dismiss = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !container.current?.contains(event.target)
      )
        setOpen(false);
    };
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, [open]);

  return (
    <div
      ref={container}
      className="relative"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          event.preventDefault();
          event.stopPropagation();
          setOpen(false);
          trigger.current?.focus();
        }
      }}
    >
      <Tooltip content="Change color" open={open ? false : undefined}>
        <button
          ref={trigger}
          type="button"
          className={iconControl}
          aria-label="Change drawing color"
          aria-expanded={open}
          aria-controls={open ? id : undefined}
          onClick={() => setOpen((value) => !value)}
        >
          <span
            aria-hidden="true"
            className="relative size-3 rounded-full"
            style={{ backgroundColor: currentColor }}
          >
            <span className="absolute inset-0 rounded-full border border-black/15" />
          </span>
        </button>
      </Tooltip>
      {open && (
        <div
          id={id}
          role="group"
          aria-label="Drawing colors"
          className="surface-popover absolute bottom-full right-0 mb-2 flex p-1"
        >
          {Object.entries(COLORS).map(([name, color]) => (
            <ColorSwatch
              key={name}
              color={color}
              label={name.charAt(0) + name.slice(1).toLowerCase()}
              selected={currentColor === color}
              onClick={() => {
                setColor(color);
                setOpen(false);
                trigger.current?.focus();
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
