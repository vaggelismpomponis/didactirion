import { Suspense } from "react";
import type { Metadata } from "next";
import { Info, ExternalLink, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createPageMetadata } from "@/lib/seo";
import { getPageContent, mergeContent } from "@/lib/page-content";
import { ExamsPreviewSync } from "./ExamsPreviewSync";
import { ScrollReveal } from "@/components/providers/ScrollReveal";
import { Editable } from "@/components/admin/Editable";

export const examsDefaults: Record<string, any> = {
  "panhellenic": {
    title: "Πανελλαδικές Εξετάσεις",
    description: "Ο οδηγός σας για τις κρισιμότερες εξετάσεις της μαθητικής ζωής.",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=2070",
    content: `Οι Πανελλαδικές Εξετάσεις αποτελούν τον τελικό σταθμό της προετοιμασίας των μαθητών μας. Παρέχουμε αναλυτικές πληροφορίες για το πρόγραμμα, την ύλη, τις βάσεις και τις σχολές.`,
    links: [
      { label: "Υπουργείο Παιδείας", url: "https://minedu.gov.gr" },
      { label: "Μηχανογραφικό Δελτίο", url: "#" },
    ],
    sections: [],
  },
  "question-bank": {
    title: "Τράπεζα Θεμάτων",
    description: "Πρόσβαση και ανάλυση των θεμάτων από το ΙΕΠ.",
    image: "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?q=80&w=2070",
    content: `Η Τράπεζα Θεμάτων είναι πλέον βασικό μέρος της εξεταστικής διαδικασίας. Στο φροντιστήριό μας, έχουμε κατηγοριοποιήσει και αναλύσει όλα τα θέματα ανά μάθημα και κεφάλαιο.`,
    features: ["Λυμένες ασκήσεις", "SOS θέματα", "Προσομοιώσεις"],
    links: [
      { label: "Επίσημη Ιστοσελίδα (ΙΕΠ)", url: "https://trapeza.iep.edu.gr/" },
    ],
    sections: [],
  },
  "oefe": {
    title: "Θέματα ΟΕΦΕ",
    description: "Τα διαγωνίσματα της Ομοσπονδίας Εκπαιδευτικών Φροντιστών Ελλάδος.",
    image: "https://images.unsplash.com/photo-1517842645767-c639042777db?q=80&w=2070",
    content: `Τα θέματα της ΟΕΦΕ αποτελούν το υψηλότερο επίπεδο προσομοίωσης για τις Πανελλαδικές. Εδώ θα βρείτε αρχεία θεμάτων και απαντήσεων των τελευταίων ετών.`,
    downloads: [
      { name: "Θέματα 2025", type: "PDF" },
      { name: "Θέματα 2024", type: "PDF" },
    ],
    sections: [],
  },
  "career-guide": {
    title: "Οδηγός Σταδιοδρομίας",
    description: "Ένας πλήρης ψηφιακός οδηγός για το μέλλον των μαθητών μας.",
    image: "https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?q=80&w=2070",
    content: `Ο Οδηγός Σταδιοδρομίας του Διδακτήριον είναι μια ολοκληρωμένη ψηφιακή πλατφόρμα (με περιεχόμενο άνω των 2GB) που καλύπτει κάθε πτυχή της εκπαιδευτικής και επαγγελματικής πορείας.`,
    sections: [
      { title: "Σπουδές στην Ελλάδα & Εξωτερικό", text: "Αναλυτικές πληροφορίες για όλα τα τμήματα και τις προοπτικές τους." },
      { title: "Επαγγελματικά Δικαιώματα", text: "Τι μπορείτε να κάνετε μετά το πτυχίο σας." },
      { title: "Μεταπτυχιακά", text: "Οδηγός για τη συνέχιση των σπουδών σας." },
    ],
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const defaults = examsDefaults[slug];
  if (!defaults) return { title: "Εξετάσεις" };
  return createPageMetadata({
    title: defaults.title,
    description: defaults.description,
    path: `/exams/${slug}`,
  });
}

export default async function ExamPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const defaults = examsDefaults[slug];
  if (!defaults) notFound();

  const dbContent = await getPageContent(`exams/${slug}`);
  const data = mergeContent(defaults, dbContent);

  return (
    <Suspense fallback={null}>
    <div className="flex flex-col">
      <ExamsPreviewSync pageKey={`exams/${slug}`} slug={slug} />

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

      {/* ── Content ── */}
      <section className="container mx-auto px-4 py-12 sm:py-16 pb-20">
        <div className="max-w-4xl mx-auto space-y-12">
          <ScrollReveal>
            <div className="bg-white p-6 sm:p-8 md:p-12 rounded-3xl border border-slate-100 shadow-sm space-y-8">
              <div className="prose prose-slate max-w-none">
                <h2 className="text-2xl font-black text-slate-900">Πληροφορίες & Οδηγός</h2>
                <p className="text-lg text-slate-600 leading-relaxed"><Editable id="content" multiline>{data.content}</Editable></p>
              </div>

              {data.sections && data.sections.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t border-slate-100">
                  {data.sections.map((section: any, i: number) => (
                    <div key={i} className="p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-primary/30 hover:bg-primary/5 transition-all space-y-2">
                      <h4 className="font-bold text-slate-900 flex items-center gap-2">
                        <Info className="w-4 h-4 text-primary" /> <Editable id={`sections_${i}_title`}>{section.title}</Editable>
                      </h4>
                      <p className="text-slate-500 text-sm"><Editable id={`sections_${i}_text`}>{section.text}</Editable></p>
                    </div>
                  ))}
                </div>
              )}

              {data.links && data.links.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-8 border-t border-slate-100">
                  {data.links.map((link: any, i: number) => (
                    <Button key={i} variant="outline" asChild className="justify-between h-14 rounded-2xl border-slate-200 hover:border-primary/30 hover:bg-primary/5 transition-all">
                      <a href={link.url} target="_blank" rel="noopener noreferrer">
                        <Editable id={`links_${i}_label`}>{link.label}</Editable> <ExternalLink className="w-4 h-4 text-slate-400" />
                      </a>
                    </Button>
                  ))}
                </div>
              )}

              {data.downloads && data.downloads.length > 0 && (
                <div className="space-y-3 pt-8 border-t border-slate-100">
                  <h4 className="font-black text-slate-900 mb-4">Αρχεία για Λήψη</h4>
                  {data.downloads.map((doc: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-primary/20 hover:bg-primary/5 hover:shadow-md transition-all duration-300 group">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-red-500 border border-slate-100 shadow-sm">
                          <span className="text-xs font-bold">{doc.type}</span>
                        </div>
                        <span className="font-semibold text-slate-700 group-hover:text-primary transition-colors"><Editable id={`downloads_${i}_name`}>{doc.name}</Editable></span>
                      </div>
                      <Button size="sm" variant="ghost" className="text-primary hover:text-primary/80 hover:bg-primary/5">
                        <Download className="w-4 h-4 mr-2" /> Λήψη
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </ScrollReveal>

          {/* ── CTA ── */}
          <ScrollReveal>
            <div className="relative overflow-hidden rounded-3xl">
              <div className="absolute inset-0 hero-gradient" />
              <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-white/10 pointer-events-none" />
              <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-white/5 blur-2xl pointer-events-none" />
              <div className="relative p-6 sm:p-8 md:p-12 text-white text-center space-y-6">
                <h2 className="text-3xl md:text-4xl font-black"><Editable id="cta_heading">Χρειάζεστε περισσότερη ενημέρωση;</Editable></h2>
                <p className="text-blue-100/80 max-w-xl mx-auto leading-relaxed">
                  <Editable id="cta_text" multiline>Η ομάδα μας είναι στη διάθεσή σας για να σας καθοδηγήσει σε κάθε βήμα της προετοιμασίας σας.</Editable>
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
                  <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 font-bold px-10 h-14 shadow-xl shadow-black/20">
                    <Link href="/contact">Επικοινωνία</Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="border-white/60 text-white hover:text-white bg-white/10 hover:bg-white/20 font-bold px-10 h-14">
                    <Link href="/points-calculator">Υπολογισμός Μορίων</Link>
                  </Button>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
    </Suspense>
  );
}
