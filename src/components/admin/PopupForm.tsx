"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Save, X, Loader2 } from "lucide-react";
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

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Ο τίτλος είναι υποχρεωτικός.",
  }),
  content: z.string().optional().or(z.literal("")),
  image: z.string().optional().or(z.literal("")),
  active: z.boolean().default(false),
});

interface PopupFormProps {
  initialData?: any;
}

export function PopupForm({ initialData }: PopupFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: initialData || {
      title: "",
      content: "",
      image: "",
      active: false,
    },
  });

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

      if (!response.ok) throw new Error("Something went wrong");

      router.push("/admin/gallery");
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
              <FormItem>
                <FormLabel>Περιεχόμενο (Κείμενο)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Γράψτε το κείμενο που θα εμφανίζεται στο popup..." 
                    className="min-h-[100px]" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL Εικόνας (Προαιρετικά)</FormLabel>
                <FormControl>
                  <Input placeholder="https://..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
