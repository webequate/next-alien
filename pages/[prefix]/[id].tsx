// pages/[prefix]/[id].tsx
import { GetStaticProps, GetStaticPaths } from "next";
import Head from "next/head";
import { motion } from "framer-motion";
import type { Post } from "@/types/post";
import { SocialLink } from "@/types/basics";
import basics from "@/data/basics.json";
import postsData from "@/data/posts.json";
import Header from "@/components/Header";
import PostHeader from "@/components/PostHeader";
import Image from "next/image";
import NavButton from "@/components/NavButton";
import PostFooter from "@/components/PostFooter";
import Footer from "@/components/Footer";
import { getFileTypeFromExtension, parseAlienCaption } from "@/lib/utils";
import { useRouter } from "next/router";
import { useSwipeable } from "react-swipeable";
import { useEffect, useState } from "react";

interface PostProps {
  name: string;
  socialLinks: SocialLink[];
  post: Post;
  prevPost: Post | null;
  nextPost: Post | null;
  prefix: string;
}

const PostPage = ({
  name,
  socialLinks,
  post,
  prevPost,
  nextPost,
  prefix,
}: PostProps) => {
  const caption = parseAlienCaption(post.title);
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [currentAssetIndex, setCurrentAssetIndex] = useState(0);

  const assets = Array.isArray(post.uri) ? post.uri : [post.uri];

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    window.addEventListener("resize", checkMobile);
    checkMobile();

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Reset currentImageIndex to 0 when the post ID changes
  useEffect(() => {
    setCurrentAssetIndex(0);
  }, [router.query.id, post.uri]);

  const handleNextAsset = () => {
    if (currentAssetIndex < assets.length - 1) {
      setCurrentAssetIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handlePrevAsset = () => {
    if (currentAssetIndex > 0) {
      setCurrentAssetIndex((prevIndex) => prevIndex - 1);
    }
  };

  const handlers = useSwipeable({
    onSwipedLeft: handleNextAsset,
    onSwipedRight: handlePrevAsset,
    preventScrollOnSwipe: true,
    trackTouch: true,
    trackMouse: false,
  });

  const renderAsset = (uri: string) => {
    switch (getFileTypeFromExtension(uri)) {
      case "image":
        return (
          <Image
            src={`/${assets[currentAssetIndex]}`}
            alt={`${caption.title} - Image ${currentAssetIndex + 1}`}
            width={600}
            height={600}
            priority
            className="select-none pointer-events-none ring-1 ring-dark-3 dark:ring-light-3 p-2 bg-white dark:bg-black mb-2"
          />
        );
      case "video":
        return (
          <div className="inline-block ring-1 ring-dark-3 dark:ring-light-3 p-2 bg-white dark:bg-black">
            <video
              src={`/${assets[currentAssetIndex]}`}
              controls
              preload="metadata"
              disablePictureInPicture
              controlsList="nodownload"
              className="bg-transparent object-cover filter brightness-110 sm:brightness-100"
              height={480}
            />
          </div>
        );
      default:
    }
  };

  return (
    <div className="mx-auto">
      <Head>
        <title>{`${name} | ${caption.title}`}</title>
        <meta name="description" content={`${caption.title}`} key="desc" />
        <meta name="robots" content="index, follow" />
        <meta
          property="og:image"
          content={`/${assets[currentAssetIndex]}`}
          key="ogimage"
        />
      </Head>

      <Header socialLink={socialLinks[0]} />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ease: "easeInOut", duration: 0.9, delay: 0.2 }}
      >
        <div className="relative justify-center text-dark-1 dark:text-light-1 pb-3">
          <PostHeader
            title={caption.title}
            prevId={prevPost?.id}
            nextId={nextPost?.id}
            path={prefix}
          />
          <div
            {...handlers}
            className="flex items-center justify-center mx-auto w-fit mt-2 pb-2"
          >
            {/* Left Navigation */}
            <NavButton
              handler={handlePrevAsset}
              previous={true}
              enabled={currentAssetIndex > 0}
            />

            {/* Asset */}
            {renderAsset(assets[currentAssetIndex])}

            {/* Right Navigation */}
            <NavButton
              handler={handleNextAsset}
              previous={false}
              enabled={currentAssetIndex < assets.length - 1}
            />
          </div>

          {/* Dots Below the Asset */}
          <div className="flex justify-center mt-4 space-x-2">
            {assets.length > 1 &&
              assets.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentAssetIndex(index)}
                  className={`w-4 h-4 rounded-full ${
                    currentAssetIndex === index
                      ? "bg-accent-dark dark:bg-accent-light"
                      : "bg-dark-3 dark:bg-light-3"
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
          </div>

          <PostFooter additional={caption.additional} />
        </div>
      </motion.div>

      <Footer name={name} socialLinks={socialLinks} />
    </div>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  // Generate paths dynamically based on conditions
  const paths = [...postsData].flatMap((post) => {
    const postPaths = [{ params: { prefix: "posts", id: post.id.toString() } }];

    if (post.featured) {
      postPaths.push({
        params: { prefix: "featured", id: post.id.toString() },
      });
    }

    // let postType = getFileTypeFromExtension(post.uri[0]);

    // if (postType === "image") {
    //   postPaths.push({ params: { prefix: "images", id: post.id.toString() } });
    // }

    // if (postType === "video") {
    //   postPaths.push({ params: { prefix: "videos", id: post.id.toString() } });
    // }

    return postPaths;
  });

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<PostProps> = async ({ params }) => {
  if (!params) return { notFound: true };

  const { prefix, id } = params as { prefix: string; id: string };

  // Combine sorting and filtering logic
  const filteredAndSortedPosts = [...postsData]
    .filter((post) => {
      let postType = getFileTypeFromExtension(post.uri[0]);

      // Filter posts based on the prefix
      if (prefix === "featured") {
        return post.featured;
      } else if (prefix === "images") {
        return postType === "image";
      } else if (prefix === "videos") {
        return postType === "video";
      }
      return true; // Default: include all posts
    })
    .sort((a, b) => {
      // Sort logic based on the prefix
      if (prefix === "featured") {
        const orderA = a.order !== undefined ? a.order : 0;
        const orderB = b.order !== undefined ? b.order : 0;
        return orderA - orderB; // Ascending order for "featured"
      } else {
        return b.id - a.id; // Descending order for other prefixes
      }
    });

  // Find the current post index
  const postIndex = filteredAndSortedPosts.findIndex(
    (post) => post.id.toString() === id
  );

  if (postIndex === -1) return { notFound: true };

  // Get current post, previous post, and next post
  const post = filteredAndSortedPosts[postIndex];
  const prevPost = postIndex > 0 ? filteredAndSortedPosts[postIndex - 1] : null;
  const nextPost =
    postIndex < filteredAndSortedPosts.length - 1
      ? filteredAndSortedPosts[postIndex + 1]
      : null;

  return {
    props: {
      name: basics.name,
      socialLinks: basics.socialLinks,
      post: post,
      prevPost: prevPost ? prevPost : null,
      nextPost: nextPost ? nextPost : null,
      prefix,
    },
    revalidate: 60,
  };
};

export default PostPage;
