import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("next/image", () => ({
  default: ({
    src,
    alt,
  }: {
    src: string;
    alt: string;
    [key: string]: unknown;
  }) => <img src={src} alt={alt} />,
}));

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
    [key: string]: unknown;
  }) => <a href={href}>{children}</a>,
}));

import PostGrid from "@/components/PostGrid";
import type { Post } from "@/types/post";

const makePost = (overrides: Partial<Post> = {}, index = 0): Post => ({
  id: index + 1,
  creation_timestamp: 1700000000,
  title: `Post ${index + 1} - Denver, CO - #allensaliens`,
  uri: `media/posts/202408/photo${index + 1}.jpg`,
  ...overrides,
});

const makePosts = (overrides: Partial<Post>[] = []): Post[] =>
  overrides.map((o, i) => makePost(o, i));

describe("PostGrid", () => {
  it("renders the correct number of post links", () => {
    render(<PostGrid posts={makePosts([{}, {}, {}])} path="posts" />);
    expect(screen.getAllByRole("link")).toHaveLength(3);
  });

  it("renders an empty grid when posts array is empty", () => {
    render(<PostGrid posts={[]} path="posts" />);
    expect(screen.queryAllByRole("link")).toHaveLength(0);
  });

  it("renders the parsed title, not the raw caption string", () => {
    render(
      <PostGrid
        posts={makePosts([{ title: "Alien Bob - Denver, CO - #allensaliens" }])}
        path="posts"
      />
    );
    expect(screen.getByText("Alien Bob")).toBeInTheDocument();
    expect(screen.queryByText("#allensaliens")).not.toBeInTheDocument();
  });

  it("renders additional caption segments as list items", () => {
    render(
      <PostGrid
        posts={makePosts([
          { title: "Title - Location A - Event B - #allensaliens" },
        ])}
        path="posts"
      />
    );
    expect(screen.getByText("Location A")).toBeInTheDocument();
    expect(screen.getByText("Event B")).toBeInTheDocument();
  });

  it("builds the correct link href from path and post id", () => {
    render(<PostGrid posts={makePosts([{ id: 42 }])} path="posts" />);
    expect(screen.getByRole("link")).toHaveAttribute("href", "/posts/42");
  });

  it("uses the first URI when uri is an array", () => {
    render(
      <PostGrid
        posts={makePosts([
          {
            uri: [
              "media/posts/202408/first.jpg",
              "media/posts/202408/second.jpg",
            ],
          },
        ])}
        path="posts"
      />
    );
    expect(screen.getByRole("img")).toHaveAttribute(
      "src",
      "/media/posts/202408/first.jpg"
    );
  });

  it("uses the uri string directly when uri is a single string", () => {
    render(
      <PostGrid
        posts={makePosts([{ uri: "media/posts/202408/single.jpg" }])}
        path="posts"
      />
    );
    expect(screen.getByRole("img")).toHaveAttribute(
      "src",
      "/media/posts/202408/single.jpg"
    );
  });

  it("uses the parsed title as the image alt text", () => {
    render(
      <PostGrid
        posts={makePosts([{ title: "Alien Bob - Denver - #allensaliens" }])}
        path="posts"
      />
    );
    expect(screen.getByRole("img")).toHaveAttribute("alt", "Alien Bob");
  });

  it("works with a 'featured' path prefix", () => {
    render(<PostGrid posts={makePosts([{ id: 5 }])} path="featured" />);
    expect(screen.getByRole("link")).toHaveAttribute("href", "/featured/5");
  });
});
