import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import cx from "@/utils/cx";
import React from "react";

type TooltipProps = Omit<
  React.ComponentProps<typeof TooltipPrimitive.Root>,
  "content"
> &
  Omit<React.ComponentProps<typeof TooltipPrimitive.Content>, "content"> & {
    children: React.ReactElement;
    content: React.ReactNode;
  };

export function Tooltip({
  children,
  content,
  open,
  defaultOpen,
  onOpenChange,
  delayDuration,
  disableHoverableContent,
  side = "top",
  align = "center",
  alignOffset,
  sideOffset = 10,
  className,
  ...props
}: TooltipProps) {
  return (
    <TooltipPrimitive.Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      delayDuration={delayDuration}
      disableHoverableContent={disableHoverableContent}
    >
      <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>

      <TooltipPrimitive.TooltipPortal>
        <TooltipPrimitive.Content
          className={cx(
            className,
            "z-50 bg-neutral-800 text-neutral-200 border border-white/0 dark:border-white/5 rounded-md px-3 py-1.5 xl:px-3.5 text-xs font-medium shadow-xl"
          )}
          side={side}
          align={align}
          sideOffset={sideOffset}
          alignOffset={alignOffset}
          collisionPadding={10}
          {...props}
        >
          {content}
        </TooltipPrimitive.Content>
      </TooltipPrimitive.TooltipPortal>
    </TooltipPrimitive.Root>
  );
}
