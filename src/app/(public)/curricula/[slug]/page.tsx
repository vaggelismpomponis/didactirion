import { CheckCircle2, GraduationCap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { notFound } from "next/navigation";

const curriculaData: Record<string, any> = {
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
    details: "Το πρόγραμμα σπουδών για το Γυμνάσιο επικεντρώνεται στην εμπέδωση των βασικών εννοιών στα Μαθηματικά, τη Γλώσσα και τις Φυσικές Επιστήμες.",
    subjects: [
      { grade: "Α' Γυμνασίου", items: ["Νεοελληνική Γλώσσα (2 ώρες)", "Αρχαία Ελληνικά (2 ώρες)", "Μαθηματικά (2 ώρες)"] },
      { grade: "Β' Γυμνασίου", items: ["Νεοελληνική Γλώσσα (2 ώρες)", "Αρχαία Ελληνικά (2 ώρες)", "Μαθηματικά (2 ώρες)", "Φυσική (1 ώρα)"] },
      { grade: "Γ' Γυμνασίου", items: ["Νεοελληνική Γλώσσα (2 ώρες)", "Αρχαία Ελληνικά (2 ώρες)", "Μαθηματικά (2 ώρες)", "Φυσική (1 ώρα)", "Χημεία (1 ώρα)"] },
    ]
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
    ]
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
    details: "Παρέχουμε ολοκληρωμένη στήριξη στους μαθητές των ΕΠΑΛ, καλύπτοντας τόσο τα μαθήματα γενικής παιδείας όσο και τα μαθήματα ειδικότητας.",
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
    details: "Για τους αποφοίτους που επιθυμούν να ξαναδώσουν εξετάσεις, προσφέρουμε ένα εντατικό και στοχευμένο πρόγραμμα.",
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
    details: "Η εισαγωγή στα Πρότυπα σχολεία απαιτεί ιδιαίτερη προετοιμασία. Το πρόγραμμά μας βοηθά τους μαθητές της ΣΤ' Δημοτικού και της Γ' Γυμνασίου να αναπτύξουν τις απαραίτητες δεξιότητες.",
  },
};

export default async function CurriculumPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = curriculaData[slug];

  if (!data) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-16 pb-16">
      {/* Hero Section */}
      <section className="relative h-[280px] sm:h-[340px] md:h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[#004a99]/80 z-10" />
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${data.image}')` }}
        />
        
        <div className="container mx-auto px-4 relative z-20 text-white text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 tracking-tight animate-in fade-in slide-in-from-bottom-8 duration-700">
            {data.title}
          </h1>
          <p className="text-xl text-blue-50 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
            {data.description}
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          <div className="lg:col-span-2 space-y-8 order-1">
            <div className="prose prose-slate max-w-none">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Πληροφορίες Προγράμματος</h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                {data.details}
              </p>
            </div>

            {data.subjects && (
              <div className="mt-12 space-y-8">
                <h3 className="text-2xl font-bold text-slate-900">Πρόγραμμα Μαθημάτων</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {data.subjects.map((group: any, i: number) => (
                    <div key={ group.grade} className="bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-sm">
                      <h4 className="font-bold text-[#004a99] mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 bg-[#004a99] rounded-full" />
                        {group.grade}
                      </h4>
                      <ul className="space-y-2">
                        {group.items.map((item: string, j: number) => (
                          <li key={j} className="text-slate-600 text-sm flex items-center gap-2">
                            <ArrowRight className="w-3 h-3 text-slate-400" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-8">
              {data.features.map((feature: string, i: number) => (
                <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
                  <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" />
                  <span className="font-bold text-slate-900">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6 order-2">
            <div className="bg-[#004a99] p-8 rounded-3xl text-white shadow-xl">
              <GraduationCap className="w-12 h-12 mb-6" />
              <h3 className="text-2xl font-bold mb-4">Ενδιαφέρεστε;</h3>
              <p className="text-blue-100 mb-8">
                Κλείστε ένα ραντεβού για να συζητήσουμε τις ανάγκες σας και να βρούμε το ιδανικό πρόγραμμα.
              </p>
              <Button asChild className="w-full bg-white text-[#004a99] hover:bg-blue-50 font-bold h-12">
                <Link href="/contact">Επικοινωνία</Link>
              </Button>
            </div>

            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
              <h4 className="font-bold text-slate-900 mb-4">Άλλα Προγράμματα</h4>
              <ul className="space-y-3">
                {Object.keys(curriculaData)
                  .filter(slugItem => slugItem !== slug)
                  .map(slug => (
                    <li key={slug}>
                      <Link 
                        href={`/curricula/${slug}`}
                        className="flex items-center justify-between text-slate-600 hover:text-[#004a99] font-medium transition-colors p-2 rounded-lg hover:bg-white"
                      >
                        {curriculaData[slug].title}
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
