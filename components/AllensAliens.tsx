// components/AllensAliens.tsx
import { Bruno_Ace } from "next/font/google";

const bruno = Bruno_Ace({ subsets: ["latin"], weight: "400" });

const AllensAliens = () => {
  return (
    <svg
      viewBox="0 0 168 14"
      className="w-full h-auto mx-auto pt-4 pb-2 sm:pb-2"
    >
      <text x="0" y="12" fill="currentColor" className={bruno.className}>
        ALLEN&apos;S ALIENS
      </text>
    </svg>
  );
};

export default AllensAliens;
