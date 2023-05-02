// components/PostGrid.tsx
import { Post } from "@/types/post";
import Image from "next/image";

interface PostGridProps {
  posts: Post[];
  setActiveModal: (index: number | null) => void;
}

const PostGrid: React.FC<PostGridProps> = ({ posts, setActiveModal }) => {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 text-light-1 dark:text-light-1">
      {posts.map((post, index) => (
        <a
          key={index}
          onClick={() => setActiveModal(index)}
          className="group relative cursor-pointer"
        >
          <Image
            src={`/${post.uri}`}
            alt={post.title}
            width={500}
            height={500}
            className="rounded shadow-md transition duration-200 ease-in-out transform"
          />
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition duration-200 rounded shadow-md"></div>
          <div className="absolute inset-0 items-center justify-center opacity-0 group-hover:opacity-100 transition duration-200 p-4">
            <h2 className="text-xl mb-2">{post.title}</h2>
          </div>
          <div className="absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition duration-200">
            <span className="text-4xl">+</span>
          </div>
        </a>
      ))}
    </div>
  );
};

export default PostGrid;
