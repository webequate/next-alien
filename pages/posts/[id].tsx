// pages/posts/[id].tsx
import { GetStaticProps, GetStaticPaths, NextPage } from "next";
import { motion } from "framer-motion";
import { connectToDatabase } from "@/lib/mongodb";
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
  post: Post;
  posts: Post[];
  featured?: boolean;
  name: string;
  socialLinks: SocialLink[];
}

const Post: NextPage<PostProps> = ({ post, posts, name, socialLinks }) => {
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
      <Header name={name} socialLink={socialLinks[0]} />

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
            width={600}
            height={600}
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
    const db = await connectToDatabase(process.env.MONGODB_URI!);

    const postsCollection = db.collection<Post>("posts");
    const posts: Post[] = await postsCollection
      .find()
      .sort({ id: -1 })
      .toArray();

    const paths = posts.map((post) => ({
      params: { id: post.id.toString() },
    }));

    return { paths, fallback: true };
  } catch (error) {
    console.error("Error in getStaticPaths:", error);
    throw error;
  }
};

export const getStaticProps: GetStaticProps<PostProps> = async ({ params }) => {
  if (!params) {
    return {
      notFound: true,
    };
  }

  const db = await connectToDatabase(process.env.MONGODB_URI!);

  const postsCollection = db.collection<Post>("posts");
  const posts: Post[] = await postsCollection.find().sort({ id: -1 }).toArray();
  const post: Post | null = await postsCollection.findOne({
    id: Number(params.id),
  });

  if (!post) {
    return {
      notFound: true,
    };
  }

  const basicsCollection = db.collection<Basics>("basics");
  const basics: Basics[] = await basicsCollection.find().toArray();

  return {
    props: {
      post: JSON.parse(JSON.stringify(post)),
      posts: JSON.parse(JSON.stringify(posts)),
      name: basics[0].name,
      socialLinks: basics[0].socialLinks,
    },
    revalidate: 60,
  };
};

export default Post;
