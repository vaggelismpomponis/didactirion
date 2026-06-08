export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Plus,
  MoreHorizontal,
  Edit,
  Trash,
  GraduationCap,
  Upload,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { slugifyName } from "@/lib/teacher-slug";
import Link from "next/link";

async function getSuccessStories() {
  return await prisma.successStory.findMany({ orderBy: { year: "desc" } });
}

export default async function SuccessStoriesPage() {
  const stories = await getSuccessStories();

  const yearCounts = stories.reduce<Record<number, number>>((acc, s) => {
    if (s.year) acc[s.year] = (acc[s.year] || 0) + 1;
    return acc;
  }, {});
  const years = Object.keys(yearCounts).map(Number).sort().reverse();
  const latestYear = years[0];

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-1 h-10 bg-gradient-to-b from-emerald-500 to-emerald-600 rounded-full shrink-0 mt-0.5" />
          <div>
            <h1 className="text-xl font-heading font-black text-slate-900">Επιτυχόντες</h1>
            <p className="text-[13px] text-slate-500 mt-0.5">
              {stories.length} σύνολο
              {latestYear && (
                <span className="ml-2 text-emerald-600 font-semibold">
                  · {yearCounts[latestYear]} από το {latestYear}
                </span>
              )}
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          <Button
            asChild
            variant="outline"
            className="w-full sm:w-auto border-slate-200 text-slate-600 hover:bg-slate-50 font-heading font-bold h-9 rounded-xl transition-all justify-center"
          >
            <Link href="/admin/success-stories/bulk">
              <Upload className="w-4 h-4 mr-1.5" /> Μαζική Εισαγωγή
            </Link>
          </Button>
          <Button
            asChild
            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 font-heading font-bold shadow-lg shadow-emerald-200 h-9 rounded-xl transition-all justify-center"
          >
            <Link href="/admin/success-stories/new">
              <Plus className="w-4 h-4 mr-1.5" /> Προσθήκη Επιτυχόντα
            </Link>
          </Button>
        </div>
      </div>

      {/* Year chips */}
      {years.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Έτη:</span>
          {years.slice(0, 6).map((yr) => (
            <span
              key={yr}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200"
            >
              <GraduationCap className="w-3 h-3" />
              {yr} <span className="text-emerald-500">({yearCounts[yr]})</span>
            </span>
          ))}
        </div>
      )}

      {/* Table card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="px-5 py-3 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center gap-3 bg-slate-50/40">
          <div className="relative w-full sm:flex-1 sm:max-w-sm">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              placeholder="Αναζήτηση επιτυχόντων..."
              className="w-full pl-9 pr-4 h-9 text-[13px] rounded-xl border border-slate-200 bg-white focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all placeholder:text-slate-400 text-slate-900"
            />
          </div>
          {latestYear && (
            <div className="flex sm:ml-auto shrink-0">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-xl">
                <GraduationCap className="w-3 h-3" /> Τελευταίο: {latestYear}
              </span>
            </div>
          )}
        </div>

        {/* ── Desktop Table ── */}
        <div className="hidden md:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/60 hover:bg-slate-50/60 border-b border-slate-100">
                <TableHead className="font-heading font-bold text-slate-500 text-[11px] uppercase tracking-wider pl-5">
                  Ονοματεπώνυμο
                </TableHead>
                <TableHead className="font-heading font-bold text-slate-500 text-[11px] uppercase tracking-wider">
                  Πανεπιστήμιο / Σχολή
                </TableHead>
                <TableHead className="font-heading font-bold text-slate-500 text-[11px] uppercase tracking-wider">
                  Τμήμα
                </TableHead>
                <TableHead className="font-heading font-bold text-slate-500 text-[11px] uppercase tracking-wider w-20">
                  Έτος
                </TableHead>
                <TableHead className="w-14" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {stories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-24 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-300">
                        <GraduationCap className="w-8 h-8" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-700">Δεν βρέθηκαν επιτυχόντες</p>
                        <p className="text-sm text-slate-400 mt-1">Προσθέστε τον πρώτο επιτυχόντα</p>
                      </div>
                      <Button asChild size="sm" className="bg-emerald-600 hover:bg-emerald-500 h-8 font-bold rounded-xl">
                        <Link href="/admin/success-stories/new">
                          <Plus className="w-3.5 h-3.5 mr-1" /> Προσθήκη
                        </Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                stories.map((story) => (
                  <TableRow key={story.id} className="hover:bg-slate-50/60 transition-colors duration-150 border-b border-slate-50 group">
                    <TableCell className="pl-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-black text-xs shrink-0 uppercase shadow-sm">
                          {story.name?.[0] ?? "?"}
                        </div>
                        <span className="font-semibold text-[13px] text-slate-800">{story.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-[13px] text-slate-600 font-medium">{story.university}</TableCell>
                    <TableCell className="text-[13px] text-slate-500">{story.faculty}</TableCell>
                    <TableCell>
                      {story.year && (
                        <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-xl bg-emerald-50 text-emerald-700 text-[11px] font-black border border-emerald-200">
                          {story.year}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button asChild variant="ghost" size="icon" className="w-8 h-8 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl">
                          <Link href={`/admin/success-stories/edit/${slugifyName(story.name)}`}>
                            <Edit className="w-3.5 h-3.5" />
                          </Link>
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="w-8 h-8 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-44 rounded-xl">
                            <DropdownMenuLabel className="text-[11px] text-slate-500">Ενέργειες</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild className="gap-2 text-[13px] rounded-lg">
                              <Link href={`/admin/success-stories/edit/${slugifyName(story.name)}`}>
                                <Edit className="w-3.5 h-3.5" /> Επεξεργασία
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="gap-2 text-[13px] text-red-600 focus:text-red-600 focus:bg-red-50 rounded-lg">
                              <Trash className="w-3.5 h-3.5" /> Διαγραφή
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* ── Mobile Cards ── */}
        <div className="md:hidden divide-y divide-slate-50">
          {stories.length === 0 ? (
            <div className="py-20 flex flex-col items-center gap-4 text-center px-6">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-300">
                <GraduationCap className="w-7 h-7" />
              </div>
              <div>
                <p className="font-bold text-slate-700">Δεν βρέθηκαν επιτυχόντες</p>
                <p className="text-sm text-slate-400 mt-1">Προσθέστε τον πρώτο επιτυχόντα</p>
              </div>
              <Button asChild size="sm" className="bg-emerald-600 hover:bg-emerald-500 h-8 font-bold rounded-xl">
                <Link href="/admin/success-stories/new">
                  <Plus className="w-3.5 h-3.5 mr-1" /> Προσθήκη
                </Link>
              </Button>
            </div>
          ) : (
            stories.map((story) => (
              <div key={story.id} className="flex items-center gap-3 p-4 hover:bg-slate-50/60 transition-colors">
                {/* Avatar */}
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-black text-sm shrink-0 uppercase shadow-sm">
                  {story.name?.[0] ?? "?"}
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[14px] text-slate-800 truncate">{story.name}</p>
                  <p className="text-[12px] text-slate-500 truncate">{story.university}{story.faculty ? ` · ${story.faculty}` : ""}</p>
                  {story.year && (
                    <span className="inline-flex items-center gap-0.5 mt-1 px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 text-[10px] font-black border border-emerald-200">
                      <GraduationCap className="w-2.5 h-2.5" /> {story.year}
                    </span>
                  )}
                </div>
                {/* Actions */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="w-8 h-8 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl shrink-0">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-44 rounded-xl">
                    <DropdownMenuItem asChild className="gap-2 text-[13px] rounded-lg">
                      <Link href={`/admin/success-stories/edit/${slugifyName(story.name)}`}>
                        <Edit className="w-3.5 h-3.5" /> Επεξεργασία
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="gap-2 text-[13px] text-red-600 focus:text-red-600 focus:bg-red-50 rounded-lg">
                      <Trash className="w-3.5 h-3.5" /> Διαγραφή
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))
          )}
        </div>


        {stories.length > 0 && (
          <div className="px-5 py-3 border-t border-slate-50 bg-slate-50/30 text-[12px] text-slate-400">
            Σύνολο: {stories.length} επιτυχόντες
          </div>
        )}
      </div>
    </div>
  );
}
