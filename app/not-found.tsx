import Image from "next/image";
import Link from "next/link";
import GameProvider from "../src/components/Game/GameProvider";
import profilePic from "../public/steven-fabre.jpg";
import EmailLink from "../src/components/EmailLink";
import Footer from "../src/components/Footer";
import Investments from "../src/components/Investments";
import Work from "../src/components/Work";
import Featured from "../src/components/Featured";

export default async function NotFound() {
  return (
    <>
      <div className="md:grid md:grid-cols-4 md:h-screen">
        <div className="select-none h-[64vh] fixed w-full top-0 md:top-auto md:w-auto md:h-auto md:col-span-1 md:relative overflow-hidden">
          <div className="absolute top-0 -bottom-[10vh] inset-0 md:bottom-0">
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
        <div className="relative mt-[64vh] bg-neutral-50 dark:bg-neutral-950 bg-opacity-95 dark:bg-opacity-95 backdrop-blur md:backdrop-filter-none md:mt-0 md:col-span-3 md:flex md:justify-center md:overflow-y-scroll">
          <div className="w-full max-w-lg md:flex md:flex-col md:justify-between md:h-screen xl:max-w-3xl px-4 xl:px-8 mx-auto pt-10 sm:pt-16 md:pt-0">
            <div className="flex flex-col items-center justify-center flex-1">
              <h1 className="text-center text-balance text-6xl tracking-tight font-semibold text-neutral-900 sm:text-7xl sm:tracking-tight dark:text-neutral-100 md:text-8xl md:tracking-tight">
                404
              </h1>
              <p className="text-center text-pretty text-lg leading-relaxed mt-4 xl:mt-6 xl:text-xl xl:leading-relaxed">
                The page you are looking for doesn’t exist.
                <br />
                <Link
                  href="/"
                  className="underline-offset-4 decoration-2 underline decoration-neutral-300 hover:decoration-neutral-900 focus:decoration-neutral-900 dark:decoration-neutral-700 dark:hover:decoration-neutral-100 dark:focus:decoration-neutral-100 text-neutral-900 dark:text-neutral-100 focus:outline-none"
                >
                  Go back to the home page
                </Link>
              </p>
            </div>
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
}
