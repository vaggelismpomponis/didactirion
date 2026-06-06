"use client";

import * as React from "react";
import { GraduationCap, School, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ScrollReveal } from "@/components/providers/ScrollReveal";
import { PreviewListener } from "@/components/admin/PreviewListener";
import { mergeContent } from "@/lib/content-utils";
import { defaultSuccessHeaderContent } from "./success-header-content";
import { Editable } from "@/components/admin/Editable";

type SuccessHeaderContent = typeof defaultSuccessHeaderContent;
type SuccessStory = {
  id: string;
  name: string;
  university: string;
  faculty: string | null;
  year: number;
  photo: string | null;
};

export function SuccessStoriesPageClient({
  stories,
  initialContent,
}: {
  stories: SuccessStory[];
  initialContent: SuccessHeaderContent;
}) {
  const [content, setContent] = React.useState<SuccessHeaderContent>(initialContent);

  const handlePreviewUpdate = React.useCallback((override: Record<string, any>) => {
    setContent(mergeContent(defaultSuccessHeaderContent, override) as SuccessHeaderContent);
  }, []);

  const years = Array.from(new Set(stories.map(s => s.year))).sort((a, b) => b - a);

  return (
    <div className="flex flex-col">
      <PreviewListener pageKey="success-header" onContentUpdate={handlePreviewUpdate} />

      {/* ── Hero ── */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute -top-24 -right-24 w-[450px] h-[450px] rounded-full bg-white/5 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-white/5 blur-3xl pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10 text-white text-center flex flex-col items-center justify-center">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tight mb-5 leading-tight max-w-3xl mx-auto">
            <Editable id="hero_title">{content.hero_title}</Editable>
          </h1>
          <p className="text-xl text-blue-100/80 max-w-2xl leading-relaxed mx-auto">
            <Editable id="hero_subtitle" multiline>{content.hero_subtitle}</Editable>
          </p>
        </div>
      </section>

      {/* ── Success Stories by Year ── */}
      <section className="container mx-auto px-4 py-16 pb-20">
        {years.length === 0 ? (
          <div className="py-32 text-center space-y-5">
            <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-300">
              <School className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-slate-600">Η λίστα ενημερώνεται</h3>
            <p className="text-slate-400 text-sm">Η λίστα των επιτυχόντων θα ενημερωθεί σύντομα.</p>
          </div>
        ) : (
          <div className="space-y-16">
            {years.map((year, yearIdx) => (
              <ScrollReveal key={year} delay={yearIdx * 0.05}>
                <div className="space-y-8">
                  <div className="flex items-center gap-4">
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900">{year}</h2>
                    <div className="h-px bg-slate-200 flex-grow" />
                    <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5 hidden sm:inline-flex font-bold">
                      Έτος Επιτυχίας
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {stories
                      .filter((s) => s.year === year)
                      .map((story, i) => (
                        <ScrollReveal key={story.id} delay={i * 0.05}>
                          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-start gap-4">
                            <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center text-primary shrink-0">
                              <GraduationCap className="w-6 h-6" />
                            </div>
                            <div className="space-y-1">
                              <h4 className="font-bold text-slate-900">{story.name}</h4>
                              <p className="text-sm font-semibold text-primary">{story.university}</p>
                              <p className="text-xs text-slate-500">{story.faculty}</p>
                            </div>
                          </div>
                        </ScrollReveal>
                      ))}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        )}
      </section>

      {/* ── CTA Section ── */}
      <section className="container mx-auto px-4 pb-20">
        <ScrollReveal>
          <div className="relative overflow-hidden rounded-3xl">
            <div className="absolute inset-0 hero-gradient" />
            <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-white/10 pointer-events-none" />
            <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-white/5 blur-2xl pointer-events-none" />
            <div className="relative p-6 sm:p-10 md:p-14 text-white flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-3 text-center md:text-left">
                <h2 className="text-3xl md:text-4xl font-black">
                  <Editable id="cta_title">{content.cta_title}</Editable>
                </h2>
                <p className="text-blue-100/80 max-w-xl leading-relaxed">
                  <Editable id="cta_subtitle" multiline>{content.cta_subtitle}</Editable>
                </p>
              </div>
              <Button
                asChild
                size="lg"
                className="bg-white text-primary hover:bg-white/90 font-bold px-8 shadow-xl shadow-black/20 shrink-0"
                style={{ height: "3.25rem" }}
              >
                <Link href="/contact" className="flex items-center gap-2">
                  <Editable id="cta_button">{content.cta_button}</Editable> <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
