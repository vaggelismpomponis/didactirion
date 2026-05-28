import type { Metadata } from "next";
import { Info, ExternalLink, Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createPageMetadata } from "@/lib/seo";
import { getPageContent, mergeContent } from "@/lib/page-content";
import { ExamsPreviewSync } from "./ExamsPreviewSync";

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
    <div className="flex flex-col gap-12 pb-16">
      <ExamsPreviewSync pageKey={`exams/${slug}`} slug={slug} />

      <section className="bg-slate-900 text-white py-14 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src={data.image} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">
            {data.title}
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {data.description}
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="bg-white p-5 sm:p-8 md:p-12 rounded-none border border-slate-100 shadow-sm space-y-8">
            <div className="prose prose-slate max-w-none">
              <h2 className="text-2xl font-bold text-slate-900">Πληροφορίες & Οδηγός</h2>
              <p className="text-lg text-slate-600 leading-relaxed">{data.content}</p>
            </div>

            {data.sections && data.sections.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t">
                {data.sections.map((section: any, i: number) => (
                  <div key={i} className="space-y-2">
                    <h4 className="font-bold text-slate-900 flex items-center gap-2">
                      <Info className="w-4 h-4 text-[#004a99]" /> {section.title}
                    </h4>
                    <p className="text-slate-500 text-sm">{section.text}</p>
                  </div>
                ))}
              </div>
            )}

            {data.links && data.links.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-8 border-t">
                {data.links.map((link: any, i: number) => (
                  <Button key={i} variant="outline" asChild className="justify-between h-14 rounded-none border-slate-200">
                    <a href={link.url} target="_blank" rel="noopener noreferrer">
                      {link.label} <ExternalLink className="w-4 h-4 text-slate-400" />
                    </a>
                  </Button>
                ))}
              </div>
            )}

            {data.downloads && data.downloads.length > 0 && (
              <div className="space-y-3 pt-8 border-t">
                <h4 className="font-bold text-slate-900 mb-4">Αρχεία για Λήψη</h4>
                {data.downloads.map((doc: any, i: number) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-none border border-slate-200 hover:bg-slate-100 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-none flex items-center justify-center text-red-500 border">
                        <span className="text-xs font-bold">{doc.type}</span>
                      </div>
                      <span className="font-semibold text-slate-700">{doc.name}</span>
                    </div>
                    <Button size="sm" variant="ghost" className="text-blue-600 hover:text-blue-700">
                      <Download className="w-4 h-4 mr-2" /> Λήψη
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-[#004a99] rounded-none p-6 sm:p-8 md:p-12 text-white text-center space-y-6 shadow-xl">
            <h2 className="text-3xl font-bold">Χρειάζεστε περισσότερη ενημέρωση;</h2>
            <p className="text-blue-100 max-w-xl mx-auto">
              Η ομάδα μας είναι στη διάθεσή σας για να σας καθοδηγήσει σε κάθε βήμα της προετοιμασίας σας.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild size="lg" className="bg-white text-[#004a99] hover:bg-blue-50 font-bold px-10 h-14 rounded-none">
                <Link href="/contact">Επικοινωνία</Link>
              </Button>
              <Button asChild size="lg" className="bg-transparent text-white border-2 border-white hover:bg-white/10 font-bold px-10 h-14 rounded-none">
                <Link href="/points-calculator">Υπολογισμός Μορίων</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
