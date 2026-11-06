import { Tooltip } from "./Tooltip";
import CompanyLink from "./CompanyLink";
import { WorkPreviewLink } from "./WorkPreview";

export type ExperienceProps = {
  title: string;
  when: string;
  company: string;
  tooltip?: string;
  url?: string;
  preview?: boolean;
};

export default function Experience({
  url,
  company,
  tooltip,
  title,
  when,
  preview,
}: ExperienceProps) {
  const link = url ? (
    <CompanyLink href={url} target="_blank" rel="noopener noreferrer">
      {company}
    </CompanyLink>
  ) : (
    <span className="text-neutral-900 dark:text-neutral-100">{company}</span>
  );
  const companyLink =
    tooltip && url ? (
      <Tooltip content={tooltip} delayDuration={200} sideOffset={4} side="left">
        {link}
      </Tooltip>
    ) : (
      link
    );
  return (
    <li className="flex flex-col @lg/content:flex-row @lg/content:justify-between @lg/content:items-baseline @lg/content:space-x-2 pl-0 text-base leading-relaxed @xl/content:text-lg @xl/content:leading-relaxed">
      <span>
        {preview ? (
          <WorkPreviewLink company={company}>{companyLink}</WorkPreviewLink>
        ) : (
          companyLink
        )}
      </span>
      <span className="hidden @lg/content:flex grow border-t border-black/10 dark:border-white/10 min-w-4" />
      <span className="flex space-x-2 items-baseline justify-between @lg/content:justify-end">
        <span>{title}</span>
        <span className="self-start text-neutral-400 dark:text-neutral-500 w-24 xl:w-28 tabular-nums text-right">
          {when}
        </span>
      </span>
    </li>
  );
}
