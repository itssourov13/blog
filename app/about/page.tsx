import type { Metadata } from "next";
import Image from "next/image";
import { Github, Globe, Linkedin } from "lucide-react";
import { author, site } from "@/lib/author";

export const metadata: Metadata = {
  title: "About",
  description: author.bio,
};

export default function AboutPage() {
  return (
    <div className="container-content grid gap-12 py-16 md:grid-cols-[1fr_1.3fr] md:items-start md:py-24">
      <div className="relative mx-auto aspect-square w-48 overflow-hidden rounded-full sm:w-56 md:mx-0 md:w-full">
        <Image
          src="/covers/profile.png"
          alt={author.name}
          fill
          priority
          sizes="(max-width: 768px) 192px, 400px"
          className="object-cover"
        />
      </div>

      <div>
        <h1 className="font-serif text-4xl font-medium text-foreground md:text-5xl">
          {author.name}
        </h1>
        <p className="mt-3 text-lg text-accent">{author.role}</p>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
          {author.bio}
        </p>
        <p className="mt-4 max-w-xl leading-relaxed text-muted-foreground">
          {site.name} is where that work gets written up — security research,
          engineering notes, and the occasional reverse engineering rabbit
          hole, kept as a record for future-me as much as for anyone reading.
        </p>

        <div className="mt-8 flex flex-wrap gap-6">
          {author.github && (
            <a
              href={author.github}
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline flex items-center gap-2 text-sm text-foreground"
            >
              <Github className="h-4 w-4" /> GitHub
            </a>
          )}
          {author.linkedin && (
            <a
              href={author.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline flex items-center gap-2 text-sm text-foreground"
            >
              <Linkedin className="h-4 w-4" /> LinkedIn
            </a>
          )}
          {author.website && (
            <a
              href={author.website}
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline flex items-center gap-2 text-sm text-foreground"
            >
              <Globe className="h-4 w-4" /> Portfolio
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
