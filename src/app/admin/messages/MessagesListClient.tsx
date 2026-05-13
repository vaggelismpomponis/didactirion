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
import { Badge } from "@/components/ui/badge";
import {
  MoreHorizontal,
  Mail,
  Trash,
  CheckCircle2,
  Clock,
  MessageSquare,
  Eye,
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
  const [viewMessage, setViewMessage] = useState<ContactMessage | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toggleStatusMessage, setToggleStatusMessage] = useState<{
    id: string;
    isRead: boolean;
  } | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const unreadCount = messages.filter((m) => !m.isRead).length;

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsLoading(true);
    await deleteMessage(deleteId);
    setIsLoading(false);
    setDeleteId(null);
  };

  const handleToggleStatus = async () => {
    if (!toggleStatusMessage) return;
    setIsLoading(true);
    await toggleMessageReadStatus(
      toggleStatusMessage.id,
      !toggleStatusMessage.isRead
    );
    setIsLoading(false);
    setToggleStatusMessage(null);
  };

  const renderDropdownMenu = (message: ContactMessage) => (
    <DropdownMenuContent align="end" className="w-48">
      <DropdownMenuGroup>
        <DropdownMenuLabel className="text-xs text-slate-500">
          Ενέργειες
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="gap-2 text-sm"
          onClick={() => setViewMessage(message)}
        >
          <Eye className="w-3.5 h-3.5" /> Προβολή Μηνύματος
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2 text-sm" asChild>
          <a href={`mailto:${message.email}?subject=Re: ${message.subject || ""}`}>
            <Mail className="w-3.5 h-3.5" /> Απάντηση
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="gap-2 text-sm"
          onClick={() =>
            setToggleStatusMessage({ id: message.id, isRead: message.isRead })
          }
        >
          {message.isRead ? (
            <>
              <Clock className="w-3.5 h-3.5" /> Σήμανση ως Μη Αναγνωσμένο
            </>
          ) : (
            <>
              <CheckCircle2 className="w-3.5 h-3.5" /> Σήμανση ως Αναγνωσμένο
            </>
          )}
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        className="gap-2 text-sm text-red-600 focus:text-red-600 focus:bg-red-50"
        onClick={() => setDeleteId(message.id)}
      >
        <Trash className="w-3.5 h-3.5" /> Διαγραφή
      </DropdownMenuItem>
    </DropdownMenuContent>
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-heading font-black text-slate-900">
            Μηνύματα Επικοινωνίας
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {messages.length} σύνολο
            {unreadCount > 0 && (
              <span className="ml-2 inline-flex items-center gap-1 text-amber-600 font-semibold">
                ·{" "}
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />{" "}
                {unreadCount} αδιάβαστα
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Table card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="hidden md:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-b border-slate-100">
                <TableHead className="font-heading font-semibold text-slate-600 text-xs uppercase tracking-wider">
                  Αποστολέας
                </TableHead>
                <TableHead className="font-heading font-semibold text-slate-600 text-xs uppercase tracking-wider w-[36%]">
                  Θέμα
                </TableHead>
                <TableHead className="font-heading font-semibold text-slate-600 text-xs uppercase tracking-wider">
                  Ημερομηνία
                </TableHead>
                <TableHead className="font-heading font-semibold text-slate-600 text-xs uppercase tracking-wider">
                  Κατάσταση
                </TableHead>
                <TableHead className="w-14" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {messages.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-300">
                        <MessageSquare className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-medium text-slate-500">
                        Δεν υπάρχουν μηνύματα
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                messages.map((message) => (
                  <TableRow
                    key={message.id}
                    className={`hover:bg-slate-50/50 transition-colors border-b border-slate-50 ${
                      !message.isRead ? "bg-blue-50/30" : ""
                    }`}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-slate-600 font-black text-xs shrink-0 uppercase">
                          {message.name?.[0] ?? "?"}
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-slate-900 leading-none">
                            {message.name}
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {message.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-slate-700 truncate max-w-xs font-medium">
                        {message.subject}
                      </p>
                    </TableCell>
                    <TableCell className="text-slate-500 text-xs whitespace-nowrap">
                      {new Date(message.createdAt).toLocaleDateString("el-GR", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell>
                      {message.isRead ? (
                        <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium text-xs gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Αναγνώστηκε
                        </Badge>
                      ) : (
                        <Badge className="bg-blue-50 text-blue-700 border border-blue-200 font-medium text-xs gap-1">
                          <Clock className="w-3 h-3" /> Νέο
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-8 h-8 text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        {renderDropdownMenu(message)}
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden flex flex-col divide-y divide-slate-100">
          {messages.length === 0 ? (
            <div className="py-20 text-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-300">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <p className="text-sm font-medium text-slate-500">
                  Δεν υπάρχουν μηνύματα
                </p>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`p-4 flex flex-col gap-3 ${
                  !message.isRead ? "bg-blue-50/30" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-slate-600 font-black text-sm shrink-0 uppercase">
                      {message.name?.[0] ?? "?"}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-slate-900">
                        {message.name}
                      </p>
                      <p className="text-xs text-slate-400">{message.email}</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-8 h-8 text-slate-400 hover:text-slate-700 hover:bg-slate-100 shrink-0 -mr-2"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    {renderDropdownMenu(message)}
                  </DropdownMenu>
                </div>
                <div>
                  <p className="text-sm text-slate-700 font-medium mb-2">
                    {message.subject}
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-slate-500 text-xs">
                      {new Date(message.createdAt).toLocaleDateString("el-GR", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    {message.isRead ? (
                      <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium text-xs gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Αναγνώστηκε
                      </Badge>
                    ) : (
                      <Badge className="bg-blue-50 text-blue-700 border border-blue-200 font-medium text-xs gap-1">
                        <Clock className="w-3 h-3" /> Νέο
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {messages.length > 0 && (
          <div className="px-4 py-3 border-t border-slate-50 bg-slate-50/30 text-xs text-slate-400">
            Σύνολο: {messages.length} μηνύματα · {unreadCount} αδιάβαστα
          </div>
        )}
      </div>

      {/* View Message Modal */}
      <Dialog
        open={!!viewMessage}
        onOpenChange={(open) => !open && setViewMessage(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Προβολή Μηνύματος</DialogTitle>
            <DialogDescription>
              Στοιχεία επικοινωνίας και μήνυμα από {viewMessage?.name}
            </DialogDescription>
          </DialogHeader>
          {viewMessage && (
            <>
              <div className="space-y-4 py-4">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Αποστολέας
                  </p>
                  <p className="text-sm text-slate-900 font-medium">
                    {viewMessage.name}
                  </p>
                  <p className="text-sm text-slate-500">{viewMessage.email}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Θέμα
                  </p>
                  <p className="text-sm text-slate-900">{viewMessage.subject}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Μήνυμα
                  </p>
                  <div className="p-3 bg-slate-50 rounded-lg text-sm text-slate-700 whitespace-pre-wrap border border-slate-100 min-h-[100px]">
                    {viewMessage.message}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Ημερομηνία
                  </p>
                  <p className="text-sm text-slate-900">
                    {new Date(viewMessage.createdAt).toLocaleString("el-GR", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setViewMessage(null)}>
                  Κλείσιμο
                </Button>
                <Button asChild>
                  <a href={`mailto:${viewMessage.email}?subject=Re: ${viewMessage.subject || ""}`}>
                    <Mail className="w-4 h-4 mr-2" /> Απάντηση
                  </a>
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Διαγραφή Μηνύματος</DialogTitle>
            <DialogDescription>
              Είστε σίγουροι ότι θέλετε να διαγράψετε αυτό το μήνυμα; Η ενέργεια
              δεν μπορεί να αναιρεθεί.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteId(null)}
              disabled={isLoading}
            >
              Ακύρωση
            </Button>
            <Button
              variant="destructive"
              className="text-white hover:bg-red-700 bg-red-600 transition-colors"
              onClick={handleDelete}
              disabled={isLoading}
            >
              {isLoading ? "Διαγραφή..." : "Διαγραφή"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Toggle Status Confirmation Modal */}
      <Dialog
        open={!!toggleStatusMessage}
        onOpenChange={(open) => !open && setToggleStatusMessage(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Αλλαγή Κατάστασης</DialogTitle>
            <DialogDescription>
              Θέλετε να επισημάνετε το μήνυμα ως {toggleStatusMessage?.isRead ? "μη αναγνωσμένο" : "αναγνωσμένο"};
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 gap-2">
            <Button
              variant="outline"
              onClick={() => setToggleStatusMessage(null)}
              disabled={isLoading}
            >
              Ακύρωση
            </Button>
            <Button onClick={handleToggleStatus} disabled={isLoading}>
              {isLoading ? "Ενημέρωση..." : "Επιβεβαίωση"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
