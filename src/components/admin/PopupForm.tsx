"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { parseMarkdownToHtml } from "@/lib/markdown";
import { 
  Save, 
  X, 
  Loader2, 
  Bold, 
  Italic, 
  Heading3, 
  List, 
  ListOrdered, 
  Link as LinkIcon, 
  Eye, 
  PenTool 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ImageUpload } from "./ImageUpload";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Ο τίτλος είναι υποχρεωτικός.",
  }),
  content: z.string().optional().or(z.literal("")),
  image: z.string().optional().or(z.literal("")),
  active: z.boolean().default(false),
  delay: z.coerce.number().int().nonnegative().default(2),
  duration: z.coerce.number().int().nonnegative().default(10),
});

interface PopupFormProps {
  initialData?: any;
}

export function PopupForm({ initialData }: PopupFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: initialData || {
      title: "",
      content: "",
      image: "",
      active: false,
      delay: 2,
      duration: 10,
    },
  });

  const contentValue = form.watch("content");

  const insertMarkdown = (syntax: string) => {
    const textarea = document.getElementById("content-textarea") as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const before = text.substring(0, start);
    const after = text.substring(end, text.length);
    const selected = text.substring(start, end);

    let replacement = "";
    if (syntax === "bold") {
      replacement = `**${selected || "έντονο κείμενο"}**`;
    } else if (syntax === "italic") {
      replacement = `*${selected || "πλάγιο κείμενο"}*`;
    } else if (syntax === "heading") {
      replacement = `\n### ${selected || "Υπότιτλος"}\n`;
    } else if (syntax === "list") {
      replacement = `\n- ${selected || "στοιχείο"}\n`;
    } else if (syntax === "numlist") {
      replacement = `\n1. ${selected || "στοιχείο"}\n`;
    } else if (syntax === "link") {
      replacement = `[${selected || "σύνδεσμος"}](https://example.com)`;
    }

    const newValue = before + replacement + after;
    form.setValue("content", newValue, { shouldValidate: true });

    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + replacement.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 50);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const url = initialData 
        ? `/api/admin/popups/${initialData.id}` 
        : "/api/admin/popups";
      const method = initialData ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || "Something went wrong");
      }

      router.push("/admin/gallery");
      router.refresh();
    } catch (error: any) {
      console.error(error);
      alert(`Σφάλμα κατά την αποθήκευση: ${error.message || error}`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="bg-white p-8 rounded-xl border shadow-sm">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Τίτλος Popup</FormLabel>
                <FormControl>
                  <Input placeholder="π.χ. Προετοιμασία Πανελλαδικών 2026" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <FormLabel className="text-[13px] font-bold text-slate-700">Περιεχόμενο (Markdown/Κείμενο)</FormLabel>
                  
                  {/* Edit/Preview Tabs */}
                  <div className="flex items-center bg-slate-50 p-1 rounded-xl border border-slate-100 w-fit self-end sm:self-auto">
                    <button
                      type="button"
                      onClick={() => setActiveTab("edit")}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all cursor-pointer ${activeTab === "edit" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
                    >
                      <PenTool className="w-3.5 h-3.5" />
                      Σύνταξη
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("preview")}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all cursor-pointer ${activeTab === "preview" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Προεπισκόπηση
                    </button>
                  </div>
                </div>

                {activeTab === "edit" ? (
                  <div className="space-y-3">
                    {/* Formatting Toolbar */}
                    <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-50 rounded-xl border border-slate-100">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="w-8 h-8 rounded-lg text-slate-600 hover:bg-white hover:text-blue-600 cursor-pointer"
                        onClick={() => insertMarkdown("bold")}
                        title="Έντονο"
                      >
                        <Bold className="w-4 h-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="w-8 h-8 rounded-lg text-slate-600 hover:bg-white hover:text-blue-600 cursor-pointer"
                        onClick={() => insertMarkdown("italic")}
                        title="Πλάγιο"
                      >
                        <Italic className="w-4 h-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="w-8 h-8 rounded-lg text-slate-600 hover:bg-white hover:text-blue-600 cursor-pointer"
                        onClick={() => insertMarkdown("heading")}
                        title="Υπότιτλος"
                      >
                        <Heading3 className="w-4 h-4" />
                      </Button>
                      <div className="w-[1px] h-5 bg-slate-200 mx-1" />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="w-8 h-8 rounded-lg text-slate-600 hover:bg-white hover:text-blue-600 cursor-pointer"
                        onClick={() => insertMarkdown("list")}
                        title="Λίστα με κουκκίδες"
                      >
                        <List className="w-4 h-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="w-8 h-8 rounded-lg text-slate-600 hover:bg-white hover:text-blue-600 cursor-pointer"
                        onClick={() => insertMarkdown("numlist")}
                        title="Αριθμημένη λίστα"
                      >
                        <ListOrdered className="w-4 h-4" />
                      </Button>
                      <div className="w-[1px] h-5 bg-slate-200 mx-1" />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="w-8 h-8 rounded-lg text-slate-600 hover:bg-white hover:text-blue-600 cursor-pointer"
                        onClick={() => insertMarkdown("link")}
                        title="Σύνδεσμος"
                      >
                        <LinkIcon className="w-4 h-4" />
                      </Button>
                      <span className="text-[11px] text-slate-400 font-medium ml-auto pr-2 hidden sm:inline-block">
                        Markdown υποστηρίζεται
                      </span>
                    </div>

                    <FormControl>
                      <Textarea 
                        id="content-textarea"
                        placeholder="Γράψτε το κείμενο που θα εμφανίζεται στο popup..." 
                        className="min-h-[140px] rounded-xl border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-[13px] leading-relaxed p-4" 
                        {...field} 
                      />
                    </FormControl>
                  </div>
                ) : (
                  <div className="border border-slate-100 rounded-xl p-6 bg-slate-50 min-h-[187px] prose prose-slate max-w-none">
                    {contentValue ? (
                      <div 
                        dangerouslySetInnerHTML={{ __html: parseMarkdownToHtml(contentValue) }} 
                        className="space-y-2 text-[14px]"
                      />
                    ) : (
                      <p className="text-slate-400 text-[13px] italic text-center pt-16">
                        Δεν υπάρχει περιεχόμενο για προεπισκόπηση ακόμη.
                      </p>
                    )}
                  </div>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Εικόνα Popup (Προαιρετικά)</FormLabel>
                <FormControl>
                  <ImageUpload value={field.value || ""} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="delay"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Καθυστέρηση Εμφάνισης (δευτ.)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormDescription>Πόσα δευτερόλεπτα μετά τη φόρτωση θα εμφανιστεί.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Διάρκεια Εμφάνισης (δευτ.)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormDescription>Πότε θα κλείσει αυτόματα (0 = χειροκίνητο κλείσιμο).</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="active"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel>Ενεργό</FormLabel>
                  <FormDescription>
                    Μόνο ένα popup μπορεί να είναι ενεργό ταυτόχρονα.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-4 pt-4 border-t">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => router.back()}
              disabled={isLoading}
            >
              <X className="w-4 h-4 mr-2" /> Ακύρωση
            </Button>
            <Button 
              type="submit" 
              className="bg-[#004a99]"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {initialData ? "Ενημέρωση" : "Αποθήκευση"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
