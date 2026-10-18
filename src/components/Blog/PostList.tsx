import Link from "next/link";
import type { PostMeta } from "@/types/blog";
import { isScheduled } from "@/lib/blog";
import { formatPostDate } from "@/lib/format";
import styles from "./Blog.module.scss";

/** Every visible post, newest first, as a responsive grid of cards. Each card is one link. */
export function PostList({ posts }: { posts: PostMeta[] }) {
  if (posts.length === 0) {
    return <p className={styles.empty}>The first posts are being written. Check back soon.</p>;
  }

  return (
    <ol className={styles.postGrid}>
      {posts.map((post) => (
        <li key={post.slug}>
          <article className={styles.postCard}>
            <p className={styles.meta}>
              <time dateTime={post.date}>{formatPostDate(post.date)}</time>
              <span aria-hidden="true">·</span>
              <span>{post.readingMinutes} min read</span>
              {post.draft && <span className={styles.draftBadge}>Draft</span>}
              {!post.draft && isScheduled(post) && <span className={styles.draftBadge}>Scheduled</span>}
            </p>
            <h2 className={styles.postCardTitle}>
              <Link href={`/blog/${post.slug}`} className={styles.postCardLink}>
                {post.title}
              </Link>
            </h2>
            <p className={styles.postCardDescription}>{post.description}</p>
            {post.tags.length > 0 && <TagList tags={post.tags} />}
          </article>
        </li>
      ))}
    </ol>
  );
}

export function TagList({ tags }: { tags: string[] }) {
  return (
    <ul className={styles.tags} aria-label="Topics">
      {tags.map((tag) => (
        <li key={tag}>{tag}</li>
      ))}
    </ul>
  );
}
