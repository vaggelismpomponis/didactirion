import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageTransition } from "@/components/providers/PageTransition";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
    </>
  );
}
