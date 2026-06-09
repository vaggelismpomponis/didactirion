"use client";

import { useState, useEffect } from "react";
import { Cookie, X } from "lucide-react";
import Link from "next/link";

export function CookieNotice() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check cookie on the client side inside useEffect to avoid SSR hydration mismatch
    const getCookie = (name: string): string | null => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
      return null;
    };

    const consent = getCookie("cookie-consent");
    if (!consent) {
      // Show notice after a small delay for a premium feel
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    // Save cookie with 1-year expiration, SameSite=Lax, and secure attributes
    const oneYear = 365 * 24 * 60 * 60;
    document.cookie = `cookie-consent=accepted; max-age=${oneYear}; path=/; SameSite=Lax; Secure`;
    setIsVisible(false);
  };

  const handleDecline = () => {
    // If they decline, we still save the preference so we don't annoy them, 
    // but we save it as 'declined' (typically expires sooner or same duration)
    const oneMonth = 30 * 24 * 60 * 60;
    document.cookie = `cookie-consent=declined; max-age=${oneMonth}; path=/; SameSite=Lax; Secure`;
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie Consent Banner"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] w-[calc(100vw-2rem)] max-w-4xl rounded-2xl overflow-hidden shadow-xl border border-slate-200/60 dark:border-slate-800/60 bg-white/85 dark:bg-slate-950/85 backdrop-blur-xl transition-all duration-500 animate-in fade-in slide-in-from-bottom-5"
    >
      <div className="p-4 md:py-3 md:px-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left/Text Side */}
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-primary/10 text-primary shrink-0 dark:bg-primary/20">
            <Cookie className="w-5 h-5 text-primary" />
          </div>
          <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-normal">
            Χρησιμοποιούμε cookies για να σας εξασφαλίσουμε την καλύτερη δυνατή εμπειρία πλοήγησης. 
            Μάθετε περισσότερα στην{" "}
            <Link
              href="/privacy-policy"
              className="text-primary hover:underline font-semibold"
            >
              Πολιτική Απορρήτου
            </Link>{" "}
            μας.
          </p>
        </div>

        {/* Right/Actions Side */}
        <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
          <button
            type="button"
            onClick={handleDecline}
            className="h-8 px-3.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-xs font-semibold text-slate-600 dark:text-slate-400 transition-all active:scale-[0.98]"
          >
            Απόρριψη
          </button>
          <button
            type="button"
            onClick={handleAccept}
            className="h-8 px-4 rounded-lg bg-primary text-white text-xs font-bold hover:bg-primary/95 transition-all shadow-md shadow-primary/10 active:scale-[0.98]"
          >
            Αποδοχή
          </button>
        </div>
      </div>
    </div>
  );
}
