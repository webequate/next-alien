import basics from "@/data/basics.json";
import postsData from "@/data/posts.json";
import type { Post } from "@/types/post";
import PostGrid from "@/components/PostGrid";
import BusinessCard from "@/components/BusinessCard";
import ContentFade from "@/components/ContentFade";

export const metadata = {
  title: basics.name,
  description: basics.description,
  robots: { index: true, follow: true },
};

export default function HomePage() {
  const posts: Post[] = (postsData as Post[])
    .slice()
    .sort((a, b) => b.id - a.id);

  return (
    <div className="mx-auto">
      <ContentFade>
        <BusinessCard />
        <div className="text-xl font-bold text-center pb-10">
          {basics.abouts.map((about, i) => (
            <h2 key={i}>{about}</h2>
          ))}
        </div>
        <PostGrid posts={posts} path="posts" />
      </ContentFade>
    </div>
  );
}
