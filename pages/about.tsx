// pages/about.tsx
import { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { motion } from "framer-motion";
import { Post } from "@/types/post";
import { SocialLink } from "@/types/basics";
import basics from "@/data/basics.json";
import posts from "@/data/posts.json";
import Header from "@/components/Header";
import BusinessCard from "@/components/BusinessCard";
import Instructions from "@/components/Instructions";
import PostGrid from "@/components/PostGrid";
import Footer from "@/components/Footer";

interface AboutPageProps {
  name: string;
  socialLinks: SocialLink[];
  posts: Post[];
}

const AboutPage: NextPage<AboutPageProps> = ({ name, socialLinks, posts }) => {
  return (
    <div className="mx-auto">
      <Head>
        <title>{`${name} | About`}</title>
        <meta
          name="description"
          content="Learn about Allen's Aliens."
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

        <Instructions socialLink={socialLinks[0]} />

        <PostGrid posts={posts} path="featured" />
      </motion.div>

      <Footer name={name} socialLinks={socialLinks} />
    </div>
  );
};

export const getStaticProps: GetStaticProps<AboutPageProps> = async () => {
  let sortedPosts: Post[] = posts.sort((a, b) => b.id - a.id);

  return {
    props: {
      name: basics.name,
      socialLinks: basics.socialLinks,
      posts: sortedPosts,
    },
    revalidate: 60,
  };
};

export default AboutPage;
