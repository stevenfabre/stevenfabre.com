"use client";

import { useRef, useState, type CSSProperties } from "react";
import * as Select from "@radix-ui/react-select";
import { Check, ChevronsUpDown } from "lucide-react";
import { useSiteNavigation } from "../../src/components/SiteNavigation";

const pages = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/work" },
];

export default function WorkPageSelect() {
  const navigate = useSiteNavigation();
  const trigger = useRef<HTMLButtonElement>(null);
  const [typography, setTypography] = useState<CSSProperties>();

  function syncTypography(open: boolean) {
    if (!open || !trigger.current) return;
    // The portal sits outside the heading's responsive container. Copy its
    // resolved typography rather than duplicating container-query breakpoints.
    const style = getComputedStyle(trigger.current);
    setTypography({
      fontFamily: style.fontFamily,
      fontSize: style.fontSize,
      fontWeight: style.fontWeight,
      lineHeight: style.lineHeight,
      letterSpacing: style.letterSpacing,
    });
  }

  return (
    <Select.Root
      value="/work"
      onValueChange={(href) => navigate(href)}
      onOpenChange={syncTypography}
    >
      <Select.Trigger
        ref={trigger}
        aria-label="Page: Work"
        className="group inline-flex cursor-pointer items-center gap-2 rounded-sm text-left outline-offset-2 focus-visible:outline-2 focus-visible:outline-neutral-500"
      >
        <Select.Value>Work</Select.Value>
        <Select.Icon asChild>
          <ChevronsUpDown
            aria-hidden="true"
            className="size-[0.55em] text-neutral-400 transition-colors duration-150 group-hover:text-neutral-900 dark:text-neutral-500 dark:group-hover:text-neutral-100"
          />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content
          position="item-aligned"
          style={typography}
          className="z-50 overflow-hidden rounded-xl bg-neutral-50 ring-1 ring-inset ring-neutral-200 text-neutral-900 shadow-lg dark:ring-neutral-800 dark:bg-neutral-950 dark:text-neutral-100"
        >
          <Select.Viewport className="p-1">
            {pages.map(({ label, href }) => (
              <Select.Item
                key={href}
                value={href}
                className="relative flex cursor-default select-none items-center rounded-lg py-1 pl-3 pr-[calc(0.55em+20px)] outline-none data-[highlighted]:bg-neutral-200 dark:data-[highlighted]:bg-neutral-800"
              >
                <Select.ItemText>{label}</Select.ItemText>
                <Select.ItemIndicator className="absolute right-3 flex items-center">
                  <Check aria-hidden="true" className="size-[0.55em]" />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
