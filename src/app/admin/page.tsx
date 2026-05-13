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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

async function getDashboardData() {
  const [posts, teachers, successStories, messages] = await Promise.all([
    prisma.post.count(),
    prisma.teacher.count(),
    prisma.successStory.count(),
    prisma.contactMessage.count({ where: { isRead: false } }),
  ]);
  return { posts, teachers, successStories, messages };
}

const quickActions = [
  { label: "Νέα Ανακοίνωση", href: "/admin/posts/new", icon: FileText, color: "bg-blue-500" },
  { label: "Προσθήκη Καθηγητή", href: "/admin/teachers/new", icon: Users, color: "bg-violet-500" },
  { label: "Νέο Banner", href: "/admin/gallery/banners/new", icon: ImageIcon, color: "bg-sky-500" },
  { label: "Προεπισκόπηση Site", href: "/", icon: ExternalLink, color: "bg-slate-600", external: true },
];

const recentActivity = [
  { title: "Νέα ανακοίνωση: Θερινά Τμήματα 2026", time: "Πριν 2 ώρες", type: "post" },
  { title: "Προσθήκη καθηγητή: Ιωάννης Παπαδόπουλος", time: "Πριν 5 ώρες", type: "teacher" },
  { title: "Νέο μήνυμα από: Μαρία Κ.", time: "Εχθές, 18:30", type: "message" },
  { title: "Ενημέρωση Banner αρχικής σελίδας", time: "Εχθές, 14:00", type: "media" },
];

const typeColors: Record<string, string> = {
  post: "bg-blue-500",
  teacher: "bg-violet-500",
  message: "bg-amber-500",
  media: "bg-teal-500",
};

export default async function AdminDashboard() {
  const { posts, teachers, successStories, messages } = await getDashboardData();

  const stats = [
    { name: "Ανακοινώσεις", value: posts, icon: FileText, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100", href: "/admin/posts" },
    { name: "Καθηγητές", value: teachers, icon: Users, color: "text-violet-600", bg: "bg-violet-50", border: "border-violet-100", href: "/admin/teachers" },
    { name: "Επιτυχόντες", value: successStories, icon: GraduationCap, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100", href: "/admin/success-stories" },
    { name: "Αδιάβαστα Μηνύματα", value: messages, icon: MessageSquare, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100", href: "/admin/messages" },
  ];

  return (
    <div className="space-y-7">
      {/* ── Page Header ── */}
      <div>
        <h1 className="text-2xl font-heading font-black text-slate-900">Πίνακας Ελέγχου</h1>
        <p className="text-sm text-slate-500 mt-0.5">Σύνοψη του ιστότοπου Διδακτήριον.</p>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link key={stat.name} href={stat.href} className="group">
            <div className={`bg-white rounded-2xl border ${stat.border} p-5 hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5`}>
              <div className="flex items-start justify-between mb-4">
                <div className={`${stat.bg} ${stat.color} p-2.5 rounded-xl`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>
              <p className="text-3xl font-black text-slate-900">{stat.value}</p>
              <p className="text-sm font-medium text-slate-500 mt-0.5">{stat.name}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Recent Activity ── */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                <Clock className="w-4 h-4" />
              </div>
              <h2 className="font-heading font-bold text-slate-900">Πρόσφατη Δραστηριότητα</h2>
            </div>
            <Button variant="ghost" size="sm" asChild className="text-slate-500 hover:text-slate-900 text-xs font-medium h-8">
              <Link href="/admin/posts">Προβολή όλων →</Link>
            </Button>
          </div>
          <div className="divide-y divide-slate-50">
            {recentActivity.map((activity, i) => (
              <div key={i} className="flex items-start gap-4 px-6 py-4 hover:bg-slate-50/50 transition-colors">
                <div className={`w-2 h-2 rounded-full ${typeColors[activity.type]} mt-2 shrink-0`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{activity.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Quick Actions ── */}
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div className="flex items-center gap-2 px-6 py-4 border-b border-slate-50">
            <div className="w-8 h-8 rounded-xl bg-violet-50 flex items-center justify-center text-violet-600">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h2 className="font-heading font-bold text-slate-900">Γρήγορες Ενέργειες</h2>
          </div>
          <div className="p-4 space-y-2">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                href={action.href}
                target={action.external ? "_blank" : undefined}
                rel={action.external ? "noopener noreferrer" : undefined}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group"
              >
                <div className={`${action.color} w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0`}>
                  <action.icon className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors flex-1">
                  {action.label}
                </span>
                {action.external ? (
                  <ExternalLink className="w-3.5 h-3.5 text-slate-300" />
                ) : (
                  <Plus className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500 transition-colors" />
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── Navigation Shortcut Cards ── */}
      <div>
        <h2 className="text-sm font-heading font-bold text-slate-500 uppercase tracking-widest mb-3">Ενότητες</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            { label: "Μηνύματα", href: "/admin/messages", icon: MessageSquare, count: messages, alert: messages > 0 },
            { label: "Ανακοινώσεις", href: "/admin/posts", icon: FileText, count: posts },
            { label: "Καθηγητές", href: "/admin/teachers", icon: Users, count: teachers },
            { label: "Επιτυχόντες", href: "/admin/success-stories", icon: GraduationCap, count: successStories },
            { label: "Gallery", href: "/admin/gallery", icon: ImageIcon },
          ].map((item) => (
            <Link key={item.label} href={item.href} className="group">
              <div className="bg-white border border-slate-100 rounded-2xl p-4 text-center hover:shadow-md hover:border-primary/20 hover:-translate-y-0.5 transition-all duration-200 h-full flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/10 transition-colors relative">
                    <item.icon className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
                    {item.alert && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
                    )}
                  </div>
                  <p className="text-xs font-bold text-slate-700 group-hover:text-primary transition-colors">{item.label}</p>
                </div>
                <p className={`text-lg font-black mt-0.5 ${item.count !== undefined ? "text-slate-900" : "opacity-0 select-none"}`}>
                  {item.count !== undefined ? item.count : "0"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
