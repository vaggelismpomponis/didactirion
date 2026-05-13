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
  Search,
  MoreHorizontal,
  Edit,
  Trash,
  Eye,
  FileText,
  CheckCircle2,
  Clock,
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
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

async function getPosts() {
  return await prisma.post.findMany({ orderBy: { createdAt: "desc" } });
}

export default async function PostsPage() {
  const posts = await getPosts();

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-heading font-black text-slate-900">Ανακοινώσεις</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Διαχείριση άρθρων και ανακοινώσεων · {posts.length} σύνολο
          </p>
        </div>
        <Button asChild className="bg-primary hover:bg-primary/90 font-heading font-bold shadow-md shadow-primary/20 h-9">
          <Link href="/admin/posts/new">
            <Plus className="w-4 h-4 mr-1.5" /> Νέα Ανακοίνωση
          </Link>
        </Button>
      </div>

      {/* Table card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="px-4 py-3 border-b border-slate-50 flex items-center gap-3 bg-slate-50/50">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <Input
              placeholder="Αναζήτηση ανακοινώσεων..."
              className="pl-9 h-8 text-sm rounded-lg border-slate-200 bg-white focus:border-primary"
            />
          </div>
          <div className="flex items-center gap-2 ml-auto text-xs text-slate-400">
            <span className="hidden sm:inline">{posts.filter((p) => p.published).length} δημοσιευμένα</span>
            <span className="hidden sm:inline">·</span>
            <span className="hidden sm:inline">{posts.filter((p) => !p.published).length} πρόχειρα</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-b border-slate-100">
                <TableHead className="w-[42%] font-heading font-semibold text-slate-600 text-xs uppercase tracking-wider">Τίτλος</TableHead>
                <TableHead className="font-heading font-semibold text-slate-600 text-xs uppercase tracking-wider">Κατηγορία</TableHead>
                <TableHead className="font-heading font-semibold text-slate-600 text-xs uppercase tracking-wider">Κατάσταση</TableHead>
                <TableHead className="font-heading font-semibold text-slate-600 text-xs uppercase tracking-wider">Ημερομηνία</TableHead>
                <TableHead className="w-[56px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-300">
                        <FileText className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-medium text-slate-500">Δεν βρέθηκαν ανακοινώσεις</p>
                      <Button asChild size="sm" className="bg-primary h-8 font-bold text-xs">
                        <Link href="/admin/posts/new"><Plus className="w-3.5 h-3.5 mr-1" /> Δημιουργήστε την πρώτη</Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                posts.map((post) => (
                  <TableRow key={post.id} className="hover:bg-slate-50/50 transition-colors border-b border-slate-50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {post.image && (
                          <div className="w-9 h-9 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-100">
                            <img src={post.image} alt="" className="w-full h-full object-cover" />
                          </div>
                        )}
                        <span className="font-semibold text-sm text-slate-900 line-clamp-1">{post.title}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize text-xs bg-slate-50 border-slate-200 text-slate-600 font-medium">
                        {post.category || "Ανακοίνωση"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {post.published ? (
                        <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium text-xs gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Δημοσιευμένο
                        </Badge>
                      ) : (
                        <Badge className="bg-slate-100 text-slate-500 border border-slate-200 font-medium text-xs gap-1">
                          <Clock className="w-3 h-3" /> Πρόχειρο
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-slate-500 text-xs">
                      {new Date(post.createdAt).toLocaleDateString("el-GR")}
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
                            <Link href={`/announcements/${post.slug}`} target="_blank">
                              <Eye className="w-3.5 h-3.5" /> Προβολή
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild className="gap-2 text-sm">
                            <Link href={`/admin/posts/edit/${post.id}`}>
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

        {posts.length > 0 && (
          <div className="px-4 py-3 border-t border-slate-50 bg-slate-50/30 text-xs text-slate-400">
            Σύνολο: {posts.length} ανακοινώσεις
          </div>
        )}
      </div>
    </div>
  );
}
