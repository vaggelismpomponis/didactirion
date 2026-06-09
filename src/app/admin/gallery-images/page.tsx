export const dynamic = "force-dynamic";

import { getPageContent, mergeContent } from "@/lib/page-content";
import { defaultGalleryContent } from "@/app/(public)/organization/gallery/gallery-content";
import { GalleryImagesClient } from "./GalleryImagesClient";

export default async function AdminGalleryImagesPage() {
  const dbContent = await getPageContent("gallery");
  const content = mergeContent(defaultGalleryContent, dbContent);

  return <GalleryImagesClient initialContent={content} />;
}
