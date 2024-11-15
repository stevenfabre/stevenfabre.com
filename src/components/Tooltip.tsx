import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import cx from "../utils/cx";
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
  side = "top",
  align = "center",
  alignOffset,
  sideOffset,
  className,
  ...props
}: TooltipProps) {
  return (
    <TooltipPrimitive.Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      delayDuration={delayDuration}
    >
      <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>

      <TooltipPrimitive.TooltipPortal>
        <TooltipPrimitive.Content
          className={cx(
            className,
            "bg-neutral-800 text-neutral-200 border border-opacity-0 dark:border-opacity-5 border-white rounded-md px-3.5 py-1.5 text-xs xl:text-sm font-medium shadow-xl"
          )}
          side={side}
          align={align}
          sideOffset={sideOffset}
          alignOffset={alignOffset}
          collisionPadding={10}
          {...props}
        >
          {content}
          <TooltipPrimitive.Arrow asChild>
            <svg
              className="relative -top-px"
              width="18"
              height="9"
              viewBox="0 0 18 9"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M16.5898 0H1.41016L9 7.58984L16.5898 0Z"
                className="fill-neutral-800"
              />
              <path
                d="M1 1L9 9L17 1H15.5898L9 7.58984L2.41016 1H1Z"
                className="fill-neutral-800"
              />
              <path
                d="M1 1L9 9L17 1H15.5898L9 7.58984L2.41016 1H1Z"
                className="fill-white opacity-0 dark:opacity-5"
              />
            </svg>
          </TooltipPrimitive.Arrow>
        </TooltipPrimitive.Content>
      </TooltipPrimitive.TooltipPortal>
    </TooltipPrimitive.Root>
  );
}
