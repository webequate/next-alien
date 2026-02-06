"use client";

import React from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
};

export default function FadeIn({
  children,
  className = "",
  delay = 0.2,
}: Props) {
  const animationDelay = `${delay}s`;
  return (
    <div
      className={`fade-in-delayed ${className}`}
      style={{ animationDelay }}
    >
      {children}
    </div>
  );
}
