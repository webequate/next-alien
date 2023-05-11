// pages/index.tsx
import { GetStaticProps, NextPage } from "next";
import { motion } from "framer-motion";
import { Basics, SocialLink } from "@/types/basics";
import { Post } from "@/types/post";
import Header from "@/components/Header";
import BusinessCard from "@/components/BusinessCard";
import PostGrid from "@/components/PostGrid";
import Footer from "@/components/Footer";

interface HomeProps {
  name: string;
  abouts: string[];
  socialLinks: SocialLink[];
  posts: Post[];
}

const Home: NextPage<HomeProps> = ({ name, abouts, socialLinks, posts }) => {
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

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const postsRes = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/posts`
  );
  const posts: Post[] = await postsRes.json();

  const basicsRes = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/basics`
  );
  const basics: Basics = await basicsRes.json();

  return {
    props: {
      name: basics.name,
      abouts: basics.abouts,
      socialLinks: basics.socialLinks,
      posts: JSON.parse(JSON.stringify(posts)),
    },
    revalidate: 60,
  };
};

export default Home;
