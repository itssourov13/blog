import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { CoverArt } from "@/components/article/CoverArt";
import { Tag } from "@/components/article/Tag";
import { TableOfContents } from "@/components/article/TableOfContents";
import { ReadingProgress } from "@/components/article/ReadingProgress";
import { ShareButtons } from "@/components/article/ShareButtons";
import { ArticlePager } from "@/components/article/ArticlePager";
import { RelatedArticles } from "@/components/article/RelatedArticles";
import { Breadcrumbs } from "@/components/article/Breadcrumbs";
import { PostMeta } from "@/components/article/PostMeta";
import { BackToTop } from "@/components/article/BackToTop";
import { Comments } from "@/components/article/Comments";
import { mdxComponents } from "@/components/mdx/mdx-components";
import { remarkToc } from "@/lib/toc";
import { remarkCodeMeta } from "@/lib/remark-code-meta";
import { getCategoryName } from "@/lib/categories";
import { author, site } from "@/lib/author";
import {
  getAdjacentPosts,
  getAllPosts,
  getPostBySlug,
  getRelatedPosts,
} from "@/lib/posts";
import type { TocItem } from "@/lib/types";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  const url = `${site.url}/posts/${post.slug}`;

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: url,
      types: { "application/rss+xml": `${site.url}/feed.xml` },
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? post.publishedAt,
      authors: [author.name],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const tocOutput: { items: TocItem[] } = { items: [] };
  const { content } = await compileMDX({
    source: post.content,
    components: mdxComponents,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm, [remarkToc, tocOutput], remarkCodeMeta],
      },
    },
  });

  const related = getRelatedPosts(post);
  const { prev, next } = getAdjacentPosts(post.slug);
  const url = `${site.url}/posts/${post.slug}`;
  const categoryUrl = `${site.url}/writing?category=${post.category}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    author: { "@type": "Person", name: author.name },
    mainEntityOfPage: url,
    keywords: post.tags.join(", "),
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: site.url },
      {
        "@type": "ListItem",
        position: 2,
        name: getCategoryName(post.category),
        item: categoryUrl,
      },
      { "@type": "ListItem", position: 3, name: post.title, item: url },
    ],
  };

  return (
    <article>
      <ReadingProgress targetId="article-content" />

      <header className="container-content pb-8 pt-14">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: getCategoryName(post.category), href: `/writing?category=${post.category}` },
            { label: post.title },
          ]}
        />
        <p className="mt-6 text-sm font-medium text-accent">{getCategoryName(post.category)}</p>
        <h1 className="mt-4 max-w-3xl font-serif text-3xl font-medium leading-tight text-foreground md:text-5xl">
          {post.title}
        </h1>
        {post.subtitle && (
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {post.subtitle}
          </p>
        )}
        <PostMeta
          variant="header"
          size="sm"
          className="mt-6"
          author={author.name}
          readingTime={post.readingTime}
          publishedAt={post.publishedAt}
        />
      </header>

      <div className="container-content">
        <div className="aspect-[21/9] overflow-hidden rounded-sm">
          <CoverArt
            seed={post.slug}
            category={post.category}
            src={post.coverImage}
            className="h-full w-full"
          />
        </div>
      </div>

      <div className="container-content grid gap-12 py-12 lg:grid-cols-[1fr_16rem]">
        <aside className="order-2 print:hidden">
          <TableOfContents items={tocOutput.items} />
        </aside>
        <div id="article-content" className="article-prose order-1">
          {content}
        </div>
      </div>

      <div className="container-content">
        <div className="flex flex-wrap items-center justify-between gap-6 border-t border-border py-8">
          <div className="flex flex-wrap gap-4">
            {post.tags.map((tag) => (
              <Tag key={tag} tag={tag} />
            ))}
          </div>
          <ShareButtons url={url} title={post.title} />
        </div>

        <ArticlePager prev={prev} next={next} />
      </div>

      <div className="container-content print:hidden">
        <RelatedArticles posts={related} />
        <Comments />
      </div>

      <BackToTop />

      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
    </article>
  );
}
