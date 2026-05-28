"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Save, X, Loader2, User, GraduationCap, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "./ImageUpload";

const formSchema = z.object({
  name: z.string().min(2, { message: "Το όνομα πρέπει να είναι τουλάχιστον 2 χαρακτήρες." }),
  specialty: z.string().min(2, { message: "Η ειδικότητα είναι υποχρεωτική." }),
  bio: z.string().min(10, { message: "Το βιογραφικό πρέπει να είναι τουλάχιστον 10 χαρακτήρες." }),
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

  const nameValue = form.watch("name");
  const specialtyValue = form.watch("specialty");
  const photoValue = form.watch("photo");
  const bioValue = form.watch("bio");

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
    <div className="max-w-7xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col xl:flex-row gap-6">

            {/* ── Main Fields ── */}
            <div className="flex-1 space-y-5">

              {/* Identity */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
                <div className="flex items-center gap-2 pb-4 border-b border-slate-50">
                  <div className="w-7 h-7 rounded-xl bg-violet-50 flex items-center justify-center text-violet-600">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="font-heading font-bold text-[14px] text-slate-800">Στοιχεία Καθηγητή</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[13px] font-bold text-slate-700">Ονοματεπώνυμο</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="π.χ. Μαρία Γεωργίου"
                            className="h-11 rounded-xl border-slate-200 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 text-[14px]"
                            {...field}
                          />
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
                        <FormLabel className="text-[13px] font-bold text-slate-700">Ειδικότητα</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="π.χ. Φιλόλογος"
                            className="h-11 rounded-xl border-slate-200 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 text-[14px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[13px] font-bold text-slate-700">Βιογραφικό</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Λίγα λόγια για τον καθηγητή..."
                          className="min-h-[160px] rounded-xl border-slate-200 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 text-[13px] leading-relaxed resize-none"
                          {...field}
                        />
                      </FormControl>
                      <div className="flex items-center justify-end">
                        <span className="text-[11px] text-slate-400">{field.value?.length || 0} χαρακτήρες</span>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Photo */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
                <div className="flex items-center gap-2 pb-4 border-b border-slate-50">
                  <div className="w-7 h-7 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="font-heading font-bold text-[14px] text-slate-800">Φωτογραφία</h3>
                </div>
                <FormField
                  control={form.control}
                  name="photo"
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
            </div>

            {/* ── Sidebar: Preview + Order ── */}
            <div className="xl:w-64 space-y-5">

              {/* Live preview card */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4 sticky top-6">
                <h3 className="font-heading font-bold text-[13px] text-slate-700 border-b border-slate-50 pb-3">
                  Προεπισκόπηση
                </h3>

                <div className="flex flex-col items-center gap-3 py-2">
                  {/* Avatar preview */}
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-violet-100 to-violet-200 border-4 border-violet-100 shadow-md">
                    {photoValue ? (
                      <img src={photoValue} alt="preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-8 h-8 text-violet-400" />
                      </div>
                    )}
                  </div>

                  <div className="text-center">
                    <p className="font-black text-[15px] text-slate-800 leading-tight">
                      {nameValue || "Ονοματεπώνυμο"}
                    </p>
                    <span className="inline-flex items-center mt-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-violet-50 text-violet-700 border border-violet-200">
                      {specialtyValue || "Ειδικότητα"}
                    </span>
                  </div>

                  {bioValue && (
                    <p className="text-[11px] text-slate-500 text-center line-clamp-3 leading-relaxed">
                      {bioValue}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-slate-50 space-y-2">
                  <Button
                    type="submit"
                    className="w-full bg-violet-600 hover:bg-violet-500 text-white h-10 font-bold rounded-xl shadow-md shadow-violet-200 transition-all"
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

              {/* Display Order */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-3">
                <h3 className="font-heading font-bold text-[13px] text-slate-700">Σειρά Εμφάνισης</h3>
                <FormField
                  control={form.control}
                  name="order"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2">
                        <FormControl>
                          <Input
                            type="number"
                            className="h-10 rounded-xl border-slate-200 text-center font-black text-[16px] focus:border-violet-400"
                            {...field}
                          />
                        </FormControl>
                        <div className="flex flex-col gap-1">
                          <button
                            type="button"
                            onClick={() => field.onChange(Number(field.value) + 1)}
                            className="w-8 h-5 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors"
                          >
                            <ChevronUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => field.onChange(Math.max(0, Number(field.value) - 1))}
                            className="w-8 h-5 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors"
                          >
                            <ChevronDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-400">Χαμηλότερος = πρώτος</p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
