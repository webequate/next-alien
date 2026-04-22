import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NavButton from "@/components/NavButton";

describe("NavButton — previous direction", () => {
  it("renders a clickable element with the correct aria-label when enabled", () => {
    render(<NavButton handler={vi.fn()} previous={true} enabled={true} />);
    expect(screen.getByLabelText("Previous Image")).toBeInTheDocument();
  });

  it("calls handler when clicked and enabled", async () => {
    const handler = vi.fn();
    const user = userEvent.setup();
    render(<NavButton handler={handler} previous={true} enabled={true} />);
    await user.click(screen.getByLabelText("Previous Image"));
    expect(handler).toHaveBeenCalledOnce();
  });

  it("renders an aria-hidden placeholder (no interactive label) when disabled", () => {
    render(<NavButton handler={vi.fn()} previous={true} enabled={false} />);
    expect(screen.queryByLabelText("Previous Image")).not.toBeInTheDocument();
    expect(document.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
  });
});

describe("NavButton — next direction", () => {
  it("renders a clickable element with the correct aria-label when enabled", () => {
    render(<NavButton handler={vi.fn()} previous={false} enabled={true} />);
    expect(screen.getByLabelText("Next Image")).toBeInTheDocument();
  });

  it("calls handler when clicked and enabled", async () => {
    const handler = vi.fn();
    const user = userEvent.setup();
    render(<NavButton handler={handler} previous={false} enabled={true} />);
    await user.click(screen.getByLabelText("Next Image"));
    expect(handler).toHaveBeenCalledOnce();
  });

  it("renders an aria-hidden placeholder (no interactive label) when disabled", () => {
    render(<NavButton handler={vi.fn()} previous={false} enabled={false} />);
    expect(screen.queryByLabelText("Next Image")).not.toBeInTheDocument();
    expect(document.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
  });
});
