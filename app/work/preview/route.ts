import { allFilms, companies, imagePath } from "../work-data";

export function GET() {
  const previews = Object.fromEntries(
    companies.map((company) => [
      company.name,
      allFilms
        .filter((film) => film.company === company.id)
        .sort(
          (a, b) =>
            Number(a.kind === "overview") - Number(b.kind === "overview")
        )
        .flatMap((film) =>
          [film, ...(film.gallery || [])].map((visual) => ({
            file: visual.file,
            title: visual.title,
            href: `/work#${company.id}`,
            image: imagePath(visual),
            video: visual.kind ? undefined : `/work/media/${visual.file}.mp4`,
          }))
        ),
    ])
  );
  return Response.json(previews, {
    headers: {
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
