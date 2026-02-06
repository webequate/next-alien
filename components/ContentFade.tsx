"use client";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";

export default function ContentFade({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const key = pathname ?? "__root__";

  return (
    <div key={key} className="w-full bg-white dark:bg-neutral-900 fade-in">
      {children}
    </div>
  );
}
