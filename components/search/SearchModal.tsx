"use client";

import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { PostMeta } from "@/components/article/PostMeta";
import { cn } from "@/lib/utils";
import type { SearchablePost } from "@/lib/types";

function isTypingInField(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return (
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.isContentEditable
  );
}

export function SearchModal({ posts }: { posts: SearchablePost[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    function handleKeydown(event: KeyboardEvent) {
      if (event.key === "/" && !open && !isTypingInField(event.target)) {
        event.preventDefault();
        setOpen(true);
      }
    }
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [open]);

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return posts
      .filter((post) => {
        const haystack = [post.title, post.excerpt, post.category, ...post.tags]
          .join(" ")
          .toLowerCase();
        return haystack.includes(q);
      })
      .slice(0, 8);
  }, [query, posts]);

  useEffect(() => {
    setActiveIndex(0);
  }, [results.length, query]);

  function handleInputKeydown(event: ReactKeyboardEvent<HTMLInputElement>) {
    if (results.length === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % results.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => (index - 1 + results.length) % results.length);
    } else if (event.key === "Enter") {
      const target = results[activeIndex];
      if (target) {
        event.preventDefault();
        setOpen(false);
        router.push(`/posts/${target.slug}`);
      }
    }
  }

  const showEmptyState = query.trim() !== "" && results.length === 0;
  const showPrompt = query.trim() === "";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-10 min-w-10 items-center justify-center gap-2 rounded-full px-2.5 text-foreground/70 transition-colors hover:bg-muted hover:text-foreground"
        aria-label="Search articles"
      >
        <Search className="h-[18px] w-[18px]" aria-hidden="true" />
        <kbd className="hidden rounded border border-border px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground md:inline-block">
          /
        </kbd>
      </button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        ariaLabel="Search articles"
        initialFocusSelector="input"
        overlayClassName="fixed inset-0 z-[100] flex items-start justify-center bg-background/80 px-4 pb-4 backdrop-blur-sm pt-[max(4.5rem,calc(env(safe-area-inset-top)+3.5rem))] sm:pt-24"
        panelClassName="w-full max-w-xl overflow-hidden rounded-md border border-border bg-surface shadow-xl"
      >
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          <input
            type="text"
            value={query}
            onChange={(event: ChangeEvent<HTMLInputElement>) => setQuery(event.target.value)}
            onKeyDown={handleInputKeydown}
            placeholder="Search articles…"
            aria-label="Search articles"
            role="combobox"
            aria-expanded={results.length > 0}
            aria-controls="search-results-list"
            aria-activedescendant={
              results[activeIndex] ? `search-result-${results[activeIndex].slug}` : undefined
            }
            autoComplete="off"
            className="w-full bg-transparent text-base text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close search"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <p className="sr-only" role="status" aria-live="polite">
          {showPrompt ? "" : `${results.length} result${results.length === 1 ? "" : "s"} found`}
        </p>

        <div
          id="search-results-list"
          role="listbox"
          aria-label="Search results"
          className="max-h-[55dvh] overflow-y-auto sm:max-h-[60dvh]"
        >
          {showPrompt && (
            <p className="px-4 py-10 text-center text-sm text-muted-foreground">
              Start typing to search titles, excerpts, and tags.
            </p>
          )}

          {showEmptyState && (
            <p className="px-4 py-10 text-center text-sm text-muted-foreground">
              No articles match &ldquo;{query}&rdquo;.
            </p>
          )}

          {results.map((post, index) => (
            <Link
              key={post.slug}
              id={`search-result-${post.slug}`}
              role="option"
              aria-selected={index === activeIndex}
              href={`/posts/${post.slug}`}
              onClick={() => setOpen(false)}
              onMouseEnter={() => setActiveIndex(index)}
              className={cn(
                "block border-b border-border px-4 py-3 last:border-none",
                index === activeIndex ? "bg-muted" : "hover:bg-muted"
              )}
            >
              <PostMeta
                variant="card"
                size="xs"
                category={post.category}
                readingTime={post.readingTime}
                publishedAt={post.publishedAt}
              />
              <p className="mt-1 font-serif text-base text-foreground">{post.title}</p>
            </Link>
          ))}
        </div>
      </Modal>
    </>
  );
}
