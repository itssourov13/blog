"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

const REPO = process.env.NEXT_PUBLIC_GISCUS_REPO;
const REPO_ID = process.env.NEXT_PUBLIC_GISCUS_REPO_ID;
const CATEGORY = process.env.NEXT_PUBLIC_GISCUS_CATEGORY;
const CATEGORY_ID = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID;

const configured = Boolean(REPO && REPO_ID && CATEGORY && CATEGORY_ID);

/**
 * Discussion thread powered by giscus (https://giscus.app), backed by GitHub
 * Discussions on the blog's own repo — no database or backend required.
 * Renders nothing until the NEXT_PUBLIC_GISCUS_* env vars are set (see
 * .env.example), so it's safe to ship even before comments are configured.
 */
export function Comments() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (!configured || !containerRef.current) return;
    containerRef.current.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.async = true;
    script.crossOrigin = "anonymous";
    script.setAttribute("data-repo", REPO as string);
    script.setAttribute("data-repo-id", REPO_ID as string);
    script.setAttribute("data-category", CATEGORY as string);
    script.setAttribute("data-category-id", CATEGORY_ID as string);
    script.setAttribute("data-mapping", "pathname");
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "bottom");
    script.setAttribute("data-theme", resolvedTheme === "dark" ? "dark_dimmed" : "light");
    script.setAttribute("data-lang", "en");

    containerRef.current.appendChild(script);
  }, [resolvedTheme]);

  if (!configured) return null;

  return (
    <section className="border-t border-border py-16">
      <h2 className="mb-8 font-serif text-2xl font-medium text-foreground">Discussion</h2>
      <div ref={containerRef} />
    </section>
  );
}
