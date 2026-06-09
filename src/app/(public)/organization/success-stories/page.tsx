export const revalidate = 0;

import { createPageMetadata } from "@/lib/seo";
import { prisma } from "@/lib/prisma";
import { getPageContent, mergeContent } from "@/lib/page-content";
import { SuccessStoriesPageClient } from "./SuccessStoriesPageClient";
import { defaultSuccessHeaderContent } from "./success-header-content";

export const metadata = createPageMetadata({
  title: "Επιτυχόντες",
  description:
    "Ιστορίες επιτυχίας μαθητών του Διδακτήριον: εισαγωγές σε πανεπιστήμια και σχολές.",
  path: "/organization/success-stories",
});

async function getSuccessStories() {
  return await prisma.successStory.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export default async function SuccessStoriesPage() {
  const stories = await getSuccessStories();
  const dbContent = await getPageContent("success-header");
  const content = mergeContent(defaultSuccessHeaderContent, dbContent);

  return <SuccessStoriesPageClient stories={stories} initialContent={content} />;
}
