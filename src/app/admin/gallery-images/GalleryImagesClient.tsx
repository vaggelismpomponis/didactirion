"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Upload,
  X,
  Image as ImageIcon,
  Save,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Grid,
  Maximize2,
  Undo2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type GalleryImage = {
  id?: string;
  tempId?: string;
  url: string;
  title: string;
  aspect: "wide" | "tall" | "square" | string;
  isUploading?: boolean;
};

type GalleryContent = {
  hero_title: string;
  hero_subtitle: string;
  cta_title: string;
  cta_subtitle: string;
  cta_button: string;
  images: GalleryImage[];
};

const compressImage = (base64Str: string, maxWidth = 1200, maxHeight = 1200, quality = 0.7): Promise<string> => {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(base64Str);
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = () => {
      resolve(base64Str);
    };
  });
};

const LazyPreviewImage = ({ src, alt }: { src: string; alt: string }) => {
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoadedSrc(src);
          observer.disconnect();
        }
      },
      { rootMargin: "100px" }
    );
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, [src]);

  return (
    <div ref={ref} className="w-full h-full bg-slate-50 relative">
      {loadedSrc ? (
        <img
          src={loadedSrc}
          alt={alt}
          className="w-full h-full object-cover select-none pointer-events-none group-hover:scale-105 transition-transform duration-500"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-slate-300">
          <ImageIcon className="w-5 h-5 animate-pulse" />
        </div>
      )}
    </div>
  );
};


