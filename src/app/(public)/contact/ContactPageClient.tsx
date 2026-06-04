"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Mail, MapPin, Phone, Send, CheckCircle2, Clock, ArrowRight, RotateCcw } from "lucide-react";
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
    content: "Θρακομακεδόνων 97",
    subContent: "Αχαρναί, 136 71",
    accent: "from-blue-500 to-blue-600",
    bgLight: "bg-blue-50",
    textColor: "text-blue-600",
    href: "https://www.google.com/maps/search/?api=1&query=Φροντιστήριο+Διδακτήριον+Θρακομακεδόνων+97+Αχαρναί",
  },
  {
    icon: Phone,
    title: "Τηλέφωνο",
    content: "210 2448542",
    subContent: "Δευτέρα - Παρασκευή, 15:00 - 22:00",
    accent: "from-emerald-500 to-emerald-600",
    bgLight: "bg-emerald-50",
    textColor: "text-emerald-600",
    href: "tel:2102448542",
  },
  {
    icon: Mail,
    title: "Email",
    content: "info@didactirion.gr",
    subContent: "Θα χαρούμε να σας εξυπηρετήσουμε",
    accent: "from-violet-500 to-violet-600",
    bgLight: "bg-violet-50",
    textColor: "text-violet-600",
    href: "mailto:info@didactirion.gr",
  },
];

const schedule = [
  { day: "Δευτέρα - Παρασκευή", hours: "15:00 - 22:00" },
  { day: "Σάββατο", hours: "09:00 - 16:00" },
  { day: "Κυριακή", hours: "Κλειστά" },
];

