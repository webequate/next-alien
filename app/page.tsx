import basics from "@/data/basics.json";
import postsData from "@/data/posts.json";
import type { Post } from "@/types/post";
import type { Metadata } from "next";
import { generateBaseMetadata } from "@/lib/metadata";
import PostGrid from "@/components/PostGrid";
import BusinessCard from "@/components/BusinessCard";
import ContentFade from "@/components/ContentFade";

export const metadata: Metadata = {
  ...generateBaseMetadata(
    basics.name,
    basics.description,
    "/",
    "https://allensaliens.com/images/og-alien.jpg"
  ),
  openGraph: {
    ...generateBaseMetadata(
      basics.name,
      basics.description,
      "/",
      "https://allensaliens.com/images/og-alien.jpg"
    ).openGraph,
    images: [
      {
        url: "https://allensaliens.com/images/og-alien.jpg",
        width: 1200,
        height: 630,
        alt: basics.name,
      },
    ],
  },
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
