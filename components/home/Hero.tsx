import Link from "next/link";
import { CoverArt } from "@/components/article/CoverArt";

export function Hero() {
  return (
    <section className="container-content grid items-center gap-12 py-16 md:grid-cols-[1.1fr_0.9fr] md:py-24">
      <div>
        <p className="text-sm font-medium tracking-wide text-accent">Writing / Research</p>
        <h1 className="mt-5 font-serif text-4xl font-medium leading-[1.1] text-foreground md:text-5xl lg:text-[3.25rem]">
          Notes on security, software, and building things.
        </h1>
        <p className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground">
          Technical research, engineering experiments, reverse engineering
          notes, and lessons learned while building systems.
        </p>
        <Link
          href="/writing"
          className="link-underline mt-8 inline-block text-base font-medium text-foreground"
        >
          Explore writing
        </Link>
      </div>

      <div className="hidden aspect-square overflow-hidden rounded-sm md:block">
        <CoverArt seed="hero-composition" category="security" className="h-full w-full" />
      </div>
    </section>
  );
}
