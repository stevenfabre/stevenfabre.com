import type { CSSProperties, ReactNode } from "react";
import {
  Heart,
  MessageCircle,
  Repeat2,
  ChartNoAxesColumn,
  Send,
  Bookmark,
  Share,
} from "lucide-react";
import type { SocialPost } from "./work-data";
import ButtonLink from "../../src/components/ButtonLink";
import BrandIcon from "../../src/components/BrandIcon";
import ViewOnX from "./ViewOnX";
import styles from "./SocialPostCard.module.css";

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
  id: string;
  className: string;
  style: CSSProperties;
}) {
  const date = new Date(post.publishedAt);
  const instagram = post.platform === "instagram";
  return (
    <figure
      data-platform={post.platform}
      id={id}
      className={`${className} ${styles.card}`}
      style={style}
    >
      <a
        className={styles.author}
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
            src={`/work/media/${post.avatar}`}
            alt=""
            width={36}
            height={36}
            loading="lazy"
          />
        )}
        <span>
          <span className={styles.name}>{post.name}</span>
          <span className={styles.handle}>@{post.handle}</span>
        </span>
      </a>
      {!instagram && (
        <blockquote className={styles.copy} cite={source}>
          {post.text.split(/(@[A-Za-z0-9_]+)/g).map((part, index) =>
            part.startsWith("@") ? (
              <span key={index} className={styles.mention}>
                {part}
              </span>
            ) : (
              part
            )
          )}
        </blockquote>
      )}
      {children}
      <SocialActions post={post} source={source} />
      {instagram && (
        <blockquote className={styles.copy} cite={source}>
          {post.text.split(/(@[A-Za-z0-9_]+)/g).map((part, index) =>
            part.startsWith("@") ? (
              <span key={index} className={styles.mention}>
                {part}
              </span>
            ) : (
              part
            )
          )}
        </blockquote>
      )}
      <figcaption className={styles.footer}>
        {post.publishedAt && (
          <time dateTime={post.publishedAt} title={date.toUTCString()}>
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
        { label: "Save on Instagram", Icon: Bookmark, count: undefined },
      ]
    : [
        { label: "Replies", count: counts.replies, Icon: MessageCircle },
        { label: "Reposts", count: counts.reposts, Icon: Repeat2 },
        { label: "Likes", count: counts.likes, Icon: Heart },
        { label: "Views", count: counts.views, Icon: ChartNoAxesColumn },
        { label: "Bookmark on X", Icon: Bookmark, count: undefined },
        { label: "Share on X", Icon: Share, count: undefined },
      ];
  const format = new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  });
  return (
    <div
      className={`mt-3 flex items-center gap-2 text-xs tabular-nums ${
        instagram ? "text-[var(--ink)]" : "justify-between text-[var(--muted)]"
      }`}
      aria-label="Post engagement"
      title="Engagement counts from the archived post; not live."
    >
      {actions.map(({ label, count, Icon }, index) => (
        <a
          key={label}
          href={source}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${label}${
            count === undefined ? "" : `: ${count.toLocaleString("en-US")}`
          }. Open original post.`}
          className={`inline-flex min-h-8 items-center gap-1 rounded hover:text-[var(--ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
            instagram && index === actions.length - 1 ? "ml-auto" : ""
          }`}
        >
          <Icon
            size={instagram ? 19 : 15}
            strokeWidth={1.6}
            aria-hidden="true"
            className="shrink-0"
          />
          {count !== undefined && <span>{format.format(count)}</span>}
        </a>
      ))}
    </div>
  );
}
