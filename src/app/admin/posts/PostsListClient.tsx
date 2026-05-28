"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  FileText,
  CheckCircle2,
  Clock,
  Edit,
  Eye,
  Trash,
  Search,
  MoreHorizontal,
  Loader2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import Link from "next/link";

type Post = {
  id: string;
  title: string;
  slug: string;
  content: string;
  image: string | null;
  category: string | null;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
};

interface PostsListClientProps {
  initialPosts: Post[];
}

export function PostsListClient({ initialPosts }: PostsListClientProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeFilter, setActiveFilter] = useState<"all" | "published" | "draft">("all");

  const filteredPosts = initialPosts.filter((post) => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = post.title.toLowerCase().includes(query) || (post.category || "").toLowerCase().includes(query);
    
    if (!matchesSearch) return false;
    if (activeFilter === "published") return post.published;
    if (activeFilter === "draft") return !post.published;
    return true;
  });

  const publishedCount = initialPosts.filter((p) => p.published).length;
  const draftCount = initialPosts.length - publishedCount;

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/admin/posts/${deleteId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete");
      setDeleteId(null);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Σφάλμα κατά τη διαγραφή της ανακοίνωσης.");
    } finally {
      setIsDeleting(false);
    }
  };

  const deletingPostTitle = initialPosts.find((p) => p.id === deleteId)?.title;

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-1 h-10 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full shrink-0 mt-0.5" />
          <div>
            <h1 className="text-xl font-heading font-black text-slate-900">Ανακοινώσεις</h1>
            <p className="text-[13px] text-slate-500 mt-0.5">
              Διαχείριση άρθρων και ανακοινώσεων
            </p>
          </div>
        </div>
        <Button
          asChild
          className="bg-blue-600 hover:bg-blue-500 font-heading font-bold shadow-lg shadow-blue-200 h-9 rounded-xl transition-all"
        >
          <Link href="/admin/posts/new">
            <Plus className="w-4 h-4 mr-1.5" /> Νέα Ανακοίνωση
          </Link>
        </Button>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Σύνολο", value: initialPosts.length, color: "text-slate-700", bg: "bg-slate-50", border: "border-slate-200", filter: "all" as const },
          { label: "Δημοσιευμένα", value: publishedCount, color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200", filter: "published" as const },
          { label: "Πρόχειρα", value: draftCount, color: "text-slate-500", bg: "bg-slate-50", border: "border-slate-200", filter: "draft" as const },
        ].map((s) => (
          <button 
            key={s.label} 
            onClick={() => setActiveFilter(s.filter)}
            className={`${s.bg} border ${s.border} rounded-2xl px-4 py-3 text-center transition-all hover:scale-[1.02] cursor-pointer block w-full outline-none focus:ring-2 focus:ring-blue-100 ${activeFilter === s.filter ? "ring-2 ring-blue-500/50" : ""}`}
          >
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-[11px] font-semibold text-slate-500 mt-0.5">{s.label}</p>
          </button>
        ))}
      </div>

      {/* Table card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="px-5 py-3 border-b border-slate-50 flex items-center gap-3 bg-slate-50/40">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              placeholder="Αναζήτηση ανακοινώσεων..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 h-9 text-[13px] rounded-xl border border-slate-200 bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-slate-400 text-slate-900"
            />
          </div>
          {/* Filter chips */}
          <div className="hidden sm:flex items-center gap-1.5 ml-auto">
            <button
              onClick={() => setActiveFilter("all")}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer ${activeFilter === "all" ? "bg-slate-200 border-slate-300 text-slate-800" : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"}`}
            >
              Όλα
            </button>
            <button
              onClick={() => setActiveFilter("published")}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer ${activeFilter === "published" ? "bg-emerald-100 border-emerald-300 text-emerald-800" : "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"}`}
            >
              <CheckCircle2 className="w-3 h-3" />
              Δημοσιευμένα
            </button>
            <button
              onClick={() => setActiveFilter("draft")}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer ${activeFilter === "draft" ? "bg-slate-200 border-slate-300 text-slate-800" : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"}`}
            >
              <Clock className="w-3 h-3" />
              Πρόχειρα
            </button>
          </div>
        </div>

        {/* ── Desktop Table ── */}
        <div className="hidden md:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/60 hover:bg-slate-50/60 border-b border-slate-100">
                <TableHead className="w-[45%] font-heading font-bold text-slate-500 text-[11px] uppercase tracking-wider pl-5">
                  Τίτλος
                </TableHead>
                <TableHead className="font-heading font-bold text-slate-500 text-[11px] uppercase tracking-wider">
                  Κατηγορία
                </TableHead>
                <TableHead className="font-heading font-bold text-slate-500 text-[11px] uppercase tracking-wider">
                  Κατάσταση
                </TableHead>
                <TableHead className="font-heading font-bold text-slate-500 text-[11px] uppercase tracking-wider">
                  Ημερομηνία
                </TableHead>
                <TableHead className="w-[56px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPosts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-24 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-300">
                        <FileText className="w-8 h-8" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-700">Δεν βρέθηκαν ανακοινώσεις</p>
                        <p className="text-sm text-slate-400 mt-1">Δημιουργήστε την πρώτη σας ανακοίνωση</p>
                      </div>
                      <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-500 h-8 font-bold rounded-xl">
                        <Link href="/admin/posts/new">
                          <Plus className="w-3.5 h-3.5 mr-1" /> Δημιουργία
                        </Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredPosts.map((post) => (
                  <TableRow
                    key={post.id}
                    className="hover:bg-slate-50/60 transition-colors duration-150 border-b border-slate-50 group"
                  >
                    <TableCell className="pl-5">
                      <div className="flex items-center gap-3">
                        {post.image ? (
                          <div className="w-9 h-9 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100">
                            <img src={post.image} alt="" className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 border border-slate-100 text-slate-300">
                            <FileText className="w-4 h-4" />
                          </div>
                        )}
                        <span className="font-semibold text-[13px] text-slate-800 line-clamp-1">{post.title}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200 capitalize">
                        {post.category === "announcements" ? "Ανακοίνωση" : 
                         post.category === "exams" ? "Εξετάσεις" : 
                         post.category === "news" ? "Νέα" : 
                         post.category === "articles" ? "Άρθρο" : 
                         post.category || "Ανακοίνωση"}
                      </span>
                    </TableCell>
                    <TableCell>
                      {post.published ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" /> Δημοσιευμένο
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-500 border border-slate-200">
                          <Clock className="w-3 h-3" /> Πρόχειρο
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-slate-500 text-[12px]">
                      {new Date(post.createdAt).toLocaleDateString("el-GR")}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button asChild variant="ghost" size="icon" className="w-8 h-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl">
                          <Link href={`/admin/posts/edit/${post.slug}`}><Edit className="w-3.5 h-3.5" /></Link>
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="w-8 h-8 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-44 rounded-xl">
                            <DropdownMenuItem asChild className="gap-2 text-[13px] rounded-lg cursor-pointer">
                              <Link href={`/announcements/${post.slug}`} target="_blank"><Eye className="w-3.5 h-3.5" /> Προβολή</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild className="gap-2 text-[13px] rounded-lg cursor-pointer">
                              <Link href={`/admin/posts/edit/${post.slug}`}><Edit className="w-3.5 h-3.5" /> Επεξεργασία</Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="gap-2 text-[13px] text-red-600 focus:text-red-600 focus:bg-red-50 rounded-lg cursor-pointer"
                              onClick={() => setDeleteId(post.id)}
                            >
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
          {filteredPosts.length === 0 ? (
            <div className="py-20 flex flex-col items-center gap-4 text-center px-6">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-300">
                <FileText className="w-7 h-7" />
              </div>
              <div>
                <p className="font-bold text-slate-700">Δεν βρέθηκαν ανακοινώσεις</p>
                <p className="text-sm text-slate-400 mt-1">Δημιουργήστε την πρώτη σας ανακοίνωση</p>
              </div>
              <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-500 h-8 font-bold rounded-xl">
                <Link href="/admin/posts/new"><Plus className="w-3.5 h-3.5 mr-1" /> Δημιουργία</Link>
              </Button>
            </div>
          ) : (
            filteredPosts.map((post) => (
              <div key={post.id} className="flex items-start gap-3 p-4 hover:bg-slate-50/60 transition-colors">
                {/* Thumbnail */}
                {post.image ? (
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100">
                    <img src={post.image} alt="" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 border border-slate-100 text-slate-300">
                    <FileText className="w-6 h-6" />
                  </div>
                )}
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[14px] text-slate-800 leading-tight line-clamp-2">{post.title}</p>
                  <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200 capitalize">
                      {post.category === "announcements" ? "Ανακοίνωση" : 
                       post.category === "exams" ? "Εξετάσεις" : 
                       post.category === "news" ? "Νέα" : 
                       post.category === "articles" ? "Άρθρο" : 
                       post.category || "Ανακοίνωση"}
                    </span>
                    {post.published ? (
                      <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-2.5 h-2.5" /> Δημοσιευμένο
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-500 border border-slate-200">
                        <Clock className="w-2.5 h-2.5" /> Πρόχειρο
                      </span>
                    )}
                    <span className="text-[10px] text-slate-400">{new Date(post.createdAt).toLocaleDateString("el-GR")}</span>
                  </div>
                </div>
                {/* Action */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="w-8 h-8 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl shrink-0">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-44 rounded-xl">
                    <DropdownMenuItem asChild className="gap-2 text-[13px] rounded-lg cursor-pointer">
                      <Link href={`/announcements/${post.slug}`} target="_blank"><Eye className="w-3.5 h-3.5" /> Προβολή</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="gap-2 text-[13px] rounded-lg cursor-pointer">
                      <Link href={`/admin/posts/edit/${post.slug}`}><Edit className="w-3.5 h-3.5" /> Επεξεργασία</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="gap-2 text-[13px] text-red-600 focus:text-red-600 focus:bg-red-50 rounded-lg cursor-pointer"
                      onClick={() => setDeleteId(post.id)}
                    >
                      <Trash className="w-3.5 h-3.5" /> Διαγραφή
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))
          )}
        </div>

        {filteredPosts.length > 0 && (
          <div className="px-5 py-3 border-t border-slate-50 bg-slate-50/30 text-[12px] text-slate-400 flex items-center justify-between">
            <span>Σύνολο: {filteredPosts.length} ανακοινώσεις</span>
            <span>{publishedCount} δημοσιευμένα · {draftCount} πρόχειρα</span>
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
            <DialogTitle>Διαγραφή Ανακοίνωσης</DialogTitle>
            <DialogDescription>
              Είστε σίγουροι ότι θέλετε να διαγράψετε την ανακοίνωση{" "}
              <strong className="text-slate-900">{deletingPostTitle}</strong>; Η ενέργεια αυτή δεν
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
