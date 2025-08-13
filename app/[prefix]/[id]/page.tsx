import basics from "@/data/basics.json";
import postsData from "@/data/posts.json";
import type { Post } from "@/types/post";
import type { Metadata } from "next";
import { getFileTypeFromExtension } from "@/lib/utils";
import ContentFade from "@/components/ContentFade";
import PostDetail from "./PostDetail";

export async function generateStaticParams() {
  const params = (postsData as Post[]).flatMap((post) => {
    const base = [{ prefix: "posts", id: post.id.toString() }];
    if (post.featured)
      base.push({ prefix: "featured", id: post.id.toString() });
    return base;
  });
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: { prefix: string; id: string };
}): Promise<Metadata> {
  const { prefix, id } = params;
  const posts = postsData as Post[];
  // Mirror the same filtering used in the page for consistency
  const filtered = posts.filter((post) => {
    const postType = getFileTypeFromExtension(post.uri[0]);
    if (prefix === "featured") return post.featured;
    if (prefix === "images") return postType === "image";
    if (prefix === "videos") return postType === "video";
    return true;
  });
  const post = filtered.find((p) => p.id.toString() === id);
  if (!post) return {};

  const assets = Array.isArray(post.uri) ? post.uri : [post.uri];
  const imageUrl = `/${assets[0]}`;
  return {
    title: `${basics.name} | ${post.title}`,
    description: post.title,
    openGraph: {
      images: [imageUrl],
    },
  };
}

export default function PostPage({
  params,
}: {
  params: { prefix: string; id: string };
}) {
  const { prefix, id } = params;

  const filteredAndSortedPosts = (postsData as Post[])
    .filter((post) => {
      const postType = getFileTypeFromExtension(post.uri[0]);
      if (prefix === "featured") return post.featured;
      if (prefix === "images") return postType === "image";
      if (prefix === "videos") return postType === "video";
      return true;
    })
    .sort((a, b) => {
      if (prefix === "featured") {
        const orderA = a.order ?? 0;
        const orderB = b.order ?? 0;
        return orderA - orderB;
      }
      return b.id - a.id;
    });

  const postIndex = filteredAndSortedPosts.findIndex(
    (p) => p.id.toString() === id
  );
  if (postIndex === -1) return null;

  const post = filteredAndSortedPosts[postIndex];
  const prevPost = postIndex > 0 ? filteredAndSortedPosts[postIndex - 1] : null;
  const nextPost =
    postIndex < filteredAndSortedPosts.length - 1
      ? filteredAndSortedPosts[postIndex + 1]
      : null;

  return (
    <ContentFade>
      <PostDetail
        post={post}
        prevPost={prevPost}
        nextPost={nextPost}
        prefix={prefix}
      />
    </ContentFade>
  );
}
