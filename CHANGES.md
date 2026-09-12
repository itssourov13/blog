# Changes in this pass

No new npm dependencies were added — everything below runs on what was
already in `package.json`. You still need to re-run `npm run build`,
`npm run typecheck`, and `npm run lint` locally (this environment has no
network access, so none of this was verified against the actual toolchain —
see "What I couldn't verify" at the bottom).

## Bug fixes

- **Search modal, mobile.** Input was 15px (triggers iOS Safari's
  auto-zoom-on-focus); now 16px. Top offset and result-list height now use
  `dvh` and a safe-area-aware offset instead of a flat `pt-24`/`60vh`, so the
  popup sits higher on small screens and results aren't hidden behind the
  keyboard.
- **Focus trap.** `SearchModal` and `MobileMenu` now share a new
  `components/ui/Modal.tsx` primitive: Tab is confined to the dialog,
  Escape closes it, focus returns to whatever opened it, and the rest of
  the page (`#page-shell`, wrapped in `app/layout.tsx`) is marked `inert`
  while either is open.
- **`RelatedArticles` grid** jumped to 3 columns at `sm` (640px) while every
  other 3-column grid in the app waits for `lg`. Now consistent.
- **Mobile TOC order.** The table-of-contents accordion no longer renders
  before the article body in DOM order on small screens.
- **Touch targets** for icon-only buttons (search, theme, menu) bumped from
  36px to 40px.
- **About page portrait** no longer stretches edge-to-edge on narrow phones.

## New features

- **Tags**: `/tags` and `/tags/[tag]` (statically generated). Tag pills on
  cards and post pages now link here instead of `/writing?tag=`.
- **RSS feed** at `/feed.xml`, linked from the footer and site metadata.
- **Favicon, Apple touch icon, and Open Graph images** — site-wide default
  plus a per-post dynamic OG image (title + category), all generated via
  `next/og`, no image assets required.
- **Breadcrumbs** + `BreadcrumbList` JSON-LD on post pages.
- **Back-to-top button** on post pages.
- **Optional comments** (`components/article/Comments.tsx`) via giscus —
  free, backed by GitHub Discussions, renders nothing until you set the
  `NEXT_PUBLIC_GISCUS_*` vars in `.env.example`.
- **Code block line highlighting** now actually works. The README always
  documented `` ```ts {2,4-5}` ``-style highlighting, but nothing carried
  the fence's meta string through to the renderer — `lib/remark-code-meta.ts`
  fixes that.
- **Print stylesheet** for articles: header/footer/nav/share/TOC/pager hide
  on print (`print:hidden`), body text forces to black-on-white.
- **Route-specific loading states** for `/posts/[slug]` and `/about`,
  replacing the one-size-fits-none global skeleton for those routes.
- MDX images now go through `next/image` for local paths (fixes
  layout-shift-on-load), falling back to a plain `<img>` for external URLs
  so an unconfigured remote domain can't throw at build time.

## Code quality

- `components/article/PostMeta.tsx` replaces four independent
  implementations of the "category · reading time · date" row
  (`ArticleCard`, `FeaturedArticle`, `SearchModal`, post header).
- `components/ui/Modal.tsx` replaces duplicated portal/focus/scroll-lock
  logic in `SearchModal` and `MobileMenu`.
- Newsletter error text now uses a dedicated `--color-danger` token instead
  of overloading `--color-accent` for both "brand emphasis" and "error".
- `CoverArt`'s decorative dot grid trimmed from 99 to 35 nodes per instance
  (a page can render a dozen of these).

## What I couldn't verify

I have no network access in this session, so none of this went through
`npm install`, `next build`, `tsc`, or `eslint` — please run those next.
The pieces most worth a close look if something doesn't compile:

- The Shiki `transformers` line-highlight hook in `CodeBlock.tsx` (relies on
  `this.addClassToHast` inside the transformer object — this is Shiki's
  documented API for v1.x, but I couldn't type-check it here).
- The `opengraph-image.tsx` files' async `params` signature — matches the
  `Promise<{ slug: string }>` pattern already used elsewhere in this repo
  for Next 15+/16, but double check against your installed Next version.
- `HTMLElement.inert` — set via `setAttribute`/`removeAttribute` rather than
  the typed boolean property, specifically to sidestep any TS lib-version
  mismatch.

Not done at all (flagging so it doesn't silently fall off): a real
newsletter provider integration, unit tests, and a CI workflow — all were
Low priority in the original audit's roadmap.

## Final polish pass

- Fixed a real naming collision in `MobileMenu.tsx`: a local
  `interface NavLink` and the imported `NavLink` component shared a name.
  Technically legal in TS (type space vs. value space don't collide) but
  not something to leave in the codebase — renamed the interface to
  `NavLinkItem`.
- Added `components/layout/NavLink.tsx` — the header/mobile-menu nav now
  highlights the current page (`aria-current="page"` + visual state) via
  `usePathname`, which was previously never implemented anywhere.
- Long post titles (several run 50–65 characters) no longer wrap awkwardly
  in the post-page breadcrumb; the current crumb truncates with an
  accessible `title` tooltip.
- `SearchModal`'s inline close button now matches the rounded/hover-bg
  treatment every other icon button in the header uses (it was a visual
  outlier — flat, no hover background).
- `ThemeToggle` had a pre-existing `duration-200` transition while every
  other interactive element in the app uses the Tailwind default 150ms —
  aligned it.
- `/tags` gets a defensive empty state (matches the pattern already used
  on `/writing`).
- `sitemap.ts` now includes `/tags` and every `/tags/[tag]` page — they're
  real statically-generated, indexable routes and were missing.
- `not-found.tsx` used `min-h-[60vh]`; switched to `min-h-[60dvh]` for the
  same mobile-viewport reason the search modal needed it.
