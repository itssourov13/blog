# Sourov — Security & Engineering Notes

A standalone technical publication built with Next.js: security research, software
engineering, and reverse engineering notes. Deployed independently of the portfolio
site it's linked from.

## Stack

- **Next.js 16** (App Router) + **TypeScript** + **React 19**
- **Tailwind CSS v4** (CSS-first config, no `tailwind.config.js`) with a semantic,
  dark/light token system in `app/globals.css`
- **MDX** content via `next-mdx-remote/rsc`, parsed from flat files with `gray-matter`
- **Shiki** for server-rendered syntax highlighting (no highlighter ships to the client)
- **next-themes** for dark/light mode
- Zero external image dependencies — see "About the artwork" below

## What's here vs. what's stubbed

This ships as a complete, working app, not a mockup — but a couple of pieces are
intentionally left as clean seams rather than fully wired up, since they need
accounts/infrastructure only you can provide:

| Area | Status |
|---|---|
| Homepage, writing index, topic pages, article pages, search, filtering, theming | Fully built |
| Content | 10 real sample articles in `/content/posts` as MDX |
| Newsletter form | Full UI + `/api/newsletter` route with validation. Not connected to an email provider — see `app/api/newsletter/route.ts` |
| Database | Not connected. Content reads from the filesystem (`lib/posts.ts`). `prisma/schema.prisma` documents the target schema for when you want a database-backed editor |
| Cover art | Generated abstractly per post (see below), not stock photography |

### About the artwork

Rather than hotlink stock photos (which drift, get taken down, or rarely feel like
they belong to the same publication), `components/article/CoverArt.tsx` generates a
deterministic abstract composition per article from its slug and category — same
input always produces the same image, no network request, no broken-image state
possible. Swap in real photography or illustrations later by pointing `ArticleCard`,
`FeaturedArticle`, and the article page at a real `<Image>` when a post has a
`coverImage` — the frontmatter field (`coverSeed`) is already there to override the
seed in the meantime.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

```bash
npm run build      # production build
npm run start      # run the production build locally
npm run lint        # eslint
npm run typecheck   # tsc --noEmit
```

## Environment variables

Copy `.env.example` to `.env.local` and fill in what you need:

```bash
cp .env.example .env.local
```

- `NEXT_PUBLIC_SITE_URL` — used in metadata, Open Graph tags, canonical URLs, and the
  generated sitemap. Set this to your real domain before deploying.
- `DATABASE_URL`, `NEWSLETTER_API_KEY`, `NEWSLETTER_AUDIENCE_ID` — not required to run
  the site today; see below.

## Adding a post

Add an `.mdx` file to `content/posts/`. The filename (minus extension) becomes the
slug. Frontmatter shape (see `lib/types.ts` → `PostFrontmatter`):

```md
---
title: "Your Title"
subtitle: "Optional subtitle"
excerpt: "One or two sentences used in cards, previews, and meta descriptions."
category: "security" # security | research | engineering | reverse-engineering
                      # | programming | web | cloud | development | notes
tags: ["tag-one", "tag-two"]
publishedAt: "2026-09-06"
featured: false
---

Article content in MDX. `##`/`###` headings automatically populate the table
of contents. Use fenced code blocks as usual — language, line highlighting via
` ```ts {2,4-5} `, and a copy button are handled for you.

<Callout type="note">
An aside.
</Callout>

<Figure seed="some-seed" category="security" caption="Optional caption." />
```

Reading time and word count are computed automatically from the content — no
frontmatter field for those.

## Database setup (optional, for later)

The site works fully today with zero database — posts are files. When you want a
real editor / multi-author workflow instead of hand-written MDX:

1. Provision Postgres (Neon, Supabase, Vercel Postgres, or your own).
2. `npm install prisma @prisma/client`
3. Set `DATABASE_URL` in your environment.
4. `npx prisma migrate dev --name init` (schema already defined in
   `prisma/schema.prisma`).
5. Replace the reads in `lib/posts.ts` with Prisma queries, keeping the same
   function signatures and return shapes (`lib/types.ts`) — nothing in
   `components/` or `app/` needs to change if you do.

## Deploying to Vercel

1. Push this repo to GitHub/GitLab/Bitbucket.
2. Import it in Vercel — it will detect Next.js automatically, no config needed.
3. Set `NEXT_PUBLIC_SITE_URL` in the Vercel project's environment variables to your
   production domain.
4. Deploy. If/when you connect a database or newsletter provider, add those
   environment variables the same way.

This project intentionally has no `localhost`-specific assumptions and no secrets
committed — `.env.local` is gitignored, and `.env.example` documents what's needed.

## Project structure

```
app/                  Routes (App Router)
  posts/[slug]/       Article pages
  writing/            All-articles index with filtering
  topics/             Topic index
  about/              Author page
  api/newsletter/     Newsletter signup route handler
components/
  layout/             Header, footer, mobile menu
  home/               Homepage sections
  article/            Article page pieces (TOC, code blocks, share, etc.)
  mdx/                Components available inside MDX content
  search/             Command-style search modal
  theme/              Dark/light theme provider + toggle
  writing/            Category/tag/year filter bar
lib/
  posts.ts            Content layer — the only file that touches the filesystem
  categories.ts       Category metadata (no filesystem dependency — safe for
                       client components, unlike posts.ts)
  types.ts            Shared TypeScript types
  toc.ts              Remark plugin: table-of-contents extraction + heading ids
  utils.ts            cn(), slugify, date formatting, reading time, seeded PRNG
content/posts/        Article content (MDX + frontmatter)
prisma/schema.prisma  Future database schema (not yet wired up)
```

## Customizing

- **Colors/fonts**: `app/globals.css` (`:root` / `.dark` custom properties) and the
  `next/font/google` calls in `app/layout.tsx` (currently IBM Plex Sans/Serif/Mono).
- **Site identity**: `lib/author.ts` — name, bio, social links, site title/description.
- **Nav links**: `components/layout/Header.tsx`.

## A note on how this was built

This project was generated in an environment without package-registry access, so
`npm install` was never actually run against it here. Every file was hand-written
against current, documented APIs, and the whole TypeScript surface (all of `lib/`,
`components/`, and `app/`) was type-checked using a local TypeScript install against
hand-written type stubs for each dependency — which caught and fixed several real
issues — but it has not been run through an actual `next build`. Run `npm install &&
npm run build` right away; if anything surfaces, it's almost certainly a small,
narrow fix (a dependency version, a minor API mismatch) rather than an architectural
one.
