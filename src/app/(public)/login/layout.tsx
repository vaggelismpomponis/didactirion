import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Σύνδεση Διαχείρισης",
  description: "Περιοχή διαχείρισης περιεχομένου Διδακτήριον.",
  path: "/login",
  noIndex: true,
});

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
