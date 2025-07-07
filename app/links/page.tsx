import Image from "next/image";
import Link from "next/link";
import profilePic from "../../public/steven-fabre-profile-picture.jpg";
import Footer from "../../src/components/Footer";

export default async function Links() {
  return (
    <div className="max-w-sm mx-auto px-4">
      <div className="mt-12 xl:mt-16 flex flex-col items-center gap-4">
        <Image
          className="size-14 rounded-full"
          src={profilePic}
          alt="Picture of Steven Fabre"
          priority
        />
        <div className="flex flex-col items-center">
          <h1 className="font-semibold text-lg leading-relaxed xl:text-xl xl:leading-relaxed text-neutral-900 dark:text-neutral-100">
            Steven Fabre
          </h1>
          <p className="text-smleading-relaxed xl:text-base xl:leading-relaxed">
            CEO at Liveblocks
          </p>
        </div>
      </div>
      <ul className="flex flex-col gap-1.5 mt-8 items-stretch">
        <LinkTreeItem href="https://lblcks.io/story-3.0">
          The story behind Liveblocks
        </LinkTreeItem>
        <LinkTreeItem href="https://liveblocks.io">
          Liveblocks website
        </LinkTreeItem>
        <LinkTreeItem href="https://liveblocks.io/contact/sales">
          Book a Liveblocks demo
        </LinkTreeItem>
        <LinkTreeItem href="/">My personal website</LinkTreeItem>
      </ul>
      <Footer
        themeSwitcher={false}
        includedSocials={["x", "linkedin", "instagram", "youtube", "github"]}
      />
    </div>
  );
}

function LinkTreeItem({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex w-full">
      <Link
        href={href}
        className="flex items-center group gap-3 justify-between w-full text-neutral-900 dark:text-neutral-100 focus:outline-none rounded-lg pl-4 pr-3 h-11 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 focus:border-neutral-300 dark:focus:border-neutral-700"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span className="truncate">{children}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          className="shrink-0 opacity-70 group-hover:opacity-90 group-focus:opacity-90"
        >
          <path
            d="M11.0008 8L6.00078 13L5.30078 12.3L9.60078 8L5.30078 3.7L6.00078 3L11.0008 8Z"
            fill="currentColor"
          />
        </svg>
      </Link>
    </li>
  );
}
