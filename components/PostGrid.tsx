// components/PostGrid.tsx
import { Post } from "@/types/post";
import Image from "next/image";
import Link from "next/link";
import { parseAlienCaption } from "@/lib/utils";

interface PostGridProps {
  posts: Post[];
  path: string;
}

const PostGrid: React.FC<PostGridProps> = ({ posts, path }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-5 md:gap-10 text-light-1 dark:text-light-1">
      {posts.map((post) => {
        const caption = parseAlienCaption(post.title);
        return (
          <Link
            key={post.id}
            href={`/${path}/${post.id}`}
            className="group relative cursor-pointer"
          >
            <Image
              src={`/${Array.isArray(post.uri) ? post.uri[0] : post.uri}`}
              alt={caption.title}
              width={320}
              height={400}
              className="rounded shadow-md md:transition md:duration-200 md:ease-in-out md:transform"
            />
            <div className="absolute inset-0 bg-black opacity-0 md:group-hover:opacity-50 transition duration-200 rounded shadow-md"></div>
            <div className="absolute inset-0 items-center justify-center opacity-0 md:group-hover:opacity-100 transition duration-200 p-4">
              <h2 className="text-xl mb-2">{caption.title}</h2>
              <ul className="list-outside list-disc ml-5">
                {caption.additional.map((line, index) => {
                  return (
                    <li key={index} className="text-base">
                      {line}
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="absolute inset-0 flex items-center justify-center text-white opacity-0 md:group-hover:opacity-100 transition duration-200">
              <span className="text-4xl">+</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default PostGrid;
