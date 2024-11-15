import Experience, { ExperienceProps } from "./Experience";

const EXPERIENCES: ExperienceProps[] = [
  {
    company: "Liveblocks",
    url: "https://liveblocks.io",
    title: "Co-founder & CEO",
    when: "2021 - Present",
  },
  {
    company: "Gifmock",
    url: "https://gifmock.com",
    title: "Founder",
    when: "2017 - Present",
  },
  {
    company: "Meta",
    tooltip: "Messenger",
    url: "https://meta.com",
    title: "Product Design",
    when: "2020 - 2021",
  },
  {
    company: "InVision",
    tooltip: "InVision Studio",
    url: "https://invisionapp.com",
    title: "Product Design",
    when: "2016 - 2020",
  },
  {
    company: "Easee",
    url: "https://thenextweb.com/news/invision-acquires-easee-animation-tool",
    title: "Founder",
    when: "2016",
  },
  {
    company: "Campaign Monitor",
    url: "https://campaignmonitor.com",
    title: "Product Design",
    when: "2014 - 2016",
  },
  {
    company: "Backseat",
    title: "Co-founder",
    when: "2014",
  },
  {
    company: "Digital Garden",
    url: "https://digitalgarden.com.au",
    title: "Design & Engineering",
    when: "2013 - 2014",
  },
  {
    company: "Rocket Internet",
    tooltip: "The Iconic",
    url: "https://theiconic.com.au",
    title: "Design & Engineering",
    when: "2012 - 2013",
  },
  {
    company: "Freelance",
    title: "Design & Engineering",
    when: "2006 - 2011",
  },
];

export default function () {
  return (
    <>
      <h2 className="font-semibold text-lg leading-relaxed mt-12 xl:mt-16 xl:text-xl xl:leading-relaxed text-neutral-900 dark:text-neutral-100">
        Work
      </h2>
      <ul className="flex flex-col mt-3 xl:mt-4 gap-2">
        {EXPERIENCES.map((experience, index) => {
          return <Experience key={index} {...experience} />;
        })}
      </ul>
    </>
  );
}
