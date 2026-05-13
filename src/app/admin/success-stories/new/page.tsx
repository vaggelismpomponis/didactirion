import { SuccessStoryForm } from "@/components/admin/SuccessStoryForm";

export default function NewSuccessStoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Προσθήκη Επιτυχόντα</h1>
        <p className="text-sm text-slate-500">Συμπληρώστε τα στοιχεία του επιτυχόντα μαθητή.</p>
      </div>
      <SuccessStoryForm />
    </div>
  );
}
