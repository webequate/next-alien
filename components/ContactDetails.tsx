// components/ContactDetails.tsx
import DownloadCV from "@/components/DownloadCV";
import Link from "next/link";
import { FiUser, FiMapPin, FiPhone, FiMail, FiGlobe } from "react-icons/fi";

interface ContactDetailsProps {
  name?: string;
  contactIntro?: string;
  location?: string;
  phone?: string;
  email?: string;
  website?: string;
  resumeLink?: string;
}

const ContactDetails: React.FC<ContactDetailsProps> = ({
  name,
  contactIntro,
  location,
  phone,
  email,
  website,
  resumeLink,
}) => {
  return (
    <div className="text-base text-left max-w-xl text-dark-2 dark:text-light-2 ml-4 p-6 sm:p-8">
      <h2 className="text-accent-dark dark:text-accent-light font-bold text-2xl mb-8">
        Contact Details
      </h2>
      {contactIntro && <p className="text-base mb-4">{contactIntro}</p>}
      <ul className="mb-6">
        {name && (
          <li className="flex mb-4">
            <i className="text-2xl mr-4 mt-1">
              <FiUser />
            </i>
            <span className="text-lg">{name}</span>
          </li>
        )}
        {location && (
          <li className="flex mb-4">
            <i className="text-2xl mr-4 mt-1">
              <FiMapPin />
            </i>
            <span className="text-lg">{location}</span>
          </li>
        )}
        {phone && (
          <li className="flex mb-4">
            <i className="text-2xl mr-4 mt-1">
              <FiPhone />
            </i>
            <span className="text-lg">{phone}</span>
          </li>
        )}
        {email && (
          <li className="flex mb-4">
            <i className="text-2xl mr-4 mt-1">
              <FiMail />
            </i>
            <span className="text-lg">
              <Link href={`mailto:${email}`}>{email}</Link>
            </span>
          </li>
        )}
        {website && (
          <li className="flex mb-4">
            <i className="text-2xl mr-4 mt-1">
              <FiGlobe />
            </i>
            <span className="text-lg">
              <Link href={`http://${website}`}>{website}</Link>
            </span>
          </li>
        )}
      </ul>
      {resumeLink && <DownloadCV resumelink={resumeLink} />}
    </div>
  );
};

export default ContactDetails;
