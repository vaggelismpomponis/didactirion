"use client";

import * as React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { PenSquare, LayoutDashboard, X, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

const PATH_TO_CONTENT_KEY: Record<string, string> = {
  "/": "home",
  "/organization/history": "history",
  "/curricula/junior-high-a": "curricula/junior-high-a",
  "/curricula/junior-high-b": "curricula/junior-high-b",
  "/curricula/junior-high-c": "curricula/junior-high-c",
  "/curricula/high-school-a": "curricula/high-school-a",
  "/curricula/high-school-b": "curricula/high-school-b",
  "/curricula/high-school-c": "curricula/high-school-c",
  "/curricula/epal": "curricula/epal",
  "/curricula/alumni": "curricula/alumni",
  "/curricula/model-schools": "curricula/model-schools",
  "/exams/panhellenic": "exams/panhellenic",
  "/exams/question-bank": "exams/question-bank",
  "/exams/oefe": "exams/oefe",
  "/exams/career-guide": "exams/career-guide",
};

export function AdminEditBar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [visible, setVisible] = React.useState(true);
  const [collapsed, setCollapsed] = React.useState(false);

  const isAdmin = status === "authenticated" && session?.user;
  const contentKey = PATH_TO_CONTENT_KEY[pathname];

  if (!isAdmin) return null;

  if (!visible) return null;

  return (
    <div
      className={cn(
        "fixed bottom-4 left-1/2 -translate-x-1/2 z-[9999] transition-all duration-300",
        collapsed ? "translate-y-[calc(100%-12px)]" : ""
      )}
    >
      <div className="bg-slate-900 text-white rounded-2xl shadow-2xl shadow-black/40 border border-white/10 flex items-center gap-1 px-2 py-1.5 text-sm font-medium">
        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-white transition-colors rounded-xl hover:bg-white/10"
          title={collapsed ? "Εμφάνιση" : "Σύμπτυξη"}
        >
          <ChevronUp className={cn("w-3.5 h-3.5 transition-transform", collapsed ? "rotate-180" : "")} />
        </button>

        <div className="w-px h-5 bg-white/10 mx-0.5" />

        {/* Admin indicator */}
        <div className="flex items-center gap-2 px-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-300 text-xs hidden sm:inline">
            {session?.user?.name || "Admin"} — Λειτουργία Επεξεργασίας
          </span>
          <span className="text-slate-300 text-xs sm:hidden">Admin</span>
        </div>

        <div className="w-px h-5 bg-white/10 mx-0.5" />

        {/* Edit this page button */}
        {contentKey ? (
          <Link
            href={`/admin/content?page=${encodeURIComponent(contentKey)}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary hover:bg-primary/80 transition-colors text-white text-xs font-bold"
          >
            <PenSquare className="w-3.5 h-3.5" />
            Επεξεργασία Σελίδας
          </Link>
        ) : (
          <span className="text-slate-500 text-xs px-2">Μη επεξεργάσιμη σελίδα</span>
        )}

        {/* Admin dashboard link */}
        <Link
          href="/admin"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-white/10 transition-colors text-slate-300 hover:text-white text-xs font-bold"
        >
          <LayoutDashboard className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Dashboard</span>
        </Link>

        <div className="w-px h-5 bg-white/10 mx-0.5" />

        {/* Dismiss */}
        <button
          onClick={() => setVisible(false)}
          className="w-7 h-7 flex items-center justify-center text-slate-500 hover:text-white transition-colors rounded-xl hover:bg-white/10"
          title="Απόκρυψη"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