export function GalleryImagesClient({ initialContent }: { initialContent: GalleryContent }) {
  const router = useRouter();
  
  // State variables
  const [content, setContent] = useState<GalleryContent>(initialContent);
  const [images, setImages] = useState<GalleryImage[]>(initialContent.images || []);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  
  // Status feedback state
  const [status, setStatus] = useState<{ type: "idle" | "saving" | "saved" | "error"; msg?: string }>({
    type: "idle",
  });

  // Reorder list helper
  const reorder = (list: GalleryImage[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  // Drag & Drop handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === index) return;
    setDragOverIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    
    const reordered = reorder(images, draggedIndex, index);
    setImages(reordered);
    setHasChanges(true);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // Bulk Upload File handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDropFiles = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = async (fileList: FileList) => {
    const validFiles = Array.from(fileList).filter((file) => file.type.startsWith("image/"));
    if (validFiles.length === 0) return;

    setIsLoading(true);
    setStatus({ type: "saving", msg: "Επεξεργασία και συμπίεση εικόνων..." });
    setHasChanges(true);

    const pendingImages: GalleryImage[] = [];

    // 1. Read and compress all files locally first to display previews instantly
    for (const file of validFiles) {
      try {
        const base64Url = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        const compressed = await compressImage(base64Url);
        const defaultTitle = file.name.substring(0, file.name.lastIndexOf(".")) || file.name;

        pendingImages.push({
          tempId: Math.random().toString(36).substring(2, 9),
          url: compressed,
          title: defaultTitle,
          aspect: "wide",
          isUploading: true,
        });
      } catch (err) {
        console.error("Failed to read file:", file.name, err);
      }
    }

    const startIndex = images.length;
    // Set previews in UI state
    setImages((prev) => [...prev, ...pendingImages]);
    setStatus({ type: "saving", msg: `Μεταφόρτωση εικόνων (0/${pendingImages.length})...` });

    // 2. Upload in batches (e.g. 5 at a time) to avoid server bottlenecks
    const BATCH_SIZE = 5;
    let completedCount = 0;

    const uploadSingleImage = async (img: GalleryImage, orderIndex: number) => {
      try {
        const res = await fetch("/api/admin/gallery-images", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            url: img.url,
            title: img.title,
            aspect: img.aspect,
            order: orderIndex,
          }),
        });

        if (!res.ok) throw new Error("Upload failed");

        const savedImg = await res.json();

        // Update target item in state with DB ID and non-loading state by matching tempId
        setImages((prev) => {
          const updated = [...prev];
          const targetIdx = prev.findIndex((item) => item.tempId === img.tempId);
          if (targetIdx !== -1) {
            updated[targetIdx] = {
              ...updated[targetIdx],
              id: savedImg.id,
              url: savedImg.url,
              isUploading: false,
            };
          }
          return updated;
        });
      } catch (err) {
        console.error("Failed to upload image:", img.title, err);
        // Remove from UI if upload failed
        setImages((prev) => {
          const updated = [...prev];
          const targetIdx = prev.findIndex((item) => item.tempId === img.tempId);
          if (targetIdx !== -1) {
            updated.splice(targetIdx, 1);
          }
          return updated;
        });
      } finally {
        completedCount++;
        setStatus({
          type: "saving",
          msg: `Μεταφόρτωση εικόνων (${completedCount}/${pendingImages.length})...`,
        });
      }
    };

    // Run batch queue uploads
    for (let i = 0; i < pendingImages.length; i += BATCH_SIZE) {
      const batch = pendingImages.slice(i, i + BATCH_SIZE);
      await Promise.all(
        batch.map((img, batchIdx) => {
          const orderIndex = startIndex + i + batchIdx;
          return uploadSingleImage(img, orderIndex);
        })
      );
    }

    setIsLoading(false);
    setStatus({ type: "idle" });
  };

  // Manual reorder arrows (mobile / keyboard support)
  const moveImage = (index: number, direction: "left" | "right") => {
    const targetIndex = direction === "left" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;
    
    const reordered = reorder(images, index, targetIndex);
    setImages(reordered);
    setHasChanges(true);
  };

  // Delete image handler
  const deleteImage = async (index: number) => {
    const img = images[index];
    if (img.id) {
      try {
        setIsLoading(true);
        setStatus({ type: "saving", msg: "Διαγραφή εικόνας..." });
        const res = await fetch(`/api/admin/gallery-images?id=${img.id}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("Delete failed");
      } catch (err) {
        console.error(err);
        setStatus({ type: "error", msg: "Σφάλμα κατά τη διαγραφή." });
        setTimeout(() => setStatus({ type: "idle" }), 3000);
        setIsLoading(false);
        return;
      }
    }
    setImages((prev) => prev.filter((_, i) => i !== index));
    setHasChanges(true);
    setIsLoading(false);
    setStatus({ type: "idle" });
  };

  // Edit fields handler
  const updateImageField = (index: number, field: keyof GalleryImage, value: string) => {
    setImages((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
    setHasChanges(true);
  };

  // Save changes handler
  const handleSave = async () => {
    setStatus({ type: "saving", msg: "Αποθήκευση αλλαγών..." });
    setIsLoading(true);

    try {
      // 1. Fetch current database content first to merge text fields, ensuring we only update images
      const getRes = await fetch(`/api/admin/content?pageKey=gallery`);
      const { content: existing } = await getRes.json();
      
      const merged = {
        ...(existing || content),
      };
      // Delete legacy images array from PageContent table to avoid redundant heavy storage
      delete (merged as any).images;

      // Save content page text fields
      const contentRes = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageKey: "gallery", content: merged }),
      });

      if (!contentRes.ok) throw new Error("Failed to save gallery text content");

      // 2. Save metadata (title, aspect, order) for all successfully uploaded database images
      const validImages = images.filter((img) => img.id && !img.isUploading);
      const metadataRes = await fetch("/api/admin/gallery-images", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          images: validImages.map((img, i) => ({
            id: img.id,
            title: img.title,
            aspect: img.aspect,
            order: i,
          })),
        }),
      });

      if (!metadataRes.ok) throw new Error("Failed to save gallery metadata");

      setHasChanges(false);
      setStatus({ type: "saved" });
      setTimeout(() => setStatus({ type: "idle" }), 3000);
      router.refresh();
    } catch (error) {
      console.error(error);
      setStatus({ type: "error", msg: "Σφάλμα κατά την αποθήκευση." });
      setTimeout(() => setStatus({ type: "idle" }), 4000);
    } finally {
      setIsLoading(false);
    }
  };

  // Cancel changes handler
  const handleCancel = () => {
    // Reload state from database
    router.refresh();
    setHasChanges(false);
  };

  return (
    <div className="space-y-6">
      {/* ── Toast Notification ── */}
      <div
        className={`fixed top-6 left-1/2 -translate-x-1/2 z-[9999] pointer-events-none flex items-center gap-3 transition-all duration-500 ease-out ${
          status.type !== "idle"
            ? "opacity-100 translate-y-0 animate-in fade-in slide-in-from-top-4"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        {status.type === "saving" && (
          <div className="flex items-center gap-3 bg-blue-600 text-white px-6 py-3.5 rounded-2xl shadow-2xl shadow-blue-500/30 border border-blue-500">
            <Loader2 className="w-5 h-5 shrink-0 animate-spin" />
            <span className="text-sm font-bold">{status.msg || "Αποθήκευση..."}</span>
          </div>
        )}
        {status.type === "saved" && (
          <div className="flex items-center gap-3 bg-emerald-500 text-white px-6 py-3.5 rounded-2xl shadow-2xl shadow-emerald-500/30 border border-emerald-400">
            <CheckCircle2 className="w-5 h-5 shrink-0 animate-spin-none" />
            <span className="text-sm font-bold">Οι αλλαγές αποθηκεύτηκαν επιτυχώς!</span>
          </div>
        )}
        {status.type === "error" && (
          <div className="flex items-center gap-3 bg-red-500 text-white px-6 py-3.5 rounded-2xl shadow-2xl shadow-red-500/30 border border-red-400">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span className="text-sm font-bold">{status.msg}</span>
          </div>
        )}
      </div>

      {/* ── Title & Actions Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h1 className="text-2xl font-heading font-black text-slate-900 flex items-center gap-2">
            <ImageIcon className="w-6 h-6 text-primary" />
            Φωτογραφικό Υλικό
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Διαχειριστείτε τις φωτογραφίες της σελίδας Γκαλερί. Σύρετε για να αλλάξετε τη σειρά εμφάνισης.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {hasChanges && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              className="text-slate-500 hover:text-slate-800 h-9 rounded-xl font-medium"
              disabled={isLoading}
            >
              <Undo2 className="w-4 h-4 mr-2" />
              Ακύρωση
            </Button>
          )}
          <Button
            onClick={handleSave}
            disabled={!hasChanges || isLoading}
            className={`font-bold h-9 px-5 rounded-xl shadow-lg transition-all ${
              hasChanges
                ? "bg-primary hover:bg-primary/95 text-white shadow-primary/20"
                : "bg-slate-100 text-slate-400 shadow-none cursor-not-allowed border border-slate-200"
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Αποθήκευση...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Αποθήκευση αλλαγών
              </>
            )}
          </Button>
        </div>
      </div>

      {/* ── Bulk Upload Drag-and-Drop Area ── */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDropFiles}
        className={`relative border-2 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-300 min-h-[180px] group ${
          dragActive
            ? "border-primary bg-primary/5 scale-[0.99] shadow-inner"
            : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/40"
        }`}
      >
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
        <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-primary group-hover:scale-110 transition-all shadow-sm">
          <Upload className="w-6 h-6" />
        </div>
        <div className="text-center space-y-1">
          <p className="text-base font-bold text-slate-700">
            Μεταφόρτωση Φωτογραφιών (Μία ή Πολλαπλές)
          </p>
          <p className="text-sm text-slate-400">
            Επιλέξτε αρχεία ή σύρετέ τα απευθείας σε αυτό το πλαίσιο
          </p>
          <div className="flex items-center gap-1.5 justify-center text-xs text-slate-400 mt-2">
            <span className="px-2 py-0.5 rounded-md bg-slate-100">PNG</span>
            <span className="px-2 py-0.5 rounded-md bg-slate-100">JPG</span>
            <span className="px-2 py-0.5 rounded-md bg-slate-100">WEBP</span>
            <span className="px-2 py-0.5 rounded-md bg-slate-100">GIF</span>
          </div>
        </div>
      </div>

      {/* ── Statistics / Info ── */}
      <div className="flex items-center justify-between bg-slate-100/50 rounded-2xl px-5 py-3.5 border border-slate-200/50">
        <span className="text-sm font-bold text-slate-600 flex items-center gap-2">
          <Grid className="w-4 h-4 text-slate-400" />
          Σύνολο: {images.length} φωτογραφίες
        </span>
        {hasChanges && (
          <span className="text-xs font-bold text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1 rounded-lg flex items-center gap-1.5 animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
            Έχετε μη αποθηκευμένες αλλαγές
          </span>
        )}
      </div>

      {/* ── Interactive Grid ── */}
      {images.length === 0 ? (
        <div className="py-24 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-white space-y-4">
          <div className="w-16 h-16 bg-slate-50 border rounded-2xl flex items-center justify-center mx-auto text-slate-300">
            <ImageIcon className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-black text-slate-800 font-heading">Η γκαλερί είναι άδεια</h3>
            <p className="text-sm text-slate-400 max-w-sm mx-auto">
              Προσθέστε φωτογραφίες χρησιμοποιώντας το παραπάνω πλαίσιο για να ξεκινήσετε τη διαμόρφωση της γκαλερί.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {images.map((image, index) => {
            const isDragged = draggedIndex === index;
            const isDragOver = dragOverIndex === index;
            
            return (
              <div
                key={`${image.url.substring(0, 50)}-${index}`}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                onDrop={(e) => handleDrop(e, index)}
                className={`group bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col transition-all duration-300 cursor-grab active:cursor-grabbing ${
                  isDragged ? "opacity-30 border-dashed border-primary scale-[0.97] shadow-inner" : ""
                } ${
                  isDragOver && !isDragged ? "border-primary ring-2 ring-primary/20 scale-[1.02] shadow-lg" : ""
                }`}
              >
                {/* Image container & drag handle overlay */}
                <div className="relative aspect-[4/3] bg-slate-50 border-b border-slate-100 overflow-hidden shrink-0">
                  <LazyPreviewImage src={image.url} alt={image.title} />
                  
                  {image.isUploading ? (
                    <div className="absolute inset-0 bg-slate-900/60 flex flex-col items-center justify-center gap-2 text-white backdrop-blur-[1px] select-none pointer-events-none z-20">
                      <Loader2 className="w-6 h-6 animate-spin text-white" />
                      <span className="text-[10px] font-bold tracking-wider uppercase">Μεταφόρτωση...</span>
                    </div>
                  ) : null}

                  {/* Position Badge */}
                  <div className="absolute top-3 left-3 bg-black/45 backdrop-blur-sm text-white text-[11px] font-black w-6 h-6 rounded-lg flex items-center justify-center select-none border border-white/10 shadow-sm z-10">
                    {index + 1}
                  </div>

                  {/* Reordering Controls (arrows) & Delete */}
                  {!image.isUploading && (
                    <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3 z-10">
                      <div className="flex justify-end">
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() => deleteImage(index)}
                          className="w-7 h-7 rounded-lg text-white hover:scale-105 active:scale-95 transition-all shadow-md bg-red-600 hover:bg-red-700"
                          title="Διαγραφή"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between gap-1 bg-white/10 backdrop-blur-md border border-white/20 p-1.5 rounded-xl">
                        {/* Left arrow */}
                        <button
                          type="button"
                          onClick={() => moveImage(index, "left")}
                          disabled={index === 0}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center text-white transition-all ${
                            index === 0
                              ? "opacity-30 cursor-not-allowed"
                              : "hover:bg-white/20 active:scale-95"
                          }`}
                          title="Μετακίνηση Αριστερά"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        
                        <span className="text-[10px] text-white/90 font-black uppercase tracking-wider select-none">
                          Σειρα
                        </span>

                        {/* Right arrow */}
                        <button
                          type="button"
                          onClick={() => moveImage(index, "right")}
                          disabled={index === images.length - 1}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center text-white transition-all ${
                            index === images.length - 1
                              ? "opacity-30 cursor-not-allowed"
                              : "hover:bg-white/20 active:scale-95"
                          }`}
                          title="Μετακίνηση Δεξιά"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Form fields: Title & Aspect Ratio */}
                <div className="p-4 flex-1 flex flex-col gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Τίτλος Φωτογραφίας
                    </label>
                    <Input
                      value={image.title}
                      onChange={(e) => updateImageField(index, "title", e.target.value)}
                      placeholder="π.χ. Αίθουσα διδασκαλίας"
                      className="h-9 rounded-lg border-slate-200 bg-white text-xs font-semibold focus:border-primary text-slate-800 placeholder:text-slate-300"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Αναλογία (Aspect Ratio)
                    </label>
                    <select
                      value={image.aspect}
                      onChange={(e) => updateImageField(index, "aspect", e.target.value)}
                      className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:border-primary focus:ring-1 focus:ring-primary outline-none cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2364748B%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5%201.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:9px] bg-[position:right_10px_center] bg-no-repeat pr-8"
                    >
                      <option value="wide">Οριζόντια (4:3)</option>
                      <option value="tall">Κατακόρυφη (3:4)</option>
                      <option value="square">Τετράγωνη (1:1)</option>
                    </select>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
