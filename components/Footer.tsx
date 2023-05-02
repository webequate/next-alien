// components/Footer.tsx
import Copyright from "@/components/Copyright";
import Link from "next/link";

interface FooterProps {
  name: string;
}

const Footer: React.FC<FooterProps> = ({ name }) => {
  return (
    <div className="mx-auto">
      <div className="pb-8 mt-8 border-t-2 border-light-1 dark:border-dark-2">
        <div>
          {/* Footer links - large screen */}
          <div className="m-0 sm:ml-4 mt-8 hidden sm:flex sm:p-0 justify-center items-center">
            <div className="nav-secondary">
              <Link href="/" aria-label="Home" className="nav-link">
                Home
              </Link>
              <Link href="/about" aria-label="About" className="nav-link">
                About
              </Link>
              <Link href="/contact" aria-label="Contact" className="nav-link">
                Contact Me
              </Link>
            </div>
          </div>
          <div className="flex justify-center">
            <Copyright name={name} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
