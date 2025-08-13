"use client";
import { ReactNode, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function ContentFade({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const key = pathname ?? "__root__";

  if (!mounted) {
    // Avoid animations during hydration to prevent runtime errors
    return (
      <div className="w-full bg-white dark:bg-neutral-900">{children}</div>
    );
  }

  return (
    <motion.div
      key={key}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="w-full bg-white dark:bg-neutral-900"
    >
      {children}
    </motion.div>
  );
}
