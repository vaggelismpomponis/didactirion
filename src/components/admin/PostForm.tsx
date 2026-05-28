"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { 
  Save, 
  X, 
  Loader2, 
  Link as LinkIcon, 
  Wand2, 
  FileText, 
  Settings2, 
  Bold, 
  Italic, 
  Heading3, 
  List, 
  ListOrdered, 
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUpload } from "./ImageUpload";

// Greek to Latin transliteration helper
function transliterateGreek(text: string): string {
  const greekToLatinMap: { [key: string]: string } = {
    'α': 'a', 'β': 'v', 'γ': 'g', 'δ': 'd', 'ε': 'e', 'ζ': 'z', 'η': 'i', 'θ': 'th',
    'ι': 'i', 'κ': 'k', 'λ': 'l', 'μ': 'm', 'ν': 'n', 'ξ': 'x', 'ο': 'o', 'π': 'p',
    'ρ': 'r', 'σ': 's', 'ς': 's', 'τ': 't', 'υ': 'y', 'φ': 'f', 'χ': 'ch', 'ψ': 'ps',
    'ω': 'o',
    'ά': 'a', 'έ': 'e', 'ή': 'i', 'ί': 'i', 'ό': 'o', 'ύ': 'y', 'ώ': 'o',
    'ϊ': 'i', 'ϋ': 'y', 'ΐ': 'i', 'ΰ': 'y',
    'Α': 'A', 'Β': 'V', 'Γ': 'G', 'Δ': 'D', 'Ε': 'E', 'Ζ': 'Z', 'Η': 'I', 'Θ': 'Th',
    'Ι': 'I', 'Κ': 'K', 'Λ': 'L', 'Μ': 'M', 'Ν': 'N', 'Ξ': 'X', 'Ο': 'O', 'Π': 'P',
    'Ρ': 'R', 'Σ': 'S', 'Τ': 'T', 'Υ': 'Y', 'Φ': 'F', 'Χ': 'Ch', 'Ψ': 'Ps', 'Ω': 'O',
    'Ά': 'A', 'Έ': 'E', 'Ή': 'I', 'Ί': 'I', 'Ό': 'O', 'Ύ': 'Y', 'Ώ': 'O'
  };

  return text
    .split('')
    .map(char => greekToLatinMap[char] || char)
    .join('');
}

