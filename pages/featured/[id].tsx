// pages/featured/[id].tsx
import { GetStaticProps, GetStaticPaths, NextPage } from "next";
import { motion } from "framer-motion";
import { Post } from "@/types/post";
import { Basics, SocialLink } from "@/types/basics";
import Header from "@/components/Header";
import PostHeader from "@/components/PostHeader";
import Image from "next/image";
import PostFooter from "@/components/PostFooter";
import Footer from "@/components/Footer";
import { useRouter } from "next/router";
import { parseAlienCaption } from "@/lib/utils";

interface PostProps {
  name: string;
  socialLinks: SocialLink[];
  posts: Post[];
  post: Post;
}

const Post: NextPage<PostProps> = ({ name, socialLinks, posts, post }) => {
  const router = useRouter();
  const { id } = router.query;

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  const currentIndex = posts.findIndex((p) => p.id.toString() === id);
  const prevPost = currentIndex > 0 ? posts[currentIndex - 1] : null;
  const nextPost =
    currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;

  const caption = parseAlienCaption(post.title);

  return (
    <div className="mx-auto">
      <Header socialLink={socialLinks[0]} />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ease: "easeInOut", duration: 0.9, delay: 0.2 }}
      >
        <div className="justify-center text-dark-1 dark:text-light-1">
          <PostHeader
            title={caption.title}
            prevId={prevPost?.id}
            nextId={nextPost?.id}
          />
          <Image
            src={`/${Array.isArray(post.uri) ? post.uri[0] : post.uri}`}
            alt={caption.title}
            width={800}
            height={800}
            className="mx-auto ring-1 ring-dark-3 dark:ring-light-3 mb-4"
          />
          <PostFooter additional={caption.additional} />
        </div>
      </motion.div>

      <Footer name={name} socialLinks={socialLinks} />
    </div>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/posts?featured=true`
    );
    const posts: Post[] = await res.json();

    const paths = posts.map((post) => ({
      params: { id: post.id.toString() },
    }));

    console.log("paths:", paths);

    return { paths, fallback: true };
  } catch (error) {
    console.error("Error in getStaticPaths:", error);
    throw error;
  }
};

export const getStaticProps: GetStaticProps<PostProps> = async ({ params }) => {
  try {
    if (!params) {
      return { notFound: true };
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/posts?featured=true`
    );
    const posts: Post[] = await res.json();
    const post: Post | undefined = posts.find(
      (p) => p.id === Number(params.id) && p.featured === true
    );

    console.log("posts:", posts);

    if (!post) {
      return { notFound: true };
    }

    const resBasics = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/basics`
    );
    const basics: Basics = await resBasics.json();

    return {
      props: {
        name: basics.name,
        socialLinks: basics.socialLinks,
        posts,
        post,
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error("Error in getStaticProps:", error);
    throw error;
  }
};

export default Post;
