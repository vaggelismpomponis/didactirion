export const revalidate = 3600;

import { Suspense } from "react";
import type { Metadata } from "next";
import { CheckCircle2, GraduationCap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createPageMetadata } from "@/lib/seo";
import { getPageContent, mergeContent } from "@/lib/page-content";
import { CurriculaPreviewSync } from "./CurriculaPreviewSync";
import { ScrollReveal } from "@/components/providers/ScrollReveal";
import { Editable } from "@/components/admin/Editable";

export const curriculaDefaults: Record<string, any> = {
  "junior-high": {
    title: "Γυμνάσιο",
    description: "Θέτουμε τις βάσεις για μια επιτυχημένη πορεία στο Λύκειο.",
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2070",
    features: [
      "Ολιγομελή τμήματα (4-5 άτομα)",
      "Εξειδικευμένοι καθηγητές",
      "Συνεχή διαγωνίσματα",
      "Ενισχυτική διδασκαλία",
    ],
    details:
      "Το πρόγραμμα σπουδών για το Γυμνάσιο επικεντρώνεται στην εμπέδωση των βασικών εννοιών στα Μαθηματικά, τη Γλώσσα και τις Φυσικές Επιστήμες.",
    subjects: [
      { grade: "Α' Γυμνασίου", items: ["Νεοελληνική Γλώσσα (2 ώρες)", "Αρχαία Ελληνικά (2 ώρες)", "Μαθηματικά (2 ώρες)"] },
      { grade: "Β' Γυμνασίου", items: ["Νεοελληνική Γλώσσα (2 ώρες)", "Αρχαία Ελληνικά (2 ώρες)", "Μαθηματικά (2 ώρες)", "Φυσική (1 ώρα)"] },
      { grade: "Γ' Γυμνασίου", items: ["Νεοελληνική Γλώσσα (2 ώρες)", "Αρχαία Ελληνικά (2 ώρες)", "Μαθηματικά (2 ώρες)", "Φυσική (1 ώρα)", "Χημεία (1 ώρα)"] },
    ],
  },
  "high-school": {
    title: "Λύκειο (Α, Β, Γ)",
    description: "Εξειδικευμένη προετοιμασία για τις Πανελλαδικές Εξετάσεις.",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=2070",
    features: [
      "Πλήρης κάλυψη ύλης",
      "Τεστ προσομοίωσης",
      "Συμβουλευτική σταδιοδρομίας",
      "Εξατομικευμένο πρόγραμμα μελέτης",
    ],
    details: "Στο Λύκειο, η προετοιμασία γίνεται μεθοδικά και συστηματικά για όλες τις κατευθύνσεις.",
    subjects: [
      { grade: "Α' Λυκείου", items: ["Νεοελληνική Γλώσσα (3 ώρες)", "Αρχαία Ελληνικά (2 ώρες)", "Άλγεβρα (3 ώρες)", "Γεωμετρία (2 ώρες)", "Φυσική (2 ώρες)", "Χημεία (1 ώρα)"] },
      { grade: "Β' Λυκείου (Γενική)", items: ["Νεοελληνική Γλώσσα (3 ώρες)", "Άλγεβρα (2 ώρες)", "Γεωμετρία (2 ώρες)", "Φυσική (2 ώρες)"] },
      { grade: "Γ' Λυκείου (Προσανατολισμός)", items: ["Ανθρωπιστικές: Αρχαία (6), Ιστορία (4), Λατινικά (4)", "Θετικές: Μαθηματικά (6), Φυσική (4), Χημεία (4)", "Οικονομίας: Μαθηματικά (6), Πληροφορική (4), Οικονομία (4)"] },
    ],
  },
  "epal": {
    title: "ΕΠΑΛ",
    description: "Εξειδικευμένα τμήματα για μαθητές Επαγγελματικών Λυκείων.",
    image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?q=80&w=2070",
    features: [
      "Μαθήματα Γενικής Παιδείας",
      "Μαθήματα Ειδικότητας",
      "Στοχευμένη προετοιμασία",
      "Ειδικά βοηθήματα",
    ],
    details:
      "Παρέχουμε ολοκληρωμένη στήριξη στους μαθητές των ΕΠΑΛ, καλύπτοντας τόσο τα μαθήματα γενικής παιδείας όσο και τα μαθήματα ειδικότητας.",
  },
  "alumni": {
    title: "Απόφοιτοι",
    description: "Τμήματα αποκλειστικά για αποφοίτους για μια δεύτερη ευκαιρία στην επιτυχία.",
    image: "https://images.unsplash.com/photo-1523050335392-9bef867a0578?q=80&w=2072",
    features: [
      "Πρωινά τμήματα",
      "Εστίαση στις αδυναμίες",
      "Εντατικοί ρυθμοί",
      "Ψυχολογική υποστήριξη",
    ],
    details:
      "Για τους αποφοίτους που επιθυμούν να ξαναδώσουν εξετάσεις, προσφέρουμε ένα εντατικό και στοχευμένο πρόγραμμα.",
  },
  "model-schools": {
    title: "Πρότυπα Σχολεία",
    description: "Προετοιμασία για την εισαγωγή σε Πρότυπα και Πειραματικά Σχολεία.",
    image: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=2071",
    features: [
      "Ειδικά τεστ δεξιοτήτων",
      "Προετοιμασία Γλώσσας & Μαθηματικών",
      "Προσομοιώσεις εξετάσεων",
      "Μικρές ομάδες εργασίας",
    ],
    details:
      "Η εισαγωγή στα Πρότυπα σχολεία απαιτεί ιδιαίτερη προετοιμασία. Το πρόγραμμά μας βοηθά τους μαθητές της ΣΤ' Δημοτικού και της Γ' Γυμνασίου να αναπτύξουν τις απαραίτητες δεξιότητες.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const defaults = curriculaDefaults[slug];
  if (!defaults) return { title: "Πρόγραμμα Σπουδών" };
  return createPageMetadata({
    title: defaults.title,
    description: defaults.description,
    path: `/curricula/${slug}`,
  });
}

export default async function CurriculumPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const defaults = curriculaDefaults[slug];
  if (!defaults) notFound();

  const dbContent = await getPageContent(`curricula/${slug}`);
  const data = mergeContent(defaults, dbContent);

  return (
    <Suspense fallback={null}>
      <div className="flex flex-col">
        <CurriculaPreviewSync pageKey={`curricula/${slug}`} slug={slug} initialData={data} defaults={defaults} />
        <CurriculumView data={data} slug={slug} />
      </div>
    </Suspense>
  );
}

