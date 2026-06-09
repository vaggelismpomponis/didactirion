import { createPageMetadata } from "@/lib/seo";
import { getPageContent, mergeContent } from "@/lib/page-content";
import { GalleryPageClient } from "./GalleryPageClient";
import { defaultGalleryContent } from "./gallery-content";

export const metadata = createPageMetadata({
  title: "Φωτογραφικό Υλικό",
  description:
    "Περιηγηθείτε στις εγκαταστάσεις μας και δείτε στιγμιότυπα από την καθημερινή ζωή στο φροντιστήριο Διδακτήριον.",
  path: "/organization/gallery",
});

export default async function GalleryPage() {
  const dbContent = await getPageContent("gallery");
  const content = mergeContent(defaultGalleryContent, dbContent);
  
  content.images = [];

  return <GalleryPageClient initialContent={content} />;
}
