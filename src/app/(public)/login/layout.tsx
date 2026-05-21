import { createPageMetadata } from "@/lib/seo";
import { AuthProvider } from "@/components/providers/AuthProvider";

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
  return <AuthProvider>{children}</AuthProvider>;
}
