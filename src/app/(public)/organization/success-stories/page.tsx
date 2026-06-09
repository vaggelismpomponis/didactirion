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


export default async function SuccessStoriesPage() {
  const [dbContent, initialStories, total] = await Promise.all([
    getPageContent("success-header"),
    prisma.successStory.findMany({
      orderBy: { createdAt: "desc" },
      take: 30,
    }),
    prisma.successStory.count(),
  ]);

  const content = mergeContent(defaultSuccessHeaderContent, dbContent);

  return (
    <SuccessStoriesPageClient
      initialStories={initialStories}
      totalCount={total}
      initialContent={content}
    />
  );
}
