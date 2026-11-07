import BrandIcon from "@/components/BrandIcon";
import Icon from "@/components/Icon";
import Link from "next/link";
import EmailLink from "@/components/EmailLink";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { Tooltip } from "@/components/Tooltip";
import { iconControl } from "@/components/buttonStyles";
import cx from "@/utils/cx";

const socials = [
  { name: "x", label: "X", href: "https://x.com/stevenfabre" },
  {
    name: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/steven-fabre-5510bb38",
  },
  {
    name: "instagram",
    label: "Instagram",
    href: "https://www.instagram.com/stevenfabre",
  },
  {
    name: "youtube",
    label: "YouTube",
    href: "https://www.youtube.com/@StevenFabre",
  },
  { name: "github", label: "GitHub", href: "https://github.com/stevenfabre" },
] as const;
type Social = (typeof socials)[number]["name"] | "email";
const defaultSocials: Social[] = [...socials.map(({ name }) => name), "email"];

export default function Footer({
  className,
  fullBleed = false,
  includedSocials = defaultSocials,
}: {
  className?: string;
  fullBleed?: boolean;
  includedSocials?: Social[];
}) {
  return (
    <footer
      data-site-footer
      className={cx(
        "sticky bottom-0 z-20 flex flex-row-reverse justify-between items-center py-4 mt-12 xl:mt-16 border-t border-black/10 dark:border-white/10",
        fullBleed
          ? "before:pointer-events-none before:absolute before:inset-y-0 before:-inset-x-4 xl:before:-inset-x-8 before:-z-10 before:bg-neutral-50/95 dark:before:bg-neutral-950/95 before:backdrop-blur"
          : "bg-neutral-50/95 dark:bg-neutral-950/95 backdrop-blur",
        className
      )}
    >
      <ul className="flex flex-wrap sm:gap-0.5">
        {socials
          .filter(({ name }) => includedSocials.includes(name))
          .map(({ name, label, href }) => (
            <li key={name}>
              <Tooltip content={label} delayDuration={200}>
                <Link
                  className={iconControl}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <BrandIcon name={name} className="size-6 sm:size-5" />
                  <span className="sr-only">{label}</span>
                </Link>
              </Tooltip>
            </li>
          ))}
        {includedSocials.includes("email") && (
          <li>
            <EmailLink className={iconControl} email="hello@stevenfabre.com">
              <Icon name="envelope" className="size-6 sm:size-5" />
              <span className="sr-only">hello@stevenfabre.com</span>
            </EmailLink>
          </li>
        )}
      </ul>
      <ThemeSwitcher />
    </footer>
  );
}
