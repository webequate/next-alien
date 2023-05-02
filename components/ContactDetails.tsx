// components/ContactDetails.tsx
import Link from "next/link";
import { FiUser, FiMapPin, FiMail, FiGlobe } from "react-icons/fi";

interface ContactDetailsProps {
  name: string;
  contactIntro: string;
  location: string;
  email: string;
  website: string;
  resumeLink: string;
}

const ContactDetails: React.FC<ContactDetailsProps> = ({
  name,
  contactIntro,
  location,
  email,
  website,
  resumeLink,
}) => {
  return (
    <div className="w-full lg:w-1/2">
      <div className="text-base text-left max-w-xl text-dark-2 dark:text-light-2 ml-4 p-6 sm:p-8">
        <h2 className="text-accent-2 dark:text-accent-1 font-bold font-general-medium text-2xl mb-8">
          Contact Details
        </h2>
        <p className="text-base mt-4 mb-8">{contactIntro}</p>
        <ul>
          <li className="flex mb-4">
            <i className="text-2xl mr-4 mt-1">
              <FiUser />
            </i>
            <span className="text-lg">{name}</span>
          </li>
          <li className="flex mb-4">
            <i className="text-2xl mr-4 mt-1">
              <FiMapPin />
            </i>
            <span className="text-lg">{location}</span>
          </li>
          <li className="flex mb-4">
            <i className="text-2xl mr-4 mt-1">
              <FiMail />
            </i>
            <Link href={`mailto:${email}`} className="text-lg">
              {email}
            </Link>
          </li>
          <li className="flex mb-4">
            <i className="text-2xl mr-4 mt-1">
              <FiGlobe />
            </i>
            <span className="text-lg">
              <Link href={`http://${website}`}>{`http://${website}`}</Link>
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ContactDetails;
