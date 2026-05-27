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
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: Phone,
    title: "Τηλέφωνο",
    content: "210 2448542",
    subContent: "Δευτέρα - Παρασκευή, 15:00 - 22:00",
    color: "bg-green-50 text-green-600",
  },
  {
    icon: Mail,
    title: "Email",
    content: "info@didactirion.gr",
    subContent: "Θα χαρούμε να σας εξυπηρετήσουμε",
    color: "bg-purple-50 text-purple-600",
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
        <div className="container mx-auto px-4 relative z-10 text-white">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
            Επικοινωνία
          </h1>
          <p className="text-xl text-blue-100/80 max-w-2xl leading-relaxed">
            Είμαστε εδώ για να απαντήσουμε σε κάθε σας απορία. Επικοινωνήστε μαζί μας
            μέσω της φόρμας ή των στοιχείων παρακάτω.
          </p>
        </div>
      </section>

      <section className="py-20 -mt-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Info Column */}
            <div className="lg:col-span-1 space-y-6">
              {contactInfo.map((info, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-6 shadow-xl shadow-blue-900/5 flex items-start gap-4 border border-slate-100 hover:border-primary/20 transition-colors"
                >
                  <div className={`p-3 rounded-xl ${info.color}`}>
                    <info.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">{info.title}</h3>
                    <p className="text-slate-900 font-medium">{info.content}</p>
                    <p className="text-slate-500 text-sm mt-0.5">{info.subContent}</p>
                  </div>
                </div>
              ))}

              <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full" />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-6">
                    <Clock className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-bold">Ώρες Γραμματείας</h3>
                  </div>
                  <div className="space-y-4">
                    {schedule.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center border-b border-white/10 pb-3 last:border-0 last:pb-0"
                      >
                        <span className="text-white/60">{item.day}</span>
                        <span className="font-medium">{item.hours}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Form Column */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl shadow-blue-900/5 border border-slate-100">
                {isSubmitted ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-4">
                      Ευχαριστούμε!
                    </h2>
                    <p className="text-slate-600 text-lg mb-8">
                      Το μήνυμά σας στάλθηκε με επιτυχία. Θα επικοινωνήσουμε μαζί σας το
                      συντομότερο δυνατό.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => setIsSubmitted(false)}
                      className="rounded-full px-8"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Αποστολή νέου μηνύματος
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="mb-10">
                      <h2 className="text-3xl font-bold text-slate-900 mb-2">
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Ονοματεπώνυμο</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="π.χ. Ιωάννης Παπαδόπουλος"
                                    className="rounded-xl border-slate-200 h-12 focus:ring-primary/20"
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
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="π.χ. info@example.gr"
                                    className="rounded-xl border-slate-200 h-12 focus:ring-primary/20"
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
                              <FormLabel>Θέμα</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Πώς μπορούμε να βοηθήσουμε;"
                                  className="rounded-xl border-slate-200 h-12 focus:ring-primary/20"
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
                              <FormLabel>Μήνυμα</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Περιγράψτε το μήνυμά σας..."
                                  className="min-h-[150px] rounded-xl border-slate-200 focus:ring-primary/20"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button
                          type="submit"
                          className="w-full bg-primary hover:bg-primary/90 text-white h-14 rounded-xl text-lg font-bold group"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            "Αποστολή..."
                          ) : (
                            <>
                              Αποστολή Μηνύματος
                              <Send className="w-5 h-5 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
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

      {/* Map Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-3xl p-4 shadow-xl border border-slate-200 overflow-hidden h-[450px] relative">
             <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3138.834015840632!2d23.743135!3d38.085885!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14a1a384f603c9eb%3A0xe5a1b327b7b6c507!2zzp_Pgc6_zr3PhM65z4PPhM6uz4HOuc6_IM6UzrnOtM6xzrrPhM6uz4HOuc6_zr0!5e0!3m2!1sel!2sgr!4v1700000000000!5m2!1sel!2sgr"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded-2xl"
            />
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-primary rounded-[3rem] p-12 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-900/20 blur-3xl rounded-full" />
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight">
                Θέλετε να ξεκινήσετε το ταξίδι σας μαζί μας;
              </h2>
              <p className="text-lg text-blue-100/80 mb-10">
                Κλείστε ένα ραντεβού για ενημέρωση και ανακαλύψτε πώς μπορούμε να
                βοηθήσουμε στην επίτευξη των στόχων σας.
              </p>
              <Button size="lg" variant="secondary" className="rounded-full px-12 h-14 text-lg font-bold">
                Κλείστε Ραντεβού
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
