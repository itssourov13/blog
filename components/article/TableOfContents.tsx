"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { TocItem } from "@/lib/types";
import { cn } from "@/lib/utils";

export function TableOfContents({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length > 0) {
          const topMost = visible.reduce((a, b) =>
            a.boundingClientRect.top < b.boundingClientRect.top ? a : b
          );
          setActiveId(topMost.target.id);
        }
      },
      { rootMargin: "-96px 0px -70% 0px", threshold: 0 }
    );

    for (const item of items) {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  const list = (
    <ul className="space-y-3 text-sm">
      {items.map((item) => (
        <li key={item.id} className={item.level === 3 ? "pl-4" : undefined}>
          <a
            href={`#${item.id}`}
            onClick={() => setMobileOpen(false)}
            className={cn(
              "block border-l-2 py-0.5 pl-3 transition-colors duration-150",
              activeId === item.id
                ? "border-accent text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {item.text}
          </a>
        </li>
      ))}
    </ul>
  );

  return (
    <>
      <nav aria-label="Table of contents" className="hidden lg:sticky lg:top-24 lg:block">
        <p className="mb-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          On this page
        </p>
        {list}
      </nav>

      <div className="mb-8 border-b border-t border-border lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen((value) => !value)}
          className="flex w-full items-center justify-between py-3 text-sm font-medium text-foreground"
          aria-expanded={mobileOpen}
        >
          On this page
          <ChevronDown
            className={cn("h-4 w-4 transition-transform duration-200", mobileOpen && "rotate-180")}
          />
        </button>
        {mobileOpen && <div className="pb-4">{list}</div>}
      </div>
    </>
  );
}
