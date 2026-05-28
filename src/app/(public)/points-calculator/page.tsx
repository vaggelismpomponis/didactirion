"use client";

import * as React from "react";
import Link from "next/link";
import { Calculator, Info, RotateCcw, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Orientation = "humanities" | "sciences" | "health" | "economics";

const orientations = [
  { id: "humanities", name: "Ανθρωπιστικών Σπουδών (1ο Πεδίο)" },
  { id: "sciences", name: "Θετικών Σπουδών (2ο Πεδίο)" },
  { id: "health", name: "Σπουδών Υγείας (3ο Πεδίο)" },
  { id: "economics", name: "Σπουδών Οικονομίας & Πληροφορικής (4ο Πεδίο)" },
];

const subjectsByOrientation: Record<Orientation, string[]> = {
  humanities: ["Νεοελληνική Γλώσσα & Λογοτεχνία", "Αρχαία Ελληνικά", "Ιστορία", "Λατινικά"],
  sciences: ["Νεοελληνική Γλώσσα & Λογοτεχνία", "Φυσική", "Χημεία", "Μαθηματικά"],
  health: ["Νεοελληνική Γλώσσα & Λογοτεχνία", "Φυσική", "Χημεία", "Βιολογία"],
  economics: ["Νεοελληνική Γλώσσα & Λογοτεχνία", "Μαθηματικά", "Πληροφορική (ΑΕΠΠ)", "Οικονομία (ΑΟΘ)"],
};

export default function PointsCalculator() {
  const [orientation, setOrientation] = React.useState<Orientation>("humanities");
  const [grades, setGrades] = React.useState<Record<string, string>>({});
  const [totalPoints, setTotalPoints] = React.useState<number | null>(null);

  const activeOrientation = orientations.find(o => o.id === orientation)!;

  const handleGradeChange = (subject: string, value: string) => {
    const num = parseFloat(value);
    if (value === "" || (!isNaN(num) && num >= 0 && num <= 20)) {
      setGrades((prev) => ({ ...prev, [subject]: value }));
    }
  };

  const calculatePoints = () => {
    const subjects = subjectsByOrientation[orientation];
    let sum = 0;
    subjects.forEach((subject) => {
      const grade = parseFloat(grades[subject] || "0");
      sum += grade * 2.5 * 100;
    });
    setTotalPoints(Math.round(sum));
  };

  const reset = () => {
    setGrades({});
    setTotalPoints(null);
  };

  const completionCount = subjectsByOrientation[orientation].filter(s => grades[s] && grades[s] !== "").length;
  const totalSubjects = subjectsByOrientation[orientation].length;
  const completionPct = Math.round((completionCount / totalSubjects) * 100);

  return (
    <div className="flex flex-col">
      {/* ── Hero ── */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/5 blur-3xl pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10 text-white text-center flex flex-col items-center justify-center">

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-3 leading-tight mx-auto">
            Υπολογισμός Μορίων
          </h1>
          <p className="text-lg text-blue-100/80 max-w-xl leading-relaxed mx-auto">
            Υπολογίστε τα μόρια σας για τις Πανελλαδικές Εξετάσεις εύκολα και γρήγορα.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10 pb-20 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">

          {/* ── Calculator Main ── */}
          <div className="lg:col-span-2 space-y-6 order-2 lg:order-1">

            {/* Step 1 — Orientation */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full hero-gradient flex items-center justify-center text-white font-black text-sm shrink-0">1</div>
                <div>
                  <h2 className="font-black text-slate-900">Επιλογή Προσανατολισμού</h2>
                  <p className="text-xs text-slate-400">Επιλέξτε το πεδίο σπουδών σας</p>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {orientations.map((o) => (
                    <button
                      key={o.id}
                      onClick={() => {
                        setOrientation(o.id as Orientation);
                        setTotalPoints(null);
                      }}
                      className={`relative p-4 rounded-2xl border-2 text-left transition-all ${orientation === o.id
                        ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                        : "border-slate-100 hover:border-slate-200 bg-slate-50/50"
                        }`}
                    >

                      <p className={`text-xs font-bold ${orientation === o.id ? "text-primary" : "text-slate-500"}`}>
                        {o.name}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 2 — Grades */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full hero-gradient flex items-center justify-center text-white font-black text-sm shrink-0">2</div>
                  <div>
                    <h2 className="font-black text-slate-900">Βαθμολογίες</h2>
                    <p className="text-xs text-slate-400">Εισάγετε βαθμό 0–20 για κάθε μάθημα</p>
                  </div>
                </div>
                {/* Progress */}
                <div className="text-right hidden sm:block">
                  <p className="text-xs text-slate-400">{completionCount}/{totalSubjects} μαθήματα</p>
                  <div className="w-20 h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${completionPct}%` }} />
                  </div>
                </div>
              </div>
              <div className="p-6 space-y-4">
                {subjectsByOrientation[orientation].map((subject, idx) => (
                  <div key={subject} className="flex items-center gap-4">
                    <div className="flex-1">
                      <Label htmlFor={`subject-${idx}`} className="text-sm font-semibold text-slate-700">{subject}</Label>
                    </div>
                    <div className="w-28 shrink-0">
                      <Input
                        id={`subject-${idx}`}
                        type="number"
                        min="0"
                        max="20"
                        step="0.1"
                        placeholder="0 – 20"
                        value={grades[subject] || ""}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleGradeChange(subject, e.target.value)}
                        className="h-11 rounded-xl text-center font-bold border-slate-200 focus:border-primary bg-slate-50 focus:bg-white transition-colors"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <Button
                onClick={calculatePoints}
                className="flex-1 h-13 text-base font-bold hero-gradient border-0 shadow-xl shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5 transition-all"
                style={{ height: "3.25rem" }}
              >
                <Calculator className="w-5 h-5 mr-2" /> Υπολογισμός
              </Button>
              <Button
                variant="outline"
                onClick={reset}
                className="h-13 w-13 border-slate-200 hover:border-primary hover:text-primary"
                style={{ height: "3.25rem", width: "3.25rem" }}
                title="Επαναφορά"
              >
                <RotateCcw className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* ── Sidebar ── */}
          <div className="space-y-5 lg:sticky lg:top-24 lg:self-start order-1 lg:order-2">
            {/* Result card */}
            <div className="relative overflow-hidden rounded-3xl text-slate-900 bg-[#F9F9F9] border border-slate-100 shadow-sm">
              <div className="p-7">
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-1">
                  Συνολικά Μόρια
                </p>
                <div className="text-6xl font-black mb-2 tracking-tight text-slate-900">
                  {totalPoints !== null ? totalPoints.toLocaleString("el-GR") : "—"}
                </div>
                {totalPoints !== null && (
                  <div className="mt-3 flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-slate-900 rounded-full transition-all duration-700"
                        style={{ width: `${Math.min(100, (totalPoints / 20000) * 100)}%` }}
                      />
                    </div>
                    <p className="text-slate-400 text-xs">{((totalPoints / 20000) * 100).toFixed(0)}%</p>
                  </div>
                )}
                <p className="text-slate-400 text-[11px] mt-4 leading-relaxed">
                  * Ενδεικτικός υπολογισμός βάσει γενικών συντελεστών.
                </p>
              </div>
            </div>

            <Button asChild variant="link" className="w-full text-xs text-slate-500 hover:text-primary h-auto py-0">
              <a 
                href="https://www.oefe.gr/el/normal/credits-calculation_el.aspx" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 justify-center"
              >
                Ακριβής υπολογισμός στο σύστημα της ΟΕΦΕ <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </Button>

            {/* Notice */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex gap-3">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-amber-800 mb-1">Σημαντική σημείωση</p>
                <p className="text-xs text-amber-700 leading-relaxed">
                  Ο τελικός αριθμός μπορεί να διαφέρει ανάλογα με τους ειδικούς συντελεστές κάθε σχολής. Συμβουλευτείτε το μηχανογραφικό σας δελτίο.
                </p>
              </div>
            </div>

            {/* Help card */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-3">
              <h4 className="font-black text-slate-900 text-sm">Χρειάζεστε βοήθεια;</h4>
              <p className="text-sm text-slate-500 leading-relaxed">
                Οι σύμβουλοί μας μπορούν να σας βοηθήσουν με τον επαγγελματικό προσανατολισμό και τη συμπλήρωση του μηχανογραφικού.
              </p>
              <Button asChild className="w-full font-bold border-primary text-primary hover:bg-primary hover:text-white" variant="outline">
                <Link href="/contact" className="flex items-center gap-2">
                  Επικοινωνήστε μαζί μας <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
