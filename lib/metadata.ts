import type { Metadata } from "next";
import basics from "@/data/basics.json";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || `https://${basics.website}`;
const ogImage = "https://allensaliens.com/images/alien-og.jpg";

export function generateBaseMetadata(
  title: string,
  description: string,
  path: string,
  imageUrl?: string,
  twitterCardType: "summary" | "summary_large_image" = "summary_large_image"
): Metadata {
  const fullUrl = `${siteUrl}${path}`;
  const image = imageUrl || ogImage;

  return {
    title,
    description,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: path,
    },
    openGraph: {
      title,
      description,
      url: fullUrl,
      siteName: basics.name,
      images: [
        {
          url: image,
          alt: basics.name,
        },
      ],
      type: "website",
    },
    twitter: {
      card: twitterCardType,
      title,
      description,
      images: [image],
    },
  };
}

export function generatePostMetadata(
  postTitle: string,
  postId: string | number,
  prefix: string,
  imageUrl?: string
): Metadata {
  const path = `/${prefix}/${postId}`;
  const description = postTitle.substring(0, 160);
  const image = imageUrl || ogImage;
  const fullUrl = `${siteUrl}${path}`;
  const pageTitle = `${postTitle} | ${basics.name}`;

  return {
    title: pageTitle,
    description,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: path,
    },
    openGraph: {
      title: pageTitle,
      description,
      url: fullUrl,
      siteName: basics.name,
      images: [
        {
          url: image,
          alt: postTitle,
        },
      ],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
      images: [image],
    },
  };
}
