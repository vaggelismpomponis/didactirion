import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Φωτογραφικό Υλικό",
  description: "Στιγμές από τη ζωή και τις δραστηριότητες του Διδακτήριον.",
  path: "/organization/gallery",
});

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
