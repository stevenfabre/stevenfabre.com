import FeaturedItem, { FeaturedItemProps } from "./FeaturedItem";

const FEATURED: FeaturedItemProps[] = [
  {
    title: "Steven Fabre, CEO de Liveblocks",
    description: "Les Samouraïls du Business",
    url: "https://open.spotify.com/episode/554OfOha8javPN0VDGIAgL?si=O9Ya3486QeWZQmWW7iVBNw",
    when: "Jan 2026",
    language: "fr",
    tooltip: "Podcast",
  },
  {
    title: "How AI Is Changing Software",
    description: "The Peel with Turner Novak",
    url: "https://www.youtube.com/watch?v=SB-4iyWdzas",
    when: "Dec 2025",
    language: "en",
    tooltip: "Podcast",
  },
  {
    title: "The story behind Liveblocks 3.0",
    description: "Liveblocks",
    url: "https://www.youtube.com/watch?v=SG8eG7SYEko",
    when: "Jun 2025",
    language: "en",
    tooltip: "Interview",
  },
  {
    title: "The future of in-product collaboration between AI and humans",
    description: "Supra Insider",
    url: "https://youtu.be/46Olg8gJvPY?si=4ypawJCrKRklABTt",
    when: "Mar 2025",
    language: "en",
    tooltip: "Podcast",
  },
  {
    title: "Interview with Steven Fabre",
    description: "ConTejas Code",
    url: "https://www.youtube.com/watch?v=uyHRhx7LJLk",
    when: "Jun 2024",
    language: "en",
    tooltip: "Podcast",
  },
  {
    title: "Interview with Steven Fabre",
    description: "PodRocket",
    url: "https://podrocket.logrocket.com/react-components-as-a-service-steven-fabre",
    when: "Apr 2024",
    language: "en",
    tooltip: "Podcast",
  },
  {
    title: "React Components as a Service",
    description: "React Paris",
    url: "https://www.youtube.com/watch?v=EpXSc31CUUw",
    when: "Mar 2024",
    language: "en",
    tooltip: "Talk",
  },
  {
    title: "Build multiplayer SaaS apps with Liveblocks",
    description: "Learn with Jason",
    url: "https://youtu.be/n5JkIl1e6k4",
    when: "Aug 2023",
    language: "en",
    tooltip: "Podcast",
  },
  {
    title: "Interview with Steven Fabre",
    description: "devtools.fm",
    url: "https://www.devtools.fm/episode/59",
    when: "Jul 2023",
    language: "en",
    tooltip: "Podcast",
  },
  {
    title: "How to build undo/redo in a multiplayer environment",
    description: "React Brussels",
    url: "https://www.youtube.com/watch?v=pMnVhTPfDwE",
    when: "Oct 2022",
    language: "en",
    tooltip: "Talk",
  },
  {
    title: "Avec Liveblocks, Steven Fabre imagine le futur du travail",
    description: "Centre Presse",
    url: "https://www.centrepresseaveyron.fr/2022/07/04/avec-liveblocks-steven-fabre-imagine-le-futur-du-travail-10414089.php",
    when: "Jul 2022",
    language: "fr",
    tooltip: "Press",
  },
  {
    title: "Liveblocks grabs $5 million for its real-time collaboration API",
    description: "Techcrunch",
    url: "https://techcrunch.com/2022/03/16/liveblocks-grabs-5-million-for-its-real-time-collaboration-api/",
    when: "Mar 2022",
    language: "en",
    tooltip: "Press",
  },
  {
    title:
      "Future of Work: Liveblocks lève 5 millions de dollars auprès de Boldstart et Kima",
    description: "FrenchWeb",
    url: "https://www.frenchweb.fr/seed-future-of-work-liveblocks-leve-5-millions-de-dollars-aupres-de-boldstart-et-kima/432998",
    when: "Mar 2022",
    language: "fr",
    tooltip: "Press",
  },
  {
    title:
      "Liveblocks is an API that lets you add real-time collaboration to your product",
    description: "Techcrunch",
    url: "https://techcrunch.com/2021/09/16/liveblocks-is-an-api-that-lets-you-add-real-time-collaboration-to-your-product/",
    when: "Sep 2021",
    language: "en",
    tooltip: "Press",
  },
  {
    title: "Invision acquires Easee, an animation tool for designers",
    description: "The Next Web",
    url: "https://thenextweb.com/news/invision-acquires-easee-animation-tool",
    when: "Apr 2016",
    language: "en",
    tooltip: "Press",
  },
];

export default function Featured() {
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
