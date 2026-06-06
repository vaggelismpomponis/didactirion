import { createPageMetadata } from "@/lib/seo";
import { getPageContent, mergeContent } from "@/lib/page-content";
import { ContactPageClient } from "./ContactPageClient";
import { defaultContactContent } from "./contact-content";

export const metadata = createPageMetadata({
  title: "Επικοινωνία",
  description:
    "Επικοινωνήστε με το φροντιστήριο Διδακτήριον στις Αχαρνές. Βρείτε μας στον χάρτη ή στείλτε μας μήνυμα.",
  path: "/contact",
});

export default async function ContactPage() {
  const dbContent = await getPageContent("contact");
  const content = mergeContent(defaultContactContent, dbContent);

  return <ContactPageClient initialContent={content} />;
}
