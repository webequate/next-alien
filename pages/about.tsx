// pages/about.tsx
import { GetStaticProps, NextPage } from "next";
import { motion } from "framer-motion";
import { Basics, SocialLink } from "@/types/basics";
import { Post } from "@/types/post";
import Header from "@/components/Header";
import BusinessCard from "@/components/BusinessCard";
import Instructions from "@/components/Instructions";
import PostGrid from "@/components/PostGrid";
import Footer from "@/components/Footer";

interface AboutProps {
  name: string;
  socialLinks: SocialLink[];
  posts: Post[];
}

const About: NextPage<AboutProps> = ({ name, socialLinks, posts }) => {
  return (
    <div className="mx-auto">
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

export const getStaticProps: GetStaticProps<AboutProps> = async () => {
  const postsRes = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/posts?featured=true`
  );
  const posts: Post[] = await postsRes.json();

  const basicsRes = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/basics`
  );
  const basics: Basics = await basicsRes.json();

  return {
    props: {
      name: basics.name,
      socialLinks: basics.socialLinks,
      posts: JSON.parse(JSON.stringify(posts)),
    },
    revalidate: 60,
  };
};

export default About;
