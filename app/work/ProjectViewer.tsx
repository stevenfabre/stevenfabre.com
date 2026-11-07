import { notFound } from "next/navigation";
import { RouteReady } from "@/components/SiteNavigation";
import { allFilms, imagePath } from "./work-data";
import PreloadProjects from "./PreloadProjects";
import ProjectNavigation from "./ProjectNavigation";
import ProjectContent from "./ProjectContent";
import ProjectSwipe from "./ProjectSwipe";
import ProjectPage from "./ProjectPage";
import Footer from "@/components/Footer";

export default function ProjectViewer({
  initialSlug,
}: {
  initialSlug: string;
}) {
  const slug = initialSlug;
  const index = allFilms.findIndex((film) => film.slug === slug);
  const film = allFilms[index];
  if (!film) notFound();
  const previous = allFilms[(index - 1 + allFilms.length) % allFilms.length];
  const next = allFilms[(index + 1) % allFilms.length];
  return (
    <ProjectPage data-project-slug={film.slug}>
      <RouteReady href={`/work/${slug}`} />
      <PreloadProjects
        assets={[-1, 1, -2, 2].map((offset) => {
          const nearby =
            allFilms[(index + offset + allFilms.length) % allFilms.length];
          return {
            image: imagePath(nearby),
            video: nearby.kind ? undefined : `/work/media/${nearby.file}.mp4`,
          };
        })}
      />
      <ProjectNavigation
        slug={film.slug}
        index={index}
        total={allFilms.length}
        previous={{ slug: previous.slug, title: previous.title }}
        next={{ slug: next.slug, title: next.title }}
      />
      <ProjectSwipe
        key={slug}
        previousHref={`/work/${previous.slug}`}
        nextHref={`/work/${next.slug}`}
        previous={<ProjectContent film={previous} preview />}
        next={<ProjectContent film={next} preview />}
      >
        <ProjectContent film={film} />
      </ProjectSwipe>
      <div className="sticky bottom-0 z-20 mx-auto mt-8 w-full max-w-lg md:grid md:max-w-2xl md:grid-cols-4 md:gap-x-8 xl:max-w-4xl">
        <Footer className="static mt-0 xl:mt-0 w-full md:col-span-3 md:col-start-2" />
      </div>
    </ProjectPage>
  );
}
