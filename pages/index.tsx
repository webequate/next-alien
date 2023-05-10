// pages/index.tsx
import { GetStaticProps, NextPage } from "next";
import { motion } from "framer-motion";
import { connectToDatabase } from "@/lib/mongodb";
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
      <Header name={name} socialLink={socialLinks[0]} />

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

        <PostGrid posts={posts} />
      </motion.div>

      <Footer name={name} socialLinks={socialLinks} />
    </div>
  );
};

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const db = await connectToDatabase(process.env.MONGODB_URI!);

  const postsCollection = db.collection<Post>("posts");
  const posts: Post[] = await postsCollection
    .find()
    .sort({ creation_timestamp: -1 })
    .toArray();

  const basicsCollection = db.collection<Basics>("basics");
  const basics: Basics[] = await basicsCollection.find().toArray();

  return {
    props: {
      posts: JSON.parse(JSON.stringify(posts)),
      name: basics[0].name,
      abouts: basics[0].abouts,
      socialLinks: basics[0].socialLinks,
    },
    revalidate: 60,
  };
};

export default Home;
