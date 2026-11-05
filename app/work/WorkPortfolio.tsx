import styles from "./work.module.css";
import { SiteLink } from "../../src/components/SiteNavigation";

import { companies, companyDetails, allFilms } from "./work-data";
import Footer from "../../src/components/Footer";
import ProjectGrid from "./ProjectGrid";
import ExternalLink from "./ExternalLink";

export default function WorkPortfolio() {
  return (
    <main
      className="relative min-w-0 self-start pt-24 sm:pt-28 lg:pt-32 xl:pt-44 @container/content w-full max-w-lg xl:max-w-3xl px-4 xl:px-8 mx-auto"
      id="content"
    >
      <div id="top" className="absolute top-0" />
      <header className="pb-[52px]">
        <h1 className="text-balance text-3xl tracking-tight font-semibold text-neutral-900 @sm/content:text-4xl @sm/content:tracking-tight dark:text-neutral-100 @xl/content:text-6xl @xl/content:tracking-tight">
          <SiteLink
            href="/"
            className="rounded-sm text-neutral-400 transition-colors duration-150 hover:text-neutral-900 focus-visible:text-neutral-900 focus-visible:outline-2 focus-visible:outline-offset-4 dark:text-neutral-500 dark:hover:text-neutral-100 dark:focus-visible:text-neutral-100"
          >
            Steven Fabre
          </SiteLink>{" "}
          <span className="text-neutral-400 dark:text-neutral-500">/</span> Work
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
          key={company.id}
          className="scroll-mt-16 md:scroll-mt-24 pb-11 md:pb-16"
        >
          <header className="mb-7">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-4">
              <h2 className="font-semibold text-lg leading-relaxed @xl/content:text-xl @xl/content:leading-relaxed text-neutral-900 dark:text-neutral-100">
                <ExternalLink href={company.url}>{company.name}</ExternalLink>
              </h2>
              <p className={styles.years}>{company.years}</p>
            </div>
            <p className={styles.role}>{companyDetails[company.id].role}</p>
            <p className="mt-5 text-base leading-[1.65] text-balance @xl/content:text-lg">
              {companyDetails[company.id].description}
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
                  imageAlt,
                  aspectRatio,
                  thumbnailPosition,
                }) => ({
                  slug,
                  file,
                  title,
                  kind,
                  imageAlt,
                  aspectRatio,
                  thumbnailPosition,
                })
              )}
          />
        </section>
      ))}
      <Footer />
    </main>
  );
}
