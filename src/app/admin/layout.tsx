"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Clock,
  FileText,
  Users,
  GraduationCap,
  Image as ImageIcon,
  MessageSquare,
  LogOut,
  Bell,
  Menu,
  ExternalLink,
  ChevronRight,
  PenSquare,
  Sparkles,
  X,
  Phone,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const sidebarLinks = [
  {
    group: "Κύριο",
    items: [
      { name: "Πίνακας Ελέγχου", href: "/admin", icon: LayoutDashboard },
      { name: "Ιστορικό Δραστηριότητας", href: "/admin/activity", icon: Clock },
    ],
  },
  {
    group: "Περιεχόμενο",
    items: [
      { name: "Ανακοινώσεις", href: "/admin/posts", icon: FileText },
      { name: "Καθηγητές", href: "/admin/teachers", icon: Users },
      { name: "Επιτυχόντες", href: "/admin/success-stories", icon: GraduationCap },
      { name: "Popups", href: "/admin/gallery", icon: Bell },
      { name: "Φωτογραφίες", href: "/admin/gallery-images", icon: ImageIcon },
    ],
  },
  {
    group: "Επικοινωνία",
    items: [
      { name: "Μηνύματα", href: "/admin/messages", icon: MessageSquare },
    ],
  },
  {
    group: "Ιστοσελίδα",
    items: [
      { name: "Διαχείριση Περιεχομένου", href: "/admin/content", icon: PenSquare },
      { name: "Στοιχεία Επικοινωνίας & Ωράριο", href: "/admin/content?page=contact", icon: Phone },
    ],
  },
];

