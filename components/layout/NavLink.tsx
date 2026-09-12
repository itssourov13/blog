"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type NavLinkProps = ComponentProps<typeof Link> & {
  activeClassName?: string;
  inactiveClassName?: string;
};

/**
 * Wraps next/link with aria-current + a visual state for the current route.
 * Exact match on "/", otherwise matches the segment and anything nested
 * under it (e.g. "/writing" stays active on "/writing?tag=rust").
 */
export function NavLink({
  href,
  className,
  activeClassName = "text-foreground",
  inactiveClassName = "text-foreground/80 hover:text-foreground",
  ...props
}: NavLinkProps) {
  const pathname = usePathname();
  const target = href.toString();
  const isActive = target === "/" ? pathname === "/" : pathname.startsWith(target);

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={cn(className, isActive ? activeClassName : inactiveClassName)}
      {...props}
    />
  );
}
