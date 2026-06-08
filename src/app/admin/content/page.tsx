"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Save,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Home,
  History,
  GraduationCap,
  FileText,
  Undo2,
  PenLine,
  Phone,
  Image,
  Users,
  Calculator,
  Lock,
  ChevronLeft,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ─── Types ──────────────────────────────────────────────────────────────── */
type Status = { type: "idle" | "saving" | "saved" | "error"; msg?: string };

/* ─── Page registry (for page selector) ──────────────────────────────────── */
const PAGES: Array<{
  key: string;
  label: string;
  icon: LucideIcon;
  route: string;
  supportsInlineEdit: boolean;
}> = [
  { key: "home", label: "Αρχική", icon: Home, route: "/", supportsInlineEdit: true },
  { key: "history", label: "Ιστορία", icon: History, route: "/organization/history", supportsInlineEdit: true },
  { key: "curricula/junior-high", label: "Γυμνάσιο", icon: GraduationCap, route: "/curricula/junior-high", supportsInlineEdit: true },
  { key: "curricula/high-school", label: "Λύκειο", icon: GraduationCap, route: "/curricula/high-school", supportsInlineEdit: true },
  { key: "curricula/epal", label: "ΕΠΑΛ", icon: GraduationCap, route: "/curricula/epal", supportsInlineEdit: true },
  { key: "curricula/alumni", label: "Απόφοιτοι", icon: GraduationCap, route: "/curricula/alumni", supportsInlineEdit: true },
  { key: "curricula/model-schools", label: "Πρότυπα", icon: GraduationCap, route: "/curricula/model-schools", supportsInlineEdit: true },
  { key: "exams/panhellenic", label: "Πανελλαδικές", icon: FileText, route: "/exams/panhellenic", supportsInlineEdit: true },
  { key: "exams/question-bank", label: "Τράπεζα Θεμάτων", icon: FileText, route: "/exams/question-bank", supportsInlineEdit: true },
  { key: "exams/oefe", label: "ΟΕΦΕ", icon: FileText, route: "/exams/oefe", supportsInlineEdit: true },
  { key: "exams/career-guide", label: "Σταδιοδρομία", icon: FileText, route: "/exams/career-guide", supportsInlineEdit: true },
  { key: "contact", label: "Επικοινωνία", icon: Phone, route: "/contact", supportsInlineEdit: true },
  { key: "gallery", label: "Φωτογραφίες", icon: Image, route: "/organization/gallery", supportsInlineEdit: true },
  { key: "teachers-header", label: "Καθηγητές (Κείμενα)", icon: Users, route: "/organization/teachers", supportsInlineEdit: true },
  { key: "success-header", label: "Επιτυχόντες (Κείμενα)", icon: GraduationCap, route: "/organization/success-stories", supportsInlineEdit: true },
  { key: "announcements-header", label: "Ανακοινώσεις (Κείμενα)", icon: FileText, route: "/announcements", supportsInlineEdit: true },
  { key: "points-calculator", label: "Υπολογισμός Μορίων", icon: Calculator, route: "/points-calculator", supportsInlineEdit: true },
  { key: "privacy-policy", label: "Πολιτική Απορρήτου", icon: Lock, route: "/privacy-policy", supportsInlineEdit: true },
];

