import BrandIcon from "./BrandIcon";
import Icon from "./Icon";
import Link from "next/link";
import EmailLink from "./EmailLink";
import ThemeSwitcher from "./ThemeSwitcher";
import { Tooltip } from "./Tooltip";
import cx from "../utils/cx";

export default function Footer({
  className,
  includedSocials = [
    "x",
    "linkedin",
    "instagram",
    "youtube",
    "github",
    "email",
  ],
}: {
  className?: string;
  includedSocials?: (
    | "x"
    | "linkedin"
    | "instagram"
    | "youtube"
    | "github"
    | "email"
  )[];
}) {
  return (
    <footer
      data-site-footer
      className={cx(
        "sticky bottom-0 z-20 flex flex-row-reverse justify-between items-center py-4 mt-12 xl:mt-16 border-t border-black/10 dark:border-white/10 bg-neutral-50/95 dark:bg-neutral-950/95 backdrop-blur",
        className
      )}
    >
      <ul className="flex flex-wrap sm:gap-0.5">
        {includedSocials.includes("x") && (
          <li>
            <Tooltip content="X" delayDuration={200}>
              <Link
                className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 focus:text-neutral-900 dark:hover:text-neutral-100 dark:focus:text-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:focus-visible:outline-neutral-100 size-10 sm:size-8 bg-neutral-200/0 hover:bg-neutral-200 focus:bg-neutral-200 rounded-md dark:bg-neutral-800/0 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800 flex items-center justify-center"
                href="https://x.com/stevenfabre"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  aria-hidden="true"
                  focusable="false"
                  className="fill-current size-6 sm:size-5"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M14.4538 3H16.8288L11.6402 8.93026L17.7442 17H12.9648L9.22139 12.1058L4.93811 17H2.56171L8.11145 10.657L2.25586 3H7.15658L10.5403 7.47354L14.4538 3ZM13.6203 15.5785H14.9363L6.4415 4.34687H5.02929L13.6203 15.5785Z" />
                </svg>
                <span className="sr-only">X</span>
              </Link>
            </Tooltip>
          </li>
        )}
        {includedSocials.includes("linkedin") && (
          <li>
            <Tooltip content="LinkedIn" delayDuration={200}>
              <Link
                className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 focus:text-neutral-900 dark:hover:text-neutral-100 dark:focus:text-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:focus-visible:outline-neutral-100 size-10 sm:size-8 bg-neutral-200/0 hover:bg-neutral-200 focus:bg-neutral-200 rounded-md dark:bg-neutral-800/0 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800 flex items-center justify-center"
                href="https://www.linkedin.com/in/steven-fabre-5510bb38"
                target="_blank"
                rel="noopener noreferrer"
              >
                <BrandIcon name="linkedin" className="size-6 sm:size-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </Tooltip>
          </li>
        )}
        {includedSocials.includes("instagram") && (
          <li>
            <Tooltip content="Instagram" delayDuration={200}>
              <Link
                className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 focus:text-neutral-900 dark:hover:text-neutral-100 dark:focus:text-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:focus-visible:outline-neutral-100 size-10 sm:size-8 bg-neutral-200/0 hover:bg-neutral-200 focus:bg-neutral-200 rounded-md dark:bg-neutral-800/0 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800 flex items-center justify-center"
                href="https://www.instagram.com/stevenfabre"
                target="_blank"
                rel="noopener noreferrer"
              >
                <BrandIcon name="instagram" className="size-6 sm:size-5" />
                <span className="sr-only">Instagram</span>
              </Link>
            </Tooltip>
          </li>
        )}
        {includedSocials.includes("youtube") && (
          <li>
            <Tooltip content="YouTube" delayDuration={200}>
              <Link
                className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 focus:text-neutral-900 dark:hover:text-neutral-100 dark:focus:text-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:focus-visible:outline-neutral-100 size-10 sm:size-8 bg-neutral-200/0 hover:bg-neutral-200 focus:bg-neutral-200 rounded-md dark:bg-neutral-800/0 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800 flex items-center justify-center"
                href="https://www.youtube.com/@StevenFabre"
                target="_blank"
                rel="noopener noreferrer"
              >
                <BrandIcon name="youtube" className="size-6 sm:size-5" />
                <span className="sr-only">YouTube</span>
              </Link>
            </Tooltip>
          </li>
        )}
        {includedSocials.includes("github") && (
          <li>
            <Tooltip content="GitHub" delayDuration={200}>
              <Link
                className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 focus:text-neutral-900 dark:hover:text-neutral-100 dark:focus:text-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:focus-visible:outline-neutral-100 size-10 sm:size-8 bg-neutral-200/0 hover:bg-neutral-200 focus:bg-neutral-200 rounded-md dark:bg-neutral-800/0 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800 flex items-center justify-center"
                href="https://github.com/stevenfabre"
                target="_blank"
                rel="noopener noreferrer"
              >
                <BrandIcon name="github" className="size-6 sm:size-5" />
                <span className="sr-only">GitHub</span>
              </Link>
            </Tooltip>
          </li>
        )}
        {includedSocials.includes("email") && (
          <li>
            <EmailLink
              className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 focus:text-neutral-900 dark:hover:text-neutral-100 dark:focus:text-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:focus-visible:outline-neutral-100 size-10 sm:size-8 bg-neutral-200/0 hover:bg-neutral-200 focus:bg-neutral-200 rounded-md dark:bg-neutral-800/0 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800 flex items-center justify-center"
              email="hello@stevenfabre.com"
            >
              <Icon name="envelope" className="size-6 sm:size-5" />
              <span className="sr-only">hello@stevenfabre.com</span>
            </EmailLink>
          </li>
        )}
      </ul>
      <ThemeSwitcher />
    </footer>
  );
}
