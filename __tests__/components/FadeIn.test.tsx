import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import FadeIn from "@/components/FadeIn";

describe("FadeIn", () => {
  it("renders its children", () => {
    const { getByText } = render(
      <FadeIn>
        <span>Hello</span>
      </FadeIn>
    );
    expect(getByText("Hello")).toBeInTheDocument();
  });

  it("applies the default animation delay of 0.2s", () => {
    const { container } = render(
      <FadeIn>
        <span>Content</span>
      </FadeIn>
    );
    expect((container.firstChild as HTMLElement).style.animationDelay).toBe(
      "0.2s"
    );
  });

  it("applies a custom delay", () => {
    const { container } = render(
      <FadeIn delay={0.6}>
        <span>Content</span>
      </FadeIn>
    );
    expect((container.firstChild as HTMLElement).style.animationDelay).toBe(
      "0.6s"
    );
  });

  it("applies zero delay when delay={0}", () => {
    const { container } = render(
      <FadeIn delay={0}>
        <span>Content</span>
      </FadeIn>
    );
    expect((container.firstChild as HTMLElement).style.animationDelay).toBe(
      "0s"
    );
  });

  it("forwards the className prop alongside the base class", () => {
    const { container } = render(
      <FadeIn className="my-custom-class">
        <span>Content</span>
      </FadeIn>
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass("fade-in-delayed");
    expect(wrapper).toHaveClass("my-custom-class");
  });
});
