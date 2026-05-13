"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Mail, MapPin, Phone, Send, CheckCircle2, Clock, ArrowRight } from "lucide-react";
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

const formSchema = z.object({
  name: z.string().min(2, { message: "Το όνομα πρέπει να είναι τουλάχιστον 2 χαρακτήρες." }),
  email: z.string().email({ message: "Παρακαλώ εισάγετε ένα έγκυρο email." }),
  subject: z.string().min(5, { message: "Το θέμα πρέπει να είναι τουλάχιστον 5 χαρακτήρες." }),
  message: z.string().min(10, { message: "Το μήνυμα πρέπει να είναι τουλάχιστον 10 χαρακτήρες." }),
});

const contactInfo = [
  {
    icon: MapPin,
    title: "Διεύθυνση",
    lines: ["Θρακομακεδόνων 97", "Αχαρναί, 136 71"],
    href: "https://www.google.com/maps/search/?api=1&query=Φροντιστήριο+Διδακτήριον+Θρακομακεδόνων+97+Αχαρναί",
  },
  {
    icon: Phone,
    title: "Τηλέφωνο",
    lines: ["210 2448542", "697 6101693"],
    href: "tel:2102448542",
  },
  {
    icon: Mail,
    title: "Email",
    lines: ["info@didactirion.gr"],
    href: "mailto:info@didactirion.gr",
  },
  {
    icon: Clock,
    title: "Ωράριο",
    lines: ["Δε – Πα: 15:00 – 22:00", "Σάββατο: 09:00 – 16:00"],
    href: null,
  },
];

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: { name: "", email: "", subject: "", message: "" },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!response.ok) throw new Error("Failed to send message");
      setIsSuccess(true);
      form.reset();
    } catch {
      alert("Υπήρξε ένα πρόβλημα κατά την αποστολή. Παρακαλώ δοκιμάστε ξανά.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col">
      {/* ── Hero ── */}
      <section className="relative py-16 sm:py-24 overflow-hidden">
        <div className="absolute inset-0 hero-gradient" />
        {/* Decorative */}
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-white/5 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-[350px] h-[350px] rounded-full bg-white/5 blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10 text-white">

          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tight mb-4 max-w-3xl leading-tight">
            Επικοινωνήστε<br />μαζί μας
          </h1>
          <p className="text-base sm:text-xl text-blue-100/80 max-w-2xl leading-relaxed">
            Είμαστε εδώ για να απαντήσουμε σε κάθε σας απορία και να σας βοηθήσουμε να ξεκινήσετε το εκπαιδευτικό σας ταξίδι.
          </p>
        </div>
      </section>

      {/* ── Contact Cards ── */}
      <section className="container mx-auto px-4 -mt-10 relative z-20 mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {contactInfo.map((item, i) => {
            const Tag = item.href ? "a" : "div";
            const props = item.href
              ? { href: item.href, target: item.href.startsWith("http") ? "_blank" : undefined, rel: item.href.startsWith("http") ? "noopener noreferrer" : undefined }
              : {};

            return (
              // @ts-ignore
              <Tag key={i} {...props} className={`bg-white rounded-2xl p-5 shadow-xl border border-slate-100 flex flex-col gap-3 ${item.href ? "hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer group" : ""}`}>
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 transition-all">
                  <item.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{item.title}</p>
                  {item.lines.map((line, j) => (
                    <p key={j} className="text-sm font-medium text-slate-700">{line}</p>
                  ))}
                </div>
              </Tag>
            );
          })}
        </div>
      </section>

      {/* ── Main Grid ── */}
      <section className="container mx-auto px-4 py-12 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">

          {/* ── Left: Map + Info ── */}
          <div className="lg:col-span-2 space-y-6">
            {/* Map */}
            <div className="rounded-3xl overflow-hidden shadow-xl border border-slate-100 bg-slate-100 aspect-[4/3]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3138.868725838573!2d23.74124317655073!3d38.1108964718999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14a1a034c7e05555%3A0x968da364498ceae1!2zzqbPgc6_zr3PhM65z4PPhM6uz4HOuc6_IM6UzrnOtM6xzrrPhM6uz4HOuc6_zr0!5e0!3m2!1sel!2sgr!4v1715531165651!5m2!1sel!2sgr"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                title="Didactirion map"
              />
            </div>

            {/* FAQ / Quick answers */}
            <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 space-y-4">
              <h3 className="font-bold text-slate-900 text-lg">Συχνές Ερωτήσεις</h3>
              {[
                { q: "Πότε ξεκινούν οι εγγραφές;", a: "Οι εγγραφές είναι ανοικτές καθ' όλη τη διάρκεια του έτους." },
                { q: "Πόσοι μαθητές ανά τμήμα;", a: "Μόνο 4-5 μαθητές για μέγιστη αποδοτικότητα." },
              ].map((faq, i) => (
                <details key={i} className="group border border-slate-200 rounded-xl overflow-hidden">
                  <summary className="flex items-center justify-between p-4 cursor-pointer text-sm font-bold text-slate-800 hover:bg-white transition-colors">
                    {faq.q}
                    <ArrowRight className="w-4 h-4 text-slate-400 group-open:rotate-90 transition-transform" />
                  </summary>
                  <div className="px-4 pb-4 text-sm text-slate-600">{faq.a}</div>
                </details>
              ))}
            </div>
          </div>

          {/* ── Right: Form ── */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 md:p-8 lg:p-10 relative overflow-hidden">
              {/* Decorative corner accent */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-bl-[4rem] pointer-events-none" />

              {isSuccess ? (
                <div className="py-16 flex flex-col items-center text-center space-y-6 animate-in zoom-in duration-500">
                  <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center shadow-xl shadow-green-500/20">
                    <CheckCircle2 className="w-14 h-14" />
                  </div>
                  <h2 className="text-3xl font-black text-slate-900">Το μήνυμα στάλθηκε!</h2>
                  <p className="text-slate-500 max-w-sm leading-relaxed">
                    Ευχαριστούμε για την επικοινωνία. Θα σας απαντήσουμε το συντομότερο δυνατό.
                  </p>
                  <Button variant="outline" onClick={() => setIsSuccess(false)} className="mt-2 border-slate-200 hover:border-primary hover:text-primary">
                    Στείλτε άλλο μήνυμα
                  </Button>
                </div>
              ) : (
                <>
                  <div className="mb-8 relative z-10">

                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 mt-3 mb-2">Στείλτε μας ένα μήνυμα</h2>
                    <p className="text-slate-500 text-sm leading-relaxed">
                      Συμπληρώστε τη φόρμα και θα επικοινωνήσουμε μαζί σας το συντομότερο.
                    </p>
                  </div>

                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 relative z-10">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-slate-700 font-semibold text-sm">Ονοματεπώνυμο</FormLabel>
                              <FormControl>
                                <Input placeholder="π.χ. Ιωάννης Παπαδόπουλος" {...field} className="h-12 rounded-xl border-slate-200 focus:border-primary bg-slate-50/50 focus:bg-white transition-colors" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-slate-700 font-semibold text-sm">Email</FormLabel>
                              <FormControl>
                                <Input placeholder="π.χ. email@example.com" {...field} className="h-12 rounded-xl border-slate-200 focus:border-primary bg-slate-50/50 focus:bg-white transition-colors" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-700 font-semibold text-sm">Θέμα</FormLabel>
                            <FormControl>
                              <Input placeholder="π.χ. Εγγραφή σε τμήμα Λυκείου" {...field} className="h-12 rounded-xl border-slate-200 focus:border-primary bg-slate-50/50 focus:bg-white transition-colors" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-700 font-semibold text-sm">Μήνυμα</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Πώς μπορούμε να σας βοηθήσουμε;"
                                className="min-h-[140px] resize-none rounded-xl border-slate-200 focus:border-primary bg-slate-50/50 focus:bg-white transition-colors"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        className="w-full h-13 bg-primary hover:bg-primary/90 text-base font-bold shadow-xl shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5 transition-all"
                        disabled={isSubmitting}
                        style={{ height: "3.25rem" }}
                      >
                        {isSubmitting ? (
                          <span className="flex items-center gap-2">
                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Αποστολή...
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            Αποστολή Μηνύματος <Send className="w-4 h-4" />
                          </span>
                        )}
                      </Button>
                    </form>
                  </Form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
