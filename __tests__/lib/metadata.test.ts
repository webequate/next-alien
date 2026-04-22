import { describe, it, expect } from "vitest";
import { generateBaseMetadata, generatePostMetadata } from "@/lib/metadata";

// basics.website = "allensaliens.com"; NEXT_PUBLIC_SITE_URL is unset in tests,
// so the module-level fallback resolves to "https://allensaliens.com".
const SITE_URL = "https://allensaliens.com";
const SITE_NAME = "Allen's Aliens";
const DEFAULT_OG = "https://allensaliens.com/images/alien-og.jpg";

describe("generateBaseMetadata", () => {
  it("sets title and description", () => {
    const meta = generateBaseMetadata("Home", "Welcome to the site", "/");
    expect(meta.title).toBe("Home");
    expect(meta.description).toBe("Welcome to the site");
  });

  it("sets the canonical path as alternates.canonical", () => {
    const meta = generateBaseMetadata("About", "About us", "/about");
    expect(meta.alternates?.canonical).toBe("/about");
  });

  it("sets openGraph title, siteName, type, and url", () => {
    const meta = generateBaseMetadata("Home", "Welcome", "/");
    const og = meta.openGraph as Record<string, unknown>;
    expect(og.title).toBe("Home");
    expect(og.siteName).toBe(SITE_NAME);
    expect(og.type).toBe("website");
    expect(og.url).toBe(`${SITE_URL}/`);
  });

  it("uses the default OG image when imageUrl is not provided", () => {
    const meta = generateBaseMetadata("Home", "Welcome", "/");
    const og = meta.openGraph as { images: Array<{ url: string }> };
    expect(og.images[0].url).toBe(DEFAULT_OG);
  });

  it("uses a provided imageUrl over the default", () => {
    const custom = "https://allensaliens.com/images/custom.jpg";
    const meta = generateBaseMetadata("Home", "Welcome", "/", custom);
    const og = meta.openGraph as { images: Array<{ url: string }> };
    expect(og.images[0].url).toBe(custom);
  });

  it("defaults twitter card to summary_large_image", () => {
    const meta = generateBaseMetadata("Home", "Welcome", "/");
    expect(meta.twitter?.card).toBe("summary_large_image");
  });

  it("accepts a custom twitter card type", () => {
    const meta = generateBaseMetadata(
      "Home",
      "Welcome",
      "/",
      undefined,
      "summary"
    );
    expect(meta.twitter?.card).toBe("summary");
  });
});

describe("generatePostMetadata", () => {
  it("appends the site name to the title", () => {
    const meta = generatePostMetadata("Alien Bob", 42, "posts");
    expect(meta.title).toBe(`Alien Bob | ${SITE_NAME}`);
  });

  it("truncates description to 160 characters", () => {
    const longTitle = "A".repeat(200);
    const meta = generatePostMetadata(longTitle, 42, "posts");
    expect((meta.description as string).length).toBe(160);
  });

  it("builds the correct canonical path from prefix and id", () => {
    const meta = generatePostMetadata("Alien Bob", 42, "posts");
    expect(meta.alternates?.canonical).toBe("/posts/42");
  });

  it("uses 'article' as the openGraph type", () => {
    const meta = generatePostMetadata("Alien Bob", 42, "posts");
    const og = meta.openGraph as Record<string, unknown>;
    expect(og.type).toBe("article");
  });

  it("always uses summary_large_image for the twitter card", () => {
    const meta = generatePostMetadata("Alien Bob", 42, "posts");
    expect(meta.twitter?.card).toBe("summary_large_image");
  });

  it("uses a provided imageUrl as the OG image", () => {
    const img = "https://allensaliens.com/media/posts/202408/photo.jpg";
    const meta = generatePostMetadata("Alien Bob", 42, "posts", img);
    const og = meta.openGraph as { images: Array<{ url: string }> };
    expect(og.images[0].url).toBe(img);
  });

  it("falls back to the default OG image when imageUrl is not provided", () => {
    const meta = generatePostMetadata("Alien Bob", 42, "posts");
    const og = meta.openGraph as { images: Array<{ url: string }> };
    expect(og.images[0].url).toBe(DEFAULT_OG);
  });

  it("works with the 'featured' prefix", () => {
    const meta = generatePostMetadata("Alien Bob", 5, "featured");
    expect(meta.alternates?.canonical).toBe("/featured/5");
  });
});