/* ─── Main Component ─────────────────────────────────────────────────────── */
export default function AdminContentPage() {
  const [selectedPage, setSelectedPage] = React.useState("home");
  const [changes, setChanges] = React.useState<Record<string, string>>({});
  const [status, setStatus] = React.useState<Status>({ type: "idle" });
  const [iframeReady, setIframeReady] = React.useState(false);
  const iframeRef = React.useRef<HTMLIFrameElement>(null);

  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const mobileScrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = React.useState(false);
  const [showRightArrow, setShowRightArrow] = React.useState(false);
  const [showLeftMobileArrow, setShowLeftMobileArrow] = React.useState(false);
  const [showRightMobileArrow, setShowRightMobileArrow] = React.useState(false);
  const isDragging = React.useRef(false);
  const startX = React.useRef(0);
  const scrollLeftStart = React.useRef(0);
  const dragDistance = React.useRef(0);

  const checkScroll = React.useCallback(() => {
    const container = scrollContainerRef.current;
    if (container) {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      setShowLeftArrow(scrollLeft > 2);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 2);
    }
    const mobileContainer = mobileScrollContainerRef.current;
    if (mobileContainer) {
      const { scrollLeft, scrollWidth, clientWidth } = mobileContainer;
      setShowLeftMobileArrow(scrollLeft > 2);
      setShowRightMobileArrow(scrollLeft < scrollWidth - clientWidth - 2);
    }
  }, []);

  React.useEffect(() => {
    const container = scrollContainerRef.current;
    const mobileContainer = mobileScrollContainerRef.current;
    
    checkScroll();
    
    if (container) {
      container.addEventListener("scroll", checkScroll);
    }
    if (mobileContainer) {
      mobileContainer.addEventListener("scroll", checkScroll);
    }
    window.addEventListener("resize", checkScroll);
    
    const timer = setTimeout(checkScroll, 500);
    return () => {
      if (container) {
        container.removeEventListener("scroll", checkScroll);
      }
      if (mobileContainer) {
        mobileContainer.removeEventListener("scroll", checkScroll);
      }
      window.removeEventListener("resize", checkScroll);
      clearTimeout(timer);
    };
  }, [checkScroll]);

  const scroll = (direction: "left" | "right", isMobile = false) => {
    const container = isMobile ? mobileScrollContainerRef.current : scrollContainerRef.current;
    if (container) {
      const scrollAmount = 250;
      const target = container.scrollLeft + (direction === "left" ? -scrollAmount : scrollAmount);
      container.scrollTo({
        left: target,
        behavior: "smooth"
      });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    isDragging.current = true;
    startX.current = e.pageX;
    scrollLeftStart.current = container.scrollLeft;
    dragDistance.current = 0;
    container.style.cursor = "grabbing";
    container.style.userSelect = "none";
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const container = scrollContainerRef.current;
    if (!container) return;
    const x = e.pageX;
    const dist = x - startX.current;
    dragDistance.current = Math.abs(dist);
    container.scrollLeft = scrollLeftStart.current - dist;
  };

  const handleMouseUpOrLeave = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const container = scrollContainerRef.current;
    if (container) {
      container.style.cursor = "grab";
      container.style.removeProperty("user-select");
    }
  };

  const page = PAGES.find((p) => p.key === selectedPage)!;
  const changeCount = Object.keys(changes).filter((k) => changes[k] !== undefined).length;

  /* Listen for messages from the iframe */
  React.useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === "INLINE_EDIT_READY") {
        setIframeReady(true);
      }
      if (e.data?.type === "INLINE_EDIT_CHANGE") {
        const { id, value, changed } = e.data;
        setChanges((prev) => {
          const next = { ...prev };
          if (changed) {
            next[id] = value;
          } else {
            delete next[id];
          }
          return next;
        });
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  /* Reset state when page changes */
  React.useEffect(() => {
    setChanges({});
    setIframeReady(false);
    setStatus({ type: "idle" });
  }, [selectedPage]);

  /* Save changes */
  const handleSave = async () => {
    if (changeCount === 0) return;
    setStatus({ type: "saving" });

    try {
      // First load existing content
      const getRes = await fetch(`/api/admin/content?pageKey=${encodeURIComponent(selectedPage)}`);
      const { content: existing } = await getRes.json();

      // Merge changes onto existing content
      const merged = { ...(existing || {}), ...changes };

      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageKey: selectedPage, content: merged }),
      });

      if (!res.ok) throw new Error("API error");

      // Tell iframe the save was successful
      iframeRef.current?.contentWindow?.postMessage({ type: "INLINE_EDIT_SAVED" }, "*");
      setChanges({});
      setStatus({ type: "saved" });
      setTimeout(() => setStatus({ type: "idle" }), 3000);
    } catch {
      setStatus({ type: "error", msg: "Αποτυχία αποθήκευσης." });
      setTimeout(() => setStatus({ type: "idle" }), 4000);
    }
  };

  /* Cancel changes */
  const handleCancel = () => {
    iframeRef.current?.contentWindow?.postMessage({ type: "INLINE_EDIT_RESET" }, "*");
    setChanges({});
  };

  /* Reload iframe */
  const handleReload = () => {
    setIframeReady(false);
    setChanges({});
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
    }
  };

  return (
    <div className="flex flex-col h-full gap-0 -m-5 md:-m-7">
      {/* ── Top Toolbar ── */}
      <div className="flex items-center justify-between px-4 md:px-6 py-3 bg-white border-b border-slate-100 shrink-0">
        <div className="flex items-center gap-3 flex-1 min-w-0 mr-4">
          <div className="flex items-center gap-2 shrink-0">
            <PenLine className="w-5 h-5 text-primary" />
            <h1 className="text-base font-black text-slate-900 font-heading hidden lg:block">
              Επεξεργασία Περιεχομένου
            </h1>
          </div>

          {/* Page selector pills */}
          <div className="hidden md:block relative flex-1 min-w-0 ml-2 border-l border-slate-200 pl-3">
            {/* Left Scroll Overlay / Fade */}
            {showLeftArrow && (
              <div className="absolute left-3 top-0 bottom-0 w-12 bg-gradient-to-r from-white via-white/80 to-transparent z-10 flex items-center justify-start pointer-events-none">
                <button
                  onClick={() => scroll("left")}
                  className="w-6 h-6 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center text-slate-600 hover:text-slate-900 pointer-events-auto hover:bg-slate-50 transition-colors"
                  title="Μετακίνηση αριστερά"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Right Scroll Overlay / Fade */}
            {showRightArrow && (
              <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white via-white/80 to-transparent z-10 flex items-center justify-end pointer-events-none">
                <button
                  onClick={() => scroll("right")}
                  className="w-6 h-6 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center text-slate-600 hover:text-slate-900 pointer-events-auto hover:bg-slate-50 transition-colors"
                  title="Μετακίνηση δεξιά"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Scrollable pills container */}
            <div
              ref={scrollContainerRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUpOrLeave}
              onMouseLeave={handleMouseUpOrLeave}
              className="flex items-center gap-1.5 overflow-x-auto scrollbar-none select-none cursor-grab px-10"
            >
              {PAGES.map((p) => (
                <button
                  key={p.key}
                  onClick={(e) => {
                    if (dragDistance.current > 10) {
                      e.preventDefault();
                      return;
                    }
                    setSelectedPage(p.key);
                  }}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap shrink-0 select-none",
                    selectedPage === p.key
                      ? "bg-primary text-white shadow-sm"
                      : "text-slate-500 hover:bg-slate-100"
                  )}
                >
                  <p.icon className="w-3.5 h-3.5" />
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Change count */}
          {changeCount > 0 && (
            <span className="flex items-center gap-1.5 text-amber-600 text-xs font-bold bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
              {changeCount} {changeCount === 1 ? "αλλαγή" : "αλλαγές"}
            </span>
          )}

          {/* Status */}
          {status.type === "saved" && (
            <span className="flex items-center gap-1.5 text-emerald-600 text-sm font-semibold">
              <CheckCircle2 className="w-4 h-4" /> Αποθηκεύτηκε
            </span>
          )}
          {status.type === "error" && (
            <span className="flex items-center gap-1.5 text-red-500 text-sm font-semibold">
              <AlertCircle className="w-4 h-4" /> {status.msg}
            </span>
          )}

          {/* Cancel button */}
          {changeCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              className="text-slate-500 hover:text-slate-900 gap-1.5"
            >
              <Undo2 className="w-4 h-4" />
              <span className="hidden sm:inline">Ακύρωση</span>
            </Button>
          )}

          {/* Reload */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReload}
            className="text-slate-400 hover:text-slate-700"
            title="Ανανέωση"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>

          {/* Save button */}
          <Button
            size="sm"
            onClick={handleSave}
            disabled={changeCount === 0 || status.type === "saving"}
            className={cn(
              "font-bold gap-2 shadow-lg transition-all",
              changeCount > 0
                ? "bg-primary hover:bg-primary/90 text-white shadow-primary/20"
                : "bg-slate-200 text-slate-400 shadow-none cursor-not-allowed"
            )}
          >
            {status.type === "saving" ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Αποθήκευση
          </Button>
        </div>
      </div>

      {/* ── Mobile Page Selector ── */}
      <div className="md:hidden relative border-b border-slate-100 bg-white shrink-0">
        {/* Left Scroll Overlay / Fade */}
        {showLeftMobileArrow && (
          <div className="absolute left-2 top-0 bottom-0 w-10 bg-gradient-to-r from-white via-white/80 to-transparent z-10 flex items-center justify-start pointer-events-none">
            <button
              onClick={() => scroll("left", true)}
              className="w-6 h-6 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center text-slate-600 hover:text-slate-900 pointer-events-auto hover:bg-slate-50 transition-colors"
              title="Μετακίνηση αριστερά"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Right Scroll Overlay / Fade */}
        {showRightMobileArrow && (
          <div className="absolute right-2 top-0 bottom-0 w-10 bg-gradient-to-l from-white via-white/80 to-transparent z-10 flex items-center justify-end pointer-events-none">
            <button
              onClick={() => scroll("right", true)}
              className="w-6 h-6 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center text-slate-600 hover:text-slate-900 pointer-events-auto hover:bg-slate-50 transition-colors"
              title="Μετακίνηση δεξιά"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        <div
          ref={mobileScrollContainerRef}
          className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-2.5 px-10"
        >
          {PAGES.map((p) => (
            <button
              key={p.key}
              onClick={() => setSelectedPage(p.key)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap shrink-0 select-none",
                selectedPage === p.key
                  ? "bg-primary text-white shadow-sm"
                  : "text-slate-500 hover:bg-slate-100"
              )}
            >
              <p.icon className="w-3.5 h-3.5" />
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Edit Mode Banner ── */}
      <div className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 text-sm">
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        <span className="text-blue-700 font-medium">
          <strong>Λειτουργία Επεξεργασίας</strong> — Κάντε κλικ πάνω σε οποιοδήποτε κείμενο για να το αλλάξετε
        </span>
      </div>

      {/* ── Iframe Preview ── */}
      <div className="flex-1 relative bg-slate-100 overflow-hidden">
        {/* Loading overlay */}
        {!iframeReady && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-3">
              <RefreshCw className="w-6 h-6 text-primary animate-spin" />
              <span className="text-sm font-medium text-slate-500">Φόρτωση σελίδας...</span>
            </div>
          </div>
        )}

        <iframe
          ref={iframeRef}
          src={`${page.route}?edit=1`}
          className="w-full h-full border-none bg-white"
          title={`Inline edit: ${page.label}`}
          style={{ minHeight: "calc(100vh - 140px)" }}
        />
      </div>
    </div>
  );
}
