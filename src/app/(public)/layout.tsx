import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ClientProviders } from "@/components/providers/ClientProviders";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <ClientProviders>{children}</ClientProviders>
      </main>
      <Footer />
    </>
  );
}
