import type { ComponentProps } from "react";
import HeadingLink from "@/components/HeadingLink";

export default function ExternalLink(
  props: ComponentProps<typeof HeadingLink>
) {
  return <HeadingLink target="_blank" rel="noopener noreferrer" {...props} />;
}
