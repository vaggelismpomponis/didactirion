"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { X, Clock } from "lucide-react";
import { parseMarkdownToHtml } from "@/lib/markdown";

interface Popup {
  id: string;
  title: string;
  content: string | null;
  image: string | null;
  delay?: number | null;
  duration?: number | null;
}

export function AnnouncementPopup({ popup }: { popup: Popup | null }) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  // Ensure we are on the client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Delay before showing the popup
  useEffect(() => {
    if (!popup || !mounted) return;

    const delayMs = (popup.delay ?? 2) * 1000;
    const timer = setTimeout(() => {
      setVisible(true);
      setTimeLeft(popup.duration ?? 0);
    }, delayMs);

    return () => clearTimeout(timer);
  }, [popup, mounted]);

  // Auto-close countdown
  useEffect(() => {
    const duration = popup?.duration ?? 0;
    if (!visible || !popup || duration <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setVisible(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [visible, popup]);

  const handleClose = useCallback(() => setVisible(false), []);

  if (!popup || !mounted || !visible) return null;

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[9998] bg-black/40 backdrop-blur-sm"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Popup panel - positioned at the center */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="announcement-popup-title"
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] w-full max-w-[500px] mx-auto rounded-3xl overflow-hidden shadow-2xl bg-white border border-slate-100 max-h-[calc(100vh-2rem)] overflow-y-auto"
        style={{ maxWidth: "min(500px, calc(100vw - 2rem))" }}
      >
        {/* Image */}
        {popup.image && (
          <div className="relative w-full overflow-hidden bg-slate-50 flex items-center justify-center">
            <img
              src={popup.image}
              alt={popup.title}
              className="w-full h-auto max-h-[65vh] object-contain block"
            />
          </div>
        )}

        {/* Content */}
        <div className="p-7 space-y-4">
          {/* Header row */}
          <div className="flex items-start justify-between gap-4">
            <h2
              id="announcement-popup-title"
              className="text-xl md:text-2xl font-black text-slate-900 leading-tight flex-1"
            >
              {popup.title}
            </h2>

            <div className="flex items-center gap-2 shrink-0">
              {(popup.duration ?? 0) > 0 && timeLeft > 0 && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-600 border border-blue-100 px-2 py-1 rounded-lg">
                  <Clock className="w-3 h-3 animate-pulse" />
                  {timeLeft}s
                </span>
              )}
              <button
                type="button"
                onClick={handleClose}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors"
                aria-label="Κλείσιμο"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Body text */}
          {popup.content && (
            <div 
              dangerouslySetInnerHTML={{ __html: parseMarkdownToHtml(popup.content) }} 
              className="text-slate-600 leading-relaxed text-sm md:text-base space-y-2"
            />
          )}

          {/* Close button */}
          <button
            type="button"
            onClick={handleClose}
            className="w-full h-11 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary/90 active:scale-[0.98] transition-all duration-200 shadow-md shadow-primary/20"
          >
            {(popup.duration ?? 0) > 0 && timeLeft > 0
              ? `Κλείσιμο (${timeLeft}s)`
              : "Κλείσιμο"}
          </button>
        </div>
      </div>
    </>,
    document.body
  );
}
