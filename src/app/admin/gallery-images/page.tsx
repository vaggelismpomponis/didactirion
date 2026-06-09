export const dynamic = "force-dynamic";

import { getPageContent, mergeContent } from "@/lib/page-content";
import { defaultGalleryContent } from "@/app/(public)/organization/gallery/gallery-content";
import { GalleryImagesClient } from "./GalleryImagesClient";
import { prisma } from "@/lib/prisma";

export default async function AdminGalleryImagesPage() {
  const [dbContent, dbImages] = await Promise.all([
    getPageContent("gallery"),
    prisma.galleryImage.findMany({ orderBy: { order: "asc" } }),
  ]);
  
  const content = mergeContent(defaultGalleryContent, dbContent);
  
  if (dbImages.length > 0) {
    content.images = dbImages;
  } else if (dbContent && Array.isArray(dbContent.images)) {
    // If the database has images in the pageContent table (from legacy config or single test upload), use them
    content.images = dbContent.images;
  }

  return <GalleryImagesClient initialContent={content} />;
}
