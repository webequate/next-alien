// components/NavButton.tsx
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface NavButtonProps {
  handler: () => void;
  previous: boolean;
  enabled: boolean;
}

const NavButton: React.FC<NavButtonProps> = ({
  handler,
  previous,
  enabled,
}) => {
  if (previous) {
    if (enabled) {
      return (
        <FaChevronLeft
          onClick={handler}
          className="sm:hover:text-accent-dark sm:dark:hover:text-accent-light mr-4 text-xl sm:text-2xl md:text-5xl cursor-pointer"
          aria-label="Previous Image"
        />
      );
    } else {
      return (
        <FaChevronLeft
          className="mr-4 text-xl sm:text-2xl md:text-5xl opacity-0 pointer-events-none"
          aria-hidden="true"
        />
      );
    }
  } else {
    if (enabled) {
      return (
        <FaChevronRight
          onClick={handler}
          className="sm:hover:text-accent-dark sm:dark:hover:text-accent-light ml-4 text-xl sm:text-2xl md:text-5xl cursor-pointer"
          aria-label="Next Image"
        />
      );
    } else {
      return (
        <FaChevronRight
          className="ml-4 text-xl sm:text-2xl md:text-5xl opacity-0 pointer-events-none"
          aria-hidden="true"
        />
      );
    }
  }
};

export default NavButton;
