import { prisma } from "@/lib/prisma";
import { mergeContent } from "./content-utils";

export { mergeContent };

/**
 * Fetch page content from the database for a given pageKey.
 */
export async function getPageContent(pageKey: string) {
  try {
    const record = await prisma.pageContent.findUnique({
      where: { pageKey },
    });
    return record ? (record.content as Record<string, any>) : null;
  } catch (error) {
    console.error(`Failed to fetch page content for key "${pageKey}":`, error);
    return null;
  }
}
