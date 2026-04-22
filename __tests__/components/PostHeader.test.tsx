import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    "aria-label": ariaLabel,
    title,
  }: {
    children: React.ReactNode;
    href: string;
    "aria-label"?: string;
    title?: string;
    [key: string]: unknown;
  }) => (
    <a href={href} aria-label={ariaLabel} title={title}>
      {children}
    </a>
  ),
}));

import PostHeader from "@/components/PostHeader";

describe("PostHeader", () => {
  it("renders the post title", () => {
    render(<PostHeader title="Alien Bob" path="posts" />);
    expect(
      screen.getByRole("heading", { name: "Alien Bob" })
    ).toBeInTheDocument();
  });

  it("renders a previous link when prevId is provided", () => {
    render(<PostHeader title="Post" prevId={41} path="posts" />);
    expect(
      screen.getByRole("link", { name: /previous post/i })
    ).toHaveAttribute("href", "/posts/41");
  });

  it("renders no previous link when prevId is absent", () => {
    render(<PostHeader title="Post" path="posts" />);
    expect(
      screen.queryByRole("link", { name: /previous post/i })
    ).not.toBeInTheDocument();
  });

  it("renders a next link when nextId is provided", () => {
    render(<PostHeader title="Post" nextId={43} path="posts" />);
    expect(
      screen.getByRole("link", { name: /next post/i })
    ).toHaveAttribute("href", "/posts/43");
  });

  it("renders no next link when nextId is absent", () => {
    render(<PostHeader title="Post" path="posts" />);
    expect(
      screen.queryByRole("link", { name: /next post/i })
    ).not.toBeInTheDocument();
  });

  it("uses the path prop in both prev and next hrefs", () => {
    render(<PostHeader title="Post" prevId={10} nextId={12} path="featured" />);
    expect(
      screen.getByRole("link", { name: /previous post/i })
    ).toHaveAttribute("href", "/featured/10");
    expect(
      screen.getByRole("link", { name: /next post/i })
    ).toHaveAttribute("href", "/featured/12");
  });

  it("renders invisible layout placeholders when both prev and next are absent", () => {
    const { container } = render(<PostHeader title="Post" path="posts" />);
    const invisibles = container.querySelectorAll(".invisible");
    expect(invisibles).toHaveLength(2);
  });
});
