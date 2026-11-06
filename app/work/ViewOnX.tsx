import BrandIcon from "../../src/components/BrandIcon";
import ButtonLink from "../../src/components/ButtonLink";

export default function ViewOnX({ href }: { href: string }) {
  return (
    <ButtonLink
      appearance="raised"
      className="pl-3.5 gap-1.5"
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
