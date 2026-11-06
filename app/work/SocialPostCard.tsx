import type { CSSProperties, ReactNode } from "react";
import {
  Heart,
  MessageCircle,
  Repeat2,
  ChartNoAxesColumn,
  Send,
} from "lucide-react";
import type { SocialPost } from "./work-data";
import ButtonLink from "../../src/components/ButtonLink";
import BrandIcon from "../../src/components/BrandIcon";
import ViewOnX from "./ViewOnX";
import styles from "./SocialPostCard.module.css";
import cx from "../../src/utils/cx";

export default function SocialPostCard({
  post,
  source,
  children,
  id,
  className,
  style,
}: {
  post: SocialPost;
  source: string;
  children: ReactNode;
  id?: string;
  className: string;
  style: CSSProperties;
}) {
  const date = new Date(post.publishedAt);
  const instagram = post.platform === "instagram";
  return (
    <figure
      data-platform={post.platform}
      id={id}
      className={cx(
        className,
        "rounded-[14px] border border-[var(--media-border)] bg-white p-4 shadow-[0_2px_6px_#00000005] dark:bg-[#141414] dark:shadow-[0_2px_6px_#0000001a]",
        instagram && styles.instagram
      )}
      style={style}
    >
      <a
        className={cx(
          "inline-flex max-w-full items-center gap-2.5 rounded leading-[1.4] no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-500",
          instagram && "mb-4"
        )}
        href={
          instagram
            ? `https://www.instagram.com/${post.handle}/`
            : `https://x.com/${post.handle}`
        }
        target="_blank"
        rel="noopener noreferrer"
      >
        {/* Local copies keep these lightweight and independent of X embeds. */}
        {instagram ? (
          <span
            className={styles.instagramAvatar}
            aria-hidden="true"
            style={{ backgroundImage: `url(/work/media/${post.avatar})` }}
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className="size-9 shrink-0 rounded-full object-cover"
            src={`/work/media/${post.avatar}`}
            alt=""
            width={36}
            height={36}
            loading="lazy"
          />
        )}
        <span>
          <span className="block text-sm font-semibold text-[var(--ink)]">
            {post.name}
          </span>
          <span className="block text-xs text-[var(--muted)]">
            @{post.handle}
          </span>
        </span>
      </a>
      {!instagram && <PostCopy text={post.text} source={source} />}
      {children}
      <SocialActions post={post} source={source} />
      {instagram && <PostCopy text={post.text} source={source} />}
      <figcaption className="mt-4 flex flex-wrap items-center justify-between gap-3">
        {post.publishedAt && (
          <time
            className="text-xs text-[var(--muted)]"
            dateTime={post.publishedAt}
            title={date.toUTCString()}
          >
            {date.toLocaleDateString("en-US", {
              month: "short",
              day: post.publishedAt.length === 7 ? undefined : "numeric",
              year: "numeric",
              timeZone: "UTC",
            })}
          </time>
        )}
        {instagram ? (
          <ButtonLink
            iconPosition="end"
            aria-label="View post on Instagram"
            appearance="raised"
            href={source}
            target="_blank"
            rel="noopener noreferrer"
          >
            View post
            <BrandIcon name="instagram" />
          </ButtonLink>
        ) : (
          <ViewOnX href={source} />
        )}
      </figcaption>
    </figure>
  );
}

function SocialActions({ post, source }: { post: SocialPost; source: string }) {
  const counts = post.engagement;
  if (!counts) return null;
  const instagram = post.platform === "instagram";
  const actions = instagram
    ? [
        { label: "Likes", count: counts.likes, Icon: Heart },
        { label: "Comments", count: counts.replies, Icon: MessageCircle },
        { label: "Shares", count: counts.shares, Icon: Send },
      ]
    : [
        { label: "Replies", count: counts.replies, Icon: MessageCircle },
        { label: "Reposts", count: counts.reposts, Icon: Repeat2 },
        { label: "Likes", count: counts.likes, Icon: Heart },
        { label: "Views", count: counts.views, Icon: ChartNoAxesColumn },
      ];
  const format = new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  });
  return (
    <div
      className={`mt-3 flex items-center justify-start gap-5 text-xs tabular-nums ${
        instagram ? "text-[var(--ink)]" : "text-[var(--muted)]"
      }`}
      aria-label="Post engagement"
      title="Engagement counts from the archived post; not live."
    >
      {actions.map(({ label, count, Icon }) => (
        <a
          key={label}
          href={source}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${label}${
            count === undefined ? "" : `: ${count.toLocaleString("en-US")}`
          }. Open original post.`}
          className="inline-flex min-h-8 items-center gap-1 rounded hover:text-[var(--ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          <Icon
            size={instagram || Icon === Repeat2 ? 19 : 15}
            strokeWidth={1.6}
            aria-hidden="true"
            className="shrink-0"
          />
          {count !== undefined && (
            <span className="font-medium">{format.format(count)}</span>
          )}
        </a>
      ))}
    </div>
  );
}

function PostCopy({ text, source }: { text: string; source: string }) {
  return (
    <blockquote
      className="my-4 whitespace-pre-line text-[15px] leading-[1.55] text-[var(--ink)] [overflow-wrap:anywhere]"
      cite={source}
    >
      {text.split(/(@[A-Za-z0-9_]+)/g).map((part, index) =>
        part.startsWith("@") ? (
          <span key={index} className="text-[#0875be] dark:text-[#63b7f0]">
            {part}
          </span>
        ) : (
          part
        )
      )}
    </blockquote>
  );
}