function CurriculumView({ data, slug }: { data: any; slug: string }) {
  return (
    <>
      {/* ── Hero ── */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute -top-24 -right-24 w-[450px] h-[450px] rounded-full bg-white/5 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-white/5 blur-3xl pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10 text-white text-center flex flex-col items-center justify-center">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tight mb-5 leading-tight max-w-3xl mx-auto">
            <Editable id="title">{data.title}</Editable>
          </h1>
          <p className="text-xl text-blue-100/80 max-w-2xl leading-relaxed mx-auto">
            <Editable id="description" multiline>{data.description}</Editable>
          </p>
        </div>
      </section>

      {/* ── Main Content ── */}
      <section className="container mx-auto px-4 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          <div className="lg:col-span-2 space-y-8 order-1">
            <ScrollReveal>
              <div className="prose prose-slate max-w-none">
                <h2 className="text-3xl font-black text-slate-900 mb-6">Πληροφορίες Προγράμματος</h2>
                <p className="text-lg text-slate-600 leading-relaxed"><Editable id="details" multiline>{data.details}</Editable></p>
              </div>
            </ScrollReveal>

            {data.subjects && (
              <ScrollReveal>
                <div className="mt-12 space-y-8">
                  <h3 className="text-2xl font-black text-slate-900">Πρόγραμμα Μαθημάτων</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {data.subjects.map((group: any, i: number) => (
                      <ScrollReveal key={i} delay={i * 0.08}>
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:border-primary/20 transition-all duration-300">
                          <h4 className="font-bold text-primary mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 bg-primary rounded-full" />
                            <Editable id={`subjects_${i}_grade`}>{group.grade}</Editable>
                          </h4>
                          <ul className="space-y-2">
                            {(Array.isArray(group.items) ? group.items : []).map((item: string, j: number) => (
                              <li key={j} className="text-slate-600 text-sm flex items-center gap-2">
                                <ArrowRight className="w-3 h-3 text-slate-400" />
                                <Editable id={`subjects_${i}_item_${j}`}>{item}</Editable>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </ScrollReveal>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            )}

            <ScrollReveal>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-8">
                {(Array.isArray(data.features) ? data.features : []).map((feature: any, i: number) => {
                  const text = typeof feature === "object" ? feature.text : feature;
                  return (
                    <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300">
                      <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" />
                      <span className="font-bold text-slate-900"><Editable id={`features_${i}`}>{text}</Editable></span>
                    </div>
                  );
                })}
              </div>
            </ScrollReveal>
          </div>

          {/* ── Sidebar ── */}
          <div className="space-y-6 order-2">
            <ScrollReveal>
              <div className="relative overflow-hidden rounded-3xl shadow-xl">
                <div className="absolute inset-0 hero-gradient" />
                <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-white/10 pointer-events-none" />
                <div className="relative p-8 text-white">
                  <GraduationCap className="w-12 h-12 mb-6" />
                  <h3 className="text-2xl font-black mb-4">Ενδιαφέρεστε;</h3>
                  <p className="text-blue-100/80 mb-8 leading-relaxed">
                    Κλείστε ένα ραντεβού για να συζητήσουμε τις ανάγκες σας και να βρούμε το ιδανικό πρόγραμμα.
                  </p>
                  <Button asChild className="w-full bg-white text-primary hover:bg-white/90 font-bold h-12 shadow-lg">
                    <Link href="/contact">Επικοινωνία</Link>
                  </Button>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <h4 className="font-black text-slate-900 mb-4">Άλλα Προγράμματα</h4>
                <ul className="space-y-3">
                  {Object.keys(curriculaDefaults)
                    .filter((s) => s !== slug)
                    .map((s) => (
                      <li key={s}>
                        <Link
                          href={`/curricula/${s}`}
                          className="flex items-center justify-between text-slate-600 hover:text-primary font-medium transition-colors p-2 rounded-xl hover:bg-primary/5"
                        >
                          {curriculaDefaults[s].title}
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </li>
                    ))}
                </ul>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="container mx-auto px-4 pb-20">
        <ScrollReveal>
          <div className="relative overflow-hidden rounded-3xl">
            <div className="absolute inset-0 hero-gradient" />
            <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-white/10 pointer-events-none" />
            <div className="relative p-6 sm:p-10 md:p-14 text-white flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-3 text-center md:text-left">
                <h2 className="text-3xl md:text-4xl font-black"><Editable id="cta_title">Ξεκινήστε σήμερα!</Editable></h2>
                <p className="text-blue-100/80 max-w-xl leading-relaxed">
                  <Editable id="cta_subtitle" multiline>Επικοινωνήστε μαζί μας για να σχεδιάσουμε μαζί το εκπαιδευτικό σας μέλλον.</Editable>
                </p>
              </div>
              <Button
                asChild
                size="lg"
                className="bg-white text-primary hover:bg-white/90 font-bold px-8 shadow-xl shadow-black/20 shrink-0"
                style={{ height: "3.25rem" }}
              >
                <Link href="/contact" className="flex items-center gap-2">
                  Εγγραφή Τώρα <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </>
  );
}
