"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { NavLink } from "./NavLink";

interface NavLinkItem {
  href: string;
  label: string;
}

export function MobileMenu({ links }: { links: NavLinkItem[] }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-10 w-10 items-center justify-center rounded-full text-foreground/70 transition-colors hover:bg-muted hover:text-foreground md:hidden"
        aria-label="Open menu"
        aria-expanded={open}
      >
        <Menu className="h-[18px] w-[18px]" aria-hidden="true" />
      </button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        ariaLabel="Site menu"
        initialFocusSelector="[data-close-menu]"
        overlayClassName="fixed inset-0 z-[100] bg-background"
        panelClassName="flex h-full flex-col"
      >
        <div className="container-content flex h-16 shrink-0 items-center justify-between border-b border-border">
          <span className="font-serif text-lg font-semibold text-foreground">Menu</span>
          <button
            type="button"
            data-close-menu
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="flex h-10 w-10 items-center justify-center rounded-full text-foreground/70 hover:bg-muted hover:text-foreground"
          >
            <X className="h-[18px] w-[18px]" aria-hidden="true" />
          </button>
        </div>
        <nav className="container-content mt-8 flex flex-col gap-1" aria-label="Mobile">
          {links.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="border-b border-border py-4 font-serif text-2xl"
              activeClassName="text-accent"
              inactiveClassName="text-foreground"
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </Modal>
    </>
  );
}
