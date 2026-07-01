"use client";

import * as React from "react";
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
import { PreviewListener } from "@/components/admin/PreviewListener";
import { mergeContent } from "@/lib/content-utils";
import { defaultContactContent } from "./contact-content";
import { Editable } from "@/components/admin/Editable";

const formSchema = z.object({
  name: z.string().min(2, { message: "Το όνομα πρέπει να είναι τουλάχιστον 2 χαρακτήρες." }),
  email: z.string().email({ message: "Παρακαλώ εισάγετε ένα έγκυρο email." }),
  subject: z.string().min(5, { message: "Το θέμα πρέπει να είναι τουλάχιστον 5 χαρακτήρες." }),
  message: z.string().min(10, { message: "Το μήνυμα πρέπει να είναι τουλάχιστον 10 χαρακτήρες." }),
});

export function ContactPageClient({ initialContent }: { initialContent: typeof defaultContactContent }) {
  const [content, setContent] = React.useState<typeof defaultContactContent>(initialContent);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePreviewUpdate = React.useCallback((override: Record<string, any>) => {
    setContent(mergeContent(defaultContactContent, override) as typeof defaultContactContent);
  }, []);

  const isMonToFriSame = 
    content.hours_monday === content.hours_tuesday &&
    content.hours_tuesday === content.hours_wednesday &&
    content.hours_wednesday === content.hours_thursday &&
    content.hours_thursday === content.hours_friday;
    
  const computedPhoneSubContent = isMonToFriSame
    ? `Δευ-Παρ ${content.hours_monday}${content.hours_saturday !== "Κλειστά" ? `, Σάβ ${content.hours_saturday}` : ""}`
    : "Δείτε τις Ώρες Γραμματείας";

  const contactInfo = [
    {
      icon: MapPin,
      title: content.address_title,
      content: content.address_content,
      subContent: content.address_subContent,
      accent: "from-blue-500 to-blue-600",
      bgLight: "bg-blue-50",
      textColor: "text-blue-600",
      href: `https://www.google.com/maps/search/?api=1&query=Φροντιστήριο+Διδακτήριον+${encodeURIComponent(content.address_content)}+Αχαρναί`,
    },
    {
      icon: Phone,
      title: content.phone_title,
      content: content.phone_content,
      subContent: computedPhoneSubContent,
      accent: "from-emerald-500 to-emerald-600",
      bgLight: "bg-emerald-50",
      textColor: "text-emerald-600",
      href: `tel:${content.phone_content.replace(/\s+/g, "")}`,
    },
    {
      icon: Mail,
      title: content.email_title,
      content: content.email_content,
      subContent: content.email_subContent,
      accent: "from-violet-500 to-violet-600",
      bgLight: "bg-violet-50",
      textColor: "text-violet-600",
      href: `mailto:${content.email_content}`,
    },
  ];

  const schedule = [
    { id: "hours_monday", day: "Δευτέρα", hours: content.hours_monday },
    { id: "hours_tuesday", day: "Τρίτη", hours: content.hours_tuesday },
    { id: "hours_wednesday", day: "Τετάρτη", hours: content.hours_wednesday },
    { id: "hours_thursday", day: "Πέμπτη", hours: content.hours_thursday },
    { id: "hours_friday", day: "Παρασκευή", hours: content.hours_friday },
    { id: "hours_saturday", day: "Σάββατο", hours: content.hours_saturday },
    { id: "hours_sunday", day: "Κυριακή", hours: content.hours_sunday },
  ];

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
      <PreviewListener pageKey="contact" onContentUpdate={handlePreviewUpdate} />

      {/* ── Hero ── */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-500/10 blur-3xl rounded-full" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-primary/10 blur-[80px] pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10 text-white text-center flex flex-col items-center justify-center">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 mx-auto">
            <Editable id="hero_title">{content.hero_title}</Editable>
          </h1>
          <p className="text-xl text-blue-100/80 max-w-2xl leading-relaxed mx-auto">
            <Editable id="hero_subtitle" multiline>{content.hero_subtitle}</Editable>
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
                  <Editable id={idx === 0 ? "address_title" : idx === 1 ? "phone_title" : "email_title"}>{info.title}</Editable>
                </p>
                <p className="font-bold text-slate-900 group-hover:text-primary transition-colors">
                  <Editable id={idx === 0 ? "address_content" : idx === 1 ? "phone_content" : "email_content"}>{info.content}</Editable>
                </p>
                <p className="text-slate-500 text-sm mt-0.5 truncate">
                  {idx === 1 ? info.subContent : <Editable id={idx === 0 ? "address_subContent" : "email_subContent"}>{info.subContent}</Editable>}
                </p>
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
                    <h3 className="text-base font-bold">
                      <Editable id="office_hours_title">{content.office_hours_title}</Editable>
                    </h3>
                  </div>
                  <div className="space-y-4">
                    {schedule.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center border-b border-white/10 pb-3 last:border-0 last:pb-0"
                      >
                        <span className="text-white/50 text-sm">{item.day}</span>
                        <span className={`text-sm font-bold ${item.hours === "Κλειστά" ? "text-slate-500" : "text-white"}`}>
                          <Editable id={item.id}>{item.hours}</Editable>
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Asterisk note */}
                  <div className="mt-5 pt-3 border-t border-white/10 flex items-start gap-1.5 text-xs text-blue-200/70">
                    <span className="text-blue-300 font-bold shrink-0">*</span>
                    <p className="leading-relaxed">
                      Για απογευματινά ραντεβού παρακαλώ καλέστε μας!
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick contact CTA */}
              <div className="bg-gradient-to-br from-primary/[0.06] to-primary/[0.02] rounded-2xl p-6 border border-primary/10">
                <h4 className="font-bold text-slate-900 mb-2">
                  <Editable id="phone_cta_title">{content.phone_cta_title}</Editable>
                </h4>
                <p className="text-sm text-slate-500 mb-4 leading-relaxed">
                  <Editable id="phone_cta_desc" multiline>{content.phone_cta_desc}</Editable>
                </p>
                <a
                  href={`tel:${content.phone_content.replace(/\s+/g, "")}`}
                  className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors shadow-md shadow-primary/20"
                >
                  <Phone className="w-4 h-4" />
                  <Editable id="phone_content">{content.phone_content}</Editable>
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
                        <Editable id="form_title">{content.form_title}</Editable>
                      </h2>
                      <p className="text-slate-500">
                        <Editable id="form_desc">{content.form_desc}</Editable>
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
            src={content.map_iframe_url}
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
                <Editable id="bottom_cta_title">{content.bottom_cta_title}</Editable>
              </h2>
              <p className="text-lg text-blue-100/80 mb-10">
                <Editable id="bottom_cta_desc" multiline>{content.bottom_cta_desc}</Editable>
              </p>
              <Button
                size="lg"
                asChild
                className="bg-white text-primary hover:bg-white/90 rounded-xl px-10 h-14 text-lg font-bold shadow-xl shadow-black/20"
              >
                <a href={`tel:${content.phone_content.replace(/\s+/g, "")}`}>
                  <Editable id="bottom_cta_button">{content.bottom_cta_button}</Editable>
                  <ArrowRight className="w-5 h-5 ml-2 inline-block" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
