import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Επικοινωνία",
  description:
    "Επικοινωνήστε με το Διδακτήριον: Θρακομακεδόνων 97, Αχαρνές, τηλ. 210 2448542, didactirion@gmail.com.",
  path: "/contact",
});

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
