import Link from "next/link";
import {
  WorkPreviewLink,
  WorkPreviewProvider,
} from "@/components/WorkPreview";
import { allFilms, imagePath } from "./work-data";
import type { ReactNode } from "react";

const linkedProjects = [
  "building-liveblocks",
  "invision-studio",
  "easee",
  "campaign-monitor",
];

export function ProjectTextPreviews({ children }: { children: ReactNode }) {
  const previews = Object.fromEntries(
    allFilms
      .filter((film) => linkedProjects.includes(film.slug))
      .map((film) => [
        `/work/${film.slug}`,
        [
          {
            file: film.file,
            title: film.title,
            href: `/work/${film.slug}`,
            image: imagePath(film),
            video: film.kind ? undefined : `/work/media/${film.file}.mp4`,
          },
        ],
      ])
  );
  return (
    <WorkPreviewProvider className="contents" previews={previews}>
      {children}
    </WorkPreviewProvider>
  );
}

export function renderProjectText(text: string) {
  return text.split(/(\[[^\]]+\]\(\/work\/[^)]+\))/g).map((part, index) => {
    const link = part.match(/^\[([^\]]+)\]\((\/work\/[^)]+)\)$/);
    if (!link) return part;
    const fallback = <Link href={link[2]}>{link[1]}</Link>;
    return (
      <WorkPreviewLink key={index} company={link[2]} label={link[1]}>
        {fallback}
      </WorkPreviewLink>
    );
  });
}
