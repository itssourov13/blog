import type { ReactElement } from "react";
import { codeToHtml } from "shiki";
import { CopyButton } from "./CopyButton";

interface CodeElementProps {
  className?: string;
  children?: unknown;
  "data-meta"?: string;
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Parses a fence's `{2,4-5}` style meta string into the set of 1-indexed
 * line numbers it names, so they can be highlighted.
 */
function parseHighlightedLines(meta: string | undefined): Set<number> {
  const lines = new Set<number>();
  const match = /\{([\d,\s-]+)\}/.exec(meta ?? "");
  if (!match) return lines;

  for (const part of match[1].split(",")) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    const range = /^(\d+)-(\d+)$/.exec(trimmed);
    if (range) {
      const start = Number(range[1]);
      const end = Number(range[2]);
      for (let line = start; line <= end; line++) lines.add(line);
    } else {
      const line = Number(trimmed);
      if (!Number.isNaN(line)) lines.add(line);
    }
  }

  return lines;
}

/**
 * Overrides the `pre` element in the MDX components map. Markdown turns a
 * fenced code block into `<pre><code class="language-x" data-meta="...">...
 * </code></pre>` (the `data-meta` attribute is added by `remarkCodeMeta`,
 * carrying through the `{2,4-5}` after the language on the opening fence).
 * We read the language and any highlighted-line ranges off that element,
 * then highlight server-side with Shiki so no highlighter ships to the
 * client.
 */
export async function CodeBlock(props: { children?: ReactElement<CodeElementProps> }) {
  const codeElement = props.children;
  const className = codeElement?.props?.className ?? "";
  const languageMatch = /language-(\w+)/.exec(className);
  const language = languageMatch?.[1] ?? "text";
  const rawCode = String(codeElement?.props?.children ?? "").replace(/\n$/, "");
  const highlightedLines = parseHighlightedLines(codeElement?.props?.["data-meta"]);

  let html: string;
  try {
    html = await codeToHtml(rawCode, {
      lang: language,
      theme: "github-dark-dimmed",
      transformers: [
        {
          line(node, line) {
            if (highlightedLines.has(line)) {
              this.addClassToHast(node, "highlighted-line");
            }
          },
        },
      ],
    });
  } catch {
    // Unrecognized language or highlighter failure — degrade to plain,
    // unhighlighted code rather than breaking the whole article page.
    html = `<pre><code>${escapeHtml(rawCode)}</code></pre>`;
  }

  return (
    <div className="not-prose my-8 overflow-hidden rounded-md border border-code-border bg-code-bg">
      <div className="flex items-center justify-between border-b border-code-border px-4 py-2">
        <span className="font-mono text-xs uppercase tracking-wide text-white/40">
          {language}
        </span>
        <CopyButton code={rawCode} />
      </div>
      <div
        className="overflow-x-auto text-[13px] leading-relaxed [&_pre]:!m-0 [&_pre]:!bg-transparent [&_pre]:px-4 [&_pre]:py-4 [&_.line]:block [&_.line]:px-4 [&_.line]:-mx-4 [&_.highlighted-line]:!bg-accent/10 [&_.highlighted-line]:border-l-2 [&_.highlighted-line]:border-accent [&_.highlighted-line]:pl-[14px]"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
