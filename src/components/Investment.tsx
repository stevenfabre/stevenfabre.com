import Link from "next/link";
import { Tooltip } from "./Tooltip";

export type InvestmentProps = {
  label: string;
  url: string;
  description?: string;
  stage?: string;
  currentStage?: string;
  tooltip?: string;
};

export default function Investment({
  url,
  label,
  description,
  stage,
  currentStage,
  tooltip,
}: InvestmentProps) {
  return (
    <li className="flex flex-col @lg/content:flex-row @lg/content:items-baseline @lg/content:justify-between @lg/content:space-x-2 pl-0 text-base leading-relaxed @xl/content:text-lg @xl/content:leading-relaxed">
      <span className="flex items-baseline justify-between gap-2 @lg/content:contents">
        <Link
          className="shrink-0 underline-offset-4 decoration-2 underline decoration-neutral-300 hover:decoration-neutral-900 focus:decoration-neutral-900 dark:decoration-neutral-700 dark:hover:decoration-neutral-100 dark:focus:decoration-neutral-100 text-neutral-900 dark:text-neutral-100 focus:outline-hidden"
          href={url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {label}
        </Link>
        <span className="@lg/content:hidden">
          <InvestmentStage
            stage={stage}
            currentStage={currentStage}
            tooltip={tooltip}
          />
        </span>
      </span>
      <span className="hidden @lg/content:flex grow border-t border-black/10 dark:border-white/10 min-w-4" />
      {description ? (
        <span className="@lg/content:min-w-0 @lg/content:truncate @lg/content:shrink">
          {description}
        </span>
      ) : null}
      <span className="hidden @lg/content:block shrink-0">
        <InvestmentStage
          stage={stage}
          currentStage={currentStage}
          tooltip={tooltip}
        />
      </span>
    </li>
  );
}

function InvestmentStage({
  stage,
  currentStage,
  tooltip,
}: {
  stage?: string;
  currentStage?: string;
  tooltip?: string;
}) {
  if (!stage) return null;

  const badge = (
    <StageBadge
      stage={stage}
      currentStage={currentStage}
      hasTooltip={Boolean(tooltip)}
    />
  );

  return tooltip ? (
    <Tooltip content={tooltip} delayDuration={200} sideOffset={4} side="left">
      {badge}
    </Tooltip>
  ) : (
    badge
  );
}

function StageBadge({
  stage,
  currentStage,
  hasTooltip,
}: {
  stage: string;
  currentStage?: string;
  hasTooltip: boolean;
}) {
  return (
    <span
      className="group inline-flex shrink-0"
      tabIndex={0}
    >
      <span
        className={`uppercase text-xs tracking-wider inline-flex font-medium text-neutral-500 border border-neutral-200 dark:border-neutral-800 px-1 py-0.5 rounded shrink-0 cursor-default ${
          hasTooltip
            ? "transition-colors group-hover:border-neutral-900 group-hover:bg-neutral-900 group-hover:text-neutral-50 group-focus:border-neutral-900 group-focus:bg-neutral-900 group-focus:text-neutral-50 dark:group-hover:border-neutral-100 dark:group-hover:bg-neutral-100 dark:group-hover:text-neutral-900 dark:group-focus:border-neutral-100 dark:group-focus:bg-neutral-100 dark:group-focus:text-neutral-900"
            : ""
        }`}
      >
        {stage}
        {currentStage ? ` > ${currentStage}` : null}
      </span>
    </span>
  );
}
