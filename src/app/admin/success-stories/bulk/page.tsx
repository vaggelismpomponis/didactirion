"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FileSpreadsheet,
  ArrowLeft,
  Loader2,
  CheckCircle,
  AlertTriangle,
  Save,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ParsedStory {
  name: string;
  university: string;
  faculty: string;
  year: string;
  isValid: boolean;
  error?: string;
}

export default function BulkSuccessStoriesPage() {
  const router = useRouter();
  const [rawText, setRawText] = useState("");
  const [parsedStories, setParsedStories] = useState<ParsedStory[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!rawText.trim()) {
      setParsedStories([]);
      return;
    }

    // Split text into lines, filter out empty lines
    const lines = rawText.split(/\r?\n/).filter((line) => line.trim().length > 0);
    const results: ParsedStory[] = lines.map((line) => {
      // Detect separator: Tab-separated (copied from Excel) or Comma-separated
      let parts = line.split("\t");
      if (parts.length === 1) {
        parts = line.split(",");
      }

      // Trim all parts
      parts = parts.map((p) => p.trim());

      let name = "";
      let university = "";
      let faculty = "";
      let year = new Date().getFullYear().toString();

      if (parts.length >= 4) {
        // Name, University, Faculty, Year
        name = parts[0] || "";
        university = parts[1] || "";
        faculty = parts[2] || "";
        year = parts[3] || year;
      } else if (parts.length === 3) {
        // Name, University, Year (Automatic detection)
        name = parts[0] || "";
        university = parts[1] || "";
        year = parts[2] || year;
      } else if (parts.length === 2) {
        // Name, University
        name = parts[0] || "";
        university = parts[1] || "";
      } else {
        name = parts[0] || "";
      }

      // Basic validation
      let isValid = true;
      let error = "";

      if (!name) {
        isValid = false;
        error = "Λείπει το ονοματεπώνυμο.";
      } else if (!university) {
        isValid = false;
        error = "Λείπει η σχολή/πανεπιστήμιο.";
      } else {
        const parsedYear = parseInt(year);
        if (isNaN(parsedYear) || parsedYear < 1998 || parsedYear > 2100) {
          isValid = false;
          error = "Μη έγκυρο έτος (1998 - 2100).";
        }
      }

      return {
        name,
        university,
        faculty,
        year,
        isValid,
        error,
      };
    });

    setParsedStories(results);
  }, [rawText]);

  async function handleImport() {
    const validStories = parsedStories.filter((s) => s.isValid);
    if (validStories.length === 0) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/success-stories/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stories: validStories }),
      });

      if (!response.ok) {
        throw new Error("Bulk save request failed");
      }

      router.push("/admin/success-stories");
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Προέκυψε σφάλμα κατά τη μαζική εισαγωγή.");
    } finally {
      setIsLoading(false);
    }
  }

  const totalCount = parsedStories.length;
  const validCount = parsedStories.filter((s) => s.isValid).length;
  const invalidCount = totalCount - validCount;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="w-9 h-9 rounded-xl border border-slate-100 bg-white hover:bg-slate-50 text-slate-500 shrink-0 shadow-sm"
          >
            <Link href="/admin/success-stories">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-xl font-heading font-black text-slate-900">Μαζική Εισαγωγή Επιτυχόντων</h1>
            <p className="text-[13px] text-slate-500 mt-0.5">
              Αντιγράψτε και επικολλήστε ολόκληρες σειρές απευθείας από το Excel ή το Google Sheets.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Paste Area & Guide */}
        <div className="lg:col-span-7 space-y-6">
          {/* Guide Card */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50/30 border border-emerald-100 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-emerald-800">
              <FileSpreadsheet className="w-5 h-5 shrink-0" />
              <h3 className="font-heading font-bold text-[14px]">Οδηγίες Αντιγραφής από Excel / Sheets</h3>
            </div>
            <p className="text-[13px] text-emerald-900/80 leading-relaxed">
              Επιλέξτε και αντιγράψτε τις στήλες από το αρχείο σας και επικολλήστε τις στο παρακάτω πλαίσιο.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[12px] pt-1">
              <div className="bg-white/80 rounded-xl p-3 border border-emerald-100/50">
                <span className="font-bold text-emerald-800 block mb-1">📋 Δομή 4 Στηλών (Πλήρης)</span>
                <span className="text-slate-500 font-mono block text-[11px] leading-relaxed">
                  [Ονοματεπώνυμο] [Σχολή] [Τμήμα] [Έτος]<br />
                  <span className="text-slate-400 font-sans">π.χ. Νίκος Παππάς [tab] ΕΜΠ [tab] Ηλεκτρολόγων [tab] 2026</span>
                </span>
              </div>
              <div className="bg-white/80 rounded-xl p-3 border border-emerald-100/50">
                <span className="font-bold text-emerald-800 block mb-1">📋 Δομή 3 Στηλών (Γρήγορη)</span>
                <span className="text-slate-500 font-mono block text-[11px] leading-relaxed">
                  [Ονοματεπώνυμο] [Σχολή] [Έτος]<br />
                  <span className="text-slate-400 font-sans">π.χ. Μαρία Αντωνίου [tab] ΕΚΠΑ [tab] 2026</span>
                </span>
              </div>
            </div>
          </div>

          {/* Text Area Card */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
            <h3 className="font-heading font-bold text-[14px] text-slate-800">Πεδίο Επικόλλησης</h3>
            <textarea
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Επικολλήστε εδώ τις γραμμές σας..."
              className="w-full min-h-[280px] p-4 text-[13px] font-mono rounded-xl border border-slate-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Live Preview & Actions */}
        <div className="lg:col-span-5 space-y-6">
          {/* Actions & Status */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4 sticky top-6">
            <h3 className="font-heading font-bold text-[13px] text-slate-700 border-b border-slate-50 pb-3">
              Σύνοψη Εισαγωγής
            </h3>

            <div className="grid grid-cols-3 gap-2.5 text-center">
              <div className="bg-slate-50 rounded-xl py-3 border border-slate-100">
                <span className="text-[20px] font-black text-slate-700 block leading-tight">{totalCount}</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Σειρές</span>
              </div>
              <div className="bg-emerald-50 rounded-xl py-3 border border-emerald-100">
                <span className="text-[20px] font-black text-emerald-600 block leading-tight">{validCount}</span>
                <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">Έγκυρες</span>
              </div>
              <div className={`rounded-xl py-3 border ${invalidCount > 0 ? "bg-amber-50 border-amber-100 text-amber-600" : "bg-slate-50 border-slate-100 text-slate-400"}`}>
                <span className="text-[20px] font-black block leading-tight">{invalidCount}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider">Σφάλματα</span>
              </div>
            </div>

            {totalCount > 0 && (
              <div className="pt-2">
                <Button
                  onClick={handleImport}
                  disabled={isLoading || validCount === 0}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white h-11 font-bold rounded-xl shadow-lg shadow-emerald-200 transition-all gap-2"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Εισαγωγή {validCount} Επιτυχόντων
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Parsed Results Live Grid */}
      {totalCount > 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between">
            <h3 className="font-heading font-bold text-[14px] text-slate-800 flex items-center gap-2">
              <span>Προεπισκόπηση Δεδομένων ({totalCount} στοιχεία)</span>
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/60 border-b border-slate-100">
                  <th className="p-4 font-heading font-bold text-slate-500 text-[11px] uppercase tracking-wider pl-6 w-12">Κανόνας</th>
                  <th className="p-4 font-heading font-bold text-slate-500 text-[11px] uppercase tracking-wider">Ονοματεπώνυμο</th>
                  <th className="p-4 font-heading font-bold text-slate-500 text-[11px] uppercase tracking-wider">Πανεπιστήμιο / Σχολή</th>
                  <th className="p-4 font-heading font-bold text-slate-500 text-[11px] uppercase tracking-wider">Τμήμα</th>
                  <th className="p-4 font-heading font-bold text-slate-500 text-[11px] uppercase tracking-wider w-24">Έτος</th>
                  <th className="p-4 font-heading font-bold text-slate-500 text-[11px] uppercase tracking-wider pr-6">Κατάσταση</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {parsedStories.map((story, idx) => (
                  <tr key={idx} className={`hover:bg-slate-50/40 transition-colors ${!story.isValid ? "bg-amber-50/10" : ""}`}>
                    <td className="p-4 pl-6 text-[12px] font-mono text-slate-400">#{idx + 1}</td>
                    <td className="p-4 text-[13px] font-bold text-slate-800">{story.name || <span className="text-amber-500 font-normal italic">Λείπει</span>}</td>
                    <td className="p-4 text-[13px] text-slate-600 font-medium">{story.university || <span className="text-amber-500 font-normal italic">Λείπει</span>}</td>
                    <td className="p-4 text-[13px] text-slate-500">{story.faculty || <span className="text-slate-300 italic">-</span>}</td>
                    <td className="p-4">
                      <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-xl bg-slate-50 text-slate-700 text-[11px] font-black border border-slate-200">
                        {story.year}
                      </span>
                    </td>
                    <td className="p-4 pr-6">
                      {story.isValid ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                          <CheckCircle className="w-3.5 h-3.5" /> Έτοιμο
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-100">
                          <AlertTriangle className="w-3.5 h-3.5" /> {story.error}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
