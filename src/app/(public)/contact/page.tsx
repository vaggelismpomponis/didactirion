import { createPageMetadata } from "@/lib/seo";
import { ContactPageClient } from "./ContactPageClient";

export const metadata = createPageMetadata({
  title: "Επικοινωνία",
  description:
    "Επικοινωνήστε με το φροντιστήριο Διδακτήριον στις Αχαρνές. Βρείτε μας στον χάρτη ή στείλτε μας μήνυμα.",
  path: "/contact",
});

export default function ContactPage() {
  return <ContactPageClient />;
}
