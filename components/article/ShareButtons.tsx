"use client";

import { useEffect, useState } from "react";
import { Check, Link as LinkIcon, Mail, Share2 } from "lucide-react";

export function ShareButtons({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);

  useEffect(() => {
    setCanNativeShare(typeof navigator !== "undefined" && typeof navigator.share === "function");
  }, []);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard API unavailable — nothing to recover from here.
    }
  }

  async function handleNativeShare() {
    try {
      await navigator.share({ title, url });
    } catch {
      // User cancelled the share sheet — not an error.
    }
  }

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground print:hidden">
      <button
        type="button"
        onClick={handleCopy}
        className="link-underline flex items-center gap-1.5 hover:text-foreground"
      >
        {copied ? <Check className="h-3.5 w-3.5" /> : <LinkIcon className="h-3.5 w-3.5" />}
        {copied ? "Copied" : "Copy link"}
      </button>

      <a
        href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        className="link-underline hover:text-foreground"
      >
        X
      </a>

      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="link-underline hover:text-foreground"
      >
        LinkedIn
      </a>

      <a
        href={`mailto:?subject=${encodedTitle}&body=${encodedUrl}`}
        className="link-underline flex items-center gap-1.5 hover:text-foreground"
      >
        <Mail className="h-3.5 w-3.5" />
        Email
      </a>

      {canNativeShare && (
        <button
          type="button"
          onClick={handleNativeShare}
          className="link-underline flex items-center gap-1.5 hover:text-foreground md:hidden"
        >
          <Share2 className="h-3.5 w-3.5" />
          Share
        </button>
      )}
    </div>
  );
}
