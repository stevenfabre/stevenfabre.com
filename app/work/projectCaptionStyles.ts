// Loading and loaded captions share geometry and typography so their text aligns.
export const projectCaptionStyles = {
  layout:
    "mx-auto mt-14 w-full max-w-lg md:max-w-2xl xl:max-w-4xl leading-relaxed md:grid md:grid-cols-4 md:items-start md:gap-x-8",
  body: "@container text-lg text-neutral-500 dark:text-neutral-400 text-pretty md:col-span-3 md:col-start-2 md:row-start-1",
  title:
    "mb-4 text-lg font-semibold leading-relaxed text-neutral-900 dark:text-neutral-100 xl:text-xl",
  credits:
    "text-sm leading-relaxed text-neutral-500 dark:text-neutral-400 md:col-start-1 md:row-start-1 md:pt-1 xl:pt-1.5",
} as const;
