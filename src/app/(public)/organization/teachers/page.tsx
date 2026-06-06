export const revalidate = 3600;

import { createPageMetadata } from "@/lib/seo";
import { prisma } from "@/lib/prisma";
import { getPageContent, mergeContent } from "@/lib/page-content";
import { TeachersPageClient } from "./TeachersPageClient";
import { defaultTeachersHeaderContent } from "./teachers-header-content";

export const metadata = createPageMetadata({
  title: "Οι Καθηγητές μας",
  description:
    "Γνωρίστε την έμπειρη εκπαιδευτική ομάδα του Διδακτήριον: καθηγητές με πάθος για τη διδασκαλία και την επιτυχία κάθε μαθητή.",
  path: "/organization/teachers",
});

async function getTeachers() {
  return await prisma.teacher.findMany({ orderBy: { order: "asc" } });
}

export default async function TeachersPage() {
  const teachers = await getTeachers();
  const dbContent = await getPageContent("teachers-header");
  const content = mergeContent(defaultTeachersHeaderContent, dbContent);

  return <TeachersPageClient teachers={teachers} initialContent={content} />;
}
