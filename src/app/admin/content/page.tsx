"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Save, Eye, EyeOff, RefreshCw, CheckCircle2, AlertCircle, Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

/* ─── Page Registry ─────────────────────────────────────────────────────── */
const PAGE_REGISTRY: Array<{
  key: string;
  label: string;
  route: string;
  schema: FieldSchema[];
}> = [
  {
    key: "home",
    label: "Αρχική Σελίδα",
    route: "/",
    schema: [
      { id: "hero_title", label: "Τίτλος Hero (Fallback)", type: "text" },
      { id: "hero_subtitle", label: "Υπότιτλος Hero (Fallback)", type: "textarea" },
      { id: "stats_years", label: "Στατιστικά — Χρόνια Εμπειρίας", type: "text" },
      { id: "stats_students", label: "Στατιστικά — Απόφοιτοι", type: "text" },
      { id: "stats_success", label: "Στατιστικά — Ποσοστό Επιτυχίας", type: "text" },
      { id: "stats_class_size", label: "Στατιστικά — Μαθητές ανά Τμήμα", type: "text" },
      { id: "why_title", label: '"Γιατί Διδακτήριον" — Τίτλος', type: "text" },
      { id: "why_description", label: '"Γιατί Διδακτήριον" — Κείμενο', type: "textarea" },
      { id: "cta_title", label: "CTA — Τίτλος", type: "text" },
      { id: "cta_subtitle", label: "CTA — Υπότιτλος", type: "textarea" },
    ],
  },
  {
    key: "history",
    label: "Ιστορία & Φιλοσοφία",
    route: "/organization/history",
    schema: [
      { id: "hero_title", label: "Hero — Τίτλος", type: "text" },
      { id: "hero_subtitle", label: "Hero — Υπότιτλος", type: "textarea" },
      { id: "philosophy_heading", label: "Φιλοσοφία — Τίτλος", type: "text" },
      { id: "philosophy_p1", label: "Φιλοσοφία — Παράγραφος 1", type: "textarea" },
      { id: "philosophy_p2", label: "Φιλοσοφία — Παράγραφος 2", type: "textarea" },
      { id: "pillars", label: "Πυλώνες (4 κάρτες)", type: "repeatable", itemFields: ["title", "desc"] },
      { id: "timeline", label: "Χρονολόγιο", type: "repeatable", itemFields: ["year", "title", "desc"] },
      { id: "cta_title", label: "CTA — Τίτλος", type: "text" },
      { id: "cta_subtitle", label: "CTA — Κείμενο", type: "textarea" },
    ],
  },
  {
    key: "curricula/junior-high",
    label: "Γυμνάσιο",
    route: "/curricula/junior-high",
    schema: curriculaSchema(),
  },
  {
    key: "curricula/high-school",
    label: "Λύκειο",
    route: "/curricula/high-school",
    schema: curriculaSchema(),
  },
  {
    key: "curricula/epal",
    label: "ΕΠΑΛ",
    route: "/curricula/epal",
    schema: curriculaSchema(),
  },
  {
    key: "curricula/alumni",
    label: "Απόφοιτοι",
    route: "/curricula/alumni",
    schema: curriculaSchema(),
  },
  {
    key: "curricula/model-schools",
    label: "Πρότυπα Σχολεία",
    route: "/curricula/model-schools",
    schema: curriculaSchema(),
  },
  {
    key: "exams/panhellenic",
    label: "Πανελλαδικές",
    route: "/exams/panhellenic",
    schema: examsSchema(),
  },
  {
    key: "exams/question-bank",
    label: "Τράπεζα Θεμάτων",
    route: "/exams/question-bank",
    schema: examsSchema(),
  },
  {
    key: "exams/oefe",
    label: "Θέματα ΟΕΦΕ",
    route: "/exams/oefe",
    schema: examsSchema(),
  },
  {
    key: "exams/career-guide",
    label: "Οδηγός Σταδιοδρομίας",
    route: "/exams/career-guide",
    schema: examsSchema(),
  },
];

type FieldSchema =
  | { id: string; label: string; type: "text" | "textarea" }
  | { id: string; label: string; type: "repeatable"; itemFields: string[] };

function curriculaSchema(): FieldSchema[] {
  return [
    { id: "title", label: "Τίτλος", type: "text" },
    { id: "description", label: "Περιγραφή", type: "textarea" },
    { id: "details", label: "Λεπτομέρειες", type: "textarea" },
    { id: "features", label: "Χαρακτηριστικά", type: "repeatable", itemFields: ["text"] },
  ];
}

