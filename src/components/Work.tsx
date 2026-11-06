import heading from "./HeadingControl.module.css";
import Icon from "./Icon";
import Experience, { ExperienceProps } from "./Experience";
import { SiteLink } from "./SiteNavigation";

const EXPERIENCES: ExperienceProps[] = [
  {
    company: "Liveblocks",
    url: "https://liveblocks.io",
    title: "Co-founder & CEO",
    when: "2021-Now",
  },
  {
    company: "Gifmock",
    url: "https://gifmock.app",
    title: "Founder",
    when: "2017-Now",
  },
  {
    company: "Meta",
    tooltip: "Messenger",
    url: "https://meta.com",
    title: "Product Design",
    when: "2020-2021",
  },
  {
    company: "InVision",
    tooltip: "InVision Studio",
    url: "https://invisionapp.com",
    title: "Product Design",
    when: "2016-2020",
  },
  {
    company: "Easee",
    url: "https://thenextweb.com/news/invision-acquires-easee-animation-tool",
    title: "Founder",
    when: "2015-2016",
  },
  {
    company: "Campaign Monitor",
    url: "https://campaignmonitor.com",
    title: "Product Design",
    when: "2014-2016",
  },
  {
    company: "Backseat",
    url: "https://www.news.com.au/technology/gadgets/over-taxis-ridesharing-apps-like-uber-and-backseat-hit-australia/news-story/81ebe2794989a0dcc128d97fea140121",
    title: "Co-founder",
    when: "2014",
  },
  {
    company: "Digital Garden",
    url: "https://digitalgarden.com.au",
    title: "Design & Engineering",
    when: "2013-2014",
  },
  {
    company: "Rocket Internet",
    tooltip: "The Iconic",
    url: "https://theiconic.com.au",
    title: "Design & Engineering",
    when: "2012-2013",
  },
  {
    company: "Freelance",
    title: "Design & Engineering",
    when: "2006-2011",
  },
];

export default function Work() {
  const experiences = (
    <ul className="flex flex-col mt-4 xl:mt-6 gap-3">
      {EXPERIENCES.map((experience) => (
        <Experience key={experience.company} {...experience} preview />
      ))}
    </ul>
  );
  return (
    <>
      <h2 className="font-semibold text-lg leading-relaxed mt-12 xl:mt-16 @xl/content:text-xl @xl/content:leading-relaxed text-neutral-900 dark:text-neutral-100">
        <SiteLink
          href="/work"
          className={`${heading.control} group inline-flex items-center gap-1.5`}
        >
          Work
          <span
            aria-hidden="true"
            className="relative size-4 overflow-hidden opacity-40 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
          >
            <Icon
              name="arrow-up-right"
              size={16}
              className="transition-[transform,opacity,filter] duration-200 ease-out motion-safe:group-hover:translate-x-full motion-safe:group-hover:-translate-y-full motion-safe:group-hover:opacity-0 motion-safe:group-hover:blur-sm motion-reduce:transition-none"
            />
            <Icon
              name="arrow-up-right"
              size={16}
              className="absolute inset-0 -translate-x-full translate-y-full opacity-0 blur-sm transition-[transform,opacity,filter] duration-200 ease-out motion-safe:group-hover:translate-x-0 motion-safe:group-hover:translate-y-0 motion-safe:group-hover:opacity-100 motion-safe:group-hover:blur-none motion-reduce:hidden"
            />
          </span>
        </SiteLink>
      </h2>
      {experiences}
    </>
  );
}
