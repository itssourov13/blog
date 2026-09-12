import Link from "next/link";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { SearchModal } from "@/components/search/SearchModal";
import { NavLink } from "./NavLink";
import { MobileMenu } from "./MobileMenu";
import type { SearchablePost } from "@/lib/types";
import { site } from "@/lib/author";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/writing", label: "Writing" },
  { href: "/topics", label: "Topics" },
  { href: "/about", label: "About" },
];

export function Header({ posts }: { posts: SearchablePost[] }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md print:hidden">
      <div className="container-content flex h-16 items-center justify-between">
        <Link href="/" className="font-serif text-lg font-semibold tracking-tight text-foreground">
          {site.name}
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              className="link-underline text-sm"
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <SearchModal posts={posts} />
          <ThemeToggle />
          <div className="md:hidden">
            <MobileMenu links={NAV_LINKS} />
          </div>
        </div>
      </div>
    </header>
  );
}
