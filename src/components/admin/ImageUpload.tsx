"use client";

import { useState } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
}

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


export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Url = reader.result as string;
        const compressed = await compressImage(base64Url);
        onChange(compressed);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Url = reader.result as string;
        const compressed = await compressImage(base64Url);
        onChange(compressed);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4">
      {value ? (
        <div className="relative w-full max-w-md rounded-2xl overflow-hidden border border-slate-100 shadow-sm bg-slate-50 group transition-all duration-300">
          <img src={value} alt="Uploaded preview" className="w-full h-48 object-cover" />
          <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => onChange("")}
              className="shadow-lg transition-transform duration-300 hover:scale-105 active:scale-95 text-white"
            >
              <X className="w-4 h-4 mr-2" /> Κατάργηση
            </Button>
          </div>
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-300 min-h-[160px] ${
            dragActive
              ? "border-primary bg-primary/5 scale-[0.99] shadow-inner"
              : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
          }`}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-slate-600 transition-colors">
            <Upload className="w-5 h-5" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-slate-700">
              Επιλέξτε μια φωτογραφία ή σύρετέ την εδώ
            </p>
            <p className="text-xs text-slate-400 mt-1">
              PNG, JPG, WEBP ή GIF
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
