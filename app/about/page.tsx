import basics from "@/data/basics.json";
import postsData from "@/data/posts.json";
import type { Post } from "@/types/post";
import type { SocialLink } from "@/types/basics";
import ContentFade from "@/components/ContentFade";
import BusinessCard from "@/components/BusinessCard";
import Instructions from "@/components/Instructions";
import PostGrid from "@/components/PostGrid";

export const metadata = {
  title: `${basics.name} | About`,
  description: "Learn about Allen's Aliens.",
  robots: "index, follow",
};

export default function AboutPage() {
  const name = basics.name as string;
  const socialLinks = basics.socialLinks as SocialLink[];
  const featuredPosts: Post[] = (postsData as Post[])
    .filter((post) => post.featured)
    .sort((a, b) => {
      const orderA = a?.order ?? 0;
      const orderB = b?.order ?? 0;
      return orderA - orderB;
    });

  return (
    <ContentFade>
      <BusinessCard />
      <Instructions socialLink={socialLinks[0]} />
      <PostGrid posts={featuredPosts} path="featured" />
    </ContentFade>
  );
}
