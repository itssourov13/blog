import { visit } from "unist-util-visit";

interface CodeNode {
  type: "code";
  meta?: string | null;
  data?: { hProperties?: Record<string, unknown> };
}

/**
 * A fenced code block's meta string — the text after the language on the
 * opening fence, e.g. the `{2,4-5}` in ```ts {2,4-5}` — is parsed by remark
 * but dropped by the default mdast-to-hast conversion; nothing carries it
 * through to the rendered `<code>` element.
 *
 * This plugin copies it onto the node's `data-meta` attribute so
 * `components/article/CodeBlock.tsx` can read it back off `props` and
 * highlight the requested lines.
 */
export function remarkCodeMeta() {
  return function transformer(tree: unknown) {
    visit(tree as never, "code", (node: CodeNode) => {
      if (!node.meta) return;
      node.data = node.data ?? {};
      node.data.hProperties = {
        ...node.data.hProperties,
        "data-meta": node.meta,
      };
    });
  };
}
