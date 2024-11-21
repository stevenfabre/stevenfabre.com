import Link from "next/link";
import { Tooltip } from "./Tooltip";
import { ReactNode } from "react";

export type ExperienceProps = {
  title: string;
  when: string;
  company: string;
  tooltip?: string;
  url?: string;
};

export default function Experience({
  url,
  company,
  tooltip,
  title,
  when,
}: ExperienceProps) {
  return (
    <li className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline sm:space-x-2 pl-0 text-base leading-relaxed xl:text-lg xl:leading-relaxed">
      <span>
        {tooltip ? (
          <Tooltip
            content={tooltip}
            delayDuration={200}
            sideOffset={4}
            side="left"
          >
            <Company url={url}>{company}</Company>
          </Tooltip>
        ) : (
          <Company url={url}>{company}</Company>
        )}
      </span>
      <span className="hidden sm:flex grow border-t border-black border-opacity-10 dark:border-opacity-10 dark:border-white min-w-4" />
      <span className="flex space-x-2 items-baseline justify-between sm:justify-end">
        <span>{title}</span>
        <span className="self-start text-neutral-400 dark:text-neutral-500 w-24 xl:w-28 tabular-nums text-right">
          {when}
        </span>
      </span>
    </li>
  );
}

function Company({ children, url }: { children: ReactNode; url?: string }) {
  return url ? (
    <Link
      className="shrink-0 underline-offset-4 decoration-2 underline decoration-neutral-300 hover:decoration-neutral-900 focus:decoration-neutral-900 dark:decoration-neutral-700 dark:hover:decoration-neutral-100 dark:focus:decoration-neutral-100 text-neutral-900 dark:text-neutral-100 focus:outline-none"
      href={url}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </Link>
  ) : (
    <span className="text-neutral-900 dark:text-neutral-100">{children}</span>
  );
}
