import type { Metadata } from "next";
import { Rubik, Open_Sans } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { LoadingScreen } from "@/components/providers/LoadingScreen";
import { getSiteUrl } from "@/lib/site";

const rubik = Rubik({
  subsets: ["latin"],
  variable: "--font-rubik",
  display: "swap",
});

const openSans = Open_Sans({
  subsets: ["latin", "greek"],
  variable: "--font-open-sans",
  display: "swap",
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
      className={`${rubik.variable} ${openSans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans">
        <LoadingScreen />
        <AuthProvider>
          <Suspense fallback={null}>
            {children}
          </Suspense>
        </AuthProvider>
      </body>
    </html>
  );
}
