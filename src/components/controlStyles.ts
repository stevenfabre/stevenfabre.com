// Shared Tailwind treatments for headings and floating surfaces.
export const headingControl =
  "px-2 -mx-2 rounded-md focus-visible:outline-none focus-visible:bg-neutral-200 dark:focus-visible:bg-neutral-800";

export const popoverSurface =
  "rounded-[14px] bg-white shadow-[0_8px_16px_#00000006,0_20px_48px_#0000001a] dark:bg-neutral-800 dark:shadow-[0_0_0_1px_#ffffff0d,0_20px_48px_#00000066]";

export const iconControl =
  "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 focus:text-neutral-900 dark:hover:text-neutral-100 dark:focus:text-neutral-100 focus-visible:outline-none size-10 sm:size-8 bg-neutral-200/0 hover:bg-neutral-200 focus:bg-neutral-200 rounded-md dark:bg-neutral-800/0 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800 flex items-center justify-center";

export const headingLink = `${headingControl} inline-flex items-center gap-[0.3em] no-underline`;
