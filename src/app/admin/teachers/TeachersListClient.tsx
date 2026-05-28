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
  Edit,
  Trash,
  User,
  Search,
  Users,
  Loader2,
  MoreHorizontal,
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
import { buildTeacherSlug } from "@/lib/teacher-slug";

type Teacher = {
  id: string;
  name: string;
  specialty: string;
  bio: string;
  photo: string | null;
  order: number;
  createdAt: Date;
  updatedAt: Date;
};

interface TeachersListClientProps {
  initialTeachers: Teacher[];
}

export function TeachersListClient({ initialTeachers }: TeachersListClientProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredTeachers = initialTeachers.filter((teacher) => {
    const query = searchQuery.toLowerCase().trim();
    return (
      teacher.name.toLowerCase().includes(query) ||
      teacher.specialty.toLowerCase().includes(query)
    );
  });

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/admin/teachers/${deleteId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete");
      setDeleteId(null);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Σφάλμα κατά τη διαγραφή του καθηγητή.");
    } finally {
      setIsDeleting(false);
    }
  };

  const deletingTeacherName = initialTeachers.find((t) => t.id === deleteId)?.name;

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-1 h-10 bg-gradient-to-b from-violet-500 to-violet-600 rounded-full shrink-0 mt-0.5" />
          <div>
            <h1 className="text-xl font-heading font-black text-slate-900">Καθηγητές</h1>
            <p className="text-[13px] text-slate-500 mt-0.5">
              Διδακτικό προσωπικό · {initialTeachers.length} καθηγητές
            </p>
          </div>
        </div>
        <Button
          asChild
          className="bg-violet-600 hover:bg-violet-500 font-heading font-bold shadow-lg shadow-violet-200 h-9 rounded-xl transition-all"
        >
          <Link href="/admin/teachers/new">
            <Plus className="w-4 h-4 mr-1.5" /> Προσθήκη Καθηγητή
          </Link>
        </Button>
      </div>

      {/* Table card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="px-5 py-3 border-b border-slate-50 flex items-center gap-3 bg-slate-50/40">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              placeholder="Αναζήτηση καθηγητών..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 h-9 text-[13px] rounded-xl border border-slate-200 bg-white focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none transition-all placeholder:text-slate-400 text-slate-900"
            />
          </div>
          <div className="ml-auto text-[12px] text-slate-400 hidden sm:block">
            {filteredTeachers.length} / {initialTeachers.length}
          </div>
        </div>

        {/* ── Desktop Table ── */}
        <div className="hidden md:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/60 hover:bg-slate-50/60 border-b border-slate-100">
                <TableHead className="w-16 font-heading font-bold text-slate-500 text-[11px] uppercase tracking-wider pl-5">
                  Φωτό
                </TableHead>
                <TableHead className="font-heading font-bold text-slate-500 text-[11px] uppercase tracking-wider">
                  Ονοματεπώνυμο
                </TableHead>
                <TableHead className="font-heading font-bold text-slate-500 text-[11px] uppercase tracking-wider">
                  Ειδικότητα
                </TableHead>
                <TableHead className="font-heading font-bold text-slate-500 text-[11px] uppercase tracking-wider w-24">
                  Σειρά
                </TableHead>
                <TableHead className="w-16" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTeachers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-24 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-300">
                        <Users className="w-8 h-8" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-700">
                          {searchQuery ? "Δεν βρέθηκαν αποτελέσματα" : "Δεν βρέθηκαν καθηγητές"}
                        </p>
                        <p className="text-sm text-slate-400 mt-1">
                          {searchQuery ? "Δοκιμάστε διαφορετικό όρο αναζήτησης" : "Προσθέστε τον πρώτο καθηγητή"}
                        </p>
                      </div>
                      {!searchQuery && (
                        <Button asChild size="sm" className="bg-violet-600 hover:bg-violet-500 h-8 font-bold rounded-xl">
                          <Link href="/admin/teachers/new">
                            <Plus className="w-3.5 h-3.5 mr-1" /> Προσθήκη
                          </Link>
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredTeachers.map((teacher) => (
                  <TableRow
                    key={teacher.id}
                    className="hover:bg-slate-50/60 transition-colors duration-150 border-b border-slate-50 group"
                  >
                    <TableCell className="pl-5">
                      <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden border-2 border-slate-200 shrink-0">
                        {teacher.photo ? (
                          <img
                            src={teacher.photo}
                            alt={teacher.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300 bg-gradient-to-br from-violet-100 to-violet-200">
                            <User className="w-5 h-5 text-violet-400" />
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-[13px] text-slate-800">{teacher.name}</span>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-violet-50 text-violet-700 border border-violet-200">
                        {teacher.specialty}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-xl bg-slate-100 text-slate-600 text-[11px] font-black border border-slate-200">
                        {teacher.order}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          asChild
                          variant="ghost"
                          size="icon"
                          className="w-8 h-8 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-xl"
                        >
                          <Link href={`/admin/teachers/edit/${buildTeacherSlug(teacher.name, teacher.id)}`}>
                            <Edit className="w-3.5 h-3.5" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-8 h-8 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl"
                          onClick={() => setDeleteId(teacher.id)}
                        >
                          <Trash className="w-3.5 h-3.5" />
                        </Button>
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
          {filteredTeachers.length === 0 ? (
            <div className="py-20 flex flex-col items-center gap-4 text-center px-6">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-300">
                <Users className="w-7 h-7" />
              </div>
              <div>
                <p className="font-bold text-slate-700">
                  {searchQuery ? "Δεν βρέθηκαν αποτελέσματα" : "Δεν βρέθηκαν καθηγητές"}
                </p>
                {!searchQuery && (
                  <Button asChild size="sm" className="bg-violet-600 hover:bg-violet-500 h-8 font-bold rounded-xl mt-3">
                    <Link href="/admin/teachers/new">
                      <Plus className="w-3.5 h-3.5 mr-1" /> Προσθήκη
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          ) : (
            filteredTeachers.map((teacher) => (
              <div key={teacher.id} className="flex items-center gap-4 p-4 hover:bg-slate-50/50 transition-colors">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 border-2 border-slate-200 shrink-0">
                  {teacher.photo ? (
                    <img src={teacher.photo} alt={teacher.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-violet-100 to-violet-200">
                      <User className="w-5 h-5 text-violet-400" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[14px] text-slate-800 truncate">{teacher.name}</p>
                  <span className="inline-flex items-center mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-violet-50 text-violet-700 border border-violet-200">
                    {teacher.specialty}
                  </span>
                </div>

                {/* Order badge */}
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-xl bg-slate-100 text-slate-600 text-[11px] font-black border border-slate-200 shrink-0">
                  {teacher.order}
                </span>

                {/* Actions */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="w-8 h-8 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl shrink-0">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-44 rounded-xl">
                    <DropdownMenuItem asChild className="gap-2 text-[13px] rounded-lg cursor-pointer">
                      <Link href={`/admin/teachers/edit/${buildTeacherSlug(teacher.name, teacher.id)}`}>
                        <Edit className="w-3.5 h-3.5" /> Επεξεργασία
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="gap-2 text-[13px] text-red-600 focus:text-red-600 focus:bg-red-50 rounded-lg cursor-pointer"
                      onClick={() => setDeleteId(teacher.id)}
                    >
                      <Trash className="w-3.5 h-3.5" /> Διαγραφή
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))
          )}
        </div>

        {filteredTeachers.length > 0 && (
          <div className="px-5 py-3 border-t border-slate-50 bg-slate-50/30 text-[12px] text-slate-400">
            Σύνολο: {filteredTeachers.length} καθηγητές
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
            <DialogTitle>Διαγραφή Καθηγητή</DialogTitle>
            <DialogDescription>
              Είστε σίγουροι ότι θέλετε να διαγράψετε τον καθηγητή{" "}
              <strong className="text-slate-900">{deletingTeacherName}</strong>; Η ενέργεια αυτή δεν
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
