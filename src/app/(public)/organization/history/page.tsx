import { createPageMetadata } from "@/lib/seo";
import { getPageContent, mergeContent } from "@/lib/page-content";
import { HistoryPageClient } from "./HistoryPageClient";
import { defaultHistoryContent } from "./history-content";

export const metadata = createPageMetadata({
  title: "Ιστορία & Φιλοσοφία",
  description:
    "Η ιστορία, η φιλοσοφία και το όραμα του Διδακτήριον από το 2009: σύγχρονη εκπαίδευση και ολιγομελή τμήματα στις Αχαρνές.",
  path: "/organization/history",
});

export default async function HistoryPage() {
  const dbContent = await getPageContent("history");
  const content = mergeContent(defaultHistoryContent, dbContent);

  return <HistoryPageClient initialContent={content} />;
}
