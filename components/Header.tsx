// components/Header.tsx
import Link from "next/link";
import { useState } from "react";
import AllensAliens from "@/components/AllensAliens";
import LayoutWidget from "@/components/LayoutWidget";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import Hamburger from "@/components/Hamburger";

interface HeaderProps {
  name: string;
}

const Header: React.FC<HeaderProps> = ({ name }) => {
  const [showMenu, setShowMenu] = useState(false);

  function toggleMenu() {
    setShowMenu(!showMenu);
  }

  return (
    <nav>
      {/* Home link */}
      <Link href="/" className="text-dark-1 dark:text-light-1 my-4">
        <AllensAliens />
      </Link>

      <div className="container mx-auto px-2 py-3 mb-10">
        <div className="flex justify-center items-center">
          {/* Extraneous invisible layout widget */}
          <div className="invisible flex mr-auto">
            <LayoutWidget />
          </div>

          {/* Navigation links - Large screen */}
          <div className="hidden md:flex font-general-medium m-0 sm:ml-4 sm:p-0">
            <div className="nav-primary">
              <Link href="/" aria-label="Home" className="nav-link">
                Home
              </Link>
              <Link href="/about" aria-label="About" className="nav-link">
                About
              </Link>
              <Link href="/contact" aria-label="Contact" className="nav-link">
                Contact
              </Link>
            </div>
          </div>

          {/* Hamburger menu - Small screen */}
          <div className="flex md:hidden">
            <Hamburger showMenu={showMenu} toggleMenu={toggleMenu} />
          </div>

          {/* Theme switcher */}
          <div className="flex ml-auto">
            <ThemeSwitcher />
          </div>
        </div>

        {/* Navigation links - Small screen */}
        <div className={showMenu ? "nav-mobile" : "hidden"}>
          <Link href="/" aria-label="Home" className="nav-link">
            Home
          </Link>
          <Link href="/about" aria-label="About" className="nav-link">
            About
          </Link>
          <Link href="/contact" aria-label="Contact" className="nav-link">
            Contact
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Header;
