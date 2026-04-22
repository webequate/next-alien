import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Hamburger from "@/components/Hamburger";

describe("Hamburger", () => {
  it("renders the toggle button", () => {
    render(<Hamburger showMenu={false} toggleMenu={vi.fn()} />);
    expect(
      screen.getByRole("button", { name: /hamburger menu/i })
    ).toBeInTheDocument();
  });

  it("calls toggleMenu when clicked", async () => {
    const toggleMenu = vi.fn();
    const user = userEvent.setup();
    render(<Hamburger showMenu={false} toggleMenu={toggleMenu} />);
    await user.click(screen.getByRole("button", { name: /hamburger menu/i }));
    expect(toggleMenu).toHaveBeenCalledOnce();
  });

  it("calls toggleMenu on every click", async () => {
    const toggleMenu = vi.fn();
    const user = userEvent.setup();
    render(<Hamburger showMenu={true} toggleMenu={toggleMenu} />);
    const btn = screen.getByRole("button", { name: /hamburger menu/i });
    await user.click(btn);
    await user.click(btn);
    expect(toggleMenu).toHaveBeenCalledTimes(2);
  });

  it("renders an SVG icon in both open and closed states", () => {
    const { rerender, container } = render(
      <Hamburger showMenu={false} toggleMenu={vi.fn()} />
    );
    expect(container.querySelector("svg")).toBeInTheDocument();

    rerender(<Hamburger showMenu={true} toggleMenu={vi.fn()} />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });
});
