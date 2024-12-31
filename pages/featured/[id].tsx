// pages/featured/[id].tsx
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
import PostFooter from "@/components/PostFooter";
import Footer from "@/components/Footer";
import { parseAlienCaption } from "@/lib/utils";
import { useRouter } from "next/router";
import { useSwipeable } from "react-swipeable";
import { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface PostProps {
  name: string;
  socialLinks: SocialLink[];
  post: Post;
  prevPost: Post | null;
  nextPost: Post | null;
}

const Post = ({ name, socialLinks, post, prevPost, nextPost }: PostProps) => {
  const caption = parseAlienCaption(post.title);
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = Array.isArray(post.uri) ? post.uri : [post.uri];
  // console.log("images is ", post.uri);

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
    setCurrentImageIndex(0);
  }, [router.query.id, post.uri]);

  const handleNextImage = () => {
    if (currentImageIndex < images.length - 1) {
      setCurrentImageIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handlePrevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex((prevIndex) => prevIndex - 1);
    }
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (nextPost) {
        if (currentImageIndex < images.length - 1) {
          handleNextImage();
        } else if (nextPost) {
          router.push(`/featured/${nextPost?.id}`);
        }
      }
    },
    onSwipedRight: () => {
      if (prevPost) {
        if (currentImageIndex > 0) {
          handlePrevImage();
        } else if (prevPost) {
          router.push(`/featured/${prevPost?.id}`);
        }
      }
    },
    preventScrollOnSwipe: true,
    trackTouch: true,
    trackMouse: false,
  });

  return (
    <div className="mx-auto">
      <Head>
        <title>{`${name} | ${caption.title}`}</title>
        <meta name="description" content={`${caption.title}`} key="desc" />
        <meta name="robots" content="index, follow" />
        <meta
          property="og:image"
          content={`/${images[currentImageIndex]}`}
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
            path="featured"
          />
          <div
            {...handlers}
            className="flex items-center justify-between mx-auto w-fit mt-2 pb-2"
          >
            {/* Left Navigation */}
            {currentImageIndex > 0 ? (
              <FaChevronLeft
                onClick={handlePrevImage}
                className="sm:hover:text-accent-dark sm:dark:hover:text-accent-light text-xl sm:text-2xl md:text-4xl cursor-pointer"
                aria-label="Previous Image"
              />
            ) : (
              <div className="w-6" /> /* Placeholder for alignment if no button */
            )}

            <Image
              src={`/${images[currentImageIndex]}`}
              alt={`${caption.title} - Image ${currentImageIndex + 1}`}
              width={600}
              height={600}
              priority
              className="ring-1 ring-dark-3 dark:ring-light-3 mb-2"
            />

            {/* Right Navigation */}
            {currentImageIndex < images.length - 1 ? (
              <FaChevronRight
                onClick={handleNextImage}
                className="sm:hover:text-accent-dark sm:dark:hover:text-accent-light text-xl sm:text-2xl md:text-4xl cursor-pointer"
                aria-label="Next Image"
              />
            ) : (
              <div className="w-6" /> /* Placeholder for alignment if no button */
            )}
          </div>

          <PostFooter additional={caption.additional} />
        </div>
      </motion.div>

      <Footer name={name} socialLinks={socialLinks} />
    </div>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const posts: Post[] = postsData
    .filter((post) => post.featured)
    .sort((a, b) => {
      const orderA = a?.order ?? 0;
      const orderB = b?.order ?? 0;
      return orderA - orderB;
    });

  const paths = posts.map((post) => ({
    params: { id: post.id.toString() },
  }));

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<PostProps> = async ({ params }) => {
  if (!params) {
    return { notFound: true };
  }

  const posts: Post[] = postsData
    .filter((post) => post.featured)
    .sort((a, b) => {
      const orderA = a?.order ?? 0;
      const orderB = b?.order ?? 0;
      return orderA - orderB;
    });

  const postIndex = posts.findIndex((p) => p.id === Number(params.id));
  const post = posts[postIndex];
  const prevPost = postIndex > 0 ? posts[postIndex - 1] : null;
  const nextPost = postIndex < posts.length - 1 ? posts[postIndex + 1] : null;

  if (!post) {
    return { notFound: true };
  }

  return {
    props: {
      name: basics.name,
      socialLinks: basics.socialLinks,
      post: post,
      prevPost: prevPost ? prevPost : null,
      nextPost: nextPost ? nextPost : null,
    },
    revalidate: 60,
  };
};

export default Post;
