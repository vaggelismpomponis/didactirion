import { Suspense } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { InlineEditBridge } from "@/components/admin/InlineEditBridge";
import { getPageContent, mergeContent } from "@/lib/page-content";
import { defaultContactContent } from "./contact/contact-content";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const dbContent = await getPageContent("contact");
  const contactContent = mergeContent(defaultContactContent, dbContent);

  return (
    <>
      <Suspense fallback={null}>
        <InlineEditBridge />
      </Suspense>
      <Header contactContent={contactContent} />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer contactContent={contactContent} />
    </>
  );
}
