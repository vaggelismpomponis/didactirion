export const dynamic = "force-dynamic";

import {
  FileText,
  Users,
  GraduationCap,
  MessageSquare,
  TrendingUp,
  Clock,
  ExternalLink,
  ArrowUpRight,
  Plus,
  Image as ImageIcon,
  Sparkles,
  BarChart3,
  CheckCircle2,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

async function getDashboardData() {
  const [posts, teachers, successStories, messages, popups] = await Promise.all([
    prisma.post.count(),
    prisma.teacher.count(),
    prisma.successStory.count(),
    prisma.contactMessage.count({ where: { isRead: false } }),
    prisma.popup.count(),
  ]);
  return { posts, teachers, successStories, messages, popups };
}

const quickActions = [
  { label: "Νέα Ανακοίνωση", href: "/admin/posts/new", icon: FileText, color: "bg-blue-600", shadow: "shadow-blue-200" },
  { label: "Προσθήκη Καθηγητή", href: "/admin/teachers/new", icon: Users, color: "bg-violet-600", shadow: "shadow-violet-200" },
  { label: "Νέο Popup", href: "/admin/gallery/popups/new", icon: Bell, color: "bg-sky-600", shadow: "shadow-sky-200" },
  { label: "Επιτυχόντας", href: "/admin/success-stories/new", icon: GraduationCap, color: "bg-emerald-600", shadow: "shadow-emerald-200" },
];

const recentActivity = [
  { title: "Νέα ανακοίνωση: Θερινά Τμήματα 2026", time: "Πριν 2 ώρες", type: "post" },
  { title: "Προσθήκη καθηγητή: Ιωάννης Παπαδόπουλος", time: "Πριν 5 ώρες", type: "teacher" },
  { title: "Νέο μήνυμα από: Μαρία Κ.", time: "Εχθές, 18:30", type: "message" },
  { title: "Νέο Popup αρχικής σελίδας", time: "Εχθές, 14:00", type: "popup" },
  { title: "Νέος επιτυχών: Νίκος Παπάς — ΑΠΘ", time: "3 μέρες πριν", type: "success" },
];

const typeConfig: Record<string, { color: string; label: string }> = {
  post: { color: "bg-blue-500", label: "Ανακοίνωση" },
  teacher: { color: "bg-violet-500", label: "Καθηγητής" },
  message: { color: "bg-amber-500", label: "Μήνυμα" },
  popup: { color: "bg-teal-500", label: "Popup" },
  success: { color: "bg-emerald-500", label: "Επιτυχών" },
};

export default async function AdminDashboard() {
  const { posts, teachers, successStories, messages, popups } = await getDashboardData();

  const now = new Date();
  const hour = now.getHours();
  const greeting =
    hour < 12 ? "Καλημέρα" : hour < 18 ? "Καλό απόγευμα" : "Καλό βράδυ";

  const stats = [
    {
      name: "Ανακοινώσεις",
      value: posts,
      icon: FileText,
      colorText: "text-blue-600",
      colorBg: "bg-blue-50",
      colorBorder: "border-blue-100",
      colorAccent: "bg-blue-600",
      href: "/admin/posts",
    },
    {
      name: "Καθηγητές",
      value: teachers,
      icon: Users,
      colorText: "text-violet-600",
      colorBg: "bg-violet-50",
      colorBorder: "border-violet-100",
      colorAccent: "bg-violet-600",
      href: "/admin/teachers",
    },
    {
      name: "Επιτυχόντες",
      value: successStories,
      icon: GraduationCap,
      colorText: "text-emerald-600",
      colorBg: "bg-emerald-50",
      colorBorder: "border-emerald-100",
      colorAccent: "bg-emerald-600",
      href: "/admin/success-stories",
    },
    {
      name: "Αδιάβαστα Μηνύματα",
      value: messages,
      icon: MessageSquare,
      colorText: "text-amber-600",
      colorBg: "bg-amber-50",
      colorBorder: "border-amber-100",
      colorAccent: "bg-amber-600",
      href: "/admin/messages",
      alert: messages > 0,
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">

      {/* ── Welcome Banner ── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 md:p-8 border border-white/10">
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-amber-400/90 text-xs font-bold uppercase tracking-widest">
                {new Date().toLocaleDateString("el-GR", { weekday: "long", day: "numeric", month: "long" })}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-heading font-black text-white tracking-tight">
              {greeting}! 👋
            </h1>
            <p className="text-slate-400 mt-1.5 text-sm">
              Σύνοψη δεδομένων του ιστότοπου Διδακτήριον.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto sm:shrink-0">
            <Button
              asChild
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30 transition-all h-9 text-sm font-semibold w-full sm:w-auto justify-center"
            >
              <Link href="/" target="_blank">
                <ExternalLink className="w-4 h-4 mr-2" />
                Προεπισκόπηση
              </Link>
            </Button>
            <Button
              asChild
              className="bg-blue-600 hover:bg-blue-500 text-white h-9 text-sm font-bold shadow-lg shadow-blue-900/40 transition-all w-full sm:w-auto justify-center"
            >
              <Link href="/admin/posts/new">
                <Plus className="w-4 h-4 mr-1.5" />
                Νέα Ανακοίνωση
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat) => (
          <Link key={stat.name} href={stat.href} className="group">
            <div
              className={`relative bg-white rounded-2xl border ${stat.colorBorder} p-5 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 overflow-hidden`}
            >
              {/* Subtle top accent bar */}
              <div className={`absolute top-0 left-0 right-0 h-0.5 ${stat.colorAccent} rounded-t-2xl`} />

              <div className="flex items-start justify-between mb-4">
                <div className={`${stat.colorBg} ${stat.colorText} p-2.5 rounded-xl`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-1.5">
                  {stat.alert && (
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                    </span>
                  )}
                  <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
              </div>

              <p className="text-4xl font-black text-slate-900 leading-none">{stat.value}</p>
              <p className="text-[13px] font-semibold text-slate-500 mt-1.5">{stat.name}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* ── Main Content Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

        {/* Recent Activity — timeline style */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-50">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                <Clock className="w-4 h-4" />
              </div>
              <h2 className="font-heading font-bold text-slate-900 text-[15px]">
                Πρόσφατη Δραστηριότητα
              </h2>
            </div>
            <Link
              href="/admin/posts"
              className="text-xs font-semibold text-slate-400 hover:text-primary transition-colors"
            >
              Προβολή όλων →
            </Link>
          </div>

          <div className="px-6 py-2 divide-y divide-slate-50">
            {recentActivity.map((activity, i) => {
              const cfg = typeConfig[activity.type];
              return (
                <div key={i} className="flex items-start gap-4 py-4 group">
                  <div className="flex flex-col items-center shrink-0 mt-0.5">
                    <div className={`w-2 h-2 rounded-full ${cfg.color} ring-4 ring-white`} />
                    {i < recentActivity.length - 1 && (
                      <div className="w-px flex-1 bg-slate-100 mt-1.5 mb-[-16px]" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0 pb-0">
                    <p className="text-[13px] font-semibold text-slate-800 leading-snug">
                      {activity.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`admin-badge-info text-[10px] font-bold`}>
                        {cfg.label}
                      </span>
                      <span className="text-[11px] text-slate-400">{activity.time}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right column: Quick Actions + Status */}
        <div className="lg:col-span-2 space-y-5">

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2.5 px-6 py-4 border-b border-slate-50">
              <div className="w-8 h-8 rounded-xl bg-violet-50 flex items-center justify-center text-violet-600">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h2 className="font-heading font-bold text-slate-900 text-[15px]">
                Γρήγορες Ενέργειες
              </h2>
            </div>
            <div className="p-4 grid grid-cols-2 gap-2">
              {quickActions.map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className="flex flex-col items-center gap-2.5 p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all duration-200 group text-center"
                >
                  <div
                    className={`${action.color} w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-md ${action.shadow} group-hover:scale-105 transition-transform`}
                  >
                    <action.icon className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-700 group-hover:text-slate-900 leading-tight">
                    {action.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* System Status */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2.5 px-6 py-4 border-b border-slate-50">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <BarChart3 className="w-4 h-4" />
              </div>
              <h2 className="font-heading font-bold text-slate-900 text-[15px]">
                Κατάσταση Συστήματος
              </h2>
            </div>
            <div className="px-6 py-4 space-y-3">
              {[
                { label: "Ιστότοπος", status: "Ενεργός", ok: true },
                { label: "Βάση Δεδομένων", status: "Συνδεδεμένη", ok: true },
                { label: "Αποθήκευση Εικόνων", status: "Λειτουργεί", ok: true },
                { label: "Email Service", status: "Λειτουργεί", ok: true },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-[13px] text-slate-600 font-medium">{item.label}</span>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-[11px] font-semibold text-emerald-600">{item.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Sections overview ── */}
      <div>
        <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] mb-3">
          Ενότητες
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            { label: "Μηνύματα", href: "/admin/messages", icon: MessageSquare, count: messages, alert: messages > 0, color: "group-hover:text-amber-600", hoverBg: "group-hover:bg-amber-50", hoverBorder: "group-hover:border-amber-200" },
            { label: "Ανακοινώσεις", href: "/admin/posts", icon: FileText, count: posts, color: "group-hover:text-blue-600", hoverBg: "group-hover:bg-blue-50", hoverBorder: "group-hover:border-blue-200" },
            { label: "Καθηγητές", href: "/admin/teachers", icon: Users, count: teachers, color: "group-hover:text-violet-600", hoverBg: "group-hover:bg-violet-50", hoverBorder: "group-hover:border-violet-200" },
            { label: "Επιτυχόντες", href: "/admin/success-stories", icon: GraduationCap, count: successStories, color: "group-hover:text-emerald-600", hoverBg: "group-hover:bg-emerald-50", hoverBorder: "group-hover:border-emerald-200" },
            { label: "Popups", href: "/admin/gallery", icon: Bell, count: popups, color: "group-hover:text-sky-600", hoverBg: "group-hover:bg-sky-50", hoverBorder: "group-hover:border-sky-200" },
          ].map((item) => (
            <Link key={item.label} href={item.href} className="group">
              <div className={`bg-white border border-slate-100 rounded-2xl p-4 text-center hover:shadow-md ${item.hoverBorder} hover:-translate-y-0.5 transition-all duration-200 h-full flex flex-col justify-between`}>
                <div>
                  <div className={`w-10 h-10 rounded-xl bg-slate-50 ${item.hoverBg} flex items-center justify-center mx-auto mb-3 transition-colors relative`}>
                    <item.icon className={`w-5 h-5 text-slate-400 ${item.color} transition-colors`} />
                    {item.alert && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
                    )}
                  </div>
                  <p className={`text-xs font-bold text-slate-600 ${item.color} transition-colors`}>
                    {item.label}
                  </p>
                </div>
                {item.count !== undefined && (
                  <p className="text-2xl font-black text-slate-900 mt-1.5">{item.count}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