function SidebarContent({
  pathname,
  session,
  onNavigate,
}: {
  pathname: string;
  session: any;
  onNavigate?: () => void;
}) {
  return (
    <div className="flex flex-col h-full bg-slate-950">
      {/* Brand */}
      <div className="px-5 pt-6 pb-5 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-lg overflow-hidden p-1 shrink-0 ring-1 ring-white/20">
            <Image
              src="/logo-main.png"
              alt="Διδακτήριον"
              width={36}
              height={36}
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <p className="font-heading font-black text-white text-[13px] leading-none tracking-tight">
              ΔΙΔΑΚΤΗΡΙΟΝ
            </p>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-emerald-400/80">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                CMS Admin
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-5 space-y-6">
        {sidebarLinks.map((group) => (
          <div key={group.group}>
            <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.15em] px-3 mb-1.5">
              {group.group}
            </p>
            <div className="space-y-0.5">
              {group.items.map((link) => {
                const isActive =
                  link.href === "/admin"
                    ? pathname === "/admin"
                    : pathname === link.href || pathname.startsWith(link.href + "/");
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={onNavigate}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 group relative",
                      isActive
                        ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-900/40 sidebar-active-glow"
                        : "text-slate-400 hover:text-white hover:bg-white/[0.06]"
                    )}
                  >
                    <link.icon
                      className={cn(
                        "w-4 h-4 shrink-0 transition-all",
                        isActive
                          ? "text-white/90"
                          : "text-slate-500 group-hover:text-slate-300"
                      )}
                    />
                    <span className="truncate flex-1">{link.name}</span>
                    {isActive && (
                      <ChevronRight className="w-3 h-3 opacity-50 shrink-0" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User + Footer */}
      <div className="px-3 pb-5 pt-3 border-t border-white/[0.06] space-y-3">
        {/* User pill */}
        {session && (
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06]">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-700 flex items-center justify-center text-white font-black text-xs shrink-0 uppercase ring-2 ring-blue-500/30">
              {session.user?.name?.substring(0, 2) || "AD"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-bold text-white truncate leading-none">
                {session.user?.name || "Διαχειριστής"}
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5 capitalize">
                {/* @ts-ignore */}
                {session.user?.role || "Administrator"}
              </p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-0.5">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-medium text-slate-500 hover:text-white hover:bg-white/[0.06] transition-all"
          >
            <ExternalLink className="w-4 h-4 shrink-0" />
            Προεπισκόπηση Site
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-medium text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all w-full text-left"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            Αποσύνδεση
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AuthProvider>
  );
}

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);
  const [hasNewActivity, setHasNewActivity] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const saved = localStorage.getItem("admin_last_seen_activity");
    const lastSeen = saved ? parseInt(saved, 10) : 0;
    
    const fetchLatest = async () => {
      try {
        const res = await fetch("/api/admin/activity/latest");
        if (res.ok) {
          const data = await res.json();
          const latest = data.latestTimestamp;
          
          if (pathname === "/admin/activity") {
            localStorage.setItem("admin_last_seen_activity", latest.toString());
            setHasNewActivity(false);
          } else {
            setHasNewActivity(latest > lastSeen);
          }
        }
      } catch (err) {
        console.error("Failed to fetch latest activity timestamp:", err);
      }
    };

    fetchLatest();
    const interval = setInterval(fetchLatest, 60000);
    return () => clearInterval(interval);
  }, [pathname]);

  React.useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-8">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10 backdrop-blur-sm">
              <Image
                src="/logo-main.png"
                alt="Διδακτήριον"
                width={40}
                height={40}
                className="w-10 h-10 object-contain"
              />
            </div>
            <div className="absolute -inset-1 rounded-2xl bg-blue-500/20 blur-lg animate-pulse" />
          </div>
          <div className="flex flex-col items-center gap-3">
            <p className="text-white/80 text-sm font-semibold tracking-widest uppercase">
              Φόρτωση Dashboard
            </p>
            <div className="w-48 h-0.5 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-blue-300 animate-progress-fast w-1/2" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!session) return null;

  const currentPage =
    sidebarLinks
      .flatMap((g) => g.items)
      .find((l) =>
        l.href === "/admin"
          ? pathname === "/admin"
          : pathname === l.href || pathname.startsWith(l.href + "/")
      )?.name || "Dashboard";

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* ── Desktop Sidebar ── */}
      <aside className="hidden lg:flex w-64 flex-col flex-shrink-0 bg-slate-950">
        <SidebarContent pathname={pathname} session={session} />
      </aside>

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* ── Top Header ── */}
        <header className="h-14 bg-white border-b border-slate-100/80 flex items-center justify-between px-4 md:px-6 shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            {/* Mobile menu */}
            <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
              <SheetTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden text-slate-600 hover:text-slate-900 hover:bg-slate-100 -ml-2 w-9 h-9 rounded-xl"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                }
              />
              <SheetContent side="left" className="w-64 bg-slate-950 text-white p-0 border-none">
                <SheetHeader className="sr-only">
                  <SheetTitle>Navigation Menu</SheetTitle>
                </SheetHeader>
                <SidebarContent
                  pathname={pathname}
                  session={session}
                  onNavigate={() => setIsMobileOpen(false)}
                />
              </SheetContent>
            </Sheet>

            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-sm">
              <span className="text-slate-400 hidden sm:inline font-medium">Admin</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300 hidden sm:inline" />
              <span className="font-heading font-bold text-slate-800 text-[13px]">{currentPage}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Notification Bell */}
            <Link
              href="/admin/activity"
              className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all"
              title="Ιστορικό Δραστηριότητας"
            >
              <Bell className="w-5 h-5" />
              {hasNewActivity && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white ring-2 ring-red-100 animate-pulse" />
              )}
            </Link>

            {/* User avatar (topbar, desktop) */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-700 flex items-center justify-center text-white font-black text-[11px] shadow-sm uppercase ring-2 ring-blue-100">
                {session.user?.name?.substring(0, 2) || "AD"}
              </div>
              <div className="hidden sm:block">
                <p className="text-[12px] font-bold text-slate-800 leading-none">
                  {session.user?.name || "Διαχειριστής"}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5 capitalize">
                  {/* @ts-ignore */}
                  {session.user?.role || "Administrator"}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* ── Page Content ── */}
        <main className="flex-1 overflow-y-auto p-5 md:p-7">
          {children}
        </main>
      </div>
    </div>
  );
}
