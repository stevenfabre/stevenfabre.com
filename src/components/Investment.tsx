import Link from "next/link";

export default function Investment({
  url,
  label,
  description,
}: {
  url: string;
  label: string;
  description: string;
}) {
  return (
    <li className="flex items-baseline justify-between space-x-2 pl-0 text-base leading-relaxed xl:text-lg xl:leading-relaxed">
      <Link
        className="shrink-0 underline-offset-4 decoration-2 underline decoration-neutral-300 hover:decoration-neutral-900 focus:decoration-neutral-900 dark:decoration-neutral-700 dark:hover:decoration-neutral-100 dark:focus:decoration-neutral-100 text-neutral-900 dark:text-neutral-100 dark:hover:text-neutral-50 hover:text-neutral-950 dark:focus:text-neutral-50 focus:text-neutral-950 focus:outline-none"
        href={url}
        target="_blank"
        rel="noopener noreferrer"
      >
        {label}
      </Link>
      <span className="grow border-t border-black border-opacity-5 dark:border-opacity-5 dark:border-white min-w-4" />
      <span>{description}</span>
    </li>
  );
}
