import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { allFilms, projectRedirects } from "../work-data";
import ProjectViewer from "../ProjectViewer";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const canonicalSlug = projectRedirects[slug]?.split("#")[0] || slug;
  const film = allFilms.find((film) => film.slug === canonicalSlug);
  return {
    title: film ? `Steven Fabre • ${film.title}` : "Steven Fabre • Work",
    description: film?.introduction,
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  if (projectRedirects[slug]) redirect(`/work/${projectRedirects[slug]}`);
  return <ProjectViewer initialSlug={slug} />;
}

export function generateStaticParams() {
  return allFilms.map(({ slug }) => ({ slug }));
}
