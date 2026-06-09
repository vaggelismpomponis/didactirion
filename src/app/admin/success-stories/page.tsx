export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { SuccessStoriesListClient } from "./SuccessStoriesListClient";

async function getSuccessStories() {
  return await prisma.successStory.findMany({ orderBy: { createdAt: "desc" } });
}

export default async function SuccessStoriesPage() {
  const stories = await getSuccessStories();

  return <SuccessStoriesListClient initialStories={stories} />;
}
