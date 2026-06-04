"use client";

import * as React from "react";
import dynamic from "next/dynamic";

const PageTransition = dynamic(
  () => import("./PageTransition").then((mod) => mod.PageTransition),
  { ssr: false }
);

const ScrollReveal = dynamic(
  () => import("./ScrollReveal").then((mod) => mod.ScrollReveal),
  { ssr: false }
);

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <PageTransition>
      <ScrollReveal>{children}</ScrollReveal>
    </PageTransition>
  );
}
