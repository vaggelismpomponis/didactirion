import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import { LoadingScreen } from "@/components/providers/LoadingScreen";
import { getSiteUrl } from "@/lib/site";

const openSans = Open_Sans({
  subsets: ["latin", "greek"],
  weight: ["400", "700"],
  variable: "--font-open-sans",
  display: "swap",
  adjustFontFallback: true,
  preload: true,
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Διδακτήριον - Εκπαιδευτικός Οργανισμός",
    template: "%s | Διδακτήριον",
  },
  description:
    "Απαίτησε την κορυφή! Φροντιστήριο Μέσης Εκπαίδευσης στις Αχαρνές.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Διδακτήριον - Εκπαιδευτικός Οργανισμός",
    description:
      "Απαίτησε την κορυφή! Φροντιστήριο Μέσης Εκπαίδευσης στις Αχαρνές.",
    url: siteUrl,
    siteName: "Διδακτήριον",
    locale: "el_GR",
    type: "website",
    images: ["/logo-main.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="el"
      className={`${openSans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans">
        <LoadingScreen />
        <Suspense fallback={null}>{children}</Suspense>
      </body>
    </html>
  );
}
