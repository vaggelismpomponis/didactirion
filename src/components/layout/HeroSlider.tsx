"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface Banner {
  id: string;
  title: string | null;
  image: string;
  link: string | null;
}

export function HeroSlider({ banners }: { banners: Banner[] }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  return (
    <section className="hero-lcp relative min-h-[70vh] sm:min-h-[80vh] md:min-h-[88vh] w-full overflow-hidden">
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000 flex items-center justify-center",
            index === current ? "opacity-100 z-10" : "opacity-0 z-0"
          )}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20 z-10" />
          <Image
            src={banner.image}
            alt={banner.title || ""}
            fill
            className="object-cover"
            priority={index === 0}
            sizes="100vw"
            quality={75}
          />
          <div className="container mx-auto px-4 relative z-20 text-white max-w-4xl">
            <h1 className="text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-tight mb-4 sm:mb-6">
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
