import type { Collaborator } from "./work-data";
import ExternalLink from "./ExternalLink";
import Image from "next/image";
import HorizontalScroll from "../../src/components/HorizontalScroll";

export default function Collaborators({ people }: { people: Collaborator[] }) {
  if (!people.length) return null;
  return (
    <section
      className="mt-8 min-w-0 border-t border-black/10 pt-5 dark:border-white/10 text-sm leading-normal"
      aria-label="Project collaborators"
    >
      <h2 className="mb-3 text-[13px] font-normal text-[var(--muted)]">
        Collaborators
      </h2>
      <HorizontalScroll label="Scroll collaborators">
        <ul className="flex w-max gap-4">
          {people.map((person) => (
            <li
              className="flex w-52 shrink-0 items-center gap-3"
              key={person.name}
            >
              {person.avatar ? (
                <Image
                  src={person.avatar}
                  alt=""
                  width={40}
                  height={40}
                  className="size-10 shrink-0 rounded-full object-cover"
                />
              ) : (
                <span
                  aria-hidden="true"
                  className="flex size-10 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-xs font-medium text-[var(--muted)] dark:bg-neutral-800"
                >
                  {person.name
                    .split(" ")
                    .map((part) => part[0])
                    .join("")}
                </span>
              )}
              <div className="grid min-w-0 flex-1">
                <span className="min-w-0 font-medium text-[var(--ink)]">
                  {person.href ? (
                    <ExternalLink
                      href={person.href}
                      iconSize={13}
                      className="flex min-w-0"
                    >
                      <span className="truncate" title={person.name}>
                        {person.name}
                      </span>
                    </ExternalLink>
                  ) : (
                    <span className="block truncate" title={person.name}>
                      {person.name}
                    </span>
                  )}
                </span>
                <span
                  className="truncate text-[var(--muted)]"
                  title={person.role}
                >
                  {person.role}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </HorizontalScroll>
    </section>
  );
}
