import { ProjectTextPreviews, renderProjectText } from "./ProjectText";
import WorkPageSelect from "./WorkPageSelect";

import { companies, companyDetails, allFilms } from "./work-data";
import Footer from "@/components/Footer";
import ProjectGrid from "./ProjectGrid";
import ExternalLink from "./ExternalLink";

export default function WorkPortfolio() {
  return (
    <ProjectTextPreviews>
      <main
        className="relative min-w-0 self-start pt-10 sm:pt-16 lg:pt-32 xl:pt-44 @container/content w-full max-w-lg xl:max-w-3xl px-4 xl:px-8 mx-auto"
        id="content"
      >
        <div id="top" className="absolute top-0" />
        <header className="pb-14">
          <h1 className="text-balance text-3xl tracking-tight font-semibold text-neutral-900 @sm/content:text-4xl @sm/content:tracking-tight dark:text-neutral-100 @xl/content:text-6xl @xl/content:tracking-tight">
            <WorkPageSelect />
          </h1>
          <p className="text-pretty text-lg leading-relaxed mt-8 xl:mt-10 @xl/content:text-xl @xl/content:leading-relaxed">
            I’ve spent 20 years designing and building products. I love figuring
            out what’s worth making, getting the details right, and building the
            teams and systems that help others do their best work.
          </p>
        </header>
        {companies.map((company) => (
          <section
            id={company.id}
            data-work-company
            key={company.id}
            className="scroll-mt-16 pb-16"
          >
            <header className="mb-7">
              <h2 className="font-semibold text-lg leading-relaxed @xl/content:text-xl @xl/content:leading-relaxed text-neutral-900 dark:text-neutral-100">
                <ExternalLink href={company.url}>{company.name}</ExternalLink>
              </h2>
              <div className="mt-0.5 grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-4">
                <p className="text-base leading-relaxed @xl/content:text-lg">
                  {companyDetails[company.id].role}
                </p>
                <p className="text-right text-base leading-relaxed whitespace-nowrap tabular-nums text-neutral-400 dark:text-neutral-500 @xl/content:text-lg">
                  {company.years}
                </p>
              </div>
              <p className="mt-5 text-base leading-[1.65] text-balance @xl/content:text-lg">
                {renderProjectText(companyDetails[company.id].description)}
              </p>
            </header>
            <ProjectGrid
              films={allFilms
                .filter((film) => film.company === company.id)
                .map(
                  ({
                    slug,
                    file,
                    title,
                    kind,
                    imageExtension,
                    imageAlt,
                    aspectRatio,
                    thumbnailPosition,
                  }) => ({
                    slug,
                    file,
                    title,
                    kind,
                    imageExtension,
                    imageAlt,
                    aspectRatio,
                    thumbnailPosition,
                  })
                )}
            />
          </section>
        ))}
        <Footer fullBleed />
      </main>
    </ProjectTextPreviews>
  );
}
