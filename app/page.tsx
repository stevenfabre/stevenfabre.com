import type { Metadata } from "next";
import ThemeSwitcher from "../src/components/ThemeSwitcher";
import Image from "next/image";
import GameProvider from "../src/components/Game/GameProvider";
import profilePic from "../public/steven-fabre.jpg";

export default async function Home() {
  return (
    <>
      <div className="md:grid md:grid-cols-4 md:min-h-screen">
        <div className="select-none h-[80vh] fixed w-full top-0 md:top-auto md:w-auto md:h-auto md:col-span-1 md:relative overflow-hidden">
          <div className="absolute top-0 -bottom-[20vh] inset-0 md:bottom-0">
            <Image
              className="object-cover"
              src={profilePic}
              alt="Picture of Steven Fabre"
              priority
              fill
              sizes="(max-width: 768px) 100vw,
              33vw"
            />
          </div>
          <GameProvider />
        </div>
        <div className="relative mt-[80vh] bg-neutral-100 dark:bg-neutral-900 bg-opacity-95 dark:bg-opacity-95 backdrop-blur md:backdrop-filter-none md:mt-0 md:col-span-3 md:flex md:items-center md:justify-center">
          <div className="max-w-lg xl:max-w-3xl px-4 xl:px-8 mx-auto py-8 sm:py-16">
            <h1 className="text-balance text-3xl tracking-tight font-medium text-neutral-900 sm:text-4xl sm:tracking-tight dark:text-neutral-100 xl:text-6xl xl:tracking-tighter">
              I’m Steven, a designer & founder who loves building tools for
              people.
            </h1>
            <p className="text-pretty text-lg leading-relaxed mt-6 xl:mt-8 xl:text-xl xl:leading-relaxed">
              I’m currently the co-founder and CEO of{" "}
              <a
                className="underline-offset-4 decoration-2 underline decoration-[#9f8dfc] text-neutral-900 dark:text-neutral-100 dark:hover:text-[#9f8dfc] hover:text-[#9f8dfc] dark:focus:text-[#9f8dfc] focus:text-[#9f8dfc] focus:outline-none"
                href="https://liveblocks.io"
                target="_blank"
                rel="noopener noreferrer"
              >
                Liveblocks
              </a>
              , a company building the collaboration engine of the internet.
              Before that, I was running{" "}
              <a
                className="underline-offset-4 decoration-2 underline decoration-teal-400 text-neutral-900 dark:text-neutral-100 dark:hover:text-teal-400 hover:text-teal-400 dark:focus:text-teal-400 focus:text-teal-400 focus:outline-none"
                href="https://thenextweb.com/news/invision-acquires-easee-animation-tool"
                target="_blank"
                rel="noopener noreferrer"
              >
                Easee
              </a>
              , a web animation tool for designers that was acquired in April
              2016 by{" "}
              <a
                className="underline-offset-4 decoration-2 underline decoration-[#FF0066] text-neutral-900 dark:text-neutral-100 dark:hover:text-[#FF0066] hover:text-[#FF0066] dark:focus:text-[#FF0066] focus:text-[#FF0066] focus:outline-none"
                href="https://invisionapp.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                InVision
              </a>
              . And that eventually led me to work on design systems and tooling
              at{" "}
              <a
                className="underline-offset-4 decoration-2 underline decoration-[#006AFF] text-neutral-900 dark:text-neutral-100 dark:hover:text-[#006AFF] hover:text-[#006AFF] dark:focus:text-[#006AFF] focus:text-[#006AFF] focus:outline-none"
                href="https://messenger.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Meta
              </a>
              . I also run{" "}
              <a
                className="underline-offset-4 decoration-2 underline decoration-[#00ebcb] text-neutral-900 dark:text-neutral-100 dark:hover:text-[#00ebcb] hover:text-[#00ebcb] dark:focus:text-[#00ebcb] focus:text-[#00ebcb] focus:outline-none"
                href="https://gifmock.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Gifmock
              </a>
              , a tool used by thousands of people to create high-quality GIFs.
            </p>

            <div className="mt-12 flex justify-between items-center">
              <ul className="flex flex-wrap gap-4">
                <li>
                  <a
                    className="flex items-center gap-1 text-neutral-900 dark:text-neutral-100 hover:text-black dark:hover:text-white focus:text-black dark:focus:text-white rounded focus:underline focus:underline-offset-4 focus:decoration-2 focus:decoration-black dark:focus:decoration-white hover:underline hover:underline-offset-4 hover:decoration-2 hover:decoration-black dark:hover:decoration-white focus:outline-none"
                    href="https://twitter.com/stevenfabre"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg
                      aria-hidden="true"
                      focusable="false"
                      className="fill-current"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M15.0902 2H17.8044L11.8746 8.77744L18.8506 18H13.3884L9.11027 12.4066L4.21509 18H1.4992L7.84176 10.7508L1.14966 2H6.75048L10.6176 7.11262L15.0902 2ZM14.1376 16.3754H15.6416L5.93325 3.53928H4.3193L14.1376 16.3754Z" />
                    </svg>
                    <span className="sr-only">X</span>
                  </a>
                </li>
                <li>
                  <a
                    className="flex items-center gap-1 text-neutral-900 dark:text-neutral-100 hover:text-black dark:hover:text-white focus:text-black dark:focus:text-white rounded focus:underline focus:underline-offset-4 focus:decoration-2 focus:decoration-black dark:focus:decoration-white hover:underline hover:underline-offset-4 hover:decoration-2 hover:decoration-black dark:hover:decoration-white focus:outline-none"
                    href="https://www.linkedin.com/in/steven-fabre-5510bb38"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg
                      aria-hidden="true"
                      focusable="false"
                      className="fill-current"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M15.8333 2.5C16.2754 2.5 16.6993 2.67559 17.0118 2.98816C17.3244 3.30072 17.5 3.72464 17.5 4.16667V15.8333C17.5 16.2754 17.3244 16.6993 17.0118 17.0118C16.6993 17.3244 16.2754 17.5 15.8333 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V4.16667C2.5 3.72464 2.67559 3.30072 2.98816 2.98816C3.30072 2.67559 3.72464 2.5 4.16667 2.5H15.8333ZM15.4167 15.4167V11C15.4167 10.2795 15.1304 9.5885 14.621 9.07903C14.1115 8.56955 13.4205 8.28333 12.7 8.28333C11.9917 8.28333 11.1667 8.71667 10.7667 9.36667V8.44167H8.44167V15.4167H10.7667V11.3083C10.7667 10.6667 11.2833 10.1417 11.925 10.1417C12.2344 10.1417 12.5312 10.2646 12.75 10.4834C12.9688 10.7022 13.0917 10.9989 13.0917 11.3083V15.4167H15.4167ZM5.73333 7.13333C6.10464 7.13333 6.46073 6.98583 6.72328 6.72328C6.98583 6.46073 7.13333 6.10464 7.13333 5.73333C7.13333 4.95833 6.50833 4.325 5.73333 4.325C5.35982 4.325 5.0016 4.47338 4.73749 4.73749C4.47338 5.0016 4.325 5.35982 4.325 5.73333C4.325 6.50833 4.95833 7.13333 5.73333 7.13333V7.13333ZM6.89167 15.4167V8.44167H4.58333V15.4167H6.89167V15.4167Z" />
                    </svg>
                    <span className="sr-only">LinkedIn</span>
                  </a>
                </li>
                <li>
                  <a
                    className="flex items-center gap-1 text-neutral-900 dark:text-neutral-100 hover:text-black dark:hover:text-white focus:text-black dark:focus:text-white rounded focus:underline focus:underline-offset-4 focus:decoration-2 focus:decoration-black dark:focus:decoration-white hover:underline hover:underline-offset-4 hover:decoration-2 hover:decoration-black dark:hover:decoration-white focus:outline-none"
                    href="https://github.com/stevenfabre"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg
                      aria-hidden="true"
                      focusable="false"
                      className="fill-current"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M10 1.66664C8.90569 1.66664 7.82206 1.88219 6.81101 2.30098C5.79997 2.71977 4.88131 3.3336 4.10749 4.10742C2.54468 5.67022 1.66671 7.78984 1.66671 9.99998C1.66671 13.6833 4.05838 16.8083 7.36671 17.9166C7.78338 17.9833 7.91671 17.725 7.91671 17.5V16.0916C5.60838 16.5916 5.11671 14.975 5.11671 14.975C4.73338 14.0083 4.19171 13.75 4.19171 13.75C3.43338 13.2333 4.25004 13.25 4.25004 13.25C5.08338 13.3083 5.52504 14.1083 5.52504 14.1083C6.25004 15.375 7.47504 15 7.95004 14.8C8.02504 14.2583 8.24171 13.8916 8.47504 13.6833C6.62504 13.475 4.68338 12.7583 4.68338 9.58331C4.68338 8.65831 5.00004 7.91664 5.54171 7.32498C5.45838 7.11664 5.16671 6.24998 5.62504 5.12498C5.62504 5.12498 6.32504 4.89998 7.91671 5.97498C8.57504 5.79164 9.29171 5.69998 10 5.69998C10.7084 5.69998 11.425 5.79164 12.0834 5.97498C13.675 4.89998 14.375 5.12498 14.375 5.12498C14.8334 6.24998 14.5417 7.11664 14.4584 7.32498C15 7.91664 15.3167 8.65831 15.3167 9.58331C15.3167 12.7666 13.3667 13.4666 11.5084 13.675C11.8084 13.9333 12.0834 14.4416 12.0834 15.2166V17.5C12.0834 17.725 12.2167 17.9916 12.6417 17.9166C15.95 16.8 18.3334 13.6833 18.3334 9.99998C18.3334 8.90563 18.1178 7.82199 17.699 6.81095C17.2803 5.7999 16.6664 4.88124 15.8926 4.10742C15.1188 3.3336 14.2001 2.71977 13.1891 2.30098C12.178 1.88219 11.0944 1.66664 10 1.66664V1.66664Z" />
                    </svg>
                    <span className="sr-only">GitHub</span>
                  </a>
                </li>
              </ul>
              <ThemeSwitcher />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
