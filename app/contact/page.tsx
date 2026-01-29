import basics from "@/data/basics.json";
import type { Metadata } from "next";
import { generateBaseMetadata } from "@/lib/metadata";
import ContentFade from "@/components/ContentFade";
import ContactForm from "@/components/ContactForm";
import ContactDetails from "@/components/ContactDetails";

export const metadata: Metadata = {
  ...generateBaseMetadata(
    `Contact | ${basics.name}`,
    "Send a message to Allen's Aliens. Get in touch to share your own alien or learn more.",
    "/contact",
    "https://allensaliens.com/images/og-alien.jpg"
  ),
  openGraph: {
    ...generateBaseMetadata(
      `Contact | ${basics.name}`,
      "Send a message to Allen's Aliens. Get in touch to share your own alien or learn more.",
      "/contact",
      "https://allensaliens.com/images/og-alien.jpg"
    ).openGraph,
    images: [
      {
        url: "https://allensaliens.com/images/og-alien.jpg",
        width: 1200,
        height: 630,
        alt: basics.name,
      },
    ],
  },
};

export default function ContactPage() {
  return (
    <ContentFade>
      <div>
        <div className="flex flex-col-reverse lg:flex-row text-base text-dark-2 dark:text-light-2">
          <div className="w-full lg:w-1/2 mb-10 lg:mb-0 md:mr-6">
            <ContactForm />
          </div>

          <div className="w-full lg:w-1/2 mb-10 lg:mb-0 md:ml-6">
            <ContactDetails
              name={basics.name}
              contactIntro={basics.contactIntro}
              location={basics.location}
              email={basics.email}
              website={basics.website}
            />
          </div>
        </div>
      </div>
    </ContentFade>
  );
}
