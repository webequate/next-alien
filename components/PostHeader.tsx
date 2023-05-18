// components/PostHeader.tsx
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import Link from "next/link";

interface PostHeaderProps {
  title: string;
  prevId?: number;
  nextId?: number;
  path: string;
}

const PostHeader: React.FC<PostHeaderProps> = ({
  title,
  prevId,
  nextId,
  path,
}) => {
  return (
    <div className="flex justify-between text-xl sm:text-2xl md:text-3xl">
      {prevId ? (
        <Link
          href={`/${path}/${prevId}`}
          title="Previous Post"
          aria-label="Previous Post"
        >
          <FaArrowLeft className="sm:hover:text-accent-dark sm:dark:hover:text-accent-light" />
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
        <Link
          href={`/${path}/${nextId}`}
          title="Next Post"
          aria-label="Next Post"
        >
          <FaArrowRight className="sm:hover:text-accent-dark sm:dark:hover:text-accent-light" />
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
