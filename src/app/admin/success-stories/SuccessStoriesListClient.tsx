"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Edit,
  Trash,
  GraduationCap,
  Upload,
  Search,
  Loader2,
  MoreHorizontal,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { slugifyName } from "@/lib/teacher-slug";
import Link from "next/link";

type SuccessStory = {
  id: string;
  name: string;
  university: string;
  photo: string | null;
  createdAt: Date;
  updatedAt: Date;
};

interface SuccessStoriesListClientProps {
  initialStories: SuccessStory[];
}

export function SuccessStoriesListClient({ initialStories }: SuccessStoriesListClientProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredStories = initialStories.filter((story) => {
    const query = searchQuery.toLowerCase().trim();
    return (
      story.name.toLowerCase().includes(query) ||
      story.university.toLowerCase().includes(query)
    );
  });

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/admin/success-stories/${deleteId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete");
      setDeleteId(null);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Σφάλμα κατά τη διαγραφή του επιτυχόντα.");
    } finally {
      setIsDeleting(false);
    }
  };

  const deletingStoryName = initialStories.find((s) => s.id === deleteId)?.name;

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-1 h-10 bg-gradient-to-b from-emerald-500 to-emerald-600 rounded-full shrink-0 mt-0.5" />
          <div>
            <h1 className="text-xl font-heading font-black text-slate-900">Επιτυχόντες</h1>
            <p className="text-[13px] text-slate-500 mt-0.5">
              {initialStories.length} σύνολο
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            asChild
            variant="outline"
            className="border-slate-200 text-slate-600 hover:bg-slate-50 font-heading font-bold h-9 rounded-xl transition-all"
          >
            <Link href="/admin/success-stories/bulk">
              <Upload className="w-4 h-4 mr-1.5" /> Μαζική Εισαγωγή
            </Link>
          </Button>
          <Button
            asChild
            className="bg-emerald-600 hover:bg-emerald-500 font-heading font-bold shadow-lg shadow-emerald-200 h-9 rounded-xl transition-all"
          >
            <Link href="/admin/success-stories/new">
              <Plus className="w-4 h-4 mr-1.5" /> Προσθήκη Επιτυχόντα
            </Link>
          </Button>
        </div>
      </div>

      {/* Table card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="px-5 py-3 border-b border-slate-50 flex items-center gap-3 bg-slate-50/40">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              placeholder="Αναζήτηση επιτυχόντων..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 h-9 text-[13px] rounded-xl border border-slate-200 bg-white focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all placeholder:text-slate-400 text-slate-900"
            />
          </div>
          <div className="ml-auto text-[12px] text-slate-400 hidden sm:block">
            {filteredStories.length} / {initialStories.length}
          </div>
        </div>

        {/* ── Candidates Grid ── */}
        <div className="p-5">
          {filteredStories.length === 0 ? (
            <div className="py-24 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-300">
                  <GraduationCap className="w-8 h-8" />
                </div>
                <div>
                  <p className="font-bold text-slate-700">
                    {searchQuery ? "Δεν βρέθηκαν αποτελέσματα" : "Δεν βρέθηκαν επιτυχόντες"}
                  </p>
                  <p className="text-sm text-slate-400 mt-1">
                    {searchQuery ? "Δοκιμάστε διαφορετικό όρο αναζήτησης" : "Προσθέστε τον πρώτο επιτυχόντα"}
                  </p>
                </div>
                {!searchQuery && (
                  <Button asChild size="sm" className="bg-emerald-600 hover:bg-emerald-500 h-8 font-bold rounded-xl">
                    <Link href="/admin/success-stories/new">
                      <Plus className="w-3.5 h-3.5 mr-1" /> Προσθήκη
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredStories.map((story) => (
                <div key={story.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex items-start justify-between gap-3 group">
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-black text-sm shrink-0 uppercase shadow-sm">
                      {story.name?.[0] ?? "?"}
                    </div>
                    {/* Info */}
                    <div className="min-w-0">
                      <p className="font-bold text-[14px] text-slate-800 truncate" title={story.name}>{story.name}</p>
                      <p className="text-[12px] text-slate-500 truncate mt-0.5" title={story.university}>{story.university}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-0.5 shrink-0">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="w-8 h-8 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44 rounded-xl">
                        <DropdownMenuLabel className="text-[11px] text-slate-500">Ενέργειες</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild className="gap-2 text-[13px] rounded-lg cursor-pointer">
                          <Link href={`/admin/success-stories/edit/${slugifyName(story.name)}`}>
                            <Edit className="w-3.5 h-3.5" /> Επεξεργασία
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="gap-2 text-[13px] text-red-600 focus:text-red-600 focus:bg-red-50 rounded-lg cursor-pointer"
                          onClick={() => setDeleteId(story.id)}
                        >
                          <Trash className="w-3.5 h-3.5" /> Διαγραφή
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {filteredStories.length > 0 && (
          <div className="px-5 py-3 border-t border-slate-50 bg-slate-50/30 text-[12px] text-slate-400">
            Σύνολο: {filteredStories.length} επιτυχόντες
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>Διαγραφή Επιτυχόντα</DialogTitle>
            <DialogDescription>
              Είστε σίγουροι ότι θέλετε να διαγράψετε τον επιτυχόντα{" "}
              <strong className="text-slate-900">{deletingStoryName}</strong>; Η ενέργεια αυτή δεν
              μπορεί να αναιρεθεί.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteId(null)}
              disabled={isDeleting}
              className="rounded-xl"
            >
              Ακύρωση
            </Button>
            <Button
              className="text-white bg-red-600 hover:bg-red-700 transition-colors rounded-xl"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Διαγραφή...
                </>
              ) : (
                "Διαγραφή"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
