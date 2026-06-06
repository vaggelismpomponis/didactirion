import { createPageMetadata } from "@/lib/seo";
import { getPageContent, mergeContent } from "@/lib/page-content";
import { PrivacyPolicyClient } from "./PrivacyPolicyClient";
import { defaultPrivacyContent } from "./privacy-content";

export const metadata = createPageMetadata({
  title: "Πολιτική Απορρήτου",
  description: "Πολιτική απορρήτου και προστασίας προσωπικών δεδομένων Διδακτήριον.",
  path: "/privacy-policy",
});

export default async function PrivacyPolicyPage() {
  const dbContent = await getPageContent("privacy-policy");
  const content = mergeContent(defaultPrivacyContent, dbContent);

  return <PrivacyPolicyClient initialContent={content} />;
}
