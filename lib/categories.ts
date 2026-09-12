import type { Category, CategoryMeta } from "./types";

export const CATEGORIES: CategoryMeta[] = [
  { slug: "security", name: "Security", description: "Vulnerabilities, threat models, and defensive engineering." },
  { slug: "research", name: "Research", description: "Longer investigations and write-ups from ongoing work." },
  { slug: "engineering", name: "Engineering", description: "Systems, architecture, and the tradeoffs behind them." },
  { slug: "reverse-engineering", name: "Reverse Engineering", description: "Taking binaries and protocols apart to see how they work." },
  { slug: "programming", name: "Programming", description: "Languages, tooling, and the craft of writing software." },
  { slug: "web", name: "Web", description: "Browsers, the web platform, and the modern attack surface." },
  { slug: "cloud", name: "Cloud", description: "Infrastructure, deployment, and distributed systems." },
  { slug: "development", name: "Development", description: "Process, workflow, and building things end to end." },
  { slug: "notes", name: "Notes", description: "Shorter observations that didn't need a full write-up." },
];

export function getCategoryName(slug: Category): string {
  return CATEGORIES.find((c) => c.slug === slug)?.name ?? slug;
}
