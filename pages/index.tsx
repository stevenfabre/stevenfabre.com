import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import profilePic from "../public/steven-fabre.jpg";
import GameProvider from "../src/components/Game/GameProvider";
import ThemeSwitcher from "../src/components/Game/ThemeSwitcher";

export default function Home() {
  const router = useRouter();

  const meta = {
    title: "Steven Fabre",
    description: `Designer and founder passionate about collaborative creative tools.`,
    image: "https://stevenfabre.com/static/images/steven-fabre-banner.png",
    type: "website",
  };

  return (
    <>
      <Head>
        <title>{meta.title}</title>
        <meta name="robots" content="follow, index" />
        <meta content={meta.description} name="description" />
        <meta
          property="og:url"
          content={`https://stevenfabre.com${router.asPath}`}
        />
        <link
          rel="canonical"
          href={`https://stevenfabre.com${router.asPath}`}
        />
        <meta property="og:type" content={meta.type} />
        <meta property="og:site_name" content="Steven Fabre" />
        <meta property="og:description" content={meta.description} />
        <meta property="og:title" content={meta.title} />
        <meta property="og:image" content={meta.image} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@stevenfabre" />
        <meta name="twitter:title" content={meta.title} />
        <meta name="twitter:description" content={meta.description} />
        <meta name="twitter:image" content={meta.image} />
        <link rel="icon" type="image/png" href="/favicon.png" />
      </Head>

      <div className="md:grid md:grid-cols-4 md:min-h-screen select-none">
        <div className="h-[80vh] fixed w-full top-0 md:top-auto md:w-auto md:h-auto md:col-span-1 md:relative overflow-hidden">
          <Image
            className="object-cover"
            src={profilePic}
            alt="Picture of Steven Fabre"
            priority
            fill
            sizes="(max-width: 768px) 100vw,
              33vw"
          />
          <GameProvider />
          <div className="absolute md:hidden h-[8vh] w-full bottom-0 left-0 bg-gradient-to-t from-neutral-100 to-transparent pointer-events-none" />
        </div>
        <div className="relative mt-[70vh] bg-neutral-100 dark:bg-neutral-900 bg-opacity-95 dark:bg-opacity-95 backdrop-blur md:backdrop-filter-none md:mt-0 md:col-span-3 md:flex md:items-center md:justify-center">
          <div className="max-w-lg xl:max-w-3xl px-4 xl:px-8 mx-auto py-8 sm:py-16">
            <h1 className="text-3xl tracking-tight font-medium text-neutral-900 dark:text-neutral-100 xl:text-6xl xl:tracking-tight">
              I’m Steven, a designer & founder passionate about collaborative
              creative tools.
            </h1>
            <p className="text-lg leading-relaxed mt-6 xl:mt-8 xl:text-xl xl:leading-relaxed">
              I’m currently the co-founder and CEO of{" "}
              <a
                className="underline-offset-4 decoration-2 underline decoration-[#ff511a] text-neutral-900 dark:text-neutral-100 hover:text-[#ff511a] focus:text-[#ff511a] focus:outline-none"
                href="https://liveblocks.io"
                target="_blank"
                rel="noopener noreferrer"
              >
                Liveblocks
              </a>
              , a company building the collaboration engine of the internet.
              Before that, I was running{" "}
              <a
                className="underline-offset-4 decoration-2 underline decoration-teal-400 text-neutral-900 dark:text-neutral-100 hover:text-teal-400 focus:text-teal-400 focus:outline-none"
                href="https://thenextweb.com/news/invision-acquires-easee-animation-tool"
                target="_blank"
                rel="noopener noreferrer"
              >
                Easee
              </a>
              , a web animation tool for designers that was acquired in April
              2016 by{" "}
              <a
                className="underline-offset-4 decoration-2 underline decoration-[#FF0066] text-neutral-900 dark:text-neutral-100 hover:text-[#FF0066] focus:text-[#FF0066] focus:outline-none"
                href="https://invisionapp.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                InVision
              </a>
              . And that eventually led me to work on design systems and tooling
              at{" "}
              <a
                className="underline-offset-4 decoration-2 underline decoration-[#006AFF] text-neutral-900 dark:text-neutral-100 hover:text-[#006AFF] focus:text-[#006AFF] focus:outline-none"
                href="https://messenger.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Messenger
              </a>
              . I also run{" "}
              <a
                className="underline-offset-4 decoration-2 underline decoration-[#00ebcb] text-neutral-900 dark:text-neutral-100 hover:text-[#00ebcb] focus:text-[#00ebcb] focus:outline-none"
                href="https://gifmock.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Gifmock
              </a>
              , a tool used by thousands of people to create high-quality GIFs.
            </p>

            <div className="mt-12 flex justify-between items-center">
              <ul className="flex flex-wrap gap-6">
                <li>
                  <a
                    className="flex items-center gap-1 text-neutral-900 dark:text-neutral-100 hover:text-[#1DA1F2] focus:text-[#1DA1F2] rounded focus:underline focus:underline-offset-4 focus:decoration-2 focus:decoration-[#1DA1F2] hover:underline hover:underline-offset-4 hover:decoration-2 hover:decoration-[#1DA1F2] focus:outline-none"
                    href="https://twitter.com/stevenfabre"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg
                      className="fill-[#1DA1F2]"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M18.7167 5.00002C18.075 5.29169 17.3833 5.48336 16.6667 5.57502C17.4 5.13336 17.9667 4.43336 18.2333 3.59169C17.5417 4.00836 16.775 4.30003 15.9667 4.46669C15.3083 3.75003 14.3833 3.33336 13.3333 3.33336C11.375 3.33336 9.77501 4.93336 9.77501 6.90836C9.77501 7.19169 9.80834 7.46669 9.86667 7.72502C6.90001 7.57502 4.25834 6.15002 2.50001 3.99169C2.19167 4.51669 2.01667 5.13336 2.01667 5.78336C2.01667 7.02502 2.64167 8.12502 3.60834 8.75002C3.01667 8.75002 2.46667 8.58336 1.98334 8.33336V8.35836C1.98334 10.0917 3.21667 11.5417 4.85001 11.8667C4.32561 12.0102 3.77509 12.0302 3.24167 11.925C3.46801 12.6354 3.91129 13.257 4.50919 13.7025C5.10709 14.1479 5.82955 14.3948 6.57501 14.4084C5.31137 15.4087 3.745 15.9495 2.13334 15.9417C1.85001 15.9417 1.56667 15.925 1.28334 15.8917C2.86667 16.9084 4.75001 17.5 6.76667 17.5C13.3333 17.5 16.9417 12.05 16.9417 7.32502C16.9417 7.16669 16.9417 7.01669 16.9333 6.85836C17.6333 6.35836 18.2333 5.72502 18.7167 5.00002V5.00002Z" />
                    </svg>
                    Twitter
                  </a>
                </li>
                <li>
                  <a
                    className="flex items-center gap-1 text-neutral-900 dark:text-neutral-100 hover:text-[#0072b1] focus:text-[#0072b1] rounded focus:underline focus:underline-offset-4 focus:decoration-2 focus:decoration-[#0072b1] hover:underline hover:underline-offset-4 hover:decoration-2 hover:decoration-[#0072b1] focus:outline-none"
                    href="https://www.linkedin.com/in/steven-fabre-5510bb38"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg
                      className="fill-[#0072b1]"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M15.8333 2.5C16.2754 2.5 16.6993 2.67559 17.0118 2.98816C17.3244 3.30072 17.5 3.72464 17.5 4.16667V15.8333C17.5 16.2754 17.3244 16.6993 17.0118 17.0118C16.6993 17.3244 16.2754 17.5 15.8333 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V4.16667C2.5 3.72464 2.67559 3.30072 2.98816 2.98816C3.30072 2.67559 3.72464 2.5 4.16667 2.5H15.8333ZM15.4167 15.4167V11C15.4167 10.2795 15.1304 9.5885 14.621 9.07903C14.1115 8.56955 13.4205 8.28333 12.7 8.28333C11.9917 8.28333 11.1667 8.71667 10.7667 9.36667V8.44167H8.44167V15.4167H10.7667V11.3083C10.7667 10.6667 11.2833 10.1417 11.925 10.1417C12.2344 10.1417 12.5312 10.2646 12.75 10.4834C12.9688 10.7022 13.0917 10.9989 13.0917 11.3083V15.4167H15.4167ZM5.73333 7.13333C6.10464 7.13333 6.46073 6.98583 6.72328 6.72328C6.98583 6.46073 7.13333 6.10464 7.13333 5.73333C7.13333 4.95833 6.50833 4.325 5.73333 4.325C5.35982 4.325 5.0016 4.47338 4.73749 4.73749C4.47338 5.0016 4.325 5.35982 4.325 5.73333C4.325 6.50833 4.95833 7.13333 5.73333 7.13333V7.13333ZM6.89167 15.4167V8.44167H4.58333V15.4167H6.89167V15.4167Z" />
                    </svg>
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a
                    className="flex items-center gap-1 text-neutral-900 dark:text-neutral-100 hover:text-[#171515] dark:hover:text-white focus:text-[#171515] dark:focus:text-white rounded focus:underline focus:underline-offset-4 focus:decoration-2 focus:decoration-[#171515] dark:focus:decoration-white hover:underline hover:underline-offset-4 hover:decoration-2 hover:decoration-[#171515] dark:hover:decoration-white focus:outline-none"
                    href="https://github.com/stevenfabre"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg
                      className="fill-[#171515] dark:fill-white"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M10 1.66664C8.90569 1.66664 7.82206 1.88219 6.81101 2.30098C5.79997 2.71977 4.88131 3.3336 4.10749 4.10742C2.54468 5.67022 1.66671 7.78984 1.66671 9.99998C1.66671 13.6833 4.05838 16.8083 7.36671 17.9166C7.78338 17.9833 7.91671 17.725 7.91671 17.5V16.0916C5.60838 16.5916 5.11671 14.975 5.11671 14.975C4.73338 14.0083 4.19171 13.75 4.19171 13.75C3.43338 13.2333 4.25004 13.25 4.25004 13.25C5.08338 13.3083 5.52504 14.1083 5.52504 14.1083C6.25004 15.375 7.47504 15 7.95004 14.8C8.02504 14.2583 8.24171 13.8916 8.47504 13.6833C6.62504 13.475 4.68338 12.7583 4.68338 9.58331C4.68338 8.65831 5.00004 7.91664 5.54171 7.32498C5.45838 7.11664 5.16671 6.24998 5.62504 5.12498C5.62504 5.12498 6.32504 4.89998 7.91671 5.97498C8.57504 5.79164 9.29171 5.69998 10 5.69998C10.7084 5.69998 11.425 5.79164 12.0834 5.97498C13.675 4.89998 14.375 5.12498 14.375 5.12498C14.8334 6.24998 14.5417 7.11664 14.4584 7.32498C15 7.91664 15.3167 8.65831 15.3167 9.58331C15.3167 12.7666 13.3667 13.4666 11.5084 13.675C11.8084 13.9333 12.0834 14.4416 12.0834 15.2166V17.5C12.0834 17.725 12.2167 17.9916 12.6417 17.9166C15.95 16.8 18.3334 13.6833 18.3334 9.99998C18.3334 8.90563 18.1178 7.82199 17.699 6.81095C17.2803 5.7999 16.6664 4.88124 15.8926 4.10742C15.1188 3.3336 14.2001 2.71977 13.1891 2.30098C12.178 1.88219 11.0944 1.66664 10 1.66664V1.66664Z" />
                    </svg>
                    GitHub
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
