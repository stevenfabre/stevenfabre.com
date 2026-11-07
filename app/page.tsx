import { getWorkPreviews } from "./work/preview-data";
import { RouteReady } from "@/components/SiteNavigation";
import Link from "next/link";
import EmailLink from "@/components/EmailLink";
import Footer from "@/components/Footer";
import Investments from "@/components/Investments";
import Work from "@/components/Work";
import Featured from "@/components/Featured";
import {
  WorkPreviewProvider,
  WorkPreviewLink,
} from "@/components/WorkPreview";

export default function Home() {
  const className =
    "@container/content w-full max-w-lg xl:max-w-3xl px-4 xl:px-8 mx-auto pt-10 sm:pt-16 lg:pt-32 xl:pt-44";
  const content = (
    <>
      <RouteReady href="/" />
      <h1 className="text-balance text-3xl tracking-tight font-semibold text-neutral-900 @sm/content:text-4xl @sm/content:tracking-tight dark:text-neutral-100 @xl/content:text-6xl @xl/content:tracking-tight">
        I’m Steven, a designer & founder who loves building tools for people.
      </h1>
      <p className="text-pretty text-lg leading-relaxed mt-8 xl:mt-10 @xl/content:text-xl @xl/content:leading-relaxed">
        I’m the co-founder and CEO of{" "}
        <IntroWorkLink
          company="Liveblocks"
          className="underline-offset-4 decoration-2 underline decoration-[#9f8dfc] text-neutral-900 dark:text-neutral-100 dark:hover:text-[#9f8dfc] hover:text-[#9f8dfc] dark:focus:text-[#9f8dfc] focus:text-[#9f8dfc] focus:outline-hidden"
          href="https://liveblocks.io"
        />
        , where we help software teams bring real-time collaboration to their
        products. Before that, I created{" "}
        <IntroWorkLink
          company="Easee"
          className="underline-offset-4 decoration-2 underline decoration-teal-400 text-neutral-900 dark:text-neutral-100 dark:hover:text-teal-400 hover:text-teal-400 dark:focus:text-teal-400 focus:text-teal-400 focus:outline-hidden"
          href="https://thenextweb.com/news/invision-acquires-easee-animation-tool"
        />
        , a web animation tool acquired by{" "}
        <IntroWorkLink
          company="InVision"
          className="underline-offset-4 decoration-2 underline decoration-[#FF0066] text-neutral-900 dark:text-neutral-100 dark:hover:text-[#FF0066] hover:text-[#FF0066] dark:focus:text-[#FF0066] focus:text-[#FF0066] focus:outline-hidden"
          href="https://invisionapp.com"
        />{" "}
        in 2016. I also worked on design systems at{" "}
        <IntroWorkLink
          company="Meta"
          className="underline-offset-4 decoration-2 underline decoration-[#006AFF] text-neutral-900 dark:text-neutral-100 dark:hover:text-[#006AFF] hover:text-[#006AFF] dark:focus:text-[#006AFF] focus:text-[#006AFF] focus:outline-hidden"
          href="https://messenger.com"
        />
        , and contributed to various projects in different capacities along the
        way.
      </p>

      <p className="text-pretty text-lg leading-relaxed mt-6 xl:mt-8 @xl/content:text-xl @xl/content:leading-relaxed">
        I grew up in Rodez, a small town in the south of France, where the
        values of hard work, resilience, and humility are deeply rooted. These
        principles continue to guide me in everything I do. After spending over
        a decade abroad in Sydney and New York City, I now call Paris home.
      </p>

      <p className="text-pretty text-lg leading-relaxed mt-6 xl:mt-8 @xl/content:text-xl @xl/content:leading-relaxed">
        I also invest small checks in startups and funds that inspire me. I owe
        much of my career to people who believed in me when others didn’t. This
        is my way to pay it forward. Think of me as an advisor with skin in the
        game—if you think I can help, I’d love to{" "}
        <EmailLink
          className="shrink-0 underline-offset-4 decoration-2 underline decoration-neutral-300 hover:decoration-neutral-900 focus:decoration-neutral-900 dark:decoration-neutral-700 dark:hover:decoration-neutral-100 dark:focus:decoration-neutral-100 text-neutral-900 dark:text-neutral-100 focus:outline-hidden"
          email="hello@stevenfabre.com"
        >
          hear from you
        </EmailLink>
        !
      </p>

      <Work />
      <Featured />
      <Investments />
      <Footer fullBleed />
    </>
  );
  return (
    <WorkPreviewProvider className={className} previews={getWorkPreviews()}>
      {content}
    </WorkPreviewProvider>
  );
}

function IntroWorkLink({
  company,
  href,
  className,
}: {
  company: string;
  href: string;
  className: string;
}) {
  const link = (
    <Link
      href={href}
      className={className}
      target="_blank"
      rel="noopener noreferrer"
    >
      {company}
    </Link>
  );
  return (
    <WorkPreviewLink company={company} className={className}>
      {link}
    </WorkPreviewLink>
  );
}
