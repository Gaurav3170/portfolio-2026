import fs from "node:fs";
import path from "node:path";
import GithubSlugger from "github-slugger";
import { parse } from "yaml";
import type { Post, PostFrontmatter, PostHeading, PostMeta } from "@/types/blog";

/**
 * Posts are MDX files in src/content/blog. Everything is read at build time,
 * so the blog ships as static HTML with no runtime content fetching.
 */
const POSTS_DIR = path.join(process.cwd(), "src", "content", "blog");
const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const WORDS_PER_MINUTE = 220;
const showDrafts = process.env.NODE_ENV !== "production";

/**
 * Today's date in India (YYYY-MM-DD). A post dated in the future stays hidden in
 * production until a build runs on or after that date, so posts can be scheduled.
 */
const today = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date());

/** Fails the build with a clear message instead of rendering a broken post. */
function validate(data: Record<string, unknown>, file: string): PostFrontmatter {
  const fail = (message: string): never => {
    throw new Error(`[blog] ${file}: ${message}`);
  };
  const text = (key: string) =>
    typeof data[key] === "string" && data[key] !== "" ? (data[key] as string) : fail(`"${key}" is required`);
  const date = (key: string) => {
    const value = data[key];
    if (typeof value !== "string" || !ISO_DATE.test(value)) fail(`"${key}" must be a quoted "YYYY-MM-DD" date`);
    return value as string;
  };

  const tags = data.tags ?? [];
  if (!Array.isArray(tags) || !tags.every((tag) => typeof tag === "string")) fail(`"tags" must be a list of strings`);

  return {
    title: text("title"),
    description: text("description"),
    date: date("date"),
    updated: data.updated === undefined ? undefined : date("updated"),
    tags: tags as string[],
    draft: data.draft === true,
  };
}

/**
 * `##` headings outside code blocks, slugged with the same library rehype-slug uses
 * so the ids match the rendered headings.
 */
function extractHeadings(body: string): PostHeading[] {
  const slugger = new GithubSlugger();
  const headings: PostHeading[] = [];
  let inFence = false;

  for (const line of body.split(/\r?\n/)) {
    if (/^\s*(```|~~~)/.test(line)) inFence = !inFence;
    const match = !inFence && /^##\s+(.+?)\s*#*\s*$/.exec(line);
    if (!match) continue;
    // Headings may carry inline markdown; keep only the text the reader sees.
    const text = match[1].replace(/[`*_]/g, "").replace(/\[([^\]]+)\]\([^)]*\)/g, "$1");
    headings.push({ id: slugger.slug(text), text });
  }
  return headings;
}

function readPost(file: string): Post {
  const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf8");
  const match = FRONTMATTER.exec(raw);
  if (!match) throw new Error(`[blog] ${file}: missing frontmatter block`);

  const body = raw.slice(match[0].length);
  const words = body.split(/\s+/).filter(Boolean).length;
  const frontmatter = validate(parse(match[1]) ?? {}, file);

  // Drafts carry visible author notes; a published post must not.
  if (!frontmatter.draft && body.includes("TODO(author)")) {
    throw new Error(`[blog] ${file}: resolve every TODO(author) note before setting draft: false`);
  }

  return {
    ...frontmatter,
    slug: file.replace(/\.mdx$/, ""),
    readingMinutes: Math.max(1, Math.round(words / WORDS_PER_MINUTE)),
    body,
    headings: extractHeadings(body),
  };
}

function toMeta(post: Post): PostMeta {
  const { title, description, date, updated, tags, draft, slug, readingMinutes } = post;
  return { title, description, date, updated, tags, draft, slug, readingMinutes };
}

/** Drafts and scheduled (future-dated) posts show in development only. */
function isVisible(post: Post, now: string): boolean {
  return showDrafts || (!post.draft && post.date <= now);
}

function readPosts(): Post[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  const now = today();
  return fs
    .readdirSync(POSTS_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .map(readPost)
    .filter((post) => isVisible(post, now))
    .sort((a, b) => b.date.localeCompare(a.date));
}

/** Whether a post's publish date is still ahead; used to label scheduled posts in development. */
export function isScheduled(post: PostMeta): boolean {
  return post.date > today();
}

/** Visible posts, newest first, without their bodies. */
export function getAllPosts(): PostMeta[] {
  return readPosts().map(toMeta);
}

/** Looks the slug up among visible posts, so drafts, scheduled posts and stray paths 404 in production. */
export function getPost(slug: string): Post | undefined {
  return readPosts().find((post) => post.slug === slug);
}
