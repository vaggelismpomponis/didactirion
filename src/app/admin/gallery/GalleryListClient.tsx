"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  MoreHorizontal,
  Edit,
  Trash,
  Image as ImageIcon,
  CheckCircle2,
  XCircle,
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

type Banner = {
  id: string;
  title: string | null;
  image: string;
  link: string | null;
  active: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
};

type Popup = {
  id: string;
  title: string;
  content: string | null;
  image: string | null;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
};

interface GalleryListClientProps {
  initialBanners: Banner[];
  initialPopups: Popup[];
}

export function GalleryListClient({ initialBanners, initialPopups }: GalleryListClientProps) {
  const router = useRouter();
  
  // Deletion States
  const [deleteBannerId, setDeleteBannerId] = useState<string | null>(null);
  const [deletePopupId, setDeletePopupId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteBanner = async () => {
    if (!deleteBannerId) return;
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/admin/banners/${deleteBannerId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete banner");
      
      setDeleteBannerId(null);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Σφάλμα κατά τη διαγραφή του banner.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeletePopup = async () => {
    if (!deletePopupId) return;
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/admin/popups/${deletePopupId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete popup");

      setDeletePopupId(null);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Σφάλμα κατά τη διαγραφή του popup.");
    } finally {
      setIsDeleting(false);
    }
  };

  const deletingBannerTitle = initialBanners.find((b) => b.id === deleteBannerId)?.title || "Banner";
  const deletingPopupTitle = initialPopups.find((p) => p.id === deletePopupId)?.title;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-xl font-heading font-black text-slate-900">Gallery & Banners</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Διαχείριση Hero Banners και Popups ανακοινώσεων.
        </p>
      </div>

      <Tabs defaultValue="banners" className="w-full">
        <TabsList className="bg-white border border-slate-200 h-9 p-1 rounded-xl mb-5">
          <TabsTrigger
            value="banners"
            className="text-xs font-heading font-semibold rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm px-4 cursor-pointer"
          >
            <ImageIcon className="w-3.5 h-3.5 mr-1.5" /> Banners ({initialBanners.length})
          </TabsTrigger>
          <TabsTrigger
            value="popups"
            className="text-xs font-heading font-semibold rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm px-4 cursor-pointer"
          >
            Popups ({initialPopups.length})
          </TabsTrigger>
        </TabsList>

        {/* Banners Tab */}
        <TabsContent value="banners" className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-slate-500">
              Hero Banners ·{" "}
              <span className="text-emerald-600 font-medium">{initialBanners.filter(b => b.active).length} ενεργά</span>
            </p>
            <Button asChild size="sm" className="bg-primary hover:bg-primary/90 font-heading font-bold h-8 shadow-md shadow-primary/20">
              <Link href="/admin/gallery/banners/new">
                <Plus className="w-3.5 h-3.5 mr-1.5" /> Νέο Banner
              </Link>
            </Button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-b border-slate-100">
                    <TableHead className="w-24 font-heading font-semibold text-slate-600 text-xs uppercase tracking-wider">Εικόνα</TableHead>
                    <TableHead className="font-heading font-semibold text-slate-600 text-xs uppercase tracking-wider">Τίτλος</TableHead>
                    <TableHead className="font-heading font-semibold text-slate-600 text-xs uppercase tracking-wider">Κατάσταση</TableHead>
                    <TableHead className="font-heading font-semibold text-slate-600 text-xs uppercase tracking-wider w-16">Σειρά</TableHead>
                    <TableHead className="w-14" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {initialBanners.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="py-16 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-300">
                            <ImageIcon className="w-6 h-6" />
                          </div>
                          <p className="text-sm font-medium text-slate-500">Δεν υπάρχουν banners</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    initialBanners.map((banner) => (
                      <TableRow key={banner.id} className="hover:bg-slate-50/50 transition-colors border-b border-slate-50">
                        <TableCell>
                          <div className="w-20 h-12 rounded-xl bg-slate-100 overflow-hidden border border-slate-200">
                            <img
                              src={banner.image}
                              alt={banner.title || "Banner"}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-semibold text-sm text-slate-900">{banner.title || "—"}</span>
                        </TableCell>
                        <TableCell>
                          {banner.active ? (
                            <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium text-xs gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Ενεργό
                            </Badge>
                          ) : (
                            <Badge className="bg-slate-100 text-slate-500 border border-slate-200 font-medium text-xs gap-1">
                              <XCircle className="w-3 h-3" /> Ανενεργό
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold">
                            {banner.order}
                          </span>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="w-8 h-8 text-slate-400 hover:text-slate-700 hover:bg-slate-100">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                              <DropdownMenuItem asChild className="gap-2 text-sm cursor-pointer">
                                <Link href={`/admin/gallery/banners/edit/${banner.id}`}>
                                  <Edit className="w-3.5 h-3.5" /> Επεξεργασία
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="gap-2 text-sm text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                                onClick={() => setDeleteBannerId(banner.id)}
                              >
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
          </div>
        </TabsContent>

        {/* Popups Tab */}
        <TabsContent value="popups" className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-slate-500">
              Αναδυόμενα παράθυρα ·{" "}
              <span className="text-blue-600 font-medium">{initialPopups.filter(p => p.active).length} ενεργά</span>
            </p>
            <Button asChild size="sm" className="bg-primary hover:bg-primary/90 font-heading font-bold h-8 shadow-md shadow-primary/20">
              <Link href="/admin/gallery/popups/new">
                <Plus className="w-3.5 h-3.5 mr-1.5" /> Νέο Popup
              </Link>
            </Button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-b border-slate-100">
                    <TableHead className="font-heading font-semibold text-slate-600 text-xs uppercase tracking-wider">Τίτλος</TableHead>
                    <TableHead className="font-heading font-semibold text-slate-600 text-xs uppercase tracking-wider">Κατάσταση</TableHead>
                    <TableHead className="font-heading font-semibold text-slate-600 text-xs uppercase tracking-wider">Δημιουργία</TableHead>
                    <TableHead className="w-14" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {initialPopups.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="py-16 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-300">
                            <ImageIcon className="w-6 h-6" />
                          </div>
                          <p className="text-sm font-medium text-slate-500">Δεν υπάρχουν popups</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    initialPopups.map((popup) => (
                      <TableRow key={popup.id} className="hover:bg-slate-50/50 transition-colors border-b border-slate-50">
                        <TableCell>
                          <span className="font-semibold text-sm text-slate-900">{popup.title}</span>
                        </TableCell>
                        <TableCell>
                          {popup.active ? (
                            <Badge className="bg-blue-50 text-blue-700 border border-blue-200 font-medium text-xs gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Live
                            </Badge>
                          ) : (
                            <Badge className="bg-slate-100 text-slate-500 border border-slate-200 font-medium text-xs gap-1">
                              <XCircle className="w-3 h-3" /> Ανενεργό
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-slate-500 text-xs">
                          {new Date(popup.createdAt).toLocaleDateString("el-GR")}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="w-8 h-8 text-slate-400 hover:text-slate-700 hover:bg-slate-100">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                              <DropdownMenuItem asChild className="gap-2 text-sm cursor-pointer">
                                <Link href={`/admin/gallery/popups/edit/${popup.id}`}>
                                  <Edit className="w-3.5 h-3.5" /> Επεξεργασία
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="gap-2 text-sm text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                                onClick={() => setDeletePopupId(popup.id)}
                              >
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
            <p className="px-5 py-3 text-xs text-slate-400 border-t border-slate-50 bg-slate-50/30">
              * Μόνο ένα Popup μπορεί να είναι ενεργό κάθε φορά στην αρχική σελίδα.
            </p>
          </div>
        </TabsContent>
      </Tabs>

      {/* Delete Banner Confirmation Modal */}
      <Dialog
        open={!!deleteBannerId}
        onOpenChange={(open) => !open && setDeleteBannerId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Διαγραφή Banner</DialogTitle>
            <DialogDescription>
              Είστε σίγουροι ότι θέλετε να διαγράψετε το banner <strong className="text-slate-900">{deletingBannerTitle}</strong>; Η ενέργεια αυτή δεν μπορεί να αναιρεθεί.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteBannerId(null)}
              disabled={isDeleting}
            >
              Ακύρωση
            </Button>
            <Button
              variant="destructive"
              className="text-white hover:bg-red-700 bg-red-600 transition-colors"
              onClick={handleDeleteBanner}
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

      {/* Delete Popup Confirmation Modal */}
      <Dialog
        open={!!deletePopupId}
        onOpenChange={(open) => !open && setDeletePopupId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Διαγραφή Popup</DialogTitle>
            <DialogDescription>
              Είστε σίγουροι ότι θέλετε να διαγράψετε το popup <strong className="text-slate-900">{deletingPopupTitle}</strong>; Η ενέργεια αυτή δεν μπορεί να αναιρεθεί.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 gap-2">
            <Button
              variant="outline"
              onClick={() => setDeletePopupId(null)}
              disabled={isDeleting}
            >
              Ακύρωση
            </Button>
            <Button
              variant="destructive"
              className="text-white hover:bg-red-700 bg-red-600 transition-colors"
              onClick={handleDeletePopup}
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
