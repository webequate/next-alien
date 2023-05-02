// components/PostModals.tsx
import { Post } from "@/types/post";
import Image from "next/image";
import { useRef } from "react";

interface PostModalsProps {
  posts: Post[];
  activeModal: number | null;
  setActiveModal: (index: number | null) => void;
}

const PostModals: React.FC<PostModalsProps> = ({
  posts,
  activeModal,
  setActiveModal,
}) => {
  const modalContentRef = useRef<HTMLDivElement | null>(null);

  return (
    <>
      {posts.map((post, index) => (
        <div
          key={index}
          id={`modal-${index}`}
          className={`modal ${activeModal === index ? "modal-open" : ""}`}
          onClick={() => setActiveModal(null)}
        >
          <div
            ref={modalContentRef}
            className="modal-content text-dark-2 dark:text-light-2 bg-light-1 dark:bg-dark-1"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={`/${Array.isArray(post.uri) ? post.uri[0] : post.uri}`}
              alt={post.title}
              width={1000}
              height={1000}
              className="w-full mb-4"
            />
            <h2 className="text-xl text-dark-1 dark:text-light-1 mb-4">
              {post.title}
            </h2>
          </div>
        </div>
      ))}
    </>
  );
};

export default PostModals;
