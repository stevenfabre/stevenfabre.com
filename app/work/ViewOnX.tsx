import ButtonLink from "../../src/components/ButtonLink";

export default function ViewOnX({ href }: { href: string }) {
  return (
    <ButtonLink
      appearance="raised"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      iconPosition="end"
      aria-label="View post on X"
    >
      View post
      <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path d="M14.4538 3H16.8288L11.6402 8.93026L17.7442 17H12.9648L9.22139 12.1058L4.93811 17H2.56171L8.11145 10.657L2.25586 3H7.15658L10.5403 7.47354L14.4538 3ZM13.6203 15.5785H14.9363L6.4415 4.34687H5.02929L13.6203 15.5785Z" />
      </svg>
    </ButtonLink>
  );
}
