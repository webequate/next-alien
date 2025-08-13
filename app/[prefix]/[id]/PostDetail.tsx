"use client";

import Image from "next/image";
import NavButton from "@/components/NavButton";
import PostFooter from "@/components/PostFooter";
import PostHeader from "@/components/PostHeader";
import { usePathname, useSearchParams } from "next/navigation";
import { useSwipeable } from "react-swipeable";
import { useEffect, useMemo, useState } from "react";
import { getFileTypeFromExtension, parseAlienCaption } from "@/lib/utils";
import type { Post } from "@/types/post";

export default function PostDetail({
  post,
  prevPost,
  nextPost,
  prefix,
}: {
  post: Post;
  prevPost: Post | null;
  nextPost: Post | null;
  prefix: string;
}) {
  const caption = useMemo(() => parseAlienCaption(post.title), [post.title]);
  const [isMobile, setIsMobile] = useState(false);
  const [currentAssetIndex, setCurrentAssetIndex] = useState(0);
  const assets = Array.isArray(post.uri) ? post.uri : [post.uri];

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", checkMobile);
    checkMobile();
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    setCurrentAssetIndex(0);
  }, [post.uri]);

  const handleNextAsset = () => {
    if (currentAssetIndex < assets.length - 1) {
      setCurrentAssetIndex((prev) => prev + 1);
    }
  };

  const handlePrevAsset = () => {
    if (currentAssetIndex > 0) {
      setCurrentAssetIndex((prev) => prev - 1);
    }
  };

  const handlers = useSwipeable({
    onSwipedLeft: handleNextAsset,
    onSwipedRight: handlePrevAsset,
    preventScrollOnSwipe: true,
    trackTouch: true,
    trackMouse: false,
  });

  const renderAsset = (uri: string) => {
    switch (getFileTypeFromExtension(uri)) {
      case "image":
        return (
          <Image
            src={`/${assets[currentAssetIndex]}`}
            alt={`${caption.title} - Image ${currentAssetIndex + 1}`}
            width={600}
            height={600}
            priority
            className="select-none pointer-events-none ring-1 ring-dark-3 dark:ring-light-3 p-2 bg-white dark:bg-black mb-2"
          />
        );
      case "video":
        return (
          <div className="inline-block ring-1 ring-dark-3 dark:ring-light-3 p-2 bg-white dark:bg-black">
            <video
              src={`/${assets[currentAssetIndex]}`}
              controls
              preload="metadata"
              disablePictureInPicture
              controlsList="nodownload"
              className="bg-transparent object-cover filter brightness-110 sm:brightness-100"
              height={480}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative justify-center text-dark-1 dark:text-light-1 pb-3">
      <PostHeader
        title={caption.title}
        prevId={prevPost?.id}
        nextId={nextPost?.id}
        path={prefix}
      />
      <div
        {...handlers}
        className="flex items-center justify-center mx-auto w-fit mt-2 pb-0"
      >
        <NavButton
          handler={handlePrevAsset}
          previous
          enabled={currentAssetIndex > 0}
        />
        {renderAsset(assets[currentAssetIndex])}
        <NavButton
          handler={handleNextAsset}
          previous={false}
          enabled={currentAssetIndex < assets.length - 1}
        />
      </div>
      {assets.length > 1 && (
        <div className="flex justify-center mt-3 mb-5 space-x-2">
          {assets.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentAssetIndex(index)}
              className={`w-4 h-4 rounded-full ${
                currentAssetIndex === index
                  ? "bg-accent-dark dark:bg-accent-light"
                  : "bg-dark-3 dark:bg-light-3"
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}
      <PostFooter additional={caption.additional} />
    </div>
  );
}
