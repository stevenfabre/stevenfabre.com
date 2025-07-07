import Link from "next/link";
import EmailLink from "./EmailLink";
import ThemeSwitcher from "./ThemeSwitcher";
import { Tooltip } from "./Tooltip";

export default function Footer({
  includedSocials = [
    "x",
    "linkedin",
    "instagram",
    "youtube",
    "github",
    "email",
  ],
}: {
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
    <footer className="sticky bottom-0 flex flex-row-reverse justify-between items-center py-4 mt-12 xl:mt-16 border-t border-black border-opacity-10 dark:border-opacity-10 dark:border-white bg-neutral-50 dark:bg-neutral-950 bg-opacity-95 dark:bg-opacity-95 backdrop-blur">
      <ul className="flex flex-wrap sm:gap-0.5">
        {includedSocials.includes("x") && (
          <li>
            <Tooltip content="X" delayDuration={200}>
              <Link
                className="size-10 sm:size-8 bg-neutral-200 bg-opacity-0 hover:bg-opacity-100 focus:bg-opacity-100 rounded-md dark:bg-neutral-800 dark:bg-opacity-0 dark:hover:bg-opacity-100 dark:focus:bg-opacity-100 flex items-center justify-center"
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
                className="size-10 sm:size-8 bg-neutral-200 bg-opacity-0 hover:bg-opacity-100 focus:bg-opacity-100 rounded-md dark:bg-neutral-800 dark:bg-opacity-0 dark:hover:bg-opacity-100 dark:focus:bg-opacity-100 flex items-center justify-center"
                href="https://www.linkedin.com/in/steven-fabre-5510bb38"
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
                  <path d="M15.8333 2.5C16.2754 2.5 16.6993 2.67559 17.0118 2.98816C17.3244 3.30072 17.5 3.72464 17.5 4.16667V15.8333C17.5 16.2754 17.3244 16.6993 17.0118 17.0118C16.6993 17.3244 16.2754 17.5 15.8333 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V4.16667C2.5 3.72464 2.67559 3.30072 2.98816 2.98816C3.30072 2.67559 3.72464 2.5 4.16667 2.5H15.8333ZM15.4167 15.4167V11C15.4167 10.2795 15.1304 9.5885 14.621 9.07903C14.1115 8.56955 13.4205 8.28333 12.7 8.28333C11.9917 8.28333 11.1667 8.71667 10.7667 9.36667V8.44167H8.44167V15.4167H10.7667V11.3083C10.7667 10.6667 11.2833 10.1417 11.925 10.1417C12.2344 10.1417 12.5312 10.2646 12.75 10.4834C12.9688 10.7022 13.0917 10.9989 13.0917 11.3083V15.4167H15.4167ZM5.73333 7.13333C6.10464 7.13333 6.46073 6.98583 6.72328 6.72328C6.98583 6.46073 7.13333 6.10464 7.13333 5.73333C7.13333 4.95833 6.50833 4.325 5.73333 4.325C5.35982 4.325 5.0016 4.47338 4.73749 4.73749C4.47338 5.0016 4.325 5.35982 4.325 5.73333C4.325 6.50833 4.95833 7.13333 5.73333 7.13333V7.13333ZM6.89167 15.4167V8.44167H4.58333V15.4167H6.89167V15.4167Z" />
                </svg>
                <span className="sr-only">LinkedIn</span>
              </Link>
            </Tooltip>
          </li>
        )}
        {includedSocials.includes("instagram") && (
          <li>
            <Tooltip content="Instagram" delayDuration={200}>
              <Link
                className="size-10 sm:size-8 bg-neutral-200 bg-opacity-0 hover:bg-opacity-100 focus:bg-opacity-100 rounded-md dark:bg-neutral-800 dark:bg-opacity-0 dark:hover:bg-opacity-100 dark:focus:bg-opacity-100 flex items-center justify-center"
                href="https://www.instagram.com/stevenfabre"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="fill-current size-6 sm:size-5"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                >
                  <path d="M7.8 2H16.2C19.4 2 22 4.6 22 7.8V16.2C22 17.7383 21.3889 19.2135 20.3012 20.3012C19.2135 21.3889 17.7383 22 16.2 22H7.8C4.6 22 2 19.4 2 16.2V7.8C2 6.26174 2.61107 4.78649 3.69878 3.69878C4.78649 2.61107 6.26174 2 7.8 2ZM7.6 4C6.64522 4 5.72955 4.37928 5.05442 5.05442C4.37928 5.72955 4 6.64522 4 7.6V16.4C4 18.39 5.61 20 7.6 20H16.4C17.3548 20 18.2705 19.6207 18.9456 18.9456C19.6207 18.2705 20 17.3548 20 16.4V7.6C20 5.61 18.39 4 16.4 4H7.6ZM17.25 5.5C17.5815 5.5 17.8995 5.6317 18.1339 5.86612C18.3683 6.10054 18.5 6.41848 18.5 6.75C18.5 7.08152 18.3683 7.39946 18.1339 7.63388C17.8995 7.8683 17.5815 8 17.25 8C16.9185 8 16.6005 7.8683 16.3661 7.63388C16.1317 7.39946 16 7.08152 16 6.75C16 6.41848 16.1317 6.10054 16.3661 5.86612C16.6005 5.6317 16.9185 5.5 17.25 5.5ZM12 7C13.3261 7 14.5979 7.52678 15.5355 8.46447C16.4732 9.40215 17 10.6739 17 12C17 13.3261 16.4732 14.5979 15.5355 15.5355C14.5979 16.4732 13.3261 17 12 17C10.6739 17 9.40215 16.4732 8.46447 15.5355C7.52678 14.5979 7 13.3261 7 12C7 10.6739 7.52678 9.40215 8.46447 8.46447C9.40215 7.52678 10.6739 7 12 7ZM12 9C11.2044 9 10.4413 9.31607 9.87868 9.87868C9.31607 10.4413 9 11.2044 9 12C9 12.7956 9.31607 13.5587 9.87868 14.1213C10.4413 14.6839 11.2044 15 12 15C12.7956 15 13.5587 14.6839 14.1213 14.1213C14.6839 13.5587 15 12.7956 15 12C15 11.2044 14.6839 10.4413 14.1213 9.87868C13.5587 9.31607 12.7956 9 12 9Z" />
                </svg>
                <span className="sr-only">Instagram</span>
              </Link>
            </Tooltip>
          </li>
        )}
        {includedSocials.includes("youtube") && (
          <li>
            <Tooltip content="YouTube" delayDuration={200}>
              <Link
                className="size-10 sm:size-8 bg-neutral-200 bg-opacity-0 hover:bg-opacity-100 focus:bg-opacity-100 rounded-md dark:bg-neutral-800 dark:bg-opacity-0 dark:hover:bg-opacity-100 dark:focus:bg-opacity-100 flex items-center justify-center"
                href="https://www.youtube.com/@StevenFabre"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="fill-current size-6 sm:size-5"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path d="M18.3848 5.7832C18.2851 5.41218 18.0898 5.07384 17.8184 4.80202C17.5469 4.53021 17.2088 4.33446 16.8379 4.23438C15.4727 3.86719 10 3.86719 10 3.86719C10 3.86719 4.52734 3.86719 3.16211 4.23242C2.79106 4.33219 2.45278 4.52782 2.18126 4.79969C1.90974 5.07155 1.71453 5.41007 1.61523 5.78125C1.25 7.14844 1.25 10 1.25 10C1.25 10 1.25 12.8516 1.61523 14.2168C1.81641 14.9707 2.41016 15.5645 3.16211 15.7656C4.52734 16.1328 10 16.1328 10 16.1328C10 16.1328 15.4727 16.1328 16.8379 15.7656C17.5918 15.5645 18.1836 14.9707 18.3848 14.2168C18.75 12.8516 18.75 10 18.75 10C18.75 10 18.75 7.14844 18.3848 5.7832ZM8.26172 12.6172V7.38281L12.793 9.98047L8.26172 12.6172Z" />
                </svg>
                <span className="sr-only">YouTube</span>
              </Link>
            </Tooltip>
          </li>
        )}
        {includedSocials.includes("github") && (
          <li>
            <Tooltip content="GitHub" delayDuration={200}>
              <Link
                className="size-10 sm:size-8 bg-neutral-200 bg-opacity-0 hover:bg-opacity-100 focus:bg-opacity-100 rounded-md dark:bg-neutral-800 dark:bg-opacity-0 dark:hover:bg-opacity-100 dark:focus:bg-opacity-100 flex items-center justify-center"
                href="https://github.com/stevenfabre"
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
                  <path d="M10 1.66664C8.90569 1.66664 7.82206 1.88219 6.81101 2.30098C5.79997 2.71977 4.88131 3.3336 4.10749 4.10742C2.54468 5.67022 1.66671 7.78984 1.66671 9.99998C1.66671 13.6833 4.05838 16.8083 7.36671 17.9166C7.78338 17.9833 7.91671 17.725 7.91671 17.5V16.0916C5.60838 16.5916 5.11671 14.975 5.11671 14.975C4.73338 14.0083 4.19171 13.75 4.19171 13.75C3.43338 13.2333 4.25004 13.25 4.25004 13.25C5.08338 13.3083 5.52504 14.1083 5.52504 14.1083C6.25004 15.375 7.47504 15 7.95004 14.8C8.02504 14.2583 8.24171 13.8916 8.47504 13.6833C6.62504 13.475 4.68338 12.7583 4.68338 9.58331C4.68338 8.65831 5.00004 7.91664 5.54171 7.32498C5.45838 7.11664 5.16671 6.24998 5.62504 5.12498C5.62504 5.12498 6.32504 4.89998 7.91671 5.97498C8.57504 5.79164 9.29171 5.69998 10 5.69998C10.7084 5.69998 11.425 5.79164 12.0834 5.97498C13.675 4.89998 14.375 5.12498 14.375 5.12498C14.8334 6.24998 14.5417 7.11664 14.4584 7.32498C15 7.91664 15.3167 8.65831 15.3167 9.58331C15.3167 12.7666 13.3667 13.4666 11.5084 13.675C11.8084 13.9333 12.0834 14.4416 12.0834 15.2166V17.5C12.0834 17.725 12.2167 17.9916 12.6417 17.9166C15.95 16.8 18.3334 13.6833 18.3334 9.99998C18.3334 8.90563 18.1178 7.82199 17.699 6.81095C17.2803 5.7999 16.6664 4.88124 15.8926 4.10742C15.1188 3.3336 14.2001 2.71977 13.1891 2.30098C12.178 1.88219 11.0944 1.66664 10 1.66664V1.66664Z" />
                </svg>
                <span className="sr-only">GitHub</span>
              </Link>
            </Tooltip>
          </li>
        )}
        {includedSocials.includes("email") && (
          <li>
            <EmailLink
              className="size-10 sm:size-8 bg-neutral-200 bg-opacity-0 hover:bg-opacity-100 focus:bg-opacity-100 rounded-md dark:bg-neutral-800 dark:bg-opacity-0 dark:hover:bg-opacity-100 dark:focus:bg-opacity-100 flex items-center justify-center"
              email="hello@stevenfabre.com"
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
                <path d="M16.666 3.33594H3.33268C2.41602 3.33594 1.67435 4.08594 1.67435 5.0026L1.66602 15.0026C1.66602 15.9193 2.41602 16.6693 3.33268 16.6693H16.666C17.5827 16.6693 18.3327 15.9193 18.3327 15.0026V5.0026C18.3327 4.08594 17.5827 3.33594 16.666 3.33594ZM16.3327 6.8776L10.441 10.5609C10.1743 10.7276 9.82435 10.7276 9.55768 10.5609L3.66602 6.8776C3.58246 6.8307 3.50928 6.76732 3.45092 6.69132C3.39256 6.61531 3.35023 6.52825 3.3265 6.43541C3.30276 6.34257 3.2981 6.24588 3.31281 6.15119C3.32752 6.0565 3.3613 5.96578 3.41208 5.88452C3.46287 5.80326 3.52962 5.73315 3.60829 5.67843C3.68696 5.62372 3.77591 5.58553 3.86976 5.56619C3.96362 5.54684 4.06042 5.54674 4.15431 5.56589C4.2482 5.58505 4.33724 5.62305 4.41602 5.6776L9.99935 9.16927L15.5827 5.6776C15.6615 5.62305 15.7505 5.58505 15.8444 5.56589C15.9383 5.54674 16.0351 5.54684 16.1289 5.56619C16.2228 5.58553 16.3117 5.62372 16.3904 5.67843C16.4691 5.73315 16.5358 5.80326 16.5866 5.88452C16.6374 5.96578 16.6712 6.0565 16.6859 6.15119C16.7006 6.24588 16.6959 6.34257 16.6722 6.43541C16.6485 6.52825 16.6061 6.61531 16.5478 6.69132C16.4894 6.76732 16.4162 6.8307 16.3327 6.8776Z" />
              </svg>
              <span className="sr-only">hello@stevenfabre.com</span>
            </EmailLink>
          </li>
        )}
      </ul>
      <ThemeSwitcher />
    </footer>
  );
}
