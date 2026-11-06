import BrandIcon from "../../src/components/BrandIcon";
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
      <BrandIcon name="x" />
    </ButtonLink>
  );
}
