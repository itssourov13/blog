"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  /** className for the full-viewport overlay wrapper. Clicking it closes the modal. */
  overlayClassName?: string;
  /** className for the dialog panel itself. */
  panelClassName?: string;
  ariaLabel?: string;
  /** CSS selector (scoped to the panel) for the element to focus on open, e.g. "input". Falls back to the first focusable element. */
  initialFocusSelector?: string;
}

/**
 * Shared dialog primitive used by the search modal and the mobile menu.
 *
 * Handles the mechanics that are easy to get wrong (and were previously
 * duplicated, inconsistently, in both call sites): portal mounting, Escape
 * to close, a Tab focus trap confined to the panel, returning focus to
 * whatever triggered the modal on close, locking body scroll, and marking
 * the rest of the page `inert` so keyboard/AT users can't reach content
 * behind the dialog.
 */
export function Modal({
  open,
  onClose,
  children,
  overlayClassName = "",
  panelClassName = "",
  ariaLabel,
  initialFocusSelector,
}: ModalProps) {
  const [mounted, setMounted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;

    previouslyFocused.current = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";

    const pageShell = document.getElementById("page-shell");
    pageShell?.setAttribute("inert", "");

    const toFocus =
      (initialFocusSelector &&
        panelRef.current?.querySelector<HTMLElement>(initialFocusSelector)) ||
      panelRef.current?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
    toFocus?.focus();

    function handleKeydown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) return;

      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeydown);

    return () => {
      document.removeEventListener("keydown", handleKeydown);
      document.body.style.overflow = "";
      pageShell?.removeAttribute("inert");
      previouslyFocused.current?.focus();
    };
  }, [open, onClose, initialFocusSelector]);

  if (!mounted || !open) return null;

  return createPortal(
    <div className={overlayClassName} onClick={onClose}>
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        className={panelClassName}
        onClick={(event) => event.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}
