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

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Το όνομα πρέπει να είναι τουλάχιστον 2 χαρακτήρες.",
  }),
  specialty: z.string().min(2, {
    message: "Η ειδικότητα είναι υποχρεωτική.",
  }),
  bio: z.string().min(10, {
    message: "Το βιογραφικό πρέπει να είναι τουλάχιστον 10 χαρακτήρες.",
  }),
  photo: z.string().optional().or(z.literal("")),
  order: z.coerce.number().int().default(0),
});

interface TeacherFormProps {
  initialData?: any;
}

export function TeacherForm({ initialData }: TeacherFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: initialData || {
      name: "",
      specialty: "",
      bio: "",
      photo: "",
      order: 0,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const url = initialData 
        ? `/api/admin/teachers/${initialData.id}` 
        : "/api/admin/teachers";
      const method = initialData ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error("Something went wrong");

      router.push("/admin/teachers");
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ονοματεπώνυμο</FormLabel>
                <FormControl>
                  <Input placeholder="π.χ. Μαρία Γεωργίου" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="specialty"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ειδικότητα</FormLabel>
                <FormControl>
                  <Input placeholder="π.χ. Φιλόλογος" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Βιογραφικό</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Λίγα λόγια για τον καθηγητή..." 
                    className="min-h-[150px]" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="photo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL Φωτογραφίας</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormDescription>Προσωρινά χρησιμοποιούμε URLs.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="order"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Σειρά Εμφάνισης</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

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
