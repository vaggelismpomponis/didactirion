"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Save, X, Loader2, Link as LinkIcon } from "lucide-react";
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

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Ο τίτλος είναι υποχρεωτικός.",
  }),
  slug: z.string().min(2, {
    message: "Το slug είναι υποχρεωτικό.",
  }),
  content: z.string().min(10, {
    message: "Το περιεχόμενο πρέπει να είναι τουλάχιστον 10 χαρακτήρες.",
  }),
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

  const generateSlug = () => {
    const title = form.getValues("title");
    if (!title) return;
    
    const slug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "") // Remove non-word chars
      .replace(/\s+/g, "-") // Replace spaces with -
      .replace(/--+/g, "-") // Replace multiple - with single -
      .trim();
    
    form.setValue("slug", slug);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const url = initialData 
        ? `/api/admin/posts/${initialData.id}` 
        : "/api/admin/posts";
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
    <div className="bg-white p-8 rounded-xl border shadow-sm">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Τίτλος Ανακοίνωσης</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="π.χ. Έναρξη Θερινών Τμημάτων" 
                      {...field} 
                      onBlur={generateSlug}
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
                  <FormLabel className="flex items-center gap-2">
                    Slug (URL) <LinkIcon className="w-3 h-3 text-slate-400" />
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="enarksi-therinon-tmimaton" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Κατηγορία</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Επιλέξτε κατηγορία" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="announcements">Ανακοινώσεις</SelectItem>
                      <SelectItem value="exams">Εξετάσεις</SelectItem>
                      <SelectItem value="news">Νέα</SelectItem>
                      <SelectItem value="articles">Άρθρα</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="published"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Δημοσιευμένο</FormLabel>
                    <FormDescription>Εμφάνιση στον ιστότοπο.</FormDescription>
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
          </div>

          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Κεντρική Εικόνα</FormLabel>
                <FormControl>
                  <ImageUpload value={field.value || ""} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Περιεχόμενο (Markdown/Text)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Γράψτε το περιεχόμενο της ανακοίνωσης..." 
                    className="min-h-[300px]" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
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
