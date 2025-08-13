"use client";
// components/Footer.tsx (App Router compatible)
import type { SocialLink } from "@/types/basics";
import Social from "@/components/Social";
import Copyright from "@/components/Copyright";
import WebEquate from "@/components/WebEquate";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface FooterProps {
  name: string;
  socialLinks: SocialLink[];
}

export default function Footer({ name, socialLinks }: FooterProps) {
  const pathname = usePathname() || "/";
  const asPath = pathname;

  // Determine if the link should be active based on the prefix in the path
  const isActive = (path: string) => {
    if (path === "/") return asPath === "/" || asPath.startsWith("/posts"); // Home & posts
    if (path === "/about")
      return pathname.startsWith("/about") || pathname.startsWith("/featured"); // About & featured
    return pathname.startsWith(path);
  };

  return (
    <div className="mx-auto">
      <div className="pb-8 mt-4 border-t-2 border-light-1 dark:border-dark-2">
        <div>
          <div className="m-0 mt-8 hidden sm:flex sm:p-0 justify-center items-center">
            <div className="nav-secondary">
              <Link
                href="/"
                aria-label="Home"
                className={isActive("/") ? "active" : ""}
              >
                Home
              </Link>
              <Link
                href="/about"
                aria-label="About"
                className={isActive("/about") ? "active" : ""}
              >
                About
              </Link>
              <Link
                href="/contact"
                aria-label="Contact"
                className={isActive("/contact") ? "active" : ""}
              >
                Contact Me
              </Link>
            </div>
          </div>
          <div className="mx-auto mt-4">
            <Social socialLinks={socialLinks} />
          </div>
          <div className="flex justify-center">
            <Copyright name={name} />
          </div>
          <div className="flex justify-center">
            <WebEquate />
          </div>
        </div>
      </div>
    </div>
  );
}