function examsSchema(): FieldSchema[] {
  return [
    { id: "title", label: "Τίτλος", type: "text" },
    { id: "description", label: "Περιγραφή", type: "textarea" },
    { id: "content", label: "Κύριο κείμενο", type: "textarea" },
    { id: "sections", label: "Ενότητες", type: "repeatable", itemFields: ["title", "text"] },
  ];
}

/* ─── Status banner ─────────────────────────────────────────────────────── */
type Status = { type: "idle" | "saving" | "saved" | "error"; msg?: string };

/* ─── Main Component ─────────────────────────────────────────────────────── */
export default function AdminContentPage() {
  const [selectedKey, setSelectedKey] = React.useState(PAGE_REGISTRY[0].key);
  const [formValues, setFormValues] = React.useState<Record<string, any>>({});
  const [loading, setLoading] = React.useState(false);
  const [status, setStatus] = React.useState<Status>({ type: "idle" });
  const [previewVisible, setPreviewVisible] = React.useState(true);
  const iframeRef = React.useRef<HTMLIFrameElement>(null);

  const page = PAGE_REGISTRY.find((p) => p.key === selectedKey)!;

  /* Load content from API when page changes */
  React.useEffect(() => {
    setLoading(true);
    setFormValues({});
    fetch(`/api/admin/content?pageKey=${encodeURIComponent(selectedKey)}`)
      .then((r) => r.json())
      .then(({ content }) => {
        if (content) setFormValues(content);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedKey]);

  /* Push updated content to iframe preview via postMessage */
  const sendPreview = React.useCallback(
    (vals: Record<string, any>) => {
      iframeRef.current?.contentWindow?.postMessage(
        { type: "DIDACTIRION_PREVIEW", pageKey: selectedKey, content: vals },
        "*"
      );
    },
    [selectedKey]
  );

  const handleChange = (id: string, value: any) => {
    setFormValues((prev) => {
      const next = { ...prev, [id]: value };
      sendPreview(next);
      return next;
    });
  };

  const handleSave = async () => {
    setStatus({ type: "saving" });
    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageKey: selectedKey, content: formValues }),
      });
      if (!res.ok) throw new Error("API error");
      setStatus({ type: "saved" });
      setTimeout(() => setStatus({ type: "idle" }), 3000);
    } catch {
      setStatus({ type: "error", msg: "Αποτυχία αποθήκευσης. Δοκιμάστε ξανά." });
      setTimeout(() => setStatus({ type: "idle" }), 4000);
    }
  };

  const reloadIframe = () => {
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
    }
  };

  return (
    <div className="flex flex-col h-full gap-0 -m-4 md:-m-6">
      {/* ── Toolbar ── */}
      <div className="flex items-center justify-between px-4 md:px-6 py-3 bg-white border-b border-slate-100 shrink-0">
        <div className="flex items-center gap-3">
          <h1 className="text-base font-black text-slate-900 font-heading">Διαχείρηση Περιεχομένου</h1>
          <span className="hidden sm:inline text-slate-300">|</span>
          {/* Page selector */}
          <div className="relative hidden sm:block">
            <select
              id="page-selector"
              value={selectedKey}
              onChange={(e) => setSelectedKey(e.target.value)}
              className="appearance-none bg-slate-50 border border-slate-200 text-slate-700 text-sm font-medium rounded-xl pl-3 pr-8 py-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              {PAGE_REGISTRY.map((p) => (
                <option key={p.key} value={p.key}>
                  {p.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Status badge */}
          {status.type === "saved" && (
            <span className="flex items-center gap-1.5 text-emerald-600 text-sm font-semibold animate-in fade-in">
              <CheckCircle2 className="w-4 h-4" /> Αποθηκεύτηκε
            </span>
          )}
          {status.type === "error" && (
            <span className="flex items-center gap-1.5 text-red-500 text-sm font-semibold animate-in fade-in">
              <AlertCircle className="w-4 h-4" /> {status.msg}
            </span>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPreviewVisible((v) => !v)}
            className="text-slate-500 hover:text-slate-900"
          >
            {previewVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span className="hidden sm:inline ml-1.5">{previewVisible ? "Απόκρυψη" : "Προεπισκόπηση"}</span>
          </Button>

          <Button
            size="sm"
            onClick={handleSave}
            disabled={status.type === "saving"}
            className="bg-primary hover:bg-primary/90 text-white font-bold gap-2"
          >
            {status.type === "saving" ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Αποθήκευση
          </Button>
        </div>
      </div>

      {/* ── Mobile page selector ── */}
      <div className="sm:hidden px-4 py-2 bg-slate-50 border-b border-slate-100">
        <select
          value={selectedKey}
          onChange={(e) => setSelectedKey(e.target.value)}
          className="w-full bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/40"
        >
          {PAGE_REGISTRY.map((p) => (
            <option key={p.key} value={p.key}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      {/* ── Split Screen ── */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Left pane — Form */}
        <div
          className={cn(
            "flex flex-col bg-slate-50 border-r border-slate-100 overflow-y-auto transition-all duration-300",
            previewVisible ? "w-full lg:w-[42%]" : "w-full"
          )}
        >
          {loading ? (
            <div className="flex-1 flex items-center justify-center text-slate-400 gap-3">
              <RefreshCw className="w-5 h-5 animate-spin" />
              Φόρτωση...
            </div>
          ) : (
            <div className="p-4 md:p-6 space-y-4">
              <p className="text-xs text-slate-400 font-medium uppercase tracking-widest pb-1">
                {page.label} — Επεξεργασία
              </p>
              {page.schema.map((field) => (
                <FieldEditor
                  key={field.id}
                  field={field}
                  value={formValues[field.id]}
                  onChange={(val) => handleChange(field.id, val)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right pane — Preview iframe */}
        {previewVisible && (
          <div className="hidden lg:flex flex-col flex-1 bg-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2 bg-white border-b border-slate-100">
              <span className="text-xs text-slate-500 font-medium truncate">
                Προεπισκόπηση: <span className="text-slate-800 font-bold">{page.route}</span>
              </span>
              <button
                onClick={reloadIframe}
                className="text-slate-400 hover:text-slate-700 transition-colors ml-2 shrink-0"
                title="Ανανέωση"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden relative">
              <iframe
                ref={iframeRef}
                src={`${page.route}?preview=1`}
                className="w-full h-full border-none bg-white"
                title={`Preview of ${page.label}`}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Field Editor ───────────────────────────────────────────────────────── */
function FieldEditor({
  field,
  value,
  onChange,
}: {
  field: FieldSchema;
  value: any;
  onChange: (val: any) => void;
}) {
  const labelClass = "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5";
  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 placeholder:text-slate-300 transition-all resize-none";

  if (field.type === "text") {
    return (
      <div>
        <label className={labelClass}>{field.label}</label>
        <input
          type="text"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="(χρήση προεπιλογής)"
          className={inputClass}
        />
      </div>
    );
  }

  if (field.type === "textarea") {
    return (
      <div>
        <label className={labelClass}>{field.label}</label>
        <textarea
          rows={3}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="(χρήση προεπιλογής)"
          className={cn(inputClass, "min-h-[80px]")}
        />
      </div>
    );
  }

  if (field.type === "repeatable") {
    const items: Record<string, string>[] = Array.isArray(value) ? value : [];

    const update = (idx: number, key: string, val: string) => {
      const next = items.map((item, i) => (i === idx ? { ...item, [key]: val } : item));
      onChange(next);
    };

    const addItem = () => {
      const empty: Record<string, string> = {};
      field.itemFields.forEach((f) => (empty[f] = ""));
      onChange([...items, empty]);
    };

    const removeItem = (idx: number) => {
      onChange(items.filter((_, i) => i !== idx));
    };

    return (
      <div>
        <label className={labelClass}>{field.label}</label>
        <div className="space-y-3">
          {items.map((item, idx) => (
            <RepeatableItem
              key={idx}
              idx={idx}
              item={item}
              itemFields={field.itemFields}
              onUpdate={(key, val) => update(idx, key, val)}
              onRemove={() => removeItem(idx)}
              inputClass={inputClass}
            />
          ))}
          <button
            onClick={addItem}
            className="flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary/80 transition-colors py-1"
          >
            <Plus className="w-3.5 h-3.5" /> Προσθήκη
          </button>
        </div>
      </div>
    );
  }

  return null;
}

/* ─── Repeatable Item ────────────────────────────────────────────────────── */
function RepeatableItem({
  idx,
  item,
  itemFields,
  onUpdate,
  onRemove,
  inputClass,
}: {
  idx: number;
  item: Record<string, string>;
  itemFields: string[];
  onUpdate: (key: string, val: string) => void;
  onRemove: () => void;
  inputClass: string;
}) {
  const [open, setOpen] = React.useState(true);

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 bg-slate-50 border-b border-slate-100">
        <span className="text-xs font-bold text-slate-500">#{idx + 1}</span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setOpen((o) => !o)}
            className="text-slate-400 hover:text-slate-700 transition-colors p-1"
          >
            {open ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={onRemove}
            className="text-slate-300 hover:text-red-500 transition-colors p-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      {open && (
        <div className="p-3 space-y-2">
          {itemFields.map((f) => (
            <div key={f}>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                {f}
              </label>
              <input
                type="text"
                value={item[f] ?? ""}
                onChange={(e) => onUpdate(f, e.target.value)}
                placeholder={`(${f})`}
                className={inputClass}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
