import ThemeSwitcher from "../src/components/ThemeSwitcher";
import Image from "next/image";
import Link from "next/link";
import GameProvider from "../src/components/Game/GameProvider";
import profilePic from "../public/steven-fabre.jpg";
import Investment from "../src/components/Investment";
import EmailLink from "../src/components/EmailLink";
import Footer from "../src/components/Footer";

type Investment = {
  label: string;
  url: string;
  description: string;
};

const INVESTMENTS: Investment[] = [
  {
    label: "Klaro",
    url: "https://www.klaroapp.com/",
    description: "a user-friendly spreadsheet platform.",
  },
  {
    label: "Sequence",
    url: "https://sequence.film/",
    description: "a browser-based professional video editor.",
  },
  {
    label: "Storytell.ai",
    url: "https://storytell.ai/",
    description: "an AI platform to extract signal from noise.",
  },
  {
    label: "Guild",
    url: "https://guild.host/",
    description: "a community management platform.",
  },
  {
    label: "Cursor Capital",
    url: "https://www.cursorcapital.vc/",
    description: "a venture firm investing in creative tools.",
  },
  {
    label: "Boldstart",
    url: "https://boldstart.vc/",
    description: "a venture firm investing in technical founders.",
  },
];

export default async function Home() {
  return (
    <>
      <div className="md:grid md:grid-cols-4 md:h-screen">
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
        <div className="relative mt-[80vh] bg-neutral-50 dark:bg-neutral-950 bg-opacity-95 dark:bg-opacity-95 backdrop-blur md:backdrop-filter-none md:mt-0 md:col-span-3 md:flex md:justify-center md:overflow-y-scroll">
          <div className="max-w-lg xl:max-w-3xl px-4 xl:px-8 mx-auto pt-10 sm:pt-16 lg:pt-32 xl:pt-44">
            <h1 className="text-balance text-3xl tracking-tight font-semibold text-neutral-900 sm:text-4xl sm:tracking-tight dark:text-neutral-100 xl:text-6xl xl:tracking-tighter">
              I’m Steven, a designer & founder who loves building tools for
              people.
            </h1>
            <p className="text-pretty text-lg leading-relaxed mt-8 xl:mt-10 xl:text-xl xl:leading-relaxed">
              I’m the co-founder and CEO of{" "}
              <Link
                className="underline-offset-4 decoration-2 underline decoration-[#9f8dfc] text-neutral-900 dark:text-neutral-100 dark:hover:text-[#9f8dfc] hover:text-[#9f8dfc] dark:focus:text-[#9f8dfc] focus:text-[#9f8dfc] focus:outline-none"
                href="https://liveblocks.io"
                target="_blank"
                rel="noopener noreferrer"
              >
                Liveblocks
              </Link>
              , a company building the collaboration engine of the internet.
              Before that, I created{" "}
              <Link
                className="underline-offset-4 decoration-2 underline decoration-teal-400 text-neutral-900 dark:text-neutral-100 dark:hover:text-teal-400 hover:text-teal-400 dark:focus:text-teal-400 focus:text-teal-400 focus:outline-none"
                href="https://thenextweb.com/news/invision-acquires-easee-animation-tool"
                target="_blank"
                rel="noopener noreferrer"
              >
                Easee
              </Link>
              , a web animation tool acquired by{" "}
              <Link
                className="underline-offset-4 decoration-2 underline decoration-[#FF0066] text-neutral-900 dark:text-neutral-100 dark:hover:text-[#FF0066] hover:text-[#FF0066] dark:focus:text-[#FF0066] focus:text-[#FF0066] focus:outline-none"
                href="https://invisionapp.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                InVision
              </Link>{" "}
              in April 2016. I also worked on design systems at{" "}
              <Link
                className="underline-offset-4 decoration-2 underline decoration-[#006AFF] text-neutral-900 dark:text-neutral-100 dark:hover:text-[#006AFF] hover:text-[#006AFF] dark:focus:text-[#006AFF] focus:text-[#006AFF] focus:outline-none"
                href="https://messenger.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Meta
              </Link>{" "}
              and run{" "}
              <Link
                className="underline-offset-4 decoration-2 underline decoration-[#00ebcb] text-neutral-900 dark:text-neutral-100 dark:hover:text-[#00ebcb] hover:text-[#00ebcb] dark:focus:text-[#00ebcb] focus:text-[#00ebcb] focus:outline-none"
                href="https://gifmock.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Gifmock
              </Link>
              , a tool to create high‑quality GIFs.
            </p>

            <p className="text-pretty text-lg leading-relaxed mt-6 xl:mt-8 xl:text-xl xl:leading-relaxed">
              I grew up in Rodez, a small town in the south of France, where the
              values of hard work, resilience, and humility are deeply rooted.
              These principles remain close to my heart today. After spending
              over a decade abroad in Sydney and New York City, I now call Paris
              home.
            </p>

            <p className="text-pretty text-lg leading-relaxed mt-6 xl:mt-8 xl:text-xl xl:leading-relaxed">
              I also invest small checks in startups and funds that inspire me.
              I owe much of my career to people who believed in me when others
              didn’t. This is my way to pay it forward. Think of me as an
              advisor with skin in the game—if you think I can be helpful,
              please{" "}
              <EmailLink
                className="shrink-0 underline-offset-4 decoration-2 underline decoration-neutral-300 hover:decoration-neutral-900 focus:decoration-neutral-900 dark:decoration-neutral-700 dark:hover:decoration-neutral-100 dark:focus:decoration-neutral-100 text-neutral-900 dark:text-neutral-100 dark:hover:text-neutral-50 hover:text-neutral-950 dark:focus:text-neutral-50 focus:text-neutral-950 focus:outline-none"
                email="hello@stevenfabre.com"
              >
                reach out
              </EmailLink>
              !
            </p>

            <h2 className="font-semibold text-lg leading-relaxed mt-8 xl:mt-10 xl:text-xl xl:leading-relaxed text-neutral-900 dark:text-neutral-100">
              Investments
            </h2>
            <ul className="flex flex-col mt-3 xl:mt-4 gap-1.5 xl:gap-2">
              {INVESTMENTS.map((investment, index) => {
                return <Investment key={index} {...investment} />;
              })}
            </ul>

            <Footer />
          </div>
        </div>
      </div>
    </>
  );
}
