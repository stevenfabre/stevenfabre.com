import ProjectLoading from "../ProjectLoading";
import { allFilms } from "../work-data";

export default function LoadingProject() {
  return (
    <ProjectLoading
      projects={allFilms.map(({ slug, title }) => ({ slug, title }))}
    />
  );
}
