"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Popup {
  id: string;
  title: string;
  content: string | null;
  image: string | null;
}

export function AnnouncementPopup({ popup }: { popup: Popup | null }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (popup) {
      const timer = setTimeout(() => {
        setOpen(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [popup]);

  if (!popup) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none rounded-3xl">
        {popup.image && (
          <div className="aspect-video relative">
            <img src={popup.image} alt={popup.title} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="p-8 space-y-4">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-slate-900">{popup.title}</DialogTitle>
          </DialogHeader>
          {popup.content && (
            <p className="text-slate-600 leading-relaxed">
              {popup.content}
            </p>
          )}
          <div className="pt-4">
            <Button onClick={() => setOpen(false)} className="w-full h-12 text-lg font-bold">
              Κλείσιμο
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
