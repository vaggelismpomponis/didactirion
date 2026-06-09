"use client";

import { Image as ImageIcon, ArrowRight, X, ChevronLeft, ChevronRight, ZoomIn, Loader2 } from "lucide-react";
import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/providers/ScrollReveal";
import { cn } from "@/lib/utils";
import { PreviewListener } from "@/components/admin/PreviewListener";
import { mergeContent } from "@/lib/content-utils";
import { defaultGalleryContent } from "./gallery-content";
import { Editable } from "@/components/admin/Editable";

type GalleryContent = typeof defaultGalleryContent;

function Lightbox({
  images,
  currentIndex,
  totalCount,
  onClose,
  onPrev,
  onNext,
}: {
  images: any[];
  currentIndex: number;
  totalCount: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
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
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 flex flex-col items-center">
        <div className="w-full flex items-center justify-between mb-4">
          <span className="text-white/60 text-sm font-medium">
            {currentIndex + 1} / {totalCount || images.length}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-white font-bold text-sm hidden sm:block">
              {image ? image.title : "Φόρτωση..."}
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

        <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden shadow-2xl">
          {image ? (
            <Image
              src={image.url}
              alt={image.title}
              fill
              className="object-contain bg-black"
              sizes="(max-width: 1024px) 100vw, 1024px"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-black text-white">
              <Loader2 className="w-8 h-8 animate-spin text-white/50" />
            </div>
          )}
        </div>

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

const LazyImage = ({ src, alt }: { src: string; alt: string }) => {
  const [loadedSrc, setLoadedSrc] = React.useState<string | null>(null);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoadedSrc(src);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, [src]);

  return (
    <div ref={ref} className="w-full h-full relative bg-slate-50">
      {loadedSrc ? (
        <img
          src={loadedSrc}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-slate-300">
          <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
        </div>
      )}
    </div>
  );
};

export function GalleryPageClient({ initialContent }: { initialContent: GalleryContent }) {
  const [content, setContent] = React.useState<GalleryContent>(initialContent);
  const [images, setImages] = React.useState<any[]>([]);
  const [offset, setOffset] = React.useState(0);
  const [total, setTotal] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);
  const isLoadingRef = React.useRef(false);
  const [hasMore, setHasMore] = React.useState(true);
  const [lightboxIndex, setLightboxIndex] = React.useState<number | null>(null);

  const handlePreviewUpdate = React.useCallback((override: Record<string, any>) => {
    setContent(mergeContent(defaultGalleryContent, override) as GalleryContent);
  }, []);

  const fetchImages = React.useCallback(async (currentOffset: number) => {
    if (isLoadingRef.current) return;
    isLoadingRef.current = true;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/gallery-images?limit=12&offset=${currentOffset}`);
      if (!res.ok) throw new Error("Failed to fetch images");
      const data = await res.json();
      
      setImages((prev) => {
        const existingIds = new Set(prev.map((img: any) => img.id));
        const newImages = data.images.filter((img: any) => !existingIds.has(img.id));
        return [...prev, ...newImages];
      });
      setTotal(data.total);
      setHasMore(currentOffset + data.images.length < data.total);
    } catch (err) {
      console.error("Fetch images error:", err);
    } finally {
      isLoadingRef.current = false;
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchImages(0);
  }, []);

  const loadMore = React.useCallback(() => {
    setOffset((prevOffset) => {
      const nextOffset = prevOffset + 12;
      fetchImages(nextOffset);
      return nextOffset;
    });
  }, [fetchImages]);

  // Pre-fetch next batch in the background if the user is close to the end of currently loaded images in the lightbox
  React.useEffect(() => {
    if (
      lightboxIndex !== null &&
      lightboxIndex >= images.length - 2 &&
      hasMore &&
      !isLoadingRef.current
    ) {
      loadMore();
    }
  }, [lightboxIndex, images.length, hasMore, loadMore]);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const prevImage = () => {
    if (lightboxIndex === null) return;
    if (lightboxIndex === 0) {
      setLightboxIndex(images.length - 1);
    } else {
      setLightboxIndex(lightboxIndex - 1);
    }
  };

  const nextImage = () => {
    if (lightboxIndex === null) return;

    // If we are currently loading the next batch and already showing a loader, block next
    if (lightboxIndex >= images.length) return;

    if (lightboxIndex === images.length - 1) {
      if (hasMore) {
        setLightboxIndex(lightboxIndex + 1);
        loadMore();
      } else {
        setLightboxIndex(0);
      }
    } else {
      setLightboxIndex(lightboxIndex + 1);
    }
  };

  return (
    <div className="flex flex-col">
      <PreviewListener pageKey="gallery" onContentUpdate={handlePreviewUpdate} />

      {/* ── Hero ── */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute -top-24 -right-24 w-[450px] h-[450px] rounded-full bg-white/5 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-white/5 blur-3xl pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10 text-white text-center flex flex-col items-center justify-center">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tight mb-5 leading-tight max-w-3xl mx-auto">
            <Editable id="hero_title">{content.hero_title}</Editable>
          </h1>
          <p className="text-xl text-blue-100/80 max-w-2xl leading-relaxed mx-auto">
            <Editable id="hero_subtitle" multiline>{content.hero_subtitle}</Editable>
          </p>
          <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm text-blue-100/70">
            <ImageIcon className="w-4 h-4" />
            {total || images.length} φωτογραφίες
          </div>
        </div>
      </section>

      {/* ── Gallery Masonry Grid ── */}
      <section className="container mx-auto px-4 py-12 sm:py-16">
        {images.length === 0 && !isLoading ? (
          <div className="py-20 text-center space-y-4">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
              <ImageIcon className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Η συλλογή είναι κενή</h3>
            <p className="text-slate-500">Πολύ σύντομα θα προστεθεί νέο φωτογραφικό υλικό.</p>
          </div>
        ) : (
          <>
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 sm:gap-6 space-y-4 sm:space-y-6">
              {images.map((image, i) => (
                <ScrollReveal key={image.id || i} delay={(i % 6) * 0.06}>
                  <div
                    className={cn(
                      "group relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm border border-slate-100 cursor-pointer hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 break-inside-avoid",
                      image.aspect === "tall" && "aspect-[3/4]",
                      image.aspect === "wide" && "aspect-[4/3]",
                      image.aspect === "square" && "aspect-square"
                    )}
                    onClick={() => openLightbox(i)}
                  >
                    <LazyImage src={image.url} alt={image.title} />
                    
                    {/* Hover overlay — slide up */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6 z-10">
                      <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <p className="text-white font-bold text-lg mb-1">
                          <Editable id={`images_${i}_title`}>{image.title}</Editable>
                        </p>
                        <div className="flex items-center gap-1.5 text-white/70 text-sm">
                          <ZoomIn className="w-3.5 h-3.5" />
                          Κάντε κλικ για μεγέθυνση
                        </div>
                      </div>
                    </div>

                    {/* Number badge */}
                    <div className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-black/30 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                      {i + 1}
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            {hasMore && (
              <div className="flex justify-center mt-12">
                <Button
                  onClick={loadMore}
                  disabled={isLoading}
                  className="bg-[#004a99] hover:bg-[#003d80] text-white font-bold px-8 py-3 rounded-2xl shadow-xl shadow-blue-500/20"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Φόρτωση...
                    </span>
                  ) : (
                    "Φόρτωση Περισσότερων"
                  )}
                </Button>
              </div>
            )}
          </>
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
                <h2 className="text-3xl md:text-4xl font-black">
                  <Editable id="cta_title">{content.cta_title}</Editable>
                </h2>
                <p className="text-blue-100/80 max-w-xl leading-relaxed">
                  <Editable id="cta_subtitle" multiline>{content.cta_subtitle}</Editable>
                </p>
              </div>
              <Button
                asChild
                size="lg"
                className="bg-white text-primary hover:bg-white/90 font-bold px-8 shadow-xl shadow-black/20 shrink-0"
                style={{ height: "3.25rem" }}
              >
                <Link href="/contact" className="flex items-center gap-2">
                  <Editable id="cta_button">{content.cta_button}</Editable> <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ── Lightbox ── */}
      {lightboxIndex !== null && (
        <Lightbox
          images={images}
          currentIndex={lightboxIndex}
          totalCount={total}
          onClose={closeLightbox}
          onPrev={prevImage}
          onNext={nextImage}
        />
      )}
    </div>
  );
}
