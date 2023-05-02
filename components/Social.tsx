// components/Social.tsx
import { SocialLink } from "@/types/basics";
import Link from "next/link";
import {
  FaFacebook,
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";

interface SocialProps {
  socialLinks: SocialLink[];
}

const Social: React.FC<SocialProps> = ({ socialLinks }) => {
  const iconFromName = (name: string) => {
    switch (name) {
      case "facebook":
        return <FaFacebook />;
      case "github":
        return <FaGithub />;
      case "instagram":
        return <FaInstagram />;
      case "linkedin":
        return <FaLinkedin />;
      case "twitter":
        return <FaTwitter />;
      case "youtube":
        return <FaYoutube />;
      default:
        return <FaFacebook />;
    }
  };

  return (
    <div className="font-general-regular flex justify-center items-center mt-6 mb-6">
      <ul className="flex gap-4 sm:gap-8">
        {socialLinks.map((socialLink, index) => (
          <Link
            key={index}
            href={socialLink.url}
            className={`text-3xl text-dark-2 dark:text-light-2 hover:text-light-1 dark:hover:text-light-1 bg-light-1 dark:bg-dark-1 hover:bg-accent-light dark:hover:bg-accent-light ring-1 ring-dark-3 dark:ring-light-3 cursor-pointer rounded-lg p-2 duration-300`}
          >
            {iconFromName(socialLink.name)}
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default Social;
