import ProjectLoading from "../ProjectLoading";
import { allFilms, companies, companyDetails } from "../work-data";

export default function LoadingProject() {
  return (
    <ProjectLoading
      projects={allFilms.map(
        ({ slug, title, introduction, company, year, contributions }) => ({
          slug,
          title,
          introduction: introduction.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1"),
          company: companies.find(({ id }) => id === company)!.name,
          role: companyDetails[company].role,
          year,
          contributions,
        })
      )}
    />
  );
}
