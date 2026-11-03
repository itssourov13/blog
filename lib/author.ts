import type { Author } from "./types";

export const author: Author = {
  name: "Sourov",
  role: "Cybersecurity researcher & engineer",
  bio: "I work in cybersecurity and software engineering. This is where I document what I learn, build, explore, and experience — from technical research to everyday moments, personal reflections, and community work.",
  github: "https://github.com/itssourov13",
  linkedin: "https://www.linkedin.com/in/itssourov13",
  website: "https://portfolio-itssourov13.vercel.app/",
};

export const site = {
  name: author.name,
  title: `${author.name} — Technology, Life & Community`,
  description:
    "A personal blog about cybersecurity, software engineering, everyday experiences, personal reflections, and community work.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
};
