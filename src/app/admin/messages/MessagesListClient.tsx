"use client";

import { useState } from "react";
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
  Mail,
  Trash,
  CheckCircle2,
  Clock,
  MessageSquare,
  Eye,
  MoreHorizontal,
  InboxIcon,
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
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
import { deleteMessage, toggleMessageReadStatus } from "./actions";
import { useEffect } from "react";

type ContactMessage = {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  isRead: boolean;
  createdAt: Date;
};

export default function MessagesListClient({
  messages,
}: {
  messages: ContactMessage[];
}) {
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toggleStatusMessage, setToggleStatusMessage] = useState<{
    id: string;
    isRead: boolean;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 1023px)");
    setIsMobile(media.matches);
    const listener = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, []);

  const unreadCount = messages.filter((m) => !m.isRead).length;

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsLoading(true);
    await deleteMessage(deleteId);
    setIsLoading(false);
    setDeleteId(null);
    if (selectedMessage?.id === deleteId) setSelectedMessage(null);
  };

  const handleToggleStatus = async () => {
    if (!toggleStatusMessage) return;
    setIsLoading(true);
    await toggleMessageReadStatus(toggleStatusMessage.id, !toggleStatusMessage.isRead);
    setIsLoading(false);
    setToggleStatusMessage(null);
  };

  const handleReply = (email: string, subject: string | null) => {
    const mailtoUrl = `mailto:${email}?subject=Re: ${encodeURIComponent(subject || "")}`;
    window.location.href = mailtoUrl;
  };

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-1 h-10 bg-gradient-to-b from-amber-500 to-amber-600 rounded-full shrink-0 mt-0.5" />
          <div>
            <h1 className="text-xl font-heading font-black text-slate-900">
              Μηνύματα Επικοινωνίας
            </h1>
            <p className="text-[13px] text-slate-500 mt-0.5">
              {messages.length} σύνολο
              {unreadCount > 0 && (
                <span className="ml-2 inline-flex items-center gap-1 text-amber-600 font-semibold">
                  ·
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block animate-pulse" />
                  {unreadCount} αδιάβαστα
                </span>
              )}
            </p>
          </div>
        </div>
        {unreadCount > 0 && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-[12px] font-bold">
            <InboxIcon className="w-3.5 h-3.5" />
            {unreadCount} αδιάβαστα μηνύματα
          </span>
        )}
      </div>

      {/* Content: master-detail on large screens */}
      <div className="flex gap-5">
        {/* Message List */}
        <div className={`bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col transition-all duration-300 ${selectedMessage ? "flex-[2] min-w-0" : "flex-1"}`}>
          {/* Toolbar */}
          <div className="px-5 py-3 border-b border-slate-50 bg-slate-50/40 flex items-center gap-3 shrink-0">
            <span className="text-[12px] font-semibold text-slate-500">
              {messages.length} μηνύματα
            </span>
            {unreadCount > 0 && (
              <span className="ml-auto inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                {unreadCount} νέα
              </span>
            )}
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto flex-1">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/60 hover:bg-slate-50/60 border-b border-slate-100">
                  <TableHead className="font-heading font-bold text-slate-500 text-[11px] uppercase tracking-wider pl-5">
                    Αποστολέας
                  </TableHead>
                  <TableHead className="font-heading font-bold text-slate-500 text-[11px] uppercase tracking-wider w-[36%]">
                    Θέμα
                  </TableHead>
                  <TableHead className="font-heading font-bold text-slate-500 text-[11px] uppercase tracking-wider">
                    Ημερομηνία
                  </TableHead>
                  <TableHead className="font-heading font-bold text-slate-500 text-[11px] uppercase tracking-wider">
                    Κατάσταση
                  </TableHead>
                  <TableHead className="w-14" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {messages.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-24 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-300">
                          <MessageSquare className="w-8 h-8" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-700">Δεν υπάρχουν μηνύματα</p>
                          <p className="text-sm text-slate-400 mt-1">
                            Τα μηνύματα επικοινωνίας θα εμφανίζονται εδώ
                          </p>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  messages.map((message) => (
                    <TableRow
                      key={message.id}
                      onClick={() => setSelectedMessage(message)}
                      className={`cursor-pointer transition-colors duration-150 border-b border-slate-50 group ${selectedMessage?.id === message.id
                        ? "bg-amber-50/50 border-l-2 border-l-amber-400"
                        : !message.isRead
                          ? "bg-blue-50/30 hover:bg-blue-50/60"
                          : "hover:bg-slate-50/60"
                        }`}
                    >
                      <TableCell className="pl-5">
                        <div className="flex items-center gap-3">
                          {!message.isRead && (
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                          )}
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-slate-600 font-black text-xs shrink-0 uppercase">
                            {message.name?.[0] ?? "?"}
                          </div>
                          <div>
                            <p className={`text-[13px] leading-none ${!message.isRead ? "font-bold text-slate-900" : "font-semibold text-slate-800"}`}>
                              {message.name}
                            </p>
                            <p className="text-[11px] text-slate-400 mt-0.5">{message.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className={`text-[13px] truncate max-w-xs ${!message.isRead ? "font-semibold text-slate-800" : "text-slate-600"}`}>
                          {message.subject}
                        </p>
                      </TableCell>
                      <TableCell className="text-slate-500 text-[12px] whitespace-nowrap">
                        {new Date(message.createdAt).toLocaleDateString("el-GR", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </TableCell>
                      <TableCell>
                        {message.isRead ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" /> Αναγνώστηκε
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                            <Clock className="w-3 h-3" /> Νέο
                          </span>
                        )}
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="w-8 h-8 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 rounded-xl">
                            <DropdownMenuGroup>
                              <DropdownMenuLabel className="text-[11px] text-slate-500">Ενέργειες</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="gap-2 text-[13px] rounded-lg" onClick={() => setSelectedMessage(message)}>
                                <Eye className="w-3.5 h-3.5" /> Προβολή Μηνύματος
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="gap-2 text-[13px] rounded-lg cursor-pointer"
                                onClick={() => handleReply(message.email, message.subject)}
                              >
                                <Mail className="w-3.5 h-3.5" /> Απάντηση
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="gap-2 text-[13px] rounded-lg"
                                onClick={() => setToggleStatusMessage({ id: message.id, isRead: message.isRead })}
                              >
                                {message.isRead ? (
                                  <><Clock className="w-3.5 h-3.5" /> Σήμανση ως Νέο</>
                                ) : (
                                  <><CheckCircle2 className="w-3.5 h-3.5" /> Σήμανση ως Αναγνωσμένο</>
                                )}
                              </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="gap-2 text-[13px] text-red-600 focus:text-red-600 focus:bg-red-50 rounded-lg"
                              onClick={() => setDeleteId(message.id)}
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

          {/* Mobile Cards */}
          <div className="md:hidden flex flex-col divide-y divide-slate-100">
            {messages.length === 0 ? (
              <div className="py-20 flex flex-col items-center gap-4 text-center px-6">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-300">
                  <MessageSquare className="w-7 h-7" />
                </div>
                <p className="font-bold text-slate-700">Δεν υπάρχουν μηνύματα</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`p-4 cursor-pointer transition-colors ${!message.isRead ? "bg-blue-50/30" : ""}`}
                  onClick={() => setSelectedMessage(message)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {!message.isRead && (
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 mt-2" />
                      )}
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-slate-600 font-black text-sm shrink-0 uppercase">
                        {message.name?.[0] ?? "?"}
                      </div>
                      <div>
                        <p className={`text-[14px] leading-tight ${!message.isRead ? "font-bold text-slate-900" : "font-semibold text-slate-700"}`}>
                          {message.name}
                        </p>
                        <p className="text-[11px] text-slate-400">{message.email}</p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="w-8 h-8 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl shrink-0 -mr-2">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 rounded-xl">
                        <DropdownMenuItem className="gap-2 text-[13px] rounded-lg" onClick={() => setSelectedMessage(message)}>
                          <Eye className="w-3.5 h-3.5" /> Προβολή
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="gap-2 text-[13px] rounded-lg cursor-pointer"
                          onClick={() => handleReply(message.email, message.subject)}
                        >
                          <Mail className="w-3.5 h-3.5" /> Απάντηση
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="gap-2 text-[13px] text-red-600 focus:text-red-600 focus:bg-red-50 rounded-lg"
                          onClick={() => setDeleteId(message.id)}
                        >
                          <Trash className="w-3.5 h-3.5" /> Διαγραφή
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <p className="text-[12px] text-slate-600 font-medium mt-2 ml-9 line-clamp-1">
                    {message.subject}
                  </p>
                  <div className="flex items-center justify-between mt-1 ml-9">
                    <span className="text-slate-400 text-[11px]">
                      {new Date(message.createdAt).toLocaleDateString("el-GR")}
                    </span>
                    {message.isRead ? (
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-emerald-600">
                        <CheckCircle2 className="w-3 h-3" /> Αναγνώστηκε
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-blue-700">
                        <Clock className="w-3 h-3" /> Νέο
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {messages.length > 0 && (
            <div className="px-5 py-3 border-t border-slate-50 bg-slate-50/30 text-[12px] text-slate-400 shrink-0">
              Σύνολο: {messages.length} · {unreadCount} αδιάβαστα
            </div>
          )}
        </div>

        {/* ── Detail Panel ── */}
        {selectedMessage && (
          <div className="hidden lg:flex flex-col flex-[1.4] bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden min-w-0">
            {/* Panel header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-50 bg-slate-50/40 shrink-0">
              <h3 className="font-bold text-[14px] text-slate-800">Προβολή Μηνύματος</h3>
              <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl"
                onClick={() => setSelectedMessage(null)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Sender */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-slate-600 font-black text-lg shrink-0 uppercase">
                  {selectedMessage.name?.[0] ?? "?"}
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-[15px]">{selectedMessage.name}</p>
                  <a
                    href={`mailto:${selectedMessage.email}`}
                    className="text-[13px] text-blue-600 hover:underline"
                  >
                    {selectedMessage.email}
                  </a>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {new Date(selectedMessage.createdAt).toLocaleString("el-GR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center gap-2">
                {selectedMessage.isRead ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Αναγνώστηκε
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                    <Clock className="w-3.5 h-3.5" /> Νέο Μήνυμα
                  </span>
                )}
              </div>

              {/* Subject */}
              {selectedMessage.subject && (
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Θέμα</p>
                  <p className="text-[14px] font-semibold text-slate-800">{selectedMessage.subject}</p>
                </div>
              )}

              {/* Message body */}
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Μήνυμα</p>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-[13px] text-slate-700 whitespace-pre-wrap leading-relaxed min-h-[120px]">
                  {selectedMessage.message}
                </div>
              </div>
            </div>

            {/* Panel footer actions */}
            <div className="px-6 py-4 border-t border-slate-50 bg-slate-50/30 flex items-center gap-2 shrink-0">
              <Button
                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white h-9 font-bold rounded-xl text-[13px] cursor-pointer"
                onClick={() => handleReply(selectedMessage.email, selectedMessage.subject)}
              >
                <Mail className="w-3.5 h-3.5 mr-2" /> Απάντηση
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="w-9 h-9 text-amber-600 border-amber-200 hover:bg-amber-50 rounded-xl"
                onClick={() => setToggleStatusMessage({ id: selectedMessage.id, isRead: selectedMessage.isRead })}
              >
                {selectedMessage.isRead ? <Clock className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="w-9 h-9 text-red-600 border-red-200 hover:bg-red-50 rounded-xl"
                onClick={() => setDeleteId(selectedMessage.id)}
              >
                <Trash className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* View Message Modal (mobile) */}
      <Dialog
        open={!!selectedMessage && isMobile}
        onOpenChange={(open) => !open && setSelectedMessage(null)}
      >
        <DialogContent className="max-w-md rounded-2xl lg:hidden">
          <DialogHeader>
            <DialogTitle>Προβολή Μηνύματος</DialogTitle>
            <DialogDescription>
              Από {selectedMessage?.name}
            </DialogDescription>
          </DialogHeader>
          {selectedMessage && (
            <>
              <div className="space-y-4 py-2">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Αποστολέας</p>
                  <p className="text-[13px] text-slate-900 font-semibold">{selectedMessage.name}</p>
                  <p className="text-[12px] text-slate-500">{selectedMessage.email}</p>
                </div>
                {selectedMessage.subject && (
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Θέμα</p>
                    <p className="text-[13px] text-slate-900">{selectedMessage.subject}</p>
                  </div>
                )}
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Μήνυμα</p>
                  <div className="bg-slate-50 rounded-xl p-3 text-[13px] text-slate-700 whitespace-pre-wrap border border-slate-100 min-h-[100px]">
                    {selectedMessage.message}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setSelectedMessage(null)} className="rounded-xl">
                  Κλείσιμο
                </Button>
                <Button
                  className="bg-blue-600 hover:bg-blue-500 rounded-xl cursor-pointer"
                  onClick={() => handleReply(selectedMessage.email, selectedMessage.subject)}
                >
                  <Mail className="w-4 h-4 mr-2" /> Απάντηση
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>Διαγραφή Μηνύματος</DialogTitle>
            <DialogDescription>
              Είστε σίγουροι; Η ενέργεια δεν μπορεί να αναιρεθεί.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 gap-2">
            <Button variant="outline" onClick={() => setDeleteId(null)} disabled={isLoading} className="rounded-xl">
              Ακύρωση
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white rounded-xl"
              onClick={handleDelete}
              disabled={isLoading}
            >
              {isLoading ? "Διαγραφή..." : "Διαγραφή"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Toggle Status Confirmation */}
      <Dialog open={!!toggleStatusMessage} onOpenChange={(open) => !open && setToggleStatusMessage(null)}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>Αλλαγή Κατάστασης</DialogTitle>
            <DialogDescription>
              Θέλετε να επισημάνετε το μήνυμα ως{" "}
              {toggleStatusMessage?.isRead ? "μη αναγνωσμένο" : "αναγνωσμένο"};
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 gap-2">
            <Button variant="outline" onClick={() => setToggleStatusMessage(null)} disabled={isLoading} className="rounded-xl">
              Ακύρωση
            </Button>
            <Button onClick={handleToggleStatus} disabled={isLoading} className="rounded-xl">
              {isLoading ? "Ενημέρωση..." : "Επιβεβαίωση"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
