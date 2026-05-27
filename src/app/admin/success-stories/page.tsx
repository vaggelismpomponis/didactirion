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
  Search,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { slugifyName } from "@/lib/teacher-slug";
import Link from "next/link";

async function getSuccessStories() {
  return await prisma.successStory.findMany({ orderBy: { year: "desc" } });
}

export default async function SuccessStoriesPage() {
  const stories = await getSuccessStories();

  // Group counts by year
  const yearCounts = stories.reduce<Record<number, number>>((acc, s) => {
    if (s.year) acc[s.year] = (acc[s.year] || 0) + 1;
    return acc;
  }, {});
  const latestYear = Object.keys(yearCounts).sort().reverse()[0];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-heading font-black text-slate-900">Επιτυχόντες</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {stories.length} σύνολο
            {latestYear && (
              <span className="ml-2 text-emerald-600 font-medium">
                · {yearCounts[Number(latestYear)]} από το {latestYear}
              </span>
            )}
          </p>
        </div>
        <Button asChild className="bg-primary hover:bg-primary/90 font-heading font-bold shadow-md shadow-primary/20 h-9">
          <Link href="/admin/success-stories/new">
            <Plus className="w-4 h-4 mr-1.5" /> Προσθήκη Επιτυχόντα
          </Link>
        </Button>
      </div>

      {/* Table card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-50 flex items-center gap-3 bg-slate-50/50">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <Input
              placeholder="Αναζήτηση επιτυχόντων..."
              className="pl-9 h-8 text-sm rounded-lg border-slate-200 bg-white focus:border-primary"
            />
          </div>
          {latestYear && (
            <div className="ml-auto">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-lg">
                <GraduationCap className="w-3 h-3" /> Τελευταίο Έτος: {latestYear}
              </span>
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-b border-slate-100">
                <TableHead className="font-heading font-semibold text-slate-600 text-xs uppercase tracking-wider">Ονοματεπώνυμο</TableHead>
                <TableHead className="font-heading font-semibold text-slate-600 text-xs uppercase tracking-wider">Πανεπιστήμιο / ΤΕΙ</TableHead>
                <TableHead className="font-heading font-semibold text-slate-600 text-xs uppercase tracking-wider">Τμήμα</TableHead>
                <TableHead className="font-heading font-semibold text-slate-600 text-xs uppercase tracking-wider w-20">Έτος</TableHead>
                <TableHead className="w-14" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {stories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-300">
                        <GraduationCap className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-medium text-slate-500">Δεν βρέθηκαν επιτυχόντες</p>
                      <Button asChild size="sm" className="bg-primary h-8 font-bold text-xs">
                        <Link href="/admin/success-stories/new">
                          <Plus className="w-3.5 h-3.5 mr-1" /> Προσθέστε τον πρώτο
                        </Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                stories.map((story) => (
                  <TableRow key={story.id} className="hover:bg-slate-50/50 transition-colors border-b border-slate-50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-black text-xs shrink-0 uppercase">
                          {story.name?.[0] ?? "?"}
                        </div>
                        <span className="font-semibold text-sm text-slate-900">{story.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-slate-600">{story.university}</TableCell>
                    <TableCell className="text-sm text-slate-500">{story.faculty}</TableCell>
                    <TableCell>
                      {story.year && (
                        <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                          {story.year}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="w-8 h-8 text-slate-400 hover:text-slate-700 hover:bg-slate-100">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                          <DropdownMenuLabel className="text-xs text-slate-500">Ενέργειες</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild className="gap-2 text-sm">
                            <Link href={`/admin/success-stories/edit/${slugifyName(story.name)}`}>
                              <Edit className="w-3.5 h-3.5" /> Επεξεργασία
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="gap-2 text-sm text-red-600 focus:text-red-600 focus:bg-red-50">
                            <Trash className="w-3.5 h-3.5" /> Διαγραφή
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {stories.length > 0 && (
          <div className="px-4 py-3 border-t border-slate-50 bg-slate-50/30 text-xs text-slate-400">
            Σύνολο: {stories.length} επιτυχόντες
          </div>
        )}
      </div>
    </div>
  );
}
