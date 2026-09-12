import Link from "next/link";
import { Github, Linkedin, Globe, Rss } from "lucide-react";
import { author, site } from "@/lib/author";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border print:hidden">
      <div className="container-content grid gap-10 py-14 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <p className="font-serif text-lg font-semibold text-foreground">{site.name}</p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
            {site.description}
          </p>
        </div>

        <div>
          <p className="text-sm font-medium text-foreground">Site</p>
          <nav className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground">
            <Link href="/writing" className="hover:text-foreground">Writing</Link>
            <Link href="/topics" className="hover:text-foreground">Topics</Link>
            <Link href="/tags" className="hover:text-foreground">Tags</Link>
            <Link href="/about" className="hover:text-foreground">About</Link>
            <a href="/feed.xml" className="flex items-center gap-2 hover:text-foreground">
              <Rss className="h-3.5 w-3.5" aria-hidden="true" /> RSS feed
            </a>
          </nav>
        </div>

        <div>
          <p className="text-sm font-medium text-foreground">Elsewhere</p>
          <div className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground">
            {author.github && (
              <a href={author.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-foreground">
                <Github className="h-4 w-4" /> GitHub
              </a>
            )}
            {author.linkedin && (
              <a href={author.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-foreground">
                <Linkedin className="h-4 w-4" /> LinkedIn
              </a>
            )}
            {author.website && (
              <a href={author.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-foreground">
                <Globe className="h-4 w-4" /> Portfolio
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-border py-6">
        <p className="container-content text-xs text-muted-foreground">
          © {year} {site.name}. Built with Next.js.
        </p>
      </div>
    </footer>
  );
}
