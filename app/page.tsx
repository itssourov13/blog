import { Hero } from "@/components/home/Hero";
import { FeaturedArticle } from "@/components/home/FeaturedArticle";
import { LatestArticles } from "@/components/home/LatestArticles";
import { TopicsPreview } from "@/components/home/TopicsPreview";
import { Newsletter } from "@/components/home/Newsletter";
import { getFeaturedPost, getLatestPosts } from "@/lib/posts";

export default function HomePage() {
  const featured = getFeaturedPost();
  const latest = getLatestPosts({ excludeSlug: featured?.slug });

  return (
    <>
      <Hero />
      {featured && <FeaturedArticle post={featured} />}
      <LatestArticles posts={latest} />
      <TopicsPreview />
      <Newsletter />
    </>
  );
}
