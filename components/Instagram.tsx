// components/Instagram.tsx
import type { SocialLink } from "@/types/basics";
import Link from "next/link";
import { FaInstagram } from "react-icons/fa";

interface InstagramProps {
  socialLink: SocialLink;
}

const Instagram: React.FC<InstagramProps> = ({ socialLink }) => {
  return (
    <div className="font-general-regular">
      <Link
        href={socialLink.url}
        className="text-3xl text-dark-2 dark:text-light-2 hover:text-light-1 dark:hover:text-light-1 bg-light-1 dark:bg-dark-1 hover:bg-accent-light dark:hover:bg-accent-light ring-1 ring-dark-3 dark:ring-light-3 cursor-pointer rounded-lg p-2"
      >
        <FaInstagram className="text-xl" />
      </Link>
    </div>
  );
};

export default Instagram;
