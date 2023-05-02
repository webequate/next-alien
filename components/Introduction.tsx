// components/Introduction.tsx
import { SocialLink } from "@/types/basics";
import Social from "@/components/Social";
import Image from "next/image";
import Link from "next/link";

interface IntroductionProps {
  abouts: string[];
  socialLinks: SocialLink[];
}

const Introduction: React.FC<IntroductionProps> = ({ abouts, socialLinks }) => {
  const instagramUrl = socialLinks[0].url;
  const instagramHandle = socialLinks[0].handle;

  return (
    <>
      <div className="mx-auto lg:flex lg:flex-row my-12 align-top">
        <div className="w-full lg:w-1/2 lg:pr-2">
          <Image
            src="/images/card-front.jpg"
            alt="Front of business card"
            width={525}
            height={300}
          />
        </div>
        <div className="w-full lg:w-1/2 lg:pl-2">
          <Image
            src="/images/card-back.jpg"
            alt="Back of business card"
            width={525}
            height={300}
          />
        </div>
      </div>
      <div className="text-xl font-bold text-center">
        {abouts.map((about, index) => (
          <h2 key={index}>{about}</h2>
        ))}
      </div>
      <div className="mx-auto">
        <Social socialLinks={socialLinks} />
      </div>
      <div className="mx-auto text-center mb-10">
        <p>To submit a photo featuring your alien, you have two options:</p>
        <ol>
          <li>
            1) Post your photo to Instagram and tag{" "}
            <Link
              href={instagramUrl}
              className="text-accent-light hover:underline"
            >
              @{instagramHandle}
            </Link>{" "}
            in your post.
          </li>
          <li>
            2) Direct message your photo to{" "}
            <Link
              href={instagramUrl}
              className="text-accent-light hover:underline"
            >
              @{instagramHandle}
            </Link>{" "}
            on Instagram.
          </li>
        </ol>
        <p>Keep an eye on Instagram to see if your alien photo is featured.</p>
      </div>
    </>
  );
};

export default Introduction;
