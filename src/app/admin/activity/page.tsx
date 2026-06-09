export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Clock, FileText, Users, GraduationCap, Bell, MessageSquare, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// Type configurations matching the dashboard styling
const typeConfig: Record<string, { color: string; label: string; icon: any }> = {
  post: { color: "bg-blue-50 text-blue-700 border-blue-100", label: "Ανακοίνωση", icon: FileText },
  teacher: { color: "bg-violet-50 text-violet-700 border-violet-100", label: "Καθηγητής", icon: Users },
  message: { color: "bg-amber-50 text-amber-700 border-amber-100", label: "Μήνυμα", icon: MessageSquare },
  popup: { color: "bg-teal-50 text-teal-700 border-teal-100", label: "Popup", icon: Bell },
  success: { color: "bg-emerald-50 text-emerald-700 border-emerald-100", label: "Επιτυχών", icon: GraduationCap },
};

function formatGreekDate(date: Date): string {
  return date.toLocaleString("el-GR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

interface SearchParams {
  page?: string;
}

export default async function ActivityHistoryPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const resolvedSearchParams = await searchParams;
  const currentPage = Math.max(1, parseInt(resolvedSearchParams.page || "1", 10));
  const pageSize = 15;

  const [posts, teachers, messages, popups, successStories] = await Promise.all([
    prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, title: true, createdAt: true },
    }),
    prisma.teacher.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, createdAt: true },
    }),
    prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, createdAt: true },
    }),
    prisma.popup.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, title: true, createdAt: true },
    }),
    prisma.successStory.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, university: true, createdAt: true },
    }),
  ]);

  const activities = [
    ...posts.map((p) => ({
      id: p.id,
      title: `Νέα ανακοίνωση: ${p.title}`,
      createdAt: p.createdAt,
      type: "post",
    })),
    ...teachers.map((t) => ({
      id: t.id,
      title: `Προσθήκη καθηγητή: ${t.name}`,
      createdAt: t.createdAt,
      type: "teacher",
    })),
    ...messages.map((m) => ({
      id: m.id,
      title: `Νέο μήνυμα από: ${m.name}`,
      createdAt: m.createdAt,
      type: "message",
    })),
    ...popups.map((p) => ({
      id: p.id,
      title: `Νέο Popup αρχικής σελίδας: ${p.title}`,
      createdAt: p.createdAt,
      type: "popup",
    })),
    ...successStories.map((s) => ({
      id: s.id,
      title: `Νέος επιτυχών: ${s.name} — ${s.university}`,
      createdAt: s.createdAt,
      type: "success",
    })),
  ];

  activities.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  const totalItems = activities.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const paginatedActivities = activities.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-heading font-black text-slate-900">Ιστορικό Δραστηριότητας</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Πλήρης κατάλογος όλων των καταχωρήσεων και ενεργειών στον ιστότοπο Διδακτήριον.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {paginatedActivities.length === 0 ? (
          <div className="py-20 text-center text-slate-400 text-sm font-semibold">
            Δεν υπάρχει καταγεγραμμένη δραστηριότητα
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {paginatedActivities.map((activity, i) => {
              const cfg = typeConfig[activity.type];
              const Icon = cfg.icon;
              let href = "/admin";
              if (activity.type === "post") href = `/admin/posts/edit/${activity.id}`;
              else if (activity.type === "teacher") href = `/admin/teachers/edit/${activity.id}`;
              else if (activity.type === "message") href = `/admin/messages`;
              else if (activity.type === "popup") href = `/admin/gallery/popups/edit/${activity.id}`;
              else if (activity.type === "success") href = `/admin/success-stories/edit/${activity.id}`;

              return (
                <Link
                  key={i}
                  href={href}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 hover:bg-slate-50/50 group transition-all duration-200"
                >
                  <div className="flex items-start gap-4 min-w-0">
                    <div className={`w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 text-slate-400 group-hover:text-primary transition-colors`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-slate-800 leading-snug group-hover:text-primary transition-colors">
                        {activity.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${cfg.color}`}>
                          {cfg.label}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">
                          {formatGreekDate(activity.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-blue-600 group-hover:underline">
                      Επεξεργασία &rarr;
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 bg-slate-50/50 border-t border-slate-100">
            <p className="text-xs font-medium text-slate-500">
              Σελίδα <span className="text-slate-800 font-bold">{currentPage}</span> από <span className="text-slate-800 font-bold">{totalPages}</span> · Σύνολο <span className="text-slate-800 font-bold">{totalItems}</span> δραστηριότητες
            </p>
            <div className="flex gap-2">
              <Button
                asChild
                variant="outline"
                size="sm"
                className="h-8 rounded-lg text-xs font-bold"
                disabled={currentPage === 1}
              >
                {currentPage > 1 ? (
                  <Link href={`/admin/activity?page=${currentPage - 1}`}>
                    <ChevronLeft className="w-4 h-4 mr-1" /> Προηγούμενη
                  </Link>
                ) : (
                  <span className="opacity-50 pointer-events-none flex items-center">
                    <ChevronLeft className="w-4 h-4 mr-1" /> Προηγούμενη
                  </span>
                )}
              </Button>
              <Button
                asChild
                variant="outline"
                size="sm"
                className="h-8 rounded-lg text-xs font-bold"
                disabled={currentPage === totalPages}
              >
                {currentPage < totalPages ? (
                  <Link href={`/admin/activity?page=${currentPage + 1}`}>
                    Επόμενη <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                ) : (
                  <span className="opacity-50 pointer-events-none flex items-center">
                    Επόμενη <ChevronRight className="w-4 h-4 ml-1" />
                  </span>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
