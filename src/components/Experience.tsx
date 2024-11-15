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
    <li className="flex flex-col pl-0 text-base leading-relaxed xl:text-lg xl:leading-relaxed">
      <span className="flex justify-between items-baseline space-x-2">
        <span className="text-neutral-900 dark:text-neutral-100">{title}</span>
        <span className="flex grow border-t border-black border-opacity-10 dark:border-opacity-10 dark:border-white min-w-4" />
        {tooltip ? (
          <Tooltip content={tooltip} delayDuration={200}>
            <Company url={url}>{company}</Company>
          </Tooltip>
        ) : (
          <Company url={url}>{company}</Company>
        )}
      </span>
      <span className="self-start text-neutral-400 dark:text-neutral-500 text-sm xl:text-base">
        {when}
      </span>
    </li>
  );
}

function Company({ children, url }: { children: ReactNode; url?: string }) {
  return url ? (
    <Link
      className="shrink-0 underline-offset-4 decoration-2 underline decoration-neutral-200 hover:decoration-neutral-500 focus:decoration-neutral-500 dark:decoration-neutral-700 dark:hover:decoration-neutral-400 dark:focus:decoration-neutral-400 text-neutral-500 dark:text-neutral-400 focus:outline-none"
      href={url}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </Link>
  ) : (
    <span>{children}</span>
  );
}
