import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { allFilms, imagePath, projectRedirects } from "../work-data";
import ProjectViewer from "../ProjectViewer";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const canonicalSlug = projectRedirects[slug]?.split("#")[0] || slug;
  const film = allFilms.find((film) => film.slug === canonicalSlug);
  if (!film) return { title: "Steven Fabre • Work" };
  const title = `Steven Fabre • ${film.title}`;
  const url = `/work/${film.slug}`;
  const images = [{ url: imagePath(film), alt: film.imageAlt || film.title }];
  return {
    title,
    description: film.description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title,
      description: film.description,
      url,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: film.description,
      images,
    },
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
