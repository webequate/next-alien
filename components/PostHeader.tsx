// components/PostHeader.tsx
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import Link from "next/link";

interface PostHeaderProps {
  title: string;
  prevId?: number;
  nextId?: number;
}

const PostHeader: React.FC<PostHeaderProps> = ({ title, prevId, nextId }) => {
  return (
    <div className="flex justify-between text-xl sm:text-2xl md:text-3xl">
      {prevId ? (
        <Link href={`/posts/${prevId}`}>
          <FaArrowLeft className="hover:text-accent-dark dark:hover:text-accent-light" />
        </Link>
      ) : (
        <div className="invisible">
          <FaArrowLeft />
        </div>
      )}
      <h2 className="text-xl sm:text-2xl md:text-3xl text-center mb-4">
        {title}
      </h2>
      {nextId ? (
        <Link href={`/posts/${nextId}`}>
          <FaArrowRight className="hover:text-accent-dark dark:hover:text-accent-light" />
        </Link>
      ) : (
        <div className="invisible">
          <FaArrowRight />
        </div>
      )}
    </div>
  );
};

export default PostHeader;
