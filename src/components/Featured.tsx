import FeaturedItem, { FeaturedItemProps } from "./FeaturedItem";

const FEATURED: FeaturedItemProps[] = [
  {
    title: "Interview with Steven Fabre",
    description: "ConTejas Code",
    url: "https://www.youtube.com/watch?v=uyHRhx7LJLk",
    when: "Jun 2024",
    tooltip: "Podcast",
  },
  {
    title: "Interview with Steven Fabre",
    description: "PodRocket",
    url: "https://podrocket.logrocket.com/react-components-as-a-service-steven-fabre",
    when: "Apr 2024",
    tooltip: "Podcast",
  },
  {
    title: "React Components as a Service",
    description: "React Paris",
    url: "https://www.youtube.com/watch?v=EpXSc31CUUw",
    when: "Mar 2024",
    tooltip: "Talk",
  },
  {
    title: "Interview with Steven Fabre",
    description: "devtools.fm",
    url: "https://www.devtools.fm/episode/59",
    when: "Jul 2023",
    tooltip: "Podcast",
  },
  {
    title: "How to build undo/redo in a multiplayer environment",
    description: "React Brussels",
    url: "https://www.youtube.com/watch?v=pMnVhTPfDwE",
    when: "Oct 2022",
    tooltip: "Talk",
  },
  {
    title: "Liveblocks grabs $5 million for its real-time collaboration API",
    description: "Techcrunch",
    url: "https://techcrunch.com/2022/03/16/liveblocks-grabs-5-million-for-its-real-time-collaboration-api/",
    when: "Mar 2022",
    tooltip: "Press",
  },
  {
    title:
      "Liveblocks is an API that lets you add real-time collaboration to your product",
    description: "Techcrunch",
    url: "https://techcrunch.com/2021/09/16/liveblocks-is-an-api-that-lets-you-add-real-time-collaboration-to-your-product/",
    when: "Sep 2021",
    tooltip: "Press",
  },
  {
    title: "Invision acquires Easee, an animation tool for designers",
    description: "The Next Web",
    url: "https://thenextweb.com/news/invision-acquires-easee-animation-tool",
    when: "Apr 2016",
    tooltip: "Press",
  },
];

export default function () {
  return (
    <>
      <h2 className="font-semibold text-lg leading-relaxed mt-12 xl:mt-16 xl:text-xl xl:leading-relaxed text-neutral-900 dark:text-neutral-100">
        Featured
      </h2>
      <ul className="flex flex-col mt-4 xl:mt-6 gap-3">
        {FEATURED.map((featuredItem, index) => {
          return <FeaturedItem key={index} {...featuredItem} />;
        })}
      </ul>
    </>
  );
}
