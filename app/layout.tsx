import "@/styles/globals.css";
import { ReactNode } from "react";
import { Providers } from "./providers";
import basics from "@/data/basics.json";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import UseScrollToTop from "@/hooks/useScrollToTop";
import type { Metadata, Viewport } from "next";
import { GoogleTagManager } from "@next/third-parties/google";
// Note: Bruno font is applied selectively via next/font inside the header title component only.

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || `https://${basics.website}`;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "black" },
    { media: "(prefers-color-scheme: light)", color: "white" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: basics.name,
    template: `%s | ${basics.name}`,
  },
  description: basics.description || basics.name,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    siteName: basics.name,
    url: siteUrl,
    images: [
      {
        url: "https://allensaliens.com/images/alien-og.jpg",
        alt: "Allen's Aliens",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: basics.name,
    description: basics.description || basics.name,
    images: ["https://allensaliens.com/images/alien-og.jpg"],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const name = basics.name;
  const socialLinks = basics.socialLinks;
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="flex flex-col bg-light-1 dark:bg-black">
        <Providers>
          <div className="mx-auto w-full max-w-7xl sm:px-8 lg:px-16">
            <main className="w-full min-h-screen bg-white dark:bg-neutral-900 sm:border-x border-dark-3 dark:border-light-3 px-6 sm:px-8 lg:px-16">
              {/* Static header */}
              <Header socialLink={socialLinks[0]} />

              {/* Page content (no global fade) */}
              {children}

              {/* Static footer */}
              <Footer name={name} socialLinks={socialLinks} />

              {/* Scroll to top button */}
              <UseScrollToTop />
            </main>
          </div>
        </Providers>
        {/* GTM */}
        {process.env.NEXT_PUBLIC_GTM_ID && (
          <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID as string} />
        )}
      </body>
    </html>
  );
}
