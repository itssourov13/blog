import Link from "next/link";
import { CoverArt } from "@/components/article/CoverArt";

export function Hero() {
  return (
    <section className="container-content grid items-center gap-12 py-16 md:grid-cols-[1.1fr_0.9fr] md:py-24">
      <div>
        <p className="text-sm font-medium tracking-wide text-accent">PERSONAL BLOG · TECHNOLOGY & LIFE</p>
        <h1 className="mt-5 font-serif text-4xl font-medium leading-[1.1] text-foreground md:text-5xl lg:text-[3.25rem]">
          Technology, everyday moments, and the stories in between.
        </h1>
        <p className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground">
          Cybersecurity and software, alongside everyday experiences,
          personal reflections, and community stories worth remembering.
        </p>
        <Link
          href="/writing"
          className="link-underline mt-8 inline-block text-base font-medium text-foreground"
        >
          Explore the journal
        </Link>
      </div>

      <div className="hidden aspect-square overflow-hidden rounded-sm md:block">
        <CoverArt seed="hero-composition" category="life-community" className="h-full w-full" />
      </div>
    </section>
  );
}
