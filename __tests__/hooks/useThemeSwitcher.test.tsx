import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import useThemeSwitcher from "@/hooks/useThemeSwitcher";

beforeEach(() => {
  localStorage.clear();
  document.documentElement.className = "";
});

describe("useThemeSwitcher", () => {
  it("defaults to dark theme (activeTheme is 'light')", () => {
    const { result } = renderHook(() => useThemeSwitcher());
    const [activeTheme] = result.current;
    // hook returns [activeTheme, setTheme]; activeTheme is the toggle target
    // default theme = "dark" → activeTheme = "light"
    expect(activeTheme).toBe("light");
  });

  it("restores a saved light theme from localStorage on mount", () => {
    localStorage.setItem("theme", "light");
    const { result } = renderHook(() => useThemeSwitcher());
    const [activeTheme] = result.current;
    // theme restored to "light" → activeTheme = "dark"
    expect(activeTheme).toBe("dark");
  });

  it("leaves theme as dark when localStorage is empty", () => {
    const { result } = renderHook(() => useThemeSwitcher());
    const [activeTheme] = result.current;
    expect(activeTheme).toBe("light"); // theme="dark"
  });

  it("adds the current theme class to documentElement on mount", () => {
    renderHook(() => useThemeSwitcher());
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("swaps the documentElement class when setTheme is called", () => {
    const { result } = renderHook(() => useThemeSwitcher());
    act(() => {
      result.current[1]("light");
    });
    expect(document.documentElement.classList.contains("light")).toBe(true);
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  it("persists the new theme to localStorage when setTheme is called", () => {
    const { result } = renderHook(() => useThemeSwitcher());
    act(() => {
      result.current[1]("light");
    });
    expect(localStorage.getItem("theme")).toBe("light");
  });

  it("does not re-read localStorage when theme changes (loop fix)", () => {
    // Effect 1 has deps=[] so it should only run on mount.
    // If it had [theme] deps (the bug), it would call getItem on every change.
    localStorage.setItem("theme", "light");
    const { result } = renderHook(() => useThemeSwitcher());

    // Spy AFTER mount so we only catch post-mount reads
    const getSpy = vi.spyOn(Storage.prototype, "getItem");

    act(() => {
      result.current[1]("dark");
    });

    expect(getSpy).not.toHaveBeenCalled();
    getSpy.mockRestore();
  });
});
