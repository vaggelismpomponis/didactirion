"use client";
import * as React from "react";
import { User, GraduationCap, Mail } from "lucide-react";
import { PreviewListener } from "@/components/admin/PreviewListener";
import { mergeContent } from "@/lib/content-utils";
import { defaultTeachersHeaderContent } from "./teachers-header-content";
import { Editable } from "@/components/admin/Editable";
import { parseMarkdownToHtml } from "@/lib/markdown";

type TeachersHeaderContent = typeof defaultTeachersHeaderContent;
type Teacher = {
  id: string;
  name: string;
  specialty: string;
  bio: string;
  photo: string | null;
};

export function TeachersPageClient({
  teachers,
  initialContent,
}: {
  teachers: Teacher[];
  initialContent: TeachersHeaderContent;
}) {
  const [content, setContent] = React.useState<TeachersHeaderContent>(initialContent);

  const handlePreviewUpdate = React.useCallback((override: Record<string, any>) => {
    setContent(mergeContent(defaultTeachersHeaderContent, override) as TeachersHeaderContent);
  }, []);

  return (
    <div className="flex flex-col">
      <PreviewListener pageKey="teachers-header" onContentUpdate={handlePreviewUpdate} />

      {/* ── Hero ── */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute -top-24 -right-24 w-[400px] h-[400px] rounded-full bg-white/5 blur-3xl pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10 text-white text-center flex flex-col items-center justify-center">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tight mb-5 leading-tight max-w-3xl mx-auto">
            <Editable id="hero_title">{content.hero_title}</Editable>
          </h1>
          <p className="text-xl text-blue-100/80 max-w-2xl leading-relaxed mx-auto">
            <Editable id="hero_subtitle" multiline>{content.hero_subtitle}</Editable>
          </p>
        </div>
      </section>

      {/* ── Teachers Grid ── */}
      <section className="container mx-auto px-4 py-16 pb-20">
        {teachers.length === 0 ? (
          <div className="py-32 text-center space-y-5">
            <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-300">
              <User className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-slate-600">Η λίστα ενημερώνεται</h3>
            <p className="text-slate-400 text-sm">Τα προφίλ των καθηγητών μας θα είναι διαθέσιμα σύντομα.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {teachers.map((teacher) => (
              <div
                key={teacher.id}
                className="group bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden h-full flex flex-col"
              >
                {/* Photo */}
                <div className="aspect-[4/5] relative overflow-hidden bg-slate-100">
                  {teacher.photo ? (
                    <img
                      src={teacher.photo}
                      alt={teacher.name}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 scale-105 group-hover:scale-100 transition-all duration-500"
                    />
                  ) : (
                    <div className="w-full h-full hero-gradient flex items-center justify-center text-white/30">
                      <User className="w-24 h-24" />
                    </div>
                  )}
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Name / specialty */}
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="text-lg font-black text-white leading-tight">{teacher.name}</h3>
                    {teacher.specialty && (
                      <p className="text-blue-300 font-bold text-xs mt-0.5">{teacher.specialty}</p>
                    )}
                  </div>
                </div>

                {/* Bio */}
                <div className="p-5 flex-grow">
                  {teacher.bio ? (
                    <div
                      dangerouslySetInnerHTML={{ __html: parseMarkdownToHtml(teacher.bio) }}
                      className="text-slate-500 text-sm leading-relaxed [&_p]:mb-0 [&_ul]:my-1 [&_ol]:my-1 [&_li]:text-sm [&_li]:text-slate-500"
                    />
                  ) : (
                    <p className="text-slate-500 text-sm leading-relaxed">
                      Εξειδικευμένος εκπαιδευτικός με πολυετή εμπειρία.
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Join the team CTA ── */}
      <section className="container mx-auto px-4 pb-20">
        <div className="relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800">
          <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-primary/20 to-transparent pointer-events-none" />
          <div className="relative p-6 sm:p-10 md:p-14 flex flex-col md:flex-row items-center gap-8">
            <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center shrink-0 text-white">
              <GraduationCap className="w-8 h-8" />
            </div>
            <div className="space-y-2 text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-black text-white">
                <Editable id="cta_title">{content.cta_title}</Editable>
              </h2>
              <p className="text-slate-400 leading-relaxed">
                <Editable id="cta_subtitle">{content.cta_subtitle}</Editable>{" "}
                <a
                  href={`mailto:${content.cta_email}`}
                  className="text-blue-400 hover:text-blue-300 transition-colors underline"
                >
                  <Editable id="cta_email">{content.cta_email}</Editable>
                </a>
              </p>
            </div>
            <a
              href={`mailto:${content.cta_email}`}
              className="flex items-center gap-2 bg-white text-primary font-bold px-7 py-3.5 rounded-xl hover:bg-white/90 transition-all shadow-xl shrink-0"
            >
              <Mail className="w-4 h-4" /> <Editable id="cta_button">{content.cta_button}</Editable>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
