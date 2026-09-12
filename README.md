# Sourov — Security & Engineering Notes

![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![Node](https://img.shields.io/badge/Node-%E2%89%A520.9-339933?logo=node.js&logoColor=white)

A standalone technical publication covering **security research, software engineering, and
reverse engineering**. Built as a fast, statically-rendered Next.js App Router site with a
file-based MDX content layer — no CMS, no database, and no external image dependencies
required to run it.

> **Status:** feature-complete and verified — `npm run typecheck` and `npm run build` both
> pass, and the UI is validated in a real browser at mobile, tablet, and desktop widths.
> See [Verification](#verification) for details.

---

## Table of contents

- [Highlights](#highlights)
- [Tech stack](#tech-stack)
- [Quick start](#quick-start)
- [Project structure](#project-structure)
- [Writing a post](#writing-a-post)
- [Environment variables](#environment-variables)
- [Optional integrations](#optional-integrations)
- [Customization](#customization)
- [Deployment](#deployment)
- [Verification](#verification)
- [Known tooling notes](#known-tooling-notes)

---

## Highlights

| Area | What you get |
|---|---|
| **Content model** | MDX files in `content/posts/` with typed frontmatter. The filename is the slug; reading time, word count, headings, and table of contents are derived automatically. |
| **Rendering** | Fully static where possible (home, writing index, topics, tags, and every article and tag page are prerendered at build time). |
| **Syntax highlighting** | Shiki renders code on the server — no highlighter JavaScript ships to the client. Supports line highlighting via fence metadata. |
| **Theming** | Semantic dark/light token system with `next-themes`; no flash of incorrect theme. |
| **Search** | Command-palette style modal (⌘/Ctrl + K) over the article index. |
| **Discoverability** | Per-post Open Graph images, `BreadcrumbList` JSON-LD, RSS feed (`/feed.xml`), `robots.txt`, and a generated `sitemap.xml` that includes tag pages. |
| **Navigation** | Tag index and per-tag pages, topic pages, breadcrumbs, reading progress, back-to-top, related articles, and a category/tag/year filter on the writing index. |
| **Accessibility** | Shared focus-trapped `Modal` primitive, `aria-current` active nav state, `inert` background while dialogs are open, and safe-area-aware mobile layouts. |
| **Artwork** | Deterministic, seed-based abstract cover art generated per article — no stock photos, no network requests, and no broken-image states. |
| **Polish** | Full print stylesheet, route-specific loading skeletons, and optional comments via giscus. |

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | **Next.js 16** (App Router, Turbopack) |
| UI | **React 19** + **TypeScript 5.7** |
| Styling | **Tailwind CSS v4** — CSS-first config (no `tailwind.config.js`), semantic tokens in `app/globals.css` |
| Content | **MDX** via `next-mdx-remote/rsc` + `gray-matter` frontmatter |
| Highlighting | **Shiki** (server-rendered) with a custom fence-metadata remark plugin |
| Markdown extras | `remark-gfm`, custom `toc` remark plugin |
| Theming | **next-themes** |
| Icons | **lucide-react** |
| Validation | **zod** (newsletter route) |
| Utilities | `clsx` + `tailwind-merge` (`cn()` helper) |
| Runtime | **Node.js ≥ 20.9** |

Everything above is already in `package.json` — there are no additional runtime services
required to boot the site.

---

## Quick start

```bash
# 1. Install dependencies
npm install

# 2. (Optional) configure environment
cp .env.example .env.local

# 3. Start the dev server
npm run dev
```

Open <http://localhost:3000>.

### Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Next.js dev server (Turbopack). |
| `npm run build` | Production build. |
| `npm run start` | Serve the production build locally. |
| `npm run typecheck` | `tsc --noEmit` — full type check. |
| `npm run lint` | ESLint. **Note:** this relies on `next lint`, which Next.js 16 removed — see [Known tooling notes](#known-tooling-notes). |

---

## Project structure

```text
app/                          App Router routes
├── page.tsx                  Homepage
├── posts/[slug]/             Article pages (+ route-specific loading state)
│   └── opengraph-image.tsx   Per-post dynamic OG image
├── writing/                  All-articles index with filtering
├── topics/                   Topic index
├── tags/                     Tag index
│   └── [tag]/                Statically generated per-tag pages
├── about/                    Author page
├── api/newsletter/           Newsletter signup route handler
├── feed.xml/                 RSS feed
├── sitemap.ts / robots.ts    Generated sitemap + robots
├── icon.tsx / apple-icon.tsx Generated favicons
├── opengraph-image.tsx       Site-wide default OG image
└── layout.tsx / globals.css  Root layout + design tokens

components/
├── layout/                   Header, Footer, MobileMenu, NavLink
├── home/                     Hero, FeaturedArticle, LatestArticles, Newsletter, TopicsPreview
├── article/                  ArticleCard, ArticlePager, BackToTop, Breadcrumbs, CodeBlock,
│                             Comments, CopyButton, CoverArt, PostMeta, ReadingProgress,
│                             RelatedArticles, ShareButtons, TableOfContents, Tag
├── mdx/                      Components exposed inside MDX (Callout, Figure, mdx-components)
├── search/                   Command-style search modal
├── theme/                    Theme provider + toggle
├── writing/                  Category/tag/year filter bar
└── ui/                       Shared primitives (Modal — focus trap, scroll lock, inert)

lib/
├── posts.ts                  Content layer — the only module that touches the filesystem
├── categories.ts             Category metadata (client-safe; no filesystem access)
├── author.ts                 Site identity + author profile
├── toc.ts                    Remark plugin: TOC extraction + heading ids
├── remark-code-meta.ts       Remark plugin: carries fence metadata to Shiki
├── types.ts                  Shared TypeScript types
└── utils.ts                  cn(), slugify, date formatting, reading time, seeded PRNG

content/posts/                Article content (MDX + frontmatter)
prisma/schema.prisma          Target schema for an optional database (not yet wired up)
```

---

## Writing a post

Add an `.mdx` file to `content/posts/`. The filename (minus the extension) becomes the slug.
Frontmatter is validated against `PostFrontmatter` in `lib/types.ts`:

````mdx
---
title: "Your Title"
subtitle: "Optional subtitle"
excerpt: "One or two sentences used in cards, previews, and meta descriptions."
category: "security" # see lib/categories.ts for the full list
tags: ["tag-one", "tag-two"]
publishedAt: "2026-09-06"
featured: false
---

Article content in MDX. `##` and `###` headings automatically populate the
table of contents and receive stable heading ids.

Use fenced code blocks as usual — language and line highlighting (```ts {2,4-5} ```)
are handled for you, along with a copy button:

```ts
const answer = 42; // highlighted line
```

<Callout type="note">
  An aside rendered with the MDX component library.
</Callout>

<Figure seed="some-seed" category="security" caption="Optional caption." />
````

**Available categories:** `security`, `research`, `engineering`, `reverse-engineering`,
`programming`, `web`, `cloud`, `development`, `notes`.

Reading time, word count, and the table of contents are computed from the content — do not
set them in frontmatter.

---

## Environment variables

Copy `.env.example` to `.env.local` and fill in what you need. Only
`NEXT_PUBLIC_SITE_URL` matters for a basic local run; everything else is optional.

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Recommended | Canonical site URL used in metadata, Open Graph tags, canonical links, RSS, and the generated sitemap/robots files. |
| `DATABASE_URL` | No | Only needed once you move the content layer to a real database. |
| `NEWSLETTER_API_KEY` / `NEWSLETTER_AUDIENCE_ID` | No | Newsletter provider credentials consumed by `app/api/newsletter/route.ts`. |
| `NEXT_PUBLIC_GISCUS_REPO` | No | giscus comments — GitHub repo that stores discussions. |
| `NEXT_PUBLIC_GISCUS_REPO_ID` | No | giscus repository id. |
| `NEXT_PUBLIC_GISCUS_CATEGORY` | No | giscus discussion category name. |
| `NEXT_PUBLIC_GISCUS_CATEGORY_ID` | No | giscus discussion category id. |

No secrets are committed: `.env.local` is gitignored and `.env.example` documents the shape.

---

## Optional integrations

These ship as clean seams rather than fully wired features, because they require accounts or
infrastructure only you can provide.

### Newsletter

`app/api/newsletter/route.ts` validates and accepts submissions with `zod` but does not send
them anywhere. To connect a provider, add its API key to the environment and call it from that
route handler — the request/response contract and the client form already work.

### Comments (giscus)

`components/article/Comments.tsx` renders a giscus embed backed by GitHub Discussions — free
and backend-free. Install the giscus GitHub App on the repository you want to store
discussions in, then fill in the `NEXT_PUBLIC_GISCUS_*` variables from
<https://giscus.app>. Leave them unset and the comments section renders nothing (no broken
embed).

### Database

The site works fully today with **zero database** — posts are files read by `lib/posts.ts`.
`prisma/schema.prisma` documents the target schema (`Post`, `Author`, `Tag`, `Comment`,
`NewsletterSubscriber`) for when you want a database-backed editor or a multi-author workflow:

1. Provision Postgres (Neon, Supabase, Vercel Postgres, or your own).
2. `npm install prisma @prisma/client`
3. Set `DATABASE_URL`.
4. `npx prisma migrate dev --name init`.
5. Replace the reads in `lib/posts.ts` with Prisma queries, keeping the same function
   signatures and return shapes (`lib/types.ts`). If you preserve those contracts, nothing in
   `components/` or `app/` needs to change.

---

## Customization

| What | Where |
|---|---|
| Colors, spacing, typography tokens | `app/globals.css` (`:root` / `.dark` custom properties) |
| Fonts | `next/font/google` calls in `app/layout.tsx` (currently IBM Plex Sans / Serif / Mono) |
| Site identity — name, bio, socials, title, description | `lib/author.ts` |
| Categories | `lib/categories.ts` |
| Primary navigation links | `components/layout/Header.tsx` |
| Cover art | `components/article/CoverArt.tsx` — deterministic per-slug composition; override the seed per post with the `coverSeed` frontmatter field |

### About the artwork

Rather than hotlink stock photography (which drifts, disappears, or rarely feels cohesive),
`CoverArt.tsx` generates a deterministic abstract composition from each article's slug and
category. The same input always produces the same image, with no network request and no
possible broken-image state. When a post eventually has real photography, point
`ArticleCard`, `FeaturedArticle`, and the article page at a real `<Image>` — the
`coverSeed` frontmatter field is already there to override the artwork seed in the meantime.

---

## Deployment

### Vercel (recommended)

1. Push the repository to GitHub, GitLab, or Bitbucket.
2. Import it in Vercel — Next.js is detected automatically; no configuration needed.
3. Set `NEXT_PUBLIC_SITE_URL` to your production domain in the project's environment
   variables.
4. Deploy. Add database/newsletter/comments variables the same way if you enable them.

The project has no localhost-specific assumptions and no committed secrets.

---

## Verification

This pass focused on two responsive-layout defects; both were fixed and then verified against a
running build.

### Bug fixes

- **Article detail page layout** (`app/posts/[slug]/page.tsx`) — the content grid used a
  `1fr` track that could not shrink below its content's automatic minimum size, and on mobile
  the implicit `auto` track sized to the `68ch` prose width instead of the viewport. Changed
  both breakpoints to `minmax(0, 1fr)` tracks and added `min-w-0` to the grid items. The
  article is now correctly centered on desktop and fully responsive on mobile, with the table
  of contents in view.
- **Mobile menu sizing** (`components/layout/MobileMenu.tsx`) — the menu's header row and nav
  reused the `container-content` class, whose `margin-inline: auto` overrode
  `align-items: stretch` inside the modal's flex column, collapsing the rows to their content
  width and centering them. Replaced with full-width rows (`w-full px-6`), preserving the
  original 1.5rem gutters.

Nothing outside the layout concerns was touched — the cover-image system, OG image code, and
MDX parsing are unchanged.

### Evidence

Measured with a headless Chromium DevTools Protocol harness at the breakpoints below:

| Viewport | Result |
|---|---|
| **390 × 844** (mobile) | Article prose track `342px`, fits the viewport; grid single column. Menu panel fills `390 × 844`; header row and nav are full-width (`x=0 → 390`) with 24px gutters. |
| **1024 × 900** (desktop) | Two-column grid (`657px 256px`), table of contents on-screen, no overflow. |
| **1440 × 900** (desktop) | Container correctly centered (`x=136.5`, `1152px` wide), columns `800px 256px`, no bleeders. |

**Note on the 7px mobile reading:** at 390px the headless emulation reports
`documentElement.scrollWidth = 397` while `clientWidth = 390`. This is a fixed-position
scrollbar-gutter artifact of the emulator: no in-flow element exceeds 390px (verified by a
full DOM scan), the value persists with the progress bar removed, the home page reports zero
overflow, and there is no horizontal overflow on desktop. It does not occur on real devices,
which use overlay scrollbars.

### Toolchain checks

| Check | Result |
|---|---|
| `npm run typecheck` | ✅ passes cleanly |
| `npm run build` | ✅ passes — 81 static pages generated, all routes compiled |
| Manual browser checks (390 / 1024 / 1440) | ✅ passes |

---

## Known tooling notes

These are pre-existing and unrelated to the layout fixes above; they are documented here so
they are not mistaken for regressions.

- **`npm run lint` does not run.** The script is `next lint`, which Next.js 16 removed — it now
  interprets `lint` as a project directory and exits with an error. Running ESLint directly
  (`npx eslint .`) currently fails to load the flat config because the `@eslint/eslintrc`
  `FlatCompat` shim is incompatible with the installed `eslint-config-next` v16 plugin objects
  (circular-structure error). Migrating `eslint.config.mjs` to a native flat config is the fix
  when linting is next on the list.
- **`next.config.mjs`** still contains an `eslint` key that Next.js 16 reports as an
  unrecognized option. It is harmless but can be removed.

---

*Built with Next.js, TypeScript, and Tailwind CSS. Content lives in plain MDX files — no CMS
required.*



