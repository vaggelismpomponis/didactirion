export const revalidate = 3600;

import { createPageMetadata } from "@/lib/seo";
import { prisma } from "@/lib/prisma";
import { getPageContent, mergeContent } from "@/lib/page-content";
import { AnnouncementsPageClient } from "./AnnouncementsPageClient";
import { defaultAnnouncementsHeaderContent } from "./announcements-header-content";

export const metadata = createPageMetadata({
  title: "Ανακοινώσεις & Άρθρα",
  description:
    "Νέα, ανακοινώσεις και άρθρα από το Διδακτήριον: εξετάσεις, προγράμματα και εκπαιδευτικές ενημερώσεις.",
  path: "/announcements",
});

async function getPosts() {
  return await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });
}

export default async function AnnouncementsPage() {
  const posts = await getPosts();
  const dbContent = await getPageContent("announcements-header");
  const content = mergeContent(defaultAnnouncementsHeaderContent, dbContent);

  // Map database dates to ISO/plain values for hydration safety
  const plainPosts = posts.map(post => ({
    ...post,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  }));

  return <AnnouncementsPageClient posts={plainPosts} initialContent={content} />;
}
