"use client";

import { useState, useEffect } from "react";
import { X, Clock } from "lucide-react";
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
  delay: number;
  duration: number;
}

export function AnnouncementPopup({ popup }: { popup: Popup | null }) {
  const [open, setOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  // Customizable Delay before showing the popup
  useEffect(() => {
    if (popup) {
      const delayMs = (popup.delay ?? 2) * 1000;
      const timer = setTimeout(() => {
        setOpen(true);
      }, delayMs);
      return () => clearTimeout(timer);
    }
  }, [popup]);

  // Countdown & Auto-Close Timer
  useEffect(() => {
    if (open && popup && popup.duration > 0) {
      setTimeLeft(popup.duration);

      const interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setOpen(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [open, popup]);

  if (!popup) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent 
        className="fixed top-6 left-[50%] translate-x-[-50%] translate-y-0 sm:max-w-[500px] p-0 overflow-hidden border-none rounded-3xl shadow-2xl z-50 transition-all duration-300 focus:outline-none"
      >
        {popup.image && (
          <div className="aspect-video relative">
            <img src={popup.image} alt={popup.title} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="p-8 space-y-4">
          <DialogHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
            <DialogTitle className="text-xl md:text-2xl font-bold text-slate-900 leading-tight">
              {popup.title}
            </DialogTitle>
            {popup.duration > 0 && timeLeft > 0 && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded-lg shrink-0">
                <Clock className="w-3 h-3 animate-pulse" />
                {timeLeft}δ
              </span>
            )}
          </DialogHeader>
          {popup.content && (
            <p className="text-slate-600 leading-relaxed text-sm md:text-base">
              {popup.content}
            </p>
          )}
          <div className="pt-2">
            <Button 
              onClick={() => setOpen(false)} 
              className="w-full h-11 text-base font-bold bg-primary hover:bg-primary/95 text-white rounded-xl shadow-md transition-all duration-300 active:scale-95"
            >
              {popup.duration > 0 && timeLeft > 0 ? `Κλείσιμο (${timeLeft}s)` : "Κλείσιμο"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
