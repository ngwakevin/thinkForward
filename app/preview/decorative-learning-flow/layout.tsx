import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Decorative Learning Flow (Preview)",
  description: "Preview-only GSAP-based decorative learning flow.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
