import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
}));

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    className,
    "aria-label": ariaLabel,
  }: {
    children: React.ReactNode;
    href: string;
    className?: string;
    "aria-label"?: string;
    [key: string]: unknown;
  }) => (
    <a href={href} className={className} aria-label={ariaLabel}>
      {children}
    </a>
  ),
}));

vi.mock("@/components/AllensAliens", () => ({
  default: () => <span>Logo</span>,
}));

vi.mock("@/components/ThemeSwitcher", () => ({
  default: () => null,
}));

vi.mock("@/components/SocialButton", () => ({
  default: () => null,
}));

import { usePathname } from "next/navigation";
import Header from "@/components/Header";

const mockPathname = usePathname as ReturnType<typeof vi.fn>;

const socialLink = {
  name: "instagram",
  handle: "real_allens_aliens",
  url: "https://instagram.com/real_allens_aliens",
};

// Scope link queries to .nav-primary so we hit the desktop nav links,
// not the logo link (which also has aria-label="Home" but never gets "active").
const getDesktopNav = () => {
  const nav = document.querySelector(".nav-primary");
  if (!nav) throw new Error(".nav-primary not found");
  return within(nav as HTMLElement);
};

describe("Header — isActive nav highlighting", () => {
  it.each(["/", "/posts/1", "/posts/123"])(
    "marks Home active on '%s'",
    (path) => {
      mockPathname.mockReturnValue(path);
      render(<Header socialLink={socialLink} />);
      expect(getDesktopNav().getByRole("link", { name: /home/i })).toHaveClass(
        "active"
      );
    }
  );

  it.each(["/about", "/about/details", "/featured/1", "/featured/99"])(
    "marks About active on '%s'",
    (path) => {
      mockPathname.mockReturnValue(path);
      render(<Header socialLink={socialLink} />);
      expect(
        getDesktopNav().getByRole("link", { name: /about/i })
      ).toHaveClass("active");
    }
  );

  it.each(["/contact", "/contact/form"])(
    "marks Contact active on '%s'",
    (path) => {
      mockPathname.mockReturnValue(path);
      render(<Header socialLink={socialLink} />);
      expect(
        getDesktopNav().getByRole("link", { name: /contact/i })
      ).toHaveClass("active");
    }
  );

  it("does not mark About or Contact active on a posts route", () => {
    mockPathname.mockReturnValue("/posts/1");
    render(<Header socialLink={socialLink} />);
    const nav = getDesktopNav();
    expect(nav.getByRole("link", { name: /about/i })).not.toHaveClass("active");
    expect(nav.getByRole("link", { name: /contact/i })).not.toHaveClass(
      "active"
    );
  });

  it("does not mark Home active on the contact page", () => {
    mockPathname.mockReturnValue("/contact");
    render(<Header socialLink={socialLink} />);
    expect(
      getDesktopNav().getByRole("link", { name: /home/i })
    ).not.toHaveClass("active");
  });
});

describe("Header — mobile menu", () => {
  beforeEach(() => {
    mockPathname.mockReturnValue("/");
  });

  it("mobile nav is initially hidden (no 'show' class)", () => {
    render(<Header socialLink={socialLink} />);
    expect(document.querySelector(".nav-mobile")).not.toHaveClass("show");
  });

  it("shows mobile nav when the hamburger is clicked", async () => {
    const user = userEvent.setup();
    render(<Header socialLink={socialLink} />);
    await user.click(screen.getByRole("button", { name: /hamburger menu/i }));
    expect(document.querySelector(".nav-mobile")).toHaveClass("show");
  });

  it("hides mobile nav on a second hamburger click", async () => {
    const user = userEvent.setup();
    render(<Header socialLink={socialLink} />);
    const btn = screen.getByRole("button", { name: /hamburger menu/i });
    await user.click(btn);
    await user.click(btn);
    expect(document.querySelector(".nav-mobile")).not.toHaveClass("show");
  });
});
