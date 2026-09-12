import type { Author } from "./types";

export const author: Author = {
  name: "Sourov",
  role: "Cybersecurity researcher & engineer",
  bio: "I work on security research, software engineering, and reverse engineering, and write here about what I learn building and breaking systems.",
  github: "https://github.com/",
  linkedin: "https://linkedin.com/in/",
  website: "https://example.com",
};

export const site = {
  name: author.name,
  title: `${author.name} — Security & Engineering Notes`,
  description:
    "Technical research, engineering experiments, reverse engineering notes, and lessons learned while building systems.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
};