export function ContactPageClient() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        setIsSubmitted(true);
        form.reset();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col">
      {/* ── Hero ── */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-500/10 blur-3xl rounded-full" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-primary/10 blur-[80px] pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10 text-white text-center flex flex-col items-center justify-center">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 mx-auto">
            Επικοινωνία
          </h1>
          <p className="text-xl text-blue-100/80 max-w-2xl leading-relaxed mx-auto">
            Είμαστε εδώ για να απαντήσουμε σε κάθε σας απορία. Επικοινωνήστε μαζί μας
            μέσω της φόρμας ή των στοιχείων παρακάτω.
          </p>
        </div>
      </section>

      {/* ── Contact Info Cards (overlapping hero) ── */}
      <section className="container mx-auto px-4 -mt-10 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {contactInfo.map((info, idx) => (
            <a
              key={idx}
              href={info.href}
              target={idx === 0 ? "_blank" : undefined}
              rel={idx === 0 ? "noopener noreferrer" : undefined}
              className="group bg-white rounded-2xl p-6 shadow-xl shadow-slate-900/5 flex items-start gap-4 border border-slate-100 hover:border-slate-200 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${info.accent} flex items-center justify-center text-white shadow-lg shrink-0`}
              >
                <info.icon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 mb-1">
                  {info.title}
                </p>
                <p className="font-bold text-slate-900 group-hover:text-primary transition-colors">
                  {info.content}
                </p>
                <p className="text-slate-500 text-sm mt-0.5 truncate">{info.subContent}</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ── Main Content ── */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* ── Sidebar ── */}
            <div className="lg:col-span-1 space-y-6 order-2 lg:order-1">
              {/* Schedule card */}
              <div className="bg-slate-900 rounded-3xl p-7 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full" />
                <div className="relative z-10">
                  <div className="flex items-center gap-2.5 mb-6">
                    <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                      <Clock className="w-4 h-4 text-blue-300" />
                    </div>
                    <h3 className="text-base font-bold">Ώρες Γραμματείας</h3>
                  </div>
                  <div className="space-y-4">
                    {schedule.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center border-b border-white/10 pb-3 last:border-0 last:pb-0"
                      >
                        <span className="text-white/50 text-sm">{item.day}</span>
                        <span className={`text-sm font-bold ${item.hours === "Κλειστά" ? "text-slate-500" : "text-white"}`}>
                          {item.hours}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick contact CTA */}
              <div className="bg-gradient-to-br from-primary/[0.06] to-primary/[0.02] rounded-2xl p-6 border border-primary/10">
                <h4 className="font-bold text-slate-900 mb-2">Προτιμάτε τηλεφωνικά;</h4>
                <p className="text-sm text-slate-500 mb-4 leading-relaxed">
                  Καλέστε μας απευθείας και θα σας εξυπηρετήσουμε άμεσα.
                </p>
                <a
                  href="tel:2102448542"
                  className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors shadow-md shadow-primary/20"
                >
                  <Phone className="w-4 h-4" />
                  210 2448542
                </a>
              </div>
            </div>

            {/* ── Form Column ── */}
            <div className="lg:col-span-2 order-1 lg:order-2">
              <div className="bg-white rounded-3xl p-7 sm:p-10 md:p-12 shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
                {/* Subtle accent line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-primary to-indigo-500" />

                {isSubmitted ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-100">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 mb-4">
                      Ευχαριστούμε!
                    </h2>
                    <p className="text-slate-500 text-lg mb-8 max-w-md mx-auto">
                      Το μήνυμά σας στάλθηκε με επιτυχία. Θα επικοινωνήσουμε μαζί σας το
                      συντομότερο δυνατό.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => setIsSubmitted(false)}
                      className="rounded-xl px-8 h-12 border-slate-200 hover:border-primary hover:text-primary"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Αποστολή νέου μηνύματος
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="mb-10">
                      <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">
                        Στείλτε μας ένα μήνυμα
                      </h2>
                      <p className="text-slate-500">
                        Συμπληρώστε την παρακάτω φόρμα και θα σας απαντήσουμε εντός 24 ωρών.
                      </p>
                    </div>

                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-slate-700 font-bold text-xs uppercase tracking-wider">
                                  Ονοματεπώνυμο
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="π.χ. Ιωάννης Παπαδόπουλος"
                                    className="rounded-xl border-slate-200 h-12 bg-slate-50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                                    {...field}
                                  />
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
                                <FormLabel className="text-slate-700 font-bold text-xs uppercase tracking-wider">
                                  Email
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="π.χ. info@example.gr"
                                    className="rounded-xl border-slate-200 h-12 bg-slate-50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
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
                          name="subject"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-slate-700 font-bold text-xs uppercase tracking-wider">
                                Θέμα
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Πώς μπορούμε να βοηθήσουμε;"
                                  className="rounded-xl border-slate-200 h-12 bg-slate-50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                                  {...field}
                                />
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
                              <FormLabel className="text-slate-700 font-bold text-xs uppercase tracking-wider">
                                Μήνυμα
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Περιγράψτε το μήνυμά σας..."
                                  className="min-h-[140px] rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button
                          type="submit"
                          className="w-full bg-primary hover:bg-primary/90 text-white h-14 rounded-xl text-base font-bold group shadow-lg shadow-primary/20 transition-all"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            "Αποστολή..."
                          ) : (
                            <>
                              Αποστολή Μηνύματος
                              <Send className="w-4 h-4 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </>
                          )}
                        </Button>
                      </form>
                    </Form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Map Section (full-bleed) ── */}
      <section className="relative">
        {/* Top gradient fade */}
        <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-white to-transparent z-10 pointer-events-none" />
        <div className="h-[400px] md:h-[500px] relative">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3138.167237070104!2d23.754162976767472!3d38.11874287189912!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14a1a3bf604753ad%3A0x6b4028e9323c14!2zzpvOtc-Jz4YuIM6Yz4HOsc66zr_OvM6xzrrOtc60z4zOvc-Jzr0gOTcsIM6Rz4fOsc-Bzr3Orc-CIDEzNiA3Mg!5e0!3m2!1sel!2sgr!4v1716820000000!5m2!1sel!2sgr"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-3xl">
            <div className="absolute inset-0 hero-gradient" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-900/20 blur-3xl rounded-full" />
            <div className="relative z-10 p-8 sm:p-12 md:p-16 text-center text-white max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight">
                Θέλετε να ξεκινήσετε το ταξίδι σας μαζί μας;
              </h2>
              <p className="text-lg text-blue-100/80 mb-10">
                Κλείστε ένα ραντεβού για ενημέρωση και ανακαλύψτε πώς μπορούμε να
                βοηθήσουμε στην επίτευξη των στόχων σας.
              </p>
              <Button
                size="lg"
                asChild
                className="bg-white text-primary hover:bg-white/90 rounded-xl px-10 h-14 text-lg font-bold shadow-xl shadow-black/20"
              >
                <a href="tel:2102448542">
                  Κλείστε Ραντεβού
                  <ArrowRight className="w-5 h-5 ml-2" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
