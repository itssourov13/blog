import { visit } from "unist-util-visit";
import { toString } from "mdast-util-to-string";
import { slugify } from "./utils";
import type { TocItem } from "./types";

/**
 * A remark "attacher": unified calls `remarkToc(tocOutput)` once to get a
 * transformer, then runs that transformer on the syntax tree for every
 * document. We use `tocOutput` as a side channel — since MDXRemote/
 * compileMDX doesn't otherwise expose the tree — to report the headings
 * found back to the caller.
 *
 * Usage:
 *   const tocOutput: { items: TocItem[] } = { items: [] };
 *   await compileMDX({
 *     source,
 *     options: { mdxOptions: { remarkPlugins: [[remarkToc, tocOutput]] } },
 *   });
 *   // tocOutput.items is now populated
 *
 * Note the tuple form `[remarkToc, tocOutput]` — passing `remarkToc(tocOutput)`
 * directly would invoke the attacher too early and break the pipeline.
 *
 * Heading ids are assigned here (via `hProperties`) rather than through a
 * separate slug plugin, so the ids in the table of contents are always in
 * sync with the ids actually rendered on the `<h2>`/`<h3>` elements.
 */
export function remarkToc(tocOutput: { items: TocItem[] }) {
  return function transformer(tree: unknown) {
    const items: TocItem[] = [];
    const seen = new Map<string, number>();

    visit(tree as never, "heading", (node: any) => {
      if (node.depth !== 2 && node.depth !== 3) return;

      const text = toString(node);
      if (!text) return;

      let id = slugify(text);
      const priorCount = seen.get(id) ?? 0;
      seen.set(id, priorCount + 1);
      if (priorCount > 0) id = `${id}-${priorCount}`;

      node.data = node.data || {};
      node.data.hProperties = { ...(node.data.hProperties || {}), id };

      items.push({ id, text, level: node.depth as 2 | 3 });
    });

    tocOutput.items = items;
  };
}
