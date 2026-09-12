"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setVisible(window.scrollY > 800);
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className="fixed bottom-6 right-6 z-30 flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface text-foreground shadow-lg transition-colors hover:border-accent hover:text-accent print:hidden"
    >
      <ArrowUp className="h-5 w-5" aria-hidden="true" />
    </button>
  );
}
