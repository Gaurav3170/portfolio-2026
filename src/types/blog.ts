/** Fields an author writes at the top of every post. */
export interface PostFrontmatter {
  title: string;
  /** One or two sentences; used on the index, in search results and link previews. */
  description: string;
  /** Publish date, YYYY-MM-DD. */
  date: string;
  /** Last meaningful revision, YYYY-MM-DD. */
  updated?: string;
  tags: string[];
  /** Drafts render in development only. */
  draft: boolean;
}

export interface PostMeta extends PostFrontmatter {
  /** File name without `.mdx`; also the URL segment. */
  slug: string;
  readingMinutes: number;
}

/** A section heading, for the article's "On this page" list. */
export interface PostHeading {
  /** Matches the id rehype-slug gives the rendered heading. */
  id: string;
  text: string;
}

export interface Post extends PostMeta {
  /** MDX source with the frontmatter removed. */
  body: string;
  /** Every `##` heading, in order. */
  headings: PostHeading[];
}