// Basic client-side markdown to html parser
function parseMarkdownToHtml(markdown: string): string {
  if (!markdown) return "";
  let html = markdown
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  // Italic
  html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");
  // Headers
  html = html.replace(/^### (.*?)$/gm, "<h4 class='text-[16px] font-bold text-slate-800 mt-4 mb-2'>$1</h4>");
  html = html.replace(/^## (.*?)$/gm, "<h3 class='text-[18px] font-bold text-slate-800 mt-5 mb-3'>$1</h3>");
  html = html.replace(/^# (.*?)$/gm, "<h2 class='text-[22px] font-bold text-slate-800 mt-6 mb-4'>$1</h2>");
  // Lists
  html = html.replace(/^\s*-\s+(.*?)$/gm, "<li class='list-disc ml-5 mb-1 text-slate-600'>$1</li>");
  html = html.replace(/^\s*\d+\.\s+(.*?)$/gm, "<li class='list-decimal ml-5 mb-1 text-slate-600'>$1</li>");
  
  // Wrap list tags nicely
  html = html.replace(/(<li class='list-disc[\s\S]*?<\/li>)/g, "<ul class='my-3'>$1</ul>");
  html = html.replace(/(<li class='list-decimal[\s\S]*?<\/li>)/g, "<ol class='my-3'>$1</ol>");

  // Paragraphs
  html = html.split(/\n{2,}/).map(p => {
    const trimmed = p.trim();
    if (
      trimmed.startsWith("<h") || 
      trimmed.startsWith("<ul") || 
      trimmed.startsWith("<ol") || 
      trimmed.startsWith("<li")
    ) {
      return p;
    }
    return `<p class="mb-4 text-slate-600 leading-relaxed text-[14px]">${p.replace(/\n/g, "<br/>")}</p>`;
  }).join("\n");

  return html;
}

const formSchema = z.object({
  title: z.string().min(2, { message: "Ο τίτλος είναι υποχρεωτικός." }),
  slug: z.string().min(2, { message: "Το slug είναι υποχρεωτικό." }),
  content: z.string().min(10, { message: "Το περιεχόμενο πρέπει να είναι τουλάχιστον 10 χαρακτήρες." }),
  image: z.string().optional().or(z.literal("")),
  category: z.string().default("announcements"),
  published: z.boolean().default(false),
});

interface PostFormProps {
  initialData?: any;
}

export function PostForm({ initialData }: PostFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSlugEdited, setIsSlugEdited] = useState(!!initialData?.slug);
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: initialData || {
      title: "",
      slug: "",
      content: "",
      image: "",
      category: "announcements",
      published: false,
    },
  });

  const titleValue = form.watch("title");
  const publishedValue = form.watch("published");
  const contentValue = form.watch("content");

  // Transliterate and set slug
  const computeSlug = (titleText: string) => {
    if (!titleText) return "";
    return transliterateGreek(titleText)
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/--+/g, "-")
      .replace(/^-+|-+$/g, "")
      .trim();
  };

  const generateSlug = () => {
    const title = form.getValues("title");
    const slug = computeSlug(title);
    form.setValue("slug", slug, { shouldValidate: true });
  };

  // Real-time dynamic slug generation if not manually customized
  useEffect(() => {
    if (!isSlugEdited && titleValue) {
      const slug = computeSlug(titleValue);
      form.setValue("slug", slug, { shouldValidate: true });
    }
  }, [titleValue, isSlugEdited, form]);

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
    // Sanitize manually entered leading/trailing hyphens before submitting
    values.slug = values.slug.replace(/^-+|-+$/g, "").trim();
    setIsLoading(true);
    try {
      const url = initialData ? `/api/admin/posts/${initialData.id}` : "/api/admin/posts";
      const method = initialData ? "PATCH" : "POST";
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!response.ok) throw new Error("Something went wrong");
      router.push("/admin/posts");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Σφάλμα κατά την αποθήκευση.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col xl:flex-row gap-6">

            {/* ── Main Content Column ── */}
            <div className="flex-1 space-y-5">

              {/* Title & Slug */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
                <div className="flex items-center gap-2 pb-4 border-b border-slate-50">
                  <div className="w-7 h-7 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                    <FileText className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="font-heading font-bold text-[14px] text-slate-800">Βασικές Πληροφορίες</h3>
                </div>

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[13px] font-bold text-slate-700">Τίτλος Ανακοίνωσης</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="π.χ. Έναρξη Θερινών Τμημάτων"
                          className="h-11 rounded-xl border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-[14px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[13px] font-bold text-slate-700 flex items-center gap-2">
                        Slug (URL) <LinkIcon className="w-3 h-3 text-slate-400" />
                      </FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input
                            placeholder="enarksi-therinon-tmimaton"
                            className="h-11 rounded-xl border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-[13px] font-mono flex-1"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              setIsSlugEdited(!!e.target.value);
                            }}
                          />
                        </FormControl>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            generateSlug();
                            setIsSlugEdited(true);
                          }}
                          className="h-11 px-3 rounded-xl border-slate-200 hover:border-blue-300 hover:bg-blue-50 text-slate-500 hover:text-blue-600 transition-all"
                          title="Αυτόματη δημιουργία"
                        >
                          <Wand2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <FormDescription className="text-[11px] text-slate-400">
                        /announcements/<span className="font-mono text-blue-600">{field.value || "slug-url"}</span>
                        {!isSlugEdited && titleValue && " (παράγεται αυτόματα)"}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Image Upload */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
                <div className="flex items-center gap-2 pb-4 border-b border-slate-50">
                  <div className="w-7 h-7 rounded-xl bg-violet-50 flex items-center justify-center text-violet-600">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="font-heading font-bold text-[14px] text-slate-800">Κεντρική Εικόνα</h3>
                </div>
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <ImageUpload value={field.value || ""} onChange={field.onChange} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Content Editor with Toolbar and Live Preview */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-50 gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="font-heading font-bold text-[14px] text-slate-800">Περιεχόμενο</h3>
                  </div>

                  {/* Edit/Preview Tabs */}
                  <div className="flex items-center bg-slate-50 p-1 rounded-xl border border-slate-100">
                    <button
                      type="button"
                      onClick={() => setActiveTab("edit")}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all ${activeTab === "edit" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
                    >
                      <PenTool className="w-3.5 h-3.5" />
                      Σύνταξη
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("preview")}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all ${activeTab === "preview" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
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
                        className="w-8 h-8 rounded-lg text-slate-600 hover:bg-white hover:text-blue-600"
                        onClick={() => insertMarkdown("bold")}
                        title="Έντονο"
                      >
                        <Bold className="w-4 h-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="w-8 h-8 rounded-lg text-slate-600 hover:bg-white hover:text-blue-600"
                        onClick={() => insertMarkdown("italic")}
                        title="Πλάγιο"
                      >
                        <Italic className="w-4 h-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="w-8 h-8 rounded-lg text-slate-600 hover:bg-white hover:text-blue-600"
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
                        className="w-8 h-8 rounded-lg text-slate-600 hover:bg-white hover:text-blue-600"
                        onClick={() => insertMarkdown("list")}
                        title="Λίστα με κουκκίδες"
                      >
                        <List className="w-4 h-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="w-8 h-8 rounded-lg text-slate-600 hover:bg-white hover:text-blue-600"
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
                        className="w-8 h-8 rounded-lg text-slate-600 hover:bg-white hover:text-blue-600"
                        onClick={() => insertMarkdown("link")}
                        title="Σύνδεσμος"
                      >
                        <LinkIcon className="w-4 h-4" />
                      </Button>
                      <span className="text-[11px] text-slate-400 font-medium ml-auto pr-2 hidden sm:inline-block">
                        Markdown υποστηρίζεται
                      </span>
                    </div>

                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea
                              id="content-textarea"
                              placeholder="Γράψτε το περιεχόμενο της ανακοίνωσης..."
                              className="min-h-[320px] rounded-xl border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-[13px] leading-relaxed resize-none p-4"
                              {...field}
                            />
                          </FormControl>
                          <div className="flex items-center justify-between">
                            <FormMessage />
                            <span className="text-[11px] text-slate-400 ml-auto">
                              {field.value?.length || 0} χαρακτήρες
                            </span>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                ) : (
                  <div className="border border-slate-100 rounded-xl p-6 bg-slate-50 min-h-[367px] prose prose-slate max-w-none">
                    {contentValue ? (
                      <div 
                        dangerouslySetInnerHTML={{ __html: parseMarkdownToHtml(contentValue) }} 
                        className="space-y-2 text-[14px]"
                      />
                    ) : (
                      <p className="text-slate-400 text-[13px] italic text-center pt-24">
                        Δεν υπάρχει περιεχόμενο για προεπισκόπηση ακόμη.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* ── Settings Sidebar ── */}
            <div className="xl:w-72 space-y-5 sticky top-6 self-start">

              {/* Publish controls */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-5">
                <div className="flex items-center gap-2 pb-4 border-b border-slate-50">
                  <div className="w-7 h-7 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <Settings2 className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="font-heading font-bold text-[14px] text-slate-800">Δημοσίευση</h3>
                </div>

                {/* Status indicator */}
                <div className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border transition-all ${publishedValue ? "bg-emerald-50 border-emerald-200" : "bg-slate-50 border-slate-200"}`}>
                  <span className={`w-2 h-2 rounded-full ${publishedValue ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`} />
                  <span className={`text-[12px] font-bold ${publishedValue ? "text-emerald-700" : "text-slate-500"}`}>
                    {publishedValue ? "Δημοσιευμένο" : "Πρόχειρο"}
                  </span>
                </div>

                <FormField
                  control={form.control}
                  name="published"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between gap-4">
                      <div>
                        <FormLabel className="text-[13px] font-bold text-slate-700">Δημοσίευση</FormLabel>
                        <FormDescription className="text-[11px] text-slate-400 mt-0.5">
                          Εμφάνιση στον ιστότοπο
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

                <div className="pt-4 border-t border-slate-50 space-y-2">
                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white h-10 font-bold rounded-xl shadow-md shadow-blue-200 transition-all"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    {initialData ? "Ενημέρωση" : "Αποθήκευση"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    disabled={isLoading}
                    className="w-full h-9 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 text-[13px]"
                  >
                    <X className="w-3.5 h-3.5 mr-2" /> Ακύρωση
                  </Button>
                </div>
              </div>

              {/* Category */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
                <h3 className="font-heading font-bold text-[13px] text-slate-700">Κατηγορία</h3>
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <select 
                          value={field.value} 
                          onChange={(e) => field.onChange(e.target.value)}
                          className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-[13px] text-slate-800 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2364748B%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5%201.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:10px] bg-[position:right_12px_center] bg-no-repeat pr-10"
                        >
                          <option value="announcements">Ανακοινώσεις</option>
                          <option value="exams">Εξετάσεις</option>
                          <option value="news">Νέα</option>
                          <option value="articles">Άρθρα</option>
                        </select>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* SEO Preview */}
              {titleValue && (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-3">
                  <h3 className="font-heading font-bold text-[13px] text-slate-700">SEO Preview</h3>
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-1">
                    <p className="text-blue-700 text-[12px] font-medium truncate">
                      didactirion.gr/announcements/{form.watch("slug") || "..."}
                    </p>
                    <p className="text-[14px] text-slate-800 font-semibold leading-snug line-clamp-2">
                      {titleValue}
                    </p>
                    <p className="text-[11px] text-slate-500 line-clamp-2">
                      {form.watch("content")?.substring(0, 120) || "Περιγραφή ανακοίνωσης..."}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
