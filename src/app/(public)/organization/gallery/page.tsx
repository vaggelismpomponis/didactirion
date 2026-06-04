"use client";

import { Image as ImageIcon, ArrowRight, X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/providers/ScrollReveal";
import { cn } from "@/lib/utils";

const galleryImages = [
  { url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070", title: "Αίθουσα Διδασκαλίας", aspect: "tall" },
  { url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071", title: "Ομαδική Μελέτη", aspect: "wide" },
  { url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070", title: "Ψηφιακά Εργαλεία", aspect: "square" },
  { url: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=2070", title: "Βιβλιοθήκη", aspect: "wide" },
  { url: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070", title: "Εργαστήριο", aspect: "tall" },
  { url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2070", title: "Σεμινάριο", aspect: "square" },
];

function Lightbox({
  images,
  currentIndex,
  onClose,
  onPrev,
  onNext,
}: {
  images: typeof galleryImages;
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  // Close on Escape, navigate with arrows
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose, onPrev, onNext]);

  const image = images[currentIndex];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 flex flex-col items-center">
        {/* Top bar */}
        <div className="w-full flex items-center justify-between mb-4">
          <span className="text-white/60 text-sm font-medium">
            {currentIndex + 1} / {images.length}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-white font-bold text-sm hidden sm:block">
              {image.title}
            </span>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              aria-label="Κλείσιμο"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Image */}
        <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden shadow-2xl">
          <Image
            src={image.url}
            alt={image.title}
            fill
            className="object-contain bg-black"
            sizes="(max-width: 1024px) 100vw, 1024px"
          />
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-4 mt-6">
          <button
            onClick={onPrev}
            className="w-12 h-12 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            aria-label="Προηγούμενη"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={onNext}
            className="w-12 h-12 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            aria-label="Επόμενη"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function GalleryPage() {
  const [lightboxIndex, setLightboxIndex] = React.useState<number | null>(null);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const prevImage = () =>
    setLightboxIndex((prev) =>
      prev !== null ? (prev - 1 + galleryImages.length) % galleryImages.length : null
    );
  const nextImage = () =>
    setLightboxIndex((prev) =>
      prev !== null ? (prev + 1) % galleryImages.length : null
    );

  return (
    <div className="flex flex-col">
      {/* ── Hero ── */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute -top-24 -right-24 w-[450px] h-[450px] rounded-full bg-white/5 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-white/5 blur-3xl pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10 text-white text-center flex flex-col items-center justify-center">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tight mb-5 leading-tight max-w-3xl mx-auto">
            Φωτογραφικό Υλικό
          </h1>
          <p className="text-xl text-blue-100/80 max-w-2xl leading-relaxed mx-auto">
            Περιηγηθείτε στις εγκαταστάσεις μας και δείτε στιγμιότυπα από την καθημερινή ζωή στο φροντιστήριο.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm text-blue-100/70">
            <ImageIcon className="w-4 h-4" />
            {galleryImages.length} φωτογραφίες
          </div>
        </div>
      </section>

      {/* ── Gallery Masonry Grid ── */}
      <section className="container mx-auto px-4 py-12 sm:py-16">
        {galleryImages.length === 0 ? (
          <div className="py-20 text-center space-y-4">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
              <ImageIcon className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Η συλλογή είναι κενή</h3>
            <p className="text-slate-500">Πολύ σύντομα θα προστεθεί νέο φωτογραφικό υλικό.</p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 sm:gap-6 space-y-4 sm:space-y-6">
            {galleryImages.map((image, i) => (
              <ScrollReveal key={i} delay={i * 0.06}>
                <div
                  className={cn(
                    "group relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm border border-slate-100 cursor-pointer hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 break-inside-avoid",
                    image.aspect === "tall" && "aspect-[3/4]",
                    image.aspect === "wide" && "aspect-[4/3]",
                    image.aspect === "square" && "aspect-square"
                  )}
                  onClick={() => openLightbox(i)}
                >
                  <Image
                    src={image.url}
                    alt={image.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    loading="lazy"
                  />
                  {/* Hover overlay — slide up */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6">
                    <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <p className="text-white font-bold text-lg mb-1">{image.title}</p>
                      <div className="flex items-center gap-1.5 text-white/70 text-sm">
                        <ZoomIn className="w-3.5 h-3.5" />
                        Κάντε κλικ για μεγέθυνση
                      </div>
                    </div>
                  </div>

                  {/* Number badge */}
                  <div className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-black/30 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {i + 1}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        )}
      </section>

      {/* ── CTA Section ── */}
      <section className="container mx-auto px-4 pb-20">
        <ScrollReveal>
          <div className="relative overflow-hidden rounded-3xl">
            <div className="absolute inset-0 hero-gradient" />
            <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-white/10 pointer-events-none" />
            <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-white/5 blur-2xl pointer-events-none" />
            <div className="relative p-6 sm:p-10 md:p-14 text-white flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-3 text-center md:text-left">
                <h2 className="text-3xl md:text-4xl font-black">Θέλετε να μας γνωρίσετε;</h2>
                <p className="text-blue-100/80 max-w-xl leading-relaxed">
                  Ελάτε να δείτε τον χώρο μας από κοντά και να μιλήσετε με την ομάδα μας.
                </p>
              </div>
              <Button
                asChild
                size="lg"
                className="bg-white text-primary hover:bg-white/90 font-bold px-8 shadow-xl shadow-black/20 shrink-0"
                style={{ height: "3.25rem" }}
              >
                <Link href="/contact" className="flex items-center gap-2">
                  Κλείστε Ραντεβού <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ── Lightbox ── */}
      {lightboxIndex !== null && (
        <Lightbox
          images={galleryImages}
          currentIndex={lightboxIndex}
          onClose={closeLightbox}
          onPrev={prevImage}
          onNext={nextImage}
        />
      )}
    </div>
  );
}
