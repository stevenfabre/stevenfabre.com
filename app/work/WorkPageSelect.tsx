"use client";

import * as Select from "@radix-ui/react-select";
import { Check, ChevronsUpDown } from "lucide-react";
import { useSiteNavigation } from "../../src/components/SiteNavigation";

const pages = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/work" },
];

export default function WorkPageSelect() {
  const navigate = useSiteNavigation();

  return (
    <Select.Root value="/work" onValueChange={(href) => navigate(href)}>
      <Select.Trigger
        aria-label="Page: Work"
        className="group inline-flex cursor-pointer items-center gap-2 rounded-sm text-left outline-offset-4 focus-visible:outline-2"
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
          position="popper"
          align="start"
          sideOffset={10}
          className="z-50 min-w-40 overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50 p-1 text-base font-normal tracking-normal text-neutral-900 shadow-lg dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100"
        >
          <Select.Viewport>
            {pages.map(({ label, href }) => (
              <Select.Item
                key={href}
                value={href}
                className="relative flex min-h-11 cursor-default select-none items-center rounded-lg py-2 pr-10 pl-3 outline-none data-[highlighted]:bg-neutral-200 dark:data-[highlighted]:bg-neutral-800"
              >
                <Select.ItemText>{label}</Select.ItemText>
                <Select.ItemIndicator className="absolute right-3">
                  <Check aria-hidden="true" size={16} />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
