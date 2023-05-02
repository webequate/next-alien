// pages/contact.tsx
import { GetStaticProps, NextPage } from "next";
import { motion } from "framer-motion";
import { connectToDatabase } from "@/lib/mongodb";
import { Basics } from "@/types/basics";
import Header from "@/components/Header";
import ContactForm from "@/components/ContactForm";
import ContactDetails from "@/components/ContactDetails";
import Footer from "@/components/Footer";

type ContactProps = {
  basics: Basics[];
};

const Contact: NextPage<ContactProps> = ({ basics }) => {
  const {
    name,
    contactIntro,
    location,
    email,
    website,
    resumeLink,
    socialLinks,
  } = basics[0];
  return (
    <div className="mx-auto">
      <Header name={name} />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ease: "easeInOut", duration: 0.9, delay: 0.2 }}
        className={"text-base text-dark-2 dark:text-light-2"}
      >
        <div className="mx-auto flex flex-col-reverse lg:flex-row">
          <ContactForm />

          <ContactDetails
            name={name}
            contactIntro={contactIntro}
            location={location}
            email={email}
            website={website}
            resumeLink={resumeLink}
          />
        </div>
      </motion.div>

      <Footer name={name} />
    </div>
  );
};

export const getStaticProps: GetStaticProps<ContactProps> = async () => {
  const db = await connectToDatabase(process.env.MONGODB_URI!);

  const basicsCollection = db.collection<Basics>("basics");
  const basics: Basics[] = await basicsCollection.find().toArray();

  return {
    props: {
      basics: JSON.parse(JSON.stringify(basics)),
    },
    revalidate: 60,
  };
};

export default Contact;
