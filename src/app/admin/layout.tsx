"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Users,
  GraduationCap,
  Image as ImageIcon,
  MessageSquare,
  Settings,
  LogOut,
  Bell,
  Menu,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
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
    ],
  },
  {
    group: "Περιεχόμενο",
    items: [
      { name: "Ανακοινώσεις", href: "/admin/posts", icon: FileText },
      { name: "Καθηγητές", href: "/admin/teachers", icon: Users },
      { name: "Επιτυχόντες", href: "/admin/success-stories", icon: GraduationCap },
      { name: "Gallery & Banners", href: "/admin/gallery", icon: ImageIcon },
    ],
  },
  {
    group: "Επικοινωνία",
    items: [
      { name: "Μηνύματα", href: "/admin/messages", icon: MessageSquare },
    ],
  },
];

function SidebarContent({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-lg overflow-hidden p-1.5 shrink-0">
            <Image 
              src="/logo-main.png" 
              alt="Διδακτήριον" 
              width={40} 
              height={40} 
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <p className="font-heading font-black text-white text-sm leading-none tracking-tight">ΔΙΔΑΚΤΗΡΙΟΝ</p>
            <p className="text-[10px] text-slate-500 mt-1 font-medium uppercase tracking-widest">CMS Admin</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {sidebarLinks.map((group) => (
          <div key={group.group}>
            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest px-2 mb-2">
              {group.group}
            </p>
            <div className="space-y-0.5">
              {group.items.map((link) => {
                const isActive =
                  link.href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={onNavigate}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-heading font-medium transition-all group",
                      isActive
                        ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md shadow-blue-900/30"
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <link.icon
                      className={cn(
                        "w-4 h-4 shrink-0 transition-all",
                        isActive ? "text-white" : "text-slate-500 group-hover:text-blue-400"
                      )}
                    />
                    <span className="truncate">{link.name}</span>
                    {isActive && <ChevronRight className="w-3 h-3 ml-auto opacity-60" />}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer actions */}
      <div className="px-3 pb-4 pt-3 border-t border-white/10 space-y-1">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:text-white hover:bg-white/5 transition-all"
        >
          <ExternalLink className="w-4 h-4 shrink-0" />
          Προεπισκόπηση Site
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all w-full text-left"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Αποσύνδεση
        </button>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  React.useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-6 animate-pulse">
          <Image 
            src="/logo-main.png" 
            alt="Διδακτήριον" 
            width={200} 
            height={80} 
            className="h-12 w-auto object-contain opacity-80"
          />
          <div className="w-48 h-1 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-primary animate-progress-fast" style={{ width: "60%" }} />
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
        l.href === "/admin" ? pathname === "/admin" : pathname.startsWith(l.href)
      )?.name || "Dashboard";

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* ── Desktop Sidebar ── */}
      <aside className="hidden lg:flex w-60 flex-col bg-slate-950 flex-shrink-0">
        <SidebarContent pathname={pathname} />
      </aside>

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* ── Top Header ── */}
        <header className="h-14 bg-white border-b border-slate-100 flex items-center justify-between px-4 md:px-6 shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            {/* Mobile menu */}
            <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
              <SheetTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden text-slate-600 hover:text-slate-900 hover:bg-slate-100 -ml-2"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                }
              />
              <SheetContent side="left" className="w-60 bg-slate-950 text-white p-0 border-none">
                <SheetHeader className="sr-only">
                  <SheetTitle>Navigation Menu</SheetTitle>
                </SheetHeader>
                <SidebarContent
                  pathname={pathname}
                  onNavigate={() => setIsMobileOpen(false)}
                />
              </SheetContent>
            </Sheet>

            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-sm">
              <span className="text-slate-400 hidden sm:inline">Admin</span>
              <ChevronRight className="w-3 h-3 text-slate-300 hidden sm:inline" />
              <span className="font-heading font-semibold text-slate-800">{currentPage}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Notification bell */}
            <Button
              variant="ghost"
              size="icon"
              className="relative text-slate-500 hover:text-slate-900 hover:bg-slate-100 w-9 h-9"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full border border-white" />
            </Button>

            {/* User pill */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-100 ml-1">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-black text-xs shadow-sm uppercase">
                {session.user?.name?.substring(0, 2) || "AD"}
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-bold text-slate-900 leading-none">
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
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
