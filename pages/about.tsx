// pages/about.tsx
import { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { motion } from "framer-motion";
import { Post } from "@/types/post";
import { SocialLink } from "@/types/basics";
import basics from "@/data/basics.json";
import postsData from "@/data/posts.json";
import Header from "@/components/Header";
import BusinessCard from "@/components/BusinessCard";
import Instructions from "@/components/Instructions";
import PostGrid from "@/components/PostGrid";
import Footer from "@/components/Footer";

interface AboutPageProps {
  name: string;
  socialLinks: SocialLink[];
  featuredPosts: Post[];
}

const AboutPage: NextPage<AboutPageProps> = ({
  name,
  socialLinks,
  featuredPosts,
}) => {
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

        <PostGrid posts={featuredPosts} path="featured" />
      </motion.div>

      <Footer name={name} socialLinks={socialLinks} />
    </div>
  );
};

export const getStaticProps: GetStaticProps<AboutPageProps> = async () => {
  const featuredPosts: Post[] = postsData
    .filter((post) => post.featured)
    .sort((a, b) => {
      const orderA = a?.order ?? 0;
      const orderB = b?.order ?? 0;
      return orderA - orderB;
    });

  return {
    props: {
      name: basics.name,
      socialLinks: basics.socialLinks,
      featuredPosts: featuredPosts,
    },
    revalidate: 60,
  };
};

export default AboutPage;
