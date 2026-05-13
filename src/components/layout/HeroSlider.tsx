"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Banner {
  id: string;
  title: string | null;
  image: string;
  link: string | null;
}

export function HeroSlider({ banners }: { banners: Banner[] }) {
  const [current, setCurrent] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  // ── Fallback Hero (no banners in DB) ──
  if (banners.length === 0) {
    return (
      <section className="relative min-h-[70vh] sm:min-h-[80vh] md:min-h-[88vh] flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 hero-gradient" />

        {/* Decorative circles */}
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-white/5 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-white/5 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-white/10 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-white/5 pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10 text-white text-center">


          <h1
            className={cn(
              "text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tight leading-[0.9] transition-all duration-700 delay-100",
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            )}
          >
            Απαίτησε
            <br />
            <span className="text-blue-200">την κορυφή!</span>
          </h1>

          <p
            className={cn(
              "text-base sm:text-lg md:text-2xl mb-10 sm:mb-12 text-blue-100/80 max-w-2xl mx-auto leading-relaxed transition-all duration-700 delay-200",
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            )}
          >
            Ολοκληρωμένη εκπαίδευση με επίκεντρο τον μαθητή.
            Φροντιστήριο Μέσης Εκπαίδευσης στις Αχαρνές.
          </p>

          <div
            className={cn(
              "flex flex-wrap items-center justify-center gap-4 transition-all duration-700 delay-300",
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            )}
          >
            <Button
              size="lg"
              asChild
              className="bg-white text-primary hover:bg-white/90 font-bold px-8 h-14 text-base shadow-xl shadow-black/20 hover:shadow-2xl hover:shadow-black/30 transition-all"
            >
              <Link href="/curricula/high-school">Προγράμματα Σπουδών</Link>
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

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40 text-xs">
          <div className="w-px h-12 bg-gradient-to-b from-transparent to-white/30 animate-pulse" />
          scroll
        </div>
      </section>
    );
  }

  // ── Slider Hero ──
  return (
    <section className="relative min-h-[70vh] sm:min-h-[80vh] md:min-h-[88vh] w-full overflow-hidden">
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000 flex items-center justify-center",
            index === current ? "opacity-100 z-10" : "opacity-0 z-0"
          )}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20 z-10" />
          <img
            src={banner.image}
            alt={banner.title || ""}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="container mx-auto px-4 relative z-20 text-white max-w-4xl">

            <h1 className="text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-tight animate-in fade-in slide-in-from-bottom-8 duration-700 mb-4 sm:mb-6">
              {banner.title || "Απαίτησε την κορυφή!"}
            </h1>
            {banner.link && (
              <div className="pt-4 flex gap-4">
                <Button size="lg" asChild className="bg-white text-primary hover:bg-white/90 font-bold px-8 h-14 text-base shadow-xl">
                  <Link href={banner.link}>Μάθετε Περισσότερα</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      {banners.length > 1 && (
        <>
          <button
            onClick={() => setCurrent((prev) => (prev - 1 + banners.length) % banners.length)}
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-3 rounded-full bg-white/15 hover:bg-white/30 text-white backdrop-blur border border-white/20 transition-all hover:scale-110"
            aria-label="Previous"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrent((prev) => (prev + 1) % banners.length)}
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-3 rounded-full bg-white/15 hover:bg-white/30 text-white backdrop-blur border border-white/20 transition-all hover:scale-110"
            aria-label="Next"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dot indicators */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`Slide ${i + 1}`}
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  i === current ? "bg-white w-8" : "bg-white/40 w-2 hover:bg-white/70"
                )}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
