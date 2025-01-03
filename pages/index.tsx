// pages/index.tsx
import { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { motion } from "framer-motion";
import { Post } from "@/types/post";
import { SocialLink } from "@/types/basics";
import basics from "@/data/basics.json";
import postsData from "@/data/posts.json";
import Header from "@/components/Header";
import BusinessCard from "@/components/BusinessCard";
import PostGrid from "@/components/PostGrid";
import Footer from "@/components/Footer";

interface HomePageProps {
  name: string;
  abouts: string[];
  socialLinks: SocialLink[];
  posts: Post[];
}

const HomePage: NextPage<HomePageProps> = ({
  name,
  abouts,
  socialLinks,
  posts,
}) => {
  return (
    <div className="mx-auto">
      <Head>
        <title>{`${name}`}</title>
        <meta
          name="description"
          content="Allen's Aliens in the wild."
          key="desc"
        />
        <meta name="robots" content="index, follow" />
      </Head>

      <Header socialLink={socialLinks[0]} />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ease: "easeInOut", duration: 0.9, delay: 0.2 }}
        className="text-base text-dark-2 dark:text-light-2"
      >
        <BusinessCard />

        <div className="text-xl font-bold text-center pb-10">
          {abouts.map((about, index) => (
            <h2 key={index}>{about}</h2>
          ))}
        </div>

        <PostGrid posts={posts} path="posts" />
      </motion.div>

      <Footer name={name} socialLinks={socialLinks} />
    </div>
  );
};

export const getStaticProps: GetStaticProps<HomePageProps> = async () => {
  const posts: Post[] = postsData.sort((a, b) => b.id - a.id);

  return {
    props: {
      name: basics.name,
      abouts: basics.abouts,
      socialLinks: basics.socialLinks,
      posts: posts,
    },
    revalidate: 60,
  };
};

export default HomePage;
