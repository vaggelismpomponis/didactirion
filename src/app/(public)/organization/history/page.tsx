import { createPageMetadata } from "@/lib/seo";
import { ArrowRight, History, Target, Lightbulb, Zap } from "lucide-react";

export const metadata = createPageMetadata({
  title: "Ιστορία & Φιλοσοφία",
  description:
    "Η ιστορία, η φιλοσοφία και το όραμα του Διδακτήριον από το 2009: σύγχρονη εκπαίδευση και ολιγομελή τμήματα στις Αχαρνές.",
  path: "/organization/history",
});
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const timeline = [
  {
    year: "2009",
    title: "Η Αρχή",
    desc: "Έναρξη λειτουργίας με όραμα μια νέα, σύγχρονη λογική στην εκπαιδευτική διαδικασία.",
    icon: Lightbulb,
  },
  {
    year: "2015",
    title: "Καθιέρωση",
    desc: "Αναγνώριση ως κορυφαίος εκπαιδευτικός οργανισμός στις Αχαρνές και τις γύρω περιοχές.",
    icon: Target,
  },
  {
    year: "2020",
    title: "Ψηφιακός Μετασχηματισμός",
    desc: "Πλήρης ενσωμάτωση e-class και υβριδικών μοντέλων διδασκαλίας.",
    icon: Zap,
  },
  {
    year: "2024",
    title: "Νέα Εποχή",
    desc: "Λανσάρισμα του νέου StudyBot και αναβάθμιση όλων των ψηφιακών μας υποδομών.",
    icon: ArrowRight,
  },
];

const pillars = [
  { title: "Ολιγομελή Τμήματα", desc: "Μόνο 4-5 μαθητές ανά τμήμα για μέγιστη απόδοση." },
  { title: "Εξατομικευμένη Προσέγγιση", desc: "Κάθε παιδί είναι μοναδικό και έτσι το αντιμετωπίζουμε." },
  { title: "Ποιότητα Διδασκαλίας", desc: "Έμπειροι καθηγητές με αγάπη για το αντικείμενό τους." },
  { title: "Καινοτομία", desc: "Σύγχρονα ψηφιακά εργαλεία και StudyBot AI." },
];

export default function HistoryPage() {
  return (
    <div className="flex flex-col">
      {/* ── Hero ── */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-white/5 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-white/5 blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10 text-white">

          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tight mb-5 max-w-3xl leading-tight">
            Το Φροντιστήριο
          </h1>
          <p className="text-xl text-blue-100/80 max-w-2xl leading-relaxed">
            Από το 2009, το Διδακτήριον αποτελεί έναν χώρο εκπαιδευτικής καινοτομίας και αριστείας,
            κερδίζοντας την εμπιστοσύνη της κοινότητας με μια «νέα λογική» στην εκπαίδευση.
          </p>
        </div>
      </section>

      {/* ── Philosophy Section ── */}
      <section className="container mx-auto px-4 py-12 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <div className="relative order-2 lg:order-1">
            <div className="absolute inset-6 bg-primary/20 rounded-3xl blur-2xl" />
            <div className="relative rounded-3xl overflow-hidden border border-white shadow-2xl aspect-video">
              <Image
                src="/philosophy.png"
                alt="Our philosophy"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Text */}
          <div className="space-y-8 order-1 lg:order-2">
            <div>

              <h2 className="text-3xl md:text-4xl font-black text-slate-900 mt-4 leading-tight">
                Ο πυρήνας της<br />
                <span className="text-gradient">εκπαιδευτικής μας αποστολής</span>
              </h2>
            </div>

            <p className="text-lg text-slate-600 leading-relaxed">
              Στο <strong className="text-primary">Διδακτήριον</strong>, ο πυρήνας της φιλοσοφίας μας είναι η{" "}
              <strong className="text-primary">μοναδικότητα του κάθε ατόμου</strong>, και ειδικότερα του κάθε παιδιού.
            </p>
            <p className="text-slate-500 leading-relaxed">
              Αυτή η αρχή καθοδηγεί κάθε μας πράξη, σκέψη και πρόγραμμα σπουδών, διασφαλίζοντας ότι κάθε μαθητής
              λαμβάνει την προσοχή και την καθοδήγηση που του αξίζει.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {pillars.map((item, i) => (
                <div key={i} className="p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-primary/30 hover:bg-primary/5 transition-all group">
                  <h4 className="font-bold text-slate-900 mb-1.5 group-hover:text-primary transition-colors">{item.title}</h4>
                  <p className="text-sm text-slate-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Timeline ── */}
      <section className="bg-slate-950 py-24 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">

            <h2 className="text-3xl md:text-5xl font-black text-white mb-4">Η Διαδρομή μας</h2>
            <p className="text-slate-400">Σταθμοί στην πορεία μας προς την εκπαιδευτική αριστεία.</p>
          </div>

          <div className="relative max-w-3xl mx-auto">
            {/* Vertical line – aligned left on mobile, centered on md+ */}
            <div className="absolute left-5 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/60 via-primary/30 to-transparent" />

            <div className="space-y-10">
              {timeline.map((item, i) => (
                <div
                  key={i}
                  className={`relative flex gap-6 md:gap-0 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
                >
                  {/* Dot */}
                  <div className="absolute left-5 md:left-1/2 -translate-x-1/2 z-10">
                    <div className="w-10 h-10 rounded-full bg-slate-900 border-2 border-primary flex items-center justify-center text-primary shadow-lg shadow-primary/20">
                      <item.icon className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Card */}
                  <div className={`ml-16 md:ml-0 md:w-[calc(50%-2.5rem)] ${i % 2 === 0 ? "md:mr-auto md:pr-8" : "md:ml-auto md:pl-8"}`}>
                    <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-6 backdrop-blur hover:border-primary/30 transition-colors">
                      <div className="text-blue-400 font-black text-2xl mb-1">{item.year}</div>
                      <h3 className="text-xl font-black text-white mb-2">{item.title}</h3>
                      <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="container mx-auto px-4 py-20">
        <div className="relative overflow-hidden rounded-3xl">
          <div className="absolute inset-0 hero-gradient" />
          <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-white/10 pointer-events-none" />
          <div className="relative p-6 sm:p-10 md:p-14 text-white flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-black">Γνωρίστε την ομάδα μας</h2>
              <p className="text-blue-100/80 max-w-xl leading-relaxed">
                Οι καθηγητές μας είναι η καρδιά του Διδακτήριον. Ανακαλύψτε το πάθος και την εξειδίκευσή τους.
              </p>
            </div>
            <Button
              asChild
              size="lg"
              className="bg-white text-primary hover:bg-white/90 font-bold px-8 h-13 shadow-xl shadow-black/20 shrink-0"
              style={{ height: "3.25rem" }}
            >
              <Link href="/organization/teachers" className="flex items-center gap-2">
                Οι Καθηγητές μας <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
