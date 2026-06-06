"use client";

import * as React from "react";
import { Lock, Eye, Database, Globe, Cookie, Handshake, Info } from "lucide-react";
import { PreviewListener } from "@/components/admin/PreviewListener";
import { mergeContent } from "@/lib/content-utils";
import { defaultPrivacyContent } from "./privacy-content";
import { Editable } from "@/components/admin/Editable";

type PrivacyContent = typeof defaultPrivacyContent;

export function PrivacyPolicyClient({ initialContent }: { initialContent: PrivacyContent }) {
  const [content, setContent] = React.useState<PrivacyContent>(initialContent);

  const handlePreviewUpdate = React.useCallback((override: Record<string, any>) => {
    setContent(mergeContent(defaultPrivacyContent, override) as PrivacyContent);
  }, []);

  const items = [
    { title: content.sec2_item1_title, desc: content.sec2_item1_desc, id: 1 },
    { title: content.sec2_item2_title, desc: content.sec2_item2_desc, id: 2 },
    { title: content.sec2_item3_title, desc: content.sec2_item3_desc, id: 3 },
    { title: content.sec2_item4_title, desc: content.sec2_item4_desc, id: 4 },
    { title: content.sec2_item5_title, desc: content.sec2_item5_desc, id: 5 },
    { title: content.sec2_item6_title, desc: content.sec2_item6_desc, id: 6 },
  ];

  return (
    <div className="flex flex-col">
      <PreviewListener pageKey="privacy-policy" onContentUpdate={handlePreviewUpdate} />

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

      {/* ── Content ── */}
      <section className="container mx-auto px-4 py-12 sm:py-16 pb-20 max-w-5xl">
        <div className="bg-white p-6 sm:p-10 md:p-16 rounded-3xl border border-slate-100 shadow-sm space-y-12">
          
          {/* 1. What information */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-primary">
              <Database className="w-6 h-6" />
              <h2 className="text-2xl font-black text-slate-900">
                <Editable id="sec1_title">{content.sec1_title}</Editable>
              </h2>
            </div>
            <p className="text-slate-600 leading-relaxed">
              <Editable id="sec1_desc1" multiline>{content.sec1_desc1}</Editable>
            </p>
            <p className="text-slate-600 leading-relaxed">
              <Editable id="sec1_desc2" multiline>{content.sec1_desc2}</Editable>
            </p>
          </div>

          {/* 2. Why we use it */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-primary">
              <Info className="w-6 h-6" />
              <h2 className="text-2xl font-black text-slate-900">
                <Editable id="sec2_title">{content.sec2_title}</Editable>
              </h2>
            </div>
            <p className="text-slate-600 leading-relaxed">
              <Editable id="sec2_desc" multiline>{content.sec2_desc}</Editable>
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {items.map((item) => (
                <li key={item.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-primary/20 hover:bg-primary/5 transition-all flex flex-col gap-2">
                  <span className="font-bold text-slate-900">
                    <Editable id={`sec2_item${item.id}_title`}>{item.title}</Editable>
                  </span>
                  <span className="text-sm text-slate-500">
                    <Editable id={`sec2_item${item.id}_desc`}>{item.desc}</Editable>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Protection */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-primary">
              <Lock className="w-6 h-6" />
              <h2 className="text-2xl font-black text-slate-900">
                <Editable id="sec3_title">{content.sec3_title}</Editable>
              </h2>
            </div>
            <p className="text-slate-600 leading-relaxed">
              <Editable id="sec3_desc1" multiline>{content.sec3_desc1}</Editable>
            </p>
            <p className="text-slate-600 leading-relaxed bg-primary/5 p-6 rounded-2xl border border-primary/10">
              <Editable id="sec3_desc2" multiline>{content.sec3_desc2}</Editable>
            </p>
          </div>

          {/* 4. Cookies */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-primary">
              <Cookie className="w-6 h-6" />
              <h2 className="text-2xl font-black text-slate-900">
                <Editable id="sec4_title">{content.sec4_title}</Editable>
              </h2>
            </div>
            <p className="text-slate-600 leading-relaxed">
              <Editable id="sec4_desc1" multiline>{content.sec4_desc1}</Editable>
            </p>
            <p className="text-slate-600 leading-relaxed">
              <Editable id="sec4_desc2" multiline>{content.sec4_desc2}</Editable>
            </p>
          </div>

          {/* 5. Third Parties */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-primary">
              <Handshake className="w-6 h-6" />
              <h2 className="text-2xl font-black text-slate-900">
                <Editable id="sec5_title">{content.sec5_title}</Editable>
              </h2>
            </div>
            <p className="text-slate-600 leading-relaxed">
              <Editable id="sec5_desc1" multiline>{content.sec5_desc1}</Editable>
            </p>
            <p className="text-slate-600 leading-relaxed">
              <Editable id="sec5_desc2" multiline>{content.sec5_desc2}</Editable>
            </p>
          </div>

          {/* 6. Links & Online only */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-slate-100">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-primary">
                <Globe className="w-5 h-5" />
                <h3 className="font-black text-slate-900">
                  <Editable id="sec6_title">{content.sec6_title}</Editable>
                </h3>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">
                <Editable id="sec6_desc" multiline>{content.sec6_desc}</Editable>
              </p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-primary">
                <Eye className="w-5 h-5" />
                <h3 className="font-black text-slate-900">
                  <Editable id="sec7_title">{content.sec7_title}</Editable>
                </h3>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">
                <Editable id="sec7_desc" multiline>{content.sec7_desc}</Editable>
              </p>
            </div>
          </div>

          {/* 7. Consent */}
          <div className="pt-10 text-center border-t border-slate-100">
            <h2 className="text-2xl font-black text-slate-900 mb-4">
              <Editable id="consent_title">{content.consent_title}</Editable>
            </h2>
            <p className="text-slate-600 leading-relaxed mb-8">
              <Editable id="consent_desc" multiline>{content.consent_desc}</Editable>
            </p>
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-green-50 text-green-700 rounded-full font-bold text-sm border border-green-100">
              <Lock className="w-4 h-4" />
              <Editable id="consent_badge">{content.consent_badge}</Editable>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
