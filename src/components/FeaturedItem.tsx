import Link from "next/link";
import { Tooltip } from "./Tooltip";
import { ReactNode } from "react";

export type FeaturedItemProps = {
  title: string;
  url: string;
  description: string;
  when: string;
  language: "fr" | "en";
  tooltip?: string;
};

export default function FeaturedItem({
  url,
  title,
  description,
  when,
  language,
  tooltip,
}: FeaturedItemProps) {
  return (
    <li className="group/featured flex flex-col @lg/content:flex-row @lg/content:justify-between @lg/content:items-baseline @lg/content:space-x-2 pl-0 text-base leading-relaxed @xl/content:text-lg @xl/content:leading-relaxed">
      <span className="text-neutral-900 dark:text-neutral-100 truncate">
        {tooltip ? (
          <Tooltip
            content={tooltip}
            delayDuration={200}
            sideOffset={4}
            side="left"
          >
            <Title url={url} language={language}>
              {title}
            </Title>
          </Tooltip>
        ) : (
          <Title url={url} language={language}>
            {title}
          </Title>
        )}
      </span>
      <span className="hidden @lg/content:flex grow border-t border-black/10 dark:border-white/10 min-w-8" />
      <span className="flex space-x-2 items-baseline justify-between @lg/content:justify-end shrink-0">
        <span>{description}</span>
        <span className="self-start text-neutral-400 dark:text-neutral-500 w-24 xl:w-28 tabular-nums text-right">
          {when}
        </span>
      </span>
    </li>
  );
}

function Title({
  children,
  url,
  language,
}: {
  children: ReactNode;
  url: string;
  language: "fr" | "en";
}) {
  return (
    <Link
      className="group inline-flex justify-between min-w-0 flex-row-reverse @lg/content:flex-row gap-2 items-baseline w-full text-neutral-900 dark:text-neutral-100 focus:outline-hidden"
      href={url}
      target="_blank"
      rel="noopener noreferrer"
    >
      <span className="self-center uppercase text-xs tracking-wider inline-flex font-medium text-neutral-500 border border-neutral-200 dark:border-neutral-800 px-1 py-0.5 rounded shrink-0 group-hover/featured:border-neutral-900 group-hover/featured:bg-neutral-900 group-hover/featured:text-neutral-50 group-focus-within/featured:border-neutral-900 group-focus-within/featured:bg-neutral-900 group-focus-within/featured:text-neutral-50 dark:group-hover/featured:border-neutral-100 dark:group-hover/featured:bg-neutral-100 dark:group-hover/featured:text-neutral-900 dark:group-focus-within/featured:border-neutral-100 dark:group-focus-within/featured:bg-neutral-100 dark:group-focus-within/featured:text-neutral-900">
        {language}
      </span>
      <span className="min-w-0 truncate underline-offset-4 decoration-2 underline decoration-neutral-300 group-hover:decoration-neutral-900 group-focus:decoration-neutral-900 dark:decoration-neutral-700 dark:group-hover:decoration-neutral-100 dark:group-focus:decoration-neutral-100">
        {children}
      </span>
    </Link>
  );
}
