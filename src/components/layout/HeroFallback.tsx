import Link from "next/link";
import { Button } from "@/components/ui/button";

/** Server-rendered hero so LCP text paints without waiting for client JS. */
export function HeroFallback() {
  return (
    <section className="hero-lcp relative min-h-[70vh] sm:min-h-[80vh] md:min-h-[88vh] flex items-center justify-center overflow-hidden" role="banner" aria-label="Κύριο banner">
      <div className="absolute inset-0 hero-gradient" />

      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-white/5 max-sm:hidden blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-white/5 max-sm:hidden blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-white/10 pointer-events-none max-sm:w-[min(100vw,400px)] max-sm:h-[min(100vw,400px)]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-white/5 pointer-events-none max-sm:w-[min(80vw,300px)] max-sm:h-[min(80vw,300px)]" />

      <div className="container mx-auto px-4 relative z-10 text-white text-center">
        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight leading-[0.9]">
          Απαίτησε
          <br />
          <span className="text-blue-200">την κορυφή!</span>
        </h1>

        <p className="text-base sm:text-lg md:text-2xl mb-10 sm:mb-12 text-blue-100/80 max-w-2xl mx-auto leading-relaxed">
          Ολοκληρωμένη εκπαίδευση με επίκεντρο τον μαθητή.
          Φροντιστήριο Μέσης Εκπαίδευσης στις Αχαρνές.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button
            size="lg"
            asChild
            className="bg-white text-primary hover:bg-white/90 font-bold px-8 h-14 text-base shadow-xl shadow-black/20 hover:shadow-2xl hover:shadow-black/30 transition-all"
          >
            <Link href="/curricula/high-school-a">Προγράμματα Σπουδών</Link>
          </Button>
          <Button
            size="lg"
            asChild
            variant="outline"
            className="border-white/60 text-white hover:text-white bg-white/10 hover:bg-white/20 font-bold px-8 h-14 text-base backdrop-blur-sm"
          >
            <Link href="/contact">Επικοινωνία</Link>
          </Button>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40 text-xs max-sm:hidden">
        <div className="w-px h-12 bg-gradient-to-b from-transparent to-white/30 animate-pulse" />
        scroll
      </div>
    </section>
  );
}
