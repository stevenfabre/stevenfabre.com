import { useRef, useState } from "react";
import * as Select from "@radix-ui/react-select";
import { ColorSwatch } from "@/components/Game/ColorSwatch";
import { COLORS } from "@/components/Game/constants";
import { iconControl } from "@/components/buttonStyles";
import { SelectMenuSurface, type MenuMotion } from "@/components/SelectMenuSurface";
import { useTouchSelect } from "@/hooks/useTouchSelect";

export default function Toolbar({
  currentColor,
  setColor,
}: {
  currentColor: string;
  setColor: (color: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [touching, setTouching] = useState(false);
  const content = useRef<HTMLDivElement>(null);
  const background = useRef<HTMLDivElement>(null);
  const menuMotion = useRef<MenuMotion>(null);
  const startTouchSelection = useTouchSelect({
    open,
    content,
    onOpen: () => setOpen(true),
    onPosition: (x, y) => {
      setTouching(true);
      menuMotion.current?.move(x, y);
    },
    onEnd: () => {
      setTouching(false);
      menuMotion.current?.reset();
    },
    onSelect: (color) => {
      setColor(color);
      setOpen(false);
    },
    onDismiss: () => setOpen(false),
  });

  return (
    <Select.Root
      value={currentColor}
      onValueChange={setColor}
      open={open}
      onOpenChange={setOpen}
    >
      <Select.Trigger
        aria-label="Change drawing color"
        className={`${iconControl} group/color touch-none select-none [-webkit-touch-callout:none]`}
        onPointerDown={startTouchSelection}
      >
        <Select.Value>
          <span className="relative block rounded-full">
            <ColorSwatch color={currentColor} />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-full border border-transparent group-hover/color:border-black/20 group-focus/color:border-black/20 dark:border-black/20 dark:group-hover/color:border-transparent dark:group-focus/color:border-transparent"
            />
          </span>
        </Select.Value>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content
          ref={content}
          onPointerDown={startTouchSelection}
          position="item-aligned"
          aria-label="Drawing colors"
          data-touching={touching || undefined}
          className="z-50 touch-none outline-none motion-safe:[&[data-touching]_[data-highlighted]_[data-swatch]]:scale-110 motion-safe:[&_[data-menu-item]]:hover:[&_[data-swatch]]:scale-110"
        >
          <SelectMenuSurface
            compact
            open={open}
            backgroundRef={background}
            motionRef={menuMotion}
          >
            <Select.Viewport
              style={{ overflow: "visible" }}
              className="p-1 [&:not(:has([data-highlighted]))_[data-state=checked]]:bg-neutral-100 dark:[&:not(:has([data-highlighted]))_[data-state=checked]]:bg-neutral-700"
            >
              {Object.entries(COLORS).map(([name, color]) => {
                const label = name.charAt(0) + name.slice(1).toLowerCase();
                return (
                  <Select.Item
                    key={name}
                    value={color}
                    textValue={label}
                    aria-label={label}
                    data-menu-item
                    data-select-value={color}
                    className="flex size-10 cursor-pointer select-none items-center justify-center rounded-md outline-none data-[highlighted]:bg-neutral-100 dark:data-[highlighted]:bg-neutral-700 sm:size-8"
                  >
                    <Select.ItemText>
                      <span
                        data-swatch
                        className="block transition-transform duration-150 motion-reduce:transition-none"
                      >
                        <ColorSwatch color={color} />
                      </span>
                    </Select.ItemText>
                  </Select.Item>
                );
              })}
            </Select.Viewport>
          </SelectMenuSurface>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
