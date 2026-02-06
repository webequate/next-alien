"use client";
import { ReactNode, useEffect } from "react";

let hasNavigated = false;

export default function ContentFade({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (!hasNavigated) {
      hasNavigated = true;
    }
  }, []);

  return (
    <div
      className={`w-full bg-white dark:bg-neutral-900${
        hasNavigated ? " fade-in" : ""
      }`}
    >
      {children}
    </div>
  );
}
