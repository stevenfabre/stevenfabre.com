import type { Collaborator } from "./work-data";
import ExternalLink from "./ExternalLink";

export default function Collaborators({ people }: { people: Collaborator[] }) {
  if (!people.length) return null;
  return (
    <section
      className="mt-8 text-sm leading-normal"
      aria-label="Project collaborators"
    >
      <h2 className="mb-3 text-[13px] font-normal text-[var(--muted)]">
        Collaborators
      </h2>
      <ul className="flex flex-wrap gap-x-10 gap-y-4">
        {people.map((person) => (
          <li className="grid gap-[3px]" key={person.name}>
            <span className="font-medium text-[var(--ink)]">
              {person.href ? (
                <ExternalLink href={person.href} iconSize={13}>
                  {person.name}
                </ExternalLink>
              ) : (
                person.name
              )}
            </span>
            <span className="text-[var(--muted)]">{person.role}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
