export type Category =
  | "security"
  | "research"
  | "engineering"
  | "reverse-engineering"
  | "programming"
  | "web"
  | "cloud"
  | "development"
  | "notes";

export interface CategoryMeta {
  slug: Category;
  name: string;
  description: string;
}

export interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

export interface PostFrontmatter {
  title: string;
  subtitle?: string;
  excerpt: string;
  category: Category;
  tags: string[];
  publishedAt: string; // ISO date
  updatedAt?: string; // ISO date
  featured?: boolean;
  /** Absolute public path to a custom cover image (e.g. "/covers/foo.webp").
   *  When set, the OpenGraph image renders it; otherwise the generated
   *  CoverArt composition is used. Mirrors `Post.coverImage` in prisma/schema.prisma. */
  coverImage?: string;
  coverSeed?: string; // optional override for the generated cover art seed
}

export interface Post extends PostFrontmatter {
  slug: string;
  content: string; // raw MDX body
  readingTime: number; // minutes
  wordCount: number;
}

/** Lightweight, serializable subset of Post passed from server layout to
 *  the client-side search modal — excludes the full MDX body. */
export interface SearchablePost {
  slug: string;
  title: string;
  excerpt: string;
  category: Category;
  tags: string[];
  publishedAt: string;
  readingTime: number;
}

export interface Author {
  name: string;
  role: string;
  bio: string;
  github?: string;
  linkedin?: string;
  website?: string;
}
