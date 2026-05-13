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
  User,
  Search,
  Users,
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
import Link from "next/link";

async function getTeachers() {
  return await prisma.teacher.findMany({ orderBy: { order: "asc" } });
}

export default async function AdminTeachersPage() {
  const teachers = await getTeachers();

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-heading font-black text-slate-900">Καθηγητές</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Διδακτικό προσωπικό · {teachers.length} καθηγητές
          </p>
        </div>
        <Button asChild className="bg-primary hover:bg-primary/90 font-heading font-bold shadow-md shadow-primary/20 h-9">
          <Link href="/admin/teachers/new">
            <Plus className="w-4 h-4 mr-1.5" /> Προσθήκη Καθηγητή
          </Link>
        </Button>
      </div>

      {/* Table card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-50 flex items-center gap-3 bg-slate-50/50">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <Input
              placeholder="Αναζήτηση καθηγητών..."
              className="pl-9 h-8 text-sm rounded-lg border-slate-200 bg-white focus:border-primary"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-b border-slate-100">
                <TableHead className="font-heading font-semibold text-slate-600 text-xs uppercase tracking-wider w-16">Φωτό</TableHead>
                <TableHead className="font-heading font-semibold text-slate-600 text-xs uppercase tracking-wider">Ονοματεπώνυμο</TableHead>
                <TableHead className="font-heading font-semibold text-slate-600 text-xs uppercase tracking-wider">Ειδικότητα</TableHead>
                <TableHead className="font-heading font-semibold text-slate-600 text-xs uppercase tracking-wider w-24">Σειρά</TableHead>
                <TableHead className="w-14" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {teachers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-300">
                        <Users className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-medium text-slate-500">Δεν βρέθηκαν καθηγητές</p>
                      <Button asChild size="sm" className="bg-primary h-8 font-bold text-xs">
                        <Link href="/admin/teachers/new"><Plus className="w-3.5 h-3.5 mr-1" /> Προσθέστε τον πρώτο</Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                teachers.map((teacher) => (
                  <TableRow key={teacher.id} className="hover:bg-slate-50/50 transition-colors border-b border-slate-50">
                    <TableCell>
                      <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden border-2 border-slate-200 shrink-0">
                        {teacher.photo ? (
                          <img src={teacher.photo} alt={teacher.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300">
                            <User className="w-5 h-5" />
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-sm text-slate-900">{teacher.name}</span>
                    </TableCell>
                    <TableCell className="text-sm text-slate-500">{teacher.specialty}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold">
                        {teacher.order}
                      </span>
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
                            <Link href={`/admin/teachers/edit/${teacher.id}`}>
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

        {teachers.length > 0 && (
          <div className="px-4 py-3 border-t border-slate-50 bg-slate-50/30 text-xs text-slate-400">
            Σύνολο: {teachers.length} καθηγητές
          </div>
        )}
      </div>
    </div>
  );
}
