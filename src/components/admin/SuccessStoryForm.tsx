"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Save, X, Loader2, GraduationCap, Building2, User } from "lucide-react";
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

const formSchema = z.object({
  name: z.string().min(2, { message: "Το όνομα είναι υποχρεωτικό." }),
  university: z.string().min(2, { message: "Το πανεπιστήμιο είναι υποχρεωτικό." }),
  photo: z.string().optional().or(z.literal("")),
});

interface SuccessStoryFormProps {
  initialData?: any;
}

export function SuccessStoryForm({ initialData }: SuccessStoryFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: initialData || {
      name: "",
      university: "",
      photo: "",
    },
  });

  const nameValue = form.watch("name");
  const universityValue = form.watch("university");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const url = initialData
        ? `/api/admin/success-stories/${initialData.id}`
        : "/api/admin/success-stories";
      const method = initialData ? "PATCH" : "POST";
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!response.ok) throw new Error("Something went wrong");
      router.push("/admin/success-stories");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Σφάλμα κατά την αποθήκευση.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col xl:flex-row gap-6">

            {/* ── Main Fields ── */}
            <div className="flex-1 space-y-5">

              {/* Student info */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
                <div className="flex items-center gap-2 pb-4 border-b border-slate-50">
                  <div className="w-7 h-7 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="font-heading font-bold text-[14px] text-slate-800">Στοιχεία Μαθητή</h3>
                </div>

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[13px] font-bold text-slate-700">Ονοματεπώνυμο</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="π.χ. Νίκος Παππάς"
                          className="h-11 rounded-xl border-slate-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 text-[14px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="university"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[13px] font-bold text-slate-700">Πανεπιστήμιο / Σχολή</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="π.χ. ΕΜΠ"
                          className="h-11 rounded-xl border-slate-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 text-[14px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />


              </div>
            </div>

            {/* ── Preview Sidebar ── */}
            <div className="xl:w-60 space-y-5">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4 sticky top-6">
                <h3 className="font-heading font-bold text-[13px] text-slate-700 border-b border-slate-50 pb-3">
                  Προεπισκόπηση
                </h3>

                <div className="flex flex-col items-center gap-3 py-2">
                  {/* Avatar */}
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-emerald-400 to-emerald-600 border-4 border-emerald-50 shadow-md flex items-center justify-center">
                    <span className="text-white font-black text-2xl uppercase">
                      {nameValue?.[0] || "?"}
                    </span>
                  </div>

                  <div className="text-center space-y-1.5">
                    <p className="font-black text-[14px] text-slate-800 leading-tight">
                      {nameValue || "Ονοματεπώνυμο"}
                    </p>
                    {universityValue && (
                      <div className="flex items-center justify-center gap-1 text-[11px] text-slate-600 font-medium">
                        <Building2 className="w-3 h-3 text-emerald-500" />
                        {universityValue}
                      </div>
                    )}


                  </div>
                </div>

                <div className="pt-4 border-t border-slate-50 space-y-2">
                  <Button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white h-10 font-bold rounded-xl shadow-md shadow-emerald-200 transition-all"
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
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
